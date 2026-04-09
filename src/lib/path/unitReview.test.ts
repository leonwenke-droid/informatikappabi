import { describe, it, expect } from 'vitest';
import { shouldReviewUnit, nextReviewTimestampFromDays } from './unitReview';

describe('unitReview', () => {
  it('shouldReviewUnit false if not completed', () => {
    expect(shouldReviewUnit(undefined)).toBe(false);
    expect(shouldReviewUnit({ checklist: {}, conceptCheckSolved: {}, completed: false })).toBe(false);
  });

  it('shouldReviewUnit true when reviewDue', () => {
    expect(
      shouldReviewUnit({ checklist: {}, conceptCheckSolved: {}, completed: true, reviewDue: true })
    ).toBe(true);
  });

  it('shouldReviewUnit true when nextReviewAt passed', () => {
    const now = 1_000_000;
    expect(
      shouldReviewUnit(
        { checklist: {}, conceptCheckSolved: {}, completed: true, nextReviewAt: now - 1 },
        now
      )
    ).toBe(true);
  });

  it('nextReviewTimestampFromDays', () => {
    const t0 = 1_000_000;
    expect(nextReviewTimestampFromDays(1, t0)).toBe(t0 + 86400000);
  });
});
