import { PokeApiClient } from './pokeApiClient';
import { loadTeamFilterCatalog } from './teamFilterCatalog';

function mockApiClient(responses: Record<string, unknown>): PokeApiClient {
  const get = vi.fn(async (resource: string): Promise<unknown> => {
    if (!(resource in responses)) {
      throw new Error(`Unexpected request: ${resource}`);
    }
    return responses[resource];
  });

  return {
    get: get as PokeApiClient['get'],
  };
}

describe('random team filter catalog', () => {
  test('loads dynamic generation, region, and usable game metadata', async () => {
    const apiClient = mockApiClient({
      'generation?limit=100': {
        results: [
          { name: 'generation-i', url: 'generation/1' },
          { name: 'generation-ix', url: 'generation/9' },
        ],
      },
      'region?limit=100': {
        results: [
          { name: 'kanto', url: 'region/1' },
          { name: 'paldea', url: 'region/10' },
          { name: 'orre', url: 'region/3' },
        ],
      },
      'region/1': {
        name: 'kanto',
        pokedexes: [{ name: 'kanto', url: 'pokedex/2' }],
      },
      'region/10': {
        name: 'paldea',
        pokedexes: [{ name: 'paldea', url: 'pokedex/31' }],
      },
      'region/3': {
        name: 'orre',
        pokedexes: [],
      },
      'version-group?limit=100': {
        results: [
          { name: 'red-blue', url: 'version-group/1' },
          { name: 'colosseum', url: 'version-group/12' },
          { name: 'scarlet-violet', url: 'version-group/25' },
          { name: 'champions', url: 'version-group/32' },
        ],
      },
      'version-group/1': {
        name: 'red-blue',
        pokedexes: [{ name: 'kanto', url: 'pokedex/2' }],
        versions: [
          { name: 'red', url: 'version/1' },
          { name: 'blue', url: 'version/2' },
        ],
      },
      'version-group/12': {
        name: 'colosseum',
        pokedexes: [],
        versions: [{ name: 'colosseum', url: 'version/19' }],
      },
      'version-group/25': {
        name: 'scarlet-violet',
        pokedexes: [{ name: 'paldea', url: 'pokedex/31' }],
        versions: [
          { name: 'scarlet', url: 'version/34' },
          { name: 'violet', url: 'version/35' },
        ],
      },
      'version-group/32': {
        name: 'champions',
        pokedexes: [{ name: 'champions', url: 'pokedex/40' }],
        versions: [{ name: 'champions', url: 'version/51' }],
      },
    });

    await expect(loadTeamFilterCatalog({ apiClient })).resolves.toEqual({
      all: { label: 'All Pokémon', value: 'all' },
      generations: [
        { label: 'Generation I', value: 'generation-i' },
        { label: 'Generation IX', value: 'generation-ix' },
      ],
      regions: [
        { label: 'Kanto', value: 'kanto' },
        { label: 'Paldea', value: 'paldea' },
      ],
      games: [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Scarlet', value: 'scarlet' },
        { label: 'Violet', value: 'violet' },
      ],
    });
  });

  test('propagates catalog request failures', async () => {
    const get = vi.fn(async (): Promise<never> => {
      throw new Error('PokeAPI unavailable');
    });
    const apiClient: PokeApiClient = {
      get: get as PokeApiClient['get'],
    };

    await expect(loadTeamFilterCatalog({ apiClient })).rejects.toThrow(
      'PokeAPI unavailable',
    );
  });
});
