import { toPokemonApiSlug } from '../Tools/pokemonNames';
import {
  AdventureEncounterInfo,
  normalizeAdventureEncounterInfo,
} from './adventureEncounterInfo';
import {
  CompetitivePokemonSet,
  normalizeCompetitiveSet,
} from './competitiveSet';
import { TeamPokemon } from './teamAnalysis';

export const TEAM_STORAGE_KEY = 'pokeapp-team';

export type PersistedTeamMember = {
  adventureInfo?: AdventureEncounterInfo;
  competitiveSet?: CompetitivePokemonSet;
  name: string;
};

export function normalizeTeamNames(values: string[]): string[] {
  const uniqueNames = new Set<string>();

  values.forEach(value => {
    const slug = toPokemonApiSlug(value);
    if (slug && uniqueNames.size < 6) uniqueNames.add(slug);
  });

  return [...uniqueNames];
}

function normalizePersistedMembers(
  values: readonly unknown[],
): PersistedTeamMember[] {
  const members: PersistedTeamMember[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const rawName =
      typeof value === 'string'
        ? value
        : value && typeof value === 'object'
          ? (value as Record<string, unknown>).name
          : '';
    if (typeof rawName !== 'string') continue;
    const name = toPokemonApiSlug(rawName);
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const competitiveSet =
      typeof value === 'object' && value !== null
        ? normalizeCompetitiveSet(
            (value as Record<string, unknown>).competitiveSet,
          )
        : undefined;
    const adventureInfo =
      typeof value === 'object' && value !== null
        ? normalizeAdventureEncounterInfo(
            (value as Record<string, unknown>).adventureInfo,
          )
        : undefined;
    members.push({
      name,
      ...(adventureInfo ? { adventureInfo } : {}),
      ...(competitiveSet ? { competitiveSet } : {}),
    });
    if (members.length === 6) break;
  }

  return members;
}

export function parseTeamSearch(search: string): PersistedTeamMember[] {
  const params = new URLSearchParams(search);
  const members = normalizePersistedMembers(
    (params.get('team') ?? '').split(','),
  );

  const parseRecord = (key: string): Record<string, unknown> => {
    const encoded = params.get(key);
    if (!encoded) return {};
    try {
      const value = JSON.parse(encoded);
      return value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  };
  const parsedSets = parseRecord('sets');
  const parsedAdventure = parseRecord('adventure');

  return members.map(member => {
    const adventureInfo = normalizeAdventureEncounterInfo(
      parsedAdventure[member.name],
    );
    const competitiveSet = normalizeCompetitiveSet(parsedSets[member.name]);
    return {
      ...member,
      ...(adventureInfo ? { adventureInfo } : {}),
      ...(competitiveSet ? { competitiveSet } : {}),
    };
  });
}

export function createTeamSearch(team: readonly TeamPokemon[]): string {
  const params = new URLSearchParams();
  const members = normalizePersistedMembers(
    team.map(member => ({
      name: member.name,
      adventureInfo: member.adventureInfo,
      competitiveSet: member.competitiveSet,
    })),
  );
  if (members.length > 0) {
    params.set('team', members.map(member => member.name).join(','));
  }
  const sets = Object.fromEntries(
    members.flatMap(member =>
      member.competitiveSet
        ? [[member.name, member.competitiveSet] as const]
        : [],
    ),
  );
  if (Object.keys(sets).length > 0) {
    params.set('sets', JSON.stringify(sets));
  }
  const adventure = Object.fromEntries(
    members.flatMap(member =>
      member.adventureInfo
        ? [[member.name, member.adventureInfo] as const]
        : [],
    ),
  );
  if (Object.keys(adventure).length > 0) {
    params.set('adventure', JSON.stringify(adventure));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function serializeTeam(team: readonly TeamPokemon[]): string {
  return JSON.stringify(
    normalizePersistedMembers(
      team.map(member => ({
        name: member.name,
        adventureInfo: member.adventureInfo,
        competitiveSet: member.competitiveSet,
      })),
    ),
  );
}

export function parseSavedTeam(value: string | null): PersistedTeamMember[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? normalizePersistedMembers(parsed)
      : [];
  } catch {
    return [];
  }
}
