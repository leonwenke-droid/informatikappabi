import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { PriorityBadge, BlockTag, SourceBadge } from '../../components/ui/Badge';
import { TabBar } from '../../components/ui/TabBar';
import { CodeBlock } from '../../components/ui/CodeBlock';
import { Button } from '../../components/ui/Button';
import { TOPICS } from '../../data/topics';
import { EXERCISES, getExercisesByTopic } from '../../data/exercises';
import { useProgressStore } from '../../store/progressStore';
import { ProgressBar } from '../../components/ui/Card';
import { ChevronRight } from 'lucide-react';

export function TopicsPage() {
  const navigate = useNavigate();
  const { topicId } = useParams<{ topicId?: string }>();
  const [activeTab, setActiveTab] = useState<string>('theorie');
  const { getTopicProgress } = useProgressStore();

  const activeTopic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];
  const topicExercises = getExercisesByTopic(activeTopic.id);
  const tp = getTopicProgress(activeTopic.id);

  return (
    <div>
      <PageHeader
        title="Themenübersicht"
        subtitle="Offizieller Inhalt nach KC 2017 und Ergänzenden Hinweisen 2021"
      />

      <div className="flex gap-5">
        {/* Left: Topic list */}
        <div className="w-[210px] flex-shrink-0">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-2 px-1">
            Themen
          </div>
          {TOPICS.map((t) => {
            const tpData = getTopicProgress(t.id);
            const exCount = EXERCISES.filter((e) => e.topicId === t.id).length;
            const completedCount = tpData.completedExercises.length;
            const isActive = t.id === activeTopic.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  navigate(`/themen/${t.id}`);
                  setActiveTab('theorie');
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 border-l-2 transition-all duration-150
                  ${isActive
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px]">{t.icon}</span>
                  <span className="text-[13px] font-medium flex-1 truncate">{t.title}</span>
                </div>
                <div className="flex items-center justify-between pl-[22px]">
                  <BlockTag block={t.block} />
                  {exCount > 0 && completedCount > 0 && (
                    <span className="text-[10px] text-slate-600">
                      {completedCount}/{exCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Topic detail */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display text-[22px] font-extrabold text-slate-100 flex items-center gap-3">
                <span>{activeTopic.icon}</span>
                {activeTopic.title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <BlockTag block={activeTopic.block} />
                <span className="text-[12px] text-slate-500">{activeTopic.category}</span>
                {activeTopic.officialNote && (
                  <span className="text-[11px] text-blue-500/70 font-mono">📄 {activeTopic.officialNote}</span>
                )}
              </div>
            </div>
            {topicExercises.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/uebungspool?topic=${activeTopic.id}`)}
              >
                Aufgaben üben <ChevronRight size={14} />
              </Button>
            )}
          </div>

          {/* Progress */}
          {topicExercises.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>{tp.completedExercises.length}/{topicExercises.length} Aufgaben gelöst</span>
                {tp.totalMaxScore > 0 && (
                  <span>{Math.round((tp.totalScore / tp.totalMaxScore) * 100)}% Ø Punktzahl</span>
                )}
              </div>
              <ProgressBar
                value={tp.completedExercises.length}
                max={topicExercises.length}
                color={tp.completedExercises.length === topicExercises.length ? '#10b981' : '#3b82f6'}
              />
            </div>
          )}

          <TabBar
            tabs={[
              { id: 'theorie', label: 'Theorie', icon: '📖' },
              { id: 'fehler', label: 'Typische Fehler', icon: '⚠️' },
              { id: 'muster', label: 'Klausurmuster', icon: '📋' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-5"
          />

          {activeTab === 'theorie' && (
            <div>
              <CodeBlock title="Theorie & offizielle Notation">
                {activeTopic.theory}
              </CodeBlock>

              {activeTopic.relatedTopics && activeTopic.relatedTopics.length > 0 && (
                <div className="mt-4">
                  <div className="text-[12px] text-slate-500 mb-2">Verwandte Themen:</div>
                  <div className="flex flex-wrap gap-2">
                    {activeTopic.relatedTopics.map((rid) => {
                      const rt = TOPICS.find((t) => t.id === rid);
                      if (!rt) return null;
                      return (
                        <button
                          key={rid}
                          onClick={() => navigate(`/themen/${rid}`)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[12px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.07] transition-all"
                        >
                          {rt.icon} {rt.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fehler' && (
            <div className="border border-red-500/25 bg-red-500/[0.05] rounded-xl p-5">
              <div className="text-[14px] font-bold text-red-400 mb-4">
                🚫 Typische Fehler in Prüfungen
              </div>
              <div className="space-y-3">
                {activeTopic.errors.map((error, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-black/20 rounded-lg px-4 py-3"
                  >
                    <span className="text-red-400 text-[13px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}.
                    </span>
                    <div className="flex-1">
                      <div className="text-[13.5px] text-red-200">{error.description}</div>
                      {error.example && (
                        <div className="text-[12px] text-red-400/70 mt-1 font-mono">
                          Beispiel: {error.example}
                        </div>
                      )}
                      {error.source && (
                        <div className="mt-1.5">
                          <SourceBadge source={error.source} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'muster' && (
            <div>
              <div className="border border-blue-500/20 bg-blue-500/[0.05] rounded-xl p-5 mb-4">
                <div className="text-[13px] font-bold text-blue-300 mb-3 flex flex-wrap items-center gap-2">
                  📋 Klausurmuster aus 2021–2025 <span className="text-blue-500/60">(abgeleitet, keine offizielle Vorgabe)</span>
                  <PriorityBadge priority={activeTopic.priority} />
                </div>
                <p className="text-[13.5px] text-blue-200/80 leading-relaxed">{activeTopic.examPattern}</p>
              </div>

              {topicExercises.length > 0 && (
                <div>
                  <div className="text-[14px] font-bold text-slate-100 mb-3">
                    {topicExercises.length} Übungsaufgaben zu diesem Thema
                  </div>
                  <div className="space-y-3">
                    {topicExercises.map((ex) => {
                      const isCompleted = tp.completedExercises.includes(ex.id);
                      return (
                        <Card
                          key={ex.id}
                          className="p-4 cursor-pointer hover:border-blue-500/30 transition-all"
                          onClick={() => navigate(`/uebungspool?topic=${activeTopic.id}&exercise=${ex.id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wide">
                                  {ex.operator}
                                </span>
                                <span className="text-[11px] text-slate-500">{ex.points} BE</span>
                                {isCompleted && (
                                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded">
                                    ✓ Gelöst
                                  </span>
                                )}
                              </div>
                              <p className="text-[13px] text-slate-300 line-clamp-2">{ex.question}</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-600 flex-shrink-0 ml-3 mt-1" />
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
