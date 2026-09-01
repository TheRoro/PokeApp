import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import PokemonList from '../Tools/PokemonList';
import { formatPokemonName } from '../Tools/pokemonNames';
import { describeApiError } from '../Tools/ApiError/apiErrors';
import { getPokemonSuggestions } from './pokemonSuggestions';
import type { CoverageRecommendation } from './coverageRecommendations';
import { TeamPokemon } from './teamAnalysis';
import { fetchTeamPokemon } from './teamPokemonApi';
import {
  ErrorText,
  InputContainer,
  NoSuggestions,
  PickerForm,
  PickerHeader,
  PickerHint,
  PickerPanel,
  RecommendationButton,
  RecommendationList,
  RecommendationPanel,
  LoadingSpinner,
  SearchButton,
  SearchInput,
  Suggestion,
  Suggestions,
} from './TeamBuilderStyles';

type Props = {
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onBusyChange: (busy: boolean) => void;
  recommendations: CoverageRecommendation[];
  replacingPokemonName?: string;
  slotNumber: number;
  teamEmpty: boolean;
  onLoaded: (
    pokemon: TeamPokemon,
    signal: AbortSignal,
  ) => Promise<string | null> | string | null;
};

const TeamPicker: React.FC<Props> = ({
  disabled,
  inputRef,
  onBusyChange,
  recommendations,
  replacingPokemonName,
  slotNumber,
  teamEmpty,
  onLoaded,
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
  const listboxId = 'team-pokemon-suggestions';

  useEffect(() => {
    setError('');
  }, [slotNumber]);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
      onBusyChange(false);
    },
    [onBusyChange],
  );

  const loadPokemon = async (value: string) => {
    if (!value.trim()) {
      setError('Enter a Pokémon name or Pokédex number.');
      return;
    }

    setShowSuggestions(false);
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    onBusyChange(true);
    setError('');

    try {
      const pokemon = await fetchTeamPokemon(value, controller.signal);
      if (controller.signal.aborted) return;
      const validationError = await onLoaded(pokemon, controller.signal);
      if (controller.signal.aborted) return;
      if (validationError) {
        setError(validationError);
        return;
      }
      setQuery('');
    } catch (requestError) {
      if (controller.signal.aborted || axios.isCancel(requestError)) return;
      if (
        requestError instanceof Error &&
        requestError.message === 'Enter a Pokémon name or Pokédex number.'
      ) {
        setError(requestError.message);
        return;
      }
      const apiError = describeApiError(requestError, 'Pokémon');
      setError(`${apiError.title}. ${apiError.message}`);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        onBusyChange(false);
      }
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    void loadPokemon(query);
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(formatPokemonName(suggestion));
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

  return (
    <PickerPanel>
      <PickerHeader>
        <strong>
          {disabled
            ? 'Team update in progress'
            : replacingPokemonName
              ? `Replace ${replacingPokemonName}`
            : teamEmpty
              ? 'Choose your first Pokémon'
              : `Add to slot ${slotNumber}`}
        </strong>
        <PickerHint>
          {loading
            ? 'Loading Pokémon and Adventure encounter details.'
            : disabled
              ? 'The picker will return when the current update finishes.'
              : replacingPokemonName
                ? `Choose a new Pokémon for slot ${slotNumber}.`
              : teamEmpty
                ? 'Search by name or Pokédex number to start your team.'
                : 'Search once, then choose any empty team slot.'}
        </PickerHint>
      </PickerHeader>
      <PickerForm onSubmit={submit}>
        <InputContainer>
          <SearchInput
            ref={inputRef}
            aria-label="Team Pokémon search"
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
            disabled={disabled}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls={
              showSuggestions && suggestions.length > 0
                ? listboxId
                : undefined
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
        <SearchButton type="submit" disabled={disabled || loading}>
          {loading ? (
            <>
              <LoadingSpinner aria-hidden="true" /> Loading…
            </>
          ) : (
            'Add Pokémon'
          )}
        </SearchButton>
      </PickerForm>
      {recommendations.length > 0 && (
        <RecommendationPanel aria-label="Coverage suggestions">
          <span>Coverage suggestions</span>
          <RecommendationList>
            {recommendations.map(recommendation => (
              <RecommendationButton
                type="button"
                disabled={disabled || loading}
                key={recommendation.name}
                onClick={() => void loadPokemon(recommendation.name)}
              >
                <strong>{formatPokemonName(recommendation.name)}</strong>
                <small>{recommendation.reason}</small>
              </RecommendationButton>
            ))}
          </RecommendationList>
        </RecommendationPanel>
      )}
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </PickerPanel>
  );
};

export default TeamPicker;
