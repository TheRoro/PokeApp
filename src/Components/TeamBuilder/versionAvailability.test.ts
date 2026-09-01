import { isSpeciesAvailableInVersion } from './versionAvailability';

test('filters Scarlet and Violet version exclusives', () => {
  expect(isSpeciesAvailableInVersion('great-tusk', 'scarlet')).toBe(true);
  expect(isSpeciesAvailableInVersion('great-tusk', 'violet')).toBe(false);
  expect(isSpeciesAvailableInVersion('iron-hands', 'violet')).toBe(true);
  expect(isSpeciesAvailableInVersion('iron-hands', 'scarlet')).toBe(false);
  expect(isSpeciesAvailableInVersion('tinkaton', 'scarlet')).toBe(true);
  expect(isSpeciesAvailableInVersion('tinkaton', 'violet')).toBe(true);
});
