import type { ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  title?: string;
  lang?: string;
}

export function CodeBlock({ children, className = '', title, lang }: CodeBlockProps) {
  return (
    <div className={`rounded-lg overflow-hidden border border-[#1e2d45] ${className}`}>
      {(title || lang) && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#060a14] border-b border-[#1e2d45]">
          {title && <span className="text-[12px] text-slate-500 font-medium">{title}</span>}
          {lang && <span className="text-[11px] text-slate-600 font-mono uppercase">{lang}</span>}
        </div>
      )}
      <pre className="bg-[#060a14] px-4 py-3.5 text-[12.5px] text-blue-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}

interface InlineCodeProps {
  children: ReactNode;
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-[#1e2d45] text-blue-300 font-mono text-[12px]">
      {children}
    </code>
  );
}
