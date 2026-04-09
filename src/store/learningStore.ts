import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  DiagnosisLevel,
  DiagnosisState,
  ExplanationTier,
  LearningProgress,
  LearningSettings,
  MisconceptionId,
  UnitProgressState,
} from '../types/learning';
import { getUnit } from '../content/path/units';
import { migratePersistedLearning } from '../lib/path/migrateLearningStorage';
import { nextReviewTimestampFromDays } from '../lib/path/unitReview';

const defaultSettings: LearningSettings = {
  pace: 'normal',
  onlyBasics: false,
  examModeUnlocked: false,
  skippedExamGate: false,
  showExamCountdown: false,
};

function defaultReviewDaysForUnit(unitId: string): number {
  const u = getUnit(unitId);
  if (!u?.exercises?.length) return 7;
  const ds = u.exercises.map((e) => e.reviewAfterDays).filter((d): d is number => typeof d === 'number');
  return ds.length > 0 ? Math.min(...ds) : 7;
}

function reviewFieldsOnFirstComplete(unitId: string, wasComplete: boolean, nowComplete: boolean) {
  if (wasComplete || !nowComplete) return {};
  return {
    nextReviewAt: nextReviewTimestampFromDays(defaultReviewDaysForUnit(unitId)),
    reviewDue: false as const,
  };
}

const defaultDiagnosis: DiagnosisState = {
  completed: false,
  level: 'beginner',
  answers: {},
};

function emptyUnitProgress(): UnitProgressState {
  return {
    checklist: {},
    conceptCheckSolved: {},
    completed: false,
  };
}

interface LearningState extends LearningProgress {
  setOnboardingComplete: (v: boolean) => void;
  setDiagnosis: (partial: Partial<DiagnosisState>) => void;
  setDiagnosisLevel: (level: DiagnosisLevel) => void;
  setSettings: (partial: Partial<LearningSettings>) => void;
  setChecklistItem: (unitId: string, key: string, checked: boolean, totalKeys: number) => void;
  setConceptCheckSolved: (unitId: string, checkId: string, ok: boolean) => void;
  recordConceptCheckResult: (
    unitId: string,
    checkId: string,
    success: boolean,
    checklistKeys: string[],
    conceptCheckIds: string[]
  ) => void;
  tryCompleteUnit: (unitId: string, checklistKeys: string[], conceptCheckIds: string[]) => void;
  setLastUnitId: (unitId: string) => void;
  setDailyPlanDate: (isoDate: string | null) => void;
  unlockExamMode: () => void;
  skipExamGate: () => void;
  getUnitProgress: (unitId: string) => UnitProgressState;
  resetLearning: () => void;
  mergeUnitWeakMisconceptions: (unitId: string, ids: MisconceptionId[]) => void;
}

