import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/Layout';
import { Card, AlertBox, ProgressBar } from '../../components/ui/Card';
import { PriorityBadge } from '../../components/ui/Badge';
import { TOPICS } from '../../data/topics';
import { EXERCISES } from '../../data/exercises';
import { useProgressStore } from '../../store/progressStore';
import { ChevronRight, CheckCircle } from 'lucide-react';

interface Phase {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  bgColor: string;
  topicIds: string[];
  dependencies?: string[]; // phases that should be done first
}

const PHASES: Phase[] = [
  {
    id: 'phase1',
    title: 'Phase 1 — Grundlagen',
    subtitle: 'Pflichtbasis: OOP, Datenstrukturen, 2D-Reihungen',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/5',
    topicIds: ['oop', 'dyn', 'arr2d'],
  },
  {
    id: 'phase2',
    title: 'Phase 2 — Hauptthemen',
    subtitle: 'Kernthemen mit höchster Klausurhäufigkeit',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    bgColor: 'bg-blue-500/5',
    topicIds: ['bst', 'db', 'aut', 'kry'],
    dependencies: ['phase1'],
  },
  {
    id: 'phase3',
    title: 'Phase 3 — Vertiefung',
    subtitle: 'Komplexere Themen und Formalismen',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/5',
    topicIds: ['rek', 'cod', 'gram'],
    dependencies: ['phase1', 'phase2'],
  },
];

// Dependencies between topics (for visual arrows)
const TOPIC_DEPS: Record<string, string[]> = {
  bst: ['oop', 'dyn'],
  rek: ['bst'],
  gram: ['aut'],
  cod: ['kry'],
};

function getPhaseProgress(phase: Phase, getTopicProgress: (id: string) => { completedExercises: string[] }) {
  const topicsInPhase = TOPICS.filter((t) => phase.topicIds.includes(t.id));
  let totalEx = 0;
  let completedEx = 0;
  let topicsDone = 0;

  for (const topic of topicsInPhase) {
    const exCount = EXERCISES.filter((e) => e.topicId === topic.id).length;
    const tp = getTopicProgress(topic.id);
    const done = tp.completedExercises.length;
    totalEx += exCount;
    completedEx += done;
    if (exCount > 0 && done === exCount) topicsDone++;
  }

  const pct = totalEx > 0 ? Math.round((completedEx / totalEx) * 100) : 0;
  return { totalEx, completedEx, pct, topicsDone, totalTopics: topicsInPhase.length };
}

