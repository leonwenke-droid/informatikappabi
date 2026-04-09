import { describe, expect, it } from 'vitest';
import { applyExerciseToSkills, seedProfileFromDiagnosis } from './updateSkills';

describe('applyExerciseToSkills', () => {
  it('erhöht Mastery bei gutem Score', () => {
    const next = applyExerciseToSkills({}, ['sql'], 1);
    expect(next.sql?.masteryScore).toBeGreaterThan(0.35);
  });

  it('senkt Confidence-Tendenz bei schlechtem Score', () => {
    const next = applyExerciseToSkills({}, ['arrays'], 0.2);
    expect(next.arrays?.masteryScore).toBeLessThan(0.5);
  });
});

describe('seedProfileFromDiagnosis', () => {
  it('setzt höhere Baseline für advanced', () => {
    const beg = seedProfileFromDiagnosis({}, 'beginner');
    const adv = seedProfileFromDiagnosis({}, 'advanced');
    expect((adv.sql?.masteryScore ?? 0) > (beg.sql?.masteryScore ?? 0)).toBe(true);
  });
});
