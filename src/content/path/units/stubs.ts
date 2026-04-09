import type { PathUnit } from '../../../types/learning';

function stubBlock(text: string) {
  return { text, source: 'didactic' as const };
}

function makeStubUnit(id: string, stageId: string, title: string): PathUnit {
  const placeholder = stubBlock(
    `Diese Lerneinheit wird sukzessive mit Inhalten aus Kerncurriculum 2017, Ergänzenden Hinweisen 2021 und Klausurmuster 2021–2025 befüllt.\n\n**Titel:** ${title}\n\nBis dahin: Nutze die Themenübersicht und (später) die migrierten Übungen.`
  );
  return {
    id,
    stageId,
    title,
    tags: [],
    vocabularyTermIds: [],
    lesson: {
      tiers: {
        beginner: {
          whatIs: placeholder,
          whyItMatters: placeholder,
          terms: placeholder,
          simplestExample: placeholder,
          stepByStep: placeholder,
          typicalMistakes: placeholder,
          miniSummary: placeholder,
        },
        standard: {
          whatIs: placeholder,
          whyItMatters: placeholder,
          terms: placeholder,
          simplestExample: placeholder,
          stepByStep: placeholder,
          typicalMistakes: placeholder,
          miniSummary: placeholder,
        },
        examBrief: {
          whatIs: placeholder,
          whyItMatters: placeholder,
          terms: placeholder,
          simplestExample: placeholder,
          stepByStep: placeholder,
          typicalMistakes: placeholder,
          miniSummary: placeholder,
        },
      },
      checklistKeys: ['stub_read'],
      checklistLabels: {
        stub_read: 'Ich habe den Platzhalter gelesen und weiß, dass Inhalt folgt.',
      },
    },
    conceptChecks: [
      {
        id: `${id}-cc-stub`,
        question: 'Platzhalter-Check: Bist du bereit, mit der nächsten verfügbaren Lektion weiterzumachen?',
        options: ['Nein, ich pausiere', 'Ja'],
        correctIndex: 1,
        explanation: 'Super — komm zurück, wenn mehr Inhalt eingepflegt ist.',
      },
    ],
    exercises: [],
  };
}

export const STUB_UNITS: PathUnit[] = [
  makeStubUnit('s02-u01', 's02', 'Variablen, Zuweisung, If/Schleife'),
  makeStubUnit('s03-u01', 's03', 'Algorithmen lesen und Traces'),
  makeStubUnit('s04-u01', 's04', 'Statische Reihungen'),
  makeStubUnit('s05-u01', 's05', 'Rekursion verstehen'),
  makeStubUnit('s06-u01', 's06', 'DynArray, Stack, Queue'),
  makeStubUnit('s07-u01', 's07', 'Klassen, Vererbung, Diagramme'),
  makeStubUnit('s08-u01', 's08', 'BST und Traversierungen'),
  makeStubUnit('s09-u01', 's09', 'Kryptologie und Authentizität'),
  makeStubUnit('s10-u01', 's10', 'Codierung und Hamming/Huffman'),
  makeStubUnit('s11-u01', 's11', 'ER-Modell und SQL'),
  makeStubUnit('s12-u01', 's12', 'DEA, Mealy, Kellerautomat'),
  makeStubUnit('s13-u01', 's13', 'Grammatiken und Sprachen'),
  makeStubUnit('s14-u01', 's14', 'Netzwerke und Datenschutz'),
  makeStubUnit('s15-u01', 's15', 'Klausurstrategie'),
];
