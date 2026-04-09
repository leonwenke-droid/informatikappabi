import { ExamMode } from '../features/exam/ExamMode';
import { useLearningStore } from '../store/learningStore';
import { PATH_STAGES } from '../content/path/stages';
import { examModeDefaultUnlocked } from '../lib/path/unlock';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/Layout';

export function ExamModePage() {
  const navigate = useNavigate();
  const { unitProgress, settings, skipExamGate } = useLearningStore();
  const ok = examModeDefaultUnlocked(PATH_STAGES, unitProgress, 8) || settings.examModeUnlocked || settings.skippedExamGate;

  if (!ok) {
    return (
      <div>
        <PageHeader title="Klausurmodus" subtitle="Noch gesperrt" />
        <Card className="p-6 max-w-lg">
          <p className="text-slate-300 mb-4">
            Der Klausurmodus ist erst sinnvoll, wenn die Grundlagen sitzen. Freischaltung nach den ersten acht Etappen — oder bewusst überspringen.
          </p>
          <Button variant="primary" onClick={() => navigate('/lernpfad')}>Zum Lernpfad</Button>
          <Button variant="ghost" className="ml-2" onClick={() => { skipExamGate(); navigate(0); }}>
            Überspringen
          </Button>
        </Card>
      </div>
    );
  }

  return <ExamMode />;
}
