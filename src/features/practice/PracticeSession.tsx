import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { PathExercise, PracticeMode, MisconceptionId } from '../../types/learning';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getExerciseById } from '../../data/exercises';
import { evaluateExercise } from '../../lib/evaluator/localEvaluator';
import type { EvaluationResult } from '../../types';
import { MISCONCEPTION_CATALOG } from '../../lib/errors/taxonomy';
import { evaluateGuidedStep, type GuidedStepAnswer } from '../../lib/practice/guidedStepEvaluator';
import { useLearningStore } from '../../store/learningStore';
import { PATH_STAGES } from '../../content/path/stages';

interface PracticeSessionProps {
  exercise: PathExercise;
  initialMode?: PracticeMode;
}

export function PracticeSession({ exercise, initialMode = 'free' }: PracticeSessionProps) {
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [stepIdx, setStepIdx] = useState(0);
  const [mcSel, setMcSel] = useState<number | null>(null);
  const [stepMcSel, setStepMcSel] = useState<number | null>(null);
  const [stepText, setStepText] = useState('');
  const [stepFeedback, setStepFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const mergeWeak = useLearningStore((s) => s.mergeUnitWeakMisconceptions);
  const recordExerciseCompetency = useLearningStore((s) => s.recordExerciseCompetency);

  const legacy = useMemo(
    () => (exercise.legacyExerciseId ? getExerciseById(exercise.legacyExerciseId) : undefined),
    [exercise.legacyExerciseId]
  );

  const flow = exercise.guidedFlow;
  const flowLen = flow?.length ?? 0;
  const currentStep = flow && stepIdx < flowLen ? flow[stepIdx] : null;
  const allFlowDone = flowLen > 0 && Object.keys(completedSteps).length >= flowLen;

  const handleCheck = () => {
    if (exercise.inlineMc) {
      const ok = mcSel === exercise.inlineMc.correctIndex;
      const evalResult = {
        score: ok ? 1 : 0,
        maxScore: 1,
        feedback: ok ? 'Richtig!' : exercise.inlineMc.explanation,
        source: 'local' as const,
        misconceptionIds: ok ? undefined : exercise.misconceptionTags,
      };
      setResult(evalResult);
      recordExerciseCompetency(
        exercise.unitId,
        undefined,
        evalResult.maxScore > 0 ? evalResult.score / evalResult.maxScore : 0
      );
      return;
    }
    if (legacy && (legacy.type === 'mc' || legacy.type === 'sc')) {
      const evalResult = evaluateExercise(legacy, '', mcSel !== null ? [mcSel as number] : []);
      setResult(evalResult);
      recordExerciseCompetency(
        exercise.unitId,
        legacy.topicId,
        evalResult.maxScore > 0 ? evalResult.score / evalResult.maxScore : 0
      );
    }
  };

  const submitGuidedStep = () => {
    if (!currentStep) return;
    const answer: GuidedStepAnswer =
      currentStep.expectedType === 'mc'
        ? { mcIndex: stepMcSel ?? undefined }
        : { text: stepText };
    const ev = evaluateGuidedStep(currentStep, answer);
    setStepFeedback({ ok: ev.ok, text: ev.feedback });
    if (ev.ok) {
      setCompletedSteps((c) => ({ ...c, [currentStep.id]: true }));
    } else if (ev.misconceptionOnFail) {
      mergeWeak(exercise.unitId, [ev.misconceptionOnFail]);
    }
  };

  const advanceAfterGoodStep = () => {
    if (!currentStep || !stepFeedback?.ok) return;
    setStepFeedback(null);
    setStepMcSel(null);
    setStepText('');
    if (stepIdx < flowLen - 1) setStepIdx((i) => i + 1);
  };

  const showSolution = mode === 'showSolution' || (result && mode === 'stepHints');

  const stageId = PATH_STAGES.find((s) => s.unitIds.includes(exercise.unitId))?.id ?? 's01';

  return (
    <Card className="p-5">
      <div className="flex flex-wrap gap-2 mb-4">
        {exercise.modes.map((m) => (
          <Button
            key={m}
            size="sm"
            variant={mode === m ? 'primary' : 'secondary'}
            onClick={() => {
              setMode(m);
              setResult(null);
              setMcSel(null);
              setStepIdx(0);
              setStepFeedback(null);
              setCompletedSteps({});
              setStepMcSel(null);
              setStepText('');
            }}
          >
            {m === 'free' ? 'Frei' : m === 'guided' ? 'Geführt' : m === 'stepHints' ? 'Schritt-Tipps' : 'Musterweg'}
          </Button>
        ))}
      </div>

      <h3 className="text-base font-semibold text-slate-100 mb-2">{exercise.title}</h3>
      {exercise.track && (
        <p className="text-[11px] text-slate-500 mb-3 uppercase tracking-wide">Track: {exercise.track}</p>
      )}

      {mode === 'guided' && flow && flow.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-slate-800/60 text-sm text-slate-300 border border-slate-700/80">
          <p className="text-xs text-amber-400 mb-2">
            Schritt {stepIdx + 1} / {flow.length}
            {allFlowDone && ' — alle Teilschritte geschafft'}
          </p>
          {!allFlowDone && currentStep && (
            <>
              <p className="mb-3 whitespace-pre-line">{currentStep.prompt}</p>
              {currentStep.expectedType === 'mc' && currentStep.options && (
                <div className="space-y-2 mb-3">
                  {currentStep.options.map((opt, i) => (
                    <label key={i} className="flex gap-2 items-center text-sm text-slate-300">
                      <input
                        type="radio"
                        name={`gf-${currentStep.id}`}
                        checked={stepMcSel === i}
                        onChange={() => setStepMcSel(i)}
                        disabled={!!stepFeedback?.ok}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {(currentStep.expectedType === 'shortText' || currentStep.expectedType === 'keywords') && (
                <textarea
                  className="w-full rounded-lg bg-[#0a0f18] border border-slate-600 p-2 text-sm text-slate-200 mb-3"
                  rows={2}
                  value={stepText}
                  onChange={(e) => setStepText(e.target.value)}
                  disabled={!!stepFeedback?.ok}
                  placeholder="Kurze Antwort …"
                />
              )}
              {!stepFeedback?.ok && (
                <Button
                  size="sm"
                  variant="primary"
                  className="mr-2"
                  onClick={submitGuidedStep}
                  disabled={
                    currentStep.expectedType === 'mc'
                      ? stepMcSel === null
                      : stepText.trim().length === 0
                  }
                >
                  Schritt prüfen
                </Button>
              )}
              {stepFeedback && (
                <div
                  className={`mt-3 p-2 rounded text-sm ${stepFeedback.ok ? 'bg-emerald-950/40 text-emerald-200' : 'bg-red-950/30 text-red-200'}`}
                >
                  {stepFeedback.text}
                </div>
              )}
              {stepFeedback?.ok && (
                <Button size="sm" variant="secondary" className="mt-2" onClick={advanceAfterGoodStep}>
                  {stepIdx < flowLen - 1 ? 'Nächster Schritt' : 'Weiter zur Gesamtaufgabe'}
                </Button>
              )}
              {!stepFeedback?.ok && stepFeedback && currentStep.remediationGlossaryTermIds && currentStep.remediationGlossaryTermIds.length > 0 && (
                <div className="mt-2 text-xs text-slate-400">
                  Nachlesen:{' '}
                  {currentStep.remediationGlossaryTermIds.map((tid) => (
                    <Link key={tid} to={`/glossar#${tid}`} className="text-blue-400 mr-2 underline">
                      {tid}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {mode === 'guided' && exercise.guidedSteps && exercise.guidedSteps.length > 0 && (!flow || flow.length === 0) && (
        <div className="mb-4 p-3 rounded-lg bg-slate-800/60 text-sm text-slate-300">
          <p className="text-xs text-amber-400 mb-1">Hinweis {stepIdx + 1} / {exercise.guidedSteps.length}</p>
          <p>{exercise.guidedSteps[stepIdx]}</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="ghost" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => i - 1)}>Zurück</Button>
            <Button size="sm" variant="secondary" disabled={stepIdx >= exercise.guidedSteps.length - 1} onClick={() => setStepIdx((i) => i + 1)}>Weiter</Button>
          </div>
        </div>
      )}

      {exercise.inlineMc && (!flow?.length || allFlowDone) && (
        <div className="space-y-2 mb-4">
          <p className="text-sm text-slate-200 whitespace-pre-line">{exercise.inlineMc.question}</p>
          {exercise.inlineMc.options.map((opt, i) => (
            <label key={i} className="flex gap-2 items-center text-sm text-slate-300">
              <input type="radio" name="inline" checked={mcSel === i} onChange={() => setMcSel(i)} disabled={!!result && result.score === result.maxScore} />
              {opt}
            </label>
          ))}
        </div>
      )}

      {legacy && (legacy.type === 'mc' || legacy.type === 'sc') && (!exercise.inlineMc || allFlowDone) && (
        <div className="space-y-2 mb-4">
          <p className="text-sm text-slate-200 whitespace-pre-line">{legacy.question}</p>
          {legacy.options?.map((opt) => (
            <label key={opt.id} className="flex gap-2 items-center text-sm text-slate-300">
              <input
                type={legacy.type === 'sc' ? 'radio' : 'checkbox'}
                name="leg"
                checked={legacy.type === 'sc' ? mcSel === opt.id : false}
                onChange={() => {
                  if (legacy.type === 'sc') setMcSel(opt.id);
                }}
              />
              {opt.text}
            </label>
          ))}
        </div>
      )}

      {showSolution && exercise.inlineMc && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-sm text-emerald-200">
          <strong>Musterweg:</strong> Option {exercise.inlineMc.correctIndex + 1} — {exercise.inlineMc.explanation}
        </div>
      )}

      {(!flow?.length || allFlowDone) && (!result || result.score < result.maxScore ? (
        <Button
          variant="primary"
          onClick={handleCheck}
          disabled={mcSel === null && !exercise.legacyExerciseId}
        >
          Auswerten
        </Button>
      ) : (
        <Button variant="secondary" onClick={() => { setResult(null); setMcSel(null); }}>Nochmal</Button>
      ))}

      {result && (!flow?.length || allFlowDone) && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${result.score >= result.maxScore ? 'bg-emerald-950/40 text-emerald-200' : 'bg-red-950/30 text-red-200'}`}>
          <div className="whitespace-pre-line">{result.feedback}</div>
          {result.misconceptionIds && result.misconceptionIds.length > 0 && (
            <ul className="mt-2 text-xs space-y-1 text-slate-300">
              {(result.misconceptionIds as MisconceptionId[]).map((id) => {
                const info = MISCONCEPTION_CATALOG[id];
                if (!info) return null;
                return (
                  <li key={id}>
                    <strong>{info.label}:</strong> {info.remediationHint}
                  </li>
                );
              })}
            </ul>
          )}
          {exercise.remediationUnitId && result.score < result.maxScore && (
            <div className="mt-3 text-xs">
              <Link to={`/lernen/${PATH_STAGES.find((s) => s.unitIds.includes(exercise.remediationUnitId!))?.id ?? stageId}/${exercise.remediationUnitId}`} className="text-blue-400 underline">
                Zur Mini-Wiederholung (verwandte Lektion)
              </Link>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
