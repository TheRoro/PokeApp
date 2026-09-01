import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaMagic } from 'react-icons/fa';
import type {
  GeneratedTeamPokemon,
  TeamGeneratorMode,
} from './balancedTeamGenerator';
import {
  loadTeamFilterCatalog,
  TeamFilterCatalog,
  TeamFilterOption,
  TeamGenerationScope,
} from './teamFilterCatalog';
import {
  ControlField,
  ControlSelect,
  GenerateButton,
  GeneratorBadge,
  GeneratorControls,
  GeneratorHeader,
  GeneratorIcon,
  GeneratorMessage,
  GeneratorPanel,
  GeneratorTitle,
  LoadingSpinner,
} from './TeamBuilderStyles';

type PoolKind = TeamGenerationScope['kind'];

type Props = {
  disabled: boolean;
  teamSize: number;
  teamRevision: number;
  onBusyChange: (busy: boolean) => void;
  onContextChange: (context: TeamGeneratorContext) => void;
  onGenerated: (team: GeneratedTeamPokemon[]) => void;
  onModeChange: (mode: TeamGeneratorMode) => void;
};

export type TeamGeneratorContext = {
  mode: TeamGeneratorMode;
  scope: TeamGenerationScope;
};

function optionsForPool(
  catalog: TeamFilterCatalog | null,
  pool: PoolKind,
): TeamFilterOption[] {
  if (!catalog || pool === 'all') return [];
  if (pool === 'generation') return catalog.generations;
  if (pool === 'region') return catalog.regions;
  return catalog.games;
}

function defaultPool(mode: TeamGeneratorMode): PoolKind {
  if (mode === 'adventure') return 'game';
  return 'all';
}

