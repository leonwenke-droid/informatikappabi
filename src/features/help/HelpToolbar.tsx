import type { ExplanationTier } from '../../types/learning';
import { Button } from '../../components/ui/Button';

export interface HelpToolbarProps {
  tier: ExplanationTier;
  onTierChange: (t: ExplanationTier) => void;
  onlyBasics: boolean;
  onToggleOnlyBasics: (v: boolean) => void;
  paceSlow: boolean;
  onTogglePace: (v: boolean) => void;
  onShowMiniExample?: () => void;
  onUnsure?: () => void;
}

export function HelpToolbar({
  tier,
  onTierChange,
  onlyBasics,
  onToggleOnlyBasics,
  paceSlow,
  onTogglePace,
  onShowMiniExample,
  onUnsure,
}: HelpToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 mb-4">
      <span className="text-[11px] text-slate-500 w-full uppercase tracking-wider">Hilfe</span>
      <div className="flex flex-wrap gap-1.5">
        {(['beginner', 'standard', 'examBrief'] as const).map((t) => (
          <Button
            key={t}
            size="sm"
            variant={tier === t ? 'primary' : 'secondary'}
            onClick={() => onTierChange(t)}
          >
            {t === 'beginner' ? 'Einfach' : t === 'standard' ? 'Standard' : 'Prüfung kurz'}
          </Button>
        ))}
      </div>
      <Button size="sm" variant={onlyBasics ? 'primary' : 'secondary'} onClick={() => onToggleOnlyBasics(!onlyBasics)}>
        Nur Grundlagen
      </Button>
      <Button size="sm" variant={paceSlow ? 'primary' : 'secondary'} onClick={() => onTogglePace(!paceSlow)}>
        Langsamer
      </Button>
      {onShowMiniExample && (
        <Button size="sm" variant="ghost" onClick={onShowMiniExample}>
          Mini-Beispiel
        </Button>
      )}
      {onUnsure && (
        <Button size="sm" variant="ghost" onClick={onUnsure}>
          Ich bin unsicher
        </Button>
      )}
    </div>
  );
}
