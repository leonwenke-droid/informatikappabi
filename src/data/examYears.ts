import type { ExamYear, TopicFrequency } from '../types';

/**
 * EXAM DATA 2021–2025
 * Source: eA-Klausuren Informatik Niedersachsen 2021–2025
 * Used for: pattern analysis, frequency charts, prognosis (2026)
 * NOTE: Prognosis derived from these patterns is NOT an official forecast.
 */

export const EXAM_YEARS: ExamYear[] = [
  {
    year: 2021,
    block1Tasks: [
      {
        id: '2021-1A', year: 2021, block: 'B1', label: '1A',
        topics: ['oop', 'bst'],
        description: 'Kfz-BST: Klassen (Kfz, Zulassung), Binärsuchbaum für Kennzeichen, Traversierungen, Suche implementieren',
      },
      {
        id: '2021-1B', year: 2021, block: 'B1', label: '1B',
        topics: ['oop', 'arr2d'],
        description: '2D-Array Kino-Reservierung: Klasse, Sitzplan-Matrix, Suche nach freien Plätzen',
      },
      {
        id: '2021-1C', year: 2021, block: 'B1', label: '1C',
        topics: ['oop', 'dyn'],
        description: 'Stack-basierter Einkaufswagen: OOP, Stack LIFO, Algorithmus für Summenbildung',
      },
    ],
    block2Tasks: [
      {
        id: '2021-2A', year: 2021, block: 'B2', label: '2A',
        topics: ['krypto', 'dyn'],
        description: 'csCrypt: Stack-basierte Transposition, Verschlüsselungsschritte, Sicherheitsanalyse',
      },
      {
        id: '2021-2B', year: 2021, block: 'B2', label: '2B',
        topics: ['krypto'],
        description: 'Bigramm-Schlüsselquadrate: polyalphabetische Substitution, Häufigkeitsanalyse',
      },
      {
        id: '2021-2C', year: 2021, block: 'B2', label: '2C',
        topics: ['db'],
        description: 'Anomalien, ER-Modell, SQL-Abfragen mit JOIN und GROUP BY',
      },
      {
        id: '2021-2D', year: 2021, block: 'B2', label: '2D',
        topics: ['gram'],
        description: 'Grammatik für Musiknotation: Ableitung, Typ bestimmen, Zusammenhang zu Automat',
      },
      {
        id: '2021-2E', year: 2021, block: 'B2', label: '2E',
        topics: ['aut'],
        description: 'DEA für Kommentare: Zustandsgraph entwerfen, Eingaben prüfen',
      },
    ],
    notes: 'Block 1: 3 Aufgaben (1C ist Stack-OOP). Block 2: 5 Aufgaben – 2 Kryptologie.',
  },
  {
    year: 2022,
    block1Tasks: [
      {
        id: '2022-1A', year: 2022, block: 'B1', label: '1A',
        topics: ['oop', 'bst'],
        description: 'Radioteleskop-Sterne: BST für Sternmagnitude, Traversierung, Einfügen, OOP',
      },
      {
        id: '2022-1B', year: 2022, block: 'B1', label: '1B',
        topics: ['oop'],
        description: 'MyChat-Messenger: Vererbung (Nachricht → TextNachricht, BildNachricht), Klassendiagramm',
      },
      {
        id: '2022-1C', year: 2022, block: 'B1', label: '1C',
        topics: ['arr2d', 'cod'],
        description: 'MRT-Aufnahmen: 2D-Array für Pixel, Binärcodierung, Schwellenwert-Analyse',
      },
    ],
    block2Tasks: [
      {
        id: '2022-2A', year: 2022, block: 'B2', label: '2A',
        topics: ['krypto'],
        description: 'GironaCrypt: Transpositionsverschlüsselung, Analyse, Implementierung',
      },
      {
        id: '2022-2B', year: 2022, block: 'B2', label: '2B',
        topics: ['db'],
        description: 'Impfzentrum: ER-Modell, SQL mit mehreren Tabellen, HAVING',
      },
      {
        id: '2022-2C', year: 2022, block: 'B2', label: '2C',
        topics: ['aut'],
        description: 'DEA Fußballergebnisse: Zustandsgraph für Ergebnissequenzen',
      },
      {
        id: '2022-2D', year: 2022, block: 'B2', label: '2D',
        topics: ['gram'],
        description: 'Frog-Programmiersprache: Grammatik entwerfen, Ableitung, Typ',
      },
      {
        id: '2022-2E', year: 2022, block: 'B2', label: '2E',
        topics: ['krypto', 'aut'],
        description: 'Blockchiffre + DEA: Blockchiffre-Verfahren analysieren, DEA für Eingabevalidierung',
      },
    ],
  },
  {
    year: 2023,
    block1Tasks: [
      {
        id: '2023-1A', year: 2023, block: 'B1', label: '1A',
        topics: ['oop', 'bst'],
        description: 'Stimmungsanalyse: Wort-BST, Traversierungen, rekursive Suche, OOP',
      },
      {
        id: '2023-1B', year: 2023, block: 'B1', label: '1B',
        topics: ['oop', 'arr2d'],
        description: 'BAAB-Konzert: Kategorien im 2D-Array, Vererbung, Algorithmus für Belegung',
      },
      {
        id: '2023-1C', year: 2023, block: 'B1', label: '1C',
        topics: ['rek'],
        description: 'Domino-Ketten: Rekursiver Algorithmus, Tracetabelle, Basisfall/Rekursionsschritt',
      },
    ],
    block2Tasks: [
      {
        id: '2023-2A', year: 2023, block: 'B2', label: '2A',
        topics: ['krypto'],
        description: 'CPlus: Polyalphabetische Substitution, Schlüsselraum, Sicherheitsanalyse',
      },
      {
        id: '2023-2B', year: 2023, block: 'B2', label: '2B',
        topics: ['db'],
        description: 'Schulverwaltung: SQL-Abfragen, GROUP BY, HAVING, ER-Ergänzung',
      },
      {
        id: '2023-2C', year: 2023, block: 'B2', label: '2C',
        topics: ['cod'],
        description: 'Pulswert-Binärcodierung: Binärdarstellung, Berechnung, Fehleranalyse',
      },
      {
        id: '2023-2D', year: 2023, block: 'B2', label: '2D',
        topics: ['gram'],
        description: 'URL-Hostname: Grammatik entwerfen, Ableitung, regulär vs. kontextfrei',
      },
      {
        id: '2023-2E', year: 2023, block: 'B2', label: '2E',
        topics: ['krypto'],
        description: 'PERMUT-4 Blockchiffre: Permutationsmatrix, Schritte beschreiben, Implementierung',
      },
    ],
  },
  {
    year: 2024,
    block1Tasks: [
      {
        id: '2024-1A', year: 2024, block: 'B1', label: '1A',
        topics: ['oop', 'dyn'],
        description: 'Zoo-App: Klassen und Objekte, DynArray für Tierliste, Klassendiagramm, Methoden',
      },
      {
        id: '2024-1B', year: 2024, block: 'B1', label: '1B',
        topics: ['oop', 'dyn', 'rek'],
        description: 'Krankenhaus-Verwaltung: Vererbung, DynArray, rekursiver Algorithmus, Tracetabelle',
      },
    ],
    block2Tasks: [
      {
        id: '2024-2A', year: 2024, block: 'B2', label: '2A',
        topics: ['krypto'],
        description: 'Kolonne 3×3-Transposition: Verschlüsselung/Entschlüsselung, Implementierung',
      },
      {
        id: '2024-2B', year: 2024, block: 'B2', label: '2B',
        topics: ['aut'],
        description: 'DEA Spielekonsolen-Sperrcode: Zustandsgraph, Eingaben analysieren, Automat entwerfen',
      },
      {
        id: '2024-2C', year: 2024, block: 'B2', label: '2C',
        topics: ['cod'],
        description: 'JPEG-ähnliche Kompression: Huffman-Codierung, Baum aufbauen, codieren/decodieren',
      },
    ],
  },
  {
    year: 2025,
    block1Tasks: [
      {
        id: '2025-1A', year: 2025, block: 'B1', label: '1A',
        topics: ['bst', 'rek', 'cod'],
        description: 'Huffman-Baum erstellen: BST, rekursive Traversierung, Huffman-Algorithmus',
      },
      {
        id: '2025-1B', year: 2025, block: 'B1', label: '1B',
        topics: ['oop', 'arr2d'],
        description: 'Landwirtschaft: 2D-Array für Felder, Vererbung (Pflanze, Getreide), Analyse',
      },
    ],
    block2Tasks: [
      {
        id: '2025-2A', year: 2025, block: 'B2', label: '2A',
        topics: ['krypto'],
        description: 'Eibar-Crypt: Kombination Transposition + polyalphabetische Substitution',
      },
      {
        id: '2025-2B', year: 2025, block: 'B2', label: '2B',
        topics: ['aut'],
        description: 'Prüfnummer: DEA + Kellerautomat, Übergänge entwerfen, Akzeptanz prüfen',
      },
      {
        id: '2025-2C', year: 2025, block: 'B2', label: '2C',
        topics: ['db'],
        description: 'EM-Tippspiel: ER-Modell, SQL mit JOIN, GROUP BY, HAVING',
      },
    ],
  },
];

