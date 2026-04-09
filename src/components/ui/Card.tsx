import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'ghost';
}

export function Card({ children, className = '', onClick, variant = 'default' }: CardProps) {
  const base = 'rounded-xl border';
  const variants = {
    default: 'bg-[#0e1525] border-[#1e2d45]',
    elevated: 'bg-[#111827] border-[#1e2d45]',
    ghost: 'bg-white/[0.03] border-white/[0.06]',
  };
  const interactive = onClick ? 'cursor-pointer transition-all duration-200 hover:bg-blue-500/5 hover:border-blue-500/30' : '';

  return (
    <div
      className={`${base} ${variants[variant]} ${interactive} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
}

export function SectionCard({ title, subtitle, children, className = '', headerRight }: SectionCardProps) {
  return (
    <Card className={`p-5 ${className}`}>
      {(title || subtitle) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-[15px] font-bold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerRight && <div className="flex-shrink-0 ml-4">{headerRight}</div>}
        </div>
      )}
      {children}
    </Card>
  );
}

interface AlertBoxProps {
  variant: 'warning' | 'info' | 'success' | 'danger';
  title?: string;
  children: ReactNode;
  className?: string;
  icon?: string;
}

export function AlertBox({ variant, title, children, className = '', icon }: AlertBoxProps) {
  const styles = {
    warning: 'bg-amber-500/[0.08] border-amber-500/25 text-amber-300',
    info: 'bg-blue-500/[0.08] border-blue-500/20 text-blue-300',
    success: 'bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-300',
    danger: 'bg-red-500/[0.08] border-red-500/25 text-red-300',
  };
  const icons = {
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅',
    danger: '🚫',
  };

  return (
    <div className={`border rounded-xl p-4 ${styles[variant]} ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-2">
          <span>{icon ?? icons[variant]}</span>
          <span className="font-bold text-[13px]">{title}</span>
        </div>
      )}
      <div className="text-[13px] leading-relaxed">{children}</div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max, color = '#3b82f6', className = '', showLabel }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 bg-[#1e2d45] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-bold min-w-[32px] text-right" style={{ color }}>
          {pct}%
        </span>
      )}
    </div>
  );
}
