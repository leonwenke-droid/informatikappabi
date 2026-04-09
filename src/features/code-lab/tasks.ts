import type { ExamOperator } from '../../types';

export interface CodeLabTask {
  id: string;
  title: string;
  story: string;
  operator: ExamOperator;
  points: number;
  /** Teilstrings, die (case-insensitiv) vorkommen sollen */
  requiredSubstrings: string[];
  /** Regex, alle müssen matchen */
  requiredPatterns: { re: RegExp; hint: string }[];
  starterCode: string;
  /** Für KI-Vergleich */
  referenceSolution: string;
  /** Stufen-UI: kurze Didaktik-Schritte */
  stages: string[];
}

export const CODE_LAB_TASKS: CodeLabTask[] = [
  {
    id: 'code-bst-contains',
    title: 'BST: enthält (rekursiv)',
    story:
      'Gegeben sei ein binärer Suchbaum mit Knoten, die Schlüssel vom Typ int speichern. Implementieren Sie eine Methode **contains(int k)**, die true liefert, wenn k im Baum vorkommt — rekursiv oder mit Hilfsmethode.',
    operator: 'implementieren',
    points: 6,
    requiredSubstrings: ['contains', 'return'],
    requiredPatterns: [
      { re: /if\s*\(/i, hint: 'Fallunterscheidung (if) für Basisfall und Rekursion.' },
      { re: /k\s*[<>=!]=?|==|equals/i, hint: 'Vergleich des gesuchten Werts mit dem aktuellen Schlüssel.' },
    ],
    starterCode: `class Knoten {
  int schluessel;
  Knoten links, rechts;
  Knoten(int s, Knoten l, Knoten r) {
    schluessel = s; links = l; rechts = r;
  }
}

class BST {
  Knoten wurzel;

  // TODO: contains(int k)
}
`,
    referenceSolution: `boolean contains(Knoten n, int k) {
  if (n == null) return false;
  if (k == n.schluessel) return true;
  if (k < n.schluessel) return contains(n.links, k);
  return contains(n.rechts, k);
}`,
    stages: [
      'Aufgabe lesen: Signatur und Rekursionsidee',
      'Basisfall: leerer Teilbaum',
      'Rekursionsschritt: links/rechts je nach k',
      'Lokale Checks & optional KI',
    ],
  },
  {
    id: 'code-dynarray-push',
    title: 'Dynamisches Array: anfügen',
    story:
      'Ein dynamisches Array speichert Elemente in einem Feld **data** mit aktueller Länge **size** und Kapazität **cap**. Implementieren Sie **push(int x)**: wenn **size == cap**, verdoppeln Sie die Kapazität und kopieren Sie die alten Elemente, dann fügen Sie x am Ende ein.',
    operator: 'implementieren',
    points: 6,
    requiredSubstrings: ['push', 'size', 'cap'],
    requiredPatterns: [
      { re: /if\s*\(\s*size\s*==\s*cap|size\s*>=\s*cap/i, hint: 'Bedingung für „Array voll“.' },
      { re: /data\[|System\.arraycopy|for\s*\(/i, hint: 'Neues Feld oder Kopierschleife bei Wachstum.' },
    ],
    starterCode: `class DynArray {
  int[] data;
  int size;
  int cap;

  void push(int x) {
    // TODO
  }
}
`,
    referenceSolution: `if (size == cap) {
  int nc = cap == 0 ? 1 : cap * 2;
  int[] nd = new int[nc];
  for (int i = 0; i < size; i++) nd[i] = data[i];
  data = nd; cap = nc;
}
data[size++] = x;`,
    stages: ['Idee: amortisiert O(1)', 'Voll? → neues Feld', 'Element an data[size] setzen, size++'],
  },
  {
    id: 'code-stack-pop',
    title: 'Keller (Stack): pop',
    story:
      'Ein Stack sei mit einem Array **st** und **top** (-1 wenn leer) umgesetzt. Implementieren Sie **pop()**, das das oberste Element entfernt und zurückgibt; bei leerem Stack soll eine sinnvolle Reaktion erfolgen (hier: werfen von **IllegalStateException** oder Rückgabe mit Vorbedingung dokumentieren — wählen Sie Exception).',
    operator: 'implementieren',
    points: 4,
    requiredSubstrings: ['pop', 'top'],
    requiredPatterns: [
      { re: /if\s*\(\s*top\s*[<]=\s*-1|top\s*<\s*0|isEmpty/i, hint: 'Leer-Test vor Zugriff.' },
      { re: /return\s+st\[/i, hint: 'Rückgabe des obersten Elements.' },
    ],
    starterCode: `class IntStack {
  int[] st;
  int top; // -1 wenn leer

  int pop() {
    // TODO
  }
}
`,
    referenceSolution: `if (top < 0) throw new IllegalStateException("leer");
return st[top--];`,
    stages: ['Leerer Stack', 'top dekrementieren', 'Wert zurückgeben'],
  },
  {
    id: 'code-queue-enqueue',
    title: 'Schlange: enqueue (ringpuffer skizze)',
    story:
      'Eine Queue nutzt ein Array **q**, Indizes **head** und **tail** und **count**. Implementieren Sie **enqueue(int x)**: wenn **count == q.length**, vergrößern oder Fehler — hier: verdoppeln wie beim DynArray. Nutzen Sie Modulo **% q.length** für den Ringpuffer.',
    operator: 'implementieren',
    points: 6,
    requiredSubstrings: ['enqueue', 'tail', 'count'],
    requiredPatterns: [
      { re: /%\s*q\.length|%\s*length/i, hint: 'Ringpuffer: Index mit Modulo.' },
      { re: /q\[\s*tail|tail\s*\]/i, hint: 'Einfügen an tail-Position.' },
    ],
    starterCode: `class IntQueue {
  int[] q;
  int head, tail, count;

  void enqueue(int x) {
    // TODO
  }
}
`,
    referenceSolution: `if (count == q.length) { /* vergrößern */ }
q[tail] = x;
tail = (tail + 1) % q.length;
count++;`,
    stages: ['Voll?', 'Element an tail', 'tail und count aktualisieren'],
  },
];
