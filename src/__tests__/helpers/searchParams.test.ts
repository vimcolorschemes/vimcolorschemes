import { describe, expect, it } from 'vitest';

import { SearchParamsHelper } from '@/helpers/searchParams';

describe('SearchParamsHelper.getValue', () => {
  it('returns a trimmed search param value', () => {
    expect(SearchParamsHelper.getValue({ q: ' tokyo ' }, 'q')).toBe('tokyo');
  });

  it('returns the first value for array search params', () => {
    expect(
      SearchParamsHelper.getValue({ q: [' tokyo ', 'catppuccin'] }, 'q'),
    ).toBe('tokyo');
  });

  it('returns undefined for missing search params', () => {
    expect(SearchParamsHelper.getValue({}, 'q')).toBeUndefined();
  });

  it('returns undefined for blank search params', () => {
    expect(SearchParamsHelper.getValue({ q: '   ' }, 'q')).toBeUndefined();
  });

  it('supports arbitrary search param keys', () => {
    expect(SearchParamsHelper.getValue({ owner: ' folke ' }, 'owner')).toBe(
      'folke',
    );
  });
});
