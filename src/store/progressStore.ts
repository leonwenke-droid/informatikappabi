import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppProgress, ExerciseResult, MistakeEntry, ExamSimulation, TopicProgress } from '../types';

interface ProgressState extends AppProgress {
  // Actions
  recordExerciseResult: (result: ExerciseResult) => void;
  addMistake: (entry: Omit<MistakeEntry, 'id' | 'timestamp'>) => void;
  markMistakeReviewed: (id: string) => void;
  deleteMistake: (id: string) => void;
  setLastVisitedTopic: (topicId: string) => void;
  addExamSimulation: (sim: ExamSimulation) => void;
  getTopicProgress: (topicId: string) => TopicProgress;
  getOverallProgress: () => { totalExercises: number; completedExercises: number; avgScore: number };
  getDueForReview: () => ExerciseResult[];
  resetAllProgress: () => void;
}

// Spaced repetition: SM-2 inspired simple version
// Score ≥80%: double interval (max 30 days)
// Score 50–79%: keep interval
// Score <50%: reset to 1 day
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

function computeNextInterval(score: number, maxScore: number, currentInterval: number): number {
  const ratio = maxScore > 0 ? score / maxScore : 0;
  if (ratio >= 0.8) {
    const nextIdx = REVIEW_INTERVALS.findIndex((d) => d > currentInterval);
    return nextIdx >= 0 ? REVIEW_INTERVALS[nextIdx] : 30;
  }
  if (ratio >= 0.5) return currentInterval;
  return 1;
}

const initialProgress: AppProgress = {
  exerciseResults: [],
  topicProgress: {},
  mistakes: [],
  lastVisitedTopic: undefined,
  examSimulations: [],
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialProgress,

      recordExerciseResult: (result) => {
        set((state) => {
          // Compute spaced repetition fields
          const prev = state.exerciseResults.find((r) => r.exerciseId === result.exerciseId);
          const currentInterval = prev?.reviewInterval ?? 1;
          const newInterval = computeNextInterval(result.score, result.maxScore, currentInterval);
          const nextReviewAt = Date.now() + newInterval * 24 * 60 * 60 * 1000;

          const enrichedResult: ExerciseResult = {
            ...result,
            reviewInterval: newInterval,
            nextReviewAt,
          };

          const existing = state.exerciseResults.filter((r) => r.exerciseId !== result.exerciseId);
          const updated = [...existing, enrichedResult];

          // Update topic progress
          const tp = { ...state.topicProgress };
          const curr = tp[result.topicId] ?? {
            topicId: result.topicId,
            completedExercises: [],
            totalAttempts: 0,
            totalScore: 0,
            totalMaxScore: 0,
          };

          const alreadyCompleted = curr.completedExercises.includes(result.exerciseId);
          const completedList = alreadyCompleted
            ? curr.completedExercises
            : [...curr.completedExercises, result.exerciseId];

          tp[result.topicId] = {
            ...curr,
            completedExercises: completedList,
            totalAttempts: curr.totalAttempts + 1,
            totalScore: curr.totalScore + result.score,
            totalMaxScore: curr.totalMaxScore + result.maxScore,
            lastAttempt: result.timestamp,
          };

          return { exerciseResults: updated, topicProgress: tp };
        });
      },

      addMistake: (entry) => {
        set((state) => ({
          mistakes: [
            ...state.mistakes,
            {
              ...entry,
              id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              timestamp: Date.now(),
              reviewed: false,
            },
          ],
        }));
      },

      markMistakeReviewed: (id) => {
        set((state) => ({
          mistakes: state.mistakes.map((m) => (m.id === id ? { ...m, reviewed: true } : m)),
        }));
      },

      deleteMistake: (id) => {
        set((state) => ({
          mistakes: state.mistakes.filter((m) => m.id !== id),
        }));
      },

      setLastVisitedTopic: (topicId) => set({ lastVisitedTopic: topicId }),

      addExamSimulation: (sim) => {
        set((state) => ({
          examSimulations: [...state.examSimulations, sim],
        }));
      },

      getTopicProgress: (topicId) => {
        const state = get();
        return (
          state.topicProgress[topicId] ?? {
            topicId,
            completedExercises: [],
            totalAttempts: 0,
            totalScore: 0,
            totalMaxScore: 0,
          }
        );
      },

      getOverallProgress: () => {
        const state = get();
        const allTopics = Object.values(state.topicProgress);
        const totalExercises = new Set(state.exerciseResults.map((r) => r.exerciseId)).size;
        const completedExercises = new Set(
          allTopics.flatMap((tp) => tp.completedExercises)
        ).size;
        const totalScore = allTopics.reduce((sum, tp) => sum + tp.totalScore, 0);
        const totalMaxScore = allTopics.reduce((sum, tp) => sum + tp.totalMaxScore, 0);
        const avgScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

        return { totalExercises, completedExercises, avgScore };
      },

      getDueForReview: () => {
        const state = get();
        const now = Date.now();
        return state.exerciseResults.filter(
          (r) => r.nextReviewAt !== undefined && r.nextReviewAt <= now
        );
      },

      resetAllProgress: () => set(initialProgress),
    }),
    {
      name: 'infoabi-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
