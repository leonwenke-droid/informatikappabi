import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// A production rule: leftSide → array of alternatives
interface Rule {
  from: string;
  to: string; // one alternative
}

interface Grammar {
  name: string;
  description: string;
  N: string[];
  T: string[];
  S: string;
  rules: Rule[];
}

const GRAMMARS: Grammar[] = [
  {
    name: 'G₁: aⁿbⁿ (kontextfrei)',
    description: 'Erzeugt alle Wörter der Form aⁿbⁿ mit n ≥ 1. Kontextfrei, aber nicht regulär.',
    N: ['S'],
    T: ['a', 'b'],
    S: 'S',
    rules: [
      { from: 'S', to: 'aSb' },
      { from: 'S', to: 'ab' },
    ],
  },
  {
    name: 'G₂: regulär — (ab)*',
    description: 'Erzeugt beliebig oft wiederholte Paare "ab": ε, ab, abab, ababab, …',
    N: ['S', 'B'],
    T: ['a', 'b'],
    S: 'S',
    rules: [
      { from: 'S', to: 'aB' },
      { from: 'S', to: 'ε' },
      { from: 'B', to: 'bS' },
    ],
  },
  {
    name: 'G₃: a*b+ (regulär)',
    description: 'Erzeugt beliebig viele a gefolgt von mindestens einem b.',
    N: ['S', 'A'],
    T: ['a', 'b'],
    S: 'S',
    rules: [
      { from: 'S', to: 'aS' },
      { from: 'S', to: 'A' },
      { from: 'A', to: 'bA' },
      { from: 'A', to: 'b' },
    ],
  },
];

interface DerivationStep {
  sententialForm: string;
  appliedRule: string;
  highlight: { pos: number; len: number } | null;
}

function applyRule(sententialForm: string, nonTerminal: string, production: string): string {
  const idx = sententialForm.indexOf(nonTerminal);
  if (idx === -1) return sententialForm;
  return sententialForm.slice(0, idx) + production + sententialForm.slice(idx + nonTerminal.length);
}

function findNonTerminals(form: string, N: string[]): { symbol: string; pos: number }[] {
  const results: { symbol: string; pos: number }[] = [];
  // Find longest matches first to handle multi-char NTs
  const sorted = [...N].sort((a, b) => b.length - a.length);
  const visited = new Set<number>();
  for (let i = 0; i < form.length; i++) {
    if (visited.has(i)) continue;
    for (const nt of sorted) {
      if (form.slice(i, i + nt.length) === nt) {
        results.push({ symbol: nt, pos: i });
        for (let j = i; j < i + nt.length; j++) visited.add(j);
        break;
      }
    }
  }
  return results;
}

function isTerminal(form: string, N: string[]): boolean {
  return findNonTerminals(form, N).length === 0;
}

function renderSententialForm(form: string, N: string[], highlight: { pos: number; len: number } | null) {
  const chars = form.split('');
  const ntSet = new Set(N);

  // Mark positions that belong to non-terminals
  const ntPositions = new Map<number, { symbol: string; end: number }>();
  const sorted = [...N].sort((a, b) => b.length - a.length);
  const visited = new Set<number>();
  for (let i = 0; i < form.length; i++) {
    if (visited.has(i)) continue;
    for (const nt of sorted) {
      if (form.slice(i, i + nt.length) === nt) {
        ntPositions.set(i, { symbol: nt, end: i + nt.length });
        for (let j = i; j < i + nt.length; j++) visited.add(j);
        break;
      }
    }
  }

  const spans: React.ReactNode[] = [];
  let i = 0;
  while (i < form.length) {
    if (ntPositions.has(i)) {
      const { symbol, end } = ntPositions.get(i)!;
      const isHighlighted = highlight && i === highlight.pos && symbol.length === highlight.len;
      spans.push(
        <span
          key={i}
          className={`font-bold px-0.5 rounded ${
            isHighlighted
              ? 'bg-yellow-500 text-black'
              : 'text-blue-300 bg-blue-900/30'
          }`}
        >
          {symbol}
        </span>
      );
      i = end;
    } else {
      const ch = chars[i];
      spans.push(
        <span key={i} className={ntSet.has(ch) ? 'text-blue-300' : 'text-green-300'}>
          {ch === 'ε' ? <em className="text-slate-400">ε</em> : ch}
        </span>
      );
      i++;
    }
  }
  return spans;
}

