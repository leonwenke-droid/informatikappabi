/**
 * Lernpfad- und Lektionsmodell (Neuaufbau Anfänger-first).
 * Quellen-Tags: official | examPattern2021_2025 | didactic
 */

export type ContentSource = 'official' | 'examPattern2021_2025' | 'didactic';

export type ExplanationTier = 'beginner' | 'standard' | 'examBrief';

export type PracticeMode = 'free' | 'guided' | 'stepHints' | 'showSolution';

export type DiagnosisLevel = 'beginner' | 'intermediate' | 'advanced';

export type MisconceptionId =
  | 'concept_not_understood'
  | 'recursion_base_missing'
  | 'recursion_step_wrong'
  | 'bst_left_right_swapped'
  | 'stack_queue_confusion'
  | 'having_where_confusion'
  | 'join_missing'
  | 'hamming_wrong_layout'
  | 'regular_vs_cf_confusion'
  | 'automaton_reading_error'
  | 'operator_ignored';

export type UserPace = 'slow' | 'normal';

export interface SourcedText {
  text: string;
  source: ContentSource;
}

export interface LessonBlocks {
  whatIs: SourcedText;
  whyItMatters: SourcedText;
  terms: SourcedText;
  simplestExample: SourcedText;
  stepByStep: SourcedText;
  typicalMistakes: SourcedText;
  miniSummary: SourcedText;
}

export interface LessonContent {
  /** Drei Erklärebene */
  tiers: Record<ExplanationTier, LessonBlocks>;
  /** Checkliste am Ende der Lektion (Keys für Fortschritt) */
  checklistKeys: string[];
  checklistLabels: Record<string, string>;
}

export interface ConceptCheck {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

/** Neue Übungskarte (kann auf Legacy-Exercise verweisen oder inline MC) */
export interface PathExercise {
  id: string;
  unitId: string;
  legacyExerciseId?: string;
  title: string;
  modes: PracticeMode[];
  /** Für guided: Schritte als Text-Hinweise */
  guidedSteps?: string[];
  misconceptionTags?: MisconceptionId[];
  /** Falls kein Legacy-Eintrag gewünscht */
  inlineMc?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface PathStage {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  prerequisiteStageIds: string[];
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3;
  unitIds: string[];
}

export interface PathUnit {
  id: string;
  stageId: string;
  title: string;
  tags: string[];
  vocabularyTermIds: string[];
  lesson: LessonContent;
  conceptChecks: ConceptCheck[];
  exercises: PathExercise[];
}

export interface GlossaryEntry {
  id: string;
  term: string;
  shortDef: string;
  simpleExplanation: string;
  relatedUnitIds: string[];
  officialRef?: string;
}

export interface UnitProgressState {
  checklist: Record<string, boolean>;
  conceptCheckSolved: Record<string, boolean>;
  completed: boolean;
  lastTier?: ExplanationTier;
}

export interface DiagnosisState {
  completed: boolean;
  level: DiagnosisLevel;
  answers: Record<string, number>;
  completedAt?: number;
}

export interface LearningSettings {
  pace: UserPace;
  onlyBasics: boolean;
  examModeUnlocked: boolean;
  skippedExamGate: boolean;
}

export interface LearningProgress {
  onboardingComplete: boolean;
  diagnosis: DiagnosisState;
  settings: LearningSettings;
  unitProgress: Record<string, UnitProgressState>;
  dailyPlanDate: string | null;
  lastUnitId?: string;
}
