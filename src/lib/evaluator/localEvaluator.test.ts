import { describe, it, expect } from 'vitest';
import { computeHamming74, evaluateMC } from './localEvaluator';

describe('computeHamming74', () => {
  it('matches documented bit order p0 p1 d0 p2 d1 d2 d3', () => {
    const r = computeHamming74(1, 0, 1, 1);
    expect(r.order).toBe('p0 p1 d0 p2 d1 d2 d3');
    expect(r.bitstring.length).toBe(7);
  });
});

describe('evaluateMC', () => {
  it('full score when exact match', () => {
    const opts = [{ id: 0, text: 'A' }, { id: 1, text: 'B' }];
    const r = evaluateMC([0], [0], opts, 3, 'ok');
    expect(r.correct).toBe(true);
    expect(r.score).toBe(3);
  });
});
