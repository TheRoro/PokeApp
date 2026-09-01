const SCARLET_EXCLUSIVES = new Set([
  'armarouge',
  'brute-bonnet',
  'deino',
  'dragalge',
  'drifblim',
  'drifloon',
  'flutter-mane',
  'great-tusk',
  'hydreigon',
  'koraidon',
  'larvitar',
  'oranguru',
  'pupitar',
  'roaring-moon',
  'sandy-shocks',
  'scream-tail',
  'skrelp',
  'skuntank',
  'slither-wing',
  'stonjourner',
  'stunky',
  'tyranitar',
  'zweilous',
]);

const VIOLET_EXCLUSIVES = new Set([
  'bagon',
  'ceruledge',
  'clawitzer',
  'clauncher',
  'dragapult',
  'dreepy',
  'drakloak',
  'eiscue',
  'gulpin',
  'iron-bundle',
  'iron-hands',
  'iron-jugulis',
  'iron-moth',
  'iron-thorns',
  'iron-treads',
  'iron-valiant',
  'miraidon',
  'misdreavus',
  'mismagius',
  'passimian',
  'salamence',
  'shelgon',
  'swalot',
]);

export function isSpeciesAvailableInVersion(
  speciesName: string,
  versionName: string,
): boolean {
  const species = speciesName.trim().toLowerCase();
  const version = versionName.trim().toLowerCase();
  if (version === 'scarlet') return !VIOLET_EXCLUSIVES.has(species);
  if (version === 'violet') return !SCARLET_EXCLUSIVES.has(species);
  return true;
}

export function isKnownVersionExclusive(
  speciesName: string,
  versionName: string,
): boolean {
  const species = speciesName.trim().toLowerCase();
  const version = versionName.trim().toLowerCase();
  if (version === 'scarlet') return SCARLET_EXCLUSIVES.has(species);
  if (version === 'violet') return VIOLET_EXCLUSIVES.has(species);
  return false;
}
