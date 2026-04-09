import type { PathUnit } from '../../../types/learning';

const block = (text: string, source: 'official' | 'examPattern2021_2025' | 'didactic') => ({ text, source });

export const UNIT_S02B_U01: PathUnit = {
  id: 's02b-u01',
  stageId: 's02b',
  title: 'Selektion und Schleifen',
  description: 'Du steuerst Abläufe mit wenn/dann und Wiederholungen — die Basis für fast alle Algorithmen.',
  learningGoals: [
    'Bedingte Verzweigung und Schleife unterscheiden',
    'Zählschleife vs. bedingte Schleife einordnen',
    'Abbruchbedingungen erkennen und typische Fehler vermeiden',
  ],
  estimatedMinutes: 45,
  prerequisiteUnitIds: ['s02a-u01'],
  tags: ['if', 'schleife', 'kontrolle'],
  vocabularyTermIds: ['selektion', 'schleife', 'bedingung'],
  lesson: {
    tiers: {
      beginner: {
        whatIs: block(
          '**Wenn** etwas wahr ist, mache A, **sonst** B — das ist eine Verzweigung. Eine **Schleife** wiederholt einen Block, solange eine Bedingung passt oder bis eine feste Anzahl erreicht ist.',
          'didactic'
        ),
        whyItMatters: block(
          'Damit kannst du viele ähnliche Schritte nicht hundertmal hinschreiben, sondern einmal formulieren und vom Computer (oder im Trace) abarbeiten lassen.',
          'didactic'
        ),
        terms: block(
          '- **Selektion**: Auswahl zwischen Alternativen.\n- **Schleife**: Wiederholung mit Abbruchbedingung.\n- **Zähler**: Läuft oft von Start bis Ende mit fester Schrittweite.',
          'didactic'
        ),
        simplestExample: block(
          'i ← 1\nSolange i ≤ 3:\n  gib i aus\n  i ← i + 1',
          'didactic'
        ),
        stepByStep: block(
          '1. Bedingung auswerten (wahr/falsch).\n2. Bei Wahr: dann-Zweig ausführen.\n3. Bei Schleife: nach dem Block wieder zur Bedingung springen, bis sie falsch ist.',
          'didactic'
        ),
        typicalMistakes: block(
          '- **Endlosschleife**: Bedingung wird nie falsch.\n- **Off-by-one**: Schleife läuft einmal zu wenig oder zu oft.\n- **Doppelte Bedingung**: gleiche Prüfung an zwei Stellen widersprüchlich.',
          'didactic'
        ),
        miniSummary: block(
          'Verzweigung = Entscheidung. Schleife = Wiederholung mit klarer Abbruchregel.',
          'didactic'
        ),
      },
      standard: {
        whatIs: block(
          'Kontrollstrukturen strukturieren den Ablauf: Sequenz, Selektion, Wiederholung. In Pseudocode üblich: wenn/dann/sonst, solange, für-Schleifen.',
          'official'
        ),
        whyItMatters: block(
          'Prüfungen verlangen Lesen und Ergänzen von Kontrollstrukturen sowie Traces durch Schleifen.',
          'examPattern2021_2025'
        ),
        terms: block(
          'Kopf- vs. fußgesteuerte Schleifen je nach Notation; Invarianten helfen bei Argumentation.',
          'official'
        ),
        simplestExample: block('für i von 1 bis n: … mit klarer Grenze.', 'didactic'),
        stepByStep: block('Schleifenrumpf ausführen, Zähler/ Bedingung aktualisieren, Termination prüfen.', 'official'),
        typicalMistakes: block('Falsche Grenzen; Schleifenvariable nach außen verwenden ohne Definition.', 'examPattern2021_2025'),
        miniSummary: block('Kontrolle explizit: Eintritt, Rumpf, Austritt.', 'official'),
      },
      examBrief: {
        whatIs: block('If/While/For-Struktur lesen.', 'official'),
        whyItMatters: block('Traces und Ergänzungen.', 'examPattern2021_2025'),
        terms: block('Bedingung, Rumpf, Zähler.', 'official'),
        simplestExample: block('Mini-Schleife mit 3 Durchläufen.', 'didactic'),
        stepByStep: block('Bedingung vor jedem Eintritt prüfen (je nach Schleifentyp).', 'official'),
        typicalMistakes: block('Off-by-one.', 'examPattern2021_2025'),
        miniSummary: block('Abbruch sicherstellen.', 'official'),
      },
    },
    checklistKeys: ['if_schleife', 'abbruch', 'trace_mini'],
    checklistLabels: {
      if_schleife: 'Ich kann in einem Satz sagen, wann ich if und wann eine Schleife nutze.',
      abbruch: 'Ich kann bei einer Schleife die Abbruchbedingung nennen.',
      trace_mini: 'Ich habe eine Mini-Schleife mit 3 Durchläufen auf Papier durchgespielt.',
    },
  },
  conceptChecks: [
    {
      id: 'cc-s02b-1',
      question: 'Welche Struktur eignet sich, um „10 Mal dasselbe“ auszuführen?',
      options: ['Nur eine Zuweisung', 'Eine Zählschleife', 'Nur eine Selektion', 'Ein Kommentar'],
      correctIndex: 1,
      explanation: 'Wiederholung mit fester Anzahl → typischerweise Zählschleife.',
    },
    {
      id: 'cc-s02b-2',
      question: 'Was ist die Hauptgefahr bei `Solange wahr: …` mit leerem Rumpf?',
      options: ['Syntaxfehler', 'Endlosschleife', 'Division durch null', 'Keine'],
      correctIndex: 1,
      explanation: 'Wenn die Bedingung immer wahr bleibt, endet die Schleife nicht.',
    },
  ],
  exercises: [
    {
      id: 'ex-s02b-mini',
      unitId: 's02b-u01',
      track: 'mini',
      title: 'Mini: Wahr oder falsch?',
      modes: ['free', 'guided', 'showSolution'],
      inlineMc: {
        question: 'Ist `wenn x > 0 dann x ← x - 1` eine Schleife?',
        options: ['Ja', 'Nein, nur einmalige Verzweigung', 'Nur wenn x gerade'],
        correctIndex: 1,
        explanation: 'Ohne zurückspringende Struktur kein Wiederholen.',
      },
    },
    {
      id: 'ex-s02b-guided',
      unitId: 's02b-u01',
      track: 'guided',
      title: 'Geführt: Schleifendurchläufe zählen',
      modes: ['free', 'guided', 'stepHints', 'showSolution'],
      guidedFlow: [
        {
          id: 'g1',
          prompt: 'i startet bei 1. Schleife: solange i < 4: i ← i+1. Wie oft wird der Rumpf ausgeführt?',
          expectedType: 'mc',
          options: ['0', '2', '3', '4'],
          correctOptionIndex: 2,
          feedbackWrong: 'i läuft 1→2→3 und beim nächsten Test 3<4 wahr → noch ein Schritt… durchrechnen.',
          feedbackRight: 'Drei Durchläufe (i endet bei 4, Schleife bricht ab).',
          remediationGlossaryTermIds: ['schleife'],
        },
      ],
      inlineMc: {
        question: 'Nach `n←0` und `für i von 1 bis 3: n←n+i` — Wert von n?',
        options: ['3', '6', '0', '1'],
        correctIndex: 1,
        explanation: '1+2+3=6.',
      },
    },
    {
      id: 'ex-s02b-standard',
      unitId: 's02b-u01',
      track: 'standard',
      title: 'Standard: if/else lesen',
      modes: ['free', 'guided', 'showSolution'],
      inlineMc: {
        question: 'x←10. Wenn x>5 dann y←1 sonst y←0. Wert y?',
        options: ['0', '1', '10', 'undefiniert'],
        correctIndex: 1,
        explanation: 'Bedingung wahr → then-Zweig.',
      },
    },
    {
      id: 'ex-s02b-transfer',
      unitId: 's02b-u01',
      track: 'transfer',
      title: 'Transfer: Maximum zweier Zahlen',
      modes: ['free', 'guided', 'stepHints', 'showSolution'],
      guidedSteps: [
        'Vergleiche a und b.',
        'Wenn a ≥ b, ist das Maximum a, sonst b.',
        'Formuliere als wenn/dann/sonst.',
      ],
      inlineMc: {
        question: 'Welches Muster wählt das Maximum?',
        options: [
          'wenn a < b dann max ← a sonst max ← b',
          'wenn a ≥ b dann max ← a sonst max ← b',
          'max ← a + b',
          'max ← 0',
        ],
        correctIndex: 1,
        explanation: 'Größere Zahl soll in max landen.',
      },
    },
    {
      id: 'ex-s02b-exam',
      unitId: 's02b-u01',
      track: 'examStyle',
      title: 'Klausurnah: verschachtelte Bedingung',
      modes: ['free', 'stepHints', 'showSolution'],
      inlineMc: {
        question: 'x←2, y←5. Wenn x<y dann wenn x<0 dann z←1 sonst z←2 sonst z←3. Wert z?',
        options: ['1', '2', '3', 'undefiniert'],
        correctIndex: 1,
        explanation: 'x<y wahr, inner: x<0 falsch → z←2.',
      },
    },
  ],
};
