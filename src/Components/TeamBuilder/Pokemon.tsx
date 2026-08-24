import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import Bidoof404 from '../../Assets/404-bidoof.png';
import PokemonList from '../Tools/PokemonList';
import { formatPokemonName, toPokemonApiSlug } from '../Tools/pokemonNames';
import { getPokemonSuggestions } from './pokemonSuggestions';
import { TeamPokemon } from './teamAnalysis';
import { describeApiError } from '../Tools/ApiError/apiErrors';
import {
  EmptySlot,
  ErrorText,
  InputContainer,
  NoSuggestions,
  PokemonImage,
  PokemonName,
  RemoveButton,
  SearchButton,
  SearchForm,
  SearchInput,
  SlotCard,
  SlotLabel,
  Suggestion,
  Suggestions,
  Types,
} from './TeamBuilderStyles';
import TypeBadge from '../Tools/TypeBadge';

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
  types: Array<{ type: { name: string } }>;
};

type Props = {
  animateIn: boolean;
  exiting: boolean;
  index: number;
  pokemon: TeamPokemon | null;
  onLoaded: (pokemon: TeamPokemon) => string | null;
  onRemove: () => void;
};

const Pokemon: React.FC<Props> = ({
  animateIn,
  exiting,
  index,
  pokemon,
  onLoaded,
  onRemove,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const controllerRef = useRef<AbortController>();
  const suggestions = useMemo(
    () => getPokemonSuggestions(PokemonList, query),
    [query],
  );
  const canSuggest = query.trim().length > 0 && !/^\d+$/.test(query.trim());
  const listboxId = `team-pokemon-suggestions-${index}`;

  useEffect(() => {
    setQuery(pokemon?.displayName ?? '');
    setError('');
  }, [pokemon]);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    [],
  );

  const loadPokemon = async (value: string) => {
    const slug = toPokemonApiSlug(value);

    if (!slug) {
      setError('Enter a Pokémon name or Pokédex number.');
      return;
    }

    setShowSuggestions(false);
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError('');

    try {
      const response = await axios.get<PokemonResponse>(
        `https://pokeapi.co/api/v2/pokemon/${slug}/`,
        { signal: controller.signal },
      );
      const data = response.data;
      const imageUrl =
        data.sprites.other['official-artwork'].front_default ??
        data.sprites.front_default ??
        Bidoof404;
      const result: TeamPokemon = {
        id: data.id,
        name: data.name,
        displayName: formatPokemonName(data.name),
        imageUrl,
        types: data.types.map(entry => entry.type.name),
      };
      const validationError = onLoaded(result);

      if (validationError) {
        setError(validationError);
        return;
      }

      setQuery(result.displayName);
    } catch (requestError) {
      if (axios.isCancel(requestError)) return;
      const apiError = describeApiError(requestError, 'Pokémon');
      setError(`${apiError.title}. ${apiError.message}`);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  const searchPokemon = (event: React.FormEvent) => {
    event.preventDefault();
    void loadPokemon(query);
  };

  const selectSuggestion = (suggestion: string) => {
    const displayName = formatPokemonName(suggestion);
    setQuery(displayName);
    setShowSuggestions(false);
    void loadPokemon(suggestion);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (event.key === 'Escape') setShowSuggestions(false);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestion(current => (current + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestion(
        current => (current - 1 + suggestions.length) % suggestions.length,
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectSuggestion(suggestions[activeSuggestion]);
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const remove = () => {
    if (exiting) return;
    controllerRef.current?.abort();
    onRemove();
  };

  return (
    <SlotCard
      aria-label={`Team slot ${index + 1}`}
      $animateIn={animateIn}
      $removing={exiting}
    >
      <SearchForm onSubmit={searchPokemon}>
        <InputContainer>
          <SlotLabel htmlFor={`team-pokemon-${index}`}>
            Pokémon {index + 1}
          </SlotLabel>
          <SearchInput
            id={`team-pokemon-${index}`}
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              setError('');
              setActiveSuggestion(0);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            onBlur={() => setShowSuggestions(false)}
            placeholder="Name or Pokédex #"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls={
              showSuggestions && suggestions.length > 0 ? listboxId : undefined
            }
            aria-activedescendant={
              showSuggestions && suggestions.length > 0
                ? `${listboxId}-${activeSuggestion}`
                : undefined
            }
          />
          {showSuggestions && canSuggest && suggestions.length > 0 && (
            <Suggestions id={listboxId} role="listbox">
              {suggestions.map((suggestion, suggestionIndex) => (
                <Suggestion
                  id={`${listboxId}-${suggestionIndex}`}
                  role="option"
                  aria-selected={suggestionIndex === activeSuggestion}
                  key={suggestion}
                  $active={suggestionIndex === activeSuggestion}
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {formatPokemonName(suggestion)}
                </Suggestion>
              ))}
            </Suggestions>
          )}
          {showSuggestions && canSuggest && suggestions.length === 0 && (
            <NoSuggestions>No matching Pokémon</NoSuggestions>
          )}
        </InputContainer>
        <SearchButton type="submit" disabled={loading}>
          {loading ? 'Loading…' : 'Add'}
        </SearchButton>
      </SearchForm>
      <ErrorText role={error ? 'alert' : undefined}>{error}</ErrorText>

      {pokemon ? (
        <>
          <PokemonImage src={pokemon.imageUrl} alt={pokemon.displayName} />
          <PokemonName>{pokemon.displayName}</PokemonName>
          <Types aria-label={`${pokemon.displayName} types`}>
            {pokemon.types.map(type => {
              const displayType = formatPokemonName(type);
              return (
                <TypeBadge type={displayType} key={type} />
              );
            })}
          </Types>
          <RemoveButton type="button" onClick={remove} disabled={exiting}>
            Remove
          </RemoveButton>
        </>
      ) : (
        <EmptySlot>Search to add a team member.</EmptySlot>
      )}
    </SlotCard>
  );
};

export default Pokemon;
