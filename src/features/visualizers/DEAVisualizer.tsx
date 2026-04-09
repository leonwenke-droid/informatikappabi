import { useState } from 'react';
import { SectionCard, AlertBox } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface DEAState {
  id: string;
  label: string;
  x: number;
  y: number;
  isStart: boolean;
  isFinal: boolean;
}

interface DEATransition {
  from: string;
  to: string;
  symbol: string;
}

// Example DEA: accepts strings over {0,1} ending with "01"
const EXAMPLE_DEA = {
  name: 'DEA: Wörter über {0,1} die mit "01" enden',
  alphabet: ['0', '1'],
  states: [
    { id: 's0', label: 'S0', x: 80, y: 120, isStart: true, isFinal: false },
    { id: 's1', label: 'S1', x: 240, y: 120, isStart: false, isFinal: false },
    { id: 's2', label: 'S2', x: 400, y: 120, isStart: false, isFinal: true },
  ] as DEAState[],
  transitions: [
    { from: 's0', to: 's1', symbol: '0' },
    { from: 's0', to: 's0', symbol: '1' },
    { from: 's1', to: 's1', symbol: '0' },
    { from: 's1', to: 's2', symbol: '1' },
    { from: 's2', to: 's1', symbol: '0' },
    { from: 's2', to: 's0', symbol: '1' },
  ] as DEATransition[],
};

