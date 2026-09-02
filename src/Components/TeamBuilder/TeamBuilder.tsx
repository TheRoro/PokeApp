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
import type { TeamGeneratorContext } from './RandomTeamGenerator';
import type { TeamGeneratorMode } from './balancedTeamGenerator';
import { DEFAULT_ADVENTURE_RESTRICTIONS } from './adventureRestrictions';
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
  SummaryMetric,
  SummaryText,
  SummaryType,
  TeamGrid,
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
import type { CoverageRecommendation } from './coverageRecommendations';
import {
  ADVENTURE_GAME_NAMES,
  adventureRegionForGame,
  adventureStarterSpecies,
} from './adventureStarters';
import { toPokemonApiSlug } from '../Tools/pokemonNames';

const VgcTeamPresetLoader = React.lazy(
  () => import('./VgcTeamPresetLoader'),
);
const ShowdownTeamTransfer = React.lazy(
  () => import('./ShowdownTeamTransfer'),
);

type TeamSlot = {
  id: number;
  pokemon: TeamPokemon | null;
};

type AdventureScope = Extract<
  TeamGeneratorContext['scope'],
  { kind: 'game' | 'region' }
>;

const createEmptyTeam = (): TeamSlot[] =>
  Array.from({ length: 6 }, (_, id) => ({ id, pokemon: null }));

