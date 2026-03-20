import { describe, expect, it } from 'vitest';

import getAppMetaTitle from '#/helpers/pageTitle';

describe('getAppMetaTitle', () => {
  it('returns app name when title is empty', () => {
    expect(getAppMetaTitle()).toBe('vimcolorschemes');
  });

  it('keeps an already formatted title', () => {
    expect(getAppMetaTitle('trending | vimcolorschemes')).toBe(
      'trending | vimcolorschemes',
    );
  });

  it('appends app name to plain title', () => {
    expect(getAppMetaTitle('trending colorschemes')).toBe(
      'trending colorschemes | vimcolorschemes',
    );
  });
});
