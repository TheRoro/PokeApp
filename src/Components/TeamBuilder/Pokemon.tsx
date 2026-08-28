import React from 'react';
import { FaArrowLeft, FaArrowRight, FaPlus, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import typeIcons from '../../Assets/type-icons';
import { getTypeColor } from '../Tools/TypeBadge';
import { formatPokemonName } from '../Tools/pokemonNames';
import { TeamPokemon } from './teamAnalysis';
import { formatCompetitiveSpread } from './competitiveSet';
import {
  CardControls,
  CardIconButton,
  EmptySlot,
  EmptySlotButton,
  PokemonImage,
  PokemonImageLink,
  PokemonName,
  PokemonNameLink,
  CompetitiveDetails,
  CompetitiveMeta,
  CompetitiveMetaItem,
  CompetitiveMoves,
  CompetitiveSummary,
  SlotCard,
  SlotLabel,
  TeamTypeBadge,
  TeamTypeIcon,
  TeamTypeName,
  Types,
} from './TeamBuilderStyles';

type Props = {
  animateIn: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  disabled: boolean;
  exiting: boolean;
  index: number;
  pokemon: TeamPokemon | null;
  selected: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRemove: () => void;
  onSelect: () => void;
};

const Pokemon: React.FC<Props> = ({
  animateIn,
  canMoveLeft,
  canMoveRight,
  disabled,
  exiting,
  index,
  pokemon,
  selected,
  onMoveLeft,
  onMoveRight,
  onRemove,
  onSelect,
}) => (
  <SlotCard
    aria-label={`Team slot ${index + 1}`}
    $animateIn={animateIn}
    $removing={exiting}
    $selected={selected}
  >
    <SlotLabel>Pokémon {index + 1}</SlotLabel>
    {pokemon ? (
      <>
        <CardControls>
          <CardIconButton
            type="button"
            aria-label={`Move ${pokemon.displayName} left`}
            disabled={!canMoveLeft || exiting || disabled}
            onClick={onMoveLeft}
          >
            <FaArrowLeft aria-hidden="true" />
          </CardIconButton>
          <CardIconButton
            type="button"
            aria-label={`Move ${pokemon.displayName} right`}
            disabled={!canMoveRight || exiting || disabled}
            onClick={onMoveRight}
          >
            <FaArrowRight aria-hidden="true" />
          </CardIconButton>
          <CardIconButton
            $danger
            type="button"
            aria-label={`Remove ${pokemon.displayName}`}
            disabled={exiting || disabled}
            onClick={onRemove}
          >
            <FaTimes aria-hidden="true" />
          </CardIconButton>
        </CardControls>
        <PokemonImageLink
          as={Link}
          to={`/search/${pokemon.name}`}
          aria-label={`View ${pokemon.displayName} details`}
        >
          <PokemonImage src={pokemon.imageUrl} alt={pokemon.displayName} />
        </PokemonImageLink>
        <PokemonName>
          <PokemonNameLink as={Link} to={`/search/${pokemon.name}`}>
            {pokemon.displayName}
          </PokemonNameLink>
        </PokemonName>
        <Types aria-label={`${pokemon.displayName} types`}>
          {pokemon.types.map(type => {
            const displayType = formatPokemonName(type);
            return (
              <TeamTypeBadge $color={getTypeColor(type)} key={type}>
                <TeamTypeIcon src={typeIcons[displayType]} alt="" />
                <TeamTypeName>{displayType}</TeamTypeName>
              </TeamTypeBadge>
            );
          })}
        </Types>
        {pokemon.competitiveSet && (
          <CompetitiveDetails>
            <CompetitiveSummary>
              {pokemon.competitiveSet.item} · {pokemon.competitiveSet.ability}
            </CompetitiveSummary>
            <CompetitiveMeta>
              <CompetitiveMetaItem>
                <span>Nature</span>
                <strong>{pokemon.competitiveSet.nature}</strong>
              </CompetitiveMetaItem>
              <CompetitiveMetaItem>
                <span>Level</span>
                <strong>{pokemon.competitiveSet.level}</strong>
              </CompetitiveMetaItem>
              {pokemon.competitiveSet.teraType && (
                <CompetitiveMetaItem>
                  <span>Tera type</span>
                  <strong>{pokemon.competitiveSet.teraType}</strong>
                </CompetitiveMetaItem>
              )}
              {pokemon.competitiveSet.shiny && (
                <CompetitiveMetaItem>
                  <span>Variant</span>
                  <strong>Shiny</strong>
                </CompetitiveMetaItem>
              )}
            </CompetitiveMeta>
            <CompetitiveMetaItem>
              <span>{pokemon.competitiveSet.trainingLabel ?? 'EVs'}</span>
              <strong>
                {formatCompetitiveSpread(
                  pokemon.competitiveSet.evs,
                  'Not published',
                )}
              </strong>
            </CompetitiveMetaItem>
            <CompetitiveMetaItem>
              <span>IVs</span>
              <strong>
                {formatCompetitiveSpread(
                  pokemon.competitiveSet.ivs,
                  'No deviations published',
                )}
              </strong>
            </CompetitiveMetaItem>
            {pokemon.competitiveSet.mechanic && (
              <CompetitiveMetaItem>
                <span>Mechanic</span>
                <strong>{pokemon.competitiveSet.mechanic}</strong>
              </CompetitiveMetaItem>
            )}
            <CompetitiveMoves aria-label={`${pokemon.displayName} moves`}>
              {pokemon.competitiveSet.moves.map(move => (
                <li key={move}>{move}</li>
              ))}
            </CompetitiveMoves>
          </CompetitiveDetails>
        )}
      </>
    ) : (
      <EmptySlot>
        <EmptySlotButton
          type="button"
          aria-label={`Select team slot ${index + 1}`}
          disabled={disabled}
          onClick={onSelect}
          $selected={selected}
        >
          <FaPlus aria-hidden="true" />
          <strong>{selected ? 'Selected slot' : 'Add Pokémon'}</strong>
          <span>Choose this position for your next teammate.</span>
        </EmptySlotButton>
      </EmptySlot>
    )}
  </SlotCard>
);

export default Pokemon;
