import { useState, useMemo } from 'react';
import { SectionCard, AlertBox } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TabBar } from '../../components/ui/TabBar';

interface HuffNode {
  char?: string;
  freq: number;
  left?: HuffNode;
  right?: HuffNode;
}

function buildHuffmanTree(text: string): HuffNode | null {
  if (!text) return null;
  const freq: Record<string, number> = {};
  for (const c of text) freq[c] = (freq[c] ?? 0) + 1;

  let nodes: HuffNode[] = Object.entries(freq).map(([char, f]) => ({ char, freq: f }));
  nodes.sort((a, b) => a.freq - b.freq || (a.char ?? '').localeCompare(b.char ?? ''));

  while (nodes.length > 1) {
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    const parent: HuffNode = { freq: left.freq + right.freq, left, right };
    nodes.push(parent);
    nodes.sort((a, b) => a.freq - b.freq);
  }
  return nodes[0] ?? null;
}

function buildCodes(node: HuffNode | null, prefix = '', codes: Record<string, string> = {}): Record<string, string> {
  if (!node) return codes;
  if (node.char !== undefined) { codes[node.char] = prefix || '0'; return codes; }
  if (node.left) buildCodes(node.left, prefix + '0', codes);
  if (node.right) buildCodes(node.right, prefix + '1', codes);
  return codes;
}

const SVG_W = 600;
const NODE_R = 18;

interface PosNode {
  node: HuffNode;
  x: number; y: number;
  parentX?: number; parentY?: number;
}

function positionHuffman(root: HuffNode | null): PosNode[] {
  if (!root) return [];
  const result: PosNode[] = [];

  function recurse(n: HuffNode, x: number, y: number, spread: number, px?: number, py?: number) {
    result.push({ node: n, x, y, parentX: px, parentY: py });
    if (n.left) recurse(n.left, x - spread, y + 60, spread / 1.8, x, y);
    if (n.right) recurse(n.right, x + spread, y + 60, spread / 1.8, x, y);
  }
  recurse(root, SVG_W / 2, 30, 160);
  return result;
}

// ─── Step-by-step types ───────────────────────────────────────
interface QueueNode {
  label: string; // e.g. "A(5)" or "Node(8)"
  freq: number;
  isComposite: boolean;
  children?: [QueueNode, QueueNode];
}

interface BuildStep {
  queue: QueueNode[];
  action: string; // description of what happened
  combined?: { left: QueueNode; right: QueueNode; result: QueueNode };
}

function toQueueNode(node: HuffNode): QueueNode {
  if (node.char !== undefined) return { label: node.char, freq: node.freq, isComposite: false };
  const left = node.left ? toQueueNode(node.left) : undefined;
  const right = node.right ? toQueueNode(node.right) : undefined;
  return {
    label: `Knoten(${node.freq})`,
    freq: node.freq,
    isComposite: true,
    children: left && right ? [left, right] : undefined,
  };
}

function buildSteps(text: string): BuildStep[] {
  if (!text) return [];
  const freq: Record<string, number> = {};
  for (const c of text) freq[c] = (freq[c] ?? 0) + 1;

  let nodes: HuffNode[] = Object.entries(freq)
    .map(([char, f]) => ({ char, freq: f }))
    .sort((a, b) => a.freq - b.freq || (a.char ?? '').localeCompare(b.char ?? ''));

  const steps: BuildStep[] = [];
  steps.push({
    queue: nodes.map(toQueueNode),
    action: `Start: ${nodes.length} Knoten aus Häufigkeitstabelle. Sortiert nach Häufigkeit (aufsteigend).`,
  });

  while (nodes.length > 1) {
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    const parent: HuffNode = { freq: left.freq + right.freq, left, right };
    nodes.push(parent);
    nodes.sort((a, b) => a.freq - b.freq);

    const leftQ = toQueueNode(left);
    const rightQ = toQueueNode(right);
    const parentQ = toQueueNode(parent);

    const leftLabel = left.char ?? `Knoten(${left.freq})`;
    const rightLabel = right.char ?? `Knoten(${right.freq})`;

    steps.push({
      queue: nodes.map(toQueueNode),
      action: `Kombiniere '${leftLabel}'(${left.freq}) + '${rightLabel}'(${right.freq}) → Knoten(${parent.freq})`,
      combined: { left: leftQ, right: rightQ, result: parentQ },
    });
  }

  steps.push({
    queue: nodes.map(toQueueNode),
    action: 'Fertig! Nur noch ein Knoten — das ist die Wurzel des Huffman-Baums.',
  });

  return steps;
}

