import { normalizeCompetitiveSet } from './competitiveSet';
import { VGC_TEAM_PRESETS } from './vgcTeamPresets';

describe('historical VGC team presets', () => {
  test('provides complete, unique six-Pokémon teams', () => {
    expect(VGC_TEAM_PRESETS).toHaveLength(13);

    VGC_TEAM_PRESETS.forEach(preset => {
      expect(preset.members).toHaveLength(6);
      expect(new Set(preset.members.map(member => member.pokemon)).size).toBe(
        6,
      );
      preset.members.forEach(member => {
        expect(normalizeCompetitiveSet(member.set)).toEqual(member.set);
        expect(member.set.moves).toHaveLength(4);
      });
    });
  });

  test('includes historical formats with their original mechanics', () => {
    expect(
      VGC_TEAM_PRESETS.some(preset =>
        preset.mechanic.includes('Gigantamax'),
      ),
    ).toBe(true);
    expect(
      VGC_TEAM_PRESETS.some(preset =>
        preset.mechanic.includes('Terastallization'),
      ),
    ).toBe(true);
  });

  test('includes verified Masters World Champion teams across eras', () => {
    expect(
      VGC_TEAM_PRESETS.filter(preset =>
        preset.title.includes('World Champion'),
      ).map(preset => preset.year),
    ).toEqual([
      2026,
      2025,
      2024,
      2023,
      2022,
      2019,
      2018,
      2017,
      2016,
      2015,
      2014,
      2013,
      2012,
    ]);
    expect(
      VGC_TEAM_PRESETS.map(preset => preset.id),
    ).not.toEqual(
      expect.arrayContaining([
        'james-baek-worlds-2022',
        'markus-stadter-bochum-2023',
        'abdullah-mohayyuddin-vancouver-2023',
      ]),
    );
  });
});
