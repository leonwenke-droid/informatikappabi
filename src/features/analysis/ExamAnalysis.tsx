import { useState } from 'react';
import { PageHeader } from '../../components/layout/Layout';
import { SectionCard, AlertBox } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EXAM_YEARS, TOPIC_FREQUENCIES, PROGNOSE_2026 } from '../../data/examYears';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const YEARS = [2021, 2022, 2023, 2024, 2025];


function blockFrequencyLabel(tf: { block1Count: number; block2Count: number }): string {
  const parts: string[] = [];
  if (tf.block1Count > 0) parts.push(`B1 in ${tf.block1Count}/5 Jahrgängen`);
  if (tf.block2Count > 0) parts.push(`B2 in ${tf.block2Count}/5 Jahrgängen`);
  return parts.length ? parts.join(' · ') : 'Selten in Stichprobe';
}

export function ExamAnalysis() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [prognoseOpen, setPrognoseOpen] = useState(false);
  const yearData = EXAM_YEARS.find((y) => y.year === selectedYear);
  const maxCount = Math.max(...TOPIC_FREQUENCIES.map((t) => t.block1Count + t.block2Count));

  const chartData = TOPIC_FREQUENCIES.map((tf) => ({
    name: tf.topicLabel.split(' ')[0],
    fullName: tf.topicLabel,
    B1: tf.block1Count,
    B2: tf.block2Count,
  }));

  return (
    <div>
      <PageHeader
        title="Prüfungsanalyse 2021–2025"
        subtitle="Alle Daten aus den eA-Klausuren Informatik Niedersachsen extrahiert."
      />

      <AlertBox variant="warning" title="Hinweis zur Dateninterpretation" className="mb-5">
        Diese Analyse basiert auf den eA-Klausuren 2021–2025. <strong>Prognose 2026</strong> ist eine didaktische Ableitung —
        keine offizielle Vorgabe. Alle Themen des KC 2017 sind prüfungsrelevant.
      </AlertBox>

      {/* Frequency Chart */}
      <SectionCard
        title="Themen-Häufigkeit 2021–2025"
        subtitle="Anzahl der Jahrgänge, in denen das Thema in Block 1 bzw. Block 2 vorkam"
        className="mb-5"
      >
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, maxCount + 0.5]} />
              <Tooltip
                contentStyle={{
                  background: '#0e1525',
                  border: '1px solid #1e2d45',
                  borderRadius: 8,
                  color: '#e2e8f0',
                  fontSize: 12,
                }}
                formatter={(value, name) => [value + ' Jahrgänge', name === 'B1' ? 'Block 1' : 'Block 2']}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName ?? label}
              />
              <Legend
                formatter={(v) => v === 'B1' ? 'Block 1' : 'Block 2'}
                wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
              />
              <Bar dataKey="B1" fill="#10b981" radius={[4, 4, 0, 0]} name="B1" />
              <Bar dataKey="B2" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="B2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="mt-4 space-y-2">
          {TOPIC_FREQUENCIES.map((tf) => (
            <div key={tf.topicId} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[13px] font-semibold text-slate-200 truncate">{tf.topicLabel}</span>
                  <span className="text-[10px] text-slate-500">{blockFrequencyLabel(tf)}</span>
                </div>
                <div className="flex gap-2 h-2">
                  {tf.block1Count > 0 && (
                    <div
                      className="bg-emerald-500 rounded-full h-2"
                      style={{ width: `${(tf.block1Count / maxCount) * 40}%`, minWidth: 8 }}
                    />
                  )}
                  {tf.block2Count > 0 && (
                    <div
                      className="bg-purple-500 rounded-full h-2"
                      style={{ width: `${(tf.block2Count / maxCount) * 40}%`, minWidth: 8 }}
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-3 text-[12px] flex-shrink-0">
                {tf.block1Count > 0 && (
                  <span className="text-emerald-400 font-bold">B1: {tf.block1Count}/5</span>
                )}
                {tf.block2Count > 0 && (
                  <span className="text-purple-400 font-bold">B2: {tf.block2Count}/5</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Year-by-year breakdown */}
      <SectionCard
        title="Aufgaben nach Jahrgang"
        subtitle="Klicke einen Jahrgang für Details"
        className="mb-5"
        headerRight={
          <div className="flex gap-1.5">
            {YEARS.map((y) => (
              <Button
                key={y}
                variant={selectedYear === y ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedYear(y)}
              >
                {y}
              </Button>
            ))}
          </div>
        }
      >
        {yearData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-[13px] font-bold text-emerald-400 mb-3">Block 1</div>
              {yearData.block1Tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3 mb-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-emerald-400">{task.label}</span>
                    <div className="flex gap-1 flex-wrap">
                      {task.topics.map((tid) => (
                        <span key={tid} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                          {tid.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[12.5px] text-slate-400 leading-relaxed">{task.description}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[13px] font-bold text-purple-400 mb-3">Block 2</div>
              {yearData.block2Tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3 mb-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-purple-400">{task.label}</span>
                    <div className="flex gap-1 flex-wrap">
                      {task.topics.map((tid) => (
                        <span key={tid} className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">
                          {tid.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[12.5px] text-slate-400 leading-relaxed">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      <div className="border border-amber-500/20 rounded-xl overflow-hidden">
        <button
          type="button"
          className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-amber-500/[0.06] hover:bg-amber-500/[0.1] text-left transition-colors"
          onClick={() => setPrognoseOpen((o) => !o)}
        >
          <div>
            <h3 className="text-[14px] font-bold text-amber-300">
              2026-Prognose <span className="text-amber-500 font-normal">(didaktisch, nicht amtlich)</span>
            </h3>
            <p className="text-[11px] text-amber-800/90 mt-0.5">Nur hier; global in der App nicht hervorgehoben.</p>
          </div>
          <span className="text-amber-400 text-sm font-mono">{prognoseOpen ? '▲' : '▼'}</span>
        </button>
        {prognoseOpen && (
          <div className="p-5 border-t border-amber-500/20 bg-amber-500/[0.03]">
            <p className="text-[12px] text-amber-800/90 mb-4">
              Abgeleitet aus Mustern 2021–2025. Ersetzt keine vollständige Vorbereitung.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PROGNOSE_2026.map((p) => (
                <div
                  key={p.taskSlot}
                  className="bg-black/30 rounded-lg p-3.5 border border-amber-500/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-amber-400">{p.taskSlot}</span>
                    <span
                      className="text-[15px] font-extrabold"
                      style={{ color: p.probability >= 95 ? '#ef4444' : '#f59e0b' }}
                    >
                      {p.probability}%
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold text-slate-200 mb-1.5">{p.topic}</div>
                  <div className="h-1 bg-[#1e2d45] rounded-full mb-2">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.probability}%`,
                        background: p.probability >= 95 ? '#ef4444' : '#f59e0b',
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{p.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
