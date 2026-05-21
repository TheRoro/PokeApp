import {
  getLevelUpMoves,
  getLevelUpVersionGroups,
  mapWithConcurrency,
  PokemonMove,
} from './moveData';

const moves: PokemonMove[] = [
  {
    move: { name: 'late-move', url: '/move/2/' },
    version_group_details: [
      {
        level_learned_at: 20,
        move_learn_method: { name: 'level-up' },
        version_group: { name: 'old-game', url: '/version-group/1/' },
      },
      {
        level_learned_at: 12,
        move_learn_method: { name: 'level-up' },
        version_group: { name: 'new-game', url: '/version-group/2/' },
      },
    ],
  },
  {
    move: { name: 'early-move', url: '/move/1/' },
    version_group_details: [
      {
        level_learned_at: 5,
        move_learn_method: { name: 'level-up' },
        version_group: { name: 'new-game', url: '/version-group/2/' },
      },
    ],
  },
];

describe('move processing', () => {
  test('orders version groups newest first and filters a selected learnset', () => {
    expect(getLevelUpVersionGroups(moves).map(group => group.name)).toEqual([
      'new-game',
      'old-game',
    ]);
    expect(getLevelUpMoves(moves, 'new-game').map(move => move.name)).toEqual([
      'early-move',
      'late-move',
    ]);
  });

  test('limits concurrent metadata work', async () => {
    let active = 0;
    let maximum = 0;
    const result = await mapWithConcurrency([1, 2, 3, 4, 5], 2, async value => {
      active++;
      maximum = Math.max(maximum, active);
      await Promise.resolve();
      active--;
      return value * 2;
    });

    expect(maximum).toBe(2);
    expect(result).toEqual([2, 4, 6, 8, 10]);
  });
});
