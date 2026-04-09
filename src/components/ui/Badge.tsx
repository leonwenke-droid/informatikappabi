import type { Priority, Block } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const styles: Record<Priority, string> = {
    HOCH: 'bg-red-900/60 text-red-300 border border-red-700/50',
    MITTEL: 'bg-amber-900/60 text-amber-300 border border-amber-700/50',
    BASIS: 'bg-blue-900/60 text-blue-300 border border-blue-700/50',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${styles[priority]} ${className}`}>
      {priority}
    </span>
  );
}

interface BlockTagProps {
  block: Block;
  className?: string;
}

export function BlockTag({ block, className = '' }: BlockTagProps) {
  const styles: Record<Block, string> = {
    B1: 'bg-emerald-500/15 text-emerald-400',
    B2: 'bg-purple-500/15 text-purple-400',
    'B1+B2': 'bg-amber-500/15 text-amber-400',
  };
  const labels: Record<Block, string> = {
    B1: 'Block 1',
    B2: 'Block 2',
    'B1+B2': 'B1 + B2',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${styles[block]} ${className}`}>
      {labels[block]}
    </span>
  );
}

interface DifficultyBadgeProps {
  level: 1 | 2 | 3;
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const labels = ['', 'Einfach', 'Mittel', 'Schwer'];
  const styles = ['', 'text-emerald-400', 'text-amber-400', 'text-red-400'];
  return (
    <span className={`text-xs font-semibold ${styles[level]}`}>
      {'★'.repeat(level)}{'☆'.repeat(3 - level)} {labels[level]}
    </span>
  );
}

interface SourceBadgeProps {
  source: string;
}

export function SourceBadge({ source }: SourceBadgeProps) {
  const isOfficial = source === 'official';
  const isKlausur = source.startsWith('klausur');
  if (isOfficial) {
    return (
      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/40 text-blue-300 border border-blue-700/30">
        📄 Offiziell
      </span>
    );
  }
  if (isKlausur) {
    const year = source.replace('klausur-', '');
    return (
      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/40 text-purple-300 border border-purple-700/30">
        📋 Klausur {year}
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/40 text-slate-400 border border-slate-600/30">
      🧩 Abgeleitet
    </span>
  );
}
