import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, BookOpen, PenTool,
  GitBranch, Database, Timer, AlertCircle, GraduationCap, Map
} from 'lucide-react';
import { getDaysUntilExam, getExamCountdownColor } from '../../utils/countdown';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/lernpfad', icon: Map, label: 'Lernpfad' },
  { path: '/analyse', icon: BarChart3, label: 'Prüfungsanalyse' },
  { path: '/themen', icon: BookOpen, label: 'Themen' },
  { path: '/ueben', icon: PenTool, label: 'Aufgaben üben' },
  { path: '/visualizer', icon: GitBranch, label: 'Visualisierungen' },
  { path: '/sql', icon: Database, label: 'SQL-Referenz' },
  { path: '/klausur', icon: Timer, label: 'Klausurmodus' },
  { path: '/fehlerlog', icon: AlertCircle, label: 'Fehlerlogbuch' },
] as const;

export function Sidebar() {
  const location = useLocation();
  const days = getDaysUntilExam();
  const countdownColor = getExamCountdownColor(days);

  return (
    <aside className="w-[220px] min-h-screen bg-[#0e1525] border-r border-[#1e2d45] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1e2d45]">
        <div className="flex items-center gap-2.5 mb-1">
          <GraduationCap size={20} className="text-blue-400" />
          <h1 className="font-display font-extrabold text-[16px] text-blue-400 tracking-tight">
            InfoAbi 2026
          </h1>
        </div>
        <p className="text-[11px] text-slate-600 pl-[28px]">Niedersachsen · eA</p>
      </div>

      {/* Countdown */}
      <div className="mx-3 mt-3 px-3 py-2.5 rounded-lg bg-[#060a14] border border-[#1e2d45]">
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-extrabold text-[24px] leading-none" style={{ color: countdownColor }}>
            {days}
          </span>
          <span className="text-[11px] text-slate-500">Tage bis 14.05.2026</span>
        </div>
        <div className="mt-1.5 h-1 bg-[#1e2d45] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.max(2, Math.min(100, (days / 180) * 100))}%`,
              background: countdownColor,
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-1.5">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] transition-all duration-150 border-l-2
                ${isActive
                  ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer note */}
      <div className="px-4 py-3 border-t border-[#1e2d45]">
        <p className="text-[10px] text-slate-700 leading-relaxed">
          Inhalte basieren auf KC 2017, Ergänzenden Hinweisen 2021 und Klausuranalyse 2021–2025.
        </p>
        <p className="text-[10px] text-amber-800 mt-1 font-semibold">
          ⚠️ Prognosen ≠ offizielle Vorgaben
        </p>
      </div>
    </aside>
  );
}
