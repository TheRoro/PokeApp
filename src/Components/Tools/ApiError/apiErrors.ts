import axios from 'axios';
import type { ApiErrorInfo } from './ApiError';

export function describeApiError(
  error: unknown,
  subject: string,
): ApiErrorInfo {
  if (!axios.isAxiosError(error)) {
    return {
      title: `Could not load ${subject}`,
      message: 'Something unexpected happened. Please try again.',
    };
  }

  if (!error.response) {
    return {
      title: 'Connection problem',
      message: `PokeApp could not reach PokeAPI to load ${subject}. Check your connection and try again.`,
    };
  }

  if (error.response.status === 404) {
    return {
      title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} not found`,
      message: 'Check the spelling or try another search.',
    };
  }

  if (error.response.status === 429) {
    return {
      title: 'PokeAPI is busy',
      message: 'The request limit was reached. Wait a moment, then try again.',
    };
  }

  if (error.response.status >= 500) {
    return {
      title: 'PokeAPI is unavailable',
      message: `PokeAPI could not provide ${subject} right now. Please try again shortly.`,
    };
  }

  return {
    title: `Could not load ${subject}`,
    message: 'The request could not be completed. Please try again.',
  };
}
