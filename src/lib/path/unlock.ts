import type { PathStage } from '../../types/learning';

/** Etappe gilt als abgeschlossen, wenn alle Units completed */
export function isStageComplete(
  stage: PathStage,
  unitProgress: Record<string, { completed: boolean }>
): boolean {
  if (stage.unitIds.length === 0) return false;
  return stage.unitIds.every((uid) => unitProgress[uid]?.completed);
}

export function getCompletedStageIds(
  stages: PathStage[],
  unitProgress: Record<string, { completed: boolean }>
): Set<string> {
  const done = new Set<string>();
  for (const s of stages) {
    if (isStageComplete(s, unitProgress)) done.add(s.id);
  }
  return done;
}

export function isStageUnlocked(
  stage: PathStage,
  completedStageIds: Set<string>
): boolean {
  if (stage.prerequisiteStageIds.length === 0) return true;
  return stage.prerequisiteStageIds.every((id) => completedStageIds.has(id));
}

/** Nächste empfohlene Unit: erste unlocked stage, erste incomplete unit */
export function recommendedNextUnitId(
  stages: PathStage[],
  unitProgress: Record<string, { completed: boolean }>
): { stageId: string; unitId: string } | null {
  const sorted = [...stages].sort((a, b) => a.order - b.order);
  const completedStages = getCompletedStageIds(stages, unitProgress);

  for (const stage of sorted) {
    const prereqOk =
      stage.prerequisiteStageIds.length === 0 ||
      stage.prerequisiteStageIds.every((id) => completedStages.has(id));
    if (!prereqOk) continue;

    for (const uid of stage.unitIds) {
      if (!unitProgress[uid]?.completed) {
        return { stageId: stage.id, unitId: uid };
      }
    }
  }
  return null;
}

export function examModeDefaultUnlocked(
  stages: PathStage[],
  unitProgress: Record<string, { completed: boolean }>,
  firstNStages: number
): boolean {
  const sorted = [...stages].sort((a, b) => a.order - b.order);
  const head = sorted.slice(0, firstNStages);
  return head.every((s) => isStageComplete(s, unitProgress));
}
