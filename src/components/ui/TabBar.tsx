interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabBar({ tabs, activeTab, onChange, className = '' }: TabBarProps) {
  return (
    <div className={`flex gap-0.5 bg-[#060a14] rounded-lg p-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 cursor-pointer border-none outline-none
            ${activeTab === tab.id
              ? 'bg-[#1e2d45] text-slate-100 font-semibold'
              : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
