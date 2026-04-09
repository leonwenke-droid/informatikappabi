import { describe, it, expect } from 'vitest';
import { evaluateGuidedStep } from './guidedStepEvaluator';
import type { GuidedExerciseStep } from '../../types/learning';

describe('evaluateGuidedStep', () => {
  it('accepts correct mc index', () => {
    const step: GuidedExerciseStep = {
      id: '1',
      prompt: 'x?',
      expectedType: 'mc',
      options: ['a', 'b'],
      correctOptionIndex: 1,
      feedbackWrong: 'no',
      feedbackRight: 'yes',
    };
    expect(evaluateGuidedStep(step, { mcIndex: 1 }).ok).toBe(true);
    expect(evaluateGuidedStep(step, { mcIndex: 0 }).ok).toBe(false);
  });

  it('accepts keyword in text', () => {
    const step: GuidedExerciseStep = {
      id: '2',
      prompt: 'n?',
      expectedType: 'keywords',
      keywordAccept: ['5', 'fünf'],
      feedbackWrong: 'no',
      feedbackRight: 'yes',
    };
    expect(evaluateGuidedStep(step, { text: 'Die Antwort ist 5' }).ok).toBe(true);
    expect(evaluateGuidedStep(step, { text: 'vier' }).ok).toBe(false);
  });
});
