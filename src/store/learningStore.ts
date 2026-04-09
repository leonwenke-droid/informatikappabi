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
import type { SkillId } from '../types/competency';
import { STAGE_TO_SKILLS } from '../lib/competency/skillCatalog';
import { resolveSkillIdsForUnit } from '../lib/competency/practiceSkills';
import { applyConceptCheckSuccess, applyExerciseToSkills, seedProfileFromDiagnosis } from '../lib/competency/updateSkills';

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
  recordExerciseCompetency: (unitId: string, legacyTopicId: string | undefined, scoreRatio: number) => void;
  applyCompetencySkills: (skillIds: SkillId[], scoreRatio: number) => void;
  markSqlLabTaskDone: (taskId: string) => void;
  markCodeLabTaskDone: (taskId: string) => void;
}

const initial: LearningProgress = {
  onboardingComplete: false,
  diagnosis: defaultDiagnosis,
  settings: defaultSettings,
  unitProgress: {},
  competencyProfile: {},
  labProgress: {},
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
          competencyProfile: seedProfileFromDiagnosis(s.competencyProfile ?? {}, level),
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
          const firstSuccess = success && !prev.conceptCheckSolved[checkId];
          const conceptCheckSolved = success
            ? { ...prev.conceptCheckSolved, [checkId]: true }
            : prev.conceptCheckSolved;
          const merged = { ...prev, conceptCheckSolved };
          const allCheck = checklistKeys.every((k) => merged.checklist[k]);
          const allCc = conceptCheckIds.every((id) => merged.conceptCheckSolved[id]);
          const completed = allCheck && allCc;
          const review = reviewFieldsOnFirstComplete(unitId, wasComplete, completed);
          const u = getUnit(unitId);
          const ccSkills: SkillId[] = u
            ? (STAGE_TO_SKILLS[u.stageId] ?? (['algo_basics'] as SkillId[]))
            : (['algo_basics'] as SkillId[]);
          const competencyProfile = firstSuccess
            ? applyConceptCheckSuccess(s.competencyProfile ?? {}, ccSkills)
            : s.competencyProfile ?? {};
          return {
            unitProgress: {
              ...s.unitProgress,
              [unitId]: { ...merged, completed, ...review },
            },
            lastUnitId: unitId,
            competencyProfile,
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

      recordExerciseCompetency: (unitId, legacyTopicId, scoreRatio) =>
        set((s) => {
          const ids = resolveSkillIdsForUnit(unitId, legacyTopicId);
          if (ids.length === 0) return {};
          return {
            competencyProfile: applyExerciseToSkills(s.competencyProfile ?? {}, ids, scoreRatio),
          };
        }),

      applyCompetencySkills: (skillIds, scoreRatio) =>
        set((s) => ({
          competencyProfile: applyExerciseToSkills(s.competencyProfile ?? {}, skillIds, scoreRatio),
        })),

      markSqlLabTaskDone: (taskId) =>
        set((s) => ({
          labProgress: {
            ...s.labProgress,
            sqlTaskDone: { ...s.labProgress.sqlTaskDone, [taskId]: true },
          },
        })),

      markCodeLabTaskDone: (taskId) =>
        set((s) => ({
          labProgress: {
            ...s.labProgress,
            codeTaskDone: { ...s.labProgress.codeTaskDone, [taskId]: true },
          },
        })),

      resetLearning: () => set({ ...initial }),
    }),
    {
      name: 'infoabi-learning-v2',
      version: 3,
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
