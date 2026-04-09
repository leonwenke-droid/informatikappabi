import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Card, AlertBox } from '../../components/ui/Card';
import { useLearningStore } from '../../store/learningStore';
import { runLocalChecks } from './checkCode';
import { CODE_LAB_TASKS } from './tasks';
import { BackendAPIAdapter } from '../../lib/evaluator/aiEvaluatorAdapter';
import type { SkillId } from '../../types/competency';
import type { EvaluationResult } from '../../types';

const Editor = lazy(() => import('@monaco-editor/react').then((m) => ({ default: m.Editor })));

const EMPTY_CODE_TASK_DONE: Record<string, boolean> = {};

const SKILLS_FOR_TASK: Record<string, SkillId[]> = {
  'code-bst-contains': ['bst', 'recursion'],
  'code-dynarray-push': ['dyn_structures', 'arrays'],
  'code-stack-pop': ['dyn_structures'],
  'code-queue-enqueue': ['dyn_structures'],
};

const adapter = new BackendAPIAdapter();

export function CodeLabPage() {
  const [taskIdx, setTaskIdx] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const task = CODE_LAB_TASKS[taskIdx]!;
  const [code, setCode] = useState(task.starterCode);
  const [localResult, setLocalResult] = useState<{ passed: boolean; failures: string[] } | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiResult, setAiResult] = useState<EvaluationResult | null>(null);

  const labDone = useLearningStore((s) => s.labProgress?.codeTaskDone ?? EMPTY_CODE_TASK_DONE);
  const markCodeLabTaskDone = useLearningStore((s) => s.markCodeLabTaskDone);
  const applyCompetencySkills = useLearningStore((s) => s.applyCompetencySkills);

  const skills = useMemo(() => SKILLS_FOR_TASK[task.id] ?? ['algo_basics'], [task.id]);

  const switchTask = (i: number) => {
    setTaskIdx(i);
    setStageIdx(0);
    setCode(CODE_LAB_TASKS[i]!.starterCode);
    setLocalResult(null);
    setAiResult(null);
  };

  const runLocal = useCallback(() => {
    const r = runLocalChecks(code, task);
    setLocalResult(r);
    if (r.passed) {
      markCodeLabTaskDone(task.id);
      applyCompetencySkills(skills, 0.88);
    }
  }, [code, task, markCodeLabTaskDone, applyCompetencySkills, skills]);

  const runAi = useCallback(async () => {
    if (code.trim().length < 20) return;
    setAiBusy(true);
    setAiResult(null);
    try {
      const res = await adapter.evaluate({
        exerciseId: `code-lab-${task.id}`,
        question: `${task.title}\n\n${task.story}`,
        modelAnswer: task.referenceSolution,
        userAnswer: code,
        operator: task.operator,
        maxPoints: task.points,
      });
      setAiResult(res);
      if (res.source === 'ai' && res.score >= res.maxScore * 0.65) {
        markCodeLabTaskDone(task.id);
        applyCompetencySkills(skills, Math.min(1, res.score / Math.max(1, res.maxScore)));
      }
    } catch (e) {
      setAiResult({
        score: 0,
        maxScore: task.points,
        feedback: e instanceof Error ? e.message : String(e),
        source: 'local',
      });
    } finally {
      setAiBusy(false);
    }
  }, [code, task, markCodeLabTaskDone, applyCompetencySkills, skills]);

  return (
    <div>
      <PageHeader
        title="Code-Labor"
        subtitle="Java-nah / Pseudocode — lokale Strukturchecks und optionale KI-Rubrik (Server)"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Link to="/lernpfad">
          <Button variant="ghost" size="sm">Lernpfad</Button>
        </Link>
        <Link to="/sql-lab">
          <Button variant="ghost" size="sm">SQL-Labor</Button>
        </Link>
      </div>

      <AlertBox variant="info" className="mb-4" title="Arbeitsweise">
        Gehe die Stufen durch, bearbeite im Editor, dann „Lokale Checks“. Optional: „KI-Bewertung“ mit{' '}
        <code className="text-blue-300">npm run dev:all</code> und Server-.env.
      </AlertBox>

      <div className="flex flex-wrap gap-2 mb-4">
        {CODE_LAB_TASKS.map((t, i) => (
          <Button key={t.id} size="sm" variant={i === taskIdx ? 'primary' : 'secondary'} onClick={() => switchTask(i)}>
            {t.title.slice(0, 28)}
            {labDone[t.id] ? ' ✓' : ''}
          </Button>
        ))}
      </div>

      <Card className="p-5 mb-4">
        <div className="text-[11px] text-slate-500 uppercase mb-2">Stufen</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {task.stages.map((label, i) => (
            <Button key={i} size="sm" variant={i === stageIdx ? 'primary' : 'ghost'} onClick={() => setStageIdx(i)}>
              {i + 1}. {label.slice(0, 40)}
              {label.length > 40 ? '…' : ''}
            </Button>
          ))}
        </div>
        <p className="text-sm text-amber-200/90 mb-4">{task.stages[stageIdx]}</p>

        <h2 className="text-lg font-semibold text-slate-100 mb-1">{task.title}</h2>
        <p className="text-sm text-slate-300 whitespace-pre-line mb-4">{task.story}</p>

        <div className="rounded-lg overflow-hidden border border-slate-700 mb-3" style={{ minHeight: 280 }}>
          <Suspense fallback={<div className="p-4 text-slate-500 text-sm">Editor wird geladen …</div>}>
            <Editor
              key={task.id}
              height="280px"
              defaultLanguage="java"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v ?? '')}
              options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
            />
          </Suspense>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={runLocal}>
            Lokale Checks
          </Button>
          <Button variant="secondary" onClick={runAi} disabled={aiBusy || code.trim().length < 20}>
            {aiBusy ? 'KI …' : 'KI-Bewertung (streng)'}
          </Button>
        </div>
      </Card>

      {localResult && (
        <AlertBox
          variant={localResult.passed ? 'success' : 'warning'}
          title={localResult.passed ? 'Lokale Checks bestanden' : 'Lokale Checks'}
          className="mb-4"
        >
          {localResult.passed ? (
            <p className="text-sm">Struktur passt — du kannst zusätzlich die KI nutzen.</p>
          ) : (
            <ul className="text-sm list-disc pl-5 space-y-1">
              {localResult.failures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
        </AlertBox>
      )}

      {aiResult && (
        <AlertBox variant="info" title="KI / Server" className="mb-4">
          <p className="text-sm whitespace-pre-line">{aiResult.feedback}</p>
          {aiResult.aiRubric && (
            <div className="mt-3 text-xs text-slate-400 space-y-1">
              <div>
                <strong className="text-slate-300">Urteil:</strong> {aiResult.aiRubric.overallVerdict}
              </div>
              {aiResult.aiRubric.sampleFormulation && (
                <div>
                  <strong className="text-slate-300">Muster:</strong> {aiResult.aiRubric.sampleFormulation}
                </div>
              )}
            </div>
          )}
        </AlertBox>
      )}
    </div>
  );
}
