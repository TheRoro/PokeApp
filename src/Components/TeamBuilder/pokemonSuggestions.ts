import { toPokemonApiSlug } from '../Tools/pokemonNames';

export function getPokemonSuggestions(
  options: string[],
  query: string,
  limit = 6,
): string[] {
  const normalizedQuery = toPokemonApiSlug(query);
  if (!normalizedQuery || /^\d+$/.test(normalizedQuery)) return [];

  const startsWith: string[] = [];
  const contains: string[] = [];

  for (const option of options) {
    const normalizedOption = toPokemonApiSlug(option);
    if (normalizedOption.startsWith(normalizedQuery)) {
      startsWith.push(option);
    } else if (normalizedOption.includes(normalizedQuery)) {
      contains.push(option);
    }
  }

  return [...startsWith, ...contains].slice(0, limit);
}
