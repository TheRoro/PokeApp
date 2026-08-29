import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TeamBuilder from './TeamBuilder';
import { fetchTeamPokemon } from './teamPokemonApi';
import { TEAM_STORAGE_KEY } from './teamPersistence';
import { TeamPokemon } from './teamAnalysis';
import { generateBalancedTeam } from './balancedTeamGenerator';
import { loadTeamFilterCatalog } from './teamFilterCatalog';

vi.mock('./teamPokemonApi', () => ({
  fetchTeamPokemon: vi.fn(),
}));

vi.mock('./balancedTeamGenerator', () => ({
  generateBalancedTeam: vi.fn(),
}));

vi.mock('./teamFilterCatalog', () => ({
  loadTeamFilterCatalog: vi.fn(),
}));

const mockedFetchTeamPokemon = vi.mocked(fetchTeamPokemon);
const mockedGenerateBalancedTeam = vi.mocked(generateBalancedTeam);
const mockedLoadTeamFilterCatalog = vi.mocked(loadTeamFilterCatalog);
const writeText = vi.fn().mockResolvedValue(undefined);

function pokemon(id: number, name: string, types: string[]): TeamPokemon {
  return {
    id,
    name,
    displayName: name[0].toUpperCase() + name.slice(1),
    imageUrl: `${name}.png`,
    types,
  };
}

function renderBuilder() {
  return render(
    <MemoryRouter>
      <TeamBuilder />
    </MemoryRouter>,
  );
}

async function addPokemon(name: string) {
  const user = userEvent.setup();
  const input = screen.getByRole('combobox', { name: 'Team Pokémon search' });
  await user.type(input, name);
  await user.keyboard('{Enter}');
}