// ─────────────────────────────────────────────
// Frequency analysis (derived from 2021–2025)
// ─────────────────────────────────────────────

export const TOPIC_FREQUENCIES: TopicFrequency[] = [
  { topicId: 'oop', topicLabel: 'OOP & Klassen', block1Count: 5, block2Count: 0, priority: 'HOCH', note: 'In ALLEN 5 Block-1-Jahrgängen vertreten' },
  { topicId: 'krypto', topicLabel: 'Kryptologie', block1Count: 0, block2Count: 5, priority: 'HOCH', note: 'In ALLEN 5 Block-2-Jahrgängen vertreten' },
  { topicId: 'bst', topicLabel: 'Binärbaum / BST', block1Count: 4, block2Count: 0, priority: 'HOCH', note: '4/5 in Block 1' },
  { topicId: 'db', topicLabel: 'Datenbank / SQL', block1Count: 0, block2Count: 4, priority: 'HOCH', note: '4/5 in Block 2' },
  { topicId: 'aut', topicLabel: 'Automaten / DEA', block1Count: 0, block2Count: 4, priority: 'HOCH', note: '4/5 in Block 2' },
  { topicId: 'arr2d', topicLabel: '2D-Reihung', block1Count: 4, block2Count: 0, priority: 'HOCH', note: '4/5 in Block 1' },
  { topicId: 'gram', topicLabel: 'Formale Sprachen', block1Count: 0, block2Count: 3, priority: 'MITTEL', note: '3/5 in Block 2' },
  { topicId: 'cod', topicLabel: 'Codierung / Huffman', block1Count: 1, block2Count: 2, priority: 'MITTEL', note: 'B1+B2, wachsend' },
  { topicId: 'rek', topicLabel: 'Rekursion', block1Count: 3, block2Count: 0, priority: 'MITTEL', note: '3/5 in Block 1, oft indirekt' },
  { topicId: 'dyn', topicLabel: 'DynArray / Stack / Queue', block1Count: 3, block2Count: 0, priority: 'BASIS', note: '3/5 in Block 1' },
];

