export type PokemonListEntry = {
  name: string;
  url: string;
};

export type DiscoveryPokemon = {
  id: number;
  name: string;
};

export function getPokemonId(url: string): number | null {
  const match = url.match(/\/pokemon(?:-species)?\/(\d+)\/?$/);
  if (!match) return null;

  const id = Number(match[1]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function selectDiscoveryPokemon(
  entries: PokemonListEntry[],
  count: number,
  random: () => number = Math.random,
): DiscoveryPokemon[] {
  const available = entries
    .map(entry => {
      const id = getPokemonId(entry.url);
      return id === null ? null : { id, name: entry.name };
    })
    .filter((entry): entry is DiscoveryPokemon => entry !== null);

  const selected: DiscoveryPokemon[] = [];
  const pool = [...available];

  while (selected.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }

  return selected;
}
