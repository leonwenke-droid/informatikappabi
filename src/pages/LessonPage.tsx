import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LessonPlayer } from '../features/lesson/LessonPlayer';
import { PracticeSession } from '../features/practice/PracticeSession';
import { getUnit } from '../content/path/units';
import { PATH_STAGES } from '../content/path/stages';
import { useLearningStore } from '../store/learningStore';
import { getCompletedStageIds, isUnitAccessible } from '../lib/path/unlock';
import type { ExerciseTrack, PathExercise } from '../types/learning';

const TRACK_ORDER: ExerciseTrack[] = ['mini', 'guided', 'standard', 'transfer', 'examStyle'];

const TRACK_LABELS: Record<ExerciseTrack, string> = {
  mini: 'Mini',
  guided: 'Geführt',
  standard: 'Standard',
  transfer: 'Transfer',
  examStyle: 'Klausurnah',
};

function groupExercisesByTrack(exercises: PathExercise[]): Partial<Record<ExerciseTrack | 'other', PathExercise[]>> {
  const g: Partial<Record<ExerciseTrack | 'other', PathExercise[]>> = {};
  for (const ex of exercises) {
    const key = ex.track ?? 'other';
    if (!g[key]) g[key] = [];
    g[key]!.push(ex);
  }
  return g;
}

export function LessonPage() {
  const { stageId, unitId } = useParams<{ stageId: string; unitId: string }>();
  const navigate = useNavigate();
  const unit = unitId ? getUnit(unitId) : undefined;
  const stage = stageId ? PATH_STAGES.find((s) => s.id === stageId) : undefined;
  const unitProgress = useLearningStore((s) => s.unitProgress);
  const completedStages = getCompletedStageIds(PATH_STAGES, unitProgress);

  if (!unit || !stage) {
    return (
      <div>
        <PageHeader title="Lektion nicht gefunden" />
        <Button onClick={() => navigate('/lernpfad')}>Zum Lernpfad</Button>
      </div>
    );
  }

  const accessible = isUnitAccessible(unit, PATH_STAGES, completedStages, unitProgress);
  if (!accessible) {
    const pre = unit.prerequisiteUnitIds?.[0];
    const preUnit = pre ? getUnit(pre) : undefined;
    const preStage = preUnit ? PATH_STAGES.find((s) => s.id === preUnit.stageId) : undefined;
    return (
      <div>
        <PageHeader title="Noch gesperrt" subtitle={unit.title} />
        <Card className="p-5 max-w-lg">
          <p className="text-slate-300 mb-4">
            Diese Lektion baut auf vorherigen Einheiten auf. Schließe zuerst die Voraussetzungen ab.
          </p>
          {preUnit && preStage && (
            <Button variant="primary" onClick={() => navigate(`/lernen/${preStage.id}/${preUnit.id}`)}>
              Zu: {preUnit.title}
            </Button>
          )}
          <Button variant="ghost" className="ml-2" onClick={() => navigate('/lernpfad')}>Lernpfad</Button>
        </Card>
      </div>
    );
  }

  const grouped = groupExercisesByTrack(unit.exercises);
  const orderedKeys: (ExerciseTrack | 'other')[] = [...TRACK_ORDER.filter((t) => grouped[t]?.length), ...(grouped.other?.length ? ['other' as const] : [])];

  return (
    <div>
      <PageHeader
        title={unit.title}
        subtitle={`Etappe ${stage.order}: ${stage.title}`}
      />
      {unit.learningGoals && unit.learningGoals.length > 0 && (
        <Card className="p-4 mb-4 border-blue-500/20">
          <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">Lernziele</div>
          <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
            {unit.learningGoals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </Card>
      )}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link to="/lernpfad">
          <Button variant="ghost" size="sm">← Lernpfad</Button>
        </Link>
        <Link to="/glossar">
          <Button variant="ghost" size="sm">Glossar</Button>
        </Link>
        <Link to="/themen">
          <Button variant="ghost" size="sm">Themenübersicht</Button>
        </Link>
      </div>
      <LessonPlayer unit={unit} />
      {unit.exercises.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Übungen zu dieser Lektion</h2>
          {orderedKeys.map((key) => {
            const list = grouped[key];
            if (!list?.length) return null;
            const label = key === 'other' ? 'Weitere Aufgaben' : TRACK_LABELS[key as ExerciseTrack];
            return (
              <div key={key} className="mb-8">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">{label}</h3>
                {list.map((ex) => (
                  <div key={ex.id} className="mb-6">
                    <PracticeSession exercise={ex} initialMode="guided" />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
