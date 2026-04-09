import type { PathUnit } from '../../../types/learning';

const block = (text: string, source: 'official' | 'examPattern2021_2025' | 'didactic') => ({ text, source });

export const UNIT_S01_U01: PathUnit = {
  id: 's01-u01',
  stageId: 's01',
  title: 'Was ist ein Algorithmus — ganz langsam',
  tags: ['algorithmus', 'problem', 'korrektheit'],
  vocabularyTermIds: ['algorithmus', 'problem', 'implementierung'],
  lesson: {
    tiers: {
      beginner: {
        whatIs: block(
          'Ein Algorithmus ist eine **genaue Anleitung**, die Schritt für Schritt sagt, was du tun sollst — so klar, dass man sie befolgen kann, ohne zu raten. Stell dir ein Kochrezept vor: Wenn du die Schritte exakt befolgst, kommt das gleiche Ergebnis raus.',
          'didactic'
        ),
        whyItMatters: block(
          'In Informatik lösen wir Probleme nicht „irgendwie“, sondern **planbar und überprüfbar**. Algorithmen sind die Brücke von der Idee („was soll passieren?“) zur Umsetzung („wie genau?“).',
          'didactic'
        ),
        terms: block(
          '- **Problem**: Eine Aufgabe mit klarer Eingabe und gewünschter Ausgabe.\n- **Algorithmus**: Endliche Folge von Schritten zur Problemlösung.\n- **Programm / Implementierung**: Algorithmus in einer konkreten Notation (z. B. Pseudocode nach euren Vorgaben).',
          'official'
        ),
        simplestExample: block(
          'Problem: „Ist eine Zahl n gerade?“\nSchritt 1: Teile n durch 2.\nSchritt 2: Wenn der Rest 0 ist → Antwort ja, sonst nein.\nDas ist schon ein Mini-Algorithmus.',
          'didactic'
        ),
        stepByStep: block(
          '1. **Problem verstehen**: Was ist gegeben, was ist gesucht?\n2. **Idee finden**: Welche Regel löst das?\n3. **Schritte formulieren**: Jeder Schritt muss eindeutig sein.\n4. **Testen**: Kleine Beispiele durchspielen (Trace).\n5. **Eigenschaften prüfen**: Endet er? Liefert er das Richtige?',
          'didactic'
        ),
        typicalMistakes: block(
          '- Schritte sind **unklar** („mache etwas Vernünftiges“).\n- **Spezialfälle** vergessen (z. B. leere Eingabe).\n- **Ende** nicht sichergestellt (Endlosschleife).\n- Verwechslung: Algorithmus vs. nur **ein Beispielrechnen**.',
          'didactic'
        ),
        miniSummary: block(
          'Algorithmus = präzise Schrittfolge. Immer: Was ist das Problem? Welche Schritte? Was ist mit Sonderfällen?',
          'didactic'
        ),
      },
      standard: {
        whatIs: block(
          'Ein Algorithmus ist eine endliche, eindeutige Beschreibung einer Vorgehensweise zur Lösung eines Problems. Er besteht aus elementaren Schritten und einer festen Ablaufstruktur (Sequenz, Auswahl, Wiederholung).',
          'official'
        ),
        whyItMatters: block(
          'Algorithmen sind Grundlage für Implementierung, Aufwandsüberlegungen und Korrektheitsargumente. In Prüfungen werden häufig Algorithmen in Pseudocode/Struktogrammform verlangt.',
          'examPattern2021_2025'
        ),
        terms: block(
          '- **Korrektheit**: Liefert der Algorithmus für alle zulässigen Eingaben die richtige Ausgabe?\n- **Terminierung**: Endet der Algorithmus nach endlich vielen Schritten?\n- **Determinismus**: Ist der nächste Schritt eindeutig?',
          'didactic'
        ),
        simplestExample: block(
          'Maximum von zwei Zahlen a, b:\n- Wenn a ≥ b, gib a zurück, sonst b.\nEin Schritt, ein Vergleich, eindeutiges Ergebnis.',
          'didactic'
        ),
        stepByStep: block(
          '1. Vorbedingung/Eingabe festlegen.\n2. Invariante oder Idee benennen (falls Schleife).\n3. Schleifen/Selektion so wählen, dass Terminierung erkennbar ist.\n4. Nachbedingung/Ausgabe formulieren.\n5. Mit kleinen Traces validieren.',
          'didactic'
        ),
        typicalMistakes: block(
          '- Off-by-one bei Schleifen.\n- Fehlende Abbruchbedingung.\n- Zu grobe Pseudocode-Schritte ohne klare Semantik.',
          'examPattern2021_2025'
        ),
        miniSummary: block(
          'Algorithmus: endlich, eindeutig, ausführbar. Prüfe Terminierung und Korrektheit mit Trace.',
          'official'
        ),
      },
      examBrief: {
        whatIs: block('Algorithmus = endliche eindeutige Verfahrensbeschreibung zur Problemlösung.', 'official'),
        whyItMatters: block('Prüfungen verlangen oft Entwurf/Implementierung und Begründung einzelner Schritte.', 'examPattern2021_2025'),
        terms: block('Korrektheit, Terminierung, elementare Operationen, Pseudocode/Struktogramm.', 'official'),
        simplestExample: block('Selektion + Wiederholung als Grundbausteine erkennen.', 'didactic'),
        stepByStep: block('Gegeben → Schleife/If → Rückgabe; Trace für Beweis der Idee.', 'examPattern2021_2025'),
        typicalMistakes: block('Unklare Schritte, fehlende Abbruchbedingung.', 'examPattern2021_2025'),
        miniSummary: block('Klarheit, Endlichkeit, Trace.', 'official'),
      },
    },
    checklistKeys: ['verstanden_problem', 'verstanden_schritte', 'trace_geübt'],
    checklistLabels: {
      verstanden_problem: 'Ich kann in eigenen Worten sagen, was ein „Problem“ in der Informatik ist.',
      verstanden_schritte: 'Ich kann drei Eigenschaften eines guten Algorithmus nennen.',
      trace_geübt: 'Ich habe mindestens ein Mini-Beispiel Schritt für Schritt durchgespielt.',
    },
  },
  conceptChecks: [
    {
      id: 'cc-s01-1',
      question: 'Was trifft auf einen Algorithmus im Sinne der Schul-Informatik am besten zu?',
      options: [
        'Beliebige Beschreibung, die ungefähr funktioniert',
        'Endliche, eindeutige Schrittfolge zur Problemlösung',
        'Nur ein Programm in Java',
        'Nur eine Zeichnung ohne Text',
      ],
      correctIndex: 1,
      explanation: 'Ein Algorithmus muss endlich und eindeutig sein — unabhängig von einer konkreten Programmiersprache.',
    },
  ],
  exercises: [
    {
      id: 'ex-s01-u01-a',
      unitId: 's01-u01',
      title: 'Mini-Check: Algorithmus erkennen',
      track: 'mini',
      modes: ['free', 'guided', 'stepHints', 'showSolution'],
      guidedSteps: [
        'Lies jede Antwort und frage: Ist die Vorgehensweise endlich und eindeutig?',
        'Streiche alles, was „irgendwie“ oder „intelligent raten“ verlangt.',
        'Wähle die Option, die wie ein Rezept formuliert ist.',
      ],
      misconceptionTags: ['concept_not_understood'],
      inlineMc: {
        question: 'Welche der folgenden Vorgehensweisen ist am ehesten ein Algorithmus?',
        options: [
          '„Finde die beste Lösung, indem du kreativ bist.“',
          '„Solange n > 0: n ← n − 1; danach gib 0 zurück.“',
          '„Mache etwas, bis es passt.“',
          '„Frage jemanden, der es weiß.“',
        ],
        correctIndex: 1,
        explanation: 'Nur Option 2 ist eindeutig und in endlich vielen Schritten ausführbar (für nicht-negative Startwerte mit klarer Vorbedingung).',
      },
    },
  ],
};
