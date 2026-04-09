import { useState } from 'react';
import { SectionCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

/** Kleines Mealy-Beispiel: Eingabe 0/1, Ausgabe an Übergängen */
const TRANS = [
  { from: 'A', input: '0', to: 'A', out: 'x' },
  { from: 'A', input: '1', to: 'B', out: 'y' },
  { from: 'B', input: '0', to: 'B', out: 'y' },
  { from: 'B', input: '1', to: 'A', out: 'x' },
];

export function MealyVisualizer() {
  const [state, setState] = useState('A');
  const [log, setLog] = useState<string[]>([]);

  const step = (input: '0' | '1') => {
    const t = TRANS.find((tr) => tr.from === state && tr.input === input);
    if (!t) return;
    setLog((l) => [...l, `${state} --${input}/${t.out}--> ${t.to}`]);
    setState(t.to);
  };

  return (
    <SectionCard title="Mealy-Automat (Mini)" subtitle="Ausgabe hängt an Übergang (Eingabe/Zustand), nicht nur am Zustand">
      <p className="text-[12px] text-slate-400 mb-4">
        Notation vereinfacht: <span className="font-mono text-slate-300">Eingabe/Ausgabe</span> am Pfeil.
      </p>
      <div className="text-2xl font-mono text-blue-300 mb-4">Zustand: {state}</div>
      <div className="flex gap-2 mb-4">
        <Button size="sm" variant="primary" onClick={() => step('0')}>Eingabe 0</Button>
        <Button size="sm" variant="primary" onClick={() => step('1')}>Eingabe 1</Button>
        <Button size="sm" variant="ghost" onClick={() => { setState('A'); setLog([]); }}>Reset</Button>
      </div>
      <div className="text-[11px] text-slate-500 font-mono space-y-1 max-h-40 overflow-y-auto">
        {log.length === 0 ? <span className="text-slate-600">Noch keine Schritte.</span> : log.map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </SectionCard>
  );
}
