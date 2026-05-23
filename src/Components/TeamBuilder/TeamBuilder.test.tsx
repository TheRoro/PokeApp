import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import TeamBuilder from './TeamBuilder';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    isAxiosError: vi.fn(() => false),
    isCancel: vi.fn(() => false),
  },
}));

const mockedGet = vi.mocked(axios.get);

function pokemonResponse(
  id: number,
  name: string,
  type: string,
) {
  return {
    data: {
      id,
      name,
      sprites: {
        front_default: `${name}-small.png`,
        other: {
          'official-artwork': {
            front_default: `${name}.png`,
          },
        },
      },
      types: [{ type: { name: type } }],
    },
  };
}

beforeEach(() => mockedGet.mockReset());

test('builds a unique team and reports defensive coverage', async () => {
  const user = userEvent.setup();
  mockedGet.mockResolvedValue(pokemonResponse(25, 'pikachu', 'electric'));
  render(<TeamBuilder />);

  await user.type(screen.getByLabelText('Pokémon 1'), 'Pikachu');
  await user.keyboard('{Enter}');

  expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Defensive coverage' })).toBeInTheDocument();
  expect(
    screen.getByLabelText('Ground: 1 weak member'),
  ).toBeInTheDocument();

  await user.type(screen.getByLabelText('Pokémon 2'), '25');
  await user.keyboard('{Enter}');

  expect(
    await screen.findByText('Pikachu is already on your team.'),
  ).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { name: 'Pikachu' })).toHaveLength(1);
});

test('selects autocomplete suggestions with the keyboard', async () => {
  const user = userEvent.setup();
  mockedGet.mockResolvedValue(pokemonResponse(5, 'charmeleon', 'fire'));
  render(<TeamBuilder />);

  const input = screen.getByLabelText('Pokémon 1');
  await user.type(input, 'char');
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Charmander' })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  await user.keyboard('{ArrowDown}{Enter}');

  expect(
    await screen.findByRole('heading', { name: 'Charmeleon' }),
  ).toBeInTheDocument();
  expect(mockedGet).toHaveBeenCalledWith(
    'https://pokeapi.co/api/v2/pokemon/charmeleon/',
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
});

test('compacts remaining Pokémon to the left after removal', async () => {
  const user = userEvent.setup();
  mockedGet
    .mockResolvedValueOnce(pokemonResponse(25, 'pikachu', 'electric'))
    .mockResolvedValueOnce(pokemonResponse(4, 'charmander', 'fire'));
  render(<TeamBuilder />);

  await user.type(screen.getByLabelText('Pokémon 1'), 'Pikachu');
  await user.keyboard('{Enter}');
  expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();
  await user.type(screen.getByLabelText('Pokémon 2'), 'Charmander');
  await user.keyboard('{Enter}');
  expect(
    await screen.findByRole('heading', { name: 'Charmander' }),
  ).toBeInTheDocument();

  await user.click(screen.getAllByRole('button', { name: 'Remove' })[0]);

  await waitFor(() =>
    expect(screen.queryByRole('heading', { name: 'Pikachu' })).not.toBeInTheDocument(),
  );
  expect(screen.getByLabelText('Pokémon 1')).toHaveValue('Charmander');
  expect(screen.getByLabelText('Pokémon 2')).toHaveValue('');
});

test('keeps concurrent additions when they finish out of order', async () => {
  const user = userEvent.setup();
  let resolvePikachu: (value: ReturnType<typeof pokemonResponse>) => void =
    () => undefined;
  let resolveCharmander: (value: ReturnType<typeof pokemonResponse>) => void =
    () => undefined;
  mockedGet
    .mockReturnValueOnce(
      new Promise<ReturnType<typeof pokemonResponse>>(resolve => {
        resolvePikachu = resolve;
      }),
    )
    .mockReturnValueOnce(
      new Promise<ReturnType<typeof pokemonResponse>>(resolve => {
        resolveCharmander = resolve;
      }),
    );
  render(<TeamBuilder />);

  await user.type(screen.getByLabelText('Pokémon 1'), '25');
  await user.keyboard('{Enter}');
  await user.type(screen.getByLabelText('Pokémon 2'), '4');
  await user.keyboard('{Enter}');

  await act(async () => {
    resolveCharmander(pokemonResponse(4, 'charmander', 'fire'));
  });
  expect(
    await screen.findByRole('heading', { name: 'Charmander' }),
  ).toBeInTheDocument();
  await act(async () => {
    resolvePikachu(pokemonResponse(25, 'pikachu', 'electric'));
  });

  expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(2);
});

test('completes multiple removals started during the same animation', async () => {
  const user = userEvent.setup();
  mockedGet
    .mockResolvedValueOnce(pokemonResponse(25, 'pikachu', 'electric'))
    .mockResolvedValueOnce(pokemonResponse(4, 'charmander', 'fire'))
    .mockResolvedValueOnce(pokemonResponse(7, 'squirtle', 'water'));
  render(<TeamBuilder />);

  for (const [slot, id] of [['Pokémon 1', '25'], ['Pokémon 2', '4'], ['Pokémon 3', '7']]) {
    await user.type(screen.getByLabelText(slot), id);
    await user.keyboard('{Enter}');
  }
  expect(await screen.findByRole('heading', { name: 'Squirtle' })).toBeInTheDocument();

  const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
  await user.click(removeButtons[0]);
  await user.click(removeButtons[1]);

  await waitFor(() =>
    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1),
  );
  expect(screen.getByRole('heading', { name: 'Squirtle' })).toBeInTheDocument();
  expect(screen.getByLabelText('Pokémon 1')).toHaveValue('Squirtle');
});

