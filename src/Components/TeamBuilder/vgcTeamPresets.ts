import { CompetitivePokemonSet } from './competitiveSet';
import { VGC_RECENT_CHAMPION_PRESETS } from './vgcRecentChampionPresets';
import { VGC_SUPPLIED_CHAMPION_PRESETS } from './vgcSuppliedChampionPresets';
import { VGC_WORLD_CHAMPION_PRESETS } from './vgcWorldChampionPresets';

export type VgcPresetMember = {
  pokemon: string;
  set: CompetitivePokemonSet;
};

export type VgcTeamPreset = {
  event: string;
  format: string;
  id: string;
  mechanic: string;
  members: VgcPresetMember[];
  pasteUrl?: string;
  placing: string;
  player: string;
  sourceUrl: string;
  title: string;
  year: number;
};

const VGC_TEAM_PRESET_ENTRIES = [
  ...VGC_RECENT_CHAMPION_PRESETS,
  ...VGC_SUPPLIED_CHAMPION_PRESETS,
  {
    id: 'luca-ceribelli-worlds-2024',
    title: '2024 World Champion',
    player: 'Luca Ceribelli',
    event: '2024 Pokémon World Championships',
    placing: '1st, Masters Division',
    format: 'Scarlet and Violet Regulation G',
    mechanic: 'Terastallization',
    sourceUrl:
      'https://victoryroad.pro/2024/09/22/luca-ceribelli-worlds-report/',
    pasteUrl: 'https://pokepast.es/774751c5dc2c4500',
    year: 2024,
    members: [
      {
        pokemon: 'miraidon',
        set: {
          ability: 'Hadron Engine',
          evs: {
            hp: 44,
            defense: 4,
            'special-attack': 244,
            'special-defense': 12,
            speed: 204,
          },
          item: 'Choice Specs',
          level: 50,
          moves: [
            'Electro Drift',
            'Draco Meteor',
            'Volt Switch',
            'Dazzling Gleam',
          ],
          nature: 'Modest',
          teraType: 'Fairy',
        },
      },
      {
        pokemon: 'whimsicott',
        set: {
          ability: 'Prankster',
          evs: { hp: 236, 'special-defense': 164, speed: 108 },
          item: 'Covert Cloak',
          ivs: { attack: 0 },
          level: 50,
          moves: ['Moonblast', 'Tailwind', 'Light Screen', 'Encore'],
          nature: 'Timid',
          teraType: 'Dark',
        },
      },
      {
        pokemon: 'urshifu-rapid-strike',
        set: {
          ability: 'Unseen Fist',
          evs: { attack: 252, 'special-defense': 4, speed: 252 },
          item: 'Focus Sash',
          level: 50,
          moves: [
            'Surging Strikes',
            'Close Combat',
            'Aqua Jet',
            'Protect',
          ],
          nature: 'Adamant',
          teraType: 'Stellar',
        },
      },
      {
        pokemon: 'ogerpon-hearthflame-mask',
        set: {
          ability: 'Mold Breaker',
          evs: {
            hp: 188,
            attack: 76,
            defense: 52,
            'special-defense': 4,
            speed: 188,
          },
          gender: 'F',
          item: 'Hearthflame Mask',
          level: 50,
          mechanic: 'Embody Aspect activates after Terastallizing',
          moves: ['Ivy Cudgel', 'Wood Hammer', 'Follow Me', 'Spiky Shield'],
          nature: 'Adamant',
          teraType: 'Fire',
        },
      },
      {
        pokemon: 'farigiraf',
        set: {
          ability: 'Armor Tail',
          evs: {
            hp: 204,
            defense: 164,
            'special-attack': 4,
            'special-defense': 108,
            speed: 28,
          },
          item: 'Electric Seed',
          ivs: { attack: 6 },
          level: 50,
          moves: ['Foul Play', 'Psychic Noise', 'Trick Room', 'Helping Hand'],
          nature: 'Bold',
          teraType: 'Water',
        },
      },
      {
        pokemon: 'iron-hands',
        set: {
          ability: 'Quark Drive',
          evs: {
            hp: 76,
            attack: 180,
            defense: 12,
            'special-defense': 236,
          },
          item: 'Assault Vest',
          ivs: { speed: 0 },
          level: 50,
          moves: ['Drain Punch', 'Low Kick', 'Wild Charge', 'Fake Out'],
          nature: 'Brave',
          teraType: 'Bug',
        },
      },
    ],
  },
  ...VGC_WORLD_CHAMPION_PRESETS,
] satisfies VgcTeamPreset[];

export const VGC_TEAM_PRESETS = [...VGC_TEAM_PRESET_ENTRIES].sort(
  (left, right) =>
    right.year - left.year ||
    Number(right.title.includes('World Champion')) -
      Number(left.title.includes('World Champion')),
);
