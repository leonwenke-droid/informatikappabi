import { useState, useRef } from 'react';
import { SectionCard, AlertBox } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { bstFromArray, traversePreorder, traverseInorder, traversePostorder } from '../../lib/evaluator/localEvaluator';
import type { BSTNode } from '../../lib/evaluator/localEvaluator';

const W = 620;
const NODE_R = 20;

interface PositionedNode {
  value: number;
  x: number;
  y: number;
  depth: number;
}

interface Edge {
  x1: number; y1: number; x2: number; y2: number;
}

function positionTree(
  node: BSTNode | null,
  x: number, y: number, spread: number,
  nodes: PositionedNode[], edges: Edge[], depth = 0
): void {
  if (!node) return;
  nodes.push({ value: node.value, x, y, depth });
  if (node.left) {
    edges.push({ x1: x, y1: y, x2: x - spread, y2: y + 65 });
    positionTree(node.left, x - spread, y + 65, spread / 1.7, nodes, edges, depth + 1);
  }
  if (node.right) {
    edges.push({ x1: x, y1: y, x2: x + spread, y2: y + 65 });
    positionTree(node.right, x + spread, y + 65, spread / 1.7, nodes, edges, depth + 1);
  }
}

const DEFAULT_VALUES = [10, 5, 15, 3, 7, 20, 1];

type TraversalType = 'pre' | 'in' | 'post' | null;

export function BSTVisualizer() {
  const [values, setValues] = useState<number[]>(DEFAULT_VALUES);
  const [input, setInput] = useState('');
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [traversalType, setTraversalType] = useState<TraversalType>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tree = bstFromArray(values);
  const nodes: PositionedNode[] = [];
  const edges: Edge[] = [];
  if (tree) positionTree(tree, W / 2, 38, 140, nodes, edges);
  const height = Math.max(180, (nodes.length > 7 ? 280 : 220));

  const addValue = () => {
    const v = parseInt(input);
    if (!isNaN(v) && !values.includes(v) && values.length < 15) {
      setValues([...values, v]);
      setInput('');
      setTraversalResult([]);
      setTraversalType(null);
    }
  };

  const doTraversal = (type: TraversalType) => {
    if (!tree || !type) return;
    if (animRef.current) clearTimeout(animRef.current);

    const result =
      type === 'pre' ? traversePreorder(tree) :
      type === 'in' ? traverseInorder(tree) :
      traversePostorder(tree);

    setTraversalResult(result);
    setTraversalType(type);
    setHighlighted(null);

    let i = 0;
    const step = () => {
      if (i < result.length) {
        setHighlighted(result[i]);
        i++;
        animRef.current = setTimeout(step, 500);
      } else {
        setTimeout(() => setHighlighted(null), 1000);
      }
    };
    step();
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Binärsuchbaum (BST) — Interaktiv">
        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addValue()}
            placeholder="Zahl eingeben"
            className="bg-[#060a14] border border-[#1e2d45] rounded-lg text-slate-200 font-mono text-[13px] px-3 py-1.5 w-32 outline-none focus:border-blue-500"
          />
          <Button variant="primary" size="sm" onClick={addValue}>+ Einfügen</Button>
          <Button variant="secondary" size="sm" onClick={() => { setValues([]); setTraversalResult([]); setTraversalType(null); setHighlighted(null); }}>Leeren</Button>
          <Button variant="secondary" size="sm" onClick={() => { setValues(DEFAULT_VALUES); setTraversalResult([]); setTraversalType(null); setHighlighted(null); }}>Reset</Button>
        </div>

        {/* Traversal buttons */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-[12.5px] text-slate-500">Traversierung:</span>
          {(['pre', 'in', 'post'] as TraversalType[]).map((t) => (
            <Button
              key={t!}
              variant={traversalType === t ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => doTraversal(t)}
              disabled={!tree}
            >
              {t === 'pre' ? 'Preorder (VLR)' : t === 'in' ? 'Inorder (LVR)' : 'Postorder (LRV)'}
            </Button>
          ))}
        </div>

        {/* Tree canvas */}
        <div
          className="relative bg-black/30 rounded-xl overflow-hidden"
          style={{ height }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${W} ${height}`}>
            {edges.map((e, i) => (
              <line
                key={i}
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke="#1e2d45" strokeWidth={1.5}
              />
            ))}
          </svg>
          {nodes.map((n) => (
            <div
              key={n.value}
              className={`absolute flex items-center justify-center rounded-full font-bold font-mono text-[12.5px] border-2 transition-all duration-300 select-none`}
              style={{
                width: NODE_R * 2,
                height: NODE_R * 2,
                left: n.x - NODE_R,
                top: n.y - NODE_R,
                background: highlighted === n.value ? '#1a3322' : '#1e3a5f',
                borderColor: highlighted === n.value ? '#10b981' : '#3b82f6',
                color: highlighted === n.value ? '#34d399' : '#60a5fa',
                transform: highlighted === n.value ? 'scale(1.2)' : 'scale(1)',
                zIndex: 2,
                boxShadow: highlighted === n.value ? '0 0 12px rgba(16,185,129,0.4)' : 'none',
              }}
            >
              {n.value}
            </div>
          ))}
          {values.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-[13px]">
              Noch keine Werte — Zahl eingeben und einfügen
            </div>
          )}
        </div>

        {/* Traversal result */}
        {traversalResult.length > 0 && (
          <div className="mt-4">
            <div className="text-[13px] font-bold text-slate-200 mb-2">
              {traversalType === 'pre' ? 'Preorder (VLR)' : traversalType === 'in' ? 'Inorder (LVR)' : 'Postorder (LRV)'}:
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {traversalResult.map((v, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg font-mono font-bold text-[13px] border transition-all duration-300"
                  style={{
                    background: highlighted === v ? '#1a3322' : '#1e2d45',
                    borderColor: highlighted === v ? '#10b981' : '#334155',
                    color: highlighted === v ? '#34d399' : '#60a5fa',
                    transform: highlighted === v ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      <AlertBox variant="info" title="BST-Eigenschaften (offiziell)">
        <ul className="space-y-1 list-none">
          <li>• <strong>Inorder (LVR)</strong> eines BST ergibt immer aufsteigende Reihenfolge!</li>
          <li>• Einfügen: Vergleiche mit Knoten → links wenn kleiner, rechts wenn größer</li>
          <li>• Offizielle Operationen: <code className="font-mono text-[11px] bg-black/30 px-1 rounded">hasLeft()</code> / <code className="font-mono text-[11px] bg-black/30 px-1 rounded">hasRight()</code> immer vor <code className="font-mono text-[11px] bg-black/30 px-1 rounded">getLeft()</code> / <code className="font-mono text-[11px] bg-black/30 px-1 rounded">getRight()</code> prüfen!</li>
          <li>• Duplikate werden ignoriert (kein Duplikat im BST)</li>
        </ul>
      </AlertBox>
    </div>
  );
}
