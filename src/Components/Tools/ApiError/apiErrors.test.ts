import axios from 'axios';
import { describeApiError } from './apiErrors';

vi.mock('axios', () => ({
  default: {
    isAxiosError: vi.fn(),
  },
}));

const isAxiosError = vi.mocked(axios.isAxiosError);

test('distinguishes not-found, rate-limit, and network failures', () => {
  isAxiosError.mockReturnValue(true);

  expect(describeApiError({ response: { status: 404 } }, 'move').title).toBe(
    'Move not found',
  );
  expect(describeApiError({ response: { status: 429 } }, 'moves').title).toBe(
    'PokeAPI is busy',
  );
  expect(describeApiError({}, 'Pokémon').title).toBe('Connection problem');
});
