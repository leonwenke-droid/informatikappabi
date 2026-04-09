import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Card, AlertBox } from '../../components/ui/Card';
import { useLearningStore } from '../../store/learningStore';
import { BackendAPIAdapter } from '../../lib/evaluator/aiEvaluatorAdapter';
import type { EvaluationResult, ExamOperator } from '../../types';
import { OPERATOR_GUIDES, OPERATOR_ORDER } from './operatorGuides';
import { FORMULATION_EXAMPLES } from './examples';

const adapter = new BackendAPIAdapter();

export function AnswerTrainingPage() {
  const [op, setOp] = useState<ExamOperator>('erläutern');
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const applyCompetencySkills = useLearningStore((s) => s.applyCompetencySkills);

  const guide = OPERATOR_GUIDES[op];
  const examples = useMemo(() => FORMULATION_EXAMPLES.filter((e) => e.operator === op), [op]);

  const runEval = useCallback(async () => {
    if (draft.trim().length < 15) return;
    setBusy(true);
    setResult(null);
    const ex = examples[0];
    try {
      const res = await adapter.evaluate({
        exerciseId: `formulierung-${op}`,
        question: `Operator „${op}“: ${ex?.context ?? 'Formuliere eine sachlich korrekte, zur Operatortiefe passende Antwort.'}`,
        modelAnswer: ex?.good ?? 'Sachlich korrekt, zur Operatortiefe passend, klar gegliedert.',
        userAnswer: draft,
        operator: op,
        maxPoints: 6,
      });
      setResult(res);
      if (res.source === 'ai' && res.maxScore > 0) {
        applyCompetencySkills(['operator_formulation'], Math.min(1, res.score / res.maxScore));
      }
    } catch (e) {
      setResult({
        score: 0,
        maxScore: 6,
        feedback: e instanceof Error ? e.message : String(e),
        source: 'local',
      });
    } finally {
      setBusy(false);
    }
  }, [draft, op, examples, applyCompetencySkills]);

  return (
    <div>
      <PageHeader
        title="Formulierungstraining"
        subtitle="Operator-Guides, schlecht/gut, KI-Rubrik — Kompetenz „operator_formulation“"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Link to="/uebungspool">
          <Button variant="ghost" size="sm">Aufgabenpool</Button>
        </Link>
        <Link to="/code-lab">
          <Button variant="ghost" size="sm">Code-Labor</Button>
        </Link>
      </div>

      <Card className="p-5 mb-4">
        <label className="text-xs text-slate-500 block mb-2">Prüfungsoperator</label>
        <select
          className="w-full max-w-md rounded-lg bg-[#0a0f18] border border-slate-600 p-2 text-sm text-slate-200 mb-4"
          value={op}
          onChange={(e) => setOp(e.target.value as ExamOperator)}
        >
          {OPERATOR_ORDER.map((o) => (
            <option key={o} value={o}>
              {OPERATOR_GUIDES[o].title} ({o})
            </option>
          ))}
        </select>

        <h2 className="text-sm font-semibold text-slate-200 mb-2">{guide.title}</h2>
        <ul className="text-sm text-slate-400 list-disc pl-5 space-y-1 mb-6">
          {guide.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        {examples.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="text-[11px] font-bold text-slate-500 uppercase">Beispiel zur Aufgabenstellung</div>
            {examples.map((ex, i) => (
              <div key={i} className="text-sm space-y-2">
                <p className="text-slate-300">{ex.context}</p>
                <div className="rounded-lg bg-red-950/25 border border-red-900/40 p-2 text-red-200/90">
                  <span className="text-[10px] uppercase text-red-400">Zu dünn</span>
                  <p>{ex.bad}</p>
                </div>
                <div className="rounded-lg bg-emerald-950/25 border border-emerald-900/40 p-2 text-emerald-100/90">
                  <span className="text-[10px] uppercase text-emerald-400">Besser</span>
                  <p>{ex.good}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <label className="text-xs text-slate-500 block mb-1">Deine Formulierung</label>
        <textarea
          className="w-full min-h-[140px] rounded-lg bg-[#0a0f18] border border-slate-600 p-3 text-sm text-slate-200"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Formuliere zur gewählten Aufgabenstellung …"
        />
        <div className="mt-3">
          <Button variant="primary" onClick={runEval} disabled={busy || draft.trim().length < 15}>
            {busy ? 'KI wertet …' : 'Mit KI bewerten'}
          </Button>
        </div>
      </Card>

      {result && (
        <AlertBox variant="info" title="Rückmeldung">
          <p className="text-sm whitespace-pre-line mb-2">{result.feedback}</p>
          {result.aiRubric && (
            <div className="text-xs text-slate-400 space-y-2">
              <div>
                <strong className="text-slate-300">Operator-Fit:</strong> {result.aiRubric.operatorFit}
              </div>
              {result.aiRubric.sampleFormulation && (
                <div>
                  <strong className="text-slate-300">Musterformulierung:</strong> {result.aiRubric.sampleFormulation}
                </div>
              )}
            </div>
          )}
        </AlertBox>
      )}
    </div>
  );
}
