import { useState } from 'react';
import { SectionCard, AlertBox } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { computeHamming74, detectHammingError } from '../../lib/evaluator/localEvaluator';

type Bit = 0 | 1;

export function HammingVisualizer() {
  const [dataBits, setDataBits] = useState<Bit[]>([1, 0, 1, 1]);
  const [errorBitPos, setErrorBitPos] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);

  const result = computeHamming74(dataBits[0], dataBits[1], dataBits[2], dataBits[3]);
  const hammingBits = [
    result.p0, result.p1, dataBits[0],
    result.p2, dataBits[1], dataBits[2], dataBits[3]
  ] as Bit[];

  const errorResult = errorBitPos !== null
    ? detectHammingError(hammingBits.map((b, i) => i === errorBitPos ? (b === 0 ? 1 : 0) : b))
    : null;

  const labels = ['p0', 'p1', 'd0', 'p2', 'd1', 'd2', 'd3'];
  const colors: Record<string, string> = {
    p0: '#8b5cf6', p1: '#8b5cf6', p2: '#8b5cf6',
    d0: '#3b82f6', d1: '#3b82f6', d2: '#3b82f6', d3: '#3b82f6',
  };

  const toggleDataBit = (i: number) => {
    const next = [...dataBits] as Bit[];
    next[i] = next[i] === 0 ? 1 : 0;
    setDataBits(next);
    setShowError(false);
    setErrorBitPos(null);
  };

  return (
    <div className="space-y-5">
      <SectionCard title="(7,4)-Hamming-Code Visualizer" subtitle="Offizielle Notation: p0 p1 d0 p2 d1 d2 d3">
        {/* Data bit input */}
        <div className="mb-6">
          <div className="text-[13px] text-slate-400 mb-3 font-medium">Datenbits eingeben (klicken zum Umschalten):</div>
          <div className="flex items-center gap-4">
            {['d0', 'd1', 'd2', 'd3'].map((label, i) => (
              <div key={label} className="text-center">
                <button
                  onClick={() => toggleDataBit(i)}
                  className={`w-14 h-14 rounded-xl font-mono font-extrabold text-[22px] border-2 transition-all
                    ${dataBits[i] === 1
                      ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                      : 'bg-[#0e1525] border-[#1e2d45] text-slate-500'
                    }`}
                >
                  {dataBits[i]}
                </button>
                <div className="text-[11px] text-blue-400 mt-1 font-mono">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hamming code display */}
        <div className="mb-6">
          <div className="text-[13px] text-slate-400 mb-3 font-medium">Berechneter Hamming-Code:</div>
          <div className="flex items-end gap-3 flex-wrap">
            {hammingBits.map((bit, i) => {
              const label = labels[i];
              const isParity = label.startsWith('p');
              const isError = errorBitPos === i;
              return (
                <div key={i} className="text-center">
                  <div
                    className={`w-14 h-14 rounded-xl font-mono font-extrabold text-[22px] flex items-center justify-center border-2 transition-all
                      ${isError ? 'bg-red-600/30 border-red-500 text-red-300' : isParity
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-blue-600/20 border-blue-500 text-blue-300'
                      }`}
                  >
                    {isError ? (bit === 0 ? 1 : 0) : bit}
                  </div>
                  <div className="text-[11px] mt-1 font-mono" style={{ color: colors[label] }}>{label}</div>
                  <div className="text-[10px] text-slate-600">Pos {i}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 font-mono text-[13px] text-slate-400">
            Code: <span className="text-emerald-400 font-bold tracking-[0.15em]">{hammingBits.join(' ')}</span>
          </div>
        </div>

        {/* Calculation steps */}
        <div className="bg-black/30 rounded-xl p-4 mb-5">
          <div className="text-[12px] font-bold text-slate-400 mb-3">Berechnung (XOR = gerade Parität):</div>
          <div className="space-y-1.5 font-mono text-[12.5px]">
            <div>
              <span className="text-purple-400">p0</span>
              <span className="text-slate-500"> = d0 ⊕ d1 ⊕ d3 = </span>
              <span className="text-blue-400">{dataBits[0]}</span>
              <span className="text-slate-600"> ⊕ </span>
              <span className="text-blue-400">{dataBits[1]}</span>
              <span className="text-slate-600"> ⊕ </span>
              <span className="text-blue-400">{dataBits[3]}</span>
              <span className="text-slate-500"> = </span>
              <span className="text-purple-300 font-bold">{result.p0}</span>
            </div>
            <div>
              <span className="text-purple-400">p1</span>
              <span className="text-slate-500"> = d0 ⊕ d2 ⊕ d3 = </span>
              <span className="text-blue-400">{dataBits[0]}</span>
              <span className="text-slate-600"> ⊕ </span>
              <span className="text-blue-400">{dataBits[2]}</span>
              <span className="text-slate-600"> ⊕ </span>
              <span className="text-blue-400">{dataBits[3]}</span>
              <span className="text-slate-500"> = </span>
              <span className="text-purple-300 font-bold">{result.p1}</span>
            </div>
            <div>
              <span className="text-purple-400">p2</span>
              <span className="text-slate-500"> = d1 ⊕ d2 ⊕ d3 = </span>
              <span className="text-blue-400">{dataBits[1]}</span>
              <span className="text-slate-600"> ⊕ </span>
              <span className="text-blue-400">{dataBits[2]}</span>
              <span className="text-slate-600"> ⊕ </span>
              <span className="text-blue-400">{dataBits[3]}</span>
              <span className="text-slate-500"> = </span>
              <span className="text-purple-300 font-bold">{result.p2}</span>
            </div>
          </div>
        </div>

        {/* Error simulation */}
        <div>
          <div className="text-[13px] font-bold text-slate-300 mb-3">Fehlerkorrektur simulieren:</div>
          <div className="text-[12px] text-slate-500 mb-2">Klicke eine Position um einen 1-Bit-Fehler einzufügen:</div>
          <div className="flex gap-2 flex-wrap mb-3">
            {labels.map((label, i) => (
              <button
                key={i}
                onClick={() => {
                  setErrorBitPos(errorBitPos === i ? null : i);
                  setShowError(errorBitPos !== i);
                }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[12px] border transition-all
                  ${errorBitPos === i
                    ? 'bg-red-600/30 border-red-500 text-red-300'
                    : 'bg-[#0e1525] border-[#1e2d45] text-slate-400 hover:border-slate-500'
                  }`}
              >
                {label} (Pos {i})
              </button>
            ))}
            {errorBitPos !== null && (
              <Button variant="ghost" size="sm" onClick={() => { setErrorBitPos(null); setShowError(false); }}>
                Fehler entfernen
              </Button>
            )}
          </div>
          {showError && errorResult && errorBitPos !== null && (
            <div className="bg-red-500/[0.06] border border-red-500/25 rounded-xl p-4">
              <div className="text-[13px] font-bold text-red-400 mb-2">
                Fehler erkannt!
              </div>
              <div className="font-mono text-[12.5px] space-y-1">
                <div>
                  <span className="text-slate-400">Syndrom: </span>
                  <span className="text-red-300 font-bold">{errorResult.syndrome}</span>
                </div>
                <div>
                  <span className="text-slate-400">Fehler an: </span>
                  <span className="text-red-300 font-bold">Position {errorBitPos} ({labels[errorBitPos]})</span>
                </div>
                <div>
                  <span className="text-slate-400">Korrigiert: </span>
                  <span className="text-emerald-300 font-bold">{errorResult.corrected.join(' ')}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  Originaler Code: {hammingBits.join(' ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <AlertBox variant="info" title="Offizielle Hamming-Notation (Ergänzende Hinweise 2021, §4)">
        <div className="space-y-1">
          <div>Reihenfolge: <strong className="font-mono">p0 p1 d0 p2 d1 d2 d3</strong></div>
          <div>p0 prüft: d0, d1, d3 &nbsp; | &nbsp; p1 prüft: d0, d2, d3 &nbsp; | &nbsp; p2 prüft: d1, d2, d3</div>
          <div>Berechnung: Prüfbit = XOR aller Bits der Kontrollgruppe (gerade Parität)</div>
        </div>
      </AlertBox>
    </div>
  );
}
