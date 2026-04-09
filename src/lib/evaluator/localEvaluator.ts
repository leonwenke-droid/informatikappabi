import type { EvaluationResult, Exercise } from '../../types';
import { inferMisconceptionsFromFeedback } from '../errors/taxonomy';

/**
 * LOCAL EVALUATOR
 * Rule-based evaluation for exercises.
 * No external API calls. Covers: MC/SC (exact), text (keyword + pattern matching),
 * SQL (structure analysis), code (keyword + structure hints).
 *
 * For semantic evaluation: see aiEvaluatorAdapter.ts (interface only, no real calls).
 */

// ─────────────────────────────────────────────────────────
// MC / SC evaluation (exact)
// ─────────────────────────────────────────────────────────

export interface MCResult {
  score: number;
  maxScore: number;
  correct: boolean;
  missingOptions: number[];
  wrongOptions: number[];
  feedback: string;
}

export function evaluateMC(
  selected: number[],
  correct: number[],
  options: { id: number; text: string }[],
  maxPoints: number,
  explanation: string
): MCResult {
  const sortedSelected = [...selected].sort((a, b) => a - b);
  const sortedCorrect = [...correct].sort((a, b) => a - b);
  const isExactlyCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);

  const missing = correct.filter((i) => !selected.includes(i));
  const wrong = selected.filter((i) => !correct.includes(i));

  // Partial scoring: -1 for each error (missing or wrong), floor at 0
  const errors = missing.length + wrong.length;
  const score = Math.max(0, maxPoints - errors);

  let feedback = isExactlyCorrect
    ? '✅ Alle richtigen Antworten ausgewählt!'
    : `❌ ${errors} Fehler.`;

  if (missing.length > 0) {
    feedback += `\nFehlend: ${missing.map((i) => options[i]?.text ?? `Option ${i}`).join(', ')}`;
  }
  if (wrong.length > 0) {
    feedback += `\nFalsch angekreuzt: ${wrong.map((i) => options[i]?.text ?? `Option ${i}`).join(', ')}`;
  }

  feedback += `\n\n📌 Erklärung: ${explanation}`;

  return { score, maxScore: maxPoints, correct: isExactlyCorrect, missingOptions: missing, wrongOptions: wrong, feedback };
}

// ─────────────────────────────────────────────────────────
// Text / code evaluation (keyword-based)
// ─────────────────────────────────────────────────────────

