import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { LessonPlayer } from '../features/lesson/LessonPlayer';
import { PracticeSession } from '../features/practice/PracticeSession';
import { getUnit } from '../content/path/units';
import { PATH_STAGES } from '../content/path/stages';

export function LessonPage() {
  const { stageId, unitId } = useParams<{ stageId: string; unitId: string }>();
  const navigate = useNavigate();
  const unit = unitId ? getUnit(unitId) : undefined;
  const stage = stageId ? PATH_STAGES.find((s) => s.id === stageId) : undefined;

  if (!unit || !stage) {
    return (
      <div>
        <PageHeader title="Lektion nicht gefunden" />
        <Button onClick={() => navigate('/lernpfad')}>Zum Lernpfad</Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={unit.title}
        subtitle={`Etappe ${stage.order}: ${stage.title}`}
      />
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
          {unit.exercises.map((ex) => (
            <div key={ex.id} className="mb-6">
              <PracticeSession exercise={ex} initialMode="guided" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
