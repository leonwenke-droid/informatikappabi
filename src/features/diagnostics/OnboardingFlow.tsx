import { useState } from 'react';
import type { DiagnosisLevel } from '../../types/learning';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useLearningStore } from '../../store/learningStore';
import { useNavigate } from 'react-router-dom';

const QUESTIONS: { id: string; text: string; options: string[]; weights: Record<DiagnosisLevel, number>[] }[] = [
  {
    id: 'q1',
    text: 'Wie sicher fühlst du dich mit Variablen und Zuweisungen (x ← 5)?',
    options: ['Gar nicht', 'Etwas', 'Sehr sicher'],
    weights: [{ beginner: 2, intermediate: 1, advanced: 0 }, { beginner: 1, intermediate: 2, advanced: 1 }, { beginner: 0, intermediate: 1, advanced: 2 }],
  },
  {
    id: 'q2',
    text: 'Schleifen (für … bis …) und Verzweigungen (wenn … dann …)?',
    options: ['Schwierig', 'Geht so', 'Routine'],
    weights: [{ beginner: 2, intermediate: 1, advanced: 0 }, { beginner: 1, intermediate: 2, advanced: 1 }, { beginner: 0, intermediate: 1, advanced: 2 }],
  },
  {
    id: 'q3',
    text: 'Tracetabellen (Algorithmus mit Tabelle mitlaufen)?',
    options: ['Noch nie', 'Mal gesehen', 'Kann ich'],
    weights: [{ beginner: 2, intermediate: 1, advanced: 0 }, { beginner: 1, intermediate: 2, advanced: 1 }, { beginner: 0, intermediate: 1, advanced: 2 }],
  },
  {
    id: 'q4',
    text: 'Reihungen / Arrays (Index, Schleifen)?',
    options: ['Unklar', 'Grundlagen', 'Sicher'],
    weights: [{ beginner: 2, intermediate: 1, advanced: 0 }, { beginner: 1, intermediate: 2, advanced: 1 }, { beginner: 0, intermediate: 1, advanced: 2 }],
  },
  {
    id: 'q5',
    text: 'Rekursion (Basis + rekursiver Aufruf)?',
    options: ['Nein', 'Ein bisschen', 'Ja'],
    weights: [{ beginner: 2, intermediate: 1, advanced: 0 }, { beginner: 1, intermediate: 2, advanced: 1 }, { beginner: 0, intermediate: 1, advanced: 2 }],
  },
  {
    id: 'q6',
    text: 'OOP: Klassen, Objekte, Vererbung?',
    options: ['Wenig', 'Mittel', 'Fit'],
    weights: [{ beginner: 2, intermediate: 1, advanced: 0 }, { beginner: 1, intermediate: 2, advanced: 1 }, { beginner: 0, intermediate: 1, advanced: 2 }],
  },
  {
    id: 'q7',
    text: 'Datenbanken / SQL?',
    options: ['Neu', 'Basics', 'Stark'],
    weights: [{ beginner: 2, intermediate: 1, advanced: 0 }, { beginner: 1, intermediate: 2, advanced: 1 }, { beginner: 0, intermediate: 1, advanced: 2 }],
  },
  {
    id: 'q8',
    text: 'Automaten / Grammatiken?',
    options: ['Unbekannt', 'Grundidee', 'Kann ich lesen'],
    weights: [{ beginner: 2, intermediate: 1, advanced: 0 }, { beginner: 1, intermediate: 2, advanced: 1 }, { beginner: 0, intermediate: 1, advanced: 2 }],
  },
];

function scoreLevel(answers: Record<string, number>): DiagnosisLevel {
  let b = 0;
  let i = 0;
  let a = 0;
  QUESTIONS.forEach((q) => {
    const idx = answers[q.id];
    if (idx === undefined) return;
    const w = q.weights[idx];
    b += w.beginner;
    i += w.intermediate;
    a += w.advanced;
  });
  if (a >= b && a >= i) return 'advanced';
  if (i >= b) return 'intermediate';
  return 'beginner';
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { setSettings } = useLearningStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const q = QUESTIONS[step];
  const pick = (optIdx: number) => {
    const next = { ...answers, [q.id]: optIdx };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else {
      const level = scoreLevel(next);
      useLearningStore.setState((s) => ({
        diagnosis: {
          ...s.diagnosis,
          answers: next,
          level,
          completed: true,
          completedAt: Date.now(),
        },
        onboardingComplete: true,
      }));
      if (level === 'beginner') {
        setSettings({ pace: 'slow', onlyBasics: true });
      }
      navigate('/lernen/s01/s01-u01');
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-6">
        <p className="text-xs text-slate-500 mb-1">Startdiagnose · Frage {step + 1} / {QUESTIONS.length}</p>
        <h2 className="text-lg font-bold text-slate-100 mb-4">{q.text}</h2>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              className="w-full text-left px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/50 hover:border-blue-500/50 hover:bg-blue-500/10 text-sm text-slate-200 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
        {step > 0 && (
          <Button variant="ghost" className="mt-4" onClick={() => setStep(step - 1)}>
            Zurück
          </Button>
        )}
      </Card>
    </div>
  );
}