test('accepts new additions after reset interrupts a removal', async () => {
  const user = userEvent.setup();
  mockedGet
    .mockResolvedValueOnce(pokemonResponse(25, 'pikachu', 'electric'))
    .mockResolvedValueOnce(pokemonResponse(4, 'charmander', 'fire'));
  render(<TeamBuilder />);

  await user.type(screen.getByLabelText('Pokémon 1'), '25');
  await user.keyboard('{Enter}');
  expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Remove' }));
  await user.click(screen.getByRole('button', { name: 'Reset team' }));
  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: 'Defensive coverage' }),
    ).not.toBeInTheDocument(),
  );

  await user.type(screen.getByLabelText('Pokémon 1'), '4');
  await user.keyboard('{Enter}');
  expect(
    await screen.findByRole('heading', { name: 'Charmander' }),
  ).toBeInTheDocument();
});

test('reset clears drafts and ignores searches that finish afterward', async () => {
  const user = userEvent.setup();
  let resolveCharmander: (value: ReturnType<typeof pokemonResponse>) => void =
    () => undefined;
  const pendingCharmander = new Promise<ReturnType<typeof pokemonResponse>>(
    resolve => {
      resolveCharmander = resolve;
    },
  );
  mockedGet
    .mockResolvedValueOnce(pokemonResponse(25, 'pikachu', 'electric'))
    .mockReturnValueOnce(pendingCharmander);
  render(<TeamBuilder />);

  await user.type(screen.getByLabelText('Pokémon 1'), 'Pikachu');
  await user.keyboard('{Enter}');
  expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument();

  await user.type(screen.getByLabelText('Pokémon 2'), 'Charmander');
  await user.keyboard('{Enter}');
  await user.click(screen.getByRole('button', { name: 'Reset team' }));

  await act(async () => {
    resolveCharmander(pokemonResponse(4, 'charmander', 'fire'));
    await pendingCharmander;
  });

  expect(screen.queryByRole('heading', { name: 'Charmander' })).not.toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: 'Defensive coverage' }),
    ).not.toBeInTheDocument(),
  );
  expect(
    screen.getAllByPlaceholderText('Name or Pokédex #').every(input =>
      (input as HTMLInputElement).value === ''),
  ).toBe(true);
});
