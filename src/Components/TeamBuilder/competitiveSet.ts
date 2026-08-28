export const COMPETITIVE_STAT_NAMES = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const;

export type CompetitiveStatName = (typeof COMPETITIVE_STAT_NAMES)[number];
export type CompetitiveStatSpread = Partial<
  Record<CompetitiveStatName, number>
>;

export type CompetitivePokemonSet = {
  ability: string;
  evs: CompetitiveStatSpread;
  gender?: 'M' | 'F';
  item: string;
  ivs?: CompetitiveStatSpread;
  level: number;
  mechanic?: string;
  moves: string[];
  nature: string;
  shiny?: boolean;
  teraType?: string;
  trainingLabel?: string;
};

function normalizeText(value: unknown, maximumLength: number): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maximumLength) return null;
  return normalized;
}

function normalizeSpread(
  value: unknown,
  maximum: number,
): CompetitiveStatSpread | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const spread: CompetitiveStatSpread = {};
  for (const stat of COMPETITIVE_STAT_NAMES) {
    const amount = (value as Record<string, unknown>)[stat];
    if (amount === undefined) continue;
    if (
      typeof amount !== 'number' ||
      !Number.isInteger(amount) ||
      amount < 0 ||
      amount > maximum
    ) {
      return null;
    }
    spread[stat] = amount;
  }
  return spread;
}

export function normalizeCompetitiveSet(
  value: unknown,
): CompetitivePokemonSet | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  const candidate = value as Record<string, unknown>;
  const ability = normalizeText(candidate.ability, 80);
  const item = normalizeText(candidate.item, 80);
  const nature = normalizeText(candidate.nature, 40);
  const evs = normalizeSpread(candidate.evs, 252);
  const moves = Array.isArray(candidate.moves)
    ? candidate.moves
        .map(move => normalizeText(move, 80))
        .filter((move): move is string => move !== null)
        .slice(0, 4)
    : [];

  if (!ability || !item || !nature || !evs || moves.length !== 4) {
    return undefined;
  }

  const evTotal = Object.values(evs).reduce(
    (total, amount) => total + (amount ?? 0),
    0,
  );
  if (evTotal > 510) return undefined;

  const level =
    typeof candidate.level === 'number' &&
    Number.isInteger(candidate.level) &&
    candidate.level >= 1 &&
    candidate.level <= 100
      ? candidate.level
      : 50;
  const ivs =
    candidate.ivs === undefined
      ? undefined
      : normalizeSpread(candidate.ivs, 31) ?? undefined;
  const teraType = normalizeText(candidate.teraType, 30) ?? undefined;
  const mechanic = normalizeText(candidate.mechanic, 120) ?? undefined;
  const trainingLabel =
    normalizeText(candidate.trainingLabel, 30) ?? undefined;
  const gender =
    candidate.gender === 'M' || candidate.gender === 'F'
      ? candidate.gender
      : undefined;

  return {
    ability,
    evs,
    gender,
    item,
    ivs,
    level,
    mechanic,
    moves,
    nature,
    shiny: candidate.shiny === true || undefined,
    teraType,
    trainingLabel,
  };
}

const STAT_LABELS: Record<CompetitiveStatName, string> = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe',
};

export function formatCompetitiveSpread(
  spread: CompetitiveStatSpread | undefined,
  fallback: string,
): string {
  if (!spread) return fallback;
  const values = COMPETITIVE_STAT_NAMES.flatMap(stat =>
    spread[stat] === undefined ? [] : [`${spread[stat]} ${STAT_LABELS[stat]}`],
  );
  return values.length > 0 ? values.join(' / ') : fallback;
}
