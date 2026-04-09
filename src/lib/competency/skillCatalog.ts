import type { SkillId, SkillState } from '../../types/competency';

/** Thema (Legacy topicId / Lernpfad-Tag) → Skills, die davon profitieren */
export const TOPIC_TO_SKILLS: Record<string, SkillId[]> = {
  oop: ['oop'],
  bst: ['bst', 'recursion'],
  rek: ['recursion', 'bst'],
  dyn: ['dyn_structures', 'arrays'],
  db: ['sql'],
  sql: ['sql'],
  aut: ['automata'],
  gram: ['grammar'],
  cod: ['coding_hamming'],
  krypto: ['crypto'],
  arr2d: ['arrays'],
  net: ['networks'],
};

/** Lernpfad stageId → primäre Skills */
export const STAGE_TO_SKILLS: Record<string, SkillId[]> = {
  s01: ['algo_basics'],
  s02a: ['variables_types'],
  s02b: ['control_flow'],
  s03: ['trace'],
  s04: ['arrays'],
  s05: ['recursion'],
  s06: ['dyn_structures'],
  s07: ['oop'],
  s08: ['bst'],
  s09: ['crypto'],
  s10: ['coding_hamming'],
  s11: ['sql'],
  s12: ['automata'],
  s13: ['grammar'],
  s14: ['networks'],
  s15: ['operator_formulation'],
};

export const DEFAULT_SKILL_STATE = (): SkillState => ({
  masteryScore: 0.35,
  confidenceScore: 0.3,
  errorFlags: [],
  lastUpdated: Date.now(),
});
