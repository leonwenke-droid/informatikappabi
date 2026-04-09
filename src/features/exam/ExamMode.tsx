import { useState } from 'react';
import { PageHeader } from '../../components/layout/Layout';
import { Card, SectionCard, AlertBox } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTimer } from '../../hooks/useTimer';
import { formatTimer } from '../../utils/countdown';
import { useProgressStore } from '../../store/progressStore';

// Official 2026 exam structure (source: 18_InformatikHinweise2026.pdf)
const BLOCK1_TASKS = [
  {
    id: '1A',
    title: 'Aufgabe 1A',
    topics: 'OOP + BST',
    points: 50,
    description: 'Klassen, Objekte, Attribute, Operationen (Klassendiagramm, Objektkarte). Binärsuchbaum: Einfügen, Traversierung, rekursiver Suchalgorithmus als Struktogramm.',
    hints: [
      'Klassendiagramm: c für Konstruktor, - private, + public',
      'BST: hasLeft/hasRight immer vor getLeft/getRight prüfen',
      'Inorder-Traversierung = aufsteigende Reihenfolge',
      'Struktogramm: Basisfall + Rekursionsschritt nicht vergessen',
    ],
  },
  {
    id: '1B',
    title: 'Aufgabe 1B',
    topics: '2D-Reihung + OOP + Algorithmus',
    points: 50,
    description: 'Zweidimensionale Reihung (Index ab 0!). OOP mit Vererbung. Algorithmus mit geschachtelten Schleifen zur Analyse des 2D-Arrays (Suche, Aggregation).',
    hints: [
      '2D-Reihung: Index ab 0 (offiziell!)',
      'Zugriff: reihung[zeile][spalte]',
      'Geschachtelte Schleifen: äußere = Zeilen, innere = Spalten',
      'Off-by-one vermeiden: bis anzahl-1, nicht bis anzahl',
    ],
  },
] as const;

const BLOCK2_TASKS = [
  {
    id: '2A',
    title: 'Aufgabe 2A',
    topics: 'Kryptologie',
    points: 25,
    description: 'Symmetrisches Verfahren (Transposition und/oder Substitution). Schritte analysieren, implementieren. Sicherheit beurteilen (Häufigkeitsanalyse, Schlüsselraum).',
    hints: [
      'Transposition = umordnen, Substitution = ersetzen',
      'Monoalphabetisch = angreifbar durch Häufigkeitsanalyse',
      'Polyalphabetisch = verschiedene Alphabete je Position',
      'Signatur: privater Schlüssel signiert, öffentlicher prüft',
    ],
  },
  {
    id: '2B',
    title: 'Aufgabe 2B',
    topics: 'Datenbanken & SQL',
    points: 25,
    description: 'ER-Modell entwerfen/ergänzen. Anomalien beschreiben. SQL-Abfragen mit JOIN (über WHERE), GROUP BY, HAVING, Aggregatfunktionen.',
    hints: [
      'Kardinalitäten im ER-Diagramm sind OBLIGATORISCH',
      'JOIN über WHERE, nicht JOIN-Schlüsselwort',
      'HAVING für Aggregat-Bedingungen (nie WHERE)',
      'GROUP BY: alle nicht-aggregierten Spalten einschließen',
    ],
  },
  {
    id: '2C',
    title: 'Aufgabe 2C',
    topics: 'Automaten / Grammatik',
    points: 25,
    description: 'DEA entwerfen oder Kellerautomat. Zustandsgraph mit Endzustand (Doppelkreis), Startzustand (Pfeil). Oder: Grammatik entwerfen, Typ bestimmen, ableiten.',
    hints: [
      'Endzustand = Doppelkreis (nicht vergessen!)',
      'Vollständiger DEA: jeder Zustand × jedes Zeichen hat Übergang',
      'Kellerautomat-Notation: (Kellersymbol, Eingabe): neues_Symbol',
      'Reguläre Grammatik: A→aB oder A→a (Nichtterminal rechts)',
    ],
  },
] as const;

type Phase = 'setup' | 'running' | 'done';

const EXAM_DURATION = 300 * 60; // 300 minutes in seconds

