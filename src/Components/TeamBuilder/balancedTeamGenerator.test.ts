import {
  BalancedTeamGenerationError,
  generateBalancedTeam,
  resolvePokemonSpeciesPool,
  scoreTeamBalance,
} from './balancedTeamGenerator';
import { NamedApiResource, PokeApiClient } from './pokeApiClient';
import { TeamPokemon } from './teamAnalysis';

function resource(name: string, url = `${name}-url`): NamedApiResource {
  return { name, url };
}

function mockApiClient(responses: Record<string, unknown>): PokeApiClient {
  const get = vi.fn(async (request: string): Promise<unknown> => {
    if (!(request in responses)) {
      throw new Error(`Unexpected request: ${request}`);
    }
    const response = responses[request];
    if (response instanceof Error) throw response;
    return response;
  });

  return {
    get: get as PokeApiClient['get'],
  };
}

function pokemonResponse(
  id: number,
  name: string,
  types: string[],
  stats: Record<string, number>,
) {
  return {
    id,
    name,
    sprites: {
      front_default: `${name}.png`,
      other: { 'official-artwork': { front_default: null } },
    },
    stats: Object.entries(stats).map(([statName, baseStat]) => ({
      base_stat: baseStat,
      stat: { name: statName },
    })),
    types: types.map(type => ({ type: { name: type } })),
  };
}

function teamMember(
  id: number,
  name: string,
  types: string[],
  baseStats: Record<string, number>,
): TeamPokemon {
  return {
    id,
    name,
    displayName: name,
    imageUrl: `${name}.png`,
    types,
    baseStats,
  };
}

const balancedStats = {
  hp: 80,
  attack: 80,
  defense: 80,
  'special-attack': 80,
  'special-defense': 80,
  speed: 80,
};

function adventureGameResponses(
  game: string,
  starterSpecies: string,
  starterPokemon: string,
): Record<string, unknown> {
  const ordinarySpecies = [
    'arcanine',
    'starmie',
    'machamp',
    'alakazam',
    'golem',
  ];
  const species = [starterSpecies, ...ordinarySpecies];
  const responses: Record<string, unknown> = {
    [`version/${game}`]: {
      name: game,
      version_group: resource(game, `version-group/${game}`),
    },
    [`version-group/${game}`]: {
      name: game,
      pokedexes: [resource(game, `pokedex/${game}`)],
      versions: [resource(game, `version/${game}`)],
    },
    [`pokedex/${game}`]: {
      pokemon_entries: species.map(name => ({
        pokemon_species: resource(name),
      })),
    },
  };

  species.forEach((name, index) => {
    const isStarter = name === starterSpecies;
    const starterRoot =
      starterSpecies === 'decidueye'
        ? 'rowlet'
        : starterSpecies === 'pikachu'
          ? 'pichu'
          : starterSpecies;
    const starterMiddle =
      starterSpecies === 'decidueye'
        ? {
            species: resource('dartrix'),
            evolves_to: [
              {
                species: resource('decidueye'),
                evolves_to: [],
              },
            ],
          }
        : starterSpecies === 'pikachu'
          ? {
              species: resource('pikachu'),
              evolves_to: [
                {
                  species: resource('raichu'),
                  evolves_to: [],
                },
              ],
            }
          : null;
    const chain = isStarter
      ? {
          species: resource(starterRoot),
          evolves_to: starterMiddle
            ? [starterMiddle]
            : [
                {
                  species: resource('vaporeon'),
                  evolves_to: [],
                },
              ],
        }
      : {
          species: resource(name),
          evolves_to: [],
        };
    const defaultPokemon = `${name}-pokemon`;
    responses[`${name}-url`] = {
      evolution_chain: resource(name, `${name}-chain-url`),
      is_legendary: false,
      is_mythical: false,
      name,
      varieties: [
        {
          is_default: true,
          pokemon: resource(name, defaultPokemon),
        },
        ...(starterPokemon === name
          ? []
          : [
              {
                is_default: false,
                pokemon: resource(starterPokemon, `${starterPokemon}-url`),
              },
            ]),
      ],
    };
    responses[`${name}-chain-url`] = { chain };
    responses[
      isStarter && starterPokemon !== name
        ? `${starterPokemon}-url`
        : defaultPokemon
    ] = pokemonResponse(
      index + 1,
      isStarter ? starterPokemon : name,
      ['normal'],
      balancedStats,
    );
    if (!isStarter) {
      responses[`pokemon/${name}/encounters`] = [];
    }
  });

  return responses;
}

