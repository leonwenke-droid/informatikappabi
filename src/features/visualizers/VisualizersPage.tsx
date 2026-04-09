import { useState } from 'react';
import { PageHeader } from '../../components/layout/Layout';
import { TabBar } from '../../components/ui/TabBar';
import { BSTVisualizer } from './BSTVisualizer';
import { HammingVisualizer } from './HammingVisualizer';
import { DEAVisualizer } from './DEAVisualizer';
import { HuffmanVisualizer } from './HuffmanVisualizer';
import { DataStructuresVisualizer } from './DataStructuresVisualizer';
import { PDAVisualizer } from './PDAVisualizer';
import { GrammarSimulator } from './GrammarSimulator';
import { VisualizerFrame } from '../visualizer/VisualizerFrame';
import { RecursionVisualizer } from './RecursionVisualizer';
import { SQLFlowVisualizer } from './SQLFlowVisualizer';
import { ERRelationalVisualizer } from './ERRelationalVisualizer';
import { MealyVisualizer } from './MealyVisualizer';

const TABS = [
  { id: 'bst', label: 'BST', icon: '🌲' },
  { id: 'rekursion', label: 'Rekursion', icon: '🔂' },
  { id: 'huffman', label: 'Huffman', icon: '📊' },
  { id: 'hamming', label: 'Hamming', icon: '🔢' },
  { id: 'sqlfluss', label: 'SQL-Ablauf', icon: '📑' },
  { id: 'errel', label: 'ER→Tabellen', icon: '🔗' },
  { id: 'dea', label: 'DEA', icon: '⚙' },
  { id: 'mealy', label: 'Mealy', icon: '🔌' },
  { id: 'datenstrukturen', label: 'Stack/Queue', icon: '📚' },
  { id: 'pda', label: 'Kellerautomat', icon: '🔁' },
  { id: 'grammatik', label: 'Grammatik', icon: '📝' },
];

export function VisualizersPage() {
  const [activeTab, setActiveTab] = useState('bst');

  return (
    <div>
      <PageHeader
        title="Interaktive Visualisierungen"
        subtitle="Algorithmen und Datenstrukturen verstehen durch Animation"
      />
      <TabBar
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {activeTab === 'bst' && (
        <VisualizerFrame title="BST" typicalError="Links/rechts vertauscht: im BST ist links kleiner, rechts größer.">
          <BSTVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'rekursion' && (
        <VisualizerFrame title="Rekursion" typicalError="Basisfall vergessen oder Abbruch nicht erreichbar.">
          <RecursionVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'huffman' && (
        <VisualizerFrame title="Huffman" typicalError="Häufigkeit zuerst zählen; seltenste Knoten zuerst zusammenfügen.">
          <HuffmanVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'hamming' && (
        <VisualizerFrame title="Hamming (7,4)" typicalError="Bitpositionen exakt nach offizieller Anlage — nicht umsortieren.">
          <HammingVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'sqlfluss' && (
        <VisualizerFrame title="SQL" typicalError="WHERE vs. HAVING: Zeilen vs. Gruppen filtern.">
          <SQLFlowVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'errel' && (
        <VisualizerFrame title="ER → relational" typicalError="n:m braucht oft eigene Verknüpfungstabelle.">
          <ERRelationalVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'dea' && (
        <VisualizerFrame title="DEA" typicalError="Zustand + gelesenes Zeichen bestimmen den Übergang eindeutig.">
          <DEAVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'mealy' && (
        <VisualizerFrame title="Mealy" typicalError="Ausgabe am Übergang lesen, nicht nur im Zustand raten.">
          <MealyVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'datenstrukturen' && (
        <VisualizerFrame title="Stack / Queue" typicalError="Stack = LIFO, Queue = FIFO — in Aufgabenstellungen genau zuordnen.">
          <DataStructuresVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'pda' && (
        <VisualizerFrame title="Kellerautomat" typicalError="Keller ist zentral: Push/Pop mit Eingabe synchron lesen.">
          <PDAVisualizer />
        </VisualizerFrame>
      )}
      {activeTab === 'grammatik' && (
        <VisualizerFrame title="Grammatik" typicalError="Regeln nur an erstem Nichtterminal (linkes) anwenden — linkeste Ableitung üben.">
          <GrammarSimulator />
        </VisualizerFrame>
      )}
    </div>
  );
}