function inferAdventureScope(team: readonly TeamPokemon[]): AdventureScope | null {
  const versions = [
    ...new Set(
      team
        .map(member => member.adventureInfo?.version)
        .filter((version): version is string => Boolean(version))
        .map(toPokemonApiSlug)
        .filter(version => ADVENTURE_GAME_NAMES.has(version)),
    ),
  ];
  if (versions.length === 0) return null;
  if (versions.length === 1) return { kind: 'game', value: versions[0] };

  const regions = [
    ...new Set(
      versions
        .map(adventureRegionForGame)
        .filter((region): region is string => Boolean(region)),
    ),
  ];
  return regions.length === 1
    ? { kind: 'region', value: regions[0] }
    : null;
}

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
  const [addingPokemon, setAddingPokemon] = useState(false);
  const [generatingTeam, setGeneratingTeam] = useState(false);
  const [generatorMode, setGeneratorMode] =
    useState<TeamGeneratorMode>('adventure');
  const [replacingSlotId, setReplacingSlotId] = useState<number | null>(null);
  const [coverageRecommendations, setCoverageRecommendations] = useState<
    CoverageRecommendation[]
  >([]);
  const [teamRevision, setTeamRevision] = useState(0);
  const [generatorContext, setGeneratorContext] =
    useState<TeamGeneratorContext>({
      mode: 'adventure',
      restrictions: DEFAULT_ADVENTURE_RESTRICTIONS,
      scope: { kind: 'game', value: 'red' },
    });
  const pickerInputRef = useRef<HTMLInputElement>(null);
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
  const replacementPokemon = useMemo(
    () =>
      replacingSlotId === null
        ? null
        : slots.find(slot => slot.id === replacingSlotId)?.pokemon ?? null,
    [replacingSlotId, slots],
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

  useEffect(() => {
    let active = true;
    const recommendationTeam = replacementPokemon
      ? team.filter(member => member.id !== replacementPokemon.id)
      : team;
    if (recommendationTeam.length === 0) {
      setCoverageRecommendations([]);
      return () => {
        active = false;
      };
    }

    const adventureScope =
      generatorContext.mode === 'adventure' &&
      (generatorContext.scope.kind === 'game' ||
        generatorContext.scope.kind === 'region')
        ? inferAdventureScope(team) ?? generatorContext.scope
        : null;
    const recommendationRequest = adventureScope
      ? Promise.all([
          import('./coverageRecommendations'),
          import('./balancedTeamGenerator').then(
            ({ resolvePokemonSpeciesPool }) =>
              resolvePokemonSpeciesPool(adventureScope, {
                includeDlc: !generatorContext.restrictions.noDlc,
              }),
          ),
        ])
      : import('./coverageRecommendations').then(module => [module, null] as const);

    void recommendationRequest
      .then(async ([{ recommendCoveragePokemon }, pool]) => {
        const existingStarter = recommendationTeam.some(
          member =>
            member.adventureInfo?.encounterMethod === 'Starter gift',
        );
        const excludedStarters =
          existingStarter && adventureScope
            ? adventureStarterSpecies(
                adventureScope.kind,
                adventureScope.value,
              )
            : new Set<string>();
        let recommendations = recommendCoveragePokemon(recommendationTeam, {
          allowedSpecies: pool
            ? new Set(
                pool
                  .map(species => species.name)
                  .filter(species => !excludedStarters.has(species)),
              )
            : undefined,
          excludeVersionExclusives:
            generatorContext.restrictions.noVersionExclusives,
          limit:
            adventureScope && generatorContext.restrictions.noTrades
              ? 12
              : 4,
          version:
            adventureScope?.kind === 'game'
              ? adventureScope.value
              : undefined,
        });
        if (adventureScope && generatorContext.restrictions.noTrades) {
          const { loadAdventureEncounterInfo } = await import(
            './adventureEncounter'
          );
          const eligibility = await Promise.all(
            recommendations.map(async recommendation => ({
              recommendation,
              info: await loadAdventureEncounterInfo({
                pokemonName: recommendation.name,
                scope: adventureScope,
              }),
            })),
          );
          recommendations = eligibility
            .filter(candidate => !candidate.info.tradeRequired)
            .map(candidate => candidate.recommendation)
            .slice(0, 4);
        }
        if (active) setCoverageRecommendations(recommendations);
      })
      .catch(() => {
        if (active) setCoverageRecommendations([]);
      });

    return () => {
      active = false;
    };
  }, [generatorContext, replacementPokemon, team]);

  useEffect(() => {
    if (replacingSlotId !== null) pickerInputRef.current?.focus();
  }, [pickerGeneration, replacingSlotId]);

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
    setReplacingSlotId(null);

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
        entries.map(async entry => {
          const pokemon = await fetchTeamPokemon(
            entry.name,
            controller.signal,
          );
          const isShiny =
            entry.isShiny === true || entry.competitiveSet?.shiny === true;
          return {
            ...pokemon,
            adventureInfo: entry.adventureInfo,
            competitiveSet: entry.competitiveSet,
            imageUrl:
              isShiny && pokemon.shinyImageUrl
                ? pokemon.shinyImageUrl
                : pokemon.imageUrl,
            isShiny: isShiny || undefined,
          };
        }),
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

    if (sharedNames.length === 0) {
      setHydrating(false);
      return;
    }

    void loadTeam(sharedNames, 'shared')
      .finally(() => setHydrating(false));
  }, []);

  useEffect(() => {
    if (hydrating) return;
    const search = createTeamSearch(team);
    const nextUrl = `${window.location.pathname}${search}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, [hydrating, team]);

  const setPokemon = async (
    pokemon: TeamPokemon,
    signal: AbortSignal,
  ): Promise<string | null> => {
    if (resettingRef.current) return null;
    if (
      slotsRef.current.some(
        slot =>
          slot.id !== replacingSlotId && slot.pokemon?.id === pokemon.id,
      )
    ) {
      return `${pokemon.displayName} is already on your team.`;
    }

    const targetSlot =
      (replacingSlotId === null
        ? undefined
        : slotsRef.current.find(
            slot => slot.id === replacingSlotId && slot.pokemon,
          )) ??
      slotsRef.current.find(slot => slot.id === selectedSlotId && !slot.pokemon) ??
      slotsRef.current.find(slot => !slot.pokemon);
    if (!targetSlot) return 'Your team already has six Pokémon.';
    if (targetSlot.pokemon?.id === pokemon.id) {
      return `${pokemon.displayName} is already in this slot.`;
    }

    let teamMember = pokemon;
    if (
      generatorContext.mode === 'adventure' &&
      (generatorContext.scope.kind === 'game' ||
        generatorContext.scope.kind === 'region')
    ) {
      const adventureScope =
        inferAdventureScope(
          slotsRef.current
            .map(slot => slot.pokemon)
            .filter((member): member is TeamPokemon => member !== null),
        ) ?? generatorContext.scope;
      if (!adventureScope.value.trim()) {
        return 'Choose an Adventure game or region before adding a Pokémon.';
      }
      setStatus(`Loading Adventure details for ${pokemon.displayName}…`);
      const { loadAdventureEncounterInfo } = await import(
        './adventureEncounter'
      );
      const { resolvePokemonSpeciesPool } = await import(
        './balancedTeamGenerator'
      );
      const allowedPool = await resolvePokemonSpeciesPool(adventureScope, {
        includeDlc: !generatorContext.restrictions.noDlc,
        signal,
      });
      if (
        !allowedPool.some(
          species =>
            species.name === (pokemon.speciesName ?? pokemon.name),
        )
      ) {
        return `${pokemon.displayName} is not available before the postgame with the current Adventure restrictions.`;
      }
      const adventureInfo = await loadAdventureEncounterInfo({
        pokemonName: pokemon.name,
        scope: adventureScope,
        signal,
      });
      if (signal.aborted) return null;
      if (
        adventureInfo.encounterMethod === 'Starter gift' &&
        slotsRef.current.some(
          slot =>
            slot.id !== targetSlot.id &&
            slot.pokemon?.adventureInfo?.encounterMethod === 'Starter gift',
        )
      ) {
        return 'Adventure teams can include only one starter from the selected game.';
      }
      if (
        generatorContext.restrictions.noTrades &&
        adventureInfo.tradeRequired
      ) {
        return `${pokemon.displayName} requires a trade and is excluded by the current Adventure restrictions.`;
      }
      teamMember = { ...pokemon, adventureInfo };
    }

    if (
      slotsRef.current.some(
        slot =>
          slot.id !== targetSlot.id && slot.pokemon?.id === pokemon.id,
      )
    ) {
      return `${pokemon.displayName} is already on your team.`;
    }
    const replacedPokemon = targetSlot.pokemon;
    const nextSlots = slotsRef.current.map(slot =>
      slot.id === targetSlot.id ? { ...slot, pokemon: teamMember } : slot,
    );
    commitSlots(nextSlots);
    setReplacingSlotId(null);
    setSelectedSlotId(nextSlots.find(slot => !slot.pokemon)?.id ?? 0);
    setStatus(
      replacedPokemon
        ? `${replacedPokemon.displayName} was replaced by ${pokemon.displayName}.`
        : `${pokemon.displayName} joined the team.`,
    );
    animateAddition(teamMember.id);
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
      if (replacingSlotId === slotId) setReplacingSlotId(null);
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
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.hash}`,
    );
    resettingRef.current = true;
    setResetting(true);
    setPickerGeneration(current => current + 1);
    setReplacingSlotId(null);

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

      <RandomTeamGenerator
        disabled={
          addingPokemon ||
          loadingTeam ||
          resetting ||
          removingSlotIds.size > 0
        }
        teamSize={team.length}
        teamRevision={teamRevision}
        onBusyChange={busy => {
          setGeneratingTeam(busy);
          if (busy) setPickerGeneration(current => current + 1);
        }}
        onContextChange={setGeneratorContext}
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

      {(team.length < 6 || replacingSlotId !== null) && (
        <TeamPicker
          disabled={
            hydrating ||
            loadingTeam ||
            generatingTeam ||
            resetting
          }
          inputRef={pickerInputRef}
          key={pickerGeneration}
          onBusyChange={setAddingPokemon}
          recommendations={coverageRecommendations}
          replacingPokemonName={replacementPokemon?.displayName}
          slotNumber={
            slots.findIndex(slot => slot.id === selectedSlotId) + 1 ||
            team.length + 1
          }
          teamEmpty={team.length === 0}
          onLoaded={setPokemon}
        />
      )}

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
            disabled={
              addingPokemon || loadingTeam || generatingTeam || resetting
            }
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
            onRemove={() => removePokemon(slot.id)}
            onReplace={() => {
              setSelectedSlotId(slot.id);
              setReplacingSlotId(slot.id);
              setPickerGeneration(current => current + 1);
            }}
            onSelect={() => {
              setSelectedSlotId(slot.id);
              setReplacingSlotId(null);
              pickerInputRef.current?.focus();
            }}
          />
        ))}
      </TeamGrid>

      <React.Suspense fallback={null}>
        <ShowdownTeamTransfer
          disabled={
            hydrating ||
            addingPokemon ||
            loadingTeam ||
            generatingTeam ||
            resetting ||
            removingSlotIds.size > 0
          }
          team={team}
          onImport={members => void loadTeam(members, 'Showdown')}
        />
      </React.Suspense>

      <BuilderToolbar>
        <UtilityButton
          type="button"
          disabled={
            team.length === 0 ||
            addingPokemon ||
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
            addingPokemon ||
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
            addingPokemon ||
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
            team.length === 0 ||
            resetting ||
            loadingTeam ||
            generatingTeam
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
