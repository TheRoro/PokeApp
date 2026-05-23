import { getPokemonSuggestions } from './pokemonSuggestions';

const pokemon = [
  'Pikachu',
  'Pichu',
  'Raichu',
  'Nidoran♀',
  'Nidoran♂',
  'Tapu-Pikachu',
];

describe('TeamBuilder Pokémon suggestions', () => {
  test('prioritizes prefix matches and respects the result limit', () => {
    expect(getPokemonSuggestions(pokemon, 'pi', 2)).toEqual([
      'Pikachu',
      'Pichu',
    ]);
  });

  test('matches canonical aliases and skips Pokédex numbers', () => {
    expect(getPokemonSuggestions(pokemon, 'nidoran f')).toEqual(['Nidoran♀']);
    expect(getPokemonSuggestions(pokemon, '25')).toEqual([]);
  });
});
