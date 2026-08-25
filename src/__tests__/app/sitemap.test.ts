import { beforeEach, describe, expect, it, vi } from 'vitest';

import sitemap from '@/app/sitemap';

const getAllRepositoryKeysMock = vi.hoisted(() => vi.fn());

vi.mock('@/services/repositoriesServer', () => ({
  RepositoriesService: {
    getAllRepositoryKeys: getAllRepositoryKeysMock,
  },
}));

describe('sitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.APP_URL = 'https://vimcolorschemes.com';
  });

  it('lists repository urls with the lowercased route the pages are built at', async () => {
    getAllRepositoryKeysMock.mockResolvedValue([
      { ownerName: 'EdenEast', name: 'nightfox.nvim' },
      { ownerName: 'morhetz', name: 'gruvbox' },
    ]);

    const entries = await sitemap();
    const repositoryURLs = entries
      .map(entry => entry.url)
      .filter(url => url.includes('/r/'));

    expect(repositoryURLs).toEqual([
      'https://vimcolorschemes.com/r/edeneast/nightfox.nvim',
      'https://vimcolorschemes.com/r/morhetz/gruvbox',
    ]);
  });
});
