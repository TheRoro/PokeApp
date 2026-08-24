import React, { useEffect, useMemo, useRef, useState } from 'react';
import Pokemon from './Pokemon';
import { analyzeTeam, TeamPokemon, TeamTypeSummary } from './teamAnalysis';
import {
  Actions,
  Analysis,
  AnalysisHint,
  AnalysisTitle,
  CoverageContent,
  CoverageGroup,
  CoverageLabel,
  CoverageRow,
  CoverageRowTitle,
  EmptySummary,
  ResetButton,
  SummaryIcon,
  SummaryBadge,
  SummaryCount,
  SummaryMetric,
  SummaryText,
  SummaryType,
  TeamGrid,
  TypeList,
} from './TeamBuilderStyles';
import { ToolPage, ToolPageHeader } from '../Tools/ToolLayout';
import typeIcons from '../../Assets/type-icons';

type TeamSlot = {
  id: number;
  pokemon: TeamPokemon | null;
};

const createEmptyTeam = (): TeamSlot[] =>
  Array.from({ length: 6 }, (_, id) => ({ id, pokemon: null }));

const compactSlots = (slots: TeamSlot[]): TeamSlot[] => [
  ...slots.filter(slot => slot.pokemon !== null),
  ...slots.filter(slot => slot.pokemon === null),
];

type SummaryListProps = {
  count: (item: TeamTypeSummary) => number;
  emptyMessage: string;
  items: TeamTypeSummary[];
  metric: (count: number) => string;
};

const SummaryList: React.FC<SummaryListProps> = ({
  count,
  emptyMessage,
  items,
  metric,
}) => {
  if (items.length === 0) return <EmptySummary>{emptyMessage}</EmptySummary>;

  return (
    <TypeList>
      {items.map(item => {
        const value = count(item);
        const metricLabel = metric(value);
        return (
          <SummaryBadge
            aria-label={`${item.type}: ${value} ${metricLabel}`}
            className={item.type}
            key={item.type}
          >
            <SummaryIcon src={typeIcons[item.type]} alt="" />
            <SummaryText>
              <SummaryType>{item.type}</SummaryType>
              <SummaryMetric>{metricLabel}</SummaryMetric>
            </SummaryText>
            <SummaryCount>{value}</SummaryCount>
          </SummaryBadge>
        );
      })}
    </TypeList>
  );
};