const HUFFMAN_TABS = [
  { id: 'baum', label: 'Baum', icon: '🌲' },
  { id: 'schritte', label: 'Schritt-für-Schritt', icon: '👣' },
];

export function HuffmanVisualizer() {
  const [activeTab, setActiveTab] = useState('baum');
  const [text, setText] = useState('ABRAKADABRA');
  const [inputText, setInputText] = useState('ABRAKADABRA');

  const [stepIdx, setStepIdx] = useState(0);

  const tree = useMemo(() => buildHuffmanTree(text), [text]);
  const codes = useMemo(() => tree ? buildCodes(tree) : {}, [tree]);
  const encoded = text.split('').map((c) => codes[c] ?? '?').join('');
  const originalBits = text.length * 8;
  const compressedBits = encoded.length;
  const savings = originalBits > 0 ? Math.round((1 - compressedBits / originalBits) * 100) : 0;

  const positioned = useMemo(() => positionHuffman(tree), [tree]);
  const treeHeight = Math.max(150, positioned.reduce((max, n) => Math.max(max, n.y), 0) + 40);

  const freq: Record<string, number> = {};
  for (const c of text) freq[c] = (freq[c] ?? 0) + 1;
  const freqTable = Object.entries(freq).sort((a, b) => b[1] - a[1]);

  const steps = useMemo(() => buildSteps(text), [text]);
  const currentStep = steps[stepIdx] ?? null;
  const isFinalStep = stepIdx === steps.length - 1;

  const analyzeText = (t: string) => {
    setText(t);
    setStepIdx(0);
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Huffman-Codierung" subtitle="Häufige Zeichen → kurze Codes">
        {/* Input */}
        <div className="flex gap-2 mb-5">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && analyzeText(inputText)}
            placeholder="Text eingeben (Großbuchstaben)"
            className="flex-1 bg-[#060a14] border border-[#1e2d45] rounded-lg text-slate-200 font-mono text-[13px] px-3 py-1.5 outline-none focus:border-blue-500"
          />
          <Button variant="primary" size="sm" onClick={() => analyzeText(inputText)}>
            Analysieren
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { analyzeText('ABRAKADABRA'); setInputText('ABRAKADABRA'); }}>
            Reset
          </Button>
        </div>

        {/* Tabs */}
        <TabBar tabs={HUFFMAN_TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-5" />

        {tree && activeTab === 'baum' && (
          <>
            {/* Frequency table */}
            <div className="mb-5">
              <div className="text-[12px] text-slate-500 mb-2">Häufigkeitstabelle:</div>
              <div className="flex gap-2 flex-wrap">
                {freqTable.map(([char, count]) => (
                  <div key={char} className="bg-[#060a14] border border-[#1e2d45] rounded-lg px-3 py-1.5 text-center">
                    <div className="font-mono font-bold text-blue-300 text-[15px]">{char === ' ' ? '⎵' : char}</div>
                    <div className="text-[11px] text-slate-500">{count}×</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tree */}
            <div className="bg-black/30 rounded-xl overflow-hidden mb-5">
              <svg width="100%" height={treeHeight} viewBox={`0 0 ${SVG_W} ${treeHeight}`}>
                {positioned.map((p, i) => (
                  p.parentX !== undefined && (
                    <line
                      key={`e${i}`}
                      x1={p.parentX} y1={p.parentY!}
                      x2={p.x} y2={p.y}
                      stroke="#334155" strokeWidth={1.5}
                    />
                  )
                ))}
                {positioned.map((p, i) => {
                  const isLeaf = !p.node.left && !p.node.right;
                  const isLeft = p.parentX !== undefined && p.x < p.parentX!;
                  return (
                    <g key={`n${i}`}>
                      {p.parentX !== undefined && (
                        <text
                          x={(p.x + p.parentX!) / 2 + (isLeft ? -8 : 8)}
                          y={(p.y + p.parentY!) / 2}
                          fontSize={11}
                          fill={isLeft ? '#10b981' : '#8b5cf6'}
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {isLeft ? '0' : '1'}
                        </text>
                      )}
                      <circle
                        cx={p.x} cy={p.y} r={NODE_R}
                        fill={isLeaf ? '#1e3a5f' : '#1e2d45'}
                        stroke={isLeaf ? '#3b82f6' : '#334155'}
                        strokeWidth={1.5}
                      />
                      <text x={p.x} y={p.y - 3} fontSize={isLeaf ? 11 : 10} fill={isLeaf ? '#60a5fa' : '#94a3b8'} fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {isLeaf && p.node.char ? (p.node.char === ' ' ? '⎵' : p.node.char) : ''}
                      </text>
                      <text x={p.x} y={p.y + (isLeaf ? 8 : 5)} fontSize={10} fill="#64748b" textAnchor="middle" fontFamily="monospace">
                        {p.node.freq}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Codes table */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <div className="text-[12px] text-slate-500 mb-2">Huffman-Codes (Links=0, Rechts=1):</div>
                <div className="space-y-1">
                  {Object.entries(codes).sort((a, b) => a[1].length - b[1].length).map(([char, code]) => (
                    <div key={char} className="flex items-center gap-3 font-mono">
                      <span className="text-blue-300 font-bold w-6">{char === ' ' ? '⎵' : char}</span>
                      <span className="text-[11px] text-slate-500">{freq[char]}×</span>
                      <span className="text-emerald-300 font-bold">{code}</span>
                      <span className="text-[11px] text-slate-600">({code.length} Bit)</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-slate-500 mb-2">Kompression:</div>
                <div className="space-y-2 font-mono text-[12.5px]">
                  <div><span className="text-slate-500">Original: </span><span className="text-red-400">{originalBits} Bit</span> ({text.length} × 8)</div>
                  <div><span className="text-slate-500">Huffman: </span><span className="text-emerald-400">{compressedBits} Bit</span></div>
                  <div><span className="text-slate-500">Einsparung: </span><span className={savings > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{savings}%</span></div>
                </div>
                <div className="mt-3">
                  <div className="text-[11px] text-slate-500 mb-1">Codierter Text:</div>
                  <div className="text-[11px] font-mono text-slate-400 break-all leading-relaxed bg-black/30 p-2 rounded">{encoded}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step-by-step tab */}
        {activeTab === 'schritte' && (
          <div className="space-y-4">
            {/* Step counter */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                Schritt {stepIdx + 1} / {steps.length}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setStepIdx(0)}>Reset</Button>
            </div>

            {/* Current action description */}
            {currentStep && (
              <div className={`rounded-lg p-3 text-sm font-mono ${
                isFinalStep
                  ? 'bg-green-900/30 border border-green-700/50 text-green-300'
                  : currentStep.combined
                  ? 'bg-amber-900/20 border border-amber-700/40 text-amber-200'
                  : 'bg-slate-800/50 text-slate-300'
              }`}>
                {currentStep.action}
              </div>
            )}

            {/* Combined nodes highlight */}
            {currentStep?.combined && (
              <div className="bg-slate-800/40 rounded-lg p-3">
                <div className="text-xs text-slate-500 mb-2">Kombinierter Schritt:</div>
                <div className="flex items-center gap-3 font-mono text-sm flex-wrap">
                  <span className="bg-red-900/40 border border-red-700/50 text-red-300 px-3 py-1.5 rounded">
                    {currentStep.combined.left.label} ({currentStep.combined.left.freq})
                  </span>
                  <span className="text-slate-500">+</span>
                  <span className="bg-red-900/40 border border-red-700/50 text-red-300 px-3 py-1.5 rounded">
                    {currentStep.combined.right.label} ({currentStep.combined.right.freq})
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="bg-green-900/40 border border-green-600/50 text-green-300 px-3 py-1.5 rounded font-bold">
                    {currentStep.combined.result.label}
                  </span>
                </div>
              </div>
            )}

            {/* Priority queue cards */}
            {currentStep && (
              <div>
                <div className="text-xs text-slate-500 mb-2">
                  Prioritätswarteschlange ({currentStep.queue.length} Knoten, sortiert nach Häufigkeit):
                </div>
                <div className="flex gap-2 flex-wrap">
                  {currentStep.queue.map((node, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border px-3 py-2 text-center min-w-[3.5rem] ${
                        node.isComposite
                          ? 'bg-purple-900/30 border-purple-700/50'
                          : 'bg-blue-900/30 border-blue-700/50'
                      }`}
                    >
                      <div className={`font-mono font-bold text-sm ${node.isComposite ? 'text-purple-300' : 'text-blue-300'}`}>
                        {node.label}
                      </div>
                      <div className="text-xs text-slate-500">{node.freq}×</div>
                    </div>
                  ))}
                </div>
                {currentStep.queue.length === 0 && (
                  <span className="text-slate-500 text-sm italic">Warteschlange leer</span>
                )}
              </div>
            )}

            {/* Step protocol */}
            <div>
              <div className="text-xs text-slate-500 mb-2">Verlauf:</div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {steps.slice(0, stepIdx + 1).map((s, i) => (
                  <div key={i} className={`text-xs py-1 px-2 rounded ${i === stepIdx ? 'bg-indigo-900/40 text-indigo-200' : 'text-slate-500'}`}>
                    <span className="text-slate-600 mr-2">{i}.</span>{s.action}
                  </div>
                ))}
              </div>
            </div>

            {/* Final result — only shown on last step */}
            {isFinalStep && (
              <div className="border border-green-700/40 rounded-lg p-4 bg-green-900/10">
                <div className="text-sm font-semibold text-green-400 mb-3">Fertig — Huffman-Codes:</div>
                <div className="space-y-1">
                  {Object.entries(codes).sort((a, b) => a[1].length - b[1].length).map(([char, code]) => (
                    <div key={char} className="flex items-center gap-3 font-mono text-sm">
                      <span className="text-blue-300 font-bold w-6">{char === ' ' ? '⎵' : char}</span>
                      <span className="text-slate-500">{freq[char]}×</span>
                      <span className="text-emerald-300 font-bold">{code}</span>
                      <span className="text-slate-600 text-xs">({code.length} Bit)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 justify-center pt-2">
              <Button
                variant="ghost"
                onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
                disabled={stepIdx === 0}
              >
                ← Zurück
              </Button>
              <Button
                variant="primary"
                onClick={() => setStepIdx(Math.min(steps.length - 1, stepIdx + 1))}
                disabled={isFinalStep}
              >
                Nächster Schritt →
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      <AlertBox variant="info" title="Huffman-Algorithmus (Schritt für Schritt)">
        <ol className="list-decimal list-inside space-y-1">
          <li>Häufigkeit jedes Zeichens zählen</li>
          <li>Alle als Blätter in Prioritätswarteschlange (seltenste zuerst)</li>
          <li>Die 2 seltensten Knoten entnehmen und zu neuem Elternknoten (Summe) kombinieren</li>
          <li>Wiederholen bis nur noch 1 Knoten übrig (Wurzel)</li>
          <li>Links-Kante = 0, Rechts-Kante = 1 (oder umgekehrt — Aufgabe beachten!)</li>
        </ol>
      </AlertBox>
    </div>
  );
}
