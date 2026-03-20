import { describe, expect, it } from 'vitest';

import getRepositoryListingMetaTitle from '#/helpers/repositoryListingMetaTitle';

describe('getRepositoryListingMetaTitle', () => {
  it('builds the default listing title', () => {
    expect(getRepositoryListingMetaTitle({})).toBe(
      'trending colorschemes | vimcolorschemes',
    );
  });

  it('includes the selected background and page number', () => {
    expect(getRepositoryListingMetaTitle({ background: 'dark', page: 3 })).toBe(
      'trending dark colorschemes - page 3 | vimcolorschemes',
    );
  });

  it('formats the both-background label', () => {
    expect(getRepositoryListingMetaTitle({ background: 'both' })).toBe(
      'trending light and dark colorschemes | vimcolorschemes',
    );
  });
});
