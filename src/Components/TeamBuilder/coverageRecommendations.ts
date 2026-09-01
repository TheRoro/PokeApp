import TypeChart from '../../Assets/typeChart';
import TypeMap from '../../Assets/typeMap';
import { formatPokemonName } from '../Tools/pokemonNames';
import {
  analyzeTeam,
  getDefensiveMultiplier,
  TeamPokemon,
} from './teamAnalysis';
import { isSpeciesAvailableInVersion } from './versionAvailability';

export type CoverageRecommendation = {
  name: string;
  reason: string;
};

type Candidate = {
  name: string;
  species?: string;
  types: string[];
};

type RecommendationOptions = {
  allowedSpecies?: ReadonlySet<string>;
  limit?: number;
  version?: string;
};

const CANDIDATES: readonly Candidate[] = [
  { name: 'amoonguss', types: ['grass', 'poison'] },
  { name: 'arcanine', types: ['fire'] },
  { name: 'azumarill', types: ['water', 'fairy'] },
  { name: 'clefable', types: ['fairy'] },
  { name: 'corviknight', types: ['flying', 'steel'] },
  { name: 'dragonite', types: ['dragon', 'flying'] },
  { name: 'excadrill', types: ['ground', 'steel'] },
  { name: 'ferrothorn', types: ['grass', 'steel'] },
  { name: 'gastrodon', types: ['water', 'ground'] },
  { name: 'gengar', types: ['ghost', 'poison'] },
  { name: 'gholdengo', types: ['steel', 'ghost'] },
  { name: 'gliscor', types: ['ground', 'flying'] },
  { name: 'great-tusk', types: ['ground', 'fighting'] },
  { name: 'grimmsnarl', types: ['dark', 'fairy'] },
  { name: 'iron-hands', types: ['fighting', 'electric'] },
  { name: 'kingambit', types: ['dark', 'steel'] },
  { name: 'lucario', types: ['fighting', 'steel'] },
  { name: 'magnezone', types: ['electric', 'steel'] },
  { name: 'mamoswine', types: ['ice', 'ground'] },
  { name: 'primarina', types: ['water', 'fairy'] },
  { name: 'rotom-wash', species: 'rotom', types: ['electric', 'water'] },
  { name: 'scizor', types: ['bug', 'steel'] },
  { name: 'skeledirge', types: ['fire', 'ghost'] },
  { name: 'swampert', types: ['water', 'ground'] },
  { name: 'toxapex', types: ['poison', 'water'] },
  { name: 'tyranitar', types: ['rock', 'dark'] },
  { name: 'umbreon', types: ['dark'] },
  { name: 'venusaur', types: ['grass', 'poison'] },
  { name: 'volcarona', types: ['bug', 'fire'] },
];

function attacksSuperEffectively(attackingTypes: string[], targetType: string) {
  const targetIndex = TypeMap.get(formatPokemonName(targetType));
  if (targetIndex === undefined) return false;
  return attackingTypes.some(type => {
    const attackIndex = TypeMap.get(formatPokemonName(type));
    return attackIndex !== undefined && TypeChart[attackIndex][targetIndex] > 2;
  });
}

export function recommendCoveragePokemon(
  team: readonly TeamPokemon[],
  options: RecommendationOptions = {},
): CoverageRecommendation[] {
  const {
    allowedSpecies,
    limit = 4,
    version,
  } = options;
  if (team.length === 0 || limit <= 0) return [];

  const existingNames = new Set(team.map(member => member.name));
  const existingTypes = new Set(team.flatMap(member => member.types));
  const threats = analyzeTeam([...team])
    .filter(summary => summary.weak > 0)
    .sort(
      (left, right) =>
        Number(right.resistant + right.immune === 0) -
          Number(left.resistant + left.immune === 0) ||
        right.weak - left.weak ||
        left.type.localeCompare(right.type),
    )
    .slice(0, 4);

  return CANDIDATES.filter(
    candidate =>
      !existingNames.has(candidate.name) &&
      (!allowedSpecies ||
        allowedSpecies.has(candidate.species ?? candidate.name)) &&
      (!version ||
        isSpeciesAvailableInVersion(
          candidate.species ?? candidate.name,
          version,
        )),
  )
    .map(candidate => {
      let score = 0;
      const defensiveAnswers: string[] = [];
      const offensiveAnswers: string[] = [];

      threats.forEach(threat => {
        const unanswered = threat.resistant + threat.immune === 0;
        const weight = threat.weak + (unanswered ? 3 : 0);
        const multiplier = getDefensiveMultiplier(
          candidate.types,
          threat.type,
        );
        if (multiplier === 0) {
          score += 5 * weight;
          defensiveAnswers.push(threat.type);
        } else if (multiplier < 1) {
          score += 3 * weight;
          defensiveAnswers.push(threat.type);
        } else if (multiplier > 1) {
          score -= 2 * weight;
        }
        if (attacksSuperEffectively(candidate.types, threat.type)) {
          score += 2 * weight;
          offensiveAnswers.push(threat.type);
        }
      });

      score += candidate.types.filter(type => !existingTypes.has(type)).length;
      const answered = [...new Set([...defensiveAnswers, ...offensiveAnswers])];
      const reason =
        answered.length > 0
          ? `Helps against ${answered.slice(0, 2).join(' and ')}`
          : `Adds ${candidate.types.map(formatPokemonName).join(' and ')} coverage`;

      return { ...candidate, reason, score };
    })
    .sort(
      (left, right) =>
        right.score - left.score || left.name.localeCompare(right.name),
    )
    .slice(0, limit)
    .map(candidate => ({
      name: candidate.name,
      reason: candidate.reason,
    }));
}
