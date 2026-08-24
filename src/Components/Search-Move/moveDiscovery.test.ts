import { selectDiscoveryMoves } from './moveDiscovery';

describe('move discovery', () => {
  test('returns six moves with six different types', () => {
    const moves = selectDiscoveryMoves(6, () => 0);

    expect(moves).toHaveLength(6);
    expect(new Set(moves.map(move => move.type)).size).toBe(6);
    expect(new Set(moves.map(move => move.name)).size).toBe(6);
  });
});