beforeEach(() => {
  mockedFetchTeamPokemon.mockReset();
  mockedGenerateBalancedTeam.mockReset();
  mockedLoadTeamFilterCatalog.mockReset();
  mockedLoadTeamFilterCatalog.mockImplementation(
    () => new Promise(() => undefined),
  );
  localStorage.clear();
  window.history.replaceState({}, '', '/teambuilder');
  vi.stubGlobal('confirm', vi.fn(() => true));
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
  writeText.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('uses one picker, prevents duplicates, and updates team analysis', async () => {
  mockedFetchTeamPokemon.mockResolvedValue(
    pokemon(25, 'pikachu', ['electric']),
  );
  renderBuilder();

  expect(
    screen.getAllByRole('combobox', { name: 'Team Pokémon search' }),
  ).toHaveLength(1);

  await addPokemon('Pikachu');

  expect(
    await screen.findByRole('heading', { name: 'Pikachu' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Team coverage' })).toBeInTheDocument();
  expect(screen.getByText('1 / 6')).toBeInTheDocument();

  await addPokemon('25');
  expect(
    await screen.findByText('Pikachu is already on your team.'),
  ).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { name: 'Pikachu' })).toHaveLength(1);
});

test('selects an empty slot and loads the new member into it', async () => {
  mockedFetchTeamPokemon.mockResolvedValue(
    pokemon(4, 'charmander', ['fire']),
  );
  renderBuilder();

  await userEvent.click(
    within(screen.getByLabelText('Team slot 3')).getByRole('button', {
      name: 'Select team slot 3',
    }),
  );
  expect(screen.getByText('Add to slot 3')).toBeInTheDocument();
  await addPokemon('Charmander');

  expect(
    within(screen.getByLabelText('Team slot 3')).getByRole('heading', {
      name: 'Charmander',
    }),
  ).toBeInTheDocument();
});

test('selects autocomplete suggestions with the keyboard', async () => {
  mockedFetchTeamPokemon.mockResolvedValue(
    pokemon(5, 'charmeleon', ['fire']),
  );
  renderBuilder();

  const user = userEvent.setup();
  const input = screen.getByRole('combobox', { name: 'Team Pokémon search' });
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
  expect(mockedFetchTeamPokemon).toHaveBeenCalledWith(
    'Charmeleon',
    expect.any(AbortSignal),
  );
});

test('reorders team members with accessible controls', async () => {
  mockedFetchTeamPokemon
    .mockResolvedValueOnce(pokemon(25, 'pikachu', ['electric']))
    .mockResolvedValueOnce(pokemon(4, 'charmander', ['fire']));
  renderBuilder();

  await addPokemon('Pikachu');
  await addPokemon('Charmander');
  await userEvent.click(
    screen.getByRole('button', { name: 'Move Charmander left' }),
  );

  expect(
    within(screen.getByLabelText('Team slot 1')).getByRole('heading', {
      name: 'Charmander',
    }),
  ).toBeInTheDocument();
  expect(
    within(screen.getByLabelText('Team slot 2')).getByRole('heading', {
      name: 'Pikachu',
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Charmander moved to team slot 1.'),
  ).toBeInTheDocument();
});

test('removes a member without changing the remaining team order', async () => {
  mockedFetchTeamPokemon
    .mockResolvedValueOnce(pokemon(25, 'pikachu', ['electric']))
    .mockResolvedValueOnce(pokemon(4, 'charmander', ['fire']));
  renderBuilder();

  const user = userEvent.setup();
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Team generation mode' }),
    'vgc',
  );
  await addPokemon('Pikachu');
  await addPokemon('Charmander');
  await user.click(
    screen.getByRole('button', { name: 'Remove Pikachu' }),
  );

  expect(screen.getByRole('button', { name: /save team/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /share team/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: /load saved/i })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Load full team' })).toBeDisabled();
  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: 'Pikachu' }),
    ).not.toBeInTheDocument(),
  );
  expect(
    within(screen.getByLabelText('Team slot 2')).getByRole('heading', {
      name: 'Charmander',
    }),
  ).toBeInTheDocument();
});

test('saves and shares the current team', async () => {
  mockedFetchTeamPokemon.mockResolvedValue(
    pokemon(25, 'pikachu', ['electric']),
  );
  renderBuilder();
  await addPokemon('Pikachu');

  await userEvent.click(screen.getByRole('button', { name: /save team/i }));
  expect(localStorage.getItem(TEAM_STORAGE_KEY)).toBe(
    '[{"name":"pikachu"}]',
  );

  const clipboardWrite = vi.spyOn(navigator.clipboard, 'writeText');
  await userEvent.click(screen.getByRole('button', { name: /share team/i }));
  expect(clipboardWrite).toHaveBeenCalledWith(
    expect.stringContaining('team=pikachu'),
  );
  expect(
    screen.getByText('Share link copied to your clipboard.'),
  ).toBeInTheDocument();
});

test('loads a team from a shared URL', async () => {
  window.history.replaceState({}, '', '/teambuilder?team=pikachu,charizard');
  mockedFetchTeamPokemon
    .mockResolvedValueOnce(pokemon(25, 'pikachu', ['electric']))
    .mockResolvedValueOnce(pokemon(6, 'charizard', ['fire', 'flying']));

  renderBuilder();

  expect(
    await screen.findByRole('heading', { name: 'Pikachu' }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole('heading', { name: 'Charizard' }),
  ).toBeInTheDocument();
});

test('resets a populated team without a confirmation prompt', async () => {
  mockedFetchTeamPokemon.mockResolvedValueOnce(
    pokemon(25, 'pikachu', ['electric']),
  );
  renderBuilder();

  await addPokemon('Pikachu');
  await userEvent.click(screen.getByRole('button', { name: /reset team/i }));

  expect(window.confirm).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(
      screen.queryByRole('heading', { name: 'Pikachu' }),
    ).not.toBeInTheDocument(),
  );
  expect(screen.getByText('0 / 6')).toBeInTheDocument();
});

test('deduplicates aliases loaded from a shared URL by Pokémon id', async () => {
  window.history.replaceState({}, '', '/teambuilder?team=pikachu,25');
  mockedFetchTeamPokemon.mockResolvedValue(
    pokemon(25, 'pikachu', ['electric']),
  );

  renderBuilder();

  expect(
    await screen.findByRole('heading', { name: 'Pikachu' }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { name: 'Pikachu' })).toHaveLength(1);
  expect(screen.getByText(/1 duplicate omitted/)).toBeInTheDocument();
});

test('ignores a picker request that resolves after reset', async () => {
  let resolveCharmander: (value: TeamPokemon) => void = () => undefined;
  mockedFetchTeamPokemon
    .mockResolvedValueOnce(pokemon(25, 'pikachu', ['electric']))
    .mockReturnValueOnce(
      new Promise<TeamPokemon>(resolve => {
        resolveCharmander = resolve;
      }),
    );
  renderBuilder();

  await addPokemon('Pikachu');
  const user = userEvent.setup();
  await user.type(
    screen.getByRole('combobox', { name: 'Team Pokémon search' }),
    'Charmander',
  );
  await user.keyboard('{Enter}');
  await user.click(screen.getByRole('button', { name: /reset team/i }));

  resolveCharmander(pokemon(4, 'charmander', ['fire']));
  await waitFor(() => expect(screen.getByText('0 / 6')).toBeInTheDocument());
  expect(
    screen.queryByRole('heading', { name: 'Charmander' }),
  ).not.toBeInTheDocument();
});

test('generates a balanced team from a selected game Pokédex', async () => {
  const generatedTeam = [
    pokemon(3, 'venusaur', ['grass', 'poison']),
    pokemon(6, 'charizard', ['fire', 'flying']),
    pokemon(9, 'blastoise', ['water']),
    pokemon(25, 'pikachu', ['electric']),
    pokemon(65, 'alakazam', ['psychic']),
    pokemon(68, 'machamp', ['fighting']),
  ].map((member, index) => ({
    ...member,
    isLegendary: false,
    isStarter: index === 0,
    speciesName: member.name,
  }));
  mockedGenerateBalancedTeam.mockResolvedValue(generatedTeam);
  mockedFetchTeamPokemon.mockResolvedValue(
    pokemon(133, 'eevee', ['normal']),
  );
  mockedLoadTeamFilterCatalog.mockResolvedValue({
    all: { label: 'All Pokémon', value: 'all' },
    generations: [
      { label: 'Generation I', value: 'generation-i' },
    ],
    regions: [{ label: 'Kanto', value: 'kanto' }],
    games: [{ label: 'Red', value: 'red' }],
  });
  renderBuilder();

  const user = userEvent.setup();
  await addPokemon('Eevee');
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Random team scope' }),
    'game',
  );
  await waitFor(() =>
    expect(
      screen.getByRole('combobox', { name: 'Random team selection' }),
    ).toHaveValue('red'),
  );
  await user.click(screen.getByRole('button', { name: 'Generate team' }));

  expect(window.confirm).not.toHaveBeenCalled();
  expect(mockedGenerateBalancedTeam).toHaveBeenCalledWith(
    expect.objectContaining({
      mode: 'adventure',
      scope: { kind: 'game', value: 'red' },
      signal: expect.any(AbortSignal),
    }),
  );
  expect(
    await screen.findByRole('heading', { name: 'Venusaur' }),
  ).toBeInTheDocument();
  expect(screen.getByText('6 / 6')).toBeInTheDocument();
});

