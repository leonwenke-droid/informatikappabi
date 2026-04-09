import { PageHeader } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { GLOSSARY } from '../content/glossary';
import { Link } from 'react-router-dom';
import { PATH_STAGES } from '../content/path/stages';

function stageIdForUnit(unitId: string): string {
  const s = PATH_STAGES.find((st) => st.unitIds.includes(unitId));
  return s?.id ?? 's01';
}

export function GlossaryPage() {
  return (
    <div>
      <PageHeader title="Glossar" subtitle="Begriffe in einfacher Sprache" />
      <div className="space-y-4">
        {GLOSSARY.map((g) => (
          <Card key={g.id} className="p-4">
            <h3 className="text-base font-bold text-blue-300">{g.term}</h3>
            <p className="text-sm text-slate-300 mt-1">{g.shortDef}</p>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{g.simpleExplanation}</p>
            {g.officialRef && <p className="text-[11px] text-slate-600 mt-2">{g.officialRef}</p>}
            {g.relatedUnitIds.length > 0 && (
              <div className="mt-2 text-xs">
                {g.relatedUnitIds.map((uid) => (
                  <Link key={uid} className="text-blue-400 mr-3" to={`/lernen/${stageIdForUnit(uid)}/${uid}`}>
                    Zur Lektion
                  </Link>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
