import { useState, useMemo } from 'react';
import type { PathExercise, PracticeMode } from '../../types/learning';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getExerciseById } from '../../data/exercises';
import { evaluateExercise } from '../../lib/evaluator/localEvaluator';
import type { EvaluationResult } from '../../types';
import { MISCONCEPTION_CATALOG } from '../../lib/errors/taxonomy';

interface PracticeSessionProps {
  exercise: PathExercise;
  initialMode?: PracticeMode;
}

export function PracticeSession({ exercise, initialMode = 'free' }: PracticeSessionProps) {
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [stepIdx, setStepIdx] = useState(0);
  const [mcSel, setMcSel] = useState<number | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const legacy = useMemo(
    () => (exercise.legacyExerciseId ? getExerciseById(exercise.legacyExerciseId) : undefined),
    [exercise.legacyExerciseId]
  );

  const handleCheck = () => {
    if (exercise.inlineMc) {
      const ok = mcSel === exercise.inlineMc.correctIndex;
      setResult({
        score: ok ? 1 : 0,
        maxScore: 1,
        feedback: ok ? 'Richtig!' : exercise.inlineMc.explanation,
        source: 'local',
        misconceptionIds: ok ? undefined : exercise.misconceptionTags,
      });
      return;
    }
    if (legacy && (legacy.type === 'mc' || legacy.type === 'sc')) {
      const evalResult = evaluateExercise(legacy, '', mcSel !== null ? [mcSel] : []);
      setResult(evalResult);
    }
  };

  const showSolution = mode === 'showSolution' || (result && mode === 'stepHints');

  return (
    <Card className="p-5">
      <div className="flex flex-wrap gap-2 mb-4">
        {exercise.modes.map((m) => (
          <Button key={m} size="sm" variant={mode === m ? 'primary' : 'secondary'} onClick={() => { setMode(m); setResult(null); setMcSel(null); setStepIdx(0); }}>
            {m === 'free' ? 'Frei' : m === 'guided' ? 'Geführt' : m === 'stepHints' ? 'Schritt-Tipps' : 'Musterweg'}
          </Button>
        ))}
      </div>

      <h3 className="text-base font-semibold text-slate-100 mb-2">{exercise.title}</h3>

      {mode === 'guided' && exercise.guidedSteps && exercise.guidedSteps.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-slate-800/60 text-sm text-slate-300">
          <p className="text-xs text-amber-400 mb-1">Schritt {stepIdx + 1} / {exercise.guidedSteps.length}</p>
          <p>{exercise.guidedSteps[stepIdx]}</p>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="ghost" disabled={stepIdx === 0} onClick={() => setStepIdx((i) => i - 1)}>Zurück</Button>
            <Button size="sm" variant="secondary" disabled={stepIdx >= exercise.guidedSteps.length - 1} onClick={() => setStepIdx((i) => i + 1)}>Weiter</Button>
          </div>
        </div>
      )}

      {exercise.inlineMc && (
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

      {legacy && (legacy.type === 'mc' || legacy.type === 'sc') && (
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

      {!result || result.score < result.maxScore ? (
        <Button variant="primary" onClick={handleCheck} disabled={mcSel === null && !exercise.legacyExerciseId}>
          Auswerten
        </Button>
      ) : (
        <Button variant="secondary" onClick={() => { setResult(null); setMcSel(null); }}>Nochmal</Button>
      )}

      {result && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${result.score >= result.maxScore ? 'bg-emerald-950/40 text-emerald-200' : 'bg-red-950/30 text-red-200'}`}>
          <div className="whitespace-pre-line">{result.feedback}</div>
          {result.misconceptionIds && result.misconceptionIds.length > 0 && (
            <ul className="mt-2 text-xs space-y-1 text-slate-300">
              {result.misconceptionIds.map((id) => {
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
        </div>
      )}
    </Card>
  );
}
