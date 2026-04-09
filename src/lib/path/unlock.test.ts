import { describe, it, expect } from 'vitest';
import {
  isStageComplete,
  getCompletedStageIds,
  isStageUnlocked,
  recommendedNextUnitId,
  examModeDefaultUnlocked,
} from './unlock';
import type { PathStage } from '../../types/learning';

const stages: PathStage[] = [
  { id: 'a', order: 1, title: 'A', prerequisiteStageIds: [], estimatedMinutes: 10, difficulty: 1, unitIds: ['a1'] },
  { id: 'b', order: 2, title: 'B', prerequisiteStageIds: ['a'], estimatedMinutes: 10, difficulty: 1, unitIds: ['b1'] },
];

describe('unlock', () => {
  it('isStageComplete when all units completed', () => {
    expect(isStageComplete(stages[0], {})).toBe(false);
    expect(isStageComplete(stages[0], { a1: { completed: true } } as never)).toBe(true);
  });

  it('isStageUnlocked respects prerequisites', () => {
    const empty = new Set<string>();
    expect(isStageUnlocked(stages[0], empty)).toBe(true);
    expect(isStageUnlocked(stages[1], empty)).toBe(false);
    expect(isStageUnlocked(stages[1], new Set(['a']))).toBe(true);
  });

  it('recommendedNextUnitId returns first incomplete', () => {
    const up = { a1: { completed: false } };
    expect(recommendedNextUnitId(stages, up as never)).toEqual({ stageId: 'a', unitId: 'a1' });
    const up2 = { a1: { completed: true }, b1: { completed: false } };
    expect(recommendedNextUnitId(stages, up2 as never)).toEqual({ stageId: 'b', unitId: 'b1' });
  });

  it('examModeDefaultUnlocked checks first N stages', () => {
    const done = { a1: { completed: true }, b1: { completed: true } };
    expect(examModeDefaultUnlocked(stages, done as never, 2)).toBe(true);
    expect(examModeDefaultUnlocked(stages, { a1: { completed: true } } as never, 2)).toBe(false);
  });

  it('getCompletedStageIds', () => {
    const up = { a1: { completed: true }, b1: { completed: false } };
    const ids = getCompletedStageIds(stages, up as never);
    expect(ids.has('a')).toBe(true);
    expect(ids.has('b')).toBe(false);
  });
});
