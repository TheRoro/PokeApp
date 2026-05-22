import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PokemonStats from './PokemonStats';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    isCancel: vi.fn(() => false),
  },
}));

const mockedGet = vi.mocked(axios.get);

function pokemon(name: string, id: number) {
  return {
    name,
    species: { url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
    sprites: {
      other: {
        'official-artwork': {
          front_default: `${name}.png`,
          front_shiny: null,
        },
      },
    },
    stats: Array.from({ length: 6 }, () => ({ base_stat: 50 })),
    types: [{ type: { name: 'normal' } }],
  };
}

function ChangePokemon() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/search/charmander')}>Next Pokémon</button>;
}

test('refreshes Pokémon data when the route parameter changes', async () => {
  mockedGet
    .mockResolvedValueOnce({ data: pokemon('pikachu', 25) })
    .mockResolvedValueOnce({ data: pokemon('charmander', 4) });

  render(
    <MemoryRouter initialEntries={['/search/pikachu']}>
      <Routes>
        <Route
          path="/search/:name"
          element={<><PokemonStats /><ChangePokemon /></>}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Next Pokémon' }));
  expect(await screen.findByRole('heading', { name: 'Charmander' })).toBeInTheDocument();

  await waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(2));
  expect(mockedGet.mock.calls.map(call => call[0])).toEqual([
    'https://pokeapi.co/api/v2/pokemon/pikachu/',
    'https://pokeapi.co/api/v2/pokemon/charmander/',
  ]);
});