const RandomTeamGenerator: React.FC<Props> = ({
  disabled,
  teamSize,
  teamRevision,
  onBusyChange,
  onContextChange,
  onGenerated,
  onModeChange,
}) => {
  const [catalog, setCatalog] = useState<TeamFilterCatalog | null>(null);
  const [mode, setMode] = useState<TeamGeneratorMode>('adventure');
  const [poolKind, setPoolKind] = useState<PoolKind>('game');
  const [scopeValue, setScopeValue] = useState('red');
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const generationControllerRef = useRef<AbortController>();
  const revisionRef = useRef(teamRevision);
  const options = useMemo(
    () => optionsForPool(catalog, poolKind),
    [catalog, poolKind],
  );
  const activeScope = useMemo<TeamGenerationScope>(
    () =>
      poolKind === 'all'
        ? { kind: 'all' }
        : { kind: poolKind, value: scopeValue },
    [poolKind, scopeValue],
  );

  useEffect(() => {
    revisionRef.current = teamRevision;
  }, [teamRevision]);

  useEffect(() => {
    onContextChange({ mode, scope: activeScope });
  }, [activeScope, mode, onContextChange]);

  useEffect(() => {
    const controller = new AbortController();

    loadTeamFilterCatalog({ signal: controller.signal })
      .then(setCatalog)
      .catch(error => {
        if (controller.signal.aborted) return;
        setMessage(
          error instanceof Error
            ? error.message
            : 'Team filters could not be loaded.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCatalog(false);
      });

    return () => {
      controller.abort();
      generationControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (poolKind === 'all') {
      setScopeValue('');
      return;
    }
    if (!catalog) return;
    if (!options.some(option => option.value === scopeValue)) {
      setScopeValue(options[0]?.value ?? '');
    }
  }, [catalog, options, poolKind, scopeValue]);

  const changeMode = (nextMode: TeamGeneratorMode) => {
    setMode(nextMode);
    onModeChange(nextMode);
    setPoolKind(defaultPool(nextMode));
    setScopeValue('');
    setMessage('');
  };

  const generate = async () => {
    const scope = activeScope;
    generationControllerRef.current?.abort();
    const controller = new AbortController();
    generationControllerRef.current = controller;
    const startingRevision = revisionRef.current;
    setGenerating(true);
    onBusyChange(true);
    setMessage(
      mode === 'vgc'
        ? 'Building a competitive roster from stat and matchup heuristics…'
        : 'Comparing candidates for defensive, offensive, and stat balance…',
    );

    try {
      const { generateBalancedTeam } = await import(
        './balancedTeamGenerator'
      );
      const team = await generateBalancedTeam({
        mode,
        scope,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      if (revisionRef.current !== startingRevision) {
        setMessage('The team changed, so the generated result was not applied.');
        return;
      }
      onGenerated(team);
      setMessage('');
    } catch (error) {
      if (controller.signal.aborted) return;
      setMessage(
        error instanceof Error
          ? error.message
          : 'A balanced team could not be generated.',
      );
    } finally {
      if (!controller.signal.aborted) {
        setGenerating(false);
        onBusyChange(false);
      }
    }
  };

  const description =
    mode === 'adventure'
      ? 'Creates an in-game journey team with exactly one starter, local availability, encounter guidance, and no legendary or mythical encounters.'
      : mode === 'general'
        ? 'Creates a fully evolved team from all generations or one generation. Legendary and mythical Pokémon can appear.'
        : 'Creates a competitive doubles roster using stat, role, typing, and matchup heuristics. Exact regulation legality is not guaranteed.';
  const encounterDataNotice =
    mode === 'adventure' && poolKind === 'game'
      ? scopeValue === 'scarlet' || scopeValue === 'violet'
        ? 'Scarlet and Violet'
        : scopeValue === 'legends-arceus'
          ? 'Legends: Arceus'
          : null
      : null;
  const visibleMessage =
    message ||
    (encounterDataNotice
      ? `${encounterDataNotice} data note: Nothing is wrong with your team. PokéAPI does not currently publish encounter locations or levels for this selection, so check the in game Pokédex or map for the exact area.`
      : '');

  return (
    <GeneratorPanel>
      <GeneratorHeader>
        <GeneratorTitle>
          <GeneratorIcon>
            <FaMagic aria-hidden="true" />
          </GeneratorIcon>
          <span>
            <strong>Team generator</strong>
            <small>{description}</small>
          </span>
        </GeneratorTitle>
        <GeneratorBadge>
          <strong>{teamSize} / 6</strong>
          <span>roster</span>
        </GeneratorBadge>
      </GeneratorHeader>
      <GeneratorControls>
        <ControlField>
          Mode
          <ControlSelect
            aria-label="Team generation mode"
            value={mode}
            onChange={event =>
              changeMode(event.target.value as TeamGeneratorMode)
            }
          >
            <option value="adventure">Adventure</option>
            <option value="general">General</option>
            <option value="vgc">Competitive</option>
          </ControlSelect>
        </ControlField>
        <ControlField>
          Pool
          <ControlSelect
            aria-label="Random team scope"
            value={poolKind}
            disabled={mode === 'vgc'}
            onChange={event => {
              setPoolKind(event.target.value as PoolKind);
              setScopeValue('');
            }}
          >
            {mode === 'adventure' ? (
              <>
                <option value="game">Specific game</option>
                <option value="region">Region</option>
              </>
            ) : mode === 'general' ? (
              <>
                <option value="all">All generations</option>
                <option value="generation">Generation</option>
              </>
            ) : (
              <option value="all">Competitive national pool</option>
            )}
          </ControlSelect>
        </ControlField>
        <ControlField>
          Selection
          <ControlSelect
            aria-label="Random team selection"
            value={scopeValue}
            onChange={event => setScopeValue(event.target.value)}
            disabled={poolKind === 'all' || loadingCatalog}
          >
            {poolKind === 'all' ? (
              <option value="">
                {mode === 'vgc'
                  ? 'Competitive eligible heuristic'
                  : 'Entire National Pokédex'}
              </option>
            ) : options.length > 0 ? (
              options.map(option => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))
            ) : (
              <option value="">No selections available</option>
            )}
          </ControlSelect>
        </ControlField>
        <GenerateButton
          type="button"
          disabled={
            disabled ||
            generating ||
            (poolKind !== 'all' && (loadingCatalog || !scopeValue))
          }
          onClick={() => void generate()}
        >
          {generating ? (
            <>
              <LoadingSpinner aria-hidden="true" /> Building team…
            </>
          ) : (
            'Generate team'
          )}
        </GenerateButton>
      </GeneratorControls>
      <GeneratorMessage role="status">{visibleMessage}</GeneratorMessage>
    </GeneratorPanel>
  );
};

export default RandomTeamGenerator;
