import type { PathUnit } from '../../../types/learning';

const block = (text: string, source: 'official' | 'examPattern2021_2025' | 'didactic') => ({ text, source });

export const UNIT_S04_U01: PathUnit = {
  id: 's04-u01',
  stageId: 's04',
  title: 'Statische Reihungen (Arrays)',
  description: 'Feste Länge, Index von 1 oder 0 je nach Vorgabe — du übst sicheres Lesen und Schreiben.',
  learningGoals: [
    'Länge und gültigen Indexbereich nennen',
    'Mit Schleife alle Elemente besuchen',
    'Summe/Maximum als typisches Muster erkennen',
  ],
  estimatedMinutes: 50,
  tags: ['array', 'reihung', 'index'],
  vocabularyTermIds: ['reihung', 'index', 'schleife'],
  lesson: {
    tiers: {
      beginner: {
        whatIs: block(
          'Eine **statische Reihung** ist eine feste Anzahl Plätze, z. B. `A[1..5]`. Mit dem **Index** greifst du auf genau einen Platz zu.',
          'didactic'
        ),
        whyItMatters: block(
          'Viele Algorithmen verarbeiten Listen von Zahlen oder Zeichen — ohne Arrays gäbe es kein „für alle Elemente“.',
          'didactic'
        ),
        terms: block(
          'Achte in Aufgabenstellungen: Index startet bei **0** oder **1**. Länge n → gültige Indizes z. B. 1..n.',
          'didactic'
        ),
        simplestExample: block(
          'A[1]←7; A[2]←A[1]+1 → A[2]=8',
          'didactic'
        ),
        stepByStep: block(
          '1. Länge und Indexbereich notieren.\n2. Schleifenvariable an Anfang/Ende koppeln.\n3. Nie auf A[n+1] zugreifen.',
          'didactic'
        ),
        typicalMistakes: block(
          '- Index außerhalb 1..n (Off-by-one).\n- Länge mit letztem Index verwechseln.\n- Index und Wert vertauschen.',
          'didactic'
        ),
        miniSummary: block('Array = viele gleichartige Plätze; Index muss erlaubt sein.', 'didactic'),
      },
      standard: {
        whatIs: block(
          'Statische Reihung: Speicherblock fester Größe; Zugriff O(1) per Index in Schulmodellen.',
          'official'
        ),
        whyItMatters: block('Häufig mit Schleifen und Traces kombiniert.', 'examPattern2021_2025'),
        terms: block('Deklaration A[1..n], Initialisierung, partielle Füllung.', 'official'),
        simplestExample: block('Linearer Durchlauf mit Akkumulator.', 'didactic'),
        stepByStep: block('Grenzen der Schleife an Indexbereich binden.', 'official'),
        typicalMistakes: block('Off-by-one; leeres Array Sonderfall.', 'examPattern2021_2025'),
        miniSummary: block('Indexgrenzen explizit.', 'official'),
      },
      examBrief: {
        whatIs: block('Array feste Länge.', 'official'),
        whyItMatters: block('Trace mit Index i.', 'examPattern2021_2025'),
        terms: block('1..n vs 0..n-1.', 'official'),
        simplestExample: block('Summe aller Elemente.', 'didactic'),
        stepByStep: block('Schleifenvariable = Index.', 'official'),
        typicalMistakes: block('Ein Element zu viel.', 'examPattern2021_2025'),
        miniSummary: block('Grenzen prüfen.', 'official'),
      },
    },
    checklistKeys: ['array_index', 'array_schleife', 'array_fehler'],
    checklistLabels: {
      array_index: 'Ich kann für A[1..4] die gültigen Indizes aufzählen.',
      array_schleife: 'Ich kann eine Schleife schreiben, die alle Plätze besucht.',
      array_fehler: 'Ich kenne mindestens einen typischen Off-by-one-Fehler.',
    },
  },
  conceptChecks: [
    {
      id: 'cc-s04-1',
      question: 'Bei Reihung B[1..10]: wie viele Elemente?',
      options: ['9', '10', '11', 'Hängt vom Inhalt ab'],
      correctIndex: 1,
      explanation: 'Von 1 bis 10 einschließlich sind es 10 Plätze.',
    },
    {
      id: 'cc-s04-2',
      question: 'Warum ist A[i] mit i=0 problematisch, wenn die Aufgabe A[1..n] sagt?',
      options: [
        'Gar nicht',
        'Weil 0 meist kein gültiger Index ist',
        'Weil Arrays bei 0 beginnen müssen',
        'Weil n dann 0 wird',
      ],
      correctIndex: 1,
      explanation: 'Bei 1-basierter Angabe ist 0 außerhalb.',
    },
  ],
  exercises: [
    {
      id: 'ex-s04-mini',
      unitId: 's04-u01',
      track: 'mini',
      title: 'Mini: Länge',
      modes: ['free', 'guided', 'showSolution'],
      inlineMc: {
        question: 'C[3..5] — wie viele Elemente?',
        options: ['2', '3', '4', '5'],
        correctIndex: 1,
        explanation: 'Indizes 3,4,5 → drei Elemente.',
      },
    },
    {
      id: 'ex-s04-guided',
      unitId: 's04-u01',
      track: 'guided',
      title: 'Geführt: Summe mit Schleife',
      modes: ['free', 'guided', 'stepHints', 'showSolution'],
      guidedFlow: [
        {
          id: 'a1',
          prompt: 'A[1]=2, A[2]=3. s←0. Für i von 1 bis 2: s←s+A[i]. Endwert s?',
          expectedType: 'keywords',
          keywordAccept: ['5', 'fünf'],
          feedbackWrong: '2+3=5.',
          feedbackRight: 'Korrekt.',
          remediationGlossaryTermIds: ['reihung'],
        },
      ],
      inlineMc: {
        question: 'Maximum von A[1]=4, A[2]=9 mit: max←A[1]; wenn A[2]>max dann max←A[2]. max?',
        options: ['4', '9', '13', '2'],
        correctIndex: 1,
        explanation: '9 ist größer.',
      },
    },
    {
      id: 'ex-s04-standard',
      unitId: 's04-u01',
      track: 'standard',
      title: 'Standard: Indexfehler erkennen',
      modes: ['free', 'guided', 'showSolution'],
      inlineMc: {
        question: 'Welcher Zugriff ist bei T[1..5] ungültig?',
        options: ['T[1]', 'T[5]', 'T[3]', 'T[6]'],
        correctIndex: 3,
        explanation: '6 liegt außerhalb 1..5.',
      },
    },
    {
      id: 'ex-s04-transfer',
      unitId: 's04-u01',
      track: 'transfer',
      title: 'Transfer: Suche',
      modes: ['free', 'guided', 'stepHints', 'showSolution'],
      guidedSteps: [
        'gefunden ← falsch',
        'Für jeden Index: wenn Wert = gesucht dann gefunden ← wahr',
        'Nach der Schleife gefunden auswerten',
      ],
      inlineMc: {
        question: 'Worauf muss man bei „leere Reihung“ achten?',
        options: [
          'Schleife läuft trotzdem einmal',
          'Schleifenrumpf wird oft 0-mal ausgeführt',
          'Index startet bei 2',
          'Kein Unterschied',
        ],
        correctIndex: 1,
        explanation: 'Bei Länge 0 gibt es keinen gültigen ersten Index.',
      },
    },
    {
      id: 'ex-s04-exam',
      unitId: 's04-u01',
      track: 'examStyle',
      title: 'Klausurnah: Index ausdrücken',
      modes: ['free', 'stepHints', 'showSolution'],
      inlineMc: {
        question: 'A[1..5]. Welcher Zugriff ist sicher gültig?',
        options: ['A[0]', 'A[5]', 'A[6]', 'A[k] ohne Definition von k'],
        correctIndex: 1,
        explanation: 'Bei 1..5 ist der Index 5 noch gültig; 0 und 6 sind außerhalb.',
      },
    },
  ],
};
