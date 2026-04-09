import type { OperatorDefinition } from '../types';

/**
 * OPERATOR DEFINITIONS
 * Source: EPA Informatik 2004, KC 2017
 * These are the official exam operators for Abitur Niedersachsen.
 */

export const OPERATORS: OperatorDefinition[] = [
  {
    name: 'nennen',
    description: 'Fakten, Begriffe oder Elemente ohne Erläuterung aufzählen',
    level: 'I',
    example: 'Nennen Sie vier offizielle Stack-Operationen.',
  },
  {
    name: 'beschreiben',
    description: 'Sachverhalte mit eigenen Worten darstellen, ohne Erklärung von Zusammenhängen',
    level: 'I',
    example: 'Beschreiben Sie das Vigenère-Verfahren.',
  },
  {
    name: 'bestimmen',
    description: 'Einen Wert, eine Eigenschaft oder ein Ergebnis durch Anwenden von Verfahren ermitteln',
    level: 'I',
    example: 'Bestimmen Sie den Hamming-Code für d0=1, d1=0, d2=1, d3=1.',
  },
  {
    name: 'darstellen',
    description: 'Sachverhalte strukturiert und übersichtlich wiedergeben (z.B. als Diagramm, Tabelle)',
    level: 'I',
    example: 'Stellen Sie den BST nach Einfügen der Werte 5, 3, 7 dar.',
  },
  {
    name: 'erläutern',
    description: 'Sachverhalte beschreiben UND Zusammenhänge erklären (mehr als beschreiben!)',
    level: 'II',
    example: 'Erläutern Sie, warum Vigenère sicherer als Caesar ist.',
  },
  {
    name: 'analysieren',
    description: 'Sachverhalte systematisch untersuchen und strukturiert aufbereiten',
    level: 'II',
    example: 'Analysieren Sie den gegebenen Verschlüsselungsalgorithmus.',
  },
  {
    name: 'ableiten',
    description: 'Aus bekannten Zusammenhängen oder Regeln neue Aussagen herleiten',
    level: 'II',
    example: 'Leiten Sie das relationale Schema aus dem ER-Diagramm ab.',
  },
  {
    name: 'entwerfen',
    description: 'Eine eigenständige Lösung (Diagramm, Algorithmus, Schema) entwickeln',
    level: 'II',
    example: 'Entwerfen Sie einen DEA, der alle Wörter mit "01" am Ende akzeptiert.',
  },
  {
    name: 'implementieren',
    description: 'Einen Algorithmus oder eine Operation als Struktogramm oder Pseudocode ausformulieren',
    level: 'III',
    example: 'Implementieren Sie die Operation suche(baum, wert): Wahrheitswert als Struktogramm.',
  },
  {
    name: 'beurteilen',
    description: 'Einen Sachverhalt mit begründetem eigenen Urteil bewerten (Pro/Contra mit Argumentation)',
    level: 'III',
    example: 'Beurteilen Sie die Sicherheit des Verfahrens hinsichtlich Häufigkeitsanalyse.',
  },
  {
    name: 'berechnen',
    description: 'Einen numerischen Wert durch Anwenden mathematischer/algorithmischer Schritte ermitteln',
    level: 'I',
    example: 'Berechnen Sie den komprimierten Code für "ABRAKADABRA".',
  },
];

export const getOperatorByName = (name: string): OperatorDefinition | undefined =>
  OPERATORS.find((o) => o.name === name);
