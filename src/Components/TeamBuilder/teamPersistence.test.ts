import {
  createTeamSearch,
  normalizeTeamNames,
  parseSavedTeam,
  parseTeamSearch,
  serializeTeam,
} from './teamPersistence';
import { TeamPokemon } from './teamAnalysis';

const competitivePikachu: TeamPokemon = {
  id: 25,
  name: 'pikachu',
  displayName: 'Pikachu',
  imageUrl: 'pikachu.png',
  types: ['electric'],
  competitiveSet: {
    ability: 'Static',
    evs: { 'special-attack': 252, speed: 252, hp: 4 },
    item: 'Light Ball',
    ivs: { attack: 0 },
    level: 50,
    moves: ['Thunderbolt', 'Volt Switch', 'Grass Knot', 'Protect'],
    nature: 'Timid',
    teraType: 'Electric',
  },
};

const adventureCharizard: TeamPokemon = {
  id: 6,
  name: 'charizard',
  displayName: 'Charizard',
  imageUrl: 'charizard.png',
  types: ['fire', 'flying'],
  adventureInfo: {
    encounterMethod: 'Starter gift',
    evolutionMethod:
      'Charmander → Charmeleon (level 16) → Charizard (level 36)',
    levelRange: 'Usually level 5',
    location: 'Starter selection',
    sourcePokemon: 'Charmander',
    tradeRequired: false,
    version: 'FireRed',
  },
};

describe('team persistence', () => {
  test('normalizes, deduplicates, and caps teams at six members', () => {
    expect(
      normalizeTeamNames([
        'Mr. Mime',
        'mr-mime',
        'Pikachu',
        'Charizard',
        'Squirtle',
        'Bulbasaur',
        'Eevee',
        'Mew',
      ]),
    ).toEqual([
      'mr-mime',
      'pikachu',
      'charizard',
      'squirtle',
      'bulbasaur',
      'eevee',
    ]);
  });

  test('round trips a team through the share query', () => {
    const search = createTeamSearch([
      competitivePikachu,
      {
        id: 29,
        name: 'nidoran-f',
        displayName: 'Nidoran♀',
        imageUrl: 'nidoran-f.png',
        types: ['poison'],
      },
      {
        id: 122,
        name: 'mr-mime',
        displayName: 'Mr. Mime',
        imageUrl: 'mr-mime.png',
        types: ['psychic', 'fairy'],
      },
    ]);
    expect(parseTeamSearch(search)).toEqual([
      {
        name: 'pikachu',
        competitiveSet: competitivePikachu.competitiveSet,
      },
      { name: 'nidoran-f' },
      { name: 'mr-mime' },
    ]);
  });

  test('loads legacy names and saves complete competitive sets', () => {
    expect(parseSavedTeam('["Pikachu","Charizard"]')).toEqual([
      { name: 'pikachu' },
      { name: 'charizard' },
    ]);
    expect(parseSavedTeam(serializeTeam([competitivePikachu]))).toEqual([
      {
        name: 'pikachu',
        competitiveSet: competitivePikachu.competitiveSet,
      },
    ]);
  });

  test('round trips Adventure encounter information through saves and shares', () => {
    const search = createTeamSearch([adventureCharizard]);
    expect(parseTeamSearch(search)).toEqual([
      {
        name: 'charizard',
        adventureInfo: adventureCharizard.adventureInfo,
      },
    ]);
    expect(parseSavedTeam(serializeTeam([adventureCharizard]))).toEqual([
      {
        name: 'charizard',
        adventureInfo: adventureCharizard.adventureInfo,
      },
    ]);
  });

  test('ignores invalid saved team data', () => {
    expect(parseSavedTeam('not json')).toEqual([]);
    expect(parseSavedTeam('{"name":"pikachu"}')).toEqual([]);
  });
});
