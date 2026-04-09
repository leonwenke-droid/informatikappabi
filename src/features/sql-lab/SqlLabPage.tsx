import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Database } from 'sql.js';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { Card, AlertBox } from '../../components/ui/Card';
import { useLearningStore } from '../../store/learningStore';
import { loadSqlJs } from './initSql';
import { compareGrids, diagLabel, gridFromSelect, type SqlLabDiag } from './compareResults';
import { SQL_LAB_TASKS } from './tasks';

const EMPTY_SQL_TASK_DONE: Record<string, boolean> = {};

function runInit(db: Database, initSql: string): void {
  db.exec(initSql.trim());
}

export function SqlLabPage() {
  const [sqlMod, setSqlMod] = useState<Awaited<ReturnType<typeof loadSqlJs>> | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [taskIdx, setTaskIdx] = useState(0);
  const [query, setQuery] = useState('');
  const [lastDiag, setLastDiag] = useState<SqlLabDiag | null>(null);
  const [preview, setPreview] = useState<{ cols: string[]; rows: unknown[][] } | null>(null);

  const labProgress = useLearningStore((s) => s.labProgress?.sqlTaskDone ?? EMPTY_SQL_TASK_DONE);
  const markSqlLabTaskDone = useLearningStore((s) => s.markSqlLabTaskDone);
  const applyCompetencySkills = useLearningStore((s) => s.applyCompetencySkills);

  const task = SQL_LAB_TASKS[taskIdx]!;

  useEffect(() => {
    loadSqlJs()
      .then(setSqlMod)
      .catch((e) => setLoadErr(e instanceof Error ? e.message : String(e)));
  }, []);

  const selectTask = (i: number) => {
    setTaskIdx(i);
    setQuery('');
    setLastDiag(null);
    setPreview(null);
  };

  const runUserQuery = useCallback(() => {
    if (!sqlMod) return;
    setLastDiag(null);
    setPreview(null);

    const dbUser = new sqlMod.Database();
    try {
      runInit(dbUser, task.initSql);
    } catch (e) {
      setLastDiag({ kind: 'parser', message: `Init-Schema: ${e instanceof Error ? e.message : String(e)}` });
      dbUser.close();
      return;
    }

    const userGrid = gridFromSelect(dbUser, query);
    if ('kind' in userGrid) {
      setLastDiag(userGrid);
      dbUser.close();
      return;
    }

    if (userGrid.rows.length === 0 && task.solutionSql.trim().length > 0) {
      const dbCheck = new sqlMod.Database();
      runInit(dbCheck, task.initSql);
      const solProbe = gridFromSelect(dbCheck, task.solutionSql);
      dbCheck.close();
      if (!('kind' in solProbe) && solProbe.rows.length > 0) {
        setLastDiag({ kind: 'empty', message: 'Dein Ergebnis ist leer, die Musterlösung liefert jedoch Zeilen.' });
        dbUser.close();
        return;
      }
    }

    setPreview(userGrid);

    const dbSol = new sqlMod.Database();
    runInit(dbSol, task.initSql);
    const expGrid = gridFromSelect(dbSol, task.solutionSql);
    dbSol.close();
    dbUser.close();

    if ('kind' in expGrid) {
      setLastDiag(expGrid);
      return;
    }

    const cmp = compareGrids(expGrid, userGrid, task.compareMode);
    setLastDiag(cmp);
    if (cmp.kind === 'match') {
      markSqlLabTaskDone(task.id);
      applyCompetencySkills(['sql'], 0.92);
    }
  }, [sqlMod, task, query, markSqlLabTaskDone, applyCompetencySkills]);

  const chapters = useMemo(() => {
    const m = new Map<string, number>();
    SQL_LAB_TASKS.forEach((t, i) => m.set(t.chapter, i));
    return [...m.keys()];
  }, []);

  if (loadErr) {
    return (
      <div>
        <PageHeader title="SQL-Labor" subtitle="sql.js konnte nicht geladen werden" />
        <AlertBox variant="warning" title="Fehler">
          {loadErr}
        </AlertBox>
      </div>
    );
  }

  if (!sqlMod) {
    return (
      <div>
        <PageHeader title="SQL-Labor" subtitle="SQLite im Browser wird geladen …" />
        <p className="text-slate-500 text-sm">Bitte kurz warten.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="SQL-Labor"
        subtitle="Mini-Schemas, Ausführung im Browser, Vergleich mit Musterresultat — offizieller SQL-Umfang"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <Link to="/sql">
          <Button variant="ghost" size="sm">SQL-Referenz</Button>
        </Link>
        <Link to="/ueben">
          <Button variant="ghost" size="sm">Geführte Übungen</Button>
        </Link>
      </div>

      <AlertBox variant="info" className="mb-4" title="Hinweis">
        Es läuft eine isolierte Demo-Datenbank pro Aufgabe. Nur SELECT (optional WITH) ist für die Bewertung vorgesehen.
      </AlertBox>

      <div className="flex flex-wrap gap-2 mb-4">
        {SQL_LAB_TASKS.map((t, i) => (
          <Button
            key={t.id}
            size="sm"
            variant={i === taskIdx ? 'primary' : 'secondary'}
            onClick={() => selectTask(i)}
          >
            {i + 1}. {t.chapter}
            {labProgress[t.id] ? ' ✓' : ''}
          </Button>
        ))}
      </div>

      <Card className="p-5 mb-4">
        <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">{task.chapter}</div>
        <h2 className="text-lg font-semibold text-slate-100 mb-2">{task.title}</h2>
        <p className="text-sm text-slate-300 whitespace-pre-line mb-4">{task.prompt}</p>

        <details className="mb-4 group">
          <summary className="text-sm text-amber-400 cursor-pointer">Geführte Schritte</summary>
          <ul className="mt-2 space-y-2 text-sm text-slate-400">
            {task.guidedQuestions.map((g, idx) => (
              <li key={idx}>
                <strong className="text-slate-300">{g.q}</strong>
                <span className="block text-slate-500 mt-0.5">Tipp: {g.hint}</span>
              </li>
            ))}
          </ul>
        </details>

        <label className="block text-xs text-slate-500 mb-1">Deine Abfrage</label>
        <textarea
          className="w-full min-h-[140px] rounded-lg bg-[#0a0f18] border border-slate-600 p-3 text-sm font-mono text-slate-200"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
          placeholder="SELECT ..."
        />
        <div className="mt-3 flex gap-2">
          <Button variant="primary" onClick={runUserQuery} disabled={!query.trim()}>
            Ausführen & vergleichen
          </Button>
        </div>
      </Card>

      {lastDiag && (
        <AlertBox
          variant={lastDiag.kind === 'match' ? 'success' : 'warning'}
          title={lastDiag.kind === 'match' ? 'Treffer' : 'Auswertung'}
          className="mb-4"
        >
          {diagLabel(lastDiag)}
        </AlertBox>
      )}

      {preview && preview.cols.length > 0 && (
        <Card className="p-4 overflow-x-auto">
          <div className="text-xs text-slate-500 mb-2">Vorschau deines Resultats</div>
          <table className="text-sm text-slate-200 border-collapse">
            <thead>
              <tr>
                {preview.cols.map((c) => (
                  <th key={c} className="border border-slate-600 px-2 py-1 text-left bg-slate-800/80">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-slate-700 px-2 py-1 font-mono text-xs">
                      {cell === null ? 'NULL' : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <p className="text-[11px] text-slate-600 mt-6">
        Kapitel-Reihenfolge: {chapters.join(' → ')}
      </p>
    </div>
  );
}
