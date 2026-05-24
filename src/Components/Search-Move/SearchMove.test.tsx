import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import SearchMove from './SearchMove';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    isAxiosError: vi.fn(() => true),
    isCancel: vi.fn(() => false),
  },
}));

test('shows a retryable inline not-found message instead of an alert', async () => {
  const user = userEvent.setup();
  vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } });
  render(
    <MemoryRouter>
      <SearchMove />
    </MemoryRouter>,
  );

  const input = screen.getByRole('combobox', { name: 'Search moves' });
  await user.clear(input);
  await user.type(input, 'definitely-not-a-move{Enter}');

  expect(
    await screen.findByRole('heading', { name: 'Move not found' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
});