const initial: LearningProgress = {
  onboardingComplete: false,
  diagnosis: defaultDiagnosis,
  settings: defaultSettings,
  unitProgress: {},
  dailyPlanDate: null,
  lastUnitId: undefined,
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      ...initial,

      setOnboardingComplete: (v) => set({ onboardingComplete: v }),

      setDiagnosis: (partial) =>
        set((s) => ({
          diagnosis: { ...s.diagnosis, ...partial },
        })),

      setDiagnosisLevel: (level) =>
        set((s) => ({
          diagnosis: {
            ...s.diagnosis,
            level,
            completed: true,
            completedAt: Date.now(),
          },
          onboardingComplete: true,
        })),

      setSettings: (partial) =>
        set((s) => ({
          settings: { ...s.settings, ...partial },
        })),

      setChecklistItem: (unitId, key, checked, totalKeys) =>
        set((s) => {
          const prev = s.unitProgress[unitId] ?? emptyUnitProgress();
          const checklist = { ...prev.checklist, [key]: checked };
          const allCheck =
            totalKeys > 0 &&
            Object.keys(checklist).filter((k) => checklist[k]).length >= totalKeys;
          return {
            unitProgress: {
              ...s.unitProgress,
              [unitId]: { ...prev, checklist, completed: prev.completed || allCheck },
            },
            lastUnitId: unitId,
          };
        }),

      setConceptCheckSolved: (unitId, checkId, ok) =>
        set((s) => {
          const prev = s.unitProgress[unitId] ?? emptyUnitProgress();
          return {
            unitProgress: {
              ...s.unitProgress,
              [unitId]: {
                ...prev,
                conceptCheckSolved: { ...prev.conceptCheckSolved, [checkId]: ok },
              },
            },
            lastUnitId: unitId,
          };
        }),

      recordConceptCheckResult: (unitId, checkId, success, checklistKeys, conceptCheckIds) =>
        set((s) => {
          const prev = s.unitProgress[unitId] ?? emptyUnitProgress();
          const wasComplete = prev.completed;
          const conceptCheckSolved = success
            ? { ...prev.conceptCheckSolved, [checkId]: true }
            : prev.conceptCheckSolved;
          const merged = { ...prev, conceptCheckSolved };
          const allCheck = checklistKeys.every((k) => merged.checklist[k]);
          const allCc = conceptCheckIds.every((id) => merged.conceptCheckSolved[id]);
          const completed = allCheck && allCc;
          const review = reviewFieldsOnFirstComplete(unitId, wasComplete, completed);
          return {
            unitProgress: {
              ...s.unitProgress,
              [unitId]: { ...merged, completed, ...review },
            },
            lastUnitId: unitId,
          };
        }),

      tryCompleteUnit: (unitId, checklistKeys, conceptCheckIds) =>
        set((s) => {
          const prev = s.unitProgress[unitId] ?? emptyUnitProgress();
          const wasComplete = prev.completed;
          const allCheck = checklistKeys.every((k) => prev.checklist[k]);
          const allCc = conceptCheckIds.every((id) => prev.conceptCheckSolved[id]);
          const completed = allCheck && (conceptCheckIds.length === 0 || allCc);
          const review = reviewFieldsOnFirstComplete(unitId, wasComplete, completed);
          return {
            unitProgress: {
              ...s.unitProgress,
              [unitId]: { ...prev, completed, ...review },
            },
          };
        }),

      setLastUnitId: (unitId) => set({ lastUnitId: unitId }),

      setDailyPlanDate: (dailyPlanDate) => set({ dailyPlanDate }),

      unlockExamMode: () =>
        set((s) => ({
          settings: { ...s.settings, examModeUnlocked: true },
        })),

      skipExamGate: () =>
        set((s) => ({
          settings: { ...s.settings, skippedExamGate: true, examModeUnlocked: true },
        })),

      getUnitProgress: (unitId) => get().unitProgress[unitId] ?? emptyUnitProgress(),

      mergeUnitWeakMisconceptions: (unitId, ids) =>
        set((s) => {
          const prev = s.unitProgress[unitId] ?? emptyUnitProgress();
          const merged = new Set([...(prev.weakMisconceptionIds ?? []), ...ids]);
          return {
            unitProgress: {
              ...s.unitProgress,
              [unitId]: { ...prev, weakMisconceptionIds: [...merged] },
            },
          };
        }),

      resetLearning: () => set({ ...initial }),
    }),
    {
      name: 'infoabi-learning-v2',
      version: 2,
      migrate: (persisted) => migratePersistedLearning(persisted),
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/** Hilfsfunktion für LessonPlayer: letzte Erklärebene merken */
export function rememberTier(unitId: string, tier: ExplanationTier): void {
  useLearningStore.setState((s) => {
    const prev = s.unitProgress[unitId] ?? emptyUnitProgress();
    return {
      unitProgress: {
        ...s.unitProgress,
        [unitId]: { ...prev, lastTier: tier },
      },
    };
  });
}
