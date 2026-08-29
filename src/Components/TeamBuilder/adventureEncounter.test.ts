import {
  buildAdventureEncounterInfo,
  EvolutionNode,
} from './adventureEncounter';
import { NamedApiResource, PokeApiClient } from './pokeApiClient';

function resource(name: string): NamedApiResource {
  return { name, url: `${name}-url` };
}

function mockClient(responses: Record<string, unknown>): PokeApiClient {
  return {
    get: vi.fn(async request => responses[request]) as PokeApiClient['get'],
  };
}

test('describes a game encounter and trade evolution path', async () => {
  const chain: EvolutionNode = {
    species: resource('machop'),
    evolves_to: [
      {
        species: resource('machoke'),
        evolution_details: [
          {
            min_level: 28,
            trigger: resource('level-up'),
          },
        ],
        evolves_to: [
          {
            species: resource('machamp'),
            evolution_details: [{ trigger: resource('trade') }],
            evolves_to: [],
          },
        ],
      },
    ],
  };
  const apiClient = mockClient({
    'pokemon/machop/encounters': [
      {
        location_area: resource('kanto-route-10-area'),
        version_details: [
          {
            version: resource('firered'),
            encounter_details: [
              {
                chance: 10,
                min_level: 16,
                max_level: 18,
                method: resource('walk'),
              },
            ],
          },
        ],
      },
    ],
  });

  await expect(
    buildAdventureEncounterInfo({
      apiClient,
      chain,
      encounterCache: new Map(),
      isStarter: false,
      scope: { kind: 'game', value: 'firered' },
      targetSpecies: 'machamp',
    }),
  ).resolves.toEqual({
    encounterMethod: 'Walking',
    evolutionMethod: 'Machop -> Machoke (level 28) -> Machamp (trade)',
    levelRange: 'Levels 16 to 18',
    location: 'Kanto Route 10 Area',
    sourcePokemon: 'Machop',
    tradeRequired: true,
    version: 'Firered',
  });
});

test('uses a representative version when showing regional encounters', async () => {
  const chain: EvolutionNode = {
    species: resource('mareep'),
    evolves_to: [],
  };
  const apiClient = mockClient({
    'pokemon/mareep/encounters': [
      {
        location_area: resource('johto-route-32'),
        version_details: [
          {
            version: resource('gold'),
            encounter_details: [
              {
                chance: 20,
                min_level: 6,
                max_level: 6,
                method: resource('walk'),
              },
            ],
          },
          {
            version: resource('heartgold'),
            encounter_details: [
              {
                chance: 20,
                min_level: 6,
                max_level: 6,
                method: resource('walk'),
              },
            ],
          },
        ],
      },
    ],
  });

  const result = await buildAdventureEncounterInfo({
    apiClient,
    chain,
    encounterCache: new Map(),
    isStarter: false,
    scope: { kind: 'region', value: 'johto' },
    targetSpecies: 'mareep',
  });

  expect(result.version).toBe('Heartgold');
  expect(result.location).toBe('Johto Route 32');
});