export function StudyPath() {
  const navigate = useNavigate();
  const { getTopicProgress } = useProgressStore();

  const phaseStats = PHASES.map((phase) => ({
    ...phase,
    stats: getPhaseProgress(phase, getTopicProgress),
  }));

  // Find "next recommended" topic: first incomplete topic in lowest incomplete phase
  let nextTopic: string | null = null;
  for (const phase of phaseStats) {
    const incomplete = phase.topicIds.find((tid) => {
      const exCount = EXERCISES.filter((e) => e.topicId === tid).length;
      const tp = getTopicProgress(tid);
      return exCount > 0 && tp.completedExercises.length < exCount;
    });
    if (incomplete) {
      nextTopic = incomplete;
      break;
    }
  }

  return (
    <div>
      <PageHeader
        title="Lernpfad"
        subtitle="Strukturierte 3-Phasen-Vorbereitung auf das Informatik-Abitur"
      />

      <AlertBox variant="info" className="mb-5">
        Der Lernpfad ist eine <strong>didaktische Empfehlung</strong> zur Reihenfolge. Die Phasen bauen
        aufeinander auf: OOP ist Grundlage für BST, Rekursion baut auf BST auf.
        Alle Themen des Kerncurriculums müssen vollständig beherrscht werden.
      </AlertBox>

      {/* Next recommendation */}
      {nextTopic && (() => {
        const topic = TOPICS.find((t) => t.id === nextTopic);
        if (!topic) return null;
        return (
          <Card
            className="p-4 mb-6 bg-indigo-500/5 border-indigo-500/30 cursor-pointer hover:bg-indigo-500/10 transition-all"
            onClick={() => navigate(`/themen/${nextTopic}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div>
                  <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-0.5">
                    Als nächstes empfohlen
                  </div>
                  <div className="text-sm font-bold text-slate-200">{topic.title}</div>
                  <div className="text-xs text-slate-500">{topic.category}</div>
                </div>
              </div>
              <button
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg border border-blue-500 transition-colors"
                onClick={(e) => { e.stopPropagation(); navigate(`/ueben?topic=${nextTopic}`); }}
              >
                Üben →
              </button>
            </div>
          </Card>
        );
      })()}

      {/* Phases */}
      <div className="space-y-8">
        {phaseStats.map((phase, phaseIdx) => {
          const topicsInPhase = TOPICS.filter((t) => phase.topicIds.includes(t.id));
          const isPhaseComplete = phase.stats.pct === 100;

          return (
            <div key={phase.id}>
              {/* Phase header */}
              <div className={`rounded-xl border ${phase.borderColor} ${phase.bgColor} p-4 mb-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className={`text-sm font-bold ${phase.color} flex items-center gap-2`}>
                      {isPhaseComplete && <CheckCircle size={14} className="text-emerald-400" />}
                      {phase.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{phase.subtitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">{phase.stats.completedEx}/{phase.stats.totalEx} Aufgaben</div>
                    <div className={`text-lg font-bold font-mono ${phase.color}`}>{phase.stats.pct}%</div>
                  </div>
                </div>
                <ProgressBar value={phase.stats.completedEx} max={phase.stats.totalEx} color={
                  phaseIdx === 0 ? '#10b981' : phaseIdx === 1 ? '#3b82f6' : '#8b5cf6'
                } />
              </div>

              {/* Topic cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-2">
                {topicsInPhase.map((topic) => {
                  const tp = getTopicProgress(topic.id);
                  const exForTopic = EXERCISES.filter((e) => e.topicId === topic.id);
                  const completedCount = tp.completedExercises.length;
                  const totalCount = exForTopic.length;
                  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                  const isDone = pct === 100 && totalCount > 0;
                  const deps = TOPIC_DEPS[topic.id] ?? [];
                  const depTopics = deps.map((d) => TOPICS.find((t) => t.id === d)).filter(Boolean);

                  return (
                    <Card
                      key={topic.id}
                      className={`p-4 cursor-pointer transition-all hover:border-blue-500/30 hover:bg-blue-500/5 ${
                        isDone ? 'border-emerald-500/30 bg-emerald-500/5' : ''
                      }`}
                      onClick={() => navigate(`/themen/${topic.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{topic.icon}</span>
                          <div>
                            <div className="text-[13px] font-semibold text-slate-100 leading-tight">{topic.title}</div>
                            <div className="text-[10px] text-slate-600 mt-0.5">{topic.category}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <PriorityBadge priority={topic.priority} />
                          {isDone && (
                            <CheckCircle size={14} className="text-emerald-400" />
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      {totalCount > 0 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                            <span>{completedCount}/{totalCount} Aufgaben</span>
                            <span className={isDone ? 'text-emerald-400' : 'text-slate-500'}>{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isDone ? 'bg-emerald-500' : 'bg-blue-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Dependency note */}
                      {depTopics.length > 0 && (
                        <div className="mt-2 flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] text-slate-700">Baut auf:</span>
                          {depTopics.map((d) => d && (
                            <span key={d.id} className="text-[9px] text-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded">
                              {d.icon} {d.title.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action */}
                      <div className="mt-3 flex gap-2">
                        <button
                          className="flex-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-700/50 rounded px-2 py-1.5 transition-colors flex items-center justify-center gap-1"
                          onClick={(e) => { e.stopPropagation(); navigate(`/themen/${topic.id}`); }}
                        >
                          Lernen
                        </button>
                        <button
                          className="flex-1 text-[11px] text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 rounded px-2 py-1.5 transition-colors flex items-center justify-center gap-1"
                          onClick={(e) => { e.stopPropagation(); navigate(`/ueben?topic=${topic.id}`); }}
                        >
                          Üben <ChevronRight size={10} />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Arrow between phases */}
              {phaseIdx < PHASES.length - 1 && (
                <div className="flex justify-center py-2 mt-2">
                  <div className="flex flex-col items-center text-slate-700">
                    <div className="w-px h-4 bg-slate-700" />
                    <div className="text-slate-700 text-lg">↓</div>
                    <div className="text-[10px] text-slate-700">aufbauend</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <Card className="mt-6 p-4">
        <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Legende</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-400">100% abgeschlossen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-400">In Bearbeitung</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <span className="text-slate-400">Noch nicht begonnen</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={12} className="text-emerald-400" />
            <span className="text-slate-400">Phase vollständig</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
