import type { MisconceptionId } from './learning';

// ─────────────────────────────────────────────────────────
// Official curriculum types — based on KC 2017 + Ergänzende Hinweise 2021
// ─────────────────────────────────────────────────────────

export type Priority = 'HOCH' | 'MITTEL' | 'BASIS';
export type Block = 'B1' | 'B2' | 'B1+B2';
export type ExamOperator =
  | 'nennen'
  | 'beschreiben'
  | 'erläutern'
  | 'analysieren'
  | 'beurteilen'
  | 'entwerfen'
  | 'bestimmen'
  | 'implementieren'
  | 'berechnen'
  | 'ableiten'
  | 'darstellen';

export type ExerciseType = 'mc' | 'sc' | 'text' | 'sql' | 'code';

// ─────────────────────────────────────────────────────────
// Topics
// ─────────────────────────────────────────────────────────

export interface TopicError {
  description: string;
  example?: string;
  source?: 'official' | 'pattern'; // official = from KC/Hinweise, pattern = from 2021-2025
}

export interface Topic {
  id: string;
  icon: string;
  title: string;
  category: string;
  block: Block;
  priority: Priority;
  theory: string;
  theoryFormatted?: TheorySection[];
  errors: TopicError[];
  examPattern: string; // derived from 2021-2025 exams
  officialNote?: string; // direct quote/reference from official docs
  relatedTopics?: string[];
}

export interface TheorySection {
  heading: string;
  content: string;
  isCode?: boolean;
}

// ─────────────────────────────────────────────────────────
// Exercises
// ─────────────────────────────────────────────────────────

export interface ExerciseOption {
  id: number;
  text: string;
}

export type LegacyExerciseTrack = 'mini' | 'guided' | 'standard' | 'transfer' | 'examStyle';

export interface Exercise {
  id: string;
  topicId: string;
  difficulty: 1 | 2 | 3;
  points: number;
  operator: ExamOperator;
  question: string;
  type: ExerciseType;
  /** Filter „Anfänger“ / Aufgabenpool */
  track?: LegacyExerciseTrack;
  subtopic?: string;
  // MC/SC
  options?: ExerciseOption[];
  correctOptions?: number[];
  // Text/SQL/Code
  modelAnswer?: string;
  explanation: string;
  // For local evaluation hints
  keywords?: string[];
  antiPatterns?: string[];
  // Source traceability
  source: 'official' | 'klausur-2021' | 'klausur-2022' | 'klausur-2023' | 'klausur-2024' | 'klausur-2025' | 'derived';
}

// ─────────────────────────────────────────────────────────
// Exam years (2021-2025 analysis data)
// ─────────────────────────────────────────────────────────

export interface ExamTask {
  id: string;
  year: number;
  block: 'B1' | 'B2';
  label: string; // e.g. "1A", "2C"
  topics: string[];
  description: string;
  points?: number;
}

export interface ExamYear {
  year: number;
  block1Tasks: ExamTask[];
  block2Tasks: ExamTask[];
  notes?: string;
}

// ─────────────────────────────────────────────────────────
// Topic frequency (derived from 2021-2025)
// ─────────────────────────────────────────────────────────

export interface TopicFrequency {
  topicId: string;
  topicLabel: string;
  block1Count: number;
  block2Count: number;
  priority: Priority;
  note: string; // source note
}

// ─────────────────────────────────────────────────────────
// Prognose 2026 (derived — NOT official)
// ─────────────────────────────────────────────────────────

export interface Prognose2026Item {
  taskSlot: string;
  probability: number;
  topic: string;
  reasoning: string;
}

// ─────────────────────────────────────────────────────────
// Operator definitions (official)
// ─────────────────────────────────────────────────────────

export interface OperatorDefinition {
  name: ExamOperator;
  description: string;
  level: 'I' | 'II' | 'III';
  example: string;
}

// ─────────────────────────────────────────────────────────
// Progress / persistence
// ─────────────────────────────────────────────────────────

export interface ExerciseResult {
  exerciseId: string;
  topicId: string;
  score: number;
  maxScore: number;
  timestamp: number;
  timeSpentSec?: number;
  // Spaced Repetition
  nextReviewAt?: number;   // Unix timestamp when this exercise should be reviewed again
  reviewInterval?: number; // Current interval in days (1 → 3 → 7 → 14 → 30)
}

export interface TopicProgress {
  topicId: string;
  completedExercises: string[];
  totalAttempts: number;
  totalScore: number;
  totalMaxScore: number;
  lastAttempt?: number;
}

export interface MistakeEntry {
  id: string;
  exerciseId: string;
  topicId: string;
  question: string;
  userAnswer: string;
  modelAnswer: string;
  feedback: string;
  timestamp: number;
  reviewed: boolean;
  misconceptionIds?: string[];
}

export interface AppProgress {
  exerciseResults: ExerciseResult[];
  topicProgress: Record<string, TopicProgress>;
  mistakes: MistakeEntry[];
  lastVisitedTopic?: string;
  examSimulations: ExamSimulation[];
}

// ─────────────────────────────────────────────────────────
// Exam simulation
// ─────────────────────────────────────────────────────────

export interface ExamSimulation {
  id: string;
  startedAt: number;
  finishedAt?: number;
  block1Choice: string;
  block2Choices: string[];
  durationSec: number;
  notes?: string;
}

// ─────────────────────────────────────────────────────────
// AI Evaluator adapter (interface only — no direct API calls)
// ─────────────────────────────────────────────────────────

export interface EvaluationRequest {
  exerciseId: string;
  question: string;
  modelAnswer: string;
  userAnswer: string;
  operator: ExamOperator;
  maxPoints: number;
}

/** Strukturierte KI-Rückmeldung (vom Eval-Server) */
export interface AiRubricDetail {
  overallVerdict: string;
  factualCorrectness: string;
  operatorFit: string;
  strengths: string[];
  weaknesses: string[];
  improvementHint: string;
  sampleFormulation?: string;
  estimatedPoints?: number;
}

export interface EvaluationResult {
  score: number;
  maxScore: number;
  feedback: string;
  tip?: string;
  source: 'local' | 'ai';
  misconceptionIds?: MisconceptionId[];
  aiRubric?: AiRubricDetail;
}

export interface AIEvaluatorAdapter {
  isAvailable(): boolean;
  evaluate(req: EvaluationRequest): Promise<EvaluationResult>;
}
