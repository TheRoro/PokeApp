import {
  adventureStarterDoesNotEvolve,
  adventureStarterSpecies,
  adventureStarterVariety,
  adventureStarterRoots,
  finalStarterSpecies,
} from './adventureStarters';

describe('Adventure starter rules', () => {
  test('uses the starter trio for the selected game or region', () => {
    expect([...adventureStarterRoots('game', 'firered')]).toEqual([
      'bulbasaur',
      'charmander',
      'squirtle',
    ]);
    expect([...adventureStarterRoots('region', 'hisui')]).toEqual([
      'rowlet',
      'cyndaquil',
      'oshawott',
    ]);
  });

  test('uses game specific starter overrides', () => {
    expect([...adventureStarterRoots('game', 'yellow')]).toEqual([
      'pikachu',
    ]);
    expect([...adventureStarterRoots('game', 'lets-go-eevee')]).toEqual([
      'eevee',
    ]);
    expect([...adventureStarterRoots('game', 'legends-za')]).toEqual([
      'chikorita',
      'tepig',
      'totodile',
    ]);
  });

  test('resolves only final evolutions from the allowed starter families', () => {
    expect(
      [...finalStarterSpecies(new Set(['charmander', 'eevee']))],
    ).toEqual([
      'charizard',
      'vaporeon',
      'jolteon',
      'flareon',
      'espeon',
      'umbreon',
      'leafeon',
      'glaceon',
      'sylveon',
    ]);
  });

  test('keeps partner starters unevolved in their specific games', () => {
    expect([...adventureStarterSpecies('game', 'yellow')]).toEqual([
      'pikachu',
    ]);
    expect([
      ...adventureStarterSpecies('game', 'lets-go-pikachu'),
    ]).toEqual(['pikachu']);
    expect([...adventureStarterSpecies('game', 'lets-go-eevee')]).toEqual([
      'eevee',
    ]);
    expect(
      adventureStarterDoesNotEvolve('game', 'lets-go-eevee', 'eevee'),
    ).toBe(true);
    expect(
      adventureStarterDoesNotEvolve('game', 'yellow', 'pikachu'),
    ).toBe(true);
  });

  test('selects game specific starter forms', () => {
    expect(
      adventureStarterVariety(
        'game',
        'lets-go-pikachu',
        'pikachu',
      ),
    ).toBe('pikachu-starter');
    expect(
      adventureStarterVariety('game', 'lets-go-eevee', 'eevee'),
    ).toBe('eevee-starter');
    expect(
      adventureStarterVariety(
        'game',
        'legends-arceus',
        'decidueye',
      ),
    ).toBe('decidueye-hisui');
    expect(
      adventureStarterVariety(
        'game',
        'legends-arceus',
        'typhlosion',
      ),
    ).toBe('typhlosion-hisui');
    expect(
      adventureStarterVariety(
        'game',
        'legends-arceus',
        'samurott',
      ),
    ).toBe('samurott-hisui');
  });
});
