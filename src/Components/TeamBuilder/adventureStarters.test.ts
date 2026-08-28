import {
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
});
