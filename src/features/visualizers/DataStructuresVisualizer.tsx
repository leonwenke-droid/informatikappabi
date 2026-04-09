import { useState } from 'react';
import { SectionCard, AlertBox } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CodeBlock } from '../../components/ui/CodeBlock';

type DSType = 'stack' | 'queue';

export function DataStructuresVisualizer() {
  const [dsType, setDsType] = useState<DSType>('stack');
  const [items, setItems] = useState<string[]>(['A', 'B', 'C']);
  const [input, setInput] = useState('');
  const [lastOp, setLastOp] = useState<string>('');

  const push = () => {
    if (!input.trim()) return;
    if (dsType === 'stack') {
      setItems([input.trim(), ...items]);
      setLastOp(`push("${input.trim()}") → oben auf Stapel`);
    } else {
      setItems([...items, input.trim()]);
      setLastOp(`enqueue("${input.trim()}") → hinten in Schlange`);
    }
    setInput('');
  };

  const pop = () => {
    if (items.length === 0) return;
    if (dsType === 'stack') {
      const top = items[0];
      setItems(items.slice(1));
      setLastOp(`pop() → "${top}" entnommen (war oben)`);
    } else {
      const head = items[0];
      setItems(items.slice(1));
      setLastOp(`dequeue() → "${head}" entnommen (war vorne)`);
    }
  };

  const peek = () => {
    if (items.length === 0) return;
    if (dsType === 'stack') {
      setLastOp(`top() → "${items[0]}" (NUR gelesen, Stack unverändert)`);
    } else {
      setLastOp(`head() → "${items[0]}" (NUR gelesen, Queue unverändert)`);
    }
  };

  const switchType = (t: DSType) => {
    setDsType(t);
    setItems(['A', 'B', 'C']);
    setLastOp('');
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Stack & Queue Visualizer" subtitle="Offizielle Operationen interaktiv">
        <div className="flex gap-2 mb-5">
          <Button variant={dsType === 'stack' ? 'primary' : 'secondary'} size="sm" onClick={() => switchType('stack')}>
            Stack (LIFO)
          </Button>
          <Button variant={dsType === 'queue' ? 'primary' : 'secondary'} size="sm" onClick={() => switchType('queue')}>
            Queue (FIFO)
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visual representation */}
          <div>
            <div className="text-[12px] text-slate-500 mb-2">
              {dsType === 'stack' ? 'Stapel (oben = erste Zeile)' : 'Schlange (vorne = links)'}
            </div>
            <div className={`min-h-[180px] rounded-xl border border-[#1e2d45] bg-black/30 p-3 ${dsType === 'queue' ? 'flex items-center gap-2 overflow-x-auto' : 'flex flex-col gap-1.5'}`}>
              {items.length === 0 && (
                <div className="text-[12px] text-slate-600 m-auto">
                  isEmpty() → wahr
                </div>
              )}
              {items.map((item, i) => {
                const isTop = dsType === 'stack' ? i === 0 : i === 0;
                return (
                  <div
                    key={i}
                    className={`px-4 py-2.5 rounded-lg font-mono font-bold text-[14px] border transition-all flex items-center justify-between
                      ${isTop
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-[#0e1525] border-[#1e2d45] text-slate-400'
                      }`}
                    style={{ minWidth: dsType === 'queue' ? 52 : undefined }}
                  >
                    <span>{item}</span>
                    {isTop && (
                      <span className="text-[10px] text-blue-500 font-normal ml-2">
                        {dsType === 'stack' ? '← top()' : '← head()'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-2 text-[12px] text-slate-500">
              {dsType === 'stack'
                ? `isEmpty(): ${items.length === 0 ? 'wahr' : 'falsch'} | getLength(): ${items.length}`
                : `isEmpty(): ${items.length === 0 ? 'wahr' : 'falsch'} | ${items.length} Elemente`
              }
            </div>
          </div>

          {/* Controls */}
          <div>
            <div className="flex gap-2 mb-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && push()}
                placeholder="Element"
                className="flex-1 bg-[#060a14] border border-[#1e2d45] rounded-lg text-slate-200 font-mono text-[13px] px-3 py-1.5 outline-none focus:border-blue-500"
                maxLength={6}
              />
              <Button variant="primary" size="sm" onClick={push} disabled={!input.trim()}>
                {dsType === 'stack' ? 'push()' : 'enqueue()'}
              </Button>
            </div>
            <div className="flex gap-2 mb-4">
              <Button variant="secondary" size="sm" onClick={peek} disabled={items.length === 0}>
                {dsType === 'stack' ? 'top()' : 'head()'}
              </Button>
              <Button variant="danger" size="sm" onClick={pop} disabled={items.length === 0}>
                {dsType === 'stack' ? 'pop()' : 'dequeue()'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setItems([]); setLastOp(''); }}>
                Leeren
              </Button>
            </div>

            {lastOp && (
              <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-lg p-3">
                <div className="text-[11px] text-slate-500 mb-1">Letzte Operation:</div>
                <div className="font-mono text-[12.5px] text-emerald-300">{lastOp}</div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Offizielle Operationen (Ergänzende Hinweise 2021, §2)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeBlock title="Stack (LIFO)">
{`Stack()
isEmpty(): Wahrheitswert
top(): Inhaltstyp    // liest NUR!
push(inhalt)         // oben drauflegen
pop(): Inhaltstyp    // entnehmen`}
          </CodeBlock>
          <CodeBlock title="Queue (FIFO)">
{`Queue()
isEmpty(): Wahrheitswert
head(): Inhaltstyp   // liest NUR!
enqueue(inhalt)      // hinten einreihen
dequeue(): Inhaltstyp // vorne entnehmen`}
          </CodeBlock>
        </div>
      </SectionCard>

      <AlertBox variant="warning" title="Häufige Fehler">
        <ul className="space-y-1.5">
          <li>• <strong>top() entnimmt NICHT</strong> — nur lesen! pop() entnimmt.</li>
          <li>• <strong>LIFO vs. FIFO</strong>: Stack = Last In First Out, Queue = First In First Out</li>
          <li>• <strong>isEmpty() prüfen</strong> vor JEDEM pop()/top()/dequeue()/head()!</li>
          <li>• <strong>DynArray-Index</strong>: beginnt mit 0 (offiziell festgelegt)</li>
        </ul>
      </AlertBox>
    </div>
  );
}
