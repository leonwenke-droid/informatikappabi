import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// PDA that accepts { aⁿbⁿ | n ≥ 1 }
// States: q0 (start), q1 (reading a's), q2 (reading b's), q3 (accept)
// Stack alphabet: {#, A}  — # is bottom marker
//
// Transitions (state, input, stackTop) → (nextState, stackPush[])
// stackPush = [] means pop only, [x] means replace top with x, [x,y] means push x on top of y (y stays)
type PDAState = 'q0' | 'q1' | 'q2' | 'q_accept' | 'q_reject';

interface Step {
  state: PDAState;
  inputRemaining: string;
  stack: string[];
  description: string;
  isAccept: boolean;
  isReject: boolean;
}

function computeSteps(input: string): Step[] {
  const steps: Step[] = [];

  const initialStack = ['#'];
  steps.push({
    state: 'q0',
    inputRemaining: input,
    stack: [...initialStack],
    description: `Start: Eingabe "${input}", Keller: [#]`,
    isAccept: false,
    isReject: false,
  });

  let state: PDAState = 'q0';
  let stack = [...initialStack];
  let pos = 0;

  // Validate: must be non-empty, all a's then all b's, equal count
  const aCount = input.split('').filter((c) => c === 'a').length;
  const bCount = input.split('').filter((c) => c === 'b').length;
  const valid = aCount > 0 && bCount > 0 && aCount === bCount && /^a+b+$/.test(input);

  if (!valid && input.length === 0) {
    steps.push({
      state: 'q_reject',
      inputRemaining: '',
      stack: [...stack],
      description: 'Leere Eingabe — ε ∉ L. Keller: [#]. Ablehnen.',
      isAccept: false,
      isReject: true,
    });
    return steps;
  }

  // Simulate step by step
  while (pos <= input.length) {
    const ch = pos < input.length ? input[pos] : 'ε';
    const top = stack[stack.length - 1];

    if (state === 'q0') {
      if (ch === 'a' && top === '#') {
        stack.pop();
        stack.push('A', 'A'); // push two A's: replace # + push A on top
        // Actually: push A on stack (replace # with A, then push another A)
        // Transition: (q0, a, #) → (q1, A A)  — push A twice (keep bottom + new)
        // Simpler model: (q0,a,#)→(q1, A#) push A, keep #
        stack = ['#', 'A']; // A on top of #
        pos++;
        state = 'q1';
        steps.push({
          state,
          inputRemaining: input.slice(pos),
          stack: [...stack],
          description: `(q0, a, #) → q1: Lese 'a', lege A auf Keller. Keller: [#, A]`,
          isAccept: false,
          isReject: false,
        });
      } else {
        state = 'q_reject';
        steps.push({
          state,
          inputRemaining: input.slice(pos),
          stack: [...stack],
          description: `Kein passender Übergang von q0 mit '${ch}' und Kellertop '${top}'. Ablehnen.`,
          isAccept: false,
          isReject: true,
        });
        return steps;
      }
    } else if (state === 'q1') {
      if (ch === 'a' && top === 'A') {
        stack.push('A');
        pos++;
        steps.push({
          state,
          inputRemaining: input.slice(pos),
          stack: [...stack],
          description: `(q1, a, A) → q1: Lese 'a', push A. Keller: [${stack.join(', ')}]`,
          isAccept: false,
          isReject: false,
        });
      } else if (ch === 'b' && top === 'A') {
        stack.pop();
        pos++;
        state = 'q2';
        steps.push({
          state,
          inputRemaining: input.slice(pos),
          stack: [...stack],
          description: `(q1, b, A) → q2: Lese 'b', pop A. Keller: [${stack.join(', ')}]`,
          isAccept: false,
          isReject: false,
        });
      } else {
        state = 'q_reject';
        steps.push({
          state,
          inputRemaining: input.slice(pos),
          stack: [...stack],
          description: `Kein passender Übergang von q1 mit '${ch}' und Kellertop '${top}'. Ablehnen.`,
          isAccept: false,
          isReject: true,
        });
        return steps;
      }
    } else if (state === 'q2') {
      if (ch === 'b' && top === 'A') {
        stack.pop();
        pos++;
        steps.push({
          state,
          inputRemaining: input.slice(pos),
          stack: [...stack],
          description: `(q2, b, A) → q2: Lese 'b', pop A. Keller: [${stack.join(', ')}]`,
          isAccept: false,
          isReject: false,
        });
      } else if (ch === 'ε' && top === '#') {
        // End of input and stack has only #
        state = 'q_accept';
        steps.push({
          state,
          inputRemaining: '',
          stack: [...stack],
          description: `(q2, ε, #) → Akzeptiert! Eingabe vollständig gelesen, Keller nur noch [#]. Wort ∈ L.`,
          isAccept: true,
          isReject: false,
        });
        return steps;
      } else {
        state = 'q_reject';
        steps.push({
          state,
          inputRemaining: input.slice(pos),
          stack: [...stack],
          description: `Kein passender Übergang von q2 mit '${ch}' und Kellertop '${top}'. Ablehnen.`,
          isAccept: false,
          isReject: true,
        });
        return steps;
      }
    }
  }

  // Should not reach here in normal flow
  state = 'q_reject';
  steps.push({
    state,
    inputRemaining: '',
    stack: [...stack],
    description: 'Kein Akzeptierzustand erreicht. Ablehnen.',
    isAccept: false,
    isReject: true,
  });
  return steps;
}