export function DEAVisualizer() {
  const [input, setInput] = useState('101001');
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepHistory, setStepHistory] = useState<string[]>([]);
  const [_running, setRunning] = useState(false);

  const dea = EXAMPLE_DEA;

  const simulate = () => {
    const chars = input.split('');
    let state = dea.states.find((s) => s.isStart)!.id;
    const history: string[] = [state];

    for (const char of chars) {
      const trans = dea.transitions.find((t) => t.from === state && t.symbol === char);
      if (!trans) {
        history.push('ERROR');
        break;
      }
      state = trans.to;
      history.push(state);
    }

    setStepHistory(history);
    setCurrentStep(0);
    setRunning(false);
  };

  const currentStateId = currentStep >= 0 && currentStep < stepHistory.length
    ? stepHistory[currentStep]
    : null;

  const isAccepted = stepHistory.length > 0 && stepHistory[stepHistory.length - 1] !== 'ERROR'
    ? dea.states.find((s) => s.id === stepHistory[stepHistory.length - 1])?.isFinal ?? false
    : false;

  const getStateColor = (stateId: string) => {
    if (currentStateId === stateId) return { bg: '#1a3322', border: '#10b981', text: '#34d399' };
    return { bg: '#1e2d45', border: '#334155', text: '#94a3b8' };
  };

  // Calculate transition path (simple arc for self-loops, straight for others)
  const renderTransitions = () => {
    return dea.transitions.map((t, i) => {
      const from = dea.states.find((s) => s.id === t.from)!;
      const to = dea.states.find((s) => s.id === t.to)!;

      if (t.from === t.to) {
        // Self-loop
        return (
          <g key={i}>
            <path
              d={`M ${from.x} ${from.y - 24} A 20 20 0 1 1 ${from.x + 1} ${from.y - 24}`}
              fill="none"
              stroke="#334155"
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
            />
            <text x={from.x} y={from.y - 52} fill="#64748b" fontSize={12} textAnchor="middle" fontFamily="monospace" fontWeight="bold">
              {t.symbol}
            </text>
          </g>
        );
      }

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / len, uy = dy / len;

      // Check if reverse transition exists for curved lines
      const hasReverse = dea.transitions.some((r) => r.from === t.to && r.to === t.from);
      const offset = hasReverse ? 20 : 0;
      const px = -uy * offset, py = ux * offset;

      const mx = (from.x + to.x) / 2 + px;
      const my = (from.y + to.y) / 2 + py;

      const startX = from.x + ux * 24;
      const startY = from.y + uy * 24;
      const endX = to.x - ux * 24;
      const endY = to.y - uy * 24;

      return (
        <g key={i}>
          <path
            d={hasReverse ? `M ${startX} ${startY} Q ${mx} ${my} ${endX} ${endY}` : `M ${startX} ${startY} L ${endX} ${endY}`}
            fill="none"
            stroke="#334155"
            strokeWidth={1.5}
            markerEnd="url(#arrow)"
          />
          <text
            x={mx}
            y={my - 6}
            fill="#64748b"
            fontSize={12}
            textAnchor="middle"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {t.symbol}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="space-y-5">
      <SectionCard title={dea.name} subtitle="Interaktive DEA-Simulation">
        {/* DEA diagram */}
        <div className="bg-black/30 rounded-xl overflow-hidden mb-5">
          <svg width="100%" height="200" viewBox="0 0 520 200">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#4a6080" />
              </marker>
            </defs>

            {/* Start arrow */}
            <line x1="20" y1="120" x2="55" y2="120" stroke="#4a6080" strokeWidth={1.5} markerEnd="url(#arrow)" />

            {renderTransitions()}

            {dea.states.map((state) => {
              const c = getStateColor(state.id);
              return (
                <g key={state.id}>
                  {state.isFinal && (
                    <circle cx={state.x} cy={state.y} r={29} fill="none" stroke={c.border} strokeWidth={1.5} />
                  )}
                  <circle
                    cx={state.x} cy={state.y} r={24}
                    fill={c.bg}
                    stroke={c.border}
                    strokeWidth={currentStateId === state.id ? 2.5 : 1.5}
                  />
                  <text
                    x={state.x} y={state.y + 5}
                    fill={c.text}
                    fontSize={13}
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {state.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Simulation */}
        <div className="flex items-center gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value.replace(/[^01]/g, '')); setStepHistory([]); setCurrentStep(-1); }}
            placeholder="Eingabe (z.B. 10101)"
            maxLength={20}
            className="bg-[#060a14] border border-[#1e2d45] rounded-lg text-slate-200 font-mono text-[13px] px-3 py-1.5 w-44 outline-none focus:border-blue-500"
          />
          <Button variant="primary" size="sm" onClick={simulate}>Simulieren</Button>
          {stepHistory.length > 0 && (
            <>
              <Button variant="secondary" size="sm" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep <= 0}>←</Button>
              <span className="text-[12px] text-slate-500 font-mono">Schritt {currentStep + 1}/{stepHistory.length}</span>
              <Button variant="secondary" size="sm" onClick={() => setCurrentStep(Math.min(stepHistory.length - 1, currentStep + 1))} disabled={currentStep >= stepHistory.length - 1}>→</Button>
            </>
          )}
        </div>

        {/* Step display */}
        {stepHistory.length > 0 && (
          <div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {input.split('').map((c, i) => (
                <span
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-mono font-bold text-[14px] border transition-all
                    ${i === currentStep - 1
                      ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                      : i < currentStep - 1
                        ? 'bg-black/20 border-[#1e2d45] text-slate-600'
                        : 'bg-[#0e1525] border-[#1e2d45] text-slate-400'
                    }`}
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="font-mono text-[12.5px] space-y-1">
              {stepHistory.slice(0, currentStep + 1).map((sid, i) => {
                const state = dea.states.find((s) => s.id === sid);
                const symbol = i > 0 ? input[i - 1] : null;
                return (
                  <div key={i} className={`flex items-center gap-2 ${i === currentStep ? 'text-blue-300' : 'text-slate-500'}`}>
                    <span>{i === 0 ? 'Start:' : `Schritt ${i}:`}</span>
                    {symbol && <span className="text-amber-400">Lese '{symbol}'</span>}
                    <span>→</span>
                    <span className={state?.isFinal ? 'text-emerald-400 font-bold' : ''}>{state?.label ?? 'FEHLER'}</span>
                    {i === currentStep && i === stepHistory.length - 1 && (
                      <span className={`ml-2 font-bold px-2 py-0.5 rounded ${isAccepted ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {isAccepted ? '✓ Akzeptiert' : '✗ Abgelehnt'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </SectionCard>

      <AlertBox variant="info" title="DEA-Notation (Ergänzende Hinweise 2021, §7)">
        <div className="space-y-1 text-[13px]">
          <div>• Startzustand: Pfeil ohne Quelle</div>
          <div>• Endzustand: <strong>Doppelkreis</strong></div>
          <div>• Übergänge: Pfeile mit Eingabezeichen</div>
          <div>• Vollständig: jeder Zustand × jedes Zeichen = genau ein Übergang</div>
          <div>• Fehlerzustand: kann weggelassen werden mit erläuterndem Text</div>
        </div>
      </AlertBox>
    </div>
  );
}
