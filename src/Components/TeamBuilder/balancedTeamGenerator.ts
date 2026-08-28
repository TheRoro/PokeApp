import Bidoof404 from '../../Assets/404-bidoof.png';
import { formatPokemonName } from '../Tools/pokemonNames';
import {
  adventureStarterRoots,
  finalStarterSpecies,
} from './adventureStarters';
import {
  analyzeOffensiveCoverage,
  analyzeTeam,
  TeamPokemon,
} from './teamAnalysis';
import {
  defaultPokeApiClient,
  isAbortError,
  mapWithConcurrency,
  NamedApiResource,
  NamedApiResourceList,
  PokeApiClient,
  throwIfAborted,
} from './pokeApiClient';
import { TeamGenerationScope } from './teamFilterCatalog';

const TEAM_SIZE = 6;
const DEFAULT_CANDIDATE_COUNT = 30;
const MAX_CANDIDATE_COUNT = 60;
const DEFAULT_CONCURRENCY = 6;
const MAX_CONCURRENCY = 12;
const DEFAULT_SELECTION_WINDOW = 3;
const STARTER_ROOT_SPECIES = new Set([
  'bulbasaur',
  'charmander',
  'squirtle',
  'chikorita',
  'cyndaquil',
  'totodile',
  'treecko',
  'torchic',
  'mudkip',
  'turtwig',
  'chimchar',
  'piplup',
  'snivy',
  'tepig',
  'oshawott',
  'chespin',
  'fennekin',
  'froakie',
  'rowlet',
  'litten',
  'popplio',
  'grookey',
  'scorbunny',
  'sobble',
  'sprigatito',
  'fuecoco',
  'quaxly',
  'pikachu',
  'eevee',
]);
const STAT_NAMES = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const;

type PokedexResponse = {
  pokemon_entries: Array<{
    pokemon_species: NamedApiResource;
  }>;
};

type GenerationResponse = {
  pokemon_species: NamedApiResource[];
};

type RegionResponse = {
  name: string;
  pokedexes: NamedApiResource[];
};

type VersionGroupResponse = {
  name: string;
  pokedexes: NamedApiResource[];
  versions: NamedApiResource[];
};

type VersionResponse = {
  name: string;
  version_group: NamedApiResource;
};

type PokemonSpeciesResponse = {
  evolution_chain: NamedApiResource;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  varieties: Array<{
    is_default: boolean;
    pokemon: NamedApiResource;
  }>;
};

type EvolutionNode = {
  evolves_to: EvolutionNode[];
  species: NamedApiResource;
};

type EvolutionChainResponse = {
  chain: EvolutionNode;
};

type EncounterResponse = Array<{
  version_details: Array<{
    version: NamedApiResource;
  }>;
}>;

type GameAvailability = {
  selectedVersion: string;
  siblingVersions: Set<string>;
};

type PokemonResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  types: Array<{ type: { name: string } }>;
};

export type GeneratedTeamPokemon = TeamPokemon & {
  isLegendary: boolean;
  isStarter: boolean;
  speciesName: string;
};

export type TeamGeneratorMode = 'adventure' | 'general' | 'vgc';

export type BalanceScore = {
  competitive: number;
  defensive: number;
  offensive: number;
  statVariety: number;
  typeDiversity: number;
  total: number;
};

export type ResolveTeamScopeOptions = {
  apiClient?: PokeApiClient;
  concurrency?: number;
  signal?: AbortSignal;
};

export type GenerateBalancedTeamOptions = ResolveTeamScopeOptions & {
  candidateCount?: number;
  mode?: TeamGeneratorMode;
  random?: () => number;
  scope: TeamGenerationScope;
  selectionWindow?: number;
};

export class BalancedTeamGenerationError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'BalancedTeamGenerationError';
    this.cause = cause;
  }
}

function boundedInteger(
  value: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.floor(value)));
}

