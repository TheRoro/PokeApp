import {
  defaultPokeApiClient,
  mapWithConcurrency,
  NamedApiResource,
  NamedApiResourceList,
  PokeApiClient,
  throwIfAborted,
} from './pokeApiClient';
import { ADVENTURE_GAME_NAMES } from './adventureStarters';

export type TeamGenerationScope =
  | { kind: 'all' }
  | { kind: 'generation'; value: string }
  | { kind: 'region'; value: string }
  | { kind: 'game'; value: string };

export type TeamFilterOption = {
  label: string;
  value: string;
};

export type TeamFilterCatalog = {
  all: TeamFilterOption;
  games: TeamFilterOption[];
  generations: TeamFilterOption[];
  regions: TeamFilterOption[];
};

export type LoadTeamFilterCatalogOptions = {
  apiClient?: PokeApiClient;
  concurrency?: number;
  signal?: AbortSignal;
};

type VersionGroupResponse = {
  name: string;
  pokedexes: NamedApiResource[];
  versions: NamedApiResource[];
};

type RegionResponse = {
  name: string;
  pokedexes: NamedApiResource[];
};

function titleCaseSlug(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function generationLabel(value: string): string {
  const numeral = value.replace(/^generation-/, '');
  return `Generation ${numeral.toUpperCase()}`;
}

function toOptions(
  resources: NamedApiResource[],
  label: (name: string) => string,
): TeamFilterOption[] {
  return resources.map(resource => ({
    label: label(resource.name),
    value: resource.name,
  }));
}

export async function loadTeamFilterCatalog(
  options: LoadTeamFilterCatalogOptions = {},
): Promise<TeamFilterCatalog> {
  const {
    apiClient = defaultPokeApiClient,
    concurrency = 6,
    signal,
  } = options;
  throwIfAborted(signal);

  const [generationList, regionList, versionGroupList] = await Promise.all([
    apiClient.get<NamedApiResourceList>(
      'generation?limit=100',
      signal,
    ),
    apiClient.get<NamedApiResourceList>('region?limit=100', signal),
    apiClient.get<NamedApiResourceList>(
      'version-group?limit=100',
      signal,
    ),
  ]);

  const [regions, versionGroups] = await Promise.all([
    mapWithConcurrency(
      regionList.results,
      concurrency,
      resource => apiClient.get<RegionResponse>(resource.url, signal),
      signal,
    ),
    mapWithConcurrency(
      versionGroupList.results,
      concurrency,
      resource => apiClient.get<VersionGroupResponse>(resource.url, signal),
      signal,
    ),
  ]);
  throwIfAborted(signal);

  return {
    all: { label: 'All Pokémon', value: 'all' },
    generations: toOptions(generationList.results, generationLabel),
    regions: regions
      .filter(region => region.pokedexes.length > 0)
      .map(region => ({
        label: titleCaseSlug(region.name),
        value: region.name,
      })),
    games: versionGroups
      .filter(versionGroup => versionGroup.pokedexes.length > 0)
      .flatMap(versionGroup =>
        toOptions(versionGroup.versions, titleCaseSlug),
      )
      .filter(game => ADVENTURE_GAME_NAMES.has(game.value)),
  };
}
