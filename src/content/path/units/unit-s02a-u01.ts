import type { PathUnit } from '../../../types/learning';

const block = (text: string, source: 'official' | 'examPattern2021_2025' | 'didactic') => ({ text, source });

export const UNIT_S02A_U01: PathUnit = {
  id: 's02a-u01',
  stageId: 's02a',
  title: 'Variablen, Typen und Zuweisungen',
  description: 'Du lernst, Zuweisungen zu lesen und elementare Datentypen sicher zuzuordnen.',
  learningGoals: [
    'Zuweisung ← als „Wert speichern“ verstehen',
    'Ganzzahl, reelle Zahl und Zeichenkette unterscheiden',
    'Ausdrücke mit Klammern und Punkt-vor-Strich grob auswerten',
  ],
  estimatedMinutes: 40,
  tags: ['variable', 'zuweisung', 'typ'],
  vocabularyTermIds: ['variable', 'zuweisung', 'datentyp', 'ausdruck'],
  lesson: {
    tiers: {
      beginner: {
        whatIs: block(
          'Eine **Variable** ist wie ein benanntes Fach: Du kannst einen Wert hineinlegen und später wieder auslesen. Mit **Zuweisung** (z. B. `x ← 5`) schreibst du einen neuen Wert in dieses Fach.',
          'didactic'
        ),
        whyItMatters: block(
          'Fast jeder Algorithmus merkt sich Zwischenergebnisse. Ohne klare Variablen und Zuweisungen wird aus einem Ablauf schnell unlesbares Raten.',
          'didactic'
        ),
        terms: block(
          '- **Datentyp**: Art des Werts (z. B. Ganzzahl, reelle Zahl, Zeichenkette).\n- **Ausdruck**: Etwas, das zu einem Wert ausgewertet wird (z. B. `3 + 4 * 2`).\n- **Zuweisung**: `name ← ausdruck` speichert den Wert des Ausdrucks.',
          'didactic'
        ),
        simplestExample: block(
          'x ← 10\ny ← x + 3\nAm Ende: y hat den Wert 13.',
          'didactic'
        ),
        stepByStep: block(
          '1. Lies den **rechten** Teil der Zuweisung (Ausdruck auswerten).\n2. Speichere das Ergebnis in der Variable **links**.\n3. Alte Werte der linken Variable werden **ersetzt**.',
          'didactic'
        ),
        typicalMistakes: block(
          '- `=` und `←` verwechseln (in Schul-Pseudocode meist `←`).\n- Typen mischen ohne Umwandlung (z. B. Text mit Zahl addieren).\n- Reihenfolge: erst rechts auswerten, dann zuweisen.',
          'didactic'
        ),
        miniSummary: block(
          'Variable = Speicherplatz mit Namen. Zuweisung überschreibt den alten Wert.',
          'didactic'
        ),
      },
      standard: {
        whatIs: block(
          'Variablen sind Bezeichner für Speicherorte; der Datentyp legt zulässige Operationen und Wertebereiche fest. Zuweisung aktualisiert den gespeicherten Wert.',
          'official'
        ),
        whyItMatters: block(
          'In Prüfungen und Pseudocode müssen Typen und Zuweisungen konsistent sein; Trace-Aufgaben setzen voraus, dass du Zuweisungsreihenfolge beherrschst.',
          'examPattern2021_2025'
        ),
        terms: block(
          'Ganzzahl (oft „Ganzzahl“/integer), reelle Zahl (Fließkomma), Zeichenkette, boolesch. Ausdruckstrees: Punkt-vor-Strich, Klammern.',
          'official'
        ),
        simplestExample: block('a ← 2\nb ← a * a + 1  → b = 5', 'didactic'),
        stepByStep: block(
          'Ausdruck auswerten mit Operatorpriorität; Ergebnis in Zielvariable; bei Kettenzuweisungen von rechts nach links bzw. gemäß Aufgabenstellung.',
          'official'
        ),
        typicalMistakes: block(
          'Implizite Typumwandlung annehmen; Reihenfolge bei mehreren Zuweisungen vertauschen.',
          'examPattern2021_2025'
        ),
        miniSummary: block('Typ + Zuweisung + korrekte Auswertung des Ausdrucks.', 'official'),
      },
      examBrief: {
        whatIs: block('Variable, Typ, Zuweisung, Ausdruck.', 'official'),
        whyItMatters: block('Grundlage für Traces und Programmfragmente.', 'examPattern2021_2025'),
        terms: block('Ganzzahl/reell/Zeichenkette; ← ; Operatorpriorität.', 'official'),
        simplestExample: block('Kurztrace mit zwei Zuweisungen.', 'didactic'),
        stepByStep: block('Rechts auswerten, links speichern.', 'official'),
        typicalMistakes: block('Typfehler, falsche Reihenfolge.', 'examPattern2021_2025'),
        miniSummary: block('Zuweisung = Ersetzen des gespeicherten Werts.', 'official'),
      },
    },
    checklistKeys: ['var_zuweisung', 'typen', 'ausdruck'],
    checklistLabels: {
      var_zuweisung: 'Ich kann eine Zuweisung in eigenen Worten erklären.',
      typen: 'Ich kann drei elementare Datentypen nennen und ein Beispiel geben.',
      ausdruck: 'Ich weiß, dass der rechte Teil der Zuweisung zuerst ausgewertet wird.',
    },
  },
  conceptChecks: [
    {
      id: 'cc-s02a-1',
      question: 'Was passiert bei `x ← 5` gefolgt von `x ← x + 1`?',
      options: ['x bleibt 5', 'x wird 6', 'x wird undefiniert', 'Fehler, weil x doppelt'],
      correctIndex: 1,
      explanation: 'Die zweite Zuweisung liest den aktuellen Wert (5), addiert 1 und speichert 6.',
    },
    {
      id: 'cc-s02a-2',
      question: 'Welcher Wert passt am ehesten zu „Hallo“?',
      options: ['Ganzzahl', 'Reelle Zahl', 'Zeichenkette', 'Wahrheitswert'],
      correctIndex: 2,
      explanation: 'Eine Zeichenkette (String) besteht aus Zeichen in Anführungszeichen.',
    },
  ],
  exercises: [
    {
      id: 'ex-s02a-mini',
      unitId: 's02a-u01',
      title: 'Mini: Typ zuordnen',
      track: 'mini',
      modes: ['free', 'guided', 'showSolution'],
      reviewAfterDays: 5,
      inlineMc: {
        question: 'Welcher Typ? `preis ← 3.99`',
        options: ['Ganzzahl', 'Reelle Zahl', 'Zeichenkette', 'Boolesch'],
        correctIndex: 1,
        explanation: '3.99 hat Nachkommastellen → reelle Zahl (oder Festkomma je nach Kontext).',
      },
    },
    {
      id: 'ex-s02a-guided',
      unitId: 's02a-u01',
      title: 'Geführt: Zuweisungsreihenfolge',
      track: 'guided',
      modes: ['free', 'guided', 'stepHints', 'showSolution'],
      reviewAfterDays: 7,
      guidedFlow: [
        {
          id: 'gf1',
          prompt: 'Zuerst: Wird bei `a ← 2` und `b ← a + 3` der Wert von `a` für `b` verwendet?',
          expectedType: 'mc',
          options: ['Nein, b ist unabhängig', 'Ja, b nutzt den aktuellen Wert von a', 'Nur wenn a gerade ist'],
          correctOptionIndex: 1,
          feedbackWrong: 'Der Ausdruck a + 3 liest die Variable a zum Zeitpunkt der Auswertung.',
          feedbackRight: 'Genau — rechts wird der aktuelle Wert von a gelesen.',
          remediationGlossaryTermIds: ['variable', 'zuweisung'],
        },
        {
          id: 'gf2',
          prompt: 'Welchen Wert hat b nach beiden Zeilen? (Zahl als Wort)',
          expectedType: 'keywords',
          keywordAccept: ['5', 'fünf'],
          feedbackWrong: 'a ist 2, also a + 3 = 5.',
          feedbackRight: 'Richtig, b = 5.',
          misconceptionOnFail: 'concept_not_understood',
        },
      ],
      inlineMc: {
        question: 'Nach `x ← 1` und `x ← x * 2` und `x ← x + x` — Wert von x?',
        options: ['2', '3', '4', '1'],
        correctIndex: 2,
        explanation: '1→2→4.',
      },
    },
    {
      id: 'ex-s02a-standard',
      unitId: 's02a-u01',
      title: 'Standard: Ausdruck',
      track: 'standard',
      modes: ['free', 'guided', 'showSolution'],
      inlineMc: {
        question: 'Wert von `2 + 3 * 4` (Punkt vor Strich)?',
        options: ['20', '14', '24', '9'],
        correctIndex: 1,
        explanation: 'Zuerst 3*4=12, dann 2+12=14.',
      },
    },
    {
      id: 'ex-s02a-transfer',
      unitId: 's02a-u01',
      title: 'Transfer: Variablen tauschen (Idee)',
      track: 'transfer',
      modes: ['free', 'guided', 'stepHints', 'showSolution'],
      guidedSteps: [
        'Ziel: Werte von a und b vertauschen.',
        'Eine dritte Hilfsvariable hilft fast immer.',
        'Skizziere: tmp ← a; a ← b; b ← tmp.',
      ],
      inlineMc: {
        question: 'Warum reicht `a ← b` und `b ← a` oft nicht?',
        options: [
          'Weil es zu langsam ist',
          'Weil nach a←b der alte Wert von a verloren ist',
          'Weil b dann immer 0 wird',
          'Es reicht immer',
        ],
        correctIndex: 1,
        explanation: 'Nach a←b steht in a schon der alte b-Wert — der alte a-Wert ist weg.',
      },
    },
    {
      id: 'ex-s02a-exam',
      unitId: 's02a-u01',
      title: 'Klausurnah: Lesen eines Mini-Fragments',
      track: 'examStyle',
      modes: ['free', 'stepHints', 'showSolution'],
      inlineMc: {
        question: 'Nach `n ← 4` und `n ← n - 1` und `ergebnis ← n * n` — Wert von ergebnis?',
        options: ['9', '12', '16', '3'],
        correctIndex: 0,
        explanation: 'n wird 3, 3*3=9.',
      },
    },
  ],
};
