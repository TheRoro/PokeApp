const REGION_STARTERS: Record<string, readonly string[]> = {
  kanto: ['bulbasaur', 'charmander', 'squirtle'],
  johto: ['chikorita', 'cyndaquil', 'totodile'],
  hoenn: ['treecko', 'torchic', 'mudkip'],
  sinnoh: ['turtwig', 'chimchar', 'piplup'],
  unova: ['snivy', 'tepig', 'oshawott'],
  kalos: ['chespin', 'fennekin', 'froakie'],
  alola: ['rowlet', 'litten', 'popplio'],
  galar: ['grookey', 'scorbunny', 'sobble'],
  hisui: ['rowlet', 'cyndaquil', 'oshawott'],
  paldea: ['sprigatito', 'fuecoco', 'quaxly'],
};

const GAME_REGIONS: Record<string, keyof typeof REGION_STARTERS> = {
  red: 'kanto',
  blue: 'kanto',
  'red-japan': 'kanto',
  'green-japan': 'kanto',
  'blue-japan': 'kanto',
  firered: 'kanto',
  leafgreen: 'kanto',
  gold: 'johto',
  silver: 'johto',
  crystal: 'johto',
  heartgold: 'johto',
  soulsilver: 'johto',
  ruby: 'hoenn',
  sapphire: 'hoenn',
  emerald: 'hoenn',
  'omega-ruby': 'hoenn',
  'alpha-sapphire': 'hoenn',
  diamond: 'sinnoh',
  pearl: 'sinnoh',
  platinum: 'sinnoh',
  'brilliant-diamond': 'sinnoh',
  'shining-pearl': 'sinnoh',
  black: 'unova',
  white: 'unova',
  'black-2': 'unova',
  'white-2': 'unova',
  x: 'kalos',
  y: 'kalos',
  sun: 'alola',
  moon: 'alola',
  'ultra-sun': 'alola',
  'ultra-moon': 'alola',
  sword: 'galar',
  shield: 'galar',
  'legends-arceus': 'hisui',
  scarlet: 'paldea',
  violet: 'paldea',
};

const GAME_STARTER_OVERRIDES: Record<string, readonly string[]> = {
  yellow: ['pikachu'],
  'lets-go-pikachu': ['pikachu'],
  'lets-go-eevee': ['eevee'],
  'legends-arceus': ['rowlet', 'cyndaquil', 'oshawott'],
  'legends-za': ['chikorita', 'tepig', 'totodile'],
};

const FINAL_SPECIES_BY_STARTER: Record<string, readonly string[]> = {
  bulbasaur: ['venusaur'],
  charmander: ['charizard'],
  squirtle: ['blastoise'],
  chikorita: ['meganium'],
  cyndaquil: ['typhlosion'],
  totodile: ['feraligatr'],
  treecko: ['sceptile'],
  torchic: ['blaziken'],
  mudkip: ['swampert'],
  turtwig: ['torterra'],
  chimchar: ['infernape'],
  piplup: ['empoleon'],
  snivy: ['serperior'],
  tepig: ['emboar'],
  oshawott: ['samurott'],
  chespin: ['chesnaught'],
  fennekin: ['delphox'],
  froakie: ['greninja'],
  rowlet: ['decidueye'],
  litten: ['incineroar'],
  popplio: ['primarina'],
  grookey: ['rillaboom'],
  scorbunny: ['cinderace'],
  sobble: ['inteleon'],
  sprigatito: ['meowscarada'],
  fuecoco: ['skeledirge'],
  quaxly: ['quaquaval'],
  pikachu: ['raichu'],
  eevee: [
    'vaporeon',
    'jolteon',
    'flareon',
    'espeon',
    'umbreon',
    'leafeon',
    'glaceon',
    'sylveon',
  ],
};

const PARTNER_STARTERS_BY_GAME: Record<string, string> = {
  yellow: 'pikachu',
  'lets-go-pikachu': 'pikachu',
  'lets-go-eevee': 'eevee',
};

const STARTER_VARIETIES_BY_GAME: Record<string, Record<string, string>> = {
  'lets-go-pikachu': {
    pikachu: 'pikachu-starter',
  },
  'lets-go-eevee': {
    eevee: 'eevee-starter',
  },
  'legends-arceus': {
    decidueye: 'decidueye-hisui',
    typhlosion: 'typhlosion-hisui',
    samurott: 'samurott-hisui',
  },
};

export const ADVENTURE_GAME_NAMES = new Set([
  ...Object.keys(GAME_REGIONS),
  ...Object.keys(GAME_STARTER_OVERRIDES),
]);

export function adventureRegionForGame(value: string): string | undefined {
  return GAME_REGIONS[value.trim().toLowerCase()];
}

export function adventureStarterRoots(
  kind: 'game' | 'region',
  value: string,
): ReadonlySet<string> {
  const normalizedValue = value.trim().toLowerCase();
  const starters =
    kind === 'region'
      ? REGION_STARTERS[normalizedValue]
      : GAME_STARTER_OVERRIDES[normalizedValue] ??
        REGION_STARTERS[GAME_REGIONS[normalizedValue]];
  return new Set(starters ?? []);
}

export function finalStarterSpecies(
  starterRoots: ReadonlySet<string>,
): ReadonlySet<string> {
  return new Set(
    [...starterRoots].flatMap(root => FINAL_SPECIES_BY_STARTER[root] ?? []),
  );
}

export function adventureStarterSpecies(
  kind: 'game' | 'region',
  value: string,
): ReadonlySet<string> {
  const normalizedValue = value.trim().toLowerCase();
  const partnerStarter =
    kind === 'game' ? PARTNER_STARTERS_BY_GAME[normalizedValue] : undefined;
  return partnerStarter
    ? new Set([partnerStarter])
    : finalStarterSpecies(adventureStarterRoots(kind, normalizedValue));
}

export function adventureStarterDoesNotEvolve(
  kind: 'game' | 'region',
  value: string,
  speciesName: string,
): boolean {
  if (kind !== 'game') return false;
  return PARTNER_STARTERS_BY_GAME[value.trim().toLowerCase()] === speciesName;
}

export function isAdventureStarter(
  kind: 'game' | 'region',
  value: string,
  speciesName: string,
  evolutionRoot: string,
): boolean {
  const normalizedValue = value.trim().toLowerCase();
  const partnerStarter =
    kind === 'game' ? PARTNER_STARTERS_BY_GAME[normalizedValue] : undefined;
  if (partnerStarter) return speciesName === partnerStarter;
  return adventureStarterRoots(kind, normalizedValue).has(evolutionRoot);
}

export function adventureStarterVariety(
  kind: 'game' | 'region',
  value: string,
  speciesName: string,
): string | undefined {
  if (kind !== 'game') return undefined;
  return STARTER_VARIETIES_BY_GAME[value.trim().toLowerCase()]?.[speciesName];
}
