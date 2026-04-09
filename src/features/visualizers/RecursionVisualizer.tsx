import { useState, useMemo } from 'react';
import { Button } from '../../components/ui/Button';
import { SectionCard } from '../../components/ui/Card';

function factorialSteps(n: number): { depth: number; call: string; note: string }[] {
  const out: { depth: number; call: string; note: string }[] = [];
  function rec(x: number, d: number): void {
    out.push({ depth: d, call: `fak(${x})`, note: x <= 0 ? 'Basisfall → 1' : 'rekursiver Schritt' });
    if (x <= 0) return;
    rec(x - 1, d + 1);
    out.push({ depth: d, call: `← ${x} * …`, note: 'zurück im Aufrufer' });
  }
  rec(Math.min(4, Math.max(0, n)), 0);
  return out;
}

export function RecursionVisualizer() {
  const [n, setN] = useState(3);
  const [idx, setIdx] = useState(0);
  const steps = useMemo(() => factorialSteps(n), [n]);

  return (
    <div className="space-y-4">
      <SectionCard title="Rekursion (Mini)" subtitle="Aufrufkette und Basisfall — n klein halten">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-sm text-slate-400">n (0–4):</span>
          {[0, 1, 2, 3, 4].map((v) => (
            <Button key={v} size="sm" variant={n === v ? 'primary' : 'secondary'} onClick={() => { setN(v); setIdx(0); }}>
              {v}
            </Button>
          ))}
        </div>
        <div className="font-mono text-sm text-slate-300 space-y-2 min-h-[120px]">
          {steps.map((s, i) => (
            <div
              key={i}
              style={{ paddingLeft: s.depth * 12 }}
              className={`border-l-2 pl-2 ${i === idx ? 'border-blue-500 text-blue-200' : 'border-slate-700 text-slate-500'}`}
            >
              <span className="font-bold">{s.call}</span>
              <span className="text-slate-500 ml-2">— {s.note}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="secondary" disabled={idx <= 0} onClick={() => setIdx((i) => i - 1)}>Zurück</Button>
          <Button size="sm" variant="secondary" disabled={idx >= steps.length - 1} onClick={() => setIdx((i) => i + 1)}>Weiter</Button>
        </div>
      </SectionCard>
    </div>
  );
}
