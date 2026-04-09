import { describe, expect, it } from 'vitest';
import { arePrerequisiteUnitsCompleted, getUnitAccessState } from './access';
import type { PathUnit } from '../../types/learning';

function mockUnit(over: Partial<PathUnit> = {}): PathUnit {
  return {
    id: 'u2',
    stageId: 's05',
    title: 'Test',
    tags: [],
    vocabularyTermIds: [],
    lesson: {
      tiers: {} as PathUnit['lesson']['tiers'],
      checklistKeys: [],
      checklistLabels: {},
    },
    conceptChecks: [],
    exercises: [],
    ...over,
  };
}

describe('arePrerequisiteUnitsCompleted', () => {
  it('ist true ohne Vorgänger', () => {
    expect(arePrerequisiteUnitsCompleted(mockUnit(), {})).toBe(true);
  });

  it('ist false wenn Vorgänger fehlt', () => {
    const u = mockUnit({ prerequisiteUnitIds: ['u1'] });
    expect(arePrerequisiteUnitsCompleted(u, {})).toBe(false);
    expect(arePrerequisiteUnitsCompleted(u, { u1: { completed: true } })).toBe(true);
  });
});

describe('getUnitAccessState', () => {
  it('empfiehlt Vorarbeit bei offenen Prerequisites', () => {
    const u = mockUnit({ prerequisiteUnitIds: ['u1'] });
    const r = getUnitAccessState(u, {}, false);
    expect(r.access).toBe('recommended');
    expect(r.reason).toBeTruthy();
  });

  it('ist open bei erfüllten Prerequisites und ausreichendem Profil', () => {
    const u = mockUnit({ prerequisiteUnitIds: [] });
    const r = getUnitAccessState(
      u,
      {
        recursion: { masteryScore: 0.5, confidenceScore: 0.5, errorFlags: [], lastUpdated: 0 },
        bst: { masteryScore: 0.5, confidenceScore: 0.5, errorFlags: [], lastUpdated: 0 },
      },
      true
    );
    expect(r.access).toBe('open');
  });
});
