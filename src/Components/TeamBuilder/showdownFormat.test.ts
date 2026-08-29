import { TeamPokemon } from './teamAnalysis';
import {
  exportShowdownTeam,
  importShowdownTeam,
  ShowdownFormatError,
} from './showdownFormat';

const SHOWDOWN_TEAM = `Sparky (Pikachu) (F) @ Light Ball
Ability: Static
Level: 50
Shiny: Yes
Tera Type: Electric
EVs: 4 HP / 252 SpA / 252 Spe
Timid Nature
IVs: 0 Atk
- Thunderbolt
- Volt Switch
- Fake Out
- Protect

Ogerpon-Hearthflame @ Hearthflame Mask
Ability: Mold Breaker
Level: 50
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Ivy Cudgel
- Wood Hammer
- Follow Me
- Spiky Shield`;

test('imports complete Pokémon Showdown sets and normalizes forms', () => {
  expect(importShowdownTeam(SHOWDOWN_TEAM)).toEqual([
    {
      name: 'pikachu',
      competitiveSet: {
        ability: 'Static',
        evs: { hp: 4, 'special-attack': 252, speed: 252 },
        gender: 'F',
        item: 'Light Ball',
        ivs: { attack: 0 },
        level: 50,
        moves: ['Thunderbolt', 'Volt Switch', 'Fake Out', 'Protect'],
        nature: 'Timid',
        shiny: true,
        teraType: 'Electric',
      },
    },
    {
      name: 'ogerpon-hearthflame-mask',
      competitiveSet: {
        ability: 'Mold Breaker',
        evs: { attack: 252, 'special-defense': 4, speed: 252 },
        gender: undefined,
        item: 'Hearthflame Mask',
        ivs: undefined,
        level: 50,
        moves: ['Ivy Cudgel', 'Wood Hammer', 'Follow Me', 'Spiky Shield'],
        nature: 'Jolly',
        shiny: undefined,
        teraType: undefined,
      },
    },
  ]);
});

test('exports team members as standard Pokémon Showdown text', () => {
  const imported = importShowdownTeam(SHOWDOWN_TEAM);
  const team: TeamPokemon[] = imported.map((member, index) => ({
    id: index + 1,
    name: member.name,
    displayName:
      member.name === 'pikachu' ? 'Pikachu' : 'Ogerpon Hearthflame Mask',
    imageUrl: '',
    types: [],
    competitiveSet: member.competitiveSet,
  }));

  const exported = exportShowdownTeam(team);

  expect(exported).toContain('Pikachu (F) @ Light Ball');
  expect(exported).toContain('Ogerpon-Hearthflame @ Hearthflame Mask');
  expect(exported).toContain('IVs: 0 Atk');
  expect(exported).toContain('- Spiky Shield');
});

test('rejects invalid spreads and incomplete movesets', () => {
  expect(() =>
    importShowdownTeam(`Pikachu @ Light Ball
Ability: Static
EVs: 252 SpA / 300 Spe
Timid Nature
- Thunderbolt`),
  ).toThrow(ShowdownFormatError);

  expect(() =>
    importShowdownTeam(`Pikachu @ Light Ball
Ability: Static
Timid Nature
- Thunderbolt`),
  ).toThrow('add exactly four moves');
});
