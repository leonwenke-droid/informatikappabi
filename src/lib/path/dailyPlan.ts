import type { PathStage } from '../../types/learning';
import { recommendedNextUnitId } from './unlock';

export interface DailyPlanItem {
  id: string;
  label: string;
  href: string;
  kind: 'learn_new' | 'review' | 'viz' | 'guided' | 'independent';
}

export interface DailyPlanInput {
  stages: PathStage[];
  unitProgress: Record<string, { completed: boolean }>;
  dueReviewExerciseCount: number;
  todayKey: string;
}

/**
 * Einfacher Tagesplan: Vorschläge aus nächster Lernunit + Wiederholung + feste Deep-Links.
 */
export function buildDailyPlan(input: DailyPlanInput): DailyPlanItem[] {
  const items: DailyPlanItem[] = [];
  const next = recommendedNextUnitId(input.stages, input.unitProgress);

  if (next) {
    items.push({
      id: 'learn_new',
      label: 'Heute neu: nächste Lektion',
      href: `/lernen/${next.stageId}/${next.unitId}`,
      kind: 'learn_new',
    });
  }

  if (input.dueReviewExerciseCount > 0) {
    items.push({
      id: 'review',
      label: `Heute wiederholen (${input.dueReviewExerciseCount} Aufgaben fällig)`,
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
    label: 'Heute eine geführte Übung',
    href: next ? `/ueben?unit=${next.unitId}&mode=guided` : '/ueben?mode=guided',
    kind: 'guided',
  });

  items.push({
    id: 'independent',
    label: 'Heute eine selbstständige Aufgabe',
    href: '/ueben?mode=free',
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
