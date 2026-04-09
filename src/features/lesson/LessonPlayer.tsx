import { useState, useEffect } from 'react';
import type { PathUnit, ExplanationTier } from '../../types/learning';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HelpToolbar } from '../help/HelpToolbar';
import { useLearningStore, rememberTier } from '../../store/learningStore';
import { GLOSSARY_BY_ID } from '../../content/glossary';

interface LessonPlayerProps {
  unit: PathUnit;
}

function renderMarkdownish(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    const m = p.match(/^\*\*(.+)\*\*$/);
    if (m) return <strong key={i} className="text-slate-100">{m[1]}</strong>;
    return <span key={i}>{p}</span>;
  });
}

export function LessonPlayer({ unit }: LessonPlayerProps) {
  const [tier, setTier] = useState<ExplanationTier>('beginner');
  const [miniExampleOpen, setMiniExampleOpen] = useState(false);
  const [unsureNote, setUnsureNote] = useState(false);

  const {
    setChecklistItem,
    recordConceptCheckResult,
    tryCompleteUnit,
    getUnitProgress,
    setSettings,
    settings,
    setLastUnitId,
  } = useLearningStore();

  const up = getUnitProgress(unit.id);
  const blocks = unit.lesson.tiers[tier];

  useEffect(() => {
    setLastUnitId(unit.id);
  }, [unit.id, setLastUnitId]);

  const handleTier = (t: ExplanationTier) => {
    setTier(t);
    rememberTier(unit.id, t);
  };

  const checklistKeys = unit.lesson.checklistKeys;
  const conceptIds = unit.conceptChecks.map((c) => c.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
      <div>
        <HelpToolbar
          tier={tier}
          onTierChange={handleTier}
          onlyBasics={settings.onlyBasics}
          onToggleOnlyBasics={(v) => setSettings({ onlyBasics: v })}
          paceSlow={settings.pace === 'slow'}
          onTogglePace={(v) => setSettings({ pace: v ? 'slow' : 'normal' })}
          onShowMiniExample={() => {
            setMiniExampleOpen(true);
            setTier('beginner');
          }}
          onUnsure={() => setUnsureNote(true)}
        />

        {unsureNote && (
          <Card className="p-4 mb-4 border-amber-600/40 bg-amber-950/20">
            <div className="text-sm text-amber-200 mb-2">Zusatz-Tipp</div>
            <p className="text-sm text-slate-300">
              Das ist normal. Lies die <strong>Einfach</strong>-Ebene noch einmal und arbeite die Checkliste ab.
              Wenn ein Begriff unklar ist: Glossar öffnen oder eine Stufe zurück zur vorherigen Etappe.
            </p>
            <Button size="sm" variant="ghost" className="mt-2" onClick={() => setUnsureNote(false)}>
              Verstanden
            </Button>
          </Card>
        )}

        {miniExampleOpen && (
          <Card className="p-4 mb-4 border-blue-600/40">
            <div className="text-sm font-semibold text-blue-300 mb-2">Mini-Beispiel (einfachste Ebene)</div>
            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {renderMarkdownish(unit.lesson.tiers.beginner.simplestExample.text)}
            </div>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => setMiniExampleOpen(false)}>
              Schließen
            </Button>
          </Card>
        )}

        <Section title="Was ist das?" source={blocks.whatIs.source}>
          {renderMarkdownish(blocks.whatIs.text)}
        </Section>
        {!settings.onlyBasics && (
          <>
            <Section title="Wofür braucht man das?" source={blocks.whyItMatters.source}>
              {renderMarkdownish(blocks.whyItMatters.text)}
            </Section>
            <Section title="Begriffe" source={blocks.terms.source}>
              {renderMarkdownish(blocks.terms.text)}
            </Section>
          </>
        )}
        <Section title="Einfachstes Beispiel" source={blocks.simplestExample.source}>
          {renderMarkdownish(blocks.simplestExample.text)}
        </Section>
        {(!settings.onlyBasics || settings.pace === 'slow') && (
          <>
            <Section title="Schritt für Schritt" source={blocks.stepByStep.source}>
              {renderMarkdownish(blocks.stepByStep.text)}
            </Section>
            <Section title="Typische Fehler" source={blocks.typicalMistakes.source}>
              {renderMarkdownish(blocks.typicalMistakes.text)}
            </Section>
          </>
        )}
        <Section title="Kurz zusammen" source={blocks.miniSummary.source}>
          {renderMarkdownish(blocks.miniSummary.text)}
        </Section>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Concept Checks</h3>
          {unit.conceptChecks.map((cc) => (
            <ConceptCheckCard
              key={cc.id}
              check={cc}
              solved={up.conceptCheckSolved[cc.id] === true}
              onSolve={(ok) => {
                recordConceptCheckResult(unit.id, cc.id, ok, checklistKeys, conceptIds);
              }}
            />
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <Card className="p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Checkliste</h3>
          <ul className="space-y-2">
            {checklistKeys.map((key) => (
              <li key={key}>
                <label className="flex gap-2 items-start text-[13px] text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-slate-600"
                    checked={up.checklist[key] === true}
                    onChange={(e) => {
                      setChecklistItem(unit.id, key, e.target.checked, checklistKeys.length);
                      tryCompleteUnit(unit.id, checklistKeys, conceptIds);
                    }}
                  />
                  <span>{unit.lesson.checklistLabels[key] ?? key}</span>
                </label>
              </li>
            ))}
          </ul>
          {up.completed && (
            <p className="mt-3 text-emerald-400 text-xs font-semibold">Lektion abgeschlossen</p>
          )}
        </Card>

        {unit.vocabularyTermIds.length > 0 && (
          <Card className="p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Begriffe hier</h3>
            <ul className="text-sm space-y-2">
              {unit.vocabularyTermIds.map((tid) => {
                const g = GLOSSARY_BY_ID[tid];
                if (!g) return null;
                return (
                  <li key={tid}>
                    <span className="text-blue-300 font-medium">{g.term}:</span>{' '}
                    <span className="text-slate-400">{g.shortDef}</span>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </aside>
    </div>
  );
}

function Section({
  title,
  source,
  children,
}: {
  title: string;
  source: string;
  children: React.ReactNode;
}) {
  const label =
    source === 'official' ? 'Offiziell' : source === 'examPattern2021_2025' ? 'Klausurmuster' : 'Didaktik';
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-200">{title}</h3>
        <span className="text-[10px] uppercase text-slate-600">{label}</span>
      </div>
      <div className="text-[14px] text-slate-300 whitespace-pre-line leading-relaxed">{children}</div>
    </Card>
  );
}

function ConceptCheckCard({
  check,
  solved,
  onSolve,
}: {
  check: import('../../types/learning').ConceptCheck;
  solved: boolean;
  onSolve: (ok: boolean) => void;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [lastWrong, setLastWrong] = useState(false);

  return (
    <Card className="p-4 border-slate-700">
      <p className="text-sm text-slate-200 mb-3">{check.question}</p>
      <div className="space-y-2 mb-3">
        {check.options.map((opt, i) => (
          <label key={i} className="flex gap-2 items-center text-[13px] text-slate-300 cursor-pointer">
            <input
              type="radio"
              name={check.id}
              checked={sel === i}
              onChange={() => { setSel(i); setLastWrong(false); }}
              disabled={solved}
            />
            {opt}
          </label>
        ))}
      </div>
      {check.hint && (
        <Button size="sm" variant="ghost" className="mb-2" onClick={() => setShowHint(!showHint)}>
          Tipp
        </Button>
      )}
      {showHint && check.hint && <p className="text-xs text-amber-200/90 mb-2">{check.hint}</p>}
      <Button
        size="sm"
        variant="primary"
        disabled={sel === null || solved}
        onClick={() => {
          if (sel === null) return;
          const ok = sel === check.correctIndex;
          if (ok) onSolve(true);
          else {
            setLastWrong(true);
            onSolve(false);
          }
        }}
      >
        Prüfen
      </Button>
      {lastWrong && !solved && (
        <p className="mt-2 text-xs text-red-300">{check.explanation}</p>
      )}
      {solved && (
        <p className="mt-2 text-xs text-emerald-400">Richtig. {check.explanation}</p>
      )}
    </Card>
  );
}
