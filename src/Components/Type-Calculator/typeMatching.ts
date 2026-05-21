export type TypePokemonEntry = {
  pokemon: {
    name: string;
    url: string;
  };
};

export type PokemonMatch = {
  name: string;
  id: number;
};

function pokemonId(url: string): number | null {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isInteger(id) ? id : null;
}

function toMatch(entry: TypePokemonEntry): PokemonMatch | null {
  const id = pokemonId(entry.pokemon.url);
  return id === null ? null : { name: entry.pokemon.name, id };
}

function deterministic(matches: PokemonMatch[]): PokemonMatch[] {
  return matches.sort((left, right) => left.id - right.id || left.name.localeCompare(right.name));
}

export function findDualTypeMatches(
  primary: TypePokemonEntry[],
  secondary: TypePokemonEntry[],
): PokemonMatch[] {
  const secondaryNames = new Set(secondary.map(entry => entry.pokemon.name));
  return deterministic(
    primary
      .filter(entry => secondaryNames.has(entry.pokemon.name))
      .map(toMatch)
      .filter((match): match is PokemonMatch => match !== null),
  );
}

export function findMonotypeMatches(
  primary: TypePokemonEntry[],
  otherTypes: TypePokemonEntry[][],
): PokemonMatch[] {
  const otherTypeNames = new Set(
    otherTypes.flatMap(entries => entries.map(entry => entry.pokemon.name)),
  );
  return deterministic(
    primary
      .filter(entry => !otherTypeNames.has(entry.pokemon.name))
      .map(toMatch)
      .filter((match): match is PokemonMatch => match !== null),
  );
}
