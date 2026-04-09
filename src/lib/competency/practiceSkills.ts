import { getUnit } from '../../content/path/units';
import type { SkillId } from '../../types/competency';
import { STAGE_TO_SKILLS, TOPIC_TO_SKILLS } from './skillCatalog';

/** Skills, die durch eine Übung in dieser Unit (optional Legacy-topicId) aktualisiert werden. */
export function resolveSkillIdsForUnit(unitId: string, legacyTopicId?: string): SkillId[] {
  const set = new Set<SkillId>();
  const unit = getUnit(unitId);
  if (unit) {
    const fromStage = STAGE_TO_SKILLS[unit.stageId];
    if (fromStage) for (const s of fromStage) set.add(s);
    for (const tag of unit.tags) {
      const arr = TOPIC_TO_SKILLS[tag];
      if (arr) for (const s of arr) set.add(s);
    }
  }
  if (legacyTopicId) {
    const arr = TOPIC_TO_SKILLS[legacyTopicId];
    if (arr) for (const s of arr) set.add(s);
  }
  return [...set];
}
