import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PATH_STAGES } from '../content/path/stages';
import { useLearningStore } from '../store/learningStore';
import { isStageUnlocked, isStageComplete, getCompletedStageIds } from '../lib/path/unlock';
import { Check, Lock } from 'lucide-react';

export function LearnPathPage() {
  const navigate = useNavigate();
  const { unitProgress } = useLearningStore();
  const completedStages = getCompletedStageIds(PATH_STAGES, unitProgress);
  const sorted = [...PATH_STAGES].sort((a, b) => a.order - b.order);

  return (
    <div>
      <PageHeader
        title="Von Grund auf lernen"
        subtitle="15 Etappen — Voraussetzungen und Fortschritt"
      />
      <div className="space-y-3">
        {sorted.map((stage) => {
          const unlocked = isStageUnlocked(stage, completedStages);
          const complete = isStageComplete(stage, unitProgress);
          return (
            <Card
              key={stage.id}
              className={`p-4 ${!unlocked ? 'opacity-50' : 'hover:border-blue-500/30'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 text-sm font-mono text-slate-400">
                    {stage.order}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{stage.title}</h3>
                    {stage.subtitle && <p className="text-xs text-slate-500 mt-0.5">{stage.subtitle}</p>}
                    <p className="text-[11px] text-slate-600 mt-1">ca. {stage.estimatedMinutes} Min · Schwierigkeit {stage.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {complete && <Check className="text-emerald-400" size={18} />}
                  {!unlocked && <Lock className="text-slate-600" size={18} />}
                  {unlocked && stage.unitIds[0] && (
                    <Button size="sm" variant="primary" onClick={() => navigate(`/lernen/${stage.id}/${stage.unitIds[0]}`)}>
                      Öffnen
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