test('maps General and Competitive controls to their generation modes', async () => {
  const generatedTeam = [
    pokemon(59, 'arcanine', ['fire']),
    pokemon(121, 'starmie', ['water', 'psychic']),
    pokemon(68, 'machamp', ['fighting']),
    pokemon(65, 'alakazam', ['psychic']),
    pokemon(76, 'golem', ['rock', 'ground']),
    pokemon(149, 'dragonite', ['dragon', 'flying']),
  ].map(member => ({
    ...member,
    isLegendary: false,
    isStarter: false,
    speciesName: member.name,
  }));
  mockedGenerateBalancedTeam.mockResolvedValue(generatedTeam);
  mockedLoadTeamFilterCatalog.mockResolvedValue({
    all: { label: 'All Pokémon', value: 'all' },
    generations: [
      { label: 'Generation I', value: 'generation-i' },
    ],
    regions: [{ label: 'Kanto', value: 'kanto' }],
    games: [{ label: 'Red', value: 'red' }],
  });
  renderBuilder();

  const user = userEvent.setup();
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Team generation mode' }),
    'general',
  );
  expect(
    screen.queryByRole('combobox', { name: 'Historical VGC team' }),
  ).not.toBeInTheDocument();
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Random team scope' }),
    'generation',
  );
  await waitFor(() =>
    expect(
      screen.getByRole('combobox', { name: 'Random team selection' }),
    ).toHaveValue('generation-i'),
  );
  await user.click(screen.getByRole('button', { name: 'Generate team' }));

  expect(mockedGenerateBalancedTeam).toHaveBeenLastCalledWith(
    expect.objectContaining({
      mode: 'general',
      scope: { kind: 'generation', value: 'generation-i' },
    }),
  );
  expect(
    await screen.findByText('Balanced team generated. Generate again for a new result.'),
  ).toBeInTheDocument();

  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Team generation mode' }),
    'vgc',
  );
  expect(
    await screen.findByRole('combobox', { name: 'Historical VGC team' }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Exact regulation legality is not guaranteed/i),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('combobox', { name: 'Random team scope' }),
  ).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Generate team' }));

  expect(mockedGenerateBalancedTeam).toHaveBeenLastCalledWith(
    expect.objectContaining({
      mode: 'vgc',
      scope: { kind: 'all' },
    }),
  );
  expect(
    await screen.findByText(/not a current regulation legality check/i),
  ).toBeInTheDocument();
});

