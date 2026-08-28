import TypeChart from '../../Assets/typeChart';
import TypeList from '../../Assets/typeList';
import TypeMap from '../../Assets/typeMap';
import { CompetitivePokemonSet } from './competitiveSet';

export type TeamPokemon = {
  id: number;
  name: string;
  displayName: string;
  imageUrl: string;
  types: string[];
  baseStats?: Record<string, number>;
  competitiveSet?: CompetitivePokemonSet;
};

export type TeamTypeSummary = {
  type: string;
  weak: number;
  resistant: number;
  immune: number;
};

export type OffensiveTypeSummary = {
  type: string;
  members: number;
  strongAgainst: string[];
};

function formatType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

export function getDefensiveMultiplier(
  defendingTypes: string[],
  attackingType: string,
): number {
  const attackIndex = TypeMap.get(formatType(attackingType));
  if (attackIndex === undefined) {
    throw new Error(`Unknown attacking type: ${attackingType}`);
  }

  return defendingTypes.reduce((multiplier, defendingType) => {
    const defenseIndex = TypeMap.get(formatType(defendingType));
    if (defenseIndex === undefined) {
      throw new Error(`Unknown defending type: ${defendingType}`);
    }

    return multiplier * (TypeChart[attackIndex][defenseIndex] / 2);
  }, 1);
}

export function analyzeTeam(team: TeamPokemon[]): TeamTypeSummary[] {
  return TypeList.map(type => {
    const multipliers = team.map(pokemon =>
      getDefensiveMultiplier(pokemon.types, type),
    );

    return {
      type,
      weak: multipliers.filter(multiplier => multiplier > 1).length,
      resistant: multipliers.filter(
        multiplier => multiplier > 0 && multiplier < 1,
      ).length,
      immune: multipliers.filter(multiplier => multiplier === 0).length,
    };
  });
}

export function analyzeOffensiveCoverage(
  team: TeamPokemon[],
): OffensiveTypeSummary[] {
  return TypeList.map(type => {
    const attackIndex = TypeMap.get(type);
    if (attackIndex === undefined) {
      throw new Error(`Unknown attacking type: ${type}`);
    }

    return {
      type,
      members: team.filter(pokemon =>
        pokemon.types.some(memberType => formatType(memberType) === type),
      ).length,
      strongAgainst: TypeList.filter(
        (_, defenseIndex) => TypeChart[attackIndex][defenseIndex] > 2,
      ),
    };
  }).filter(item => item.members > 0);
}
