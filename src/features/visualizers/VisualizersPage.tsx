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

const TABS = [
  { id: 'bst', label: 'BST', icon: '🌲' },
  { id: 'huffman', label: 'Huffman', icon: '📊' },
  { id: 'hamming', label: 'Hamming', icon: '🔢' },
  { id: 'dea', label: 'DEA', icon: '⚙' },
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

      {activeTab === 'bst' && <BSTVisualizer />}
      {activeTab === 'huffman' && <HuffmanVisualizer />}
      {activeTab === 'hamming' && <HammingVisualizer />}
      {activeTab === 'dea' && <DEAVisualizer />}
      {activeTab === 'datenstrukturen' && <DataStructuresVisualizer />}
      {activeTab === 'pda' && <PDAVisualizer />}
      {activeTab === 'grammatik' && <GrammarSimulator />}
    </div>
  );
}
