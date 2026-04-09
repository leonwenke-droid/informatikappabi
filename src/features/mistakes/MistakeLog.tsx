import { useState } from 'react';
import { PageHeader } from '../../components/layout/Layout';
import { Card, AlertBox } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useProgressStore } from '../../store/progressStore';
import { TOPICS } from '../../data/topics';
import type { MistakeEntry } from '../../types';
import { MISCONCEPTION_CATALOG } from '../../lib/errors/taxonomy';
import { Link } from 'react-router-dom';

export function MistakeLog() {
  const { mistakes, markMistakeReviewed, deleteMistake } = useProgressStore();
  const [filter, setFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const unreviewedCount = mistakes.filter((m) => !m.reviewed).length;
  const topicCounts = TOPICS.map((t) => ({
    topic: t,
    count: mistakes.filter((m) => m.topicId === t.id && !m.reviewed).length,
  })).filter((tc) => tc.count > 0);

  const filtered = filter === 'all'
    ? mistakes
    : mistakes.filter((m) => m.topicId === filter);

  const sorted = [...filtered].sort((a, b) => b.timestamp - a.timestamp);

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <PageHeader
        title="Fehlerlogbuch"
        subtitle="Automatisch gespeicherte Aufgaben mit niedrigem Score (<60%)"
      />

      {unreviewedCount > 0 ? (
        <AlertBox variant="warning" title={`${unreviewedCount} unbearbeitete Fehler`} className="mb-5">
          Bearbeite diese Fehler gezielt. Klicke auf einen Eintrag, um Details zu sehen.
        </AlertBox>
      ) : mistakes.length > 0 ? (
        <AlertBox variant="success" title="Alle Fehler bearbeitet!" className="mb-5">
          Super! Alle gespeicherten Fehler wurden als bearbeitet markiert.
        </AlertBox>
      ) : (
        <AlertBox variant="info" title="Noch keine Fehler gespeichert" className="mb-5">
          Fehler werden automatisch gespeichert, wenn du bei einer Aufgabe weniger als 60% erreichst.
          Übe jetzt Aufgaben!
        </AlertBox>
      )}

      {mistakes.length > 0 && (
        <>
          {/* Filter by topic */}
          <div className="flex flex-wrap gap-2 mb-5">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Alle ({mistakes.length})
            </Button>
            {topicCounts.map(({ topic, count }) => (
              <Button
                key={topic.id}
                variant={filter === topic.id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter(topic.id)}
              >
                {topic.icon} {topic.title.split(' ')[0]} ({count})
              </Button>
            ))}
          </div>

          {/* Mistake list */}
          <div className="space-y-3">
            {sorted.length === 0 && (
              <div className="text-[13px] text-slate-500 text-center py-8">
                Keine Fehler für diesen Filter.
              </div>
            )}
            {sorted.map((mistake) => {
              const topic = TOPICS.find((t) => t.id === mistake.topicId);
              const isExpanded = expanded === mistake.id;

              return (
                <MistakeCard
                  key={mistake.id}
                  mistake={mistake}
                  topic={topic}
                  isExpanded={isExpanded}
                  onToggle={() => setExpanded(isExpanded ? null : mistake.id)}
                  onMarkReviewed={() => markMistakeReviewed(mistake.id)}
                  onDelete={() => deleteMistake(mistake.id)}
                  formatDate={formatDate}
                />
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#1e2d45]">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Alle Fehler löschen?')) {
                  sorted.forEach((m) => deleteMistake(m.id));
                }
              }}
            >
              Alle Fehler löschen
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

interface MistakeCardProps {
  mistake: MistakeEntry;
  topic: ReturnType<typeof TOPICS.find>;
  isExpanded: boolean;
  onToggle: () => void;
  onMarkReviewed: () => void;
  onDelete: () => void;
  formatDate: (ts: number) => string;
}

function MistakeCard({ mistake, topic, isExpanded, onToggle, onMarkReviewed, onDelete, formatDate }: MistakeCardProps) {
  return (
    <Card
      className={`transition-all ${mistake.reviewed ? 'opacity-60' : ''}`}
    >
      <div
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {topic && <span className="text-[16px]">{topic.icon}</span>}
              <span className="text-[12px] font-bold text-slate-400">{topic?.title ?? mistake.topicId}</span>
              <span className="text-[11px] text-slate-600">{formatDate(mistake.timestamp)}</span>
              {mistake.reviewed && (
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded">
                  ✓ Bearbeitet
                </span>
              )}
            </div>
            <p className="text-[13px] text-slate-300 line-clamp-2">{mistake.question}</p>
          </div>
          <span className="text-slate-600 flex-shrink-0">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[#1e2d45] pt-4 space-y-3">
          {mistake.userAnswer && (
            <div>
              <div className="text-[11px] font-bold text-red-400 mb-1">Deine Antwort:</div>
              <div className="bg-red-500/[0.05] border border-red-500/20 rounded-lg p-3 text-[12.5px] text-red-200/80 font-mono whitespace-pre-wrap">
                {mistake.userAnswer}
              </div>
            </div>
          )}
          {mistake.modelAnswer && (
            <div>
              <div className="text-[11px] font-bold text-emerald-400 mb-1">Musterlösung:</div>
              <div className="bg-emerald-500/[0.05] border border-emerald-500/20 rounded-lg p-3 text-[12.5px] text-emerald-200/80 font-mono whitespace-pre-wrap">
                {mistake.modelAnswer}
              </div>
            </div>
          )}
          {mistake.misconceptionIds && mistake.misconceptionIds.length > 0 && (
            <div className="rounded-lg border border-amber-500/25 bg-amber-950/15 p-3">
              <div className="text-[11px] font-bold text-amber-400 mb-2">Typische Fehlvorstellung (automatisch erkannt)</div>
              <ul className="text-[12px] text-slate-300 space-y-2">
                {mistake.misconceptionIds.map((id) => {
                  const info = MISCONCEPTION_CATALOG[id as keyof typeof MISCONCEPTION_CATALOG];
                  if (!info) return <li key={id}>{id}</li>;
                  return (
                    <li key={id}>
                      <strong className="text-slate-200">{info.label}:</strong> {info.remediationHint}
                    </li>
                  );
                })}
              </ul>
              <Link to="/glossar" className="text-[11px] text-blue-400 underline mt-2 inline-block">
                Begriffe im Glossar nachlesen
              </Link>
            </div>
          )}
          <div className="flex gap-2">
            {!mistake.reviewed && (
              <Button variant="secondary" size="sm" onClick={onMarkReviewed}>
                ✓ Als bearbeitet markieren
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={onDelete}>
              Löschen
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
