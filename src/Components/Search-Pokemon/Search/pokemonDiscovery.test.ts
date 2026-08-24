import {
  getPokemonId,
  selectDiscoveryPokemon,
} from './pokemonDiscovery';

describe('Pokémon discovery', () => {
  test('keeps names, sprite ids, and routes from the same API entry', () => {
    const entries = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      { name: 'pecharunt', url: 'https://pokeapi.co/api/v2/pokemon/1025/' },
    ];

    expect(selectDiscoveryPokemon(entries, 2, () => 0)).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 25, name: 'pikachu' },
    ]);
  });

  test('parses current and future numeric Pokémon URLs', () => {
    expect(getPokemonId('https://pokeapi.co/api/v2/pokemon/1025/')).toBe(1025);
    expect(getPokemonId('https://pokeapi.co/api/v2/pokemon/not-an-id/')).toBeNull();
  });
});
