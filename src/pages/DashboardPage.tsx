import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/Layout';
import { Card, AlertBox, ProgressBar } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PATH_STAGES } from '../content/path/stages';
import { useLearningStore } from '../store/learningStore';
import { useProgressStore } from '../store/progressStore';
import { buildDailyPlan, completionPercent } from '../lib/path/dailyPlan';
import { recommendedNextUnitId, examModeDefaultUnlocked } from '../lib/path/unlock';
import { getDaysUntilExam, getExamCountdownColor } from '../utils/countdown';
import { BookOpen, Calendar, ChevronRight, GraduationCap } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const days = getDaysUntilExam();
  const countdownColor = getExamCountdownColor(days);
  const { unitProgress, settings, dailyPlanDate, diagnosis, unlockExamMode, skipExamGate } = useLearningStore();
  const { getDueForReview } = useProgressStore();

  const pct = completionPercent(PATH_STAGES, unitProgress);
  const next = recommendedNextUnitId(PATH_STAGES, unitProgress);
  const due = getDueForReview();
  const today = new Date().toISOString().slice(0, 10);
  const plan =
    dailyPlanDate === today
      ? null
      : buildDailyPlan({
          stages: PATH_STAGES,
          unitProgress,
          dueReviewExerciseCount: due.length,
          todayKey: today,
        });

  const examReady = examModeDefaultUnlocked(PATH_STAGES, unitProgress, 7) || settings.examModeUnlocked;

  return (
    <div>
      <PageHeader
        title="InfoAbi 2026"
        subtitle="Von Grund auf lernen — dann klausurnah üben"
      />

      {!diagnosis.completed && (
        <AlertBox variant="info" className="mb-5">
          <strong>Erster Start:</strong> Kurze Diagnose legt Tempo und Einstieg fest.
          <Button className="ml-3" size="sm" variant="primary" onClick={() => navigate('/onboarding')}>
            Diagnose starten
          </Button>
        </AlertBox>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 mb-6">
        <Card className="p-5">
          <div className="text-[11px] text-slate-500 mb-1">Countdown</div>
          <div className="font-mono text-4xl font-extrabold" style={{ color: countdownColor }}>
            {days}
          </div>
          <div className="text-xs text-slate-500">Tage bis Prüfung</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-300">Lernpfad-Fortschritt</span>
            <span className="text-sm font-mono text-blue-400">{pct}%</span>
          </div>
          <ProgressBar value={pct} max={100} color="#3b82f6" />
          {next && (
            <Button className="mt-4 w-full justify-center" variant="primary" onClick={() => navigate(`/lernen/${next.stageId}/${next.unitId}`)}>
              <BookOpen size={16} /> Weiterlernen <ChevronRight size={14} />
            </Button>
          )}
        </Card>
      </div>

      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Calendar size={14} /> Tagesmodus
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {(plan ?? buildDailyPlan({ stages: PATH_STAGES, unitProgress, dueReviewExerciseCount: due.length, todayKey: today })).map((item) => (
          <Card
            key={item.id}
            className="p-4 cursor-pointer hover:border-blue-500/40 transition-colors"
            onClick={() => navigate(item.href)}
          >
            <div className="text-sm font-medium text-slate-200">{item.label}</div>
            <div className="text-[11px] text-slate-600 mt-1">{item.kind}</div>
          </Card>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="mb-8" onClick={() => useLearningStore.getState().setDailyPlanDate(today)}>
        Tagesplan als erledigt markieren (heute)
      </Button>

      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Bereit zur Prüfung?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-4 opacity-90" onClick={() => navigate('/analyse')}>
          <div className="text-sm text-slate-300">Prüfungsanalyse 2021–2025</div>
          <div className="text-[11px] text-slate-600">Muster & Prognose (gekennzeichnet)</div>
        </Card>
        <Card
          className={`p-4 ${examReady ? 'cursor-pointer hover:border-red-500/30' : 'opacity-60'}`}
          onClick={() => (examReady ? navigate('/klausur') : null)}
        >
          <div className="text-sm text-slate-300 flex items-center gap-2">
            <GraduationCap size={16} /> Klausurmodus
          </div>
          {!examReady && (
            <div className="mt-2 text-[11px] text-amber-400">
              Freischaltung nach Fortschritt in den ersten Etappen — oder:
              <button type="button" className="underline ml-1" onClick={(e) => { e.stopPropagation(); skipExamGate(); navigate('/klausur'); }}>
                Überspringen (eigenverantwortlich)
              </button>
            </div>
          )}
        </Card>
      </div>
      {examModeDefaultUnlocked(PATH_STAGES, unitProgress, 7) && !settings.examModeUnlocked && (
        <Button className="mt-2" size="sm" variant="secondary" onClick={() => unlockExamMode()}>
          Klausurmodus offiziell freischalten
        </Button>
      )}

      <AlertBox variant="warning" className="mt-8">
        Prognosen und Klausurmuster sind <strong>keine</strong> offiziellen Vorgaben. Kerncurriculum vollständig beherrschen.
      </AlertBox>
    </div>
  );
}
