import { describe, expect, it } from 'vitest';
import { compareGrids } from './compareResults';

describe('compareGrids', () => {
  it('erkennt exakt gleiche Tabellen', () => {
    const g = { cols: ['a', 'b'], rows: [[1, 'x']] };
    expect(compareGrids(g, g, 'ordered').kind).toBe('match');
  });

  it('set-Modus ignoriert Zeilenreihenfolge', () => {
    const a = { cols: ['n'], rows: [['1'], ['2']] };
    const b = { cols: ['n'], rows: [['2'], ['1']] };
    expect(compareGrids(a, b, 'set').kind).toBe('match');
  });

  it('meldet Spaltenabweichung', () => {
    const r = compareGrids({ cols: ['a'], rows: [[1]] }, { cols: ['b'], rows: [[1]] }, 'ordered');
    expect(r.kind).toBe('column_mismatch');
  });
});
