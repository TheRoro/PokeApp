import { formatPokemonName, toPokemonApiSlug } from '../Tools/pokemonNames';
import {
  COMPETITIVE_STAT_NAMES,
  CompetitivePokemonSet,
  CompetitiveStatName,
  CompetitiveStatSpread,
} from './competitiveSet';
import { PersistedTeamMember } from './teamPersistence';
import { TeamPokemon } from './teamAnalysis';

const STAT_BY_SHOWDOWN_LABEL: Record<string, CompetitiveStatName> = {
  hp: 'hp',
  atk: 'attack',
  def: 'defense',
  spa: 'special-attack',
  spd: 'special-defense',
  spe: 'speed',
};

const SHOWDOWN_LABEL_BY_STAT: Record<CompetitiveStatName, string> = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe',
};

const SHOWDOWN_TO_API_SPECIES: Record<string, string> = {
  'basculegion-f': 'basculegion-female',
  'indeedee-f': 'indeedee-female',
  'indeedee-m': 'indeedee-male',
  'maushold-four': 'maushold-family-of-four',
  'maushold-three': 'maushold-family-of-three',
  'meowstic-f': 'meowstic-female',
  'meowstic-m': 'meowstic-male',
  'ogerpon-cornerstone': 'ogerpon-cornerstone-mask',
  'ogerpon-hearthflame': 'ogerpon-hearthflame-mask',
  'ogerpon-teal': 'ogerpon-teal-mask',
  'ogerpon-wellspring': 'ogerpon-wellspring-mask',
  'tauros-paldea-aqua': 'tauros-paldea-aqua-breed',
  'tauros-paldea-blaze': 'tauros-paldea-blaze-breed',
  'tauros-paldea-combat': 'tauros-paldea-combat-breed',
};

function formatShowdownSpecies(value: string): string {
  return value
    .split('-')
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join('-');
}

const API_TO_SHOWDOWN_SPECIES = Object.fromEntries(
  Object.entries(SHOWDOWN_TO_API_SPECIES).map(([showdown, api]) => [
    api,
    formatShowdownSpecies(showdown),
  ]),
) as Record<string, string>;

export class ShowdownFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShowdownFormatError';
  }
}

type ParsedHeader = {
  gender?: 'M' | 'F';
  item: string;
  species: string;
};

function parseHeader(header: string, lineNumber: number): ParsedHeader {
  const itemSeparator = header.lastIndexOf(' @ ');
  let identity =
    itemSeparator >= 0 ? header.slice(0, itemSeparator).trim() : header.trim();
  const item =
    itemSeparator >= 0 ? header.slice(itemSeparator + 3).trim() : 'No Item';
  let gender: 'M' | 'F' | undefined;
  const genderMatch = identity.match(/\s+\(([MF])\)$/);
  if (genderMatch) {
    gender = genderMatch[1] as 'M' | 'F';
    identity = identity.slice(0, -genderMatch[0].length).trim();
  }

  const speciesMatch = identity.match(/\s+\(([^()]+)\)$/);
  const speciesName = speciesMatch?.[1].trim() ?? identity;
  const showdownSlug = toPokemonApiSlug(speciesName);
  const species = SHOWDOWN_TO_API_SPECIES[showdownSlug] ?? showdownSlug;
  if (!species) {
    throw new ShowdownFormatError(
      `Line ${lineNumber}: enter a Pokémon species.`,
    );
  }
  if (!item) {
    throw new ShowdownFormatError(`Line ${lineNumber}: enter an item name.`);
  }

  return { gender, item, species };
}

function parseSpread(
  value: string,
  maximum: number,
  lineNumber: number,
  label: string,
): CompetitiveStatSpread {
  const spread: CompetitiveStatSpread = {};
  if (!value.trim()) return spread;

  for (const part of value.split('/')) {
    const match = part.trim().match(/^(\d+)\s+(HP|Atk|Def|SpA|SpD|Spe)$/i);
    if (!match) {
      throw new ShowdownFormatError(
        `Line ${lineNumber}: invalid ${label} entry "${part.trim()}".`,
      );
    }
    const amount = Number(match[1]);
    const stat = STAT_BY_SHOWDOWN_LABEL[match[2].toLowerCase()];
    if (amount > maximum) {
      throw new ShowdownFormatError(
        `Line ${lineNumber}: ${label} values cannot exceed ${maximum}.`,
      );
    }
    if (spread[stat] !== undefined) {
      throw new ShowdownFormatError(
        `Line ${lineNumber}: ${match[2]} is listed more than once.`,
      );
    }
    spread[stat] = amount;
  }

  return spread;
}

