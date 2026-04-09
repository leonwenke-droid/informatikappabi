import type { CompetencyProfile, SkillId, SkillState } from '../../types/competency';
import { DEFAULT_SKILL_STATE } from './skillCatalog';

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

function ensureSkill(profile: CompetencyProfile, id: SkillId): SkillState {
  const s = profile[id];
  if (s) return s;
  const n = DEFAULT_SKILL_STATE();
  profile[id] = n;
  return n;
}

/**
 * Nach Bewertung einer Übung: Score-Ratio aktualisiert betroffene Skills (EMA-artig).
 */
export function applyExerciseToSkills(
  profile: CompetencyProfile,
  skillIds: SkillId[],
  scoreRatio: number
): CompetencyProfile {
  const next: CompetencyProfile = { ...profile };
  const alpha = 0.35;
  for (const id of skillIds) {
    const prev = ensureSkill(next, id);
    const target = clamp01(scoreRatio);
    const mastery = clamp01(prev.masteryScore * (1 - alpha) + target * alpha);
    const conf = clamp01(prev.confidenceScore * (1 - alpha) + (scoreRatio >= 0.7 ? 0.15 : -0.05) * alpha);
    next[id] = {
      masteryScore: mastery,
      confidenceScore: conf,
      errorFlags: scoreRatio < 0.5 ? [...new Set([...prev.errorFlags, 'low_score'])] : prev.errorFlags.filter((f) => f !== 'low_score'),
      lastUpdated: Date.now(),
    };
  }
  return next;
}

/** Diagnose-Level setzt Startwerte */
/** Nach bestandenem Concept-Check: leichte Erhöhung der Stage-Skills */
export function applyConceptCheckSuccess(
  profile: CompetencyProfile,
  skillIds: SkillId[]
): CompetencyProfile {
  const next: CompetencyProfile = { ...profile };
  for (const id of skillIds) {
    const prev = ensureSkill(next, id);
    next[id] = {
      ...prev,
      masteryScore: clamp01(prev.masteryScore + 0.08),
      confidenceScore: clamp01(prev.confidenceScore + 0.06),
      lastUpdated: Date.now(),
    };
  }
  return next;
}

export function seedProfileFromDiagnosis(
  profile: CompetencyProfile,
  level: 'beginner' | 'intermediate' | 'advanced'
): CompetencyProfile {
  const base =
    level === 'advanced' ? 0.55 : level === 'intermediate' ? 0.45 : 0.32;
  const next: CompetencyProfile = { ...profile };
  const ids: SkillId[] = [
    'algo_basics',
    'variables_types',
    'control_flow',
    'trace',
    'arrays',
    'recursion',
    'sql',
  ];
  for (const id of ids) {
    next[id] = {
      masteryScore: clamp01(base + (next[id]?.masteryScore ?? 0) * 0.2),
      confidenceScore: clamp01(0.35 + (level === 'beginner' ? 0 : 0.15)),
      errorFlags: [],
      lastUpdated: Date.now(),
    };
  }
  return next;
}
