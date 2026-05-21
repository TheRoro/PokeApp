import { formatPokemonName, toPokemonApiSlug } from './pokemonNames';

describe('Pokémon name normalization', () => {
  test.each([
    ['Nidoran♀', 'nidoran-f'],
    ['nidoran female', 'nidoran-f'],
    ['Nidoran♂', 'nidoran-m'],
    ['nidoran male', 'nidoran-m'],
    ['Mr. Mime', 'mr-mime'],
    ["Farfetch'd", 'farfetchd'],
    ['Type: Null', 'type-null'],
    ['Flabébé', 'flabebe'],
  ])('maps %s to the PokeAPI slug %s', (displayName, slug) => {
    expect(toPokemonApiSlug(displayName)).toBe(slug);
  });

  test('preserves the canonical Nidoran display labels', () => {
    expect(formatPokemonName('nidoran-f')).toBe('Nidoran♀');
    expect(formatPokemonName('nidoran-m')).toBe('Nidoran♂');
  });
});
