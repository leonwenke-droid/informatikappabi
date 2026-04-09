import type { GlossaryEntry } from '../types/learning';

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'algorithmus',
    term: 'Algorithmus',
    shortDef: 'Endliche, eindeutige Schrittfolge zur Problemlösung.',
    simpleExplanation:
      'Wie ein Rezept: Jeder Schritt ist klar, und wenn du alles befolgst, weißt du genau, was als Nächstes dran ist.',
    relatedUnitIds: ['s01-u01'],
    officialRef: 'KC Informatik 2017 — algorithmisches Grundverständnis',
  },
  {
    id: 'problem',
    term: 'Problem (informatisch)',
    shortDef: 'Aufgabe mit Eingabe, gewünschter Ausgabe und ggf. Vorbedingungen.',
    simpleExplanation:
      'Du bekommst etwas gegeben (Eingabe) und sollst etwas Bestimmtes herausfinden oder erzeugen (Ausgabe).',
    relatedUnitIds: ['s01-u01'],
  },
  {
    id: 'implementierung',
    term: 'Implementierung',
    shortDef: 'Umsetzung eines Algorithmus in einer konkreten Notation oder Sprache.',
    simpleExplanation:
      'Der Algorithmus ist die Idee; die Implementierung schreibt sie so auf, dass ein Computer (oder die Prüfung) sie nachvollziehen kann.',
    relatedUnitIds: ['s01-u01'],
    officialRef: 'Ergänzende Hinweise 2021 — Pseudocode/Notation',
  },
];

export const GLOSSARY_BY_ID: Record<string, GlossaryEntry> = Object.fromEntries(
  GLOSSARY.map((g) => [g.id, g])
);
