/**
 * Kompetenzprofil: Skills aus Übungen/Checks, nicht nur linearer Lernpfad.
 */

export type SkillId =
  | 'algo_basics'
  | 'variables_types'
  | 'control_flow'
  | 'trace'
  | 'arrays'
  | 'recursion'
  | 'dyn_structures'
  | 'oop'
  | 'bst'
  | 'crypto'
  | 'coding_hamming'
  | 'sql'
  | 'automata'
  | 'grammar'
  | 'networks'
  | 'operator_formulation';

export interface SkillState {
  masteryScore: number;
  confidenceScore: number;
  errorFlags: string[];
  lastUpdated: number;
}

export type CompetencyProfile = Partial<Record<SkillId, SkillState>>;

export type ContentAccess = 'open' | 'recommended' | 'blocked';

export interface AccessContext {
  /** Unit-IDs die laut didaktik zuerst Sinn ergeben */
  softPrerequisiteUnitIds?: string[];
  /** Skill-Schwellen: unter diesem Wert → recommended statt neutral */
  recommendedBelowMastery?: Partial<Record<SkillId, number>>;
  /** Harte Sperre nur wenn alle genannten Skills unter Schwelle */
  hardBlockIfAllBelow?: { skills: SkillId[]; threshold: number };
}
