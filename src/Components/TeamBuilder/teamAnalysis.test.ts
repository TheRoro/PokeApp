import {
  analyzeOffensiveCoverage,
  analyzeTeam,
  getDefensiveMultiplier,
  TeamPokemon,
} from './teamAnalysis';

function teamMember(
  id: number,
  name: string,
  types: string[],
): TeamPokemon {
  return {
    id,
    name,
    displayName: name,
    imageUrl: `${name}.png`,
    types,
  };
}

describe('team defensive analysis', () => {
  test('combines both defending types into the correct multiplier', () => {
    expect(getDefensiveMultiplier(['fire', 'flying'], 'rock')).toBe(4);
    expect(getDefensiveMultiplier(['water', 'ground'], 'electric')).toBe(0);
    expect(getDefensiveMultiplier(['grass', 'poison'], 'grass')).toBe(0.25);
  });

  test('counts weaknesses, resistances, and immunities across the team', () => {
    const analysis = analyzeTeam([
      teamMember(6, 'Charizard', ['fire', 'flying']),
      teamMember(12, 'Butterfree', ['bug', 'flying']),
      teamMember(194, 'Wooper', ['water', 'ground']),
    ]);

    expect(analysis.find(item => item.type === 'Rock')).toEqual({
      type: 'Rock',
      weak: 2,
      resistant: 1,
      immune: 0,
    });
    expect(analysis.find(item => item.type === 'Electric')).toEqual({
      type: 'Electric',
      weak: 2,
      resistant: 0,
      immune: 1,
    });
  });

  test('summarizes offensive STAB coverage across unique team types', () => {
    const coverage = analyzeOffensiveCoverage([
      teamMember(6, 'Charizard', ['fire', 'flying']),
      teamMember(59, 'Arcanine', ['fire']),
      teamMember(25, 'Pikachu', ['electric']),
    ]);

    expect(coverage.find(item => item.type === 'Fire')).toEqual({
      type: 'Fire',
      members: 2,
      strongAgainst: ['Bug', 'Grass', 'Ice', 'Steel'],
    });
    expect(coverage.find(item => item.type === 'Electric')).toEqual({
      type: 'Electric',
      members: 1,
      strongAgainst: ['Flying', 'Water'],
    });
  });
});
