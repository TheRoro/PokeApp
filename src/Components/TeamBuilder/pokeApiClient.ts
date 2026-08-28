export const POKE_API_BASE_URL = 'https://pokeapi.co/api/v2/';

export type NamedApiResource = {
  name: string;
  url: string;
};

export type NamedApiResourceList = {
  results: NamedApiResource[];
};

export interface PokeApiClient {
  get<T>(resource: string, signal?: AbortSignal): Promise<T>;
}

export class PokeApiRequestError extends Error {
  readonly status: number;

  constructor(resource: string, status: number) {
    super(`PokeAPI request failed (${status}): ${resource}`);
    this.name = 'PokeApiRequestError';
    this.status = status;
  }
}

function createAbortError(): Error {
  if (typeof DOMException !== 'undefined') {
    return new DOMException('The operation was aborted.', 'AbortError');
  }

  const error = new Error('The operation was aborted.');
  error.name = 'AbortError';
  return error;
}

export function throwIfAborted(signal?: AbortSignal): void {
  if (!signal?.aborted) return;
  if (signal.reason instanceof Error) throw signal.reason;
  throw createAbortError();
}

export function isAbortError(
  error: unknown,
  signal?: AbortSignal,
): boolean {
  return (
    signal?.aborted === true ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

export function createPokeApiClient(
  fetchImplementation: typeof fetch = fetch,
): PokeApiClient {
  return {
    async get<T>(resource: string, signal?: AbortSignal): Promise<T> {
      throwIfAborted(signal);
      const url = /^https?:\/\//.test(resource)
        ? resource
        : `${POKE_API_BASE_URL}${resource.replace(/^\/+/, '')}`;
      const response = await fetchImplementation(url, {
        headers: { Accept: 'application/json' },
        signal,
      });

      if (!response.ok) {
        throw new PokeApiRequestError(resource, response.status);
      }

      const data = (await response.json()) as T;
      throwIfAborted(signal);
      return data;
    },
  };
}

export const defaultPokeApiClient = createPokeApiClient();

export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
  signal?: AbortSignal,
): Promise<R[]> {
  throwIfAborted(signal);
  if (items.length === 0) return [];

  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const workerCount = Math.min(
    items.length,
    Math.max(1, Math.floor(concurrency)),
  );

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      throwIfAborted(signal);
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
      throwIfAborted(signal);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}
