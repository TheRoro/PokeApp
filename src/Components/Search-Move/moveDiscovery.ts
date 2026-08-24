export type DiscoveryMove = {
  name: string;
  type: string;
};

const movesByType: Record<string, string[]> = {
  Bug: ['bug-buzz', 'first-impression', 'x-scissor'],
  Dark: ['crunch', 'dark-pulse', 'night-slash'],
  Dragon: ['dragon-claw', 'dragon-pulse', 'draco-meteor'],
  Electric: ['thunder-punch', 'thunderbolt', 'volt-switch'],
  Fairy: ['dazzling-gleam', 'moonblast', 'play-rough'],
  Fighting: ['aura-sphere', 'close-combat', 'drain-punch'],
  Fire: ['fire-blast', 'flame-charge', 'flamethrower'],
  Flying: ['air-slash', 'brave-bird', 'hurricane'],
  Ghost: ['hex', 'shadow-ball', 'shadow-claw'],
  Grass: ['energy-ball', 'leaf-blade', 'power-whip'],
  Ground: ['earth-power', 'earthquake', 'high-horsepower'],
  Ice: ['blizzard', 'ice-beam', 'ice-spinner'],
  Normal: ['body-slam', 'hyper-voice', 'quick-attack'],
  Poison: ['gunk-shot', 'poison-jab', 'sludge-bomb'],
  Psychic: ['psychic', 'psyshock', 'zen-headbutt'],
  Rock: ['power-gem', 'rock-slide', 'stone-edge'],
  Steel: ['flash-cannon', 'iron-head', 'meteor-mash'],
  Water: ['hydro-pump', 'surf', 'waterfall'],
};

export function selectDiscoveryMoves(
  count: number,
  random: () => number = Math.random,
): DiscoveryMove[] {
  const availableTypes = Object.keys(movesByType);
  const selected: DiscoveryMove[] = [];

  while (selected.length < count && availableTypes.length > 0) {
    const typeIndex = Math.floor(random() * availableTypes.length);
    const type = availableTypes.splice(typeIndex, 1)[0];
    const typeMoves = movesByType[type];
    const moveIndex = Math.floor(random() * typeMoves.length);
    selected.push({ name: typeMoves[moveIndex], type });
  }

  return selected;
}
