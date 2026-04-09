import type { MisconceptionId } from '../../types/learning';

export interface MisconceptionInfo {
  id: MisconceptionId;
  label: string;
  whyTypical: string;
  remediationHint: string;
}

export const MISCONCEPTION_CATALOG: Record<MisconceptionId, MisconceptionInfo> = {
  concept_not_understood: {
    id: 'concept_not_understood',
    label: 'Begriff noch unsicher',
    whyTypical: 'Neue Begriffe brauchen oft mehrere Wiederholungen.',
    remediationHint: 'Glossar öffnen und die Lektion in der Anfänger-Ebene noch einmal lesen.',
  },
  recursion_base_missing: {
    id: 'recursion_base_missing',
    label: 'Rekursionsbasis fehlt oder falsch',
    whyTypical: 'Ohne Basisfall läuft die Rekursion endlos oder bricht falsch ab.',
    remediationHint: 'Mini-Aufgabe: Nur den Basisfall in Worten formulieren, dann erst den rekursiven Schritt.',
  },
  recursion_step_wrong: {
    id: 'recursion_step_wrong',
    label: 'Rekursionsschritt passt nicht',
    whyTypical: 'Der rekursive Aufruf muss das Problem verkleinern und zum Basisfall führen.',
    remediationHint: 'Tracetabelle mit kleinem n durchspielen.',
  },
  bst_left_right_swapped: {
    id: 'bst_left_right_swapped',
    label: 'BST links/rechts vertauscht',
    whyTypical: 'Links kleiner, rechts größer — schnell verwechselt.',
    remediationHint: 'Visualisierung BST: Lernmodus, drei Einfügeschritte mit Erklärung.',
  },
  stack_queue_confusion: {
    id: 'stack_queue_confusion',
    label: 'Stack vs. Queue verwechselt',
    whyTypical: 'LIFO vs. FIFO wird in Aufgabenstellungen oft nur implizit genannt.',
    remediationHint: 'Visualisierung Stack/Queue: Demo-Modus mit Alltagsmetapher.',
  },
  having_where_confusion: {
    id: 'having_where_confusion',
    label: 'HAVING vs. WHERE verwechselt',
    whyTypical: 'WHERE filtert Zeilen vor Gruppierung, HAVING filtert Gruppen.',
    remediationHint: 'SQL-Referenz: Abschnitt Aggregat + Gruppe.',
  },
  join_missing: {
    id: 'join_missing',
    label: 'JOIN fehlt oder falsch',
    whyTypical: 'Mehrere Tabellen ohne Verknüpfung liefern Kreuzprodukte.',
    remediationHint: 'ER→Schema prüfen: welche Fremdschlüssel gehören zusammen?',
  },
  hamming_wrong_layout: {
    id: 'hamming_wrong_layout',
    label: 'Hamming-Bitposition falsch',
    whyTypical: 'Offizielle Bitreihenfolge und Kontrollgruppen müssen exakt sitzen.',
    remediationHint: 'Hamming-Visualisierung: Schritt-für-Schritt mit offizieller Anlage.',
  },
  regular_vs_cf_confusion: {
    id: 'regular_vs_cf_confusion',
    label: 'Regulär vs. kontextfrei verwechselt',
    whyTypical: 'Sprachklassen werden oft über Beispiele verwechselt.',
    remediationHint: 'Lektion Formale Sprachen: Merksätze und Mini-Beispiele.',
  },
  automaton_reading_error: {
    id: 'automaton_reading_error',
    label: 'Automat falsch gelesen',
    whyTypical: 'Zustandsübergänge und Eingabe/Stack werden übersehen.',
    remediationHint: 'DEA/Mealy: Lernmodus mit einer Zeichenkette langsam durchklicken.',
  },
  operator_ignored: {
    id: 'operator_ignored',
    label: 'Aufgabenoperator nicht beachtet',
    whyTypical: '„Implementieren“ verlangt anderen Tiefgang als „Nennen“.',
    remediationHint: 'Operatoren-Übersicht im Themenbereich öffnen.',
  },
};

/** Heuristische Zuordnung aus Freitext-Feedback (lokal, grob) */
export function inferMisconceptionsFromFeedback(feedback: string): MisconceptionId[] {
  const f = feedback.toLowerCase();
  const out: MisconceptionId[] = [];
  if (/basis|basisfall|rekursion.*ende/i.test(f)) out.push('recursion_base_missing');
  if (/rekurs|schritt/i.test(f) && /falsch|überprüf/i.test(f)) out.push('recursion_step_wrong');
  if (/bst|binär|links|rechts/i.test(f)) out.push('bst_left_right_swapped');
  if (/stack|queue|fifo|lifo|warteschlange|keller/i.test(f)) out.push('stack_queue_confusion');
  if (/having|where|gruppier/i.test(f)) out.push('having_where_confusion');
  if (/join|verknüpf/i.test(f)) out.push('join_missing');
  if (/hamming|parität|kontrollbit/i.test(f)) out.push('hamming_wrong_layout');
  if (/regulär|kontextfrei|grammatik/i.test(f)) out.push('regular_vs_cf_confusion');
  if (/zustand|dea|automat|übergang/i.test(f)) out.push('automaton_reading_error');
  if (/operator|implementier|analysier/i.test(f)) out.push('operator_ignored');
  if (out.length === 0) out.push('concept_not_understood');
  return [...new Set(out)];
}
