import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/Layout';
import { Card, AlertBox, ProgressBar } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PATH_STAGES } from '../content/path/stages';
import { getAllUnits } from '../content/path/units';
import { useLearningStore } from '../store/learningStore';
import { useProgressStore } from '../store/progressStore';
import { buildDailyPlan, completionPercent } from '../lib/path/dailyPlan';
import { recommendedNextUnitId, examModeDefaultUnlocked } from '../lib/path/unlock';
import { getDaysUntilExam, getExamCountdownColor } from '../utils/countdown';
import { shouldReviewUnit } from '../lib/path/unitReview';
import { BookOpen, Calendar, ChevronRight, GraduationCap } from 'lucide-react';

const EXAM_GATE_STAGES = 8;

export function DashboardPage() {
  const navigate = useNavigate();
  const days = getDaysUntilExam();
  const countdownColor = getExamCountdownColor(days);
  const { unitProgress, settings, dailyPlanDate, diagnosis, unlockExamMode, skipExamGate, setSettings } = useLearningStore();
  const { getDueForReview } = useProgressStore();

  const pct = completionPercent(PATH_STAGES, unitProgress);
  const next = recommendedNextUnitId(PATH_STAGES, unitProgress);
  const due = getDueForReview();
  const today = new Date().toISOString().slice(0, 10);

  const unitReviewSuggestions = getAllUnits()
    .filter((u) => shouldReviewUnit(unitProgress[u.id]))
    .slice(0, 5)
    .map((u) => ({ stageId: u.stageId, unitId: u.id, title: u.title }));

  const plan =
    dailyPlanDate === today
      ? null
      : buildDailyPlan({
          stages: PATH_STAGES,
          unitProgress,
          dueReviewExerciseCount: due.length,
          todayKey: today,
          unitReviewSuggestions,
        });

  const examReady =
    examModeDefaultUnlocked(PATH_STAGES, unitProgress, EXAM_GATE_STAGES) || settings.examModeUnlocked;

  return (
    <div>
      <PageHeader
        title="InfoAbi 2026"
        subtitle="Von Grund auf lernen — in deinem Tempo, ohne Zeitdruck auf der Startseite"
      />

      {!diagnosis.completed && (
        <AlertBox variant="info" className="mb-5">
          <strong>Erster Start:</strong> Kurze Diagnose schlägt einen passenden Einstieg vor — ohne Bewertungsdruck.
          <Button className="ml-3" size="sm" variant="primary" onClick={() => navigate('/onboarding')}>
            Diagnose starten
          </Button>
        </AlertBox>
      )}

      <div className={`grid grid-cols-1 gap-4 mb-6 ${settings.showExamCountdown ? 'lg:grid-cols-[220px_1fr]' : ''}`}>
        {settings.showExamCountdown && (
          <Card className="p-5">
            <div className="text-[11px] text-slate-500 mb-1">Prüfungstermin (optional)</div>
            <div className="font-mono text-4xl font-extrabold" style={{ color: countdownColor }}>
              {days}
            </div>
            <div className="text-xs text-slate-500">Tage bis Prüfung</div>
          </Card>
        )}
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-sm font-semibold text-slate-300">Lernpfad-Fortschritt</span>
            <span className="text-sm font-mono text-blue-400">{pct}%</span>
          </div>
          <ProgressBar value={pct} max={100} color="#3b82f6" />
          <label className="flex items-center gap-2 mt-3 text-[12px] text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showExamCountdown}
              onChange={(e) => setSettings({ showExamCountdown: e.target.checked })}
              className="rounded border-slate-600"
            />
            Countdown zum Prüfungstermin anzeigen
          </label>
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
        {(plan ??
          buildDailyPlan({
            stages: PATH_STAGES,
            unitProgress,
            dueReviewExerciseCount: due.length,
            todayKey: today,
            unitReviewSuggestions,
          })).map((item) => (
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

      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Prüfung (wenn du soweit bist)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-4 opacity-90" onClick={() => navigate('/analyse')}>
          <div className="text-sm text-slate-300">Häufigkeitsauswertung 2021–2025</div>
          <div className="text-[11px] text-slate-600">Neutrale Stichprobe — ohne Prognose oder Prioritätslabels</div>
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
              Freischaltung nach den ersten acht Etappen — oder:
              <button type="button" className="underline ml-1" onClick={(e) => { e.stopPropagation(); skipExamGate(); navigate('/klausur'); }}>
                Überspringen (eigenverantwortlich)
              </button>
            </div>
          )}
        </Card>
      </div>
      {examModeDefaultUnlocked(PATH_STAGES, unitProgress, EXAM_GATE_STAGES) && !settings.examModeUnlocked && (
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
