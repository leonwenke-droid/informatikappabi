/**
 * OFFICIAL CONSTRAINTS
 * Source: Ergänzende Hinweise zum KC Informatik, Stand Juni 2021
 *         + Anlage zu 18_InformatikHinweise2026
 * These are legally binding for the 2026 Abitur.
 */

export const OFFICIAL_STRING_OPERATIONS = [
  'Bestimmen der Länge einer Zeichenkette',
  'Auslesen eines Zeichens an einer bestimmten Position',
  'Ersetzen eines Zeichens an einer bestimmten Position',
  'Verbinden von zwei Zeichenketten zu einer',
  'Prüfen des Inhalts von zwei Zeichenketten auf Gleichheit',
  'Lexikographisches Vergleichen von zwei Zeichenketten',
] as const;

export const OFFICIAL_DYNARRAY_OPS = {
  constructor: 'DynArray()',
  isEmpty: 'isEmpty(): Wahrheitswert',
  getItem: 'getItem(index: Ganzzahl): Inhaltstyp',
  append: 'append(inhalt: Inhaltstyp)',
  insertAt: 'insertAt(index: Ganzzahl, inhalt: Inhaltstyp)',
  setItem: 'setItem(index: Ganzzahl, inhalt: Inhaltstyp)',
  delete: 'delete(index: Ganzzahl)',
  getLength: 'getLength(): Ganzzahl',
} as const;

export const OFFICIAL_STACK_OPS = {
  constructor: 'Stack()',
  isEmpty: 'isEmpty(): Wahrheitswert',
  top: 'top(): Inhaltstyp',
  push: 'push(inhalt: Inhaltstyp)',
  pop: 'pop(): Inhaltstyp',
} as const;

export const OFFICIAL_QUEUE_OPS = {
  constructor: 'Queue()',
  isEmpty: 'isEmpty(): Wahrheitswert',
  head: 'head(): Inhaltstyp',
  enqueue: 'enqueue(inhalt: Inhaltstyp)',
  dequeue: 'dequeue(): Inhaltstyp',
} as const;

export const OFFICIAL_BINTREE_OPS = {
  constructor1: 'BinTree()',
  constructor2: 'BinTree(inhalt: Inhaltstyp)',
  hasItem: 'hasItem(): Wahrheitswert',
  getItem: 'getItem(): Inhaltstyp',
  setItem: 'setItem(inhalt: Inhaltstyp)',
  deleteItem: 'deleteItem()',
  isLeaf: 'isLeaf(): Wahrheitswert',
  hasLeft: 'hasLeft(): Wahrheitswert',
  getLeft: 'getLeft(): Binärbaum',
  setLeft: 'setLeft(b: Binärbaum)',
  deleteLeft: 'deleteLeft()',
  hasRight: 'hasRight(): Wahrheitswert',
  getRight: 'getRight(): Binärbaum',
  setRight: 'setRight(b: Binärbaum)',
  deleteRight: 'deleteRight()',
} as const;

/** Official SQL scope — no subqueries, no JOINs with JOIN keyword */
export const OFFICIAL_SQL_SCOPE = `SELECT [DISTINCT | ALL] * | spalte1 [AS alias1], spalte2 [AS alias2], …
FROM tabelle1, tabelle2, …
[WHERE bedingung1 (AND | OR) bedingung2 …]
[GROUP BY spalte1, spalte2, …
  [HAVING gruppenBedingung1 (AND | OR) gruppenBedingung2 …]]
[ORDER BY spalte1 [ASC | DESC], …]
[LIMIT anzahl]`;

export const OFFICIAL_SQL_OPERATORS = {
  comparison: ['=', '!=', '>', '<', '>=', '<=', 'NOT', 'LIKE', 'BETWEEN', 'IN', 'IS NULL'],
  aggregate: ['AVG', 'COUNT', 'MAX', 'MIN', 'SUM'],
  calculation: ['+', '-', '*', '/'],
} as const;

/** Hamming (7,4) — official notation */
export const OFFICIAL_HAMMING = {
  bitOrder: 'p0 p1 d0 p2 d1 d2 d3',
  controlGroups: {
    p0: ['d0', 'd1', 'd3'],
    p1: ['d0', 'd2', 'd3'],
    p2: ['d1', 'd2', 'd3'],
  },
  note: 'Prüfbit = XOR aller Bits der Kontrollgruppe (gerade Parität)',
} as const;

/** Integer division rule */
export const OFFICIAL_INT_DIVISION =
  'Die Division von Ganzzahlen ist als Division ohne Rest zu verstehen (z.B. 7 / 3 = 2). Fließkommadivision muss gesondert kenntlich gemacht werden.';

/** Class diagram notation */
export const OFFICIAL_CLASS_NOTATION = {
  private: '- privatAttribut: Typ',
  public: '+ öffentlicheOp(): RTyp',
  constructor: 'c Konstruktor()',
  inheritance: 'Leerer Dreieckspfeil → Oberklasse',
  association: 'Einfache Linie ohne Kardinalitäten',
  ellipsis: '... (für nicht aufgeführte Attribute/Ops.)',
  objectDiagram: 'Keine Operationen nötig; Name: objectName: ClassName',
} as const;

/** Automata notation */
export const OFFICIAL_AUTOMATA_NOTATION = {
  dea: {
    startState: 'Pfeil ohne Quelle',
    finalState: 'Doppelkreis',
    transitions: 'Pfeile mit Eingabezeichen',
    errorState: 'Kann mit erläuterndem Text weggelassen werden',
  },
  mealy: {
    transitions: 'Eingabezeichen / Ausgabezeichen',
    emptyOutput: 'ε',
  },
  pushdown: {
    transitions: '(oberstes_Kellersymbol, Eingabe): neues_Kellersymbol',
    initial: '#',
    epsilonTransitions: 'Möglich, aber kein weiterer Übergang mit gleichem Kellersymbol',
    acceptance: 'In Endzustand nach vollständiger Verarbeitung',
  },
} as const;

/** Grammar notation */
export const OFFICIAL_GRAMMAR_NOTATION = {
  format: 'G = (N, T, S, P)',
  nonTerminals: 'Großbuchstaben (N)',
  terminals: 'Kleinbuchstaben / Zeichen (T)',
  epsilon: 'ε = leeres Wort (zulässig)',
  rules: 'A → α',
} as const;

/** ER diagram notation */
export const OFFICIAL_ER_NOTATION = {
  entityTypes: 'Rechtecke',
  relationships: 'Rauten',
  attributes: 'Ellipsen',
  keyAttributes: 'Unterstrichen',
  cardinalities: '1:1, 1:n, n:m — obligatorisch!',
  relationAttributes: 'An Beziehungstypen möglich',
  shortForm: 'Tabelle(Primärschlüssel, Attribut, ↑FremdSchlüssel)',
} as const;

export const OFFICIAL_OPERATOR_NOTATION =
  'Bezeichnung(Parameterbezeichnung: Parametertyp, ...): Rückgabetyp';