const TeamBuilder: React.FC = () => {
  const [slots, setSlots] = useState<TeamSlot[]>(createEmptyTeam);
  const [animatingIds, setAnimatingIds] = useState<Set<number>>(new Set());
  const [removingSlotIds, setRemovingSlotIds] = useState<Set<number>>(new Set());
  const [resetting, setResetting] = useState(false);
  const [generation, setGeneration] = useState(0);
  const slotsRef = useRef(slots);
  const generationRef = useRef(generation);
  const resettingRef = useRef(false);
  const removingSlotIdsRef = useRef<Set<number>>(new Set());
  const animationTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const removalTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const team = slots
    .map(slot => slot.pokemon)
    .filter((pokemon): pokemon is TeamPokemon => pokemon !== null);
  const analysis = useMemo(() => analyzeTeam(team), [team]);

  useEffect(
    () => () => {
      animationTimersRef.current.forEach(clearTimeout);
      removalTimersRef.current.forEach(clearTimeout);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const animateAddition = (pokemonId: number) => {
    const currentTimer = animationTimersRef.current.get(pokemonId);
    if (currentTimer) clearTimeout(currentTimer);
    setAnimatingIds(current => new Set(current).add(pokemonId));
    const timer = setTimeout(() => {
      setAnimatingIds(current => {
        const next = new Set(current);
        next.delete(pokemonId);
        return next;
      });
      animationTimersRef.current.delete(pokemonId);
    }, 320);
    animationTimersRef.current.set(pokemonId, timer);
  };

  const setPokemon = (
    slotId: number,
    requestGeneration: number,
    pokemon: TeamPokemon,
  ): string | null => {
    if (
      requestGeneration !== generationRef.current ||
      resettingRef.current ||
      removingSlotIdsRef.current.has(slotId)
    ) {
      return null;
    }

    const duplicate = slotsRef.current.some(
      slot => slot.id !== slotId && slot.pokemon?.id === pokemon.id,
    );
    if (duplicate) return `${pokemon.displayName} is already on your team.`;

    const nextSlots = compactSlots(
      slotsRef.current.map(slot =>
        slot.id === slotId ? { ...slot, pokemon } : slot,
      ),
    );
    slotsRef.current = nextSlots;
    setSlots(nextSlots);
    animateAddition(pokemon.id);
    return null;
  };

  const removePokemon = (slotId: number) => {
    if (removingSlotIdsRef.current.has(slotId) || resettingRef.current) return;

    const nextRemoving = new Set(removingSlotIdsRef.current).add(slotId);
    removingSlotIdsRef.current = nextRemoving;
    setRemovingSlotIds(nextRemoving);

    const timer = setTimeout(() => {
      const nextSlots = compactSlots(
        slotsRef.current.map(slot =>
          slot.id === slotId ? { ...slot, pokemon: null } : slot,
        ),
      );
      const remainingRemovals = new Set(removingSlotIdsRef.current);
      remainingRemovals.delete(slotId);
      removingSlotIdsRef.current = remainingRemovals;
      slotsRef.current = nextSlots;
      setRemovingSlotIds(remainingRemovals);
      setSlots(nextSlots);
      removalTimersRef.current.delete(slotId);
    }, 220);
    removalTimersRef.current.set(slotId, timer);
  };

  const resetTeam = () => {
    if (resettingRef.current) return;

    removalTimersRef.current.forEach(clearTimeout);
    removalTimersRef.current.clear();
    const nextGeneration = generationRef.current + 1;
    generationRef.current = nextGeneration;
    resettingRef.current = true;
    setResetting(true);

    resetTimerRef.current = setTimeout(() => {
      const emptyTeam = createEmptyTeam();
      slotsRef.current = emptyTeam;
      removingSlotIdsRef.current = new Set();
      resettingRef.current = false;
      setSlots(emptyTeam);
      setRemovingSlotIds(new Set());
      setGeneration(nextGeneration);
      setResetting(false);
    }, 220);
  };

  const sharedWeaknesses = analysis
    .filter(item => item.weak >= 2)
    .sort((left, right) => right.weak - left.weak || left.type.localeCompare(right.type));
  const uncoveredThreats = analysis.filter(
    item => item.weak > 0 && item.resistant + item.immune === 0,
  );
  const defensiveAnswers = analysis
    .filter(item => item.resistant + item.immune > 0)
    .sort(
      (left, right) =>
        right.resistant + right.immune - (left.resistant + left.immune) ||
        left.type.localeCompare(right.type),
    );

  return (
    <ToolPage>
      <ToolPageHeader
        eyebrow="Pokédex team analysis"
        title="Team Builder"
        description="Build a six-Pokémon team and spot shared defensive weaknesses as you go."
      />

      <TeamGrid>
        {slots.map((slot, index) => (
          <Pokemon
            animateIn={
              slot.pokemon !== null && animatingIds.has(slot.pokemon.id)
            }
            exiting={
              slot.pokemon !== null &&
              (resetting || removingSlotIds.has(slot.id))
            }
            index={index}
            key={`${slot.id}-${generation}`}
            pokemon={slot.pokemon}
            onLoaded={pokemon => setPokemon(slot.id, generation, pokemon)}
            onRemove={() => removePokemon(slot.id)}
          />
        ))}
      </TeamGrid>

      {team.length > 0 && (
        <>
          <Actions>
            <ResetButton type="button" onClick={resetTeam} disabled={resetting}>
              Reset team
            </ResetButton>
          </Actions>
          <Analysis aria-live="polite">
            <AnalysisTitle>Defensive coverage</AnalysisTitle>
            <AnalysisHint>
              Based on typing for {team.length} of 6 team members. Abilities are not
              included.
            </AnalysisHint>
            <CoverageRow>
              <CoverageRowTitle>Team weaknesses</CoverageRowTitle>
              <CoverageContent>
                <CoverageGroup>
                  <CoverageLabel>Shared weaknesses</CoverageLabel>
                  <SummaryList
                    count={item => item.weak}
                    emptyMessage="No type currently threatens multiple team members."
                    items={sharedWeaknesses}
                    metric={count => `weak member${count === 1 ? '' : 's'}`}
                  />
                </CoverageGroup>
                <CoverageGroup>
                  <CoverageLabel>Uncovered threats</CoverageLabel>
                  <SummaryList
                    count={item => item.weak}
                    emptyMessage="Every current weakness has a resistance or immunity."
                    items={uncoveredThreats}
                    metric={count => `weak member${count === 1 ? '' : 's'}`}
                  />
                </CoverageGroup>
              </CoverageContent>
            </CoverageRow>
            <CoverageRow>
              <CoverageRowTitle>Team coverage</CoverageRowTitle>
              <CoverageContent>
                <CoverageGroup>
                  <CoverageLabel>Resistances and immunities</CoverageLabel>
                  <SummaryList
                    count={item => item.resistant + item.immune}
                    emptyMessage="Add more Pokémon to build defensive answers."
                    items={defensiveAnswers}
                    metric={count => `defensive answer${count === 1 ? '' : 's'}`}
                  />
                </CoverageGroup>
              </CoverageContent>
            </CoverageRow>
          </Analysis>
        </>
      )}
    </ToolPage>
  );
};

export default TeamBuilder;
