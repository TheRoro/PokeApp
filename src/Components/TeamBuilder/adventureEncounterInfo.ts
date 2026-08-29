export type AdventureEncounterInfo = {
  encounterMethod: string;
  evolutionMethod: string;
  levelRange: string;
  location: string;
  sourcePokemon: string;
  tradeRequired: boolean;
  version: string;
};

function normalizeText(
  value: unknown,
  maximumLength: number,
): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  if (!normalized || normalized.length > maximumLength) return undefined;
  return normalized;
}

export function normalizeAdventureEncounterInfo(
  value: unknown,
): AdventureEncounterInfo | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const candidate = value as Record<string, unknown>;
  const encounterMethod = normalizeText(candidate.encounterMethod, 120);
  const evolutionMethod = normalizeText(candidate.evolutionMethod, 500);
  const levelRange = normalizeText(candidate.levelRange, 80);
  const location = normalizeText(candidate.location, 160);
  const sourcePokemon = normalizeText(candidate.sourcePokemon, 80);
  const version = normalizeText(candidate.version, 80);
  if (
    !encounterMethod ||
    !evolutionMethod ||
    !levelRange ||
    !location ||
    !sourcePokemon ||
    !version ||
    typeof candidate.tradeRequired !== 'boolean'
  ) {
    return undefined;
  }
  return {
    encounterMethod,
    evolutionMethod,
    levelRange,
    location,
    sourcePokemon,
    tradeRequired: candidate.tradeRequired,
    version,
  };
}
