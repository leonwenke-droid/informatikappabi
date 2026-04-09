import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  GitBranch,
  Database,
  BarChart3,
  Timer,
  AlertCircle,
  GraduationCap,
  ListTree,
  BookMarked,
  Layers,
} from 'lucide-react';
import { getDaysUntilExam, getExamCountdownColor } from '../../utils/countdown';
import { useLearningStore } from '../../store/learningStore';

const PRIMARY_NAV = [
  { path: '/', icon: LayoutDashboard, label: 'Start' },
  { path: '/lernpfad', icon: ListTree, label: 'Von Grund auf' },
  { path: '/grundlagen', icon: Layers, label: 'Grundlagen' },
  { path: '/themen', icon: BookOpen, label: 'Themenübersicht' },
  { path: '/ueben', icon: PenTool, label: 'Geführte Übungen' },
  { path: '/uebungspool', icon: PenTool, label: 'Aufgabenpool' },
  { path: '/visualizer', icon: GitBranch, label: 'Visualisierungen' },
  { path: '/sql', icon: Database, label: 'SQL-Referenz' },
  { path: '/glossar', icon: BookMarked, label: 'Glossar' },
  { path: '/fehlerlog', icon: AlertCircle, label: 'Fehlerlogbuch' },
] as const;

const SECONDARY_NAV = [
  { path: '/analyse', icon: BarChart3, label: 'Prüfungsanalyse' },
  { path: '/klausur', icon: Timer, label: 'Klausurmodus' },
] as const;

export function Sidebar() {
  const location = useLocation();
  const showExamCountdown = useLearningStore((s) => s.settings.showExamCountdown);
  const days = getDaysUntilExam();
  const countdownColor = getExamCountdownColor(days);

  const linkClass = (path: string) => {
    const isActive =
      path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`);
    return `flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-[13px] transition-all duration-150 border-l-2
      ${isActive
        ? 'bg-blue-500/10 border-blue-500 text-blue-400 font-semibold'
        : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
      }`;
  };

  return (
    <aside className="w-[230px] min-h-screen bg-[#0e1525] border-r border-[#1e2d45] flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-[#1e2d45]">
        <div className="flex items-center gap-2.5 mb-1">
          <GraduationCap size={20} className="text-blue-400" />
          <h1 className="font-display font-extrabold text-[16px] text-blue-400 tracking-tight">InfoAbi 2026</h1>
        </div>
        <p className="text-[11px] text-slate-600 pl-[28px]">Niedersachsen · eA</p>
      </div>

      {showExamCountdown && (
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-lg bg-[#060a14] border border-[#1e2d45]">
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-extrabold text-[24px] leading-none" style={{ color: countdownColor }}>
              {days}
            </span>
            <span className="text-[11px] text-slate-500">Tage bis 14.05.2026</span>
          </div>
        </div>
      )}

      <nav className="flex-1 py-3 px-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-3 mb-1">Lernen</div>
        {PRIMARY_NAV.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} className={linkClass(path)}>
            <Icon size={15} className="flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-3 mt-4 mb-1">Prüfung</div>
        {SECONDARY_NAV.map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} className={linkClass(path)}>
            <Icon size={15} className="flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        <NavLink to="/onboarding" className={`${linkClass('/onboarding')} mt-4 opacity-80`}>
          <BookMarked size={15} />
          Diagnose
        </NavLink>
      </nav>

      <div className="px-4 py-3 border-t border-[#1e2d45]">
        <p className="text-[10px] text-slate-700 leading-relaxed">
          Inhalte: KC 2017, Ergänzende Hinweise 2021, Hinweise 2026; Muster aus eA 2021–2025.
        </p>
        <p className="text-[10px] text-slate-600 mt-1">Wahrscheinlichkeitsangaben nur unter „Prüfungsanalyse“.</p>
      </div>
    </aside>
  );
}
