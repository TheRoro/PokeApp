import { findDualTypeMatches, findMonotypeMatches, TypePokemonEntry } from './typeMatching';

const entry = (name: string, id: number): TypePokemonEntry => ({
  pokemon: {
    name,
    url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
  },
});

describe('type matching', () => {
  test('returns the complete dual-type intersection in Pokédex order', () => {
    const matches = findDualTypeMatches(
      [entry('later', 20), entry('shared', 7), entry('other-shared', 3)],
      [entry('other-shared', 3), entry('shared', 7)],
    );

    expect(matches).toEqual([
      { name: 'other-shared', id: 3 },
      { name: 'shared', id: 7 },
    ]);
  });

  test('checks every primary-type entry when finding pure monotypes', () => {
    const primary = Array.from({ length: 40 }, (_, index) => entry(`pokemon-${index + 1}`, index + 1));
    const otherTypes = [[entry('pokemon-1', 1)], [entry('pokemon-30', 30)]];

    const matches = findMonotypeMatches(primary, otherTypes);

    expect(matches).toHaveLength(38);
    expect(matches.some(match => match.name === 'pokemon-30')).toBe(false);
    expect(matches.at(-1)).toEqual({ name: 'pokemon-40', id: 40 });
  });
});
