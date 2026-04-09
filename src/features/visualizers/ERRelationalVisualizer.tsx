import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { SectionCard } from '../../components/ui/Card';

const PAIRS = [
  { er: 'Entität „Student“', rel: 'Tabelle Student(ID, …)' },
  { er: 'Entität „Kurs“', rel: 'Tabelle Kurs(KNr, …)' },
  { er: 'n:m Beziehung besucht', rel: 'Assoziationstabelle mit FKs zu Student und Kurs' },
  { er: '1:n (A hat viele B)', rel: 'FK der n-Seite auf Primärschlüssel der 1-Seite' },
];

export function ERRelationalVisualizer() {
  const [i, setI] = useState(0);
  const p = PAIRS[i];

  return (
    <SectionCard title="ER → relational (Übung)" subtitle='Klicke „Weiter“ und ordne gedanklich „Entität/Beziehung“ → „Tabelle/FK“'>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4">
          <div className="text-[11px] text-emerald-400 uppercase mb-2">ER / konzeptuell</div>
          <p className="text-sm text-slate-200">{p.er}</p>
        </div>
        <div className="rounded-lg border border-purple-500/30 bg-purple-950/20 p-4">
          <div className="text-[11px] text-purple-400 uppercase mb-2">Relational</div>
          <p className="text-sm text-slate-200">{p.rel}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" disabled={i <= 0} onClick={() => setI((x) => x - 1)}>Zurück</Button>
        <Button size="sm" variant="primary" disabled={i >= PAIRS.length - 1} onClick={() => setI((x) => x + 1)}>Weiter</Button>
      </div>
    </SectionCard>
  );
}