export interface TextEvalResult {
  score: number;
  maxScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  detectedAntiPatterns: string[];
  feedback: string;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export function evaluateText(
  userAnswer: string,
  exercise: Exercise
): TextEvalResult {
  const lower = userAnswer.toLowerCase().trim();
  const keywords = exercise.keywords ?? [];
  const antiPatterns = exercise.antiPatterns ?? [];

  const matched = keywords.filter((kw) => lower.includes(kw.toLowerCase()));
  const missing = keywords.filter((kw) => !lower.includes(kw.toLowerCase()));
  const detected = antiPatterns.filter((ap) => lower.includes(ap.toLowerCase()));

  // Score calculation: proportion of keywords matched, penalize antipatterns
  const keywordScore = keywords.length > 0
    ? matched.length / keywords.length
    : 0.5; // No keywords: neutral

  const antiPenalty = detected.length * 0.15;
  const rawScore = Math.max(0, Math.min(1, keywordScore - antiPenalty));
  const score = Math.round(rawScore * exercise.points);

  // Confidence: depends on keyword coverage
  const coverage = keywords.length > 0 ? matched.length / keywords.length : 0;
  const confidenceLevel: 'high' | 'medium' | 'low' =
    coverage >= 0.8 ? 'high' : coverage >= 0.5 ? 'medium' : 'low';

  let feedback = '';

  if (userAnswer.trim().length < 20) {
    feedback = '⚠️ Antwort zu kurz — bitte ausführlicher antworten.\n\n';
    return {
      score: 0, maxScore: exercise.points,
      matchedKeywords: [], missingKeywords: keywords, detectedAntiPatterns: detected,
      feedback: feedback + `📋 Musterlösung:\n${exercise.modelAnswer}`,
      confidenceLevel: 'low',
    };
  }

  if (score >= exercise.points * 0.85) {
    feedback = '✅ Sehr gute Antwort! Die wichtigsten Konzepte sind enthalten.';
  } else if (score >= exercise.points * 0.5) {
    feedback = '🟡 Teilweise richtig. Einige Aspekte fehlen noch.';
  } else {
    feedback = '❌ Wichtige Inhalte fehlen.';
  }

  if (missing.length > 0 && missing.length <= 5) {
    feedback += `\n\n💡 Hinweis: Folgende Begriffe/Konzepte fehlen oder wurden nicht erkannt:\n• ${missing.join('\n• ')}`;
  }

  if (detected.length > 0) {
    feedback += `\n\n⚠️ Typischer Fehler erkannt: ${detected.join(', ')}`;
  }

  feedback += `\n\n📌 ${exercise.explanation}`;
  feedback += `\n\n📋 Musterlösung:\n${exercise.modelAnswer}`;

  return {
    score, maxScore: exercise.points,
    matchedKeywords: matched, missingKeywords: missing, detectedAntiPatterns: detected,
    feedback, confidenceLevel,
  };
}

// ─────────────────────────────────────────────────────────
// SQL-specific evaluation
// ─────────────────────────────────────────────────────────

export interface SQLCheckResult {
  score: number;
  maxScore: number;
  checks: { name: string; passed: boolean; message: string }[];
  feedback: string;
}

export function evaluateSQL(userAnswer: string, exercise: Exercise): SQLCheckResult {
  const upper = userAnswer.toUpperCase().trim();
  const checks: { name: string; passed: boolean; message: string }[] = [];

  // Basic structure checks
  checks.push({
    name: 'SELECT vorhanden',
    passed: upper.startsWith('SELECT'),
    message: upper.startsWith('SELECT') ? '✓' : 'SELECT fehlt am Anfang',
  });

  checks.push({
    name: 'FROM vorhanden',
    passed: upper.includes('FROM'),
    message: upper.includes('FROM') ? '✓' : 'FROM-Klausel fehlt',
  });

  // Subquery check (forbidden!)
  const hasSubquery = /SELECT.*FROM.*\(SELECT/s.test(upper);
  checks.push({
    name: 'Keine verschachtelten SELECTs',
    passed: !hasSubquery,
    message: hasSubquery ? '❌ Verschachtelte SELECT nicht erlaubt im Abitur!' : '✓',
  });

  // JOIN via WHERE check
  const hasFrom = upper.includes('FROM') && /FROM\s+\w+\s*,\s*\w+/.test(upper);
  const hasJoinCondition = hasFrom
    ? /WHERE.*\.\w+\s*=\s*\w+\.\w+/.test(upper) || /WHERE.*\w+\.\w+\s*=\s*\w+\.\w+/.test(upper)
    : true;
  if (hasFrom) {
    checks.push({
      name: 'JOIN-Bedingung in WHERE',
      passed: hasJoinCondition,
      message: hasJoinCondition ? '✓' : '⚠️ Mehrere Tabellen ohne JOIN-Bedingung → kartesisches Produkt!',
    });
  }

  // HAVING for aggregates
  const hasAggregate = /\b(AVG|COUNT|MAX|MIN|SUM)\s*\(/.test(upper);
  const hasGroupBy = /\bGROUP\s+BY\b/.test(upper);
  /\bHAVING\b/.test(upper); // presence checked structurally above
  const hasWhereAggregate = /WHERE.*\b(AVG|COUNT|MAX|MIN|SUM)\s*\(/.test(upper);

  if (hasAggregate) {
    checks.push({
      name: 'GROUP BY bei Aggregat',
      passed: hasGroupBy,
      message: hasGroupBy ? '✓' : '⚠️ Aggregatfunktion ohne GROUP BY',
    });
    checks.push({
      name: 'HAVING statt WHERE für Aggregatbedingung',
      passed: !hasWhereAggregate,
      message: hasWhereAggregate ? '❌ Aggregat in WHERE-Klausel nicht zulässig → nutze HAVING' : '✓',
    });
  }

  // Keyword matching from exercise
  const keywords = exercise.keywords ?? [];
  const matchedKw = keywords.filter((kw) => upper.includes(kw.toUpperCase()));
  const coverage = keywords.length > 0 ? matchedKw.length / keywords.length : 0.5;

  const passedChecks = checks.filter((c) => c.passed).length;
  const totalChecks = checks.length;
  const structureScore = totalChecks > 0 ? passedChecks / totalChecks : 1;

  const rawScore = (structureScore * 0.5 + coverage * 0.5);
  const score = Math.round(rawScore * exercise.points);

  let feedback = '';
  if (score >= exercise.points * 0.85) {
    feedback = '✅ SQL-Abfrage sehr gut!';
  } else if (score >= exercise.points * 0.5) {
    feedback = '🟡 SQL teilweise korrekt.';
  } else {
    feedback = '❌ SQL-Abfrage weist mehrere Fehler auf.';
  }

  const issues = checks.filter((c) => !c.passed);
  if (issues.length > 0) {
    feedback += '\n\nProbleme:\n' + issues.map((i) => `• ${i.name}: ${i.message}`).join('\n');
  }

  feedback += `\n\n📌 ${exercise.explanation}`;
  feedback += `\n\n📋 Musterlösung:\n${exercise.modelAnswer}`;

  return { score, maxScore: exercise.points, checks, feedback };
}

// ─────────────────────────────────────────────────────────
// Main evaluator dispatcher
// ─────────────────────────────────────────────────────────

export function evaluateExercise(
  exercise: Exercise,
  userAnswer: string,
  mcSelected?: number[]
): EvaluationResult {
  if (exercise.type === 'mc' || exercise.type === 'sc') {
    const result = evaluateMC(
      mcSelected ?? [],
      exercise.correctOptions ?? [],
      exercise.options ?? [],
      exercise.points,
      exercise.explanation
    );
    const misconceptionIds =
      result.score < result.maxScore ? inferMisconceptionsFromFeedback(result.feedback) : undefined;
    return {
      score: result.score,
      maxScore: result.maxScore,
      feedback: result.feedback,
      source: 'local',
      misconceptionIds,
    };
  }

  if (exercise.type === 'sql') {
    const result = evaluateSQL(userAnswer, exercise);
    const misconceptionIds =
      result.score < result.maxScore ? inferMisconceptionsFromFeedback(result.feedback) : undefined;
    return {
      score: result.score,
      maxScore: result.maxScore,
      feedback: result.feedback,
      source: 'local',
      misconceptionIds,
    };
  }

  // text or code
  const result = evaluateText(userAnswer, exercise);
  const misconceptionIds =
    result.score < result.maxScore ? inferMisconceptionsFromFeedback(result.feedback) : undefined;
  return {
    score: result.score,
    maxScore: result.maxScore,
    feedback: result.feedback,
    source: 'local',
    misconceptionIds,
  };
}

// ─────────────────────────────────────────────────────────
// Hamming code utility (testable, pure function)
// ─────────────────────────────────────────────────────────

export function computeHamming74(d0: number, d1: number, d2: number, d3: number): {
  p0: number; p1: number; p2: number;
  bitstring: string;
  order: string;
} {
  const p0 = d0 ^ d1 ^ d3;
  const p1 = d0 ^ d2 ^ d3;
  const p2 = d1 ^ d2 ^ d3;
  const bitstring = `${p0}${p1}${d0}${p2}${d1}${d2}${d3}`;
  return { p0, p1, p2, bitstring, order: 'p0 p1 d0 p2 d1 d2 d3' };
}

export function detectHammingError(received: number[]): {
  syndrome: number;
  errorBit: number | null;
  corrected: number[];
} {
  // received = [p0, p1, d0, p2, d1, d2, d3]
  const [p0, p1, d0, p2, d1, d2, d3] = received;

  const s0 = p0 ^ d0 ^ d1 ^ d3;
  const s1 = p1 ^ d0 ^ d2 ^ d3;
  const s2 = p2 ^ d1 ^ d2 ^ d3;

  const syndrome = s0 + s1 * 2 + s2 * 4;
  // Map syndrome to bit position (1-indexed in standard Hamming, adjust for our order)
  const syndromeToPosition: Record<number, number> = {
    0: -1, // no error
    1: 0,  // p0 (position 0)
    2: 1,  // p1 (position 1)
    3: 2,  // d0 (position 2)
    4: 3,  // p2 (position 3)
    5: 4,  // d1 (position 4)
    6: 5,  // d2 (position 5)
    7: 6,  // d3 (position 6)
  };

  const errorBit = syndromeToPosition[syndrome] ?? null;
  const corrected = [...received];
  if (errorBit !== null && errorBit >= 0) {
    corrected[errorBit] = corrected[errorBit] === 0 ? 1 : 0;
  }

  return { syndrome, errorBit: errorBit === -1 ? null : errorBit, corrected };
}

// ─────────────────────────────────────────────────────────
// BST traversal utilities (testable, pure functions)
// ─────────────────────────────────────────────────────────

export interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

export function bstInsert(root: BSTNode | null, value: number): BSTNode {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) return { ...root, left: bstInsert(root.left, value) };
  if (value > root.value) return { ...root, right: bstInsert(root.right, value) };
  return root; // Duplicates ignored
}

export function bstFromArray(values: number[]): BSTNode | null {
  let root: BSTNode | null = null;
  for (const v of values) root = bstInsert(root, v);
  return root;
}

export function traversePreorder(root: BSTNode | null): number[] {
  if (!root) return [];
  return [root.value, ...traversePreorder(root.left), ...traversePreorder(root.right)];
}

export function traverseInorder(root: BSTNode | null): number[] {
  if (!root) return [];
  return [...traverseInorder(root.left), root.value, ...traverseInorder(root.right)];
}

export function traversePostorder(root: BSTNode | null): number[] {
  if (!root) return [];
  return [...traversePostorder(root.left), ...traversePostorder(root.right), root.value];
}