describe('random team scope resolution', () => {
  test('resolves all Pokémon and generation species without forms', async () => {
    const apiClient = mockApiClient({
      'pokemon-species?limit=100000': {
        results: [
          resource('bulbasaur'),
          resource('bulbasaur', 'duplicate-url'),
          resource('charmander'),
        ],
      },
      'generation/generation-i': {
        pokemon_species: [resource('squirtle'), resource('pikachu')],
      },
    });

    await expect(
      resolvePokemonSpeciesPool({ kind: 'all' }, { apiClient }),
    ).resolves.toEqual([resource('bulbasaur'), resource('charmander')]);
    await expect(
      resolvePokemonSpeciesPool(
        { kind: 'generation', value: 'generation-i' },
        { apiClient },
      ),
    ).resolves.toEqual([resource('squirtle'), resource('pikachu')]);
  });

  test('uses the primary regional Pokédex and each game Pokédex segment', async () => {
    const apiClient = mockApiClient({
      'region/johto': {
        name: 'johto',
        pokedexes: [
          resource('original-johto', 'pokedex/original-johto'),
          resource('updated-johto', 'pokedex/updated-johto'),
        ],
      },
      'pokedex/original-johto': {
        pokemon_entries: [
          { pokemon_species: resource('chikorita') },
          { pokemon_species: resource('cyndaquil') },
        ],
      },
      'version/x': {
        name: 'x',
        version_group: resource('x-y', 'version-group/x-y'),
      },
      'version-group/x-y': {
        name: 'x-y',
        versions: [
          resource('x', 'version/x'),
          resource('y', 'version/y'),
        ],
        pokedexes: [
          resource('kalos-central', 'pokedex/central'),
          resource('kalos-coastal', 'pokedex/coastal'),
        ],
      },
      'pokedex/central': {
        pokemon_entries: [
          { pokemon_species: resource('chespin') },
          { pokemon_species: resource('fennekin') },
        ],
      },
      'pokedex/coastal': {
        pokemon_entries: [
          { pokemon_species: resource('froakie') },
          { pokemon_species: resource('chespin', 'duplicate-chespin') },
        ],
      },
    });

    await expect(
      resolvePokemonSpeciesPool(
        { kind: 'region', value: 'johto' },
        { apiClient },
      ),
    ).resolves.toEqual([resource('chikorita'), resource('cyndaquil')]);
    await expect(
      resolvePokemonSpeciesPool(
        { kind: 'game', value: 'x' },
        { apiClient },
      ),
    ).resolves.toEqual([
      resource('chespin'),
      resource('fennekin'),
      resource('froakie'),
    ]);
    expect(apiClient.get).not.toHaveBeenCalledWith(
      'pokedex/updated-johto',
      undefined,
    );
  });
});

