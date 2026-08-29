import { formatPokemonName } from '../Tools/pokemonNames';
import {
  defaultPokeApiClient,
  NamedApiResource,
  PokeApiClient,
  throwIfAborted,
} from './pokeApiClient';
import { adventureStarterRoots } from './adventureStarters';
import type { AdventureEncounterInfo } from './adventureEncounterInfo';
import { TeamGenerationScope } from './teamFilterCatalog';

export type EvolutionDetail = {
  gender?: number | null;
  held_item?: NamedApiResource | null;
  item?: NamedApiResource | null;
  known_move?: NamedApiResource | null;
  known_move_type?: NamedApiResource | null;
  location?: NamedApiResource | null;
  min_affection?: number | null;
  min_beauty?: number | null;
  min_happiness?: number | null;
  min_level?: number | null;
  needs_overworld_rain?: boolean;
  party_species?: NamedApiResource | null;
  party_type?: NamedApiResource | null;
  relative_physical_stats?: number | null;
  time_of_day?: string;
  trade_species?: NamedApiResource | null;
  trigger: NamedApiResource;
  turn_upside_down?: boolean;
};

export type EvolutionNode = {
  evolution_details?: EvolutionDetail[];
  evolves_to: EvolutionNode[];
  species: NamedApiResource;
};

type EncounterDetail = {
  chance?: number;
  condition_values?: NamedApiResource[];
  max_level?: number;
  method?: NamedApiResource;
  min_level?: number;
};

export type EncounterResponse = Array<{
  location_area?: NamedApiResource;
  version_details: Array<{
    encounter_details?: EncounterDetail[];
    version: NamedApiResource;
  }>;
}>;

const REGION_VERSION_PRIORITY: Record<string, readonly string[]> = {
  kanto: [
    'firered',
    'leafgreen',
    'red',
    'blue',
    'yellow',
    'lets-go-pikachu',
    'lets-go-eevee',
  ],
  johto: ['heartgold', 'soulsilver', 'crystal', 'gold', 'silver'],
  hoenn: ['omega-ruby', 'alpha-sapphire', 'emerald', 'ruby', 'sapphire'],
  sinnoh: [
    'brilliant-diamond',
    'shining-pearl',
    'platinum',
    'diamond',
    'pearl',
  ],
  unova: ['black-2', 'white-2', 'black', 'white'],
  kalos: ['x', 'y'],
  alola: ['ultra-sun', 'ultra-moon', 'sun', 'moon'],
  galar: ['sword', 'shield'],
  hisui: ['legends-arceus'],
  paldea: ['scarlet', 'violet'],
};

type EncounterCandidate = {
  detail: EncounterDetail;
  location: string;
  version: string;
};

type AdventureEncounterOptions = {
  apiClient: PokeApiClient;
  chain: EvolutionNode;
  encounterCache: Map<string, Promise<EncounterResponse>>;
  isStarter: boolean;
  scope: Extract<TeamGenerationScope, { kind: 'game' | 'region' }>;
  signal?: AbortSignal;
  targetSpecies: string;
};

type LoadAdventureEncounterOptions = {
  apiClient?: PokeApiClient;
  pokemonName: string;
  scope: Extract<TeamGenerationScope, { kind: 'game' | 'region' }>;
  signal?: AbortSignal;
};

type PokemonSpeciesEncounterResponse = {
  evolution_chain: NamedApiResource;
  name: string;
};

type EvolutionChainEncounterResponse = {
  chain: EvolutionNode;
};

function findEvolutionPath(
  node: EvolutionNode,
  targetSpecies: string,
): EvolutionNode[] | null {
  if (node.species.name === targetSpecies) return [node];
  for (const child of node.evolves_to) {
    const childPath = findEvolutionPath(child, targetSpecies);
    if (childPath) return [node, ...childPath];
  }
  return null;
}

function detailForNode(node: EvolutionNode): EvolutionDetail | undefined {
  return node.evolution_details?.[0];
}

