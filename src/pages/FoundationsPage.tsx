import { useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PATH_STAGES } from '../content/path/stages';

const FOUNDATION_STAGE_IDS = ['s01', 's02a', 's02b', 's03', 's04'];

export function FoundationsPage() {
  const navigate = useNavigate();
  const stages = PATH_STAGES.filter((s) => FOUNDATION_STAGE_IDS.includes(s.id)).sort((a, b) => a.order - b.order);

  return (
    <div>
      <PageHeader
        title="Grundlagen"
        subtitle="Einstieg und erste Etappen — Algorithmus, Variablen, Kontrolle, Trace, Reihungen"
      />
      <p className="text-sm text-slate-400 mb-6 max-w-2xl">
        Hier startest du ohne Zeitdruck. Nutze den Lernpfad für die vollständige Reihenfolge; diese Seite bündelt die ersten Schritte.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((stage) => (
          <Card key={stage.id} className="p-5">
            <div className="text-[11px] text-slate-500 mb-1">Etappe {stage.order}</div>
            <h2 className="text-base font-bold text-slate-100 mb-2">{stage.title}</h2>
            {stage.description && <p className="text-[13px] text-slate-400 mb-3">{stage.description}</p>}
            {stage.unitIds[0] && (
              <Button size="sm" variant="primary" onClick={() => navigate(`/lernen/${stage.id}/${stage.unitIds[0]}`)}>
                Zur Lektion
              </Button>
            )}
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/lernpfad" className="text-blue-400 text-sm underline">Kompletter Lernpfad (16 Etappen)</Link>
      </div>
    </div>
  );
}
