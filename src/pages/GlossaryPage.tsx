import { PageHeader } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { GLOSSARY, GLOSSARY_BY_ID } from '../content/glossary';
import { Link } from 'react-router-dom';
import { PATH_STAGES } from '../content/path/stages';

function stageIdForUnit(unitId: string): string {
  const s = PATH_STAGES.find((st) => st.unitIds.includes(unitId));
  return s?.id ?? 's01';
}

export function GlossaryPage() {
  return (
    <div>
      <PageHeader title="Glossar" subtitle="Kurzdefinitionen, Präzision und typische Verwechslungen" />
      <div className="space-y-4">
        {GLOSSARY.map((g) => (
          <Card key={g.id} id={g.id} className="p-4 scroll-mt-24">
            <h3 className="text-base font-bold text-blue-300">{g.term}</h3>
            <p className="text-sm text-slate-300 mt-1">{g.shortDef}</p>
            {g.formalDefinition && (
              <p className="text-[13px] text-slate-400 mt-2 leading-relaxed border-l-2 border-blue-500/40 pl-3">
                <span className="text-[10px] uppercase text-slate-500 block mb-0.5">Präzise</span>
                {g.formalDefinition}
              </p>
            )}
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{g.simpleExplanation}</p>
            {g.miniExample && (
              <p className="text-[12px] text-emerald-400/90 mt-2 font-mono bg-emerald-950/20 rounded p-2">{g.miniExample}</p>
            )}
            {g.commonConfusions && g.commonConfusions.length > 0 && (
              <div className="mt-3 text-[12px] text-amber-200/90 bg-amber-950/20 rounded p-2 border border-amber-500/20">
                <div className="font-bold text-amber-400 mb-1">Verwechslungen</div>
                <ul className="list-disc pl-4 space-y-1">
                  {g.commonConfusions.map((c) => {
                    const other = GLOSSARY_BY_ID[c.withTermId];
                    return (
                      <li key={c.withTermId}>
                        {other ? <Link className="text-blue-400 underline" to={`/glossar#${c.withTermId}`}>{other.term}</Link> : c.withTermId}: {c.note}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {g.relatedTermIds && g.relatedTermIds.length > 0 && (
              <div className="mt-2 text-[12px] text-slate-500">
                Siehe auch:{' '}
                {g.relatedTermIds.map((tid) => {
                  const t = GLOSSARY_BY_ID[tid];
                  if (!t) return null;
                  return (
                    <Link key={tid} className="text-blue-400 mr-2 underline" to={`/glossar#${tid}`}>
                      {t.term}
                    </Link>
                  );
                })}
              </div>
            )}
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
