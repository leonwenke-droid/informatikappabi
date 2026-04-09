import type { PathStage } from '../../types/learning';

/** 15 Etappen — Reihenfolge wie im Lernplan (didaktisch, nicht amtlich). */
export const PATH_STAGES: PathStage[] = [
  { id: 's01', order: 1, title: 'Grundlagen informatischer Denkweise', subtitle: 'Problem, Algorithmus, Korrektheit', prerequisiteStageIds: [], estimatedMinutes: 45, difficulty: 1, unitIds: ['s01-u01'] },
  { id: 's02', order: 2, title: 'Variablen und Kontrollstrukturen', prerequisiteStageIds: ['s01'], estimatedMinutes: 60, difficulty: 1, unitIds: ['s02-u01'] },
  { id: 's03', order: 3, title: 'Algorithmen und Tracetabellen', prerequisiteStageIds: ['s02'], estimatedMinutes: 60, difficulty: 1, unitIds: ['s03-u01'] },
  { id: 's04', order: 4, title: 'Statische Reihungen', prerequisiteStageIds: ['s03'], estimatedMinutes: 50, difficulty: 2, unitIds: ['s04-u01'] },
  { id: 's05', order: 5, title: 'Rekursion', prerequisiteStageIds: ['s04'], estimatedMinutes: 70, difficulty: 2, unitIds: ['s05-u01'] },
  { id: 's06', order: 6, title: 'DynArray, Stack, Queue', prerequisiteStageIds: ['s05'], estimatedMinutes: 65, difficulty: 2, unitIds: ['s06-u01'] },
  { id: 's07', order: 7, title: 'OOP, Vererbung, Klassendiagramme', prerequisiteStageIds: ['s06'], estimatedMinutes: 80, difficulty: 2, unitIds: ['s07-u01'] },
  { id: 's08', order: 8, title: 'Binärbaum, BST, Traversierungen', prerequisiteStageIds: ['s07'], estimatedMinutes: 75, difficulty: 2, unitIds: ['s08-u01'] },
  { id: 's09', order: 9, title: 'Kryptologie', prerequisiteStageIds: ['s08'], estimatedMinutes: 60, difficulty: 2, unitIds: ['s09-u01'] },
  { id: 's10', order: 10, title: 'Codierung, Hamming, Huffman', prerequisiteStageIds: ['s09'], estimatedMinutes: 70, difficulty: 2, unitIds: ['s10-u01'] },
  { id: 's11', order: 11, title: 'Datenbanken, ER, SQL', prerequisiteStageIds: ['s10'], estimatedMinutes: 80, difficulty: 2, unitIds: ['s11-u01'] },
  { id: 's12', order: 12, title: 'Automaten, Mealy, Kellerautomat', prerequisiteStageIds: ['s11'], estimatedMinutes: 75, difficulty: 3, unitIds: ['s12-u01'] },
  { id: 's13', order: 13, title: 'Formale Sprachen und Grammatiken', prerequisiteStageIds: ['s12'], estimatedMinutes: 65, difficulty: 3, unitIds: ['s13-u01'] },
  { id: 's14', order: 14, title: 'Netzwerke, Datenschutz, Chancen und Risiken', prerequisiteStageIds: ['s13'], estimatedMinutes: 55, difficulty: 2, unitIds: ['s14-u01'] },
  { id: 's15', order: 15, title: 'Klausurstrategie und Zeitmanagement', prerequisiteStageIds: ['s14'], estimatedMinutes: 40, difficulty: 1, unitIds: ['s15-u01'] },
];
