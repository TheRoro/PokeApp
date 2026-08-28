import axios from 'axios';
import Bidoof404 from '../../Assets/404-bidoof.png';
import { formatPokemonName, toPokemonApiSlug } from '../Tools/pokemonNames';
import { TeamPokemon } from './teamAnalysis';

type PokemonResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
  stats?: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  types: Array<{ type: { name: string } }>;
};

export function mapTeamPokemon(data: PokemonResponse): TeamPokemon {
  return {
    id: data.id,
    name: data.name,
    displayName: formatPokemonName(data.name),
    imageUrl:
      data.sprites.other['official-artwork'].front_default ??
      data.sprites.front_default ??
      Bidoof404,
    types: data.types.map(entry => entry.type.name),
    baseStats: Object.fromEntries(
      (data.stats ?? []).map(entry => [entry.stat.name, entry.base_stat]),
    ),
  };
}

export async function fetchTeamPokemon(
  value: string,
  signal?: AbortSignal,
): Promise<TeamPokemon> {
  const slug = toPokemonApiSlug(value);
  if (!slug) throw new Error('Enter a Pokémon name or Pokédex number.');

  const response = await axios.get<PokemonResponse>(
    `https://pokeapi.co/api/v2/pokemon/${slug}/`,
    { signal },
  );
  return mapTeamPokemon(response.data);
}
