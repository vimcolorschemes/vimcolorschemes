import { describe, it, expect } from 'vitest';

import FilterHelper from '@/helpers/filter';
import Engines from '@/lib/engines';

describe('FilterHelper.getURLFromFilter', () => {
  it('should return the engine filter', () => {
    expect(FilterHelper.getURLFromFilter({ engine: Engines.Vim })).toBe(
      'e.vim',
    );
  });

  it('should return the background filter', () => {
    expect(FilterHelper.getURLFromFilter({ background: 'light' })).toBe(
      'b.light',
    );
  });

  it('should return the search filter', () => {
    expect(FilterHelper.getURLFromFilter({ search: 'test-search' })).toBe(
      's.test-search',
    );
  });

  it('should ignore invalid keys', () => {
    // @ts-expect-error
    expect(FilterHelper.getURLFromFilter({ invalid: 'filter' })).toBe('');
  });

  it('should ignore invalid values for engine', () => {
    // @ts-expect-error
    expect(FilterHelper.getURLFromFilter({ engine: 'invalid' })).toBe('');
  });

  it('should ignore invalid values for background', () => {
    // @ts-expect-error
    expect(FilterHelper.getURLFromFilter({ background: 'invalid' })).toBe('');
  });

  it('should allow multiple filters', () => {
    expect(
      FilterHelper.getURLFromFilter({
        engine: Engines.Vim,
        background: 'light',
        search: 'test-search',
      }),
    ).toBe('e.vim/b.light/s.test-search');
  });

  it('should ignore invalid filters with multiple filters', () => {
    expect(
      FilterHelper.getURLFromFilter({
        engine: Engines.Vim,
        // @ts-expect-error
        invalid: 'filter',
        search: 'test-search',
      }),
    ).toBe('e.vim/s.test-search');
  });
});

describe('FilterHelper.getFilterFromURL', () => {
  it('should return the engine filter', () => {
    expect(FilterHelper.getFilterFromURL(['e.vim'])).toEqual({
      engine: Engines.Vim,
    });
  });

  it('should ignore invalid values for engine', () => {
    expect(FilterHelper.getFilterFromURL(['e.invalid'])).toEqual({});
  });

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
    expect(
      FilterHelper.getFilterFromURL(['e.vim', 'b.light', 's.test-search']),
    ).toEqual({
      engine: Engines.Vim,
      background: 'light',
      search: 'test-search',
    });
  });

  it('should ignore invalid filters with multiple filters', () => {
    expect(
      FilterHelper.getFilterFromURL(['e.vim', 'i.filter', 's.test-search']),
    ).toEqual({
      engine: Engines.Vim,
      search: 'test-search',
    });
  });

  it('should keep the first valid filter with duplicate filters', () => {
    expect(
      FilterHelper.getFilterFromURL(['e.vim', 'e.neovim', 's.test-search']),
    ).toEqual({
      engine: Engines.Vim,
      search: 'test-search',
    });

    expect(
      FilterHelper.getFilterFromURL(['e.invalid', 'e.neovim', 's.test-search']),
    ).toEqual({
      engine: Engines.Neovim,
      search: 'test-search',
    });
  });
});