describe('balanced random team generation', () => {
  test.each([
    ['yellow', 'pikachu', 'pikachu'],
    ['lets-go-pikachu', 'pikachu', 'pikachu-starter'],
    ['lets-go-eevee', 'eevee', 'eevee-starter'],
  ])(
    'uses the non-evolving partner starter in %s',
    async (game, starterSpecies, starterPokemon) => {
      const team = await generateBalancedTeam({
        apiClient: mockApiClient(
          adventureGameResponses(game, starterSpecies, starterPokemon),
        ),
        candidateCount: 6,
        mode: 'adventure',
        random: () => 0,
        scope: { kind: 'game', value: game },
        selectionWindow: 1,
      });

      expect(team).toHaveLength(6);
      expect(team.filter(member => member.isStarter)).toHaveLength(1);
      expect(team.find(member => member.isStarter)).toMatchObject({
        name: starterPokemon,
        speciesName: starterSpecies,
        adventureInfo: {
          encounterMethod: 'Starter gift',
          evolutionMethod: 'No evolution required',
          sourcePokemon:
            starterSpecies === 'eevee' ? 'Eevee' : 'Pikachu',
        },
      });
    },
  );

  test('uses the Hisuian final form for a Legends Arceus starter', async () => {
    const team = await generateBalancedTeam({
      apiClient: mockApiClient(
        adventureGameResponses(
          'legends-arceus',
          'decidueye',
          'decidueye-hisui',
        ),
      ),
      candidateCount: 6,
      mode: 'adventure',
      random: () => 0,
      scope: { kind: 'game', value: 'legends-arceus' },
      selectionWindow: 1,
    });

    expect(team.filter(member => member.isStarter)).toHaveLength(1);
    expect(team.find(member => member.isStarter)).toMatchObject({
      name: 'decidueye-hisui',
      displayName: 'Hisuian Decidueye',
      speciesName: 'decidueye',
      adventureInfo: {
        encounterMethod: 'Starter gift',
      },
    });
  });

  test('returns six unique default species with stats using bounded concurrency', async () => {
    const species = [
      ['bulbasaur', 'grass'],
      ['charmander', 'fire'],
      ['squirtle', 'water'],
      ['pikachu', 'electric'],
      ['geodude', 'rock'],
      ['abra', 'psychic'],
      ['machop', 'fighting'],
      ['gastly', 'ghost'],
      ['onix', 'rock'],
      ['kangaskhan', 'normal'],
    ] as const;
    const responses: Record<string, unknown> = {
      'generation/generation-i': {
        pokemon_species: species.map(([name]) => resource(name)),
      },
    };

    species.forEach(([name, type], index) => {
      responses[`${name}-url`] = {
        evolution_chain: resource(name, `${name}-chain-url`),
        name,
        varieties: [
          {
            is_default: false,
            pokemon: resource(`${name}-mega`, `${name}-mega-url`),
          },
          {
            is_default: true,
            pokemon: resource(name, `${name}-pokemon-url`),
          },
        ],
      };
      responses[`${name}-chain-url`] = {
        chain: {
          species: resource(name),
          evolves_to: [],
        },
      };
      responses[`${name}-pokemon-url`] = pokemonResponse(
        index + 1,
        name,
        [type],
        balancedStats,
      );
    });

    let activeRequests = 0;
    let maximumActiveRequests = 0;
    const baseClient = mockApiClient(responses);
    const get = vi.fn(
      async (
        request: string,
        signal?: AbortSignal,
      ): Promise<unknown> => {
        activeRequests += 1;
        maximumActiveRequests = Math.max(
          maximumActiveRequests,
          activeRequests,
        );
        await Promise.resolve();
        try {
          return await baseClient.get(request, signal);
        } finally {
          activeRequests -= 1;
        }
      },
    );
    const apiClient: PokeApiClient = {
      get: get as PokeApiClient['get'],
    };

    const team = await generateBalancedTeam({
      apiClient,
      candidateCount: species.length,
      concurrency: 2,
      random: () => 0,
      scope: { kind: 'generation', value: 'generation-i' },
      selectionWindow: 1,
    });

    expect(team).toHaveLength(6);
    expect(new Set(team.map(pokemon => pokemon.speciesName))).toHaveLength(6);
    expect(team.every(pokemon => pokemon.baseStats?.hp === 80)).toBe(true);
    expect(team.filter(pokemon => pokemon.isStarter)).toHaveLength(1);
    expect(
      (apiClient.get as ReturnType<typeof vi.fn>).mock.calls.some(
        ([request]) => String(request).includes('-mega-url'),
      ),
    ).toBe(false);
    expect(maximumActiveRequests).toBeLessThanOrEqual(2);
  });

  test('adventure mode excludes unfinished evolutions and special Pokémon', async () => {
    const species = [
      'bulbasaur',
      'venusaur',
      'charizard',
      'blastoise',
      'raichu',
      'alakazam',
      'machamp',
      'golem',
      'gengar',
      'mew',
    ];
    const responses: Record<string, unknown> = {
      'generation/generation-i': {
        pokemon_species: species.map(name => resource(name)),
      },
    };

    species.forEach((name, index) => {
      responses[`${name}-url`] = {
        evolution_chain: resource(name, `${name}-chain-url`),
        is_legendary: false,
        is_mythical: name === 'mew',
        name,
        varieties: [
          {
            is_default: true,
            pokemon: resource(name, `${name}-pokemon-url`),
          },
        ],
      };
      responses[`${name}-chain-url`] = {
        chain:
          name === 'venusaur'
            ? {
                species: resource('bulbasaur'),
                evolves_to: [
                  {
                    species: resource('ivysaur'),
                    evolves_to: [
                      {
                        species: resource('venusaur'),
                        evolves_to: [],
                      },
                    ],
                  },
                ],
              }
            : {
                species: resource(name),
                evolves_to:
                  name === 'bulbasaur'
                    ? [
                        {
                          species: resource('ivysaur'),
                          evolves_to: [],
                        },
                      ]
                    : [],
              },
      };
      responses[`${name}-pokemon-url`] = pokemonResponse(
        index + 1,
        name,
        ['normal'],
        balancedStats,
      );
    });

    const apiClient = mockApiClient(responses);
    const team = await generateBalancedTeam({
      apiClient,
      candidateCount: species.length,
      mode: 'adventure',
      random: () => 0,
      scope: { kind: 'generation', value: 'generation-i' },
      selectionWindow: 1,
    });

    expect(team).toHaveLength(6);
    expect(team.filter(member => member.isStarter)).toHaveLength(1);
    expect(team.map(member => member.name)).not.toContain('bulbasaur');
    expect(team.map(member => member.name)).not.toContain('mew');
    expect(apiClient.get).not.toHaveBeenCalledWith(
      'bulbasaur-pokemon-url',
      undefined,
    );
    expect(apiClient.get).not.toHaveBeenCalledWith(
      'mew-pokemon-url',
      undefined,
    );
  });

  test('uses version encounters to exclude Pokémon from the other game version', async () => {
    const species = [
      'growlithe',
      'vulpix',
      'charizard',
      'raichu',
      'clefable',
      'primeape',
      'golem',
    ];
    const responses: Record<string, unknown> = {
      'version/firered': {
        name: 'firered',
        version_group: resource(
          'firered-leafgreen',
          'version-group/firered-leafgreen',
        ),
      },
      'version-group/firered-leafgreen': {
        name: 'firered-leafgreen',
        pokedexes: [resource('kanto', 'pokedex/kanto')],
        versions: [
          resource('firered', 'version/firered'),
          resource('leafgreen', 'version/leafgreen'),
        ],
      },
      'pokedex/kanto': {
        pokemon_entries: species.map(name => ({
          pokemon_species: resource(name),
        })),
      },
    };

    species.forEach((name, index) => {
      responses[`${name}-url`] = {
        evolution_chain: resource(name, `${name}-chain-url`),
        is_legendary: false,
        is_mythical: false,
        name,
        varieties: [
          {
            is_default: true,
            pokemon: resource(name, `${name}-pokemon-url`),
          },
        ],
      };
      responses[`${name}-chain-url`] = {
        chain:
          name === 'charizard'
            ? {
                species: resource('charmander'),
                evolves_to: [
                  {
                    species: resource('charmeleon'),
                    evolves_to: [
                      {
                        species: resource('charizard'),
                        evolves_to: [],
                      },
                    ],
                  },
                ],
              }
            : {
                species: resource(name),
                evolves_to: [],
              },
      };
      responses[`pokemon/${name}/encounters`] =
        name === 'growlithe'
          ? [
              {
                location_area: resource(
                  'kanto-route-7-area',
                  'location-area/kanto-route-7',
                ),
                version_details: [
                  {
                    version: resource('firered'),
                    encounter_details: [
                      {
                        chance: 20,
                        min_level: 18,
                        max_level: 20,
                        method: resource('walk'),
                      },
                    ],
                  },
                ],
              },
            ]
          : name === 'vulpix'
            ? [
                {
                  version_details: [
                    { version: resource('leafgreen') },
                  ],
                },
              ]
            : [];
      responses[`${name}-pokemon-url`] = pokemonResponse(
        index + 1,
        name,
        ['normal'],
        balancedStats,
      );
    });

    const apiClient = mockApiClient(responses);
    const team = await generateBalancedTeam({
      apiClient,
      candidateCount: species.length,
      random: () => 0,
      scope: { kind: 'game', value: 'firered' },
      selectionWindow: 1,
    });

    expect(team).toHaveLength(6);
    expect(team.filter(member => member.isStarter)).toHaveLength(1);
    expect(team.map(member => member.name)).toContain('growlithe');
    expect(team.map(member => member.name)).not.toContain('vulpix');
    expect(
      team.find(member => member.name === 'growlithe')?.adventureInfo,
    ).toMatchObject({
      encounterMethod: 'Walking',
      levelRange: 'Levels 18 to 20',
      location: 'Kanto Route 7 Area',
      version: 'Firered',
    });
    expect(apiClient.get).not.toHaveBeenCalledWith(
      'vulpix-pokemon-url',
      undefined,
    );
  });

  test('scores diverse typing and stat profiles above a redundant team', () => {
    const redundant = Array.from({ length: 6 }, (_, index) =>
      teamMember(index, `fire-${index}`, ['fire'], balancedStats),
    );
    const diverse = [
      teamMember(1, 'physical-fire', ['fire'], {
        ...balancedStats,
        attack: 125,
        'special-attack': 55,
        speed: 110,
      }),
      teamMember(2, 'special-water', ['water'], {
        ...balancedStats,
        attack: 50,
        'special-attack': 125,
        speed: 105,
      }),
      teamMember(3, 'physical-wall', ['grass', 'steel'], {
        ...balancedStats,
        defense: 140,
        'special-defense': 65,
        speed: 45,
      }),
      teamMember(4, 'special-wall', ['electric', 'flying'], {
        ...balancedStats,
        defense: 60,
        'special-defense': 140,
        speed: 95,
      }),
      teamMember(5, 'slow-ground', ['ground'], {
        ...balancedStats,
        attack: 115,
        speed: 35,
      }),
      teamMember(6, 'fast-ice', ['ice'], {
        ...balancedStats,
        'special-attack': 110,
        speed: 125,
      }),
    ];

    const redundantScore = scoreTeamBalance(redundant);
    const diverseScore = scoreTeamBalance(diverse);

    expect(diverseScore.defensive).toBeGreaterThan(
      redundantScore.defensive,
    );
    expect(diverseScore.offensive).toBeGreaterThan(
      redundantScore.offensive,
    );
    expect(diverseScore.statVariety).toBeGreaterThan(
      redundantScore.statVariety,
    );
    expect(diverseScore.typeDiversity).toBeGreaterThan(
      redundantScore.typeDiversity,
    );
    expect(diverseScore.total).toBeGreaterThan(redundantScore.total);
  });

  test('strongly prefers adding a new type over repeating an existing type', () => {
    const fireCore = [
      teamMember(1, 'charizard', ['fire', 'flying'], balancedStats),
    ];
    const repeated = scoreTeamBalance([
      ...fireCore,
      teamMember(2, 'arcanine', ['fire'], balancedStats),
    ]);
    const diverse = scoreTeamBalance([
      ...fireCore,
      teamMember(3, 'starmie', ['water', 'psychic'], balancedStats),
    ]);

    expect(diverse.typeDiversity - repeated.typeDiversity).toBeGreaterThanOrEqual(
      10,
    );
    expect(diverse.total).toBeGreaterThan(repeated.total);
  });

  test('general mode allows mythical and legendary Pokémon', async () => {
    const species = [
      'articuno',
      'arcanine',
      'starmie',
      'machamp',
      'alakazam',
      'mew',
    ];
    const responses: Record<string, unknown> = {
      'generation/generation-i': {
        pokemon_species: species.map(name => resource(name)),
      },
    };

    species.forEach((name, index) => {
      responses[`${name}-url`] = {
        evolution_chain: resource(name, `${name}-chain-url`),
        is_legendary: name === 'articuno',
        is_mythical: name === 'mew',
        name,
        varieties: [
          {
            is_default: true,
            pokemon: resource(name, `${name}-pokemon-url`),
          },
        ],
      };
      responses[`${name}-chain-url`] = {
        chain: {
          species: resource(name),
          evolves_to: [],
        },
      };
      responses[`${name}-pokemon-url`] = pokemonResponse(
        index + 1,
        name,
        ['normal'],
        balancedStats,
      );
    });

    const apiClient = mockApiClient(responses);
    const team = await generateBalancedTeam({
      apiClient,
      candidateCount: species.length,
      mode: 'general',
      random: () => 0,
      scope: { kind: 'generation', value: 'generation-i' },
      selectionWindow: 1,
    });

    expect(team).toHaveLength(6);
    expect(team.map(member => member.name)).toContain('articuno');
    expect(team.map(member => member.name)).toContain('mew');
    expect(apiClient.get).toHaveBeenCalledWith(
      'mew-pokemon-url',
      undefined,
    );
  });

  test('VGC style rewards stronger profiles and limits legendary picks', async () => {
    const species = [
      'articuno',
      'zapdos',
      'moltres',
      'arcanine',
      'starmie',
      'machamp',
      'alakazam',
      'golem',
    ];
    const responses: Record<string, unknown> = {
      'pokemon-species?limit=100000': {
        results: species.map(name => resource(name)),
      },
    };

    species.forEach((name, index) => {
      const isLegendary = index < 3;
      const stats = isLegendary
        ? {
            ...balancedStats,
            attack: 130,
            'special-attack': 130,
            speed: 120,
          }
        : balancedStats;
      responses[`${name}-url`] = {
        evolution_chain: resource(name, `${name}-chain-url`),
        is_legendary: isLegendary,
        is_mythical: false,
        name,
        varieties: [
          {
            is_default: true,
            pokemon: resource(name, `${name}-pokemon-url`),
          },
        ],
      };
      responses[`${name}-chain-url`] = {
        chain: {
          species: resource(name),
          evolves_to: [],
        },
      };
      responses[`${name}-pokemon-url`] = pokemonResponse(
        index + 1,
        name,
        [index % 2 === 0 ? 'flying' : 'normal'],
        stats,
      );
    });

    const strongProfile = teamMember(1, 'strong', ['normal'], {
      ...balancedStats,
      attack: 135,
      speed: 120,
    });
    const ordinaryProfile = teamMember(
      2,
      'ordinary',
      ['normal'],
      balancedStats,
    );

    expect(
      scoreTeamBalance([strongProfile], 'vgc').competitive,
    ).toBeGreaterThan(
      scoreTeamBalance([ordinaryProfile], 'vgc').competitive,
    );

    const team = await generateBalancedTeam({
      apiClient: mockApiClient(responses),
      candidateCount: species.length,
      mode: 'vgc',
      random: () => 0,
      scope: { kind: 'all' },
      selectionWindow: 1,
    });

    expect(team).toHaveLength(6);
    expect(team.filter(member => member.isLegendary)).toHaveLength(2);
  });

  test('propagates cancellation to an in-flight PokeAPI request', async () => {
    const controller = new AbortController();
    const get = vi.fn(
      (_request: string, signal?: AbortSignal): Promise<unknown> =>
        new Promise((_resolve, reject) => {
          signal?.addEventListener(
            'abort',
            () => reject(signal.reason),
            { once: true },
          );
        }),
    );
    const apiClient: PokeApiClient = {
      get: get as PokeApiClient['get'],
    };

    const request = generateBalancedTeam({
      apiClient,
      scope: { kind: 'generation', value: 'generation-i' },
      signal: controller.signal,
    });
    controller.abort();

    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
    expect(apiClient.get).toHaveBeenCalledWith(
      'generation/generation-i',
      controller.signal,
    );
  });

  test('reports scopes that cannot provide six unique species', async () => {
    const apiClient = mockApiClient({
      'pokemon-species?limit=100000': {
        results: Array.from({ length: 5 }, (_, index) =>
          resource(`pokemon-${index}`),
        ),
      },
    });

    await expect(
      generateBalancedTeam({
        apiClient,
        scope: { kind: 'all' },
      }),
    ).rejects.toBeInstanceOf(BalancedTeamGenerationError);
  });
});
