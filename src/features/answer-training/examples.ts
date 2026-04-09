import type { ExamOperator } from '../../types';

export interface FormulationExample {
  operator: ExamOperator;
  context: string;
  bad: string;
  good: string;
}

export const FORMULATION_EXAMPLES: FormulationExample[] = [
  {
    operator: 'erläutern',
    context: 'Warum ist Inorder-Traversierung im BST sortiert?',
    bad: 'Weil der Baum so gebaut ist.',
    good:
      'Beim Inorder-Durchlauf wird zuerst der linke Teilbaum, dann die Wurzel, dann der rechte Teilbaum besucht. Die BST-Eigenschaft (linker TB < Wurzel < rechter TB) sorgt dafür, dass kleinere Werte vor der Wurzel und größere danach ausgegeben werden — das ergibt eine aufsteigende Folge.',
  },
  {
    operator: 'nennen',
    context: 'Eigenschaften eines Stacks',
    bad: 'Er funktioniert wie ein Stapel und ist effizient.',
    good: 'LIFO (Last-In-First-Out); Operationen push und pop am gleichen Ende; Zugriff nur auf oberstes Element.',
  },
  {
    operator: 'beurteilen',
    context: 'Einsatz eines Arrays vs. verkettete Liste für Einfügen am Anfang',
    bad: 'Liste ist besser.',
    good:
      'Beim Array sind Einfügen/Löschen am Anfang O(n) wegen Verschiebens. Bei der verketteten Liste ist Einfügen am Anfang O(1), wenn man einen Zeiger auf den Kopf hat. Dafür braucht die Liste mehr Speicher pro Element und keinen Indexzugriff in O(1).',
  },
];