function describeEvolutionDetail(detail: EvolutionDetail | undefined): string {
  if (!detail) return 'Evolution method not listed';
  const trigger = detail.trigger.name;
  const requirements: string[] = [];

  if (detail.min_level != null) requirements.push(`level ${detail.min_level}`);
  if (detail.item) requirements.push(`use ${formatPokemonName(detail.item.name)}`);
  if (detail.held_item) {
    requirements.push(`hold ${formatPokemonName(detail.held_item.name)}`);
  }
  if (detail.trade_species) {
    requirements.push(`trade for ${formatPokemonName(detail.trade_species.name)}`);
  }
  if (detail.min_happiness != null) requirements.push('high friendship');
  if (detail.min_affection != null) requirements.push('high affection');
  if (detail.min_beauty != null) requirements.push('high beauty');
  if (detail.known_move) {
    requirements.push(`know ${formatPokemonName(detail.known_move.name)}`);
  }
  if (detail.known_move_type) {
    requirements.push(
      `know a ${formatPokemonName(detail.known_move_type.name)} move`,
    );
  }
  if (detail.location) {
    requirements.push(`at ${formatPokemonName(detail.location.name)}`);
  }
  if (detail.time_of_day) requirements.push(detail.time_of_day);
  if (detail.needs_overworld_rain) requirements.push('while raining');
  if (detail.party_species) {
    requirements.push(
      `with ${formatPokemonName(detail.party_species.name)} in the party`,
    );
  }
  if (detail.party_type) {
    requirements.push(
      `with a ${formatPokemonName(detail.party_type.name)} type in the party`,
    );
  }
  if (detail.turn_upside_down) requirements.push('while holding the system upside down');
  if (detail.relative_physical_stats === 1) {
    requirements.push('Attack higher than Defense');
  } else if (detail.relative_physical_stats === -1) {
    requirements.push('Defense higher than Attack');
  } else if (detail.relative_physical_stats === 0) {
    requirements.push('Attack equal to Defense');
  }

  if (trigger === 'trade' && requirements.length === 0) return 'trade';
  if (trigger === 'use-item' && requirements.length > 0) {
    return requirements.join(', ');
  }
  if (trigger === 'level-up' && requirements.length > 0) {
    return requirements.join(', ');
  }
  const triggerLabel = formatPokemonName(trigger);
  return requirements.length > 0
    ? `${triggerLabel}: ${requirements.join(', ')}`
    : triggerLabel;
}

function describeEvolution(path: readonly EvolutionNode[]): string {
  if (path.length <= 1) return 'No evolution required';
  return path
    .map((node, index) =>
      index === 0
        ? formatPokemonName(node.species.name)
        : `${formatPokemonName(node.species.name)} (${describeEvolutionDetail(
            detailForNode(node),
          )})`,
    )
    .join(' -> ');
}

function methodLabel(detail: EncounterDetail): string {
  const method = detail.method?.name ?? 'unknown';
  const labels: Record<string, string> = {
    'cave-spots': 'Cave spots',
    'dark-grass': 'Dark grass',
    gift: 'Gift',
    'gift-egg': 'Gift Egg',
    headbutt: 'Headbutt',
    'old-rod': 'Old Rod',
    'good-rod': 'Good Rod',
    'super-rod': 'Super Rod',
    'rock-smash': 'Rock Smash',
    surf: 'Surfing',
    walk: 'Walking',
  };
  const base = labels[method] ?? formatPokemonName(method);
  const conditions =
    detail.condition_values
      ?.map(condition => formatPokemonName(condition.name))
      .filter(Boolean) ?? [];
  return conditions.length > 0 ? `${base} (${conditions.join(', ')})` : base;
}

function levelLabel(detail: EncounterDetail): string {
  const minimum = detail.min_level;
  const maximum = detail.max_level;
  if (minimum == null && maximum == null) return 'Level not listed';
  if (minimum == null) return `Up to level ${maximum}`;
  if (maximum == null || minimum === maximum) return `Level ${minimum}`;
  return `Levels ${minimum} to ${maximum}`;
}

function encounterCandidates(
  encounters: EncounterResponse,
  allowedVersions: readonly string[],
): EncounterCandidate[] {
  const priority = new Map(
    allowedVersions.map((version, index) => [version, index]),
  );
  return encounters
    .flatMap(encounter =>
      encounter.version_details.flatMap(versionDetail => {
        if (!priority.has(versionDetail.version.name)) return [];
        const details = versionDetail.encounter_details ?? [{}];
        return details.map(detail => ({
          detail,
          location:
            encounter.location_area?.name ?? 'Location not listed',
          version: versionDetail.version.name,
        }));
      }),
    )
    .sort((left, right) => {
      const versionDifference =
        (priority.get(left.version) ?? Number.MAX_SAFE_INTEGER) -
        (priority.get(right.version) ?? Number.MAX_SAFE_INTEGER);
      if (versionDifference !== 0) return versionDifference;
      const levelDifference =
        (left.detail.min_level ?? Number.MAX_SAFE_INTEGER) -
        (right.detail.min_level ?? Number.MAX_SAFE_INTEGER);
      if (levelDifference !== 0) return levelDifference;
      return (right.detail.chance ?? 0) - (left.detail.chance ?? 0);
    });
}

