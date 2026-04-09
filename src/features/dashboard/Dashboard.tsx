import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/Layout';
import { Card, AlertBox, ProgressBar } from '../../components/ui/Card';
import { PriorityBadge, BlockTag } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { TOPICS } from '../../data/topics';
import { EXERCISES } from '../../data/exercises';
import { getDaysUntilExam, getExamCountdownColor } from '../../utils/countdown';
import { useProgressStore } from '../../store/progressStore';
import {
  BarChart3, PenTool, GitBranch, Database,
  Timer, AlertCircle, ChevronRight
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const days = getDaysUntilExam();
  const countdownColor = getExamCountdownColor(days);
  const { getOverallProgress, getTopicProgress, getDueForReview } = useProgressStore();
  const overall = getOverallProgress();
  const dueForReview = getDueForReview();

  const highPrioTopics = TOPICS.filter((t) => t.priority === 'HOCH');
  const totalExercises = EXERCISES.length;

  const quickLinks = [
    { label: 'Prüfungsanalyse', icon: BarChart3, path: '/analyse', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Themen lernen', icon: BarChart3, path: '/themen', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Aufgaben üben', icon: PenTool, path: '/ueben', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Visualisierungen', icon: GitBranch, path: '/visualizer', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'SQL-Referenz', icon: Database, path: '/sql', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Klausurmodus', icon: Timer, path: '/klausur', color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Fehlerlogbuch', icon: AlertCircle, path: '/fehlerlog', color: 'text-slate-400', bg: 'bg-slate-500/10' },
  ];

  return (
    <div>
      <PageHeader
        title="InfoAbi 2026 — Lernzentrale"
        subtitle="Niedersachsen · Erhöhtes Anforderungsniveau · Klausurvorbereitung"
      />

      {/* Countdown + Exam Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 mb-5">
        <Card className="p-5 bg-gradient-to-br from-blue-600/10 to-purple-600/5">
          <div className="flex items-end gap-3 mb-3">
            <span
              className="font-mono font-extrabold leading-none text-[64px]"
              style={{ color: countdownColor }}
            >
              {days}
            </span>
            <div className="pb-2">
              <div className="text-[13px] text-slate-400">Tage bis zur Prüfung</div>
              <div className="text-[12px] text-slate-600 font-mono">14. Mai 2026</div>
            </div>
          </div>
          {days <= 14 && (
            <div className="text-[12px] text-red-400 font-bold">⚠️ Endspurt! Fokus auf Kernthemen!</div>
          )}
          {days > 14 && days <= 45 && (
            <div className="text-[12px] text-amber-400 font-bold">⏰ Letzte Phase — systematisch üben!</div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-[14px] font-bold text-slate-300 mb-3">Prüfungsstruktur 2026 (offiziell)</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-lg p-3">
              <div className="text-[13px] font-bold text-emerald-400 mb-1">Block 1 — 50% der BE</div>
              <div className="text-[12px] text-slate-400">1 aus 2 Aufgaben wählen</div>
            </div>
            <div className="bg-purple-500/8 border border-purple-500/20 rounded-lg p-3">
              <div className="text-[13px] font-bold text-purple-400 mb-1">Block 2 — 50% der BE</div>
              <div className="text-[12px] text-slate-400">2 aus 3 Aufgaben wählen (je 25%)</div>
            </div>
          </div>
          <div className="text-[11.5px] text-slate-600 border-t border-[#1e2d45] pt-2">
            Quelle: 18_InformatikHinweise2026.pdf · Keine konkrete Programmiersprache in Aufgabenstellungen · Kein Taschenrechner
          </div>
        </Card>
      </div>

      {/* Warning */}
      <AlertBox variant="warning" title="Prognosen sind KEINE offiziellen Vorgaben" className="mb-5">
        Die Häufigkeitsanalyse und 2026-Prognosen basieren auf den eA-Klausuren 2021–2025 und sind eine didaktische Ableitung zur Priorisierung.
        Sie ersetzen <strong>nicht</strong> das vollständige Kerncurriculum. Alle Themen müssen beherrscht werden.
      </AlertBox>

      {/* Progress Overview */}
      {overall.completedExercises > 0 && (
        <Card className="p-5 mb-5">
          <h3 className="text-[14px] font-bold text-slate-300 mb-3">Dein Lernfortschritt</h3>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-[28px] font-extrabold text-blue-400">{overall.completedExercises}</div>
              <div className="text-[11px] text-slate-500">Aufgaben gelöst</div>
            </div>
            <div className="text-center">
              <div className="text-[28px] font-extrabold text-emerald-400">{overall.avgScore}%</div>
              <div className="text-[11px] text-slate-500">Ø Punktzahl</div>
            </div>
            <div className="text-center">
              <div className="text-[28px] font-extrabold text-slate-400">{totalExercises}</div>
              <div className="text-[11px] text-slate-500">Aufgaben gesamt</div>
            </div>
          </div>
          <ProgressBar
            value={overall.completedExercises}
            max={totalExercises}
            color="#3b82f6"
            showLabel
          />
        </Card>
      )}

      {/* Spaced repetition review widget */}
      {dueForReview.length > 0 && (
        <Card
          className="p-4 mb-5 bg-amber-500/5 border-amber-500/30 cursor-pointer hover:bg-amber-500/10 transition-all flex items-center justify-between"
          onClick={() => navigate('/ueben?review=1')}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔁</span>
            <div>
              <div className="text-sm font-bold text-amber-300">
                {dueForReview.length} {dueForReview.length === 1 ? 'Aufgabe' : 'Aufgaben'} zur Wiederholung fällig
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Basierend auf deinem Lernfortschritt — jetzt wiederholen
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-amber-400 shrink-0" />
        </Card>
      )}

      {/* Quick access */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-7">
        {quickLinks.map(({ label, icon: Icon, path, color, bg }) => (
          <Card
            key={path}
            className="p-4 text-center cursor-pointer hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
            onClick={() => navigate(path)}
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bg} mb-3 mx-auto`}>
              <Icon size={18} className={color} />
            </div>
            <div className="text-[12.5px] font-semibold text-slate-300">{label}</div>
          </Card>
        ))}
      </div>

      {/* High priority topics */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[16px] font-bold text-slate-100">Kritische Themen — Höchste Priorität</h2>
        <Button variant="ghost" size="sm" onClick={() => navigate('/themen')}>
          Alle Themen <ChevronRight size={14} />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {highPrioTopics.map((topic) => {
          const tp = getTopicProgress(topic.id);
          const exercisesForTopic = EXERCISES.filter((e) => e.topicId === topic.id);
          const completedCount = tp.completedExercises.length;

          return (
            <Card
              key={topic.id}
              className="p-4 cursor-pointer hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
              onClick={() => navigate(`/themen/${topic.id}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[20px]">{topic.icon}</span>
                  <div>
                    <div className="text-[13.5px] font-semibold text-slate-100">{topic.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{topic.category}</div>
                  </div>
                </div>
                <PriorityBadge priority={topic.priority} />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <BlockTag block={topic.block} />
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed mb-3 line-clamp-2">
                {topic.examPattern.substring(0, 100)}…
              </p>
              {exercisesForTopic.length > 0 && (
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>{completedCount}/{exercisesForTopic.length} Aufgaben</span>
                    <span>
                      {tp.totalMaxScore > 0
                        ? `${Math.round((tp.totalScore / tp.totalMaxScore) * 100)}% Ø`
                        : '—'}
                    </span>
                  </div>
                  <ProgressBar
                    value={completedCount}
                    max={exercisesForTopic.length}
                    color={completedCount === exercisesForTopic.length ? '#10b981' : '#3b82f6'}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