const STATE_LABELS: Record<PDAState, string> = {
  q0: 'q₀ (Start)',
  q1: 'q₁ (a-Phase)',
  q2: 'q₂ (b-Phase)',
  q_accept: 'qₐ (Akzeptiert)',
  q_reject: 'q✗ (Abgelehnt)',
};

const EXAMPLES = ['ab', 'aabb', 'aaabbb', 'aab', 'abb', 'ba', 'a', 'b'];

export function PDAVisualizer() {
  const [inputWord, setInputWord] = useState('aabb');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);

  const start = (word = inputWord) => {
    const s = computeSteps(word);
    setSteps(s);
    setCurrentStep(0);
    setStarted(true);
  };

  const step = steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Theory box */}
      <Card className="bg-indigo-950/50 border-indigo-800/50">
        <h3 className="text-base font-semibold text-indigo-300 mb-2">Kellerautomat (PDA) — Theorie</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p>
            Ein <strong className="text-white">Kellerautomat (PDA)</strong> erweitert den DEA um einen unbeschränkten Kellerspeicher (Stack).
            Er akzeptiert alle <strong className="text-yellow-300">kontextfreien Sprachen</strong> — darunter solche, die ein DEA
            <em> nicht</em> erkennen kann.
          </p>
          <p>
            Dieses Beispiel akzeptiert <strong className="text-green-300">L = &#123;aⁿbⁿ | n ≥ 1&#125;</strong> — gleich viele a's gefolgt
            von gleich vielen b's. Kein DEA kann diese Sprache akzeptieren.
          </p>
          <p className="text-slate-400 text-xs">
            Transitionsnotation: <code className="bg-slate-800 px-1 rounded">(Zustand, Eingabe, Kellertop) → (Folgezustand, KellerAktion)</code>
          </p>
        </div>
      </Card>

      {/* Transition table */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Übergangsfunktion</h3>
        <div className="overflow-x-auto">
          <table className="text-xs font-mono w-full border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="px-3 py-2 text-left">Zustand</th>
                <th className="px-3 py-2 text-left">Eingabe</th>
                <th className="px-3 py-2 text-left">Kellertop</th>
                <th className="px-3 py-2 text-left">Folgezustand</th>
                <th className="px-3 py-2 text-left">Kelleraktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                ['q₀', 'a', '#', 'q₁', 'push A (# bleibt)'],
                ['q₁', 'a', 'A', 'q₁', 'push A'],
                ['q₁', 'b', 'A', 'q₂', 'pop A'],
                ['q₂', 'b', 'A', 'q₂', 'pop A'],
                ['q₂', 'ε', '#', 'qₐ', '— (Akzeptieren)'],
              ].map(([s, i, t, ns, a], idx) => (
                <tr key={idx} className="text-slate-300 hover:bg-slate-800/30">
                  <td className="px-3 py-1.5 text-blue-300">{s}</td>
                  <td className="px-3 py-1.5 text-yellow-300">{i}</td>
                  <td className="px-3 py-1.5 text-orange-300">{t}</td>
                  <td className="px-3 py-1.5 text-green-300">{ns}</td>
                  <td className="px-3 py-1.5 text-slate-400">{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Simulator */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Schritt-für-Schritt-Simulation</h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => { setInputWord(ex); setStarted(false); }}
              className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                inputWord === ex
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={inputWord}
            onChange={(e) => { setInputWord(e.target.value.replace(/[^ab]/g, '')); setStarted(false); }}
            placeholder="Eingabe (nur a,b)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
          />
          <Button onClick={() => start(inputWord)} variant="primary">Starten</Button>
        </div>

        {started && steps.length > 0 && (
          <div className="space-y-4">
            {/* Current state display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* State */}
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Zustand</div>
                <div className={`text-lg font-bold font-mono ${
                  step.isAccept ? 'text-green-400' : step.isReject ? 'text-red-400' : 'text-blue-300'
                }`}>
                  {STATE_LABELS[step.state]}
                </div>
              </div>

              {/* Remaining input */}
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">Restliche Eingabe</div>
                <div className="text-lg font-mono text-yellow-300">
                  {step.inputRemaining || <span className="text-slate-500">ε (leer)</span>}
                </div>
              </div>

              {/* Stack */}
              <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                <div className="text-xs text-slate-500 mb-2">Keller (oben → unten)</div>
                <div className="flex flex-col-reverse items-center gap-1">
                  {step.stack.map((sym, i) => (
                    <div
                      key={i}
                      className={`w-12 h-8 flex items-center justify-center rounded border font-mono text-sm font-bold ${
                        i === step.stack.length - 1
                          ? 'border-orange-400 bg-orange-900/40 text-orange-300'
                          : sym === '#'
                          ? 'border-slate-600 bg-slate-800 text-slate-500'
                          : 'border-blue-600 bg-blue-900/40 text-blue-300'
                      }`}
                    >
                      {sym}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={`rounded-lg p-3 text-sm font-mono ${
              step.isAccept
                ? 'bg-green-900/30 border border-green-700/50 text-green-300'
                : step.isReject
                ? 'bg-red-900/30 border border-red-700/50 text-red-300'
                : 'bg-slate-800/50 text-slate-300'
            }`}>
              {step.description}
            </div>

            {/* Result badge */}
            {(step.isAccept || step.isReject) && (
              <div className="text-center py-2">
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${
                  step.isAccept
                    ? 'bg-green-900/50 border border-green-600 text-green-300'
                    : 'bg-red-900/50 border border-red-600 text-red-300'
                }`}>
                  {step.isAccept
                    ? `✓ "${inputWord}" ∈ L — Wort akzeptiert`
                    : `✗ "${inputWord}" ∉ L — Wort abgelehnt`}
                </span>
              </div>
            )}

            {/* Step log */}
            <div>
              <div className="text-xs text-slate-500 mb-2">Verlauf ({steps.length} Schritte gesamt)</div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {steps.slice(0, currentStep + 1).map((s, i) => (
                  <div
                    key={i}
                    className={`text-xs py-1 px-2 rounded font-mono ${
                      i === currentStep
                        ? 'bg-indigo-900/50 text-indigo-200'
                        : s.isAccept
                        ? 'text-green-400'
                        : s.isReject
                        ? 'text-red-400'
                        : 'text-slate-500'
                    }`}
                  >
                    <span className="text-slate-600 mr-2">{i}.</span>
                    {s.description}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                variant="ghost"
                disabled={currentStep === 0}
              >
                ← Zurück
              </Button>
              <span className="text-slate-400 text-sm self-center">
                Schritt {currentStep + 1} / {steps.length}
              </span>
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                variant="ghost"
                disabled={currentStep === steps.length - 1}
              >
                Weiter →
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