async function loadEncounters(
  speciesName: string,
  apiClient: PokeApiClient,
  encounterCache: Map<string, Promise<EncounterResponse>>,
  signal?: AbortSignal,
): Promise<EncounterResponse> {
  let request = encounterCache.get(speciesName);
  if (!request) {
    request = apiClient.get<EncounterResponse>(
      `pokemon/${encodeURIComponent(speciesName)}/encounters`,
      signal,
    );
    encounterCache.set(speciesName, request);
  }
  const encounters = await request;
  throwIfAborted(signal);
  return encounters;
}

export async function buildAdventureEncounterInfo({
  apiClient,
  chain,
  encounterCache,
  isStarter,
  scope,
  signal,
  targetSpecies,
}: AdventureEncounterOptions): Promise<AdventureEncounterInfo> {
  const fullPath = findEvolutionPath(chain, targetSpecies) ?? [chain];
  const allowedVersions =
    scope.kind === 'game'
      ? [scope.value.trim().toLowerCase()]
      : REGION_VERSION_PRIORITY[scope.value.trim().toLowerCase()] ?? [];

  if (isStarter) {
    return {
      encounterMethod: 'Starter gift',
      evolutionMethod: describeEvolution(fullPath),
      levelRange: 'Usually level 5',
      location: 'Starter selection',
      sourcePokemon: formatPokemonName(fullPath[0].species.name),
      tradeRequired: fullPath
        .slice(1)
        .some(node => detailForNode(node)?.trigger.name === 'trade'),
      version: formatPokemonName(scope.value),
    };
  }

  for (let index = 0; index < fullPath.length; index += 1) {
    const node = fullPath[index];
    const encounters = await loadEncounters(
      node.species.name,
      apiClient,
      encounterCache,
      signal,
    );
    const selected = encounterCandidates(encounters, allowedVersions)[0];
    if (!selected) continue;
    const remainingPath = fullPath.slice(index);
    return {
      encounterMethod: methodLabel(selected.detail),
      evolutionMethod: describeEvolution(remainingPath),
      levelRange: levelLabel(selected.detail),
      location: formatPokemonName(selected.location),
      sourcePokemon: formatPokemonName(node.species.name),
      tradeRequired: remainingPath
        .slice(1)
        .some(pathNode => detailForNode(pathNode)?.trigger.name === 'trade'),
      version: formatPokemonName(selected.version),
    };
  }

  return {
    encounterMethod: 'Special encounter, gift, or in-game trade',
    evolutionMethod: describeEvolution(fullPath),
    levelRange: 'Varies',
    location: 'No wild encounter listed',
    sourcePokemon: formatPokemonName(fullPath[0].species.name),
    tradeRequired: fullPath
      .slice(1)
      .some(node => detailForNode(node)?.trigger.name === 'trade'),
    version: formatPokemonName(scope.value),
  };
}

export async function loadAdventureEncounterInfo({
  apiClient = defaultPokeApiClient,
  pokemonName,
  scope,
  signal,
}: LoadAdventureEncounterOptions): Promise<AdventureEncounterInfo> {
  const species = await apiClient.get<PokemonSpeciesEncounterResponse>(
    `pokemon-species/${encodeURIComponent(pokemonName)}`,
    signal,
  );
  throwIfAborted(signal);
  const evolutionChain = await apiClient.get<EvolutionChainEncounterResponse>(
    species.evolution_chain.url,
    signal,
  );
  throwIfAborted(signal);
  const starterRoots = adventureStarterRoots(scope.kind, scope.value);

  return buildAdventureEncounterInfo({
    apiClient,
    chain: evolutionChain.chain,
    encounterCache: new Map(),
    isStarter: starterRoots.has(evolutionChain.chain.species.name),
    scope,
    signal,
    targetSpecies: species.name,
  });
}
