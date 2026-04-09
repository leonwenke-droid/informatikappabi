import type { CompetencyProfile, ContentAccess, SkillId } from '../../types/competency';
import type { PathUnit } from '../../types/learning';
import { STAGE_TO_SKILLS } from './skillCatalog';

export function arePrerequisiteUnitsCompleted(
  unit: PathUnit,
  unitProgress: Record<string, { completed?: boolean }>
): boolean {
  const pre = unit.prerequisiteUnitIds;
  if (!pre?.length) return true;
  return pre.every((id) => unitProgress[id]?.completed);
}

function avgMastery(profile: CompetencyProfile, skills: SkillId[]): number {
  if (skills.length === 0) return 0.5;
  let sum = 0;
  let n = 0;
  for (const s of skills) {
    const m = profile[s]?.masteryScore;
    if (m != null) {
      sum += m;
      n++;
    }
  }
  return n ? sum / n : 0.35;
}

/**
 * Weiche Freigabe: fast immer open; recommended wenn Vorwissen dünn; blocked nur bei expliziter Hard-Rule.
 */
export function getUnitAccessState(
  unit: PathUnit,
  profile: CompetencyProfile,
  prerequisiteUnitsCompleted: boolean
): { access: ContentAccess; reason?: string } {
  const stageSkills = STAGE_TO_SKILLS[unit.stageId] ?? ['algo_basics'];
  const mastery = avgMastery(profile, stageSkills);

  if (!prerequisiteUnitsCompleted && unit.prerequisiteUnitIds?.length) {
    return {
      access: 'recommended',
      reason: 'Didaktisch baut diese Einheit auf vorherigen auf — du kannst trotzdem starten.',
    };
  }

  if (mastery < 0.28 && stageSkills.some((s) => (profile[s]?.masteryScore ?? 0) < 0.25)) {
    return {
      access: 'recommended',
      reason: 'Kompetenz in diesem Bereich ist noch niedrig — geführte Schritte und Mini-Aufgaben helfen.',
    };
  }

  return { access: 'open' };
}
