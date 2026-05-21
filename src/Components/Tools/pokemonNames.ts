const pokemonAliases: Record<string, string> = {
  'nidoran♀': 'nidoran-f',
  'nidoran-female': 'nidoran-f',
  'nidoran-f': 'nidoran-f',
  'nidoran♂': 'nidoran-m',
  'nidoran-male': 'nidoran-m',
  'nidoran-m': 'nidoran-m',
};

export function toPokemonApiSlug(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.'’]/g, '')
    .replace(/[^a-z0-9♀♂]+/g, '-')
    .replace(/-+/g, '-');

  return pokemonAliases[normalized] ?? normalized;
}

export function formatPokemonName(value: string): string {
  const slug = toPokemonApiSlug(value);
  if (slug === 'nidoran-f') return 'Nidoran♀';
  if (slug === 'nidoran-m') return 'Nidoran♂';

  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
