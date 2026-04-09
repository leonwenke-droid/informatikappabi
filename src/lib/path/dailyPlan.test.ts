import { describe, it, expect } from 'vitest';
import { buildDailyPlan, completionPercent } from './dailyPlan';
import type { PathStage } from '../../types/learning';

const stages: PathStage[] = [
  { id: 'a', order: 1, title: 'A', prerequisiteStageIds: [], estimatedMinutes: 10, difficulty: 1, unitIds: ['u1', 'u2'] },
];

describe('dailyPlan', () => {
  it('completionPercent', () => {
    expect(completionPercent(stages, {} as never)).toBe(0);
    expect(completionPercent(stages, { u1: { completed: true }, u2: { completed: false } } as never)).toBe(50);
  });

  it('buildDailyPlan includes learn_new when incomplete unit', () => {
    const items = buildDailyPlan({
      stages,
      unitProgress: { u1: { completed: false } } as never,
      dueReviewExerciseCount: 0,
      todayKey: '2026-01-01',
    });
    expect(items.some((i) => i.kind === 'learn_new')).toBe(true);
  });
});
