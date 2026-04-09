import type { PathStage } from '../../types/learning';
import { recommendedNextUnitId } from './unlock';

export interface DailyPlanItem {
  id: string;
  label: string;
  href: string;
  kind: 'learn_new' | 'review' | 'viz' | 'guided' | 'independent' | 'unit_review';
}

export interface DailyPlanInput {
  stages: PathStage[];
  unitProgress: Record<string, { completed: boolean }>;
  dueReviewExerciseCount: number;
  todayKey: string;
  /** Lernpfad-Units, die laut Wiederholungslogik anstehen */
  unitReviewSuggestions?: { stageId: string; unitId: string; title?: string }[];
}

/**
 * Tagesplan: nächste Lektion, Lernpfad-Wiederholung, Legacy-Übungen, Visualisierung — ohne Prüfungs-Countdown-Logik.
 */
export function buildDailyPlan(input: DailyPlanInput): DailyPlanItem[] {
  const items: DailyPlanItem[] = [];
  const next = recommendedNextUnitId(input.stages, input.unitProgress);

  if (next) {
    items.push({
      id: 'learn_new',
      label: 'Als Nächstes: nächste Lektion im Lernpfad',
      href: `/lernen/${next.stageId}/${next.unitId}`,
      kind: 'learn_new',
    });
  }

  const ur = input.unitReviewSuggestions?.[0];
  if (ur) {
    items.push({
      id: 'unit_review',
      label: ur.title
        ? `Kurz wiederholen: ${ur.title}`
        : 'Kurz eine Lernpfad-Lektion wiederholen',
      href: `/lernen/${ur.stageId}/${ur.unitId}`,
      kind: 'unit_review',
    });
  }

  if (input.dueReviewExerciseCount > 0) {
    items.push({
      id: 'review',
      label: `Aufgaben aus dem Pool (${input.dueReviewExerciseCount} zum Wiederholen markiert)`,
      href: '/uebungspool?review=1',
      kind: 'review',
    });
  }

  items.push({
    id: 'viz',
    label: 'Heute eine Visualisierung (mit Lernmodus)',
    href: '/visualizer',
    kind: 'viz',
  });

  items.push({
    id: 'guided',
    label: 'Geführte Übung (Lernpfad)',
    href: next ? `/ueben?unit=${next.unitId}&mode=guided` : '/ueben?mode=guided',
    kind: 'guided',
  });

  items.push({
    id: 'independent',
    label: 'Selbstständig üben (Aufgabenpool)',
    href: '/uebungspool?filter=beginner',
    kind: 'independent',
  });

  return items;
}

export function completionPercent(
  stages: PathStage[],
  unitProgress: Record<string, { completed: boolean }>
): number {
  let total = 0;
  let done = 0;
  for (const s of stages) {
    for (const uid of s.unitIds) {
      total++;
      if (unitProgress[uid]?.completed) done++;
    }
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
