import { SectionCard } from '../../components/ui/Card';

const STEPS = [
  { id: 'FROM', label: 'FROM', text: 'Startmenge der Zeilen (Basisrelation(en)).' },
  { id: 'JOIN', label: 'JOIN', text: 'Verknüpfung weiterer Tabellen — Zeilen werden kombiniert.' },
  { id: 'WHERE', label: 'WHERE', text: 'Filter auf einzelne Zeilen vor Gruppierung.' },
  { id: 'GROUP', label: 'GROUP BY', text: 'Bildet Gruppen; Aggregatfunktionen wirken pro Gruppe.' },
  { id: 'HAVING', label: 'HAVING', text: 'Filter auf Gruppen (nach GROUP BY).' },
  { id: 'ORDER', label: 'ORDER BY', text: 'Sortiert das Ergebnis.' },
];

export function SQLFlowVisualizer() {
  return (
    <SectionCard title="SQL-Auswertung (schematisch)" subtitle="Typische logische Reihenfolge — Prüfung immer exakt nach Aufgabenstellung">
      <div className="flex flex-col gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-stretch gap-3">
            <div className="w-8 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
              {i < STEPS.length - 1 && <div className="w-0.5 flex-1 bg-slate-600 min-h-[12px]" />}
            </div>
            <div className="flex-1 rounded-lg border border-slate-700 bg-[#0a0f18] p-3 mb-1">
              <div className="text-[12px] font-bold text-blue-400 mb-1">{s.label}</div>
              <p className="text-[12px] text-slate-400 leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-slate-600 mt-4">Merke: WHERE filtert Zeilen, HAVING filtert Gruppen — typische Verwechslung.</p>
    </SectionCard>
  );
}