function parseSet(block: string, firstLineNumber: number): PersistedTeamMember {
  const lines = block.split('\n').map(line => line.trim());
  const header = parseHeader(lines[0], firstLineNumber);
  let ability = '';
  let evs: CompetitiveStatSpread = {};
  let hasSetDetails = header.item !== 'No Item';
  let ivs: CompetitiveStatSpread | undefined;
  let level = 100;
  let nature = 'Serious';
  let shiny = false;
  let teraType: string | undefined;
  const moves: string[] = [];

  lines.slice(1).forEach((line, index) => {
    const lineNumber = firstLineNumber + index + 1;
    if (!line) return;
    hasSetDetails = true;

    if (line.startsWith('Ability:')) {
      ability = line.slice('Ability:'.length).trim();
    } else if (line.startsWith('Level:')) {
      level = Number(line.slice('Level:'.length).trim());
      if (!Number.isInteger(level) || level < 1 || level > 100) {
        throw new ShowdownFormatError(
          `Line ${lineNumber}: level must be between 1 and 100.`,
        );
      }
    } else if (line.startsWith('Shiny:')) {
      const value = line.slice('Shiny:'.length).trim().toLowerCase();
      if (value !== 'yes' && value !== 'no') {
        throw new ShowdownFormatError(
          `Line ${lineNumber}: Shiny must be Yes or No.`,
        );
      }
      shiny = value === 'yes';
    } else if (line.startsWith('Tera Type:')) {
      teraType = line.slice('Tera Type:'.length).trim();
      if (!teraType) {
        throw new ShowdownFormatError(
          `Line ${lineNumber}: enter a Tera type.`,
        );
      }
    } else if (line.startsWith('EVs:')) {
      evs = parseSpread(
        line.slice('EVs:'.length),
        252,
        lineNumber,
        'EV',
      );
      const total = Object.values(evs).reduce(
        (sum, amount) => sum + (amount ?? 0),
        0,
      );
      if (total > 510) {
        throw new ShowdownFormatError(
          `Line ${lineNumber}: EVs cannot total more than 510.`,
        );
      }
    } else if (line.startsWith('IVs:')) {
      ivs = parseSpread(
        line.slice('IVs:'.length),
        31,
        lineNumber,
        'IV',
      );
    } else if (line.endsWith(' Nature')) {
      nature = line.slice(0, -' Nature'.length).trim();
      if (!nature) {
        throw new ShowdownFormatError(
          `Line ${lineNumber}: enter a nature.`,
        );
      }
    } else if (line.startsWith('-')) {
      const move = line.slice(1).trim();
      if (!move) {
        throw new ShowdownFormatError(
          `Line ${lineNumber}: enter a move name.`,
        );
      }
      moves.push(move);
      if (moves.length > 4) {
        throw new ShowdownFormatError(
          `Line ${lineNumber}: a Pokémon cannot have more than four moves.`,
        );
      }
    } else if (
      /^(Dynamax Level|Gigantamax|Happiness|Friendship|Pokeball|Ball):/i.test(
        line,
      )
    ) {
      return;
    } else {
      throw new ShowdownFormatError(
        `Line ${lineNumber}: unsupported Showdown field "${line}".`,
      );
    }
  });

  if (!hasSetDetails) return { name: header.species };
  if (!ability) {
    throw new ShowdownFormatError(
      `Set beginning on line ${firstLineNumber}: add an Ability line.`,
    );
  }
  if (moves.length !== 4) {
    throw new ShowdownFormatError(
      `Set beginning on line ${firstLineNumber}: add exactly four moves.`,
    );
  }

  const competitiveSet: CompetitivePokemonSet = {
    ability,
    evs,
    gender: header.gender,
    item: header.item,
    ivs,
    level,
    moves,
    nature,
    shiny: shiny || undefined,
    teraType,
  };
  return { name: header.species, competitiveSet };
}

export function importShowdownTeam(value: string): PersistedTeamMember[] {
  const normalized = value.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();
  if (!normalized) {
    throw new ShowdownFormatError('Paste a Pokémon Showdown team first.');
  }

  const blocks: Array<{ firstLineNumber: number; text: string }> = [];
  let currentLines: string[] = [];
  let firstLineNumber = 1;
  normalized.split('\n').forEach((line, index) => {
    if (!line.trim()) {
      if (currentLines.length > 0) {
        blocks.push({ firstLineNumber, text: currentLines.join('\n') });
        currentLines = [];
      }
      return;
    }
    if (currentLines.length === 0) firstLineNumber = index + 1;
    currentLines.push(line);
  });
  if (currentLines.length > 0) {
    blocks.push({ firstLineNumber, text: currentLines.join('\n') });
  }

  if (blocks.length > 6) {
    throw new ShowdownFormatError(
      'A team can contain no more than six Pokémon.',
    );
  }

  return blocks.map(block => parseSet(block.text, block.firstLineNumber));
}

function formatSpread(spread: CompetitiveStatSpread): string {
  return COMPETITIVE_STAT_NAMES.flatMap(stat =>
    spread[stat] === undefined
      ? []
      : [`${spread[stat]} ${SHOWDOWN_LABEL_BY_STAT[stat]}`],
  ).join(' / ');
}

export function exportShowdownTeam(team: readonly TeamPokemon[]): string {
  return team
    .map(pokemon => {
      const set = pokemon.competitiveSet;
      const species =
        API_TO_SHOWDOWN_SPECIES[pokemon.name] ?? pokemon.displayName;
      if (!set) return species;

      const gender = set.gender ? ` (${set.gender})` : '';
      const item = set.item === 'No Item' ? '' : ` @ ${set.item}`;
      const lines = [
        `${species}${gender}${item}`,
        `Ability: ${set.ability}`,
        `Level: ${set.level}`,
      ];
      if (set.shiny) lines.push('Shiny: Yes');
      if (set.teraType) lines.push(`Tera Type: ${set.teraType}`);
      const evs = formatSpread(set.evs);
      if (evs) lines.push(`EVs: ${evs}`);
      lines.push(`${set.nature} Nature`);
      if (set.ivs) {
        const ivs = formatSpread(set.ivs);
        if (ivs) lines.push(`IVs: ${ivs}`);
      }
      set.moves.forEach(move => lines.push(`- ${move}`));
      return lines.join('\n');
    })
    .join('\n\n');
}
