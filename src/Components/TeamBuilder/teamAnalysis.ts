import TypeChart from '../../Assets/typeChart';
import TypeList from '../../Assets/typeList';
import TypeMap from '../../Assets/typeMap';

export type TeamPokemon = {
  id: number;
  name: string;
  displayName: string;
  imageUrl: string;
  types: string[];
};

export type TeamTypeSummary = {
  type: string;
  weak: number;
  resistant: number;
  immune: number;
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
