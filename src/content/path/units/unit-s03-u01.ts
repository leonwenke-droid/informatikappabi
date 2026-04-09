import type { PathUnit } from '../../../types/learning';

const block = (text: string, source: 'official' | 'examPattern2021_2025' | 'didactic') => ({ text, source });

export const UNIT_S03_U01: PathUnit = {
  id: 's03-u01',
  stageId: 's03',
  title: 'Tracetabellen — Algorithmus mitlaufen',
  description: 'Du protokollierst jeden Schritt eines Algorithmus in einer Tabelle.',
  learningGoals: [
    'Spalten für Variablen und Bedingungen sauber anlegen',
    'Jede Zeile als einen oder wenige Schritte interpretieren',
    'Aus dem Trace Ergebnis und Endzustand ablesen',
  ],
  estimatedMinutes: 55,
  tags: ['trace', 'algorithmus'],
  vocabularyTermIds: ['trace', 'algorithmus', 'variable'],
  lesson: {
    tiers: {
      beginner: {
        whatIs: block(
          'Ein **Trace** ist eine Tabelle, in der du für jeden Schritt notierst, welche Werte deine Variablen haben und welche Zeile des Algorithmus gerade dran ist.',
          'didactic'
        ),
        whyItMatters: block(
          'So siehst du Fehler sofort (z. B. falsche Schleifenzahl) und kannst in Prüfungen Punkte sichern, weil du dein Vorgehen belegst.',
          'didactic'
        ),
        terms: block(
          'Spalten = Variablen + ggf. „Zeile“ oder „Bedingung“. Jede Zeile = ein kleiner Fortschritt.',
          'didactic'
        ),
        simplestExample: block(
          'Algorithmus: x←1, x←x+2, gib x aus.\nTrace: Zeile1 x=1, Zeile2 x=3, Ausgabe 3.',
          'didactic'
        ),
        stepByStep: block(
          '1. Alle Variablen auflisten.\n2. Startwerte eintragen.\n3. Algorithmus Zeile für Zeile: neue Werte in nächste Tabellenzeile.\n4. Bei Schleife: nach Rumpf zur Bedingung zurück.',
          'didactic'
        ),
        typicalMistakes: block(
          '- Zu große Sprünge in einer Zeile.\n- Alte und neue Werte vermischen.\n- Schleifenabbruch zu früh oder zu spät.',
          'didactic'
        ),
        miniSummary: block('Trace = filmische Einzelbilder des Algorithmus.', 'didactic'),
      },
      standard: {
        whatIs: block(
          'Tracetabelle dokumentiert Zustandsübergänge eines Algorithmus; Standard in Prüfungen und Unterricht.',
          'official'
        ),
        whyItMatters: block('Nachweis des Verständnisses; Fehlersuche; Vergleich mit erwarteter Ausgabe.', 'examPattern2021_2025'),
        terms: block('PC/Programmzähler optional; Invariante bei Schleifen.', 'official'),
        simplestExample: block('Kurzer Lineartrace + ein Schleifendurchlauf.', 'didactic'),
        stepByStep: block('Strikte Reihenfolge; Zuweisung erst nach Auswertung des Ausdrucks.', 'official'),
        typicalMistakes: block('Nebenwirkungen in falscher Reihenfolge ausführen.', 'examPattern2021_2025'),
        miniSummary: block('Konsistenz der Spalten über alle Zeilen.', 'official'),
      },
      examBrief: {
        whatIs: block('Trace = Tabelle.', 'official'),
        whyItMatters: block('Häufige Prüfungsform.', 'examPattern2021_2025'),
        terms: block('Variablenzustand pro Schritt.', 'official'),
        simplestExample: block('3–5 Zeilen.', 'didactic'),
        stepByStep: block('Schleife: mehrere Zeilen pro Durchlauf.', 'official'),
        typicalMistakes: block('Zu wenig Zeilen.', 'examPattern2021_2025'),
        miniSummary: block('Jeder Schritt sichtbar machen.', 'official'),
      },
    },
    checklistKeys: ['trace_spalten', 'trace_schleife', 'trace_ausgabe'],
    checklistLabels: {
      trace_spalten: 'Ich kann für ein Mini-Programm die Spalten der Trace-Tabelle nennen.',
      trace_schleife: 'Ich habe mindestens eine Schleife mit 2 Durchläufen getraced.',
      trace_ausgabe: 'Ich kann aus dem Trace die endgültige Ausgabe ablesen.',
    },
  },
  conceptChecks: [
    {
      id: 'cc-s03-1',
      question: 'Wozu dient eine Tracetabelle primär?',
      options: [
        'Um das Programm schneller zu machen',
        'Um Zustände Schritt für Schritt zu dokumentieren',
        'Um Syntaxfehler zu finden',
        'Um Grafiken zu zeichnen',
      ],
      correctIndex: 1,
      explanation: 'Trace dokumentiert den Ablauf der Variablenzustände.',
    },
    {
      id: 'cc-s03-2',
      question: 'Nach `x ← x + 1` in einer neuen Zeile: Was wurde zuerst gemacht?',
      options: [
        'x wurde sofort erhöht ohne Lesen',
        'Der alte Wert von x wurde gelesen, addiert, dann zugewiesen',
        'x wurde gelöscht',
      ],
      correctIndex: 1,
      explanation: 'Rechte Seite auswerten mit altem x, dann zuweisen.',
    },
  ],
  exercises: [
    {
      id: 'ex-s03-mini',
      unitId: 's03-u01',
      track: 'mini',
      title: 'Mini: Trace-Länge',
      modes: ['free', 'guided', 'showSolution'],
      inlineMc: {
        question: 'Sequenz: a←1; a←a+1; a←a*2 — Wie viele Zuweisungen?',
        options: ['1', '2', '3', '4'],
        correctIndex: 2,
        explanation: 'Drei Zuweisungen an a.',
      },
    },
    {
      id: 'ex-s03-guided',
      unitId: 's03-u01',
      track: 'guided',
      title: 'Geführt: Schleifen-Trace',
      modes: ['free', 'guided', 'stepHints', 'showSolution'],
      guidedFlow: [
        {
          id: 't1',
          prompt: 's←0, i←1. Schleife solange i≤2: s←s+i; i←i+1. Wert von s nach vollständigem Durchlauf?',
          expectedType: 'mc',
          options: ['1', '2', '3', '4'],
          correctOptionIndex: 2,
          feedbackWrong: 'Durchlauf 1: s=0+1=1, i=2. Durchlauf 2: s=1+2=3, i=3, Schleife endet.',
          feedbackRight: 's = 1 + 2 = 3.',
          remediationGlossaryTermIds: ['trace'],
        },
      ],
      inlineMc: {
        question: 'Endwert n nach: n←0; für k von 1 bis 2: n←n+k',
        options: ['2', '3', '1', '0'],
        correctIndex: 1,
        explanation: '0+1+2=3.',
      },
    },
    {
      id: 'ex-s03-standard',
      unitId: 's03-u01',
      track: 'standard',
      title: 'Standard: Bedingung im Trace',
      modes: ['free', 'guided', 'showSolution'],
      inlineMc: {
        question: 'x←3. Wenn x>2 dann x←x-2. Endwert x?',
        options: ['1', '3', '0', '5'],
        correctIndex: 0,
        explanation: 'Bedingung wahr, x wird 1.',
      },
    },
    {
      id: 'ex-s03-transfer',
      unitId: 's03-u01',
      track: 'transfer',
      title: 'Transfer: Ausgabe vorhersagen',
      modes: ['free', 'guided', 'stepHints', 'showSolution'],
      guidedSteps: [
        'Initialisiere Produkt p←1 und Zähler i←1.',
        'Schleife i=1,2,3: p←p*i.',
        'Lies p nach der Schleife.',
      ],
      inlineMc: {
        question: 'p←1; für i von 1 bis 3: p←p*i — Wert p?',
        options: ['3', '6', '9', '1'],
        correctIndex: 1,
        explanation: '1*1*2*3 — warte, Schleife: i=1 p=1, i=2 p=2, i=3 p=6.',
      },
    },
    {
      id: 'ex-s03-exam',
      unitId: 's03-u01',
      track: 'examStyle',
      title: 'Klausurnah: mehrstufig',
      modes: ['free', 'stepHints', 'showSolution'],
      inlineMc: {
        question: 'a←2;b←3;a←a+b;b←a-b; Endwert b?',
        options: ['2', '3', '5', '0'],
        correctIndex: 0,
        explanation: 'a=5, b=5-3=2.',
      },
    },
  ],
};
