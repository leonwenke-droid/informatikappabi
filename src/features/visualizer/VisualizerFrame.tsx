import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export type VisualizerLearningMode = 'demo' | 'learn' | 'step';

interface VisualizerFrameProps {
  title: string;
  typicalError?: string;
  stepDescription?: string;
  children: React.ReactNode;
}

export function VisualizerFrame({ title, typicalError, stepDescription, children }: VisualizerFrameProps) {
  const [mode, setMode] = useState<VisualizerLearningMode>('learn');
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider mr-2">{title}</span>
        {(['demo', 'learn', 'step'] as const).map((m) => (
          <Button key={m} size="sm" variant={mode === m ? 'primary' : 'secondary'} onClick={() => setMode(m)}>
            {m === 'demo' ? 'Demo' : m === 'learn' ? 'Lernen' : 'Schritt'}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={() => setPaused(!paused)}>
          {paused ? 'Weiter' : 'Pause'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Zurück
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setStep((s) => s + 1)}>
          Vor
        </Button>
      </div>

      <Card className="p-3 bg-slate-900/50 border-slate-700">
        <p className="text-xs text-slate-400 mb-1">Modus</p>
        <p className="text-sm text-slate-200">
          {mode === 'demo' && 'Demo: Beobachte die Animation / das Beispiel ohne Pflichtfragen.'}
          {mode === 'learn' && 'Lernen: Nutze die Erklärungen in der Visualisierung; Schalter und Eingaben bewusst ausprobieren.'}
          {mode === 'step' && (stepDescription ?? 'Schritt-für-Schritt: Arbeite die Zustände langsam durch (Step-Zähler oben).')}
        </p>
        {typicalError && (
          <p className="text-xs text-amber-200/90 mt-2">
            <strong>Typischer Fehler:</strong> {typicalError}
          </p>
        )}
        {paused && <p className="text-xs text-slate-500 mt-2">Pausiert — drücke Weiter.</p>}
      </Card>

      <div className={paused ? 'opacity-50 pointer-events-none' : ''}>{children}</div>
    </div>
  );
}
