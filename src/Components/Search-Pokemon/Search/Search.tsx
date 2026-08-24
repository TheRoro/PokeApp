import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Evolutions from '../Evolutions/Evolutions';
import PokemonStats from '../Stats/PokemonStats';
import Moves from '../Moves/Moves';
import pokemonList from '../../Tools/PokemonList';
import SearchBar from '../../Tools/SearchEngine/SearchEngine';
import { toPokemonApiSlug } from '../../Tools/pokemonNames';
import { formatPokemonName } from '../../Tools/pokemonNames';
import { ToolPageHeader } from '../../Tools/ToolLayout';
import DiscoveryTile, {
  DiscoveryContent,
  DiscoveryGrid,
  DiscoveryImage,
  DiscoveryLoader,
  DiscoverySearch,
  DiscoverySearchControl,
  DiscoverySpinner,
  DiscoveryStatus,
} from '../../Tools/DiscoveryTile';
import { getTypeColor } from '../../Tools/TypeBadge';
import {
  DiscoveryPokemon,
  PokemonListEntry,
  selectDiscoveryPokemon,
} from './pokemonDiscovery';

import { Route, Routes, useNavigate } from 'react-router-dom';

import { SearchContainer } from './Styles';
import PokeBall from '../../../Assets/pokeapp.png';

type PokemonListResponse = {
  results: PokemonListEntry[];
};

type DiscoveryPokemonCard = DiscoveryPokemon & {
  imageUrl: string;
  type: string;
};

type PokemonTypeResponse = {
  sprites: {
    front_default: string | null;
    other: {
      'official-artwork': {
        front_default: string | null;
      };
    };
  };
  types: Array<{ type: { name: string } }>;
};

const fallbackDiscovery: PokemonListEntry[] = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
  { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
  { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon/133/' },
  { name: 'snorlax', url: 'https://pokeapi.co/api/v2/pokemon/143/' },
  { name: 'mew', url: 'https://pokeapi.co/api/v2/pokemon/151/' },
  { name: 'lugia', url: 'https://pokeapi.co/api/v2/pokemon/249/' },
  { name: 'gardevoir', url: 'https://pokeapi.co/api/v2/pokemon/282/' },
  { name: 'lucario', url: 'https://pokeapi.co/api/v2/pokemon/448/' },
  { name: 'greninja', url: 'https://pokeapi.co/api/v2/pokemon/658/' },
  { name: 'mimikyu-disguised', url: 'https://pokeapi.co/api/v2/pokemon/778/' },
  { name: 'sprigatito', url: 'https://pokeapi.co/api/v2/pokemon/906/' },
  { name: 'ceruledge', url: 'https://pokeapi.co/api/v2/pokemon/937/' },
  { name: 'tinkaton', url: 'https://pokeapi.co/api/v2/pokemon/959/' },
  { name: 'pecharunt', url: 'https://pokeapi.co/api/v2/pokemon/1025/' },
];

let pokemonListing: Promise<PokemonListEntry[]> | null = null;

const loadPokemonListing = () => {
  if (!pokemonListing) {
    pokemonListing = axios
      .get<PokemonListResponse>('https://pokeapi.co/api/v2/pokemon-species?limit=2000')
      .then(response => response.data.results)
      .catch(error => {
        pokemonListing = null;
        throw error;
      });
  }
  return pokemonListing;
};

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      url =>
        new Promise<void>(resolve => {
          const image = new Image();
          image.onload = () => {
            const decode = image.decode?.();
            if (decode) {
              void decode.catch(() => undefined).finally(resolve);
            } else {
              resolve();
            }
          };
          image.onerror = () => resolve();
          image.src = url;
        }),
    ),
  );
};

