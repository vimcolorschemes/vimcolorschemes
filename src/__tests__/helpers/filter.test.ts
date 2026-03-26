import { describe, it, expect } from 'vitest';

import { FilterHelper } from '@/helpers/filter';

describe('FilterHelper.getURLFromFilter', () => {
  it('should return the background filter', () => {
    expect(FilterHelper.getURLFromFilter({ background: 'light' })).toBe(
      'b.light',
    );
  });

  it('should return the both background filter', () => {
    expect(FilterHelper.getURLFromFilter({ background: 'both' })).toBe(
      'b.both',
    );
  });

  it('should ignore search filter (no longer URL-encoded)', () => {
    expect(FilterHelper.getURLFromFilter({ search: 'test-search' })).toBe('');
  });

  it('should ignore invalid keys', () => {
    // @ts-expect-error invalid key
    expect(FilterHelper.getURLFromFilter({ invalid: 'filter' })).toBe('');
  });

  it('should ignore invalid values for background', () => {
    // @ts-expect-error invalid value
    expect(FilterHelper.getURLFromFilter({ background: 'invalid' })).toBe('');
  });

  it('should only include background in URL with multiple filters', () => {
    expect(
      FilterHelper.getURLFromFilter({
        background: 'light',
        search: 'test-search',
      }),
    ).toBe('b.light');
  });

  it('should ignore non-URL filters with multiple filters', () => {
    expect(
      FilterHelper.getURLFromFilter({
        // @ts-expect-error invalid key
        invalid: 'filter',
        search: 'test-search',
      }),
    ).toBe('');
  });
});

describe('FilterHelper.getFilterFromURL', () => {
  it('should return the background filter', () => {
    expect(FilterHelper.getFilterFromURL(['b.light'])).toEqual({
      background: 'light',
    });
  });

  it('should return the both background filter', () => {
    expect(FilterHelper.getFilterFromURL(['b.both'])).toEqual({
      background: 'both',
    });
  });

  it('should ignore search segments (no longer URL-decoded)', () => {
    expect(FilterHelper.getFilterFromURL(['s.test-search'])).toEqual({});
  });

  it('should ignore invalid keys', () => {
    expect(FilterHelper.getFilterFromURL(['i.filter'])).toEqual({});
  });

  it('should ignore invalid values for background', () => {
    expect(FilterHelper.getFilterFromURL(['b.invalid'])).toEqual({});
  });

  it('should parse background from multiple segments', () => {
    expect(FilterHelper.getFilterFromURL(['b.light', 's.test-search'])).toEqual(
      {
        background: 'light',
      },
    );
  });

  it('should ignore invalid filters with multiple filters', () => {
    expect(
      FilterHelper.getFilterFromURL(['i.filter', 's.test-search']),
    ).toEqual({});
  });

  it('should keep the first valid background with duplicate filters', () => {
    expect(FilterHelper.getFilterFromURL(['b.light', 'b.dark'])).toEqual({
      background: 'light',
    });
  });
});
