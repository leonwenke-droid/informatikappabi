import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled,
  className = '',
  type = 'button',
  fullWidth,
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold cursor-pointer transition-all duration-150 border select-none';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 disabled:bg-blue-900 disabled:text-blue-700 disabled:border-blue-800',
    secondary: 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-slate-100 border-white/10',
    ghost: 'bg-transparent hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 border-transparent',
    danger: 'bg-red-900/40 hover:bg-red-800/60 text-red-300 border-red-700/50',
  };
  const sizes = {
    sm: 'text-[11.5px] px-2.5 py-1.5',
    md: 'text-[13px] px-4 py-2',
    lg: 'text-[14px] px-6 py-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
