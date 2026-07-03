import { describe, expect, it } from 'vitest';

import { RepositoryDTO } from '@/models/DTO/repository';

import { RepositorySearchHelper } from '@/helpers/repositorySearch';

const repositories: RepositoryDTO[] = [
  repository({
    name: 'tokyonight.nvim',
    owner: 'folke',
    description: 'clean dark and light neovim theme',
    stars: 1000,
    weekStars: 30,
    createdAt: '2024-01-01T00:00:00.000Z',
    colorschemes: [
      { name: 'tokyonight-night', backgrounds: ['dark'] },
      { name: 'tokyonight-day', backgrounds: ['light'] },
    ],
  }),
  repository({
    name: 'gruvbox',
    owner: 'morhetz',
    description: 'retro groove color scheme theme',
    stars: 2000,
    weekStars: 5,
    createdAt: '2020-01-01T00:00:00.000Z',
    colorschemes: [{ name: 'gruvbox', backgrounds: ['dark'] }],
  }),
  repository({
    name: 'vim-colors-solarized',
    owner: 'altercation',
    description: 'precision colors theme for machines and people',
    stars: 500,
    weekStars: 15,
    createdAt: '2018-01-01T00:00:00.000Z',
    colorschemes: [{ name: 'solarized', backgrounds: ['light'] }],
  }),
];

describe('RepositorySearchHelper.searchRepositories', () => {
  it('matches repository owner, name, description, and colorscheme names', () => {
    expect(search('folke')).toEqual(['folke/tokyonight.nvim']);
    expect(search('gruv')).toEqual(['morhetz/gruvbox']);
    expect(search('machines')).toEqual(['altercation/vim-colors-solarized']);
    expect(search('solarized')).toEqual(['altercation/vim-colors-solarized']);
  });

  it('requires every query token to match', () => {
    expect(search('tokyo clean')).toEqual(['folke/tokyonight.nvim']);
    expect(search('tokyo groove')).toEqual([]);
  });

  it('filters by background before returning matches', () => {
    const darkResults = RepositorySearchHelper.searchRepositories({
      repositories,
      query: 'theme',
      sort: 'trending',
      filter: { background: 'dark' },
      page: 1,
      pageSize: 24,
    });

    const lightResults = RepositorySearchHelper.searchRepositories({
      repositories,
      query: 'solarized',
      sort: 'trending',
      filter: { background: 'light' },
      page: 1,
      pageSize: 24,
    });

    expect(keys(darkResults.repositories)).toEqual([
      'folke/tokyonight.nvim',
      'morhetz/gruvbox',
    ]);
    expect(keys(lightResults.repositories)).toEqual([
      'altercation/vim-colors-solarized',
    ]);
  });

  it('uses the selected sort as a tie-breaker', () => {
    const result = RepositorySearchHelper.searchRepositories({
      repositories,
      query: 'theme',
      sort: 'top',
      filter: {},
      page: 1,
      pageSize: 24,
    });

    expect(keys(result.repositories)).toEqual([
      'morhetz/gruvbox',
      'folke/tokyonight.nvim',
      'altercation/vim-colors-solarized',
    ]);
  });

  it('paginates results', () => {
    const result = RepositorySearchHelper.searchRepositories({
      repositories,
      query: 'theme',
      sort: 'trending',
      filter: {},
      page: 1,
      pageSize: 1,
    });

    expect(result.count).toBe(3);
    expect(result.hasMore).toBe(true);
    expect(keys(result.repositories)).toEqual(['folke/tokyonight.nvim']);
  });
});

function search(query: string): string[] {
  const result = RepositorySearchHelper.searchRepositories({
    repositories,
    query,
    sort: 'trending',
    filter: {},
    page: 1,
    pageSize: 24,
  });

  return keys(result.repositories);
}

function keys(results: RepositoryDTO[]): string[] {
  return results.map(result => `${result.owner.name}/${result.name}`);
}

function repository({
  name,
  owner,
  description,
  stars,
  weekStars,
  createdAt,
  colorschemes,
}: {
  name: string;
  owner: string;
  description: string;
  stars: number;
  weekStars: number;
  createdAt: string;
  colorschemes: { name: string; backgrounds: ('light' | 'dark')[] }[];
}): RepositoryDTO {
  return {
    name,
    owner: { name: owner },
    description,
    githubCreatedAt: createdAt,
    pushedAt: createdAt,
    githubURL: `https://github.com/${owner}/${name}`,
    stargazersCount: stars,
    weekStargazersCount: weekStars,
    vimColorSchemes: colorschemes.map(colorscheme => ({
      name: colorscheme.name,
      backgrounds: colorscheme.backgrounds,
      data: { light: null, dark: null },
    })),
  };
}
