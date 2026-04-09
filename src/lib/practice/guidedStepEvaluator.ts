import type { GuidedExerciseStep, MisconceptionId } from '../../types/learning';

export interface GuidedStepAnswer {
  mcIndex?: number;
  text?: string;
}

export interface GuidedStepEvalResult {
  ok: boolean;
  feedback: string;
  misconceptionOnFail?: MisconceptionId;
  remediationGlossaryTermIds?: string[];
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Bewertet eine Antwort auf einen einzelnen GuidedExerciseStep (reine Funktion).
 */
export function evaluateGuidedStep(step: GuidedExerciseStep, answer: GuidedStepAnswer): GuidedStepEvalResult {
  if (step.expectedType === 'mc') {
    const idx = answer.mcIndex;
    if (idx === undefined || step.correctOptionIndex === undefined) {
      return {
        ok: false,
        feedback: step.feedbackWrong,
        misconceptionOnFail: step.misconceptionOnFail,
        remediationGlossaryTermIds: step.remediationGlossaryTermIds,
      };
    }
    const ok = idx === step.correctOptionIndex;
    return {
      ok,
      feedback: ok ? step.feedbackRight : step.feedbackWrong,
      misconceptionOnFail: ok ? undefined : step.misconceptionOnFail,
      remediationGlossaryTermIds: ok ? undefined : step.remediationGlossaryTermIds,
    };
  }

  const raw = (answer.text ?? '').trim();
  if (!raw) {
    return {
      ok: false,
      feedback: step.feedbackWrong,
      misconceptionOnFail: step.misconceptionOnFail,
      remediationGlossaryTermIds: step.remediationGlossaryTermIds,
    };
  }

  const accepts = step.keywordAccept ?? [];
  if (accepts.length === 0) {
    return {
      ok: false,
      feedback: step.feedbackWrong,
      misconceptionOnFail: step.misconceptionOnFail,
      remediationGlossaryTermIds: step.remediationGlossaryTermIds,
    };
  }

  const n = normalize(raw);
  const ok = accepts.some((kw) => n.includes(normalize(kw)));
  return {
    ok,
    feedback: ok ? step.feedbackRight : step.feedbackWrong,
    misconceptionOnFail: ok ? undefined : step.misconceptionOnFail,
    remediationGlossaryTermIds: ok ? undefined : step.remediationGlossaryTermIds,
  };
}

export function guidedFlowTotalSteps(flow: GuidedExerciseStep[] | undefined): number {
  return flow?.length ?? 0;
}
