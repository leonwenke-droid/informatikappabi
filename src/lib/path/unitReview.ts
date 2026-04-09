import type { UnitProgressState } from '../../types/learning';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Ob eine abgeschlossene Unit wiederholt werden sollte (lernlogisch, ohne Zeitdruck-Texte). */
export function shouldReviewUnit(progress: UnitProgressState | undefined, now: number = Date.now()): boolean {
  if (!progress?.completed) return false;
  if (progress.reviewDue) return true;
  if (progress.nextReviewAt != null && now >= progress.nextReviewAt) return true;
  return false;
}

export function nextReviewTimestampFromDays(days: number, from: number = Date.now()): number {
  return from + Math.max(1, days) * DAY_MS;
}
