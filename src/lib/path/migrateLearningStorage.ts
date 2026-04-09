import type { LearningProgress, LearningSettings, UnitProgressState } from '../../types/learning';

/** Migriert gespeicherten Zustand (z. B. alte Unit-IDs nach Etappen-Split). */
export function migratePersistedLearning(state: unknown): LearningProgress {
  if (!state || typeof state !== 'object') {
    return state as LearningProgress;
  }
  const s = state as Partial<LearningProgress>;
  const unitProgress: Record<string, UnitProgressState> = { ...(s.unitProgress ?? {}) };

  const oldS02 = unitProgress['s02-u01'];
  if (oldS02 && !unitProgress['s02a-u01']) {
    unitProgress['s02a-u01'] = { ...oldS02 };
    if (oldS02.completed) {
      unitProgress['s02b-u01'] = {
        checklist: { ...oldS02.checklist },
        conceptCheckSolved: { ...oldS02.conceptCheckSolved },
        completed: true,
        lastTier: oldS02.lastTier,
        reviewDue: oldS02.reviewDue,
        nextReviewAt: oldS02.nextReviewAt,
        weakMisconceptionIds: oldS02.weakMisconceptionIds ? [...oldS02.weakMisconceptionIds] : undefined,
      };
    }
    delete unitProgress['s02-u01'];
  }

  const settings: LearningSettings = {
    pace: s.settings?.pace ?? 'normal',
    onlyBasics: s.settings?.onlyBasics ?? false,
    examModeUnlocked: s.settings?.examModeUnlocked ?? false,
    skippedExamGate: s.settings?.skippedExamGate ?? false,
    showExamCountdown: s.settings?.showExamCountdown ?? false,
  };

  const diagnosis = {
    completed: false,
    level: 'beginner' as const,
    answers: {},
    ...s.diagnosis,
  };

  return {
    onboardingComplete: s.onboardingComplete ?? false,
    diagnosis,
    settings,
    unitProgress,
    dailyPlanDate: s.dailyPlanDate ?? null,
    lastUnitId: s.lastUnitId,
  } as LearningProgress;
}