export function GrammarSimulator() {
  const [selectedGrammarIdx, setSelectedGrammarIdx] = useState(0);
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [derivation, setDerivation] = useState<DerivationStep[]>([
    { sententialForm: GRAMMARS[0].S, appliedRule: 'Start', highlight: null },
  ]);
  const [autoInput, setAutoInput] = useState('aabb');
  const [autoError, setAutoError] = useState('');

  const grammar = GRAMMARS[selectedGrammarIdx];
  const currentForm = derivation[derivation.length - 1].sententialForm;
  const nonTerminalsInCurrent = findNonTerminals(currentForm, grammar.N);
  const isDone = isTerminal(currentForm, grammar.N);

  const switchGrammar = (idx: number) => {
    setSelectedGrammarIdx(idx);
    setDerivation([{ sententialForm: GRAMMARS[idx].S, appliedRule: 'Start', highlight: null }]);
    setAutoError('');
  };

  const applyManualRule = (rule: Rule) => {
    if (isDone) return;
    const idx = currentForm.indexOf(rule.from);
    if (idx === -1) return;
    const newForm = applyRule(currentForm, rule.from, rule.to);
    setDerivation([
      ...derivation,
      {
        sententialForm: newForm,
        appliedRule: `${rule.from} → ${rule.to}`,
        highlight: { pos: idx, len: rule.from.length },
      },
    ]);
  };

  const reset = () => {
    setDerivation([{ sententialForm: grammar.S, appliedRule: 'Start', highlight: null }]);
    setAutoError('');
  };

  const undo = () => {
    if (derivation.length > 1) {
      setDerivation(derivation.slice(0, -1));
    }
  };

  // Auto-derive: BFS to find leftmost derivation for target word
  const autoderive = () => {
    const target = autoInput.trim();
    if (!target) return;

    // BFS / iterative deepening up to depth 20
    const MAX_STEPS = 30;
    type State = { form: string; steps: DerivationStep[] };
    const queue: State[] = [
      { form: grammar.S, steps: [{ sententialForm: grammar.S, appliedRule: 'Start', highlight: null }] },
    ];
    const visited = new Set<string>([grammar.S]);

    while (queue.length > 0) {
      const { form, steps } = queue.shift()!;
      if (steps.length > MAX_STEPS) continue;

      if (form === target && isTerminal(form, grammar.N)) {
        setDerivation(steps);
        setAutoError('');
        return;
      }

      // Find first non-terminal (leftmost derivation)
      const nts = findNonTerminals(form, grammar.N);
      if (nts.length === 0) continue; // terminal but not target

      const { symbol, pos } = nts[0];
      const applicableRules = grammar.rules.filter((r) => r.from === symbol);

      for (const rule of applicableRules) {
        const newForm = applyRule(form, symbol, rule.to === 'ε' ? '' : rule.to);
        if (!visited.has(newForm) && newForm.length <= target.length + 3) {
          visited.add(newForm);
          queue.push({
            form: newForm,
            steps: [
              ...steps,
              {
                sententialForm: newForm,
                appliedRule: `${rule.from} → ${rule.to}`,
                highlight: { pos, len: symbol.length },
              },
            ],
          });
        }
      }
    }

    setAutoError(`"${target}" kann nicht aus dieser Grammatik abgeleitet werden (oder zu viele Schritte).`);
  };

  // Applicable rules for current non-terminals
  const applicableRules = grammar.rules.filter((r) =>
    nonTerminalsInCurrent.some((nt) => nt.symbol === r.from)
  );

  return (
    <div className="space-y-6">
      {/* Theory */}
      <Card className="bg-indigo-950/50 border-indigo-800/50">
        <h3 className="text-base font-semibold text-indigo-300 mb-2">Formale Grammatiken — Theorie</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p>
            Eine formale Grammatik <strong className="text-white">G = (N, T, S, P)</strong> besteht aus:
            Nichtterminalen N, Terminalen T, Startsymbol S und Produktionsregeln P.
          </p>
          <p>
            Eine <strong className="text-yellow-300">Ableitung</strong> ersetzt schrittweise Nichtterminale durch rechte Seiten
            der Regeln, bis nur noch Terminale übrig bleiben.
          </p>
          <div className="flex gap-4 text-xs mt-2">
            <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded">Blaue Symbole = Nichtterminale</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded">Grüne Symbole = Terminale</span>
            <span className="bg-yellow-500 text-black px-2 py-1 rounded">Gelb = angewandte Regel</span>
          </div>
        </div>
      </Card>

      {/* Grammar selector */}
      <div className="flex flex-wrap gap-2">
        {GRAMMARS.map((g, i) => (
          <button
            key={i}
            onClick={() => switchGrammar(i)}
            className={`px-3 py-2 rounded text-sm font-medium border transition-colors ${
              selectedGrammarIdx === i
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Grammar definition */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Grammatik-Definition</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm font-mono mb-3">
          <div className="bg-slate-800/50 rounded p-3">
            <div className="text-xs text-slate-500 mb-1">N (Nichtterminale)</div>
            <div className="text-blue-300 font-bold">{'{ ' + grammar.N.join(', ') + ' }'}</div>
          </div>
          <div className="bg-slate-800/50 rounded p-3">
            <div className="text-xs text-slate-500 mb-1">T (Terminale)</div>
            <div className="text-green-300 font-bold">{'{ ' + grammar.T.join(', ') + ' }'}</div>
          </div>
          <div className="bg-slate-800/50 rounded p-3">
            <div className="text-xs text-slate-500 mb-1">S (Startsymbol)</div>
            <div className="text-yellow-300 font-bold">{grammar.S}</div>
          </div>
          <div className="bg-slate-800/50 rounded p-3">
            <div className="text-xs text-slate-500 mb-1">Typ</div>
            <div className="text-purple-300 font-bold">
              {grammar.N.length === 1 && grammar.rules.every(r => /^[A-Z][A-Z]*$/.test(r.from) && (/^[a-z][A-Z]$|^[a-z]$|^ε$/.test(r.to)))
                ? 'Typ 3 (regulär)' : 'Typ 2 (kontextfrei)'}
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-3">
          <div className="text-xs text-slate-500 mb-2">P (Produktionsregeln)</div>
          <div className="space-y-1">
            {grammar.rules.map((r, i) => (
              <div key={i} className="font-mono text-sm">
                <span className="text-blue-300">{r.from}</span>
                <span className="text-slate-400"> → </span>
                <span className="text-slate-200">{r.to === 'ε' ? <em className="text-slate-500">ε</em> : r.to}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">{grammar.description}</p>
      </Card>

      {/* Mode selector */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('manual'); reset(); }}
          className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
            mode === 'manual'
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500'
          }`}
        >
          Manuell ableiten
        </button>
        <button
          onClick={() => { setMode('auto'); reset(); }}
          className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
            mode === 'auto'
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500'
          }`}
        >
          Automatisch ableiten
        </button>
      </div>

      {/* Current sentential form */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">Aktuelle Zeichenkettenform</h3>
          <div className="flex gap-2">
            <Button onClick={undo} variant="ghost" disabled={derivation.length <= 1}>↩ Zurück</Button>
            <Button onClick={reset} variant="ghost">Reset</Button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4 text-2xl font-mono text-center min-h-[3rem] flex items-center justify-center gap-0.5 flex-wrap">
          {renderSententialForm(
            currentForm || 'ε',
            grammar.N,
            derivation[derivation.length - 1].highlight
          )}
        </div>

        {isDone && (
          <div className="mt-3 text-center">
            <span className="inline-block bg-green-900/50 border border-green-600 text-green-300 px-4 py-2 rounded-lg text-sm font-medium">
              ✓ Terminales Wort — Ableitung vollständig
            </span>
          </div>
        )}
      </Card>

      {/* Manual: applicable rules */}
      {mode === 'manual' && !isDone && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Anwendbare Regeln</h3>
          {applicableRules.length === 0 ? (
            <p className="text-slate-500 text-sm">Keine Regeln anwendbar (Ableitung vollständig oder Fehler).</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {applicableRules.map((rule, i) => (
                <button
                  key={i}
                  onClick={() => applyManualRule(rule)}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 hover:border-indigo-500 hover:bg-indigo-900/30 rounded text-sm font-mono transition-colors text-slate-200"
                >
                  <span className="text-blue-300">{rule.from}</span>
                  <span className="text-slate-400"> → </span>
                  <span className="text-green-300">{rule.to}</span>
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500 mt-3">
            Klicke auf eine Regel, um das erste Vorkommen des Nichtterminals zu ersetzen.
          </p>
        </Card>
      )}

      {/* Auto mode */}
      {mode === 'auto' && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Automatische Ableitung</h3>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={autoInput}
              onChange={(e) => setAutoInput(e.target.value.replace(/[^a-zA-Zε]/g, ''))}
              placeholder="Zielwort eingeben (z.B. aabb)"
              className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
            />
            <Button onClick={autoderive} variant="primary">Ableiten</Button>
          </div>
          {autoError && (
            <p className="text-red-400 text-sm bg-red-900/20 rounded p-2">{autoError}</p>
          )}
        </Card>
      )}

      {/* Derivation log */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Ableitungsprotokoll ({derivation.length - 1} Schritte)</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {derivation.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 py-1.5 px-2 rounded text-sm font-mono ${
                i === derivation.length - 1 ? 'bg-indigo-900/30' : ''
              }`}
            >
              <span className="text-slate-600 w-5 text-right shrink-0">{i}</span>
              <span className="text-slate-300 flex-1 flex gap-0.5 flex-wrap">
                {renderSententialForm(step.sententialForm || 'ε', grammar.N, null)}
              </span>
              {i > 0 && (
                <span className="text-xs text-slate-500 shrink-0">
                  via <span className="text-indigo-400">{step.appliedRule}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
