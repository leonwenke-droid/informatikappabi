import type { ExamOperator } from '../../types';

/** Kurz-Guides zu Prüfungsoperatoren (Abi-Stil) */
export const OPERATOR_GUIDES: Record<ExamOperator, { title: string; bullets: string[] }> = {
  nennen: {
    title: 'Nennen',
    bullets: ['Nur aufzählen, was gefragt ist — ohne tiefe Begründung.', 'Stichworte klar, vollständig zur Aufgabenstellung.'],
  },
  beschreiben: {
    title: 'Beschreiben',
    bullets: ['Sachverhalt in eigenen Worten darstellen.', 'Struktur: was ist es → wie wirkt es → ggf. ein Beispiel.'],
  },
  erläutern: {
    title: 'Erläutern',
    bullets: ['Begründen und erklären, nicht nur benennen.', 'Ursache/Wirkung oder Schrittfolge nachvollziehbar machen.'],
  },
  analysieren: {
    title: 'Analysieren',
    bullets: ['Systematisch zerlegen: gegeben → Beobachtung → Folgerung.', 'Bezug zu den konkreten Daten der Aufgabe.'],
  },
  beurteilen: {
    title: 'Beurteilen',
    bullets: ['Abwägen + begründetes Urteil (oft Vor- und Nachteile).', 'Kein reines „gut/schlecht“ ohne Argumente.'],
  },
  entwerfen: {
    title: 'Entwerfen',
    bullets: ['Konstruktiver Vorschlag (Struktur, Algorithmus, Schema).', 'Vollständigkeit und Passung zur Spezifikation prüfen.'],
  },
  bestimmen: {
    title: 'Bestimmen',
    bullets: ['Konkretes Ergebnis ausrechnen oder eindeutig angeben.', 'Zwischenschritte nur, wenn sie zur Nachvollziehbarkeit nötig sind.'],
  },
  implementieren: {
    title: 'Implementieren',
    bullets: ['Code/Struktogramm zur Signatur passend.', 'Randfälle und Termination kurz bedenken.'],
  },
  berechnen: {
    title: 'Berechnen',
    bullets: ['Rechnweg nachvollziehbar; Einheiten/Ergebnisform beachten.'],
  },
  ableiten: {
    title: 'Ableiten',
    bullets: ['Von Voraussetzungen logisch zum Ziel schließen.', 'Regeln benennen, die du anwendest.'],
  },
  darstellen: {
    title: 'Darstellen',
    bullets: ['Geforderte Notation (Tabelle, Graph, Formel) exakt nutzen.', 'Beschriftung und Lesbarkeit.'],
  },
};

export const OPERATOR_ORDER: ExamOperator[] = [
  'nennen',
  'beschreiben',
  'erläutern',
  'analysieren',
  'beurteilen',
  'entwerfen',
  'bestimmen',
  'implementieren',
  'berechnen',
  'ableiten',
  'darstellen',
];