test('loads a historical VGC team with complete competitive sets', async () => {
  let pokemonId = 1000;
  mockedFetchTeamPokemon.mockImplementation(async name => {
    pokemonId += 1;
    return pokemon(pokemonId, name, ['electric']);
  });
  renderBuilder();

  expect(
    screen.queryByRole('button', { name: 'Load full team' }),
  ).not.toBeInTheDocument();
  await userEvent.selectOptions(
    screen.getByRole('combobox', { name: 'Team generation mode' }),
    'vgc',
  );
  await userEvent.selectOptions(
    await screen.findByRole('combobox', { name: 'Historical VGC team' }),
    'luca-ceribelli-worlds-2024',
  );
  await userEvent.click(
    screen.getByRole('button', { name: 'Load full team' }),
  );

  expect(mockedFetchTeamPokemon).toHaveBeenCalledTimes(6);
  expect(mockedFetchTeamPokemon).toHaveBeenCalledWith(
    'ogerpon-hearthflame-mask',
    expect.any(AbortSignal),
  );
  expect(
    await screen.findByRole('heading', { name: 'Miraidon' }),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Choice Specs · Hadron Engine'),
  ).toBeInTheDocument();

  await userEvent.click(screen.getByText('Choice Specs · Hadron Engine'));
  expect(screen.getByText('Electro Drift')).toBeInTheDocument();
  expect(screen.getByText('44 HP / 4 Def / 244 SpA / 12 SpD / 204 Spe')).toBeInTheDocument();
  expect(
    screen.getByText("Luca Ceribelli's 2024 VGC team loaded."),
  ).toBeInTheDocument();
  expect(window.confirm).not.toHaveBeenCalled();
});

test('imports and exports Pokémon Showdown teams without a replacement prompt', async () => {
  mockedFetchTeamPokemon
    .mockResolvedValueOnce(pokemon(25, 'pikachu', ['electric']))
    .mockResolvedValueOnce(pokemon(6, 'charizard', ['fire', 'flying']));
  renderBuilder();

  const user = userEvent.setup();
  await user.click(
    screen.getByText('Pokémon Showdown import and export'),
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Showdown team text' }),
    `Pikachu @ Light Ball
Ability: Static
Level: 50
EVs: 4 HP / 252 SpA / 252 Spe
Timid Nature
- Thunderbolt
- Volt Switch
- Fake Out
- Protect

Charizard @ Life Orb
Ability: Solar Power
Level: 50
EVs: 4 Def / 252 SpA / 252 Spe
Timid Nature
- Heat Wave
- Air Slash
- Solar Beam
- Protect`,
  );
  await user.click(screen.getByRole('button', { name: 'Import team' }));

  expect(window.confirm).not.toHaveBeenCalled();
  expect(
    await screen.findByRole('heading', { name: 'Pikachu' }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole('heading', { name: 'Charizard' }),
  ).toBeInTheDocument();
  expect(screen.getByText('Light Ball · Static')).toBeInTheDocument();

  const clipboardWrite = vi.spyOn(navigator.clipboard, 'writeText');
  const copyExport = screen.getByRole('button', { name: 'Copy export' });
  await waitFor(() => expect(copyExport).toBeEnabled());
  await user.click(copyExport);
  expect(clipboardWrite).toHaveBeenCalledWith(
    expect.stringContaining('Pikachu @ Light Ball'),
  );
  expect(clipboardWrite).toHaveBeenCalledWith(
    expect.stringContaining('- Heat Wave'),
  );
});

test('keeps the Showdown text synchronized with the current roster', async () => {
  mockedFetchTeamPokemon
    .mockResolvedValueOnce(pokemon(25, 'pikachu', ['electric']))
    .mockResolvedValueOnce(pokemon(4, 'charmander', ['fire']));
  renderBuilder();

  const user = userEvent.setup();
  await addPokemon('Pikachu');
  await user.click(
    screen.getByText('Pokémon Showdown import and export'),
  );
  const showdownText = screen.getByRole('textbox', {
    name: 'Showdown team text',
  });
  expect(showdownText).toHaveValue('Pikachu');

  await addPokemon('Charmander');
  await waitFor(() =>
    expect(showdownText).toHaveValue('Pikachu\n\nCharmander'),
  );

  await user.click(screen.getByRole('button', { name: 'Remove Pikachu' }));
  await waitFor(() => expect(showdownText).toHaveValue('Charmander'));
});
