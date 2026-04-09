import type { SqlCompareMode } from './compareResults';

export interface SqlLabTask {
  id: string;
  chapter: string;
  title: string;
  prompt: string;
  /** DDL + Seeds */
  initSql: string;
  /** Musterabfrage (wird intern ausgeführt zum Vergleich) */
  solutionSql: string;
  guidedQuestions: { q: string; hint: string }[];
  compareMode: SqlCompareMode;
}

export const SQL_LAB_TASKS: SqlLabTask[] = [
  {
    id: 'sql-01-select',
    chapter: 'SELECT',
    title: 'Alle Zeilen einer Tabelle',
    prompt:
      'Geben Sie alle Spalten aller Einträge aus der Tabelle **student** zurück. Sortieren Sie nach **id** aufsteigend.',
    initSql: `
CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT NOT NULL, note REAL NOT NULL, abteilung TEXT NOT NULL);
INSERT INTO student VALUES
  (1, 'Anna', 1.3, 'A'),
  (2, 'Ben', 2.7, 'A'),
  (3, 'Cleo', 3.5, 'B');
    `,
    solutionSql: 'SELECT * FROM student ORDER BY id',
    guidedQuestions: [
      { q: 'Welche Tabelle brauchst du?', hint: 'FROM student' },
      { q: 'Alle Spalten?', hint: 'SELECT * wählt alle Spalten.' },
    ],
    compareMode: 'ordered',
  },
  {
    id: 'sql-02-where',
    chapter: 'WHERE',
    title: 'Filtern nach Note',
    prompt:
      'Listen Sie **name** und **note** aller Studierenden mit Note **besser als 3,0** (also note < 3.0). Sortierung nach **name**.',
    initSql: `
CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT NOT NULL, note REAL NOT NULL, abteilung TEXT NOT NULL);
INSERT INTO student VALUES
  (1, 'Anna', 1.3, 'A'),
  (2, 'Ben', 2.7, 'A'),
  (3, 'Cleo', 3.5, 'B');
    `,
    solutionSql: 'SELECT name, note FROM student WHERE note < 3.0 ORDER BY name',
    guidedQuestions: [
      { q: 'Welcher Operator für „besser als 3,0“?', hint: 'Numerisch: note kleiner als 3.0.' },
    ],
    compareMode: 'ordered',
  },
  {
    id: 'sql-03-order',
    chapter: 'ORDER BY',
    title: 'Sortierung',
    prompt: 'Geben Sie **name** und **abteilung** aus, sortiert nach **abteilung** absteigend, bei gleicher Abteilung nach **name** aufsteigend.',
    initSql: `
CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT NOT NULL, note REAL NOT NULL, abteilung TEXT NOT NULL);
INSERT INTO student VALUES
  (1, 'Anna', 1.3, 'A'),
  (2, 'Ben', 2.7, 'A'),
  (3, 'Cleo', 3.5, 'B');
    `,
    solutionSql: 'SELECT name, abteilung FROM student ORDER BY abteilung DESC, name ASC',
    guidedQuestions: [
      { q: 'Mehrere Sortierschlüssel?', hint: 'ORDER BY spalte1 DESC, spalte2 ASC' },
    ],
    compareMode: 'ordered',
  },
  {
    id: 'sql-04-join',
    chapter: 'JOIN',
    title: 'Verbund über Fremdschlüssel',
    prompt:
      'Listen Sie **student.name** und **kurs.titel** für alle Belegungen (Tabelle **belegt** verbindet **sid** mit **kid**). Sortierung nach Name, dann Titel.',
    initSql: `
CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT NOT NULL, note REAL NOT NULL, abteilung TEXT NOT NULL);
CREATE TABLE kurs (id INTEGER PRIMARY KEY, titel TEXT NOT NULL);
CREATE TABLE belegt (sid INTEGER, kid INTEGER);
INSERT INTO student VALUES (1, 'Anna', 1.3, 'A'), (2, 'Ben', 2.7, 'A');
INSERT INTO kurs VALUES (1, 'Datenbanken'), (2, 'Netze');
INSERT INTO belegt VALUES (1, 1), (1, 2), (2, 1);
    `,
    solutionSql: `
SELECT s.name, k.titel
FROM belegt b
JOIN student s ON s.id = b.sid
JOIN kurs k ON k.id = b.kid
ORDER BY s.name, k.titel
    `,
    guidedQuestions: [
      { q: 'Wo starten?', hint: 'Von belegt aus jeweils JOIN zu student und kurs.' },
    ],
    compareMode: 'ordered',
  },
  {
    id: 'sql-05-group',
    chapter: 'GROUP BY',
    title: 'Aggregation',
    prompt:
      'Wie viele Studierende gibt es pro **abteilung**? Ausgabe: Spalten **abteilung** und **anzahl** (Anzahl Zeilen). Sortierung nach **abteilung**.',
    initSql: `
CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT NOT NULL, note REAL NOT NULL, abteilung TEXT NOT NULL);
INSERT INTO student VALUES
  (1, 'Anna', 1.3, 'A'),
  (2, 'Ben', 2.7, 'A'),
  (3, 'Cleo', 3.5, 'B'),
  (4, 'Dan', 2.0, 'B');
    `,
    solutionSql: 'SELECT abteilung, COUNT(*) AS anzahl FROM student GROUP BY abteilung ORDER BY abteilung',
    guidedQuestions: [
      { q: 'Alias für COUNT?', hint: 'COUNT(*) AS anzahl — der Alias-Name muss zur Musterlösung passen.' },
    ],
    compareMode: 'set',
  },
];
