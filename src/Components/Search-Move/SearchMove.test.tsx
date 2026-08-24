import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchMove from './SearchMove';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    isAxiosError: vi.fn(() => true),
    isCancel: vi.fn(() => false),
  },
}));

test('starts with an empty search and six move discovery options', () => {
  render(
    <MemoryRouter>
      <SearchMove />
    </MemoryRouter>,
  );

  expect(screen.getByRole('combobox', { name: 'Search moves' })).toHaveValue('');
  expect(screen.getAllByRole('button', { name: /^View / })).toHaveLength(6);
  expect(
    screen.queryByRole('button', { name: 'Generate six new moves' }),
  ).not.toBeInTheDocument();
});

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

test('loads move details directly from a stable route', async () => {
  vi.mocked(axios.get).mockResolvedValue({
    data: {
      accuracy: 100,
      damage_class: { name: 'physical' },
      effect_chance: null,
      effect_entries: [
        {
          language: { name: 'en' },
          short_effect: 'Inflicts regular damage.',
        },
      ],
      name: 'thunder-punch',
      power: 75,
      pp: 15,
      type: { name: 'electric' },
    },
  });

  render(
    <MemoryRouter initialEntries={['/move/thunder-punch']}>
      <Routes>
        <Route path="/move/*" element={<SearchMove />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(
    await screen.findByRole('heading', { name: 'Thunder Punch' }),
  ).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledWith(
    'https://pokeapi.co/api/v2/move/thunder-punch/',
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
});
