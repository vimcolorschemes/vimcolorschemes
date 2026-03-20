import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatDate } from '#/helpers/date';

const NOW = new Date('2026-03-20T12:00:00.000Z');

function fromNow(ms: number): Date {
  return new Date(NOW.getTime() - ms);
}

describe('formatDate', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns now for dates under one minute old', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatDate(fromNow(30 * 1000))).toBe('now');
  });

  it('formats minutes and hours', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatDate(fromNow(5 * 60 * 1000))).toBe('5 minutes ago');
    expect(formatDate(fromNow(2 * 60 * 60 * 1000))).toBe('2 hours ago');
  });

  it('formats days and weeks', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatDate(fromNow(3 * 24 * 60 * 60 * 1000))).toBe('3 days ago');
    expect(formatDate(fromNow(2 * 7 * 24 * 60 * 60 * 1000))).toBe(
      '2 weeks ago',
    );
  });

  it('formats months and years', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    expect(formatDate(fromNow(3 * 30 * 24 * 60 * 60 * 1000))).toBe(
      '3 months ago',
    );
    expect(formatDate(fromNow(2 * 365 * 24 * 60 * 60 * 1000))).toBe(
      '2 years ago',
    );
  });
});
