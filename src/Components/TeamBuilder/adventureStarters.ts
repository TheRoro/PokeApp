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

export const ADVENTURE_GAME_NAMES = new Set([
  ...Object.keys(GAME_REGIONS),
  ...Object.keys(GAME_STARTER_OVERRIDES),
]);

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