// ─────────────────────────────────────────────
// 2026 Prognose — KEINE offizielle Vorgabe
// ─────────────────────────────────────────────

export const PROGNOSE_2026 = [
  {
    taskSlot: 'B1A',
    probability: 90,
    topic: 'OOP + BST oder DynArray',
    reasoning: 'OOP in 100% aller Block-1-Aufgaben; BST in 4/5 Jahren. Wahrscheinlichste Kombination.',
  },
  {
    taskSlot: 'B1B',
    probability: 75,
    topic: '2D-Reihung oder Rekursion',
    reasoning: '2D-Array in 4/5 Jahren (2025 war 1B); Rekursion wächst als eigenständiges Thema.',
  },
  {
    taskSlot: 'B2A',
    probability: 98,
    topic: 'Kryptologie (Transposition / Substitution)',
    reasoning: '100% Häufigkeit über alle 5 Jahrgänge. Praktisch sicher.',
  },
  {
    taskSlot: 'B2B',
    probability: 75,
    topic: 'Datenbank (ER + SQL)',
    reasoning: '4/5 Jahren in Block 2; 2025 war B2C. Position wechselt.',
  },
  {
    taskSlot: 'B2C',
    probability: 75,
    topic: 'Automaten / DEA oder Kellerautomat',
    reasoning: 'DEA 4/5 Jahre; Kellerautomat 2025 erstmals prominent — könnte wiederkehren.',
  },
] as const;

export const EXAM_DATE_2026 = new Date('2026-05-14');
