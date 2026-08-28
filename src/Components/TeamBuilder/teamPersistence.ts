import { toPokemonApiSlug } from '../Tools/pokemonNames';
import {
  CompetitivePokemonSet,
  normalizeCompetitiveSet,
} from './competitiveSet';
import { TeamPokemon } from './teamAnalysis';

export const TEAM_STORAGE_KEY = 'pokeapp-team';

export type PersistedTeamMember = {
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
    members.push({ name, competitiveSet });
    if (members.length === 6) break;
  }

  return members;
}

export function parseTeamSearch(search: string): PersistedTeamMember[] {
  const params = new URLSearchParams(search);
  const members = normalizePersistedMembers(
    (params.get('team') ?? '').split(','),
  );
  const encodedSets = params.get('sets');
  if (!encodedSets) return members;

  try {
    const parsedSets = JSON.parse(encodedSets);
    if (
      !parsedSets ||
      typeof parsedSets !== 'object' ||
      Array.isArray(parsedSets)
    ) {
      return members;
    }
    return members.map(member => ({
      ...member,
      competitiveSet: normalizeCompetitiveSet(
        (parsedSets as Record<string, unknown>)[member.name],
      ),
    }));
  } catch {
    return members;
  }
}

export function createTeamSearch(team: readonly TeamPokemon[]): string {
  const params = new URLSearchParams();
  const members = normalizePersistedMembers(
    team.map(member => ({
      name: member.name,
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
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function serializeTeam(team: readonly TeamPokemon[]): string {
  return JSON.stringify(
    normalizePersistedMembers(
      team.map(member => ({
        name: member.name,
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
