import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaFolderOpen,
  FaSave,
  FaShareAlt,
  FaTrash,
} from 'react-icons/fa';
import Pokemon from './Pokemon';
import TeamPicker from './TeamPicker';
import RandomTeamGenerator from './RandomTeamGenerator';
import ShowdownTeamTransfer from './ShowdownTeamTransfer';
import { TeamGeneratorMode } from './balancedTeamGenerator';
import {
  analyzeOffensiveCoverage,
  analyzeTeam,
  TeamPokemon,
  TeamTypeSummary,
} from './teamAnalysis';
import {
  BuilderToolbar,
  CoverageContent,
  CoverageGroup,
  CoverageLabel,
  CoverageRow,
  CoverageRowTitle,
  EmptySummary,
  Analysis,
  AnalysisHint,
  AnalysisTitle,
  StatusText,
  SummaryBadge,
  SummaryCount,
  SummaryIcon,
  SummaryLabel,
  SummaryMetric,
  SummaryStat,
  SummaryText,
  SummaryType,
  SummaryValue,
  TeamGrid,
  TeamSummaryBar,
  TypeList,
  UtilityButton,
} from './TeamBuilderStyles';
import { ToolPage, ToolPageHeader } from '../Tools/ToolLayout';
import typeIcons from '../../Assets/type-icons';
import { fetchTeamPokemon } from './teamPokemonApi';
import {
  createTeamSearch,
  parseSavedTeam,
  parseTeamSearch,
  PersistedTeamMember,
  serializeTeam,
  TEAM_STORAGE_KEY,
} from './teamPersistence';
import type { VgcTeamPreset } from './vgcTeamPresets';

const VgcTeamPresetLoader = React.lazy(
  () => import('./VgcTeamPresetLoader'),
);

type TeamSlot = {
  id: number;
  pokemon: TeamPokemon | null;
};