const SearchPokemon: React.FC = () => {
  const navigate = useNavigate();
  const [formatedName, setFormatedName] = React.useState<string>('');
  const [list, setList] = React.useState<DiscoveryPokemonCard[]>([]);
  const [discoveryError, setDiscoveryError] = React.useState('');
  const [loadingDiscovery, setLoadingDiscovery] = React.useState(true);
  const discoveryRequest = React.useRef(0);

  const generateRandom = useCallback(async () => {
    const requestId = ++discoveryRequest.current;
    setList([]);
    setDiscoveryError('');
    setLoadingDiscovery(true);
    try {
      const entries = await loadPokemonListing();
      const selected = selectDiscoveryPokemon(entries, 6);
      const typedPokemon = await Promise.all(
        selected.map(async pokemon => {
          const response = await axios.get<PokemonTypeResponse>(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
          );
          return {
            ...pokemon,
            imageUrl:
              response.data.sprites.front_default ??
              response.data.sprites.other['official-artwork'].front_default ??
              PokeBall,
            type: formatPokemonName(response.data.types[0].type.name),
          };
        }),
      );
      await preloadImages(typedPokemon.map(pokemon => pokemon.imageUrl));
      if (requestId !== discoveryRequest.current) return;
      setList(typedPokemon);
    } catch {
      if (requestId !== discoveryRequest.current) return;
      const fallbackTypes: Record<string, string> = {
        bulbasaur: 'Grass',
        charmander: 'Fire',
        squirtle: 'Water',
        pikachu: 'Electric',
        eevee: 'Normal',
        snorlax: 'Normal',
        mew: 'Psychic',
        lugia: 'Psychic',
        gardevoir: 'Psychic',
        lucario: 'Fighting',
        greninja: 'Water',
        'mimikyu-disguised': 'Ghost',
        sprigatito: 'Grass',
        ceruledge: 'Fire',
        tinkaton: 'Fairy',
        pecharunt: 'Poison',
      };
      const fallbackPokemon = selectDiscoveryPokemon(fallbackDiscovery, 6).map(
        pokemon => ({
          ...pokemon,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
          type: fallbackTypes[pokemon.name] ?? 'Normal',
        }),
      );
      await preloadImages(fallbackPokemon.map(pokemon => pokemon.imageUrl));
      if (requestId !== discoveryRequest.current) return;
      setList(fallbackPokemon);
      setDiscoveryError('Showing a curated selection while live discovery is unavailable.');
    } finally {
      if (requestId === discoveryRequest.current) {
        setLoadingDiscovery(false);
      }
    }
  }, []);

  const onClickName = (id: number) => {
    navigate(id.toString());
  };

  const onValueChange = (val: string, code: number) => {
    const apiName = toPokemonApiSlug(val);
    setFormatedName(apiName);
    if (code === 13) {
      navigate(apiName);
    }
  };

  useEffect(() => {
    void generateRandom();
    return () => {
      discoveryRequest.current += 1;
    };
  }, [generateRandom]);

  return (
    <SearchContainer>
      <Routes>
        <Route path=":name/evolution" element={<Evolutions />} />
        <Route path=":name/moves" element={<Moves />} />
        <Route path=":name" element={<PokemonStats />} />
        <Route
          index
          element={
            <Container>
              <DiscoveryContent>
                <ToolPageHeader
                  eyebrow="Pokédex"
                  title="Find a Pokémon"
                  description="Search by name or Pokédex number, or discover a random Pokémon below."
                />
                <DiscoverySearch>
                  <DiscoverySearchControl>
                    <SearchBar
                      options={pokemonList}
                      onChangeValue={onValueChange}
                      val={formatedName}
                      label="Search Pokémon"
                    />
                  </DiscoverySearchControl>
                </DiscoverySearch>
                {discoveryError && (
                  <DiscoveryStatus role="status">
                    {discoveryError}
                  </DiscoveryStatus>
                )}
                {loadingDiscovery ? (
                  <DiscoveryLoader role="status" aria-label="Loading discovery Pokémon">
                    <DiscoverySpinner src={PokeBall} alt="" />
                    <span>Finding six Pokémon…</span>
                  </DiscoveryLoader>
                ) : (
                  <DiscoveryGrid $animate>
                    {list.map(pokemon => (
                      <DiscoveryTile
                        key={pokemon.id}
                        ariaLabel={`View ${formatPokemonName(pokemon.name)}, ${pokemon.type} type`}
                        color={getTypeColor(pokemon.type)}
                        label={formatPokemonName(pokemon.name)}
                        onClick={() => onClickName(pokemon.id)}
                      >
                        <DiscoveryImage
                          src={pokemon.imageUrl}
                          alt=""
                          $size={84}
                          onError={event => {
                            event.currentTarget.src = PokeBall;
                          }}
                        />
                      </DiscoveryTile>
                    ))}
                  </DiscoveryGrid>
                )}
              </DiscoveryContent>
            </Container>
          }
        />
      </Routes>
    </SearchContainer>
  );
};

export default SearchPokemon;