function randomUnit(random: () => number): number {
  const value = random();
  if (!Number.isFinite(value)) return 0;
  return Math.min(0.999999999999, Math.max(0, value));
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomUnit(random) * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

function uniqueSpecies(
  resources: readonly NamedApiResource[],
): NamedApiResource[] {
  const seen = new Set<string>();
  return resources.filter(resource => {
    if (seen.has(resource.name)) return false;
    seen.add(resource.name);
    return true;
  });
}

function chooseRegionPokedexes(region: RegionResponse): NamedApiResource[] {
  const exact = region.pokedexes.filter(
    pokedex => pokedex.name === region.name,
  );
  if (exact.length > 0) return exact;

  const original = region.pokedexes.filter(
    pokedex => pokedex.name === `original-${region.name}`,
  );
  if (original.length > 0) return original;

  const regionalSegments = region.pokedexes.filter(
    pokedex =>
      pokedex.name.startsWith(`${region.name}-`) ||
      pokedex.name.endsWith(`-${region.name}`),
  );
  if (regionalSegments.length > 0) return regionalSegments;

  return region.pokedexes.slice(0, 1);
}

async function loadPokedexSpecies(
  pokedexes: readonly NamedApiResource[],
  apiClient: PokeApiClient,
  concurrency: number,
  signal?: AbortSignal,
): Promise<NamedApiResource[]> {
  const responses = await mapWithConcurrency(
    pokedexes,
    concurrency,
    pokedex => apiClient.get<PokedexResponse>(pokedex.url, signal),
    signal,
  );

  return uniqueSpecies(
    responses.flatMap(response =>
      response.pokemon_entries.map(entry => entry.pokemon_species),
    ),
  );
}

export async function resolvePokemonSpeciesPool(
  scope: TeamGenerationScope,
  options: ResolveTeamScopeOptions = {},
): Promise<NamedApiResource[]> {
  const {
    apiClient = defaultPokeApiClient,
    concurrency = DEFAULT_CONCURRENCY,
    signal,
  } = options;
  const requestConcurrency = boundedInteger(
    concurrency,
    DEFAULT_CONCURRENCY,
    1,
    MAX_CONCURRENCY,
  );
  throwIfAborted(signal);

  if (scope.kind === 'all') {
    const response = await apiClient.get<NamedApiResourceList>(
      'pokemon-species?limit=100000',
      signal,
    );
    return uniqueSpecies(response.results);
  }

  if (!scope.value.trim()) {
    throw new BalancedTeamGenerationError(
      `A ${scope.kind} must be selected.`,
    );
  }

  const value = encodeURIComponent(scope.value.trim().toLowerCase());
  if (scope.kind === 'generation') {
    const response = await apiClient.get<GenerationResponse>(
      `generation/${value}`,
      signal,
    );
    return uniqueSpecies(response.pokemon_species);
  }

  if (scope.kind === 'region') {
    const response = await apiClient.get<RegionResponse>(
      `region/${value}`,
      signal,
    );
    const pokedexes = chooseRegionPokedexes(response);
    if (pokedexes.length === 0) {
      throw new BalancedTeamGenerationError(
        `No regional Pokédex is available for ${scope.value}.`,
      );
    }
    return loadPokedexSpecies(
      pokedexes,
      apiClient,
      requestConcurrency,
      signal,
    );
  }

  const version = await apiClient.get<VersionResponse>(
    `version/${value}`,
    signal,
  );
  const response = await apiClient.get<VersionGroupResponse>(
    version.version_group.url,
    signal,
  );
  if (response.pokedexes.length === 0) {
    throw new BalancedTeamGenerationError(
      `No regional Pokédex is available for ${scope.value}.`,
    );
  }
  return loadPokedexSpecies(
    response.pokedexes,
    apiClient,
    requestConcurrency,
    signal,
  );
}

function mapGeneratedPokemon(
  data: PokemonResponse,
  isLegendary: boolean,
  isStarter: boolean,
  speciesName: string,
): GeneratedTeamPokemon {
  return {
    id: data.id,
    name: data.name,
    displayName: formatPokemonName(data.name),
    imageUrl:
      data.sprites.other['official-artwork'].front_default ??
      data.sprites.front_default ??
      Bidoof404,
    types: data.types.map(entry => entry.type.name),
    baseStats: Object.fromEntries(
      data.stats.map(entry => [entry.stat.name, entry.base_stat]),
    ),
    isLegendary,
    isStarter,
    speciesName,
  };
}

function evolutionSpeciesNames(node: EvolutionNode): string[] {
  return [
    node.species.name,
    ...node.evolves_to.flatMap(evolutionSpeciesNames),
  ];
}

async function isAvailableInGame(
  chain: EvolutionNode,
  game: GameAvailability,
  apiClient: PokeApiClient,
  encounterCache: Map<string, Promise<EncounterResponse>>,
  signal?: AbortSignal,
): Promise<boolean> {
  let foundSiblingEncounter = false;

  for (const speciesName of evolutionSpeciesNames(chain)) {
    let encounters = encounterCache.get(speciesName);
    if (!encounters) {
      encounters = apiClient.get<EncounterResponse>(
        `pokemon/${encodeURIComponent(speciesName)}/encounters`,
        signal,
      );
      encounterCache.set(speciesName, encounters);
    }
    const locations = await encounters;
    throwIfAborted(signal);
    const versions = locations.flatMap(location =>
      location.version_details.map(detail => detail.version.name),
    );
    if (versions.includes(game.selectedVersion)) return true;
    if (versions.some(version => game.siblingVersions.has(version))) {
      foundSiblingEncounter = true;
    }
  }

  return !foundSiblingEncounter;
}

async function loadDefaultVariety(
  species: NamedApiResource,
  apiClient: PokeApiClient,
  evolutionChains: Map<string, Promise<EvolutionChainResponse>>,
  encounterCache: Map<string, Promise<EncounterResponse>>,
  mode: TeamGeneratorMode,
  allowedStarterRoots: ReadonlySet<string>,
  gameAvailability?: GameAvailability,
  signal?: AbortSignal,
): Promise<GeneratedTeamPokemon | null> {
  const speciesData = await apiClient.get<PokemonSpeciesResponse>(
    species.url,
    signal,
  );
  throwIfAborted(signal);
  if (
    (mode !== 'general' && speciesData.is_mythical) ||
    (mode === 'adventure' && speciesData.is_legendary)
  ) {
    return null;
  }
  let evolutionChain = evolutionChains.get(speciesData.evolution_chain.url);
  if (!evolutionChain) {
    evolutionChain = apiClient.get<EvolutionChainResponse>(
      speciesData.evolution_chain.url,
      signal,
    );
    evolutionChains.set(speciesData.evolution_chain.url, evolutionChain);
  }
  const chain = await evolutionChain;
  throwIfAborted(signal);
  if (!isFinalEvolution(chain.chain, speciesData.name)) return null;
  const isStarter = allowedStarterRoots.has(chain.chain.species.name);
  if (
    gameAvailability &&
    !isStarter &&
    !(await isAvailableInGame(
      chain.chain,
      gameAvailability,
      apiClient,
      encounterCache,
      signal,
    ))
  ) {
    return null;
  }

  const variety =
    speciesData.varieties.find(candidate => candidate.is_default) ??
    speciesData.varieties[0];

  if (!variety) {
    throw new BalancedTeamGenerationError(
      `No default variety is available for ${species.name}.`,
    );
  }

  const pokemon = await apiClient.get<PokemonResponse>(
    variety.pokemon.url,
    signal,
  );
  throwIfAborted(signal);
  return mapGeneratedPokemon(
    pokemon,
    speciesData.is_legendary,
    isStarter,
    speciesData.name,
  );
}

function isFinalEvolution(node: EvolutionNode, speciesName: string): boolean {
  if (node.species.name === speciesName) return node.evolves_to.length === 0;
  return node.evolves_to.some(child => isFinalEvolution(child, speciesName));
}

function classifyPair(
  first: number,
  second: number,
  firstLabel: string,
  secondLabel: string,
): string {
  if (first - second >= 15) return firstLabel;
  if (second - first >= 15) return secondLabel;
  return 'balanced';
}

function statVarietyScore(team: readonly TeamPokemon[]): number {
  const offenseProfiles = new Set<string>();
  const defenseProfiles = new Set<string>();
  const speedProfiles = new Set<string>();
  const normalizedProfiles: number[][] = [];

  for (const pokemon of team) {
    const stats = pokemon.baseStats;
    if (!stats) continue;

    offenseProfiles.add(
      classifyPair(
        stats.attack ?? 0,
        stats['special-attack'] ?? 0,
        'physical',
        'special',
      ),
    );
    defenseProfiles.add(
      classifyPair(
        stats.defense ?? 0,
        stats['special-defense'] ?? 0,
        'physical',
        'special',
      ),
    );
    const speed = stats.speed ?? 0;
    speedProfiles.add(speed >= 100 ? 'fast' : speed <= 60 ? 'slow' : 'mid');

    const values = STAT_NAMES.map(name => Math.max(0, stats[name] ?? 0));
    const total = values.reduce((sum, value) => sum + value, 0);
    if (total > 0) {
      normalizedProfiles.push(values.map(value => value / total));
    }
  }

  let pairwiseDistance = 0;
  let pairCount = 0;
  for (let left = 0; left < normalizedProfiles.length; left += 1) {
    for (let right = left + 1; right < normalizedProfiles.length; right += 1) {
      pairwiseDistance += normalizedProfiles[left].reduce(
        (distance, value, index) =>
          distance + Math.abs(value - normalizedProfiles[right][index]),
        0,
      );
      pairCount += 1;
    }
  }

  const profileRoles =
    offenseProfiles.size + defenseProfiles.size + speedProfiles.size;
  const averageDistance = pairCount > 0 ? pairwiseDistance / pairCount : 0;
  return profileRoles * 1.25 + averageDistance * 10;
}

export function scoreTeamBalance(
  team: readonly TeamPokemon[],
  mode: TeamGeneratorMode = 'general',
): BalanceScore {
  const typeCounts = new Map<string, number>();
  team.forEach(pokemon => {
    pokemon.types.forEach(type => {
      const normalizedType = type.toLowerCase();
      typeCounts.set(normalizedType, (typeCounts.get(normalizedType) ?? 0) + 1);
    });
  });
  const repeatedTypes = [...typeCounts.values()].reduce(
    (total, count) => total + Math.max(0, count - 1),
    0,
  );
  const typeDiversity = typeCounts.size * 2 - repeatedTypes * 6;
  const defensive = analyzeTeam([...team]).reduce((score, item) => {
    const answers = item.resistant + item.immune;
    const uncoveredWeaknesses = Math.max(0, item.weak - answers);
    const sharedWeaknesses = Math.max(0, item.weak - 2);
    return (
      score +
      Math.min(answers, 3) * 1.5 -
      item.weak * 0.5 -
      uncoveredWeaknesses * 2.5 -
      sharedWeaknesses * 1.5
    );
  }, 0);

  const coverage = analyzeOffensiveCoverage([...team]);
  const strongAgainst = new Set(
    coverage.flatMap(item => item.strongAgainst),
  );
  const offensive = strongAgainst.size * 2 + coverage.length * 0.75;
  const statVariety = statVarietyScore(team);
  const competitive =
    mode === 'vgc'
      ? team.reduce((score, pokemon) => {
          const stats = pokemon.baseStats;
          if (!stats) return score;
          const total = STAT_NAMES.reduce(
            (sum, statName) => sum + (stats[statName] ?? 0),
            0,
          );
          const bestOffense = Math.max(
            stats.attack ?? 0,
            stats['special-attack'] ?? 0,
          );
          return score + Math.max(0, total - 450) / 30 + bestOffense / 45;
        }, 0)
      : 0;

  return {
    competitive,
    defensive,
    offensive,
    statVariety,
    typeDiversity,
    total: defensive + offensive + statVariety + typeDiversity + competitive,
  };
}

function selectBalancedTeam(
  candidates: readonly GeneratedTeamPokemon[],
  mode: TeamGeneratorMode,
  random: () => number,
  selectionWindow: number,
): GeneratedTeamPokemon[] {
  const remaining = [...candidates];
  const team: GeneratedTeamPokemon[] = [];
  if (mode === 'adventure') {
    const starters = remaining.filter(candidate => candidate.isStarter);
    if (starters.length === 0) {
      throw new BalancedTeamGenerationError(
        'No fully evolved starter is available in the selected adventure pool.',
      );
    }
    const starter =
      starters[Math.floor(randomUnit(random) * starters.length)];
    team.push(starter);
    remaining.splice(remaining.indexOf(starter), 1);
  }

  while (team.length < TEAM_SIZE) {
    const starterSelected = team.some(member => member.isStarter);
    const legendaryCount = team.filter(member => member.isLegendary).length;
    const eligible = remaining.filter(
      candidate =>
        (!starterSelected || !candidate.isStarter) &&
        (mode !== 'vgc' || legendaryCount < 2 || !candidate.isLegendary),
    );
    if (eligible.length === 0) {
      throw new BalancedTeamGenerationError(
        'The selected pool cannot build a six-Pokémon team with only one starter.',
      );
    }
    const ranked = eligible
      .map(candidate => ({
        candidate,
        score: scoreTeamBalance([...team, candidate], mode).total,
        tieBreaker: randomUnit(random),
      }))
      .sort(
        (left, right) =>
          right.score - left.score || right.tieBreaker - left.tieBreaker,
      );
    const choices = ranked.slice(
      0,
      Math.min(selectionWindow, ranked.length),
    );
    const choice =
      choices[Math.floor(randomUnit(random) * choices.length)].candidate;
    team.push(choice);
    remaining.splice(remaining.indexOf(choice), 1);
  }

  return team;
}

export async function generateBalancedTeam(
  options: GenerateBalancedTeamOptions,
): Promise<GeneratedTeamPokemon[]> {
  const {
    apiClient = defaultPokeApiClient,
    random = Math.random,
    scope,
    signal,
  } = options;
  const mode =
    options.mode ??
    (scope.kind === 'region' || scope.kind === 'game' ? 'adventure' : 'general');
  const concurrency = boundedInteger(
    options.concurrency,
    DEFAULT_CONCURRENCY,
    1,
    MAX_CONCURRENCY,
  );
  const candidateCount = boundedInteger(
    options.candidateCount,
    DEFAULT_CANDIDATE_COUNT,
    TEAM_SIZE,
    MAX_CANDIDATE_COUNT,
  );
  const selectionWindow = boundedInteger(
    options.selectionWindow,
    DEFAULT_SELECTION_WINDOW,
    1,
    TEAM_SIZE,
  );
  const pool = await resolvePokemonSpeciesPool(scope, {
    apiClient,
    concurrency,
    signal,
  });
  throwIfAborted(signal);
  const allowedStarterRoots =
    mode === 'adventure' &&
    (scope.kind === 'region' || scope.kind === 'game')
      ? adventureStarterRoots(scope.kind, scope.value)
      : STARTER_ROOT_SPECIES;
  if (mode === 'adventure' && allowedStarterRoots.size === 0) {
    throw new BalancedTeamGenerationError(
      'No starter data is available for the selected adventure.',
    );
  }
  let gameAvailability: GameAvailability | undefined;
  if (scope.kind === 'game') {
    const versionName = encodeURIComponent(scope.value.trim().toLowerCase());
    const version = await apiClient.get<VersionResponse>(
      `version/${versionName}`,
      signal,
    );
    const versionGroup = await apiClient.get<VersionGroupResponse>(
      version.version_group.url,
      signal,
    );
    gameAvailability = {
      selectedVersion: scope.value.trim().toLowerCase(),
      siblingVersions: new Set(
        versionGroup.versions
          .map(candidate => candidate.name)
          .filter(candidate => candidate !== scope.value.trim().toLowerCase()),
      ),
    };
  }

  if (pool.length < TEAM_SIZE) {
    throw new BalancedTeamGenerationError(
      `The selected scope contains only ${pool.length} Pokémon; six are required.`,
    );
  }

  const shuffledPool = shuffle(pool, random);
  const sampleSize = Math.min(candidateCount, pool.length);
  const sampledSpecies = (() => {
    if (mode !== 'adventure') return shuffledPool.slice(0, sampleSize);

    const allowedFinalStarters = finalStarterSpecies(allowedStarterRoots);
    const starterCandidates = shuffledPool.filter(species =>
      allowedFinalStarters.has(species.name),
    );
    const starterQuota = Math.min(
      starterCandidates.length,
      Math.max(1, Math.min(3, sampleSize - (TEAM_SIZE - 1))),
    );
    const ordinaryCandidates = shuffledPool.filter(
      species => !allowedFinalStarters.has(species.name),
    );
    return [
      ...starterCandidates.slice(0, starterQuota),
      ...ordinaryCandidates.slice(0, sampleSize - starterQuota),
    ];
  })();
  const failures: unknown[] = [];
  const evolutionChains = new Map<string, Promise<EvolutionChainResponse>>();
  const encounterCache = new Map<string, Promise<EncounterResponse>>();
  const loaded = await mapWithConcurrency(
    sampledSpecies,
    concurrency,
    async species => {
      try {
        return await loadDefaultVariety(
          species,
          apiClient,
          evolutionChains,
          encounterCache,
          mode,
          allowedStarterRoots,
          gameAvailability,
          signal,
        );
      } catch (error) {
        if (isAbortError(error, signal)) throw error;
        failures.push(error);
        return null;
      }
    },
    signal,
  );
  throwIfAborted(signal);

  const candidates = loaded.filter(
    (pokemon): pokemon is GeneratedTeamPokemon => pokemon !== null,
  );
  if (candidates.length < TEAM_SIZE) {
    throw new BalancedTeamGenerationError(
      `Only ${candidates.length} final-evolution candidates could be loaded; six are required.`,
      failures[0],
    );
  }

  return selectBalancedTeam(candidates, mode, random, selectionWindow);
}