export function ExamMode() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [b1Choice, setB1Choice] = useState<string | null>(null);
  const [b2Choices, setB2Choices] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const { timeLeft, isRunning, start, pause, reset: resetTimer } = useTimer(EXAM_DURATION);
  const { addExamSimulation } = useProgressStore();
  const [startTime, setStartTime] = useState(0);

  const handleStart = () => {
    if (!b1Choice || b2Choices.length !== 2) return;
    setStartTime(Date.now());
    start();
    setPhase('running');
  };

  const handleFinish = () => {
    pause();
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    addExamSimulation({
      id: `exam-${Date.now()}`,
      startedAt: startTime,
      finishedAt: Date.now(),
      block1Choice: b1Choice!,
      block2Choices: b2Choices,
      durationSec: elapsed,
      notes,
    });
    setPhase('done');
  };

  const handleReset = () => {
    resetTimer(EXAM_DURATION);
    setB1Choice(null);
    setB2Choices([]);
    setNotes('');
    setPhase('setup');
  };

  const toggleB2 = (id: string) => {
    if (b2Choices.includes(id)) {
      setB2Choices(b2Choices.filter((x) => x !== id));
    } else if (b2Choices.length < 2) {
      setB2Choices([...b2Choices, id]);
    }
  };

  const urgent = timeLeft < 3600;
  const sel1 = BLOCK1_TASKS.find((t) => t.id === b1Choice);
  const sel2 = BLOCK2_TASKS.filter((t) => b2Choices.includes(t.id));

  // ─── Setup Phase ─────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div>
        <PageHeader
          title="Klausurmodus 2026"
          subtitle="Simulation der offiziellen Prüfungsstruktur · 300 Minuten"
        />

        <AlertBox variant="info" title="Offizielle Prüfungsstruktur (18_InformatikHinweise2026)" className="mb-5">
          Block 1 (50% der BE): 1 aus 2 Aufgaben wählen. Block 2 (50% der BE): 2 aus 3 Aufgaben wählen (je 25%).
          Keine konkrete Programmiersprache in Aufgabenstellungen. Kein Taschenrechner erlaubt.
        </AlertBox>

        {/* Block 1 */}
        <SectionCard
          title="Block 1 — Wähle GENAU 1 Aufgabe (50% der BE)"
          className="mb-5"
        >
          <div className="space-y-3">
            {BLOCK1_TASKS.map((task) => (
              <div
                key={task.id}
                onClick={() => setB1Choice(task.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${b1Choice === task.id
                    ? 'border-emerald-500 bg-emerald-500/8'
                    : 'border-[#1e2d45] bg-white/[0.02] hover:border-emerald-500/30'
                  }`}
              >
                <div
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all
                    ${b1Choice === task.id
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-600 bg-transparent'
                    }`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-bold text-slate-100">{task.title}</span>
                    <span className="text-[12px] text-slate-500">— {task.topics}</span>
                  </div>
                  <p className="text-[12.5px] text-slate-400 leading-relaxed mb-2">{task.description}</p>
                  <span className="text-[11px] font-bold text-emerald-400">{task.points} BE</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Block 2 */}
        <SectionCard
          title="Block 2 — Wähle GENAU 2 Aufgaben (je 25% der BE)"
          className="mb-5"
        >
          <div className="space-y-3">
            {BLOCK2_TASKS.map((task) => {
              const isSel = b2Choices.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => toggleB2(task.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${isSel
                      ? 'border-purple-500 bg-purple-500/8'
                      : b2Choices.length >= 2
                        ? 'border-[#1e2d45] bg-white/[0.01] opacity-50 cursor-not-allowed'
                        : 'border-[#1e2d45] bg-white/[0.02] hover:border-purple-500/30'
                    }`}
                >
                  <div
                    className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 transition-all
                      ${isSel
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-slate-600 bg-transparent'
                      }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] font-bold text-slate-100">{task.title}</span>
                      <span className="text-[12px] text-slate-500">— {task.topics}</span>
                    </div>
                    <p className="text-[12.5px] text-slate-400 leading-relaxed mb-2">{task.description}</p>
                    <span className="text-[11px] font-bold text-purple-400">{task.points} BE</span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            disabled={!b1Choice || b2Choices.length !== 2}
          >
            ⏱ Klausur starten (300 min)
          </Button>
          <span className="text-[13px] text-slate-500">
            Status: {b1Choice ? '✅' : '❌'} Block 1 | Block 2: {b2Choices.length}/2
          </span>
        </div>
      </div>
    );
  }

  // ─── Running Phase ────────────────────────────────────────
  if (phase === 'running') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <PageHeader title="Klausur läuft" subtitle="Fokus! Operatoren beachten." />
          <div className="text-right flex-shrink-0">
            <div
              className="font-mono font-extrabold text-[36px] leading-none"
              style={{ color: urgent ? '#ef4444' : '#f59e0b' }}
            >
              {formatTimer(timeLeft)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {urgent ? '⚠️ Zeit läuft ab!' : 'Verbleibend'}
            </div>
            <button
              onClick={() => isRunning ? pause() : start()}
              className="text-[11px] text-slate-500 hover:text-slate-300 mt-1 cursor-pointer"
            >
              {isRunning ? '⏸ Pause' : '▶ Fortsetzen'}
            </button>
          </div>
        </div>

        {/* Selected tasks */}
        <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl p-4 mb-5">
          <div className="text-[13px] font-bold text-amber-300 mb-3">Deine Aufgabenauswahl</div>
          <div className="flex gap-3 flex-wrap">
            {sel1 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
                <div className="font-bold text-emerald-400 text-[13px]">{sel1.title} (50 BE)</div>
                <div className="text-[11.5px] text-slate-400">{sel1.topics}</div>
              </div>
            )}
            {sel2.map((t) => (
              <div key={t.id} className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-2">
                <div className="font-bold text-purple-400 text-[13px]">{t.title} (25 BE)</div>
                <div className="text-[11.5px] text-slate-400">{t.topics}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <SectionCard title="📋 Klausurtaktik" className="mb-5">
          <ul className="space-y-1.5 text-[13px] text-slate-400">
            <li>• Zuerst alle Aufgaben überfliegen (5–10 min) — Strategie festlegen</li>
            <li>• Block 1 (50 BE): ca. 140–160 min einplanen</li>
            <li>• Block 2 (2×25 BE): je ca. 60–70 min einplanen</li>
            <li>• Nie steckenbleiben — Teilpunkte sichern, weitermachen, zurückkommen</li>
            <li>• <strong className="text-slate-300">Operatoren beachten:</strong> "beschreiben" ≠ "erläutern" ≠ "beurteilen"</li>
            <li>• Struktogramme: Signatur korrekt, Basisfall nicht vergessen</li>
            <li>• SQL: JOIN-Bedingung in WHERE, HAVING für Aggregate</li>
            <li>• Ganzzahldivision: 7/3 = 2 (offiziell!)</li>
          </ul>
        </SectionCard>

        {/* Hints for chosen tasks */}
        {sel1 && (
          <SectionCard title={`Hinweise: ${sel1.title}`} className="mb-4">
            <ul className="space-y-1 text-[12.5px] text-slate-400">
              {sel1.hints.map((h, i) => <li key={i}>• {h}</li>)}
            </ul>
          </SectionCard>
        )}
        {sel2.map((t) => (
          <SectionCard key={t.id} title={`Hinweise: ${t.title}`} className="mb-4">
            <ul className="space-y-1 text-[12.5px] text-slate-400">
              {t.hints.map((h, i) => <li key={i}>• {h}</li>)}
            </ul>
          </SectionCard>
        ))}

        {/* Notes */}
        <SectionCard title="Eigene Notizen" className="mb-5">
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notizen zur Klausur (optional)..."
            className="w-full bg-[#060a14] border border-[#1e2d45] rounded-lg text-slate-200 text-[13px] p-3 resize-y outline-none leading-relaxed focus:border-blue-500"
          />
        </SectionCard>

        <Button variant="danger" size="lg" onClick={() => handleFinish()}>
          Klausur beenden
        </Button>
      </div>
    );
  }

  // ─── Done Phase ───────────────────────────────────────────
  return (
    <div>
      <PageHeader title="Klausur beendet" />
      <AlertBox variant="success" title="✅ Klausurmodus abgeschlossen!" className="mb-5">
        Analysiere jetzt deine Schwachstellen. Welche Themen waren schwierig?
        Nutze das Fehlerlogbuch und die Übungsaufgaben für gezielte Nacharbeit.
      </AlertBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {sel1 && (
          <Card className="p-4">
            <div className="text-[13px] font-bold text-emerald-400 mb-1">{sel1.title}</div>
            <div className="text-[12px] text-slate-400">{sel1.topics}</div>
          </Card>
        )}
        {sel2.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="text-[13px] font-bold text-purple-400 mb-1">{t.title}</div>
            <div className="text-[12px] text-slate-400">{t.topics}</div>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="primary" onClick={handleReset}>
          Neue Klausur starten
        </Button>
      </div>
    </div>
  );
}