const createEmptyTeam = (): TeamSlot[] =>
  Array.from({ length: 6 }, (_, id) => ({ id, pokemon: null }));

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
  const [selectedSlotId, setSelectedSlotId] = useState(0);
  const [animatingIds, setAnimatingIds] = useState<Set<number>>(new Set());
  const [removingSlotIds, setRemovingSlotIds] = useState<Set<number>>(new Set());
  const [resetting, setResetting] = useState(false);
  const [pickerGeneration, setPickerGeneration] = useState(0);
  const [status, setStatus] = useState('');
  const [hydrating, setHydrating] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [generatingTeam, setGeneratingTeam] = useState(false);
  const [generatorMode, setGeneratorMode] =
    useState<TeamGeneratorMode>('adventure');
  const [teamRevision, setTeamRevision] = useState(0);
  const slotsRef = useRef(slots);
  const resettingRef = useRef(false);
  const removingSlotIdsRef = useRef<Set<number>>(new Set());
  const animationTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const removalTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const hydrationControllerRef = useRef<AbortController>();
  const teamRevisionRef = useRef(0);
  const team = useMemo(
    () =>
      slots
        .map(slot => slot.pokemon)
        .filter((pokemon): pokemon is TeamPokemon => pokemon !== null),
    [slots],
  );
  const analysis = useMemo(() => analyzeTeam(team), [team]);
  const offensiveCoverage = useMemo(
    () =>
      analyzeOffensiveCoverage(team).sort(
        (left, right) =>
          right.strongAgainst.length - left.strongAgainst.length ||
          right.members - left.members ||
          left.type.localeCompare(right.type),
      ),
    [team],
  );

  const sharedWeaknesses = analysis
    .filter(item => item.weak >= 2)
    .sort(
      (left, right) =>
        right.weak - left.weak || left.type.localeCompare(right.type),
    );
  const uncoveredThreats = analysis
    .filter(item => item.weak > 0 && item.resistant + item.immune === 0)
    .sort(
      (left, right) =>
        right.weak - left.weak || left.type.localeCompare(right.type),
    );
  const defensiveAnswers = analysis
    .filter(item => item.resistant + item.immune > 0)
    .sort(
      (left, right) =>
        right.resistant + right.immune - (left.resistant + left.immune) ||
        left.type.localeCompare(right.type),
    );

  useEffect(
    () => () => {
      hydrationControllerRef.current?.abort();
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

  const commitSlots = (nextSlots: TeamSlot[]) => {
    teamRevisionRef.current += 1;
    slotsRef.current = nextSlots;
    setSlots(nextSlots);
    setTeamRevision(teamRevisionRef.current);
  };

  const replaceTeam = (members: TeamPokemon[]) => {
    removalTimersRef.current.forEach(clearTimeout);
    removalTimersRef.current.clear();
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    removingSlotIdsRef.current = new Set();
    resettingRef.current = false;
    setRemovingSlotIds(new Set());
    setResetting(false);

    const uniqueMembers = members.filter(
      (member, index) =>
        members.findIndex(candidate => candidate.id === member.id) === index,
    );
    const nextSlots = createEmptyTeam().map((slot, index) => ({
      ...slot,
      pokemon: uniqueMembers[index] ?? null,
    }));
    commitSlots(nextSlots);
    setSelectedSlotId(nextSlots.find(slot => slot.pokemon === null)?.id ?? 0);
    setPickerGeneration(current => current + 1);
    uniqueMembers.forEach(member => animateAddition(member.id));
  };

  const loadTeam = async (
    entries: PersistedTeamMember[],
    source: string,
  ) => {
    if (entries.length === 0) {
      setStatus(`No ${source} team is available.`);
      return;
    }

    hydrationControllerRef.current?.abort();
    const controller = new AbortController();
    hydrationControllerRef.current = controller;
    const startingRevision = teamRevisionRef.current;
    setLoadingTeam(true);
    setPickerGeneration(current => current + 1);
    setStatus(`Loading ${source} team…`);

    try {
      const members = await Promise.all(
        entries.map(async entry => ({
          ...(await fetchTeamPokemon(entry.name, controller.signal)),
          competitiveSet: entry.competitiveSet,
        })),
      );
      if (controller.signal.aborted) return;
      if (teamRevisionRef.current !== startingRevision) {
        setStatus(`The ${source} team was not applied because the team changed.`);
        return;
      }
      const uniqueMembers = members.filter(
        (member, index) =>
          members.findIndex(candidate => candidate.id === member.id) === index,
      );
      replaceTeam(members);
      const omitted = members.length - uniqueMembers.length;
      setStatus(
        `${source[0].toUpperCase()}${source.slice(1)} team loaded.${
          omitted > 0 ? ` ${omitted} duplicate omitted.` : ''
        }`,
      );
    } catch {
      if (!controller.signal.aborted) {
        setStatus(`The ${source} team could not be loaded.`);
      }
    } finally {
      if (!controller.signal.aborted) setLoadingTeam(false);
    }
  };

  useEffect(() => {
    const sharedNames = parseTeamSearch(window.location.search);
    const savedNames = parseSavedTeam(localStorage.getItem(TEAM_STORAGE_KEY));
    const initialNames = sharedNames.length > 0 ? sharedNames : savedNames;

    if (initialNames.length === 0) {
      setHydrating(false);
      return;
    }

    void loadTeam(initialNames, sharedNames.length > 0 ? 'shared' : 'saved')
      .finally(() => setHydrating(false));
  }, []);

  useEffect(() => {
    if (hydrating) return;
    const search = createTeamSearch(team);
    const nextUrl = `${window.location.pathname}${search}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, [hydrating, team]);

  const setPokemon = (pokemon: TeamPokemon): string | null => {
    if (resettingRef.current) return null;
    if (slotsRef.current.some(slot => slot.pokemon?.id === pokemon.id)) {
      return `${pokemon.displayName} is already on your team.`;
    }

    const targetSlot =
      slotsRef.current.find(slot => slot.id === selectedSlotId && !slot.pokemon) ??
      slotsRef.current.find(slot => !slot.pokemon);
    if (!targetSlot) return 'Your team already has six Pokémon.';

    const nextSlots = slotsRef.current.map(slot =>
      slot.id === targetSlot.id ? { ...slot, pokemon } : slot,
    );
    commitSlots(nextSlots);
    setSelectedSlotId(nextSlots.find(slot => !slot.pokemon)?.id ?? 0);
    setStatus(`${pokemon.displayName} joined the team.`);
    animateAddition(pokemon.id);
    return null;
  };

  const removePokemon = (slotId: number) => {
    if (removingSlotIdsRef.current.has(slotId) || resettingRef.current) return;

    const nextRemoving = new Set(removingSlotIdsRef.current).add(slotId);
    removingSlotIdsRef.current = nextRemoving;
    setRemovingSlotIds(nextRemoving);

    const timer = setTimeout(() => {
      const nextSlots = slotsRef.current.map(slot =>
        slot.id === slotId ? { ...slot, pokemon: null } : slot,
      );
      const remainingRemovals = new Set(removingSlotIdsRef.current);
      remainingRemovals.delete(slotId);
      removingSlotIdsRef.current = remainingRemovals;
      setRemovingSlotIds(remainingRemovals);
      commitSlots(nextSlots);
      setSelectedSlotId(nextSlots.find(slot => !slot.pokemon)?.id ?? 0);
      setStatus('Team member removed.');
      removalTimersRef.current.delete(slotId);
    }, 220);
    removalTimersRef.current.set(slotId, timer);
  };

  const movePokemon = (slotId: number, direction: -1 | 1) => {
    const currentIndex = slotsRef.current.findIndex(slot => slot.id === slotId);
    const targetIndex = currentIndex + direction;
    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= slotsRef.current.length
    ) {
      return;
    }

    const nextSlots = [...slotsRef.current];
    [nextSlots[currentIndex], nextSlots[targetIndex]] = [
      nextSlots[targetIndex],
      nextSlots[currentIndex],
    ];
    commitSlots(nextSlots);
    const pokemon = nextSlots[targetIndex].pokemon;
    if (pokemon) {
      setStatus(
        `${pokemon.displayName} moved to team slot ${targetIndex + 1}.`,
      );
    }
  };

  const resetTeam = () => {
    if (resettingRef.current || team.length === 0) return;

    removalTimersRef.current.forEach(clearTimeout);
    removalTimersRef.current.clear();
    resettingRef.current = true;
    setResetting(true);
    setPickerGeneration(current => current + 1);

    resetTimerRef.current = setTimeout(() => {
      const emptyTeam = createEmptyTeam();
      removingSlotIdsRef.current = new Set();
      resettingRef.current = false;
      commitSlots(emptyTeam);
      setRemovingSlotIds(new Set());
      setSelectedSlotId(0);
      setPickerGeneration(current => current + 1);
      setResetting(false);
      setStatus('Team reset.');
    }, 220);
  };

  const saveTeam = () => {
    localStorage.setItem(TEAM_STORAGE_KEY, serializeTeam(team));
    setStatus('Team saved on this device.');
  };

  const loadSavedTeam = () => {
    const names = parseSavedTeam(localStorage.getItem(TEAM_STORAGE_KEY));
    if (
      team.length > 0 &&
      names.length > 0 &&
      !window.confirm('Replace the current team with your saved team?')
    ) {
      return;
    }
    void loadTeam(names, 'saved');
  };

  const loadVgcPreset = (preset: VgcTeamPreset) => {
    void loadTeam(
      preset.members.map(member => ({
        name: member.pokemon,
        competitiveSet: member.set,
      })),
      `${preset.player}'s ${preset.year} VGC`,
    );
  };

  const confirmRemovePokemon = (slot: TeamSlot) => {
    if (
      slot.pokemon &&
      window.confirm(`Remove ${slot.pokemon.displayName} from the team?`)
    ) {
      removePokemon(slot.id);
    }
  };

  const shareTeam = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Share link copied to your clipboard.');
    } catch {
      setStatus('The shareable team link is ready in the address bar.');
    }
  };

  return (
    <ToolPage>
      <ToolPageHeader
        eyebrow="Pokédex team analysis"
        title="Team Builder"
        description="Build, balance, save, and share a six-Pokémon team."
      />

      <TeamSummaryBar aria-label="Team summary">
        <SummaryStat>
          <SummaryValue>{team.length} / 6</SummaryValue>
          <SummaryLabel>Team members</SummaryLabel>
        </SummaryStat>
        <SummaryStat>
          <SummaryValue>{sharedWeaknesses[0]?.type ?? 'None yet'}</SummaryValue>
          <SummaryLabel>Top shared weakness</SummaryLabel>
        </SummaryStat>
        <SummaryStat>
          <SummaryValue>{uncoveredThreats.length}</SummaryValue>
          <SummaryLabel>Uncovered threats</SummaryLabel>
        </SummaryStat>
        <SummaryStat>
          <SummaryValue>{offensiveCoverage.length}</SummaryValue>
          <SummaryLabel>STAB attack types</SummaryLabel>
        </SummaryStat>
      </TeamSummaryBar>

      <RandomTeamGenerator
        disabled={loadingTeam || resetting || removingSlotIds.size > 0}
        teamRevision={teamRevision}
        onBusyChange={busy => {
          setGeneratingTeam(busy);
          if (busy) setPickerGeneration(current => current + 1);
        }}
        onGenerated={generatedTeam => {
          replaceTeam(generatedTeam);
          setStatus('A balanced six-Pokémon team was generated.');
        }}
        onModeChange={setGeneratorMode}
      />

      {generatorMode === 'vgc' && (
        <React.Suspense fallback={null}>
          <VgcTeamPresetLoader
            disabled={
              loadingTeam ||
              generatingTeam ||
              resetting ||
              removingSlotIds.size > 0
            }
            onLoad={loadVgcPreset}
          />
        </React.Suspense>
      )}

      <TeamPicker
        disabled={
          hydrating ||
          loadingTeam ||
          generatingTeam ||
          resetting ||
          team.length === 6
        }
        key={pickerGeneration}
        slotNumber={
          slots.findIndex(slot => slot.id === selectedSlotId) + 1 || team.length + 1
        }
        onLoaded={setPokemon}
      />

      <TeamGrid>
        {slots.map((slot, index) => (
          <Pokemon
            animateIn={
              slot.pokemon !== null && animatingIds.has(slot.pokemon.id)
            }
            canMoveLeft={slot.pokemon !== null && index > 0}
            canMoveRight={
              slot.pokemon !== null && index < slots.length - 1
            }
            disabled={loadingTeam || generatingTeam || resetting}
            exiting={
              slot.pokemon !== null &&
              (resetting || removingSlotIds.has(slot.id))
            }
            index={index}
            key={slot.id}
            pokemon={slot.pokemon}
            selected={slot.pokemon === null && slot.id === selectedSlotId}
            onMoveLeft={() => movePokemon(slot.id, -1)}
            onMoveRight={() => movePokemon(slot.id, 1)}
            onRemove={() => confirmRemovePokemon(slot)}
            onSelect={() => setSelectedSlotId(slot.id)}
          />
        ))}
      </TeamGrid>

      <ShowdownTeamTransfer
        disabled={
          hydrating ||
          loadingTeam ||
          generatingTeam ||
          resetting ||
          removingSlotIds.size > 0
        }
        team={team}
        onImport={members => void loadTeam(members, 'Showdown')}
      />

      <BuilderToolbar>
        <UtilityButton
          type="button"
          disabled={
            team.length === 0 ||
            loadingTeam ||
            generatingTeam ||
            resetting ||
            removingSlotIds.size > 0
          }
          onClick={saveTeam}
        >
          <FaSave aria-hidden="true" /> Save team
        </UtilityButton>
        <UtilityButton
          type="button"
          disabled={
            team.length === 0 ||
            loadingTeam ||
            generatingTeam ||
            resetting ||
            removingSlotIds.size > 0
          }
          onClick={() => void shareTeam()}
        >
          <FaShareAlt aria-hidden="true" /> Share team
        </UtilityButton>
        <UtilityButton
          type="button"
          disabled={
            loadingTeam ||
            generatingTeam ||
            resetting ||
            removingSlotIds.size > 0
          }
          onClick={loadSavedTeam}
        >
          <FaFolderOpen aria-hidden="true" /> Load saved
        </UtilityButton>
        <UtilityButton
          $danger
          type="button"
          disabled={
            team.length === 0 || resetting || loadingTeam || generatingTeam
          }
          onClick={resetTeam}
        >
          <FaTrash aria-hidden="true" /> Reset team
        </UtilityButton>
        <StatusText aria-live="polite">{status}</StatusText>
      </BuilderToolbar>

      {team.length > 0 && (
        <Analysis aria-live="polite">
          <AnalysisTitle>Team coverage</AnalysisTitle>
          <AnalysisHint>
            Based on typing for {team.length} of 6 team members. Loaded
            competitive sets are shown on each Pokémon card.
          </AnalysisHint>
          <CoverageRow>
            <CoverageRowTitle>Priority threats</CoverageRowTitle>
            <CoverageContent>
              <CoverageGroup>
                <CoverageLabel>Uncovered weaknesses</CoverageLabel>
                <SummaryList
                  count={item => item.weak}
                  emptyMessage="Every current weakness has a resistance or immunity."
                  items={uncoveredThreats}
                  metric={count => `weak member${count === 1 ? '' : 's'}`}
                />
              </CoverageGroup>
              <CoverageGroup>
                <CoverageLabel>Shared weaknesses</CoverageLabel>
                <SummaryList
                  count={item => item.weak}
                  emptyMessage="No type currently threatens multiple team members."
                  items={sharedWeaknesses}
                  metric={count => `weak member${count === 1 ? '' : 's'}`}
                />
              </CoverageGroup>
            </CoverageContent>
          </CoverageRow>
          <CoverageRow>
            <CoverageRowTitle>Defensive answers</CoverageRowTitle>
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
          <CoverageRow>
            <CoverageRowTitle>Offensive STAB</CoverageRowTitle>
            <CoverageContent>
              <CoverageGroup>
                <CoverageLabel>Natural type pressure</CoverageLabel>
                {offensiveCoverage.length === 0 ? (
                  <EmptySummary>Add Pokémon to reveal offensive coverage.</EmptySummary>
                ) : (
                  <TypeList>
                    {offensiveCoverage.map(item => (
                      <SummaryBadge
                        aria-label={`${item.type}: ${item.members} team members, super effective against ${item.strongAgainst.length} types`}
                        className={item.type}
                        key={item.type}
                      >
                        <SummaryIcon src={typeIcons[item.type]} alt="" />
                        <SummaryText>
                          <SummaryType>{item.type}</SummaryType>
                          <SummaryMetric>
                            Covers {item.strongAgainst.length} types
                          </SummaryMetric>
                        </SummaryText>
                        <SummaryCount>{item.members}</SummaryCount>
                      </SummaryBadge>
                    ))}
                  </TypeList>
                )}
              </CoverageGroup>
            </CoverageContent>
          </CoverageRow>
        </Analysis>
      )}
    </ToolPage>
  );
};

export default TeamBuilder;
