export type VersionGroupDetail = {
  level_learned_at: number;
  move_learn_method: { name: string };
  version_group: { name: string; url: string };
};

export type PokemonMove = {
  move: { name: string; url: string };
  version_group_details: VersionGroupDetail[];
};

export type VersionGroup = {
  id: number;
  name: string;
};

export type LevelUpMove = {
  level: number;
  name: string;
  url: string;
};

function resourceId(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

export function getLevelUpVersionGroups(moves: PokemonMove[]): VersionGroup[] {
  const groups = new Map<string, VersionGroup>();

  moves.forEach(move => {
    move.version_group_details
      .filter(detail => detail.move_learn_method.name === 'level-up')
      .forEach(detail => {
        groups.set(detail.version_group.name, {
          id: resourceId(detail.version_group.url),
          name: detail.version_group.name,
        });
      });
  });

  return Array.from(groups.values())
    .sort((left, right) => right.id - left.id || left.name.localeCompare(right.name));
}

export function getLevelUpMoves(
  moves: PokemonMove[],
  versionGroup: string,
): LevelUpMove[] {
  return moves
    .flatMap(move => {
      const detail = move.version_group_details.find(item =>
        item.version_group.name === versionGroup
        && item.move_learn_method.name === 'level-up',
      );
      return detail
        ? [{ level: detail.level_learned_at, name: move.move.name, url: move.move.url }]
        : [];
    })
    .sort((left, right) => left.level - right.level || left.name.localeCompare(right.name));
}

export async function mapWithConcurrency<T, R>(
  values: T[],
  concurrency: number,
  mapper: (value: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await mapper(values[index]);
    }
  }

  const workerCount = Math.min(Math.max(1, concurrency), values.length);
  await Promise.all(Array.from({ length: workerCount }, worker));
  return results;
}
