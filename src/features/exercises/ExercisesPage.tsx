import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/Layout';
import { Card, AlertBox } from '../../components/ui/Card';
import { DifficultyBadge, SourceBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EXERCISES } from '../../data/exercises';
import { TOPICS } from '../../data/topics';
import { useProgressStore } from '../../store/progressStore';
import { evaluateExercise } from '../../lib/evaluator/localEvaluator';
import { BackendAPIAdapter } from '../../lib/evaluator/aiEvaluatorAdapter';
import type { EvaluationResult, Exercise } from '../../types';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

type FilterTopic = 'all' | 'review' | 'beginner' | 'no_exam' | string;

export function ExercisesPage() {
  const [searchParams] = useSearchParams();
  const topicFilter = searchParams.get('topic') ?? 'all';
  const reviewMode = searchParams.get('review') === '1';
  const poolFilter = searchParams.get('filter');
  const targetExerciseId = searchParams.get('exercise');

  const [filter, setFilter] = useState<FilterTopic>(() => {
    if (reviewMode) return 'review';
    if (poolFilter === 'beginner' || poolFilter === 'no_exam') return poolFilter;
    return topicFilter;
  });
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [mcSelected, setMcSelected] = useState<number[]>([]);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [aiEval, setAiEval] = useState<EvaluationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  const { recordExerciseResult, addMistake, getTopicProgress } = useProgressStore();

  const dueExerciseIds = useProgressStore((s) => {
    const now = Date.now();
    return s.exerciseResults
      .filter((r) => r.nextReviewAt !== undefined && r.nextReviewAt <= now)
      .map((r) => r.exerciseId)
      .sort()
      .join(',');
  });
  const dueIds = useMemo(
    () => new Set(dueExerciseIds ? dueExerciseIds.split(',').filter(Boolean) : []),
    [dueExerciseIds]
  );

  const filteredExercises = useMemo(() => {
    if (filter === 'review') return EXERCISES.filter((e) => dueIds.has(e.id));
    if (filter === 'beginner') {
      return EXERCISES.filter((e) => e.track === 'mini' || (!e.track && e.difficulty === 1));
    }
    if (filter === 'no_exam') {
      return EXERCISES.filter((e) => e.track !== 'examStyle' && e.difficulty < 3);
    }
    if (filter === 'all') return EXERCISES;
    return EXERCISES.filter((e) => e.topicId === filter);
  }, [filter, dueIds]);

  const exercise = filteredExercises[idx] ?? filteredExercises[0];
  const topic = exercise ? TOPICS.find((t) => t.id === exercise.topicId) : null;

  useEffect(() => {
    if (!targetExerciseId) return;
    const i = filteredExercises.findIndex((e) => e.id === targetExerciseId);
    if (i >= 0) {
      // Deep-Link ?exercise= auf Index im gefilterten Pool
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIdx(i);
    }
  }, [targetExerciseId, filteredExercises]);

  const reset = () => {
    setAnswer('');
    setMcSelected([]);
    setResult(null);
    setAiEval(null);
  };

  const goNext = () => {
    setIdx((i) => (i + 1) % filteredExercises.length);
    reset();
  };

  const goPrev = () => {
    setIdx((i) => (i - 1 + filteredExercises.length) % filteredExercises.length);
    reset();
  };

  const handleCheck = () => {
    if (!exercise) return;
    setIsChecking(true);

    const evalResult = evaluateExercise(exercise, answer, mcSelected);
    setResult(evalResult);

    // Record to progress
    recordExerciseResult({
      exerciseId: exercise.id,
      topicId: exercise.topicId,
      score: evalResult.score,
      maxScore: evalResult.maxScore,
      timestamp: Date.now(),
    });

    // Add to mistake log if score is low
    if (evalResult.score < evalResult.maxScore * 0.6) {
      addMistake({
        exerciseId: exercise.id,
        topicId: exercise.topicId,
        question: exercise.question,
        userAnswer: exercise.type === 'mc' ? `Ausgewählt: ${mcSelected.join(', ')}` : answer,
        modelAnswer: exercise.modelAnswer ?? '',
        feedback: evalResult.feedback,
        reviewed: false,
        misconceptionIds: evalResult.misconceptionIds,
      });
    }

    setIsChecking(false);
  };

  const handleAiEvaluate = async () => {
    if (!exercise || exercise.type === 'mc' || exercise.type === 'sc') return;
    if (answer.trim().length < 15) return;
    setAiBusy(true);
    const adapter = new BackendAPIAdapter();
    const r = await adapter.evaluate({
      exerciseId: exercise.id,
      question: exercise.question,
      modelAnswer: exercise.modelAnswer ?? '',
      userAnswer: answer,
      operator: exercise.operator,
      maxPoints: exercise.points,
    });
    setAiEval(r);
    setAiBusy(false);
  };

  const canCheck =
    !result &&
    ((exercise?.type === 'mc' || exercise?.type === 'sc') ? mcSelected.length > 0 : answer.trim().length > 10);

  const tp = exercise ? getTopicProgress(exercise.topicId) : null;

  return (
    <div>
      <PageHeader
        title="Aufgaben üben"
        subtitle="Klausurnahe Aufgaben mit regelbasierter Sofortbewertung"
      />

      <AlertBox variant="info" className="mb-5">
        <strong>Bewertungshinweis:</strong> Die automatische Bewertung prüft Schlüsselbegriffe und Struktur.
        Bei Text-/Code-Aufgaben immer die Musterlösung vergleichen. Optional: <strong>KI-Feedback</strong> über den lokalen Server (<code className="text-blue-300">npm run dev:all</code>, <code className="text-blue-300">OPENAI_API_KEY</code> in <code className="text-blue-300">.env</code>).
      </AlertBox>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => { setFilter('all'); setIdx(0); reset(); }}
        >
          Alle ({EXERCISES.length})
        </Button>
        <Button
          variant={filter === 'review' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => { setFilter('review'); setIdx(0); reset(); }}
          className={dueIds.size > 0 ? 'border-amber-500/60' : ''}
        >
          🔁 Zur Wiederholung
          {dueIds.size > 0 && (
            <span className="ml-1.5 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {dueIds.size}
            </span>
          )}
        </Button>
        <Button
          variant={filter === 'beginner' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => { setFilter('beginner'); setIdx(0); reset(); }}
        >
          Nur Mini / Einstieg
        </Button>
        <Button
          variant={filter === 'no_exam' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => { setFilter('no_exam'); setIdx(0); reset(); }}
        >
          Ohne klausurnah
        </Button>
        {TOPICS.map((t) => {
          const count = EXERCISES.filter((e) => e.topicId === t.id).length;
          if (count === 0) return null;
          const tpData = getTopicProgress(t.id);
          const completed = tpData.completedExercises.length;
          return (
            <Button
              key={t.id}
              variant={filter === t.id ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => { setFilter(t.id); setIdx(0); reset(); }}
            >
              {t.icon} {t.title.split(' ')[0]}
              <span className="ml-1 opacity-60 text-[10px]">
                {completed > 0 ? `${completed}/` : ''}{count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Navigation + counter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={goPrev} disabled={filteredExercises.length <= 1}>
            <ChevronLeft size={16} />
          </Button>
          <span className="text-[13px] text-slate-400 font-mono">
            {idx + 1} / {filteredExercises.length}
          </span>
          <Button variant="ghost" size="sm" onClick={goNext} disabled={filteredExercises.length <= 1}>
            <ChevronRight size={16} />
          </Button>
        </div>
        {result && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw size={14} /> Nochmal
          </Button>
        )}
      </div>

      {filter === 'review' && filteredExercises.length === 0 && (
        <Card className="p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <div className="text-base font-semibold text-slate-200 mb-1">Keine Aufgaben zur Wiederholung fällig</div>
          <div className="text-sm text-slate-500">
            Super! Alle Aufgaben sind aktuell. Löse mehr Aufgaben, um die Wiederholungsfunktion zu aktivieren.
          </div>
        </Card>
      )}

      {exercise && (
        <Card className="p-5">
          {/* Exercise header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {topic && <span className="text-[22px]">{topic.icon}</span>}
              <div>
                <div className="text-[14px] font-bold text-slate-100">{topic?.title}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wide">
                    Operator: {exercise.operator}
                  </span>
                  <span className="text-[11px] text-slate-500">{exercise.points} BE</span>
                  <DifficultyBadge level={exercise.difficulty} />
                  <SourceBadge source={exercise.source} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {dueIds.has(exercise.id) && (
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-1 rounded font-semibold">
                  🔁 Zur Wiederholung fällig
                </span>
              )}
              {tp && tp.completedExercises.includes(exercise.id) && (
                <span className="text-[11px] bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded">
                  ✓ Bereits gelöst
                </span>
              )}
            </div>
          </div>

          {/* Question */}
          <div className="bg-black/25 rounded-lg p-4 mb-5 whitespace-pre-line text-[14px] text-slate-200 leading-relaxed">
            {exercise.question}
          </div>

          {/* Input */}
          {(exercise.type === 'mc' || exercise.type === 'sc') ? (
            <MCInput
              exercise={exercise}
              selected={mcSelected}
              onChange={setMcSelected}
              revealed={result !== null}
            />
          ) : (
            <div>
              <label className="block text-[12.5px] text-slate-500 mb-1.5 font-medium">
                Deine Antwort:
                {exercise.type === 'sql' && ' (SQL-Abfrage)'}
                {exercise.type === 'code' && ' (Struktogramm / Pseudocode)'}
              </label>
              <textarea
                rows={exercise.type === 'sql' ? 7 : 9}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!!result}
                placeholder={
                  exercise.type === 'sql'
                    ? 'SELECT ...\nFROM ...\nWHERE ...'
                    : 'Antwort, Erläuterung, Struktogramm oder Pseudocode hier eingeben...'
                }
                className="w-full bg-[#060a14] border border-[#1e2d45] rounded-lg text-slate-200 font-mono text-[13px] p-3 resize-y outline-none leading-relaxed focus:border-blue-500 transition-colors disabled:opacity-60"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            {!result && (
              <Button
                variant="primary"
                size="md"
                onClick={handleCheck}
                disabled={!canCheck || isChecking}
              >
                {isChecking ? '⏳ Prüfe...' : '✅ Antwort prüfen'}
              </Button>
            )}
            {exercise &&
              (exercise.type === 'text' || exercise.type === 'sql' || exercise.type === 'code') &&
              answer.trim().length >= 15 && (
                <Button variant="secondary" size="md" onClick={handleAiEvaluate} disabled={aiBusy}>
                  {aiBusy ? '⏳ KI …' : 'KI-Bewertung (streng)'}
                </Button>
              )}
            {result && (
              <Button variant="secondary" onClick={goNext}>
                Nächste Aufgabe <ChevronRight size={14} />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={goPrev}>
              <ChevronLeft size={14} /> Zurück
            </Button>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-5">
              <ScoreDisplay score={result.score} maxScore={result.maxScore} />
              <div
                className={`mt-3 border rounded-xl p-4 text-[13px] leading-relaxed whitespace-pre-wrap
                  ${result.score >= result.maxScore * 0.7
                    ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-200'
                    : result.score > 0
                      ? 'border-amber-500/30 bg-amber-500/[0.06] text-amber-200'
                      : 'border-red-500/30 bg-red-500/[0.06] text-red-200'
                  }`}
              >
                {result.feedback}
              </div>
            </div>
          )}
          {aiEval && (
            <div className="mt-5 border border-violet-500/30 rounded-xl p-4 bg-violet-950/20">
              <div className="text-[11px] font-bold text-violet-300 uppercase mb-2">
                KI-Rückmeldung {aiEval.source === 'local' ? '(Server nicht erreichbar — Fallback)' : ''}
              </div>
              {aiEval.source === 'ai' && aiEval.aiRubric && (
                <ul className="text-[12px] text-slate-300 space-y-2 mb-3">
                  <li><span className="text-slate-500">Gesamt:</span> {aiEval.aiRubric.overallVerdict}</li>
                  <li><span className="text-slate-500">Fachlich:</span> {aiEval.aiRubric.factualCorrectness}</li>
                  <li><span className="text-slate-500">Operator:</span> {aiEval.aiRubric.operatorFit}</li>
                  {aiEval.aiRubric.strengths.length > 0 && (
                    <li><span className="text-slate-500">Stärken:</span> {aiEval.aiRubric.strengths.join('; ')}</li>
                  )}
                  {aiEval.aiRubric.weaknesses.length > 0 && (
                    <li><span className="text-slate-500">Schwächen:</span> {aiEval.aiRubric.weaknesses.join('; ')}</li>
                  )}
                  {aiEval.aiRubric.sampleFormulation && (
                    <li className="text-emerald-300/90"><span className="text-slate-500">Muster:</span> {aiEval.aiRubric.sampleFormulation}</li>
                  )}
                </ul>
              )}
              <div className="text-[13px] text-slate-200 whitespace-pre-wrap">{aiEval.feedback}</div>
              {aiEval.source === 'ai' && (
                <div className="text-[11px] text-slate-500 mt-2">Geschätzte Punkte (KI): {aiEval.score} / {aiEval.maxScore}</div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

interface MCInputProps {
  exercise: Exercise;
  selected: number[];
  onChange: (selected: number[]) => void;
  revealed: boolean;
}

function MCInput({ exercise, selected, onChange, revealed }: MCInputProps) {
  const opts = exercise.options ?? [];

  const toggle = (id: number) => {
    if (revealed) return;
    if (exercise.type === 'sc') {
      onChange([id]);
    } else {
      const next = selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id];
      onChange(next);
    }
  };

  return (
    <div>
      <div className="text-[12px] text-slate-500 mb-2">
        {exercise.type === 'sc' ? 'Wähle eine Antwort:' : 'Mehrfachauswahl möglich:'}
      </div>
      <div className="space-y-2">
        {opts.map((opt) => {
          const isSel = selected.includes(opt.id);
          const isCorrect = exercise.correctOptions?.includes(opt.id);
          let bg = 'bg-white/[0.02] border-white/[0.07]';
          let textColor = 'text-slate-200';

          if (revealed) {
            if (isCorrect) { bg = 'bg-emerald-500/10 border-emerald-500/40'; textColor = 'text-emerald-200'; }
            else if (isSel && !isCorrect) { bg = 'bg-red-500/10 border-red-500/40'; textColor = 'text-red-200'; }
          } else if (isSel) {
            bg = 'bg-blue-500/10 border-blue-500/40';
            textColor = 'text-blue-100';
          }

          return (
            <div
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-150 ${bg} ${!revealed ? 'cursor-pointer hover:bg-white/[0.05]' : ''}`}
            >
              <div
                className={`mt-0.5 flex-shrink-0 w-[17px] h-[17px] rounded flex items-center justify-center border-2 transition-all
                  ${exercise.type === 'sc' ? 'rounded-full' : 'rounded'}
                  ${isSel ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-transparent'}
                `}
              >
                {isSel && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <span className={`text-[13.5px] leading-relaxed ${textColor}`}>{opt.text}</span>
              {revealed && isCorrect && (
                <span className="ml-auto text-emerald-400 flex-shrink-0">✓</span>
              )}
              {revealed && isSel && !isCorrect && (
                <span className="ml-auto text-red-400 flex-shrink-0">✗</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
}

function ScoreDisplay({ score, maxScore }: ScoreDisplayProps) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
  const label = pct >= 70 ? 'Gut!' : pct >= 40 ? 'Teilweise' : 'Verbesserungsbedarf';

  return (
    <div className="flex items-center gap-4 bg-black/30 rounded-lg p-3">
      <div className="text-center">
        <div className="font-mono font-extrabold text-[32px] leading-none" style={{ color }}>
          {score}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">von {maxScore} BE</div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-[12px] mb-1">
          <span style={{ color }}>{label}</span>
          <span className="text-slate-500">{Math.round(pct)}%</span>
        </div>
        <div className="h-2 bg-[#1e2d45] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}
