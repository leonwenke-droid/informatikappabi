import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#0b0f1a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1080px] px-8 py-7">
          {children}
        </div>
      </main>
    </div>
  );
}

export function WithLayout({ children }: LayoutProps) {
  return <Layout>{children}</Layout>;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="font-display font-extrabold text-[26px] text-slate-100 tracking-tight leading-none mb-1.5">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[13px] text-slate-500">{subtitle}</p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
