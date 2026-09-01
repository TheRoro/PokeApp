import { recommendCoveragePokemon } from './coverageRecommendations';
import { TeamPokemon } from './teamAnalysis';

function member(id: number, name: string, types: string[]): TeamPokemon {
  return {
    id,
    name,
    displayName: name,
    imageUrl: `${name}.png`,
    types,
  };
}

test('recommends answers to the current team weaknesses', () => {
  const recommendations = recommendCoveragePokemon([
    member(6, 'charizard', ['fire', 'flying']),
    member(12, 'butterfree', ['bug', 'flying']),
  ]);

  expect(recommendations).toHaveLength(4);
  expect(recommendations.map(item => item.name)).toContain('swampert');
  expect(
    recommendations.find(item => item.name === 'swampert')?.reason,
  ).toMatch(/Rock/);
});

test('does not recommend a Pokémon already on the team', () => {
  const recommendations = recommendCoveragePokemon([
    member(260, 'swampert', ['water', 'ground']),
    member(6, 'charizard', ['fire', 'flying']),
  ]);

  expect(recommendations.map(item => item.name)).not.toContain('swampert');
});

test('does not offer arbitrary recommendations for an empty team', () => {
  expect(recommendCoveragePokemon([])).toEqual([]);
});

test('filters recommendations by Pokédex and exact game availability', () => {
  const team = [member(6, 'charizard', ['fire', 'flying'])];
  const scarlet = recommendCoveragePokemon(team, {
    allowedSpecies: new Set(['great-tusk', 'iron-hands']),
    limit: 4,
    version: 'scarlet',
  });
  const violet = recommendCoveragePokemon(team, {
    allowedSpecies: new Set(['great-tusk', 'iron-hands']),
    limit: 4,
    version: 'violet',
  });

  expect(scarlet.map(item => item.name)).toEqual(['great-tusk']);
  expect(violet.map(item => item.name)).toEqual(['iron-hands']);
});
