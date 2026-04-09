import type { Database } from 'sql.js';

export type SqlCompareMode = 'ordered' | 'set';

export type SqlLabDiag =
  | { kind: 'parser'; message: string }
  | { kind: 'not_select' }
  | { kind: 'empty'; message: string }
  | { kind: 'column_mismatch'; expected: string[]; got: string[] }
  | { kind: 'row_count'; expected: number; got: number }
  | { kind: 'cell_mismatch'; row: number; col: string; expected: string; got: string }
  | { kind: 'match' };

function normCell(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v);
  return String(v).trim();
}

function normHeader(c: string): string {
  return c.trim().toLowerCase();
}

export function gridFromSelect(db: Database, sql: string): { cols: string[]; rows: unknown[][] } | SqlLabDiag {
  const trimmed = sql.trim();
  if (!trimmed.toUpperCase().startsWith('SELECT') && !trimmed.toUpperCase().startsWith('WITH')) {
    return { kind: 'not_select' };
  }
  try {
    const res = db.exec(trimmed);
    if (!res.length) return { cols: [], rows: [] };
    return { cols: res[0].columns, rows: (res[0].values ?? []) as unknown[][] };
  } catch (e) {
    return { kind: 'parser', message: e instanceof Error ? e.message : String(e) };
  }
}

function sortRowsForSet(rows: unknown[][], cols: number): unknown[][] {
  return [...rows].sort((a, b) => {
    for (let i = 0; i < cols; i++) {
      const ca = normCell(a[i]);
      const cb = normCell(b[i]);
      if (ca < cb) return -1;
      if (ca > cb) return 1;
    }
    return 0;
  });
}

export function compareGrids(
  expected: { cols: string[]; rows: unknown[][] },
  got: { cols: string[]; rows: unknown[][] },
  mode: SqlCompareMode
): SqlLabDiag {
  const expH = expected.cols.map(normHeader);
  const gotH = got.cols.map(normHeader);
  if (expH.length !== gotH.length || expH.some((h, i) => h !== gotH[i])) {
    return { kind: 'column_mismatch', expected: expected.cols, got: got.cols };
  }

  let expRows = expected.rows;
  let gotRows = got.rows;
  if (mode === 'set') {
    expRows = sortRowsForSet(expRows, expH.length);
    gotRows = sortRowsForSet(gotRows, gotH.length);
  }

  if (expRows.length !== gotRows.length) {
    return { kind: 'row_count', expected: expRows.length, got: gotRows.length };
  }

  for (let r = 0; r < expRows.length; r++) {
    for (let c = 0; c < expH.length; c++) {
      const e = normCell(expRows[r][c]);
      const g = normCell(gotRows[r][c]);
      if (e !== g) {
        return {
          kind: 'cell_mismatch',
          row: r + 1,
          col: expected.cols[c] ?? String(c),
          expected: e,
          got: g,
        };
      }
    }
  }

  return { kind: 'match' };
}

export function diagLabel(d: SqlLabDiag): string {
  switch (d.kind) {
    case 'parser':
      return `SQL-Parser / Laufzeit: ${d.message}`;
    case 'not_select':
      return 'Bitte eine SELECT-Abfrage (kein DDL/DML in dieser Übung).';
    case 'empty':
      return d.message;
    case 'column_mismatch':
      return `Spalten passen nicht: erwartet [${d.expected.join(', ')}], erhalten [${d.got.join(', ')}].`;
    case 'row_count':
      return `Zeilenanzahl: erwartet ${d.expected}, erhalten ${d.got}.`;
    case 'cell_mismatch':
      return `Zelle Zeile ${d.row}, Spalte „${d.col}“: erwartet „${d.expected}“, erhalten „${d.got}“.`;
    case 'match':
      return 'Ergebnis stimmt mit der Musterabfrage überein.';
    default:
      return '';
  }
}
