import { describe, it, expect } from 'vitest';

import FilterHelper from '@/helpers/filter';

describe('FilterHelper.getURLFromFilter', () => {
  it('should return the background filter', () => {
    expect(FilterHelper.getURLFromFilter({ background: 'light' })).toBe(
      'b.light',
    );
  });

  it('should return the search filter', () => {
    expect(FilterHelper.getURLFromFilter({ search: 'test-search' })).toBe(
      's.test%20search',
    );
  });

  it('should ignore invalid keys', () => {
    // @ts-expect-error invalid key
    expect(FilterHelper.getURLFromFilter({ invalid: 'filter' })).toBe('');
  });

  it('should ignore invalid values for background', () => {
    // @ts-expect-error invalid value
    expect(FilterHelper.getURLFromFilter({ background: 'invalid' })).toBe('');
  });

  it('should allow multiple filters', () => {
    expect(
      FilterHelper.getURLFromFilter({
        background: 'light',
        search: 'test-search',
      }),
    ).toBe('b.light/s.test%20search');
  });

  it('should ignore invalid filters with multiple filters', () => {
    expect(
      FilterHelper.getURLFromFilter({
        // @ts-expect-error invalid key
        invalid: 'filter',
        search: 'test-search',
      }),
    ).toBe('s.test%20search');
  });
});

describe('FilterHelper.getFilterFromURL', () => {
  it('should return the background filter', () => {
    expect(FilterHelper.getFilterFromURL(['b.light'])).toEqual({
      background: 'light',
    });
  });

  it('should return the search filter', () => {
    expect(FilterHelper.getFilterFromURL(['s.test-search'])).toEqual({
      search: 'test-search',
    });
  });

  it('should ignore invalid keys', () => {
    expect(FilterHelper.getFilterFromURL(['i.filter'])).toEqual({});
  });

  it('should ignore invalid values for background', () => {
    expect(FilterHelper.getFilterFromURL(['b.invalid'])).toEqual({});
  });

  it('should allow multiple filters', () => {
    expect(FilterHelper.getFilterFromURL(['b.light', 's.test-search'])).toEqual(
      {
        background: 'light',
        search: 'test-search',
      },
    );
  });

  it('should ignore invalid filters with multiple filters', () => {
    expect(
      FilterHelper.getFilterFromURL(['i.filter', 's.test-search']),
    ).toEqual({
      search: 'test-search',
    });
  });

  it('should keep the first valid filter with duplicate filters', () => {
    expect(
      FilterHelper.getFilterFromURL(['s.test-search', 's.duplicate']),
    ).toEqual({
      search: 'test-search',
    });
  });
});
