import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RepositoriesService } from '@/services/repositoriesServer';

import { Constants } from '@/lib/constants';
import { SortOptions } from '@/lib/sort';

const executeMock = vi.hoisted(() => vi.fn());

vi.mock('@/services/database', () => ({
  DatabaseService: {
    getClient: () => ({
      execute: executeMock,
    }),
  },
}));

describe('RepositoriesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('bulk loads colorschemes for paginated repositories', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            owner_name: 'owner-a',
            name: 'repo-a',
            description: 'A repo',
            github_url: 'https://github.com/owner-a/repo-a',
            stargazers_count: 10,
            week_stargazers_count: 5,
            github_created_at: '2024-01-01T00:00:00.000Z',
            pushed_at: '2024-02-01T00:00:00.000Z',
          },
          {
            id: 2,
            owner_name: 'owner-b',
            name: 'repo-b',
            description: 'B repo',
            github_url: 'https://github.com/owner-b/repo-b',
            stargazers_count: 20,
            week_stargazers_count: 8,
            github_created_at: '2024-01-02T00:00:00.000Z',
            pushed_at: '2024-02-02T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            repo_id: 1,
            cs_id: 11,
            cs_name: 'alpha',
            csg_background: 'light',
            csg_name: 'bg',
            csg_hex_code: '#ffffff',
          },
          {
            repo_id: 1,
            cs_id: 11,
            cs_name: 'alpha',
            csg_background: 'dark',
            csg_name: 'bg',
            csg_hex_code: '#000000',
          },
          {
            repo_id: 2,
            cs_id: 22,
            cs_name: 'beta',
            csg_background: 'dark',
            csg_name: 'fg',
            csg_hex_code: '#eeeeee',
          },
        ],
      });

    const repositories = await RepositoriesService.getRepositories({
      sort: SortOptions.Trending,
      filter: { page: 2 },
    });

    expect(executeMock).toHaveBeenCalledTimes(2);
    expect(executeMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        sql: expect.stringContaining(
          'ORDER BY r.week_stargazers_count DESC, r.id LIMIT ? OFFSET ?',
        ),
        args: [Constants.REPOSITORY_PAGE_SIZE, Constants.REPOSITORY_PAGE_SIZE],
      }),
    );
    expect(executeMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        sql: expect.stringContaining('WHERE cs.repository_id IN (?, ?)'),
        args: [1, 2],
      }),
    );

    expect(repositories.map(repo => repo.dto)).toEqual([
      {
        name: 'repo-a',
        owner: { name: 'owner-a' },
        description: 'A repo',
        githubCreatedAt: new Date('2024-01-01T00:00:00.000Z'),
        pushedAt: new Date('2024-02-01T00:00:00.000Z'),
        githubURL: 'https://github.com/owner-a/repo-a',
        stargazersCount: 10,
        weekStargazersCount: 5,
        vimColorSchemes: [
          {
            name: 'alpha',
            backgrounds: ['light', 'dark'],
            data: {
              light: [{ name: 'bg', hexCode: '#ffffff' }],
              dark: [{ name: 'bg', hexCode: '#000000' }],
            },
          },
        ],
      },
      {
        name: 'repo-b',
        owner: { name: 'owner-b' },
        description: 'B repo',
        githubCreatedAt: new Date('2024-01-02T00:00:00.000Z'),
        pushedAt: new Date('2024-02-02T00:00:00.000Z'),
        githubURL: 'https://github.com/owner-b/repo-b',
        stargazersCount: 20,
        weekStargazersCount: 8,
        vimColorSchemes: [
          {
            name: 'beta',
            backgrounds: ['dark'],
            data: {
              light: null,
              dark: [{ name: 'fg', hexCode: '#eeeeee' }],
            },
          },
        ],
      },
    ]);
  });

  it('counts repositories with the generated filter query', async () => {
    executeMock.mockResolvedValueOnce({ rows: [{ count: 7 }] });

    const count = await RepositoriesService.getRepositoryCount({
      owner: 'morhetz',
      search: 'gruvbox',
    });

    expect(count).toBe(7);
    expect(executeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: expect.stringContaining(
          'SELECT COUNT(*) as count FROM repositories r WHERE EXISTS',
        ),
        args: ['%gruvbox%', '%gruvbox%', '%gruvbox%', 'morhetz'],
      }),
    );
  });

  it('counts single-background repositories with a distinct repository query', async () => {
    executeMock.mockResolvedValueOnce({ rows: [{ count: 5 }] });

    const count = await RepositoriesService.getRepositoryCount({
      background: 'dark',
      owner: 'morhetz',
      search: 'gruvbox',
    });

    expect(count).toBe(5);
    expect(executeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: expect.stringContaining(
          'SELECT COUNT(DISTINCT cs.repository_id) as count',
        ),
        args: ['%gruvbox%', '%gruvbox%', '%gruvbox%', 'morhetz', 'dark'],
      }),
    );
  });

  it('counts both-background repositories with grouped repository ids', async () => {
    executeMock.mockResolvedValueOnce({ rows: [{ count: 3 }] });

    const count = await RepositoriesService.getRepositoryCount({
      background: 'both',
      owner: 'morhetz',
    });

    expect(count).toBe(3);
    expect(executeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: expect.stringContaining(
          'HAVING COUNT(DISTINCT csg.background) = 2',
        ),
        args: ['morhetz', 'light', 'dark'],
      }),
    );
  });

  it('loads featured repositories ordered by featured rank', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 2,
            owner_name: 'folke',
            name: 'tokyonight.nvim',
            description: 'Tokyo Night',
            github_url: 'https://github.com/folke/tokyonight.nvim',
            stargazers_count: 50,
            week_stargazers_count: 10,
            github_created_at: '2024-01-01T00:00:00.000Z',
            pushed_at: '2024-02-01T00:00:00.000Z',
          },
          {
            id: 1,
            owner_name: 'catppuccin',
            name: 'nvim',
            description: 'Catppuccin',
            github_url: 'https://github.com/catppuccin/nvim',
            stargazers_count: 60,
            week_stargazers_count: 11,
            github_created_at: '2024-01-02T00:00:00.000Z',
            pushed_at: '2024-02-02T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            repo_id: 2,
            cs_id: 11,
            cs_name: 'tokyonight',
            csg_background: 'dark',
            csg_name: 'bg',
            csg_hex_code: '#111111',
          },
          {
            repo_id: 1,
            cs_id: 22,
            cs_name: 'catppuccin',
            csg_background: 'light',
            csg_name: 'bg',
            csg_hex_code: '#fafafa',
          },
        ],
      });

    const repositories = await RepositoriesService.getFeaturedRepositoryDTOs();

    expect(executeMock).toHaveBeenCalledTimes(2);
    expect(executeMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        sql: expect.stringContaining('WHERE r.featured_rank IS NOT NULL'),
        args: [3],
      }),
    );
    expect(executeMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        sql: expect.stringContaining('WHERE cs.repository_id IN (?, ?)'),
        args: [2, 1],
      }),
    );

    expect(repositories).toEqual([
      {
        name: 'tokyonight.nvim',
        owner: { name: 'folke' },
        description: 'Tokyo Night',
        githubCreatedAt: new Date('2024-01-01T00:00:00.000Z'),
        pushedAt: new Date('2024-02-01T00:00:00.000Z'),
        githubURL: 'https://github.com/folke/tokyonight.nvim',
        stargazersCount: 50,
        weekStargazersCount: 10,
        vimColorSchemes: [
          {
            name: 'tokyonight',
            backgrounds: ['dark'],
            data: {
              light: null,
              dark: [{ name: 'bg', hexCode: '#111111' }],
            },
          },
        ],
      },
      {
        name: 'nvim',
        owner: { name: 'catppuccin' },
        description: 'Catppuccin',
        githubCreatedAt: new Date('2024-01-02T00:00:00.000Z'),
        pushedAt: new Date('2024-02-02T00:00:00.000Z'),
        githubURL: 'https://github.com/catppuccin/nvim',
        stargazersCount: 60,
        weekStargazersCount: 11,
        vimColorSchemes: [
          {
            name: 'catppuccin',
            backgrounds: ['light'],
            data: {
              light: [{ name: 'bg', hexCode: '#fafafa' }],
              dark: null,
            },
          },
        ],
      },
    ]);
  });

  it('loads a single repository with its colorschemes', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 3,
            owner_name: 'morhetz',
            name: 'gruvbox',
            description: 'Popular theme',
            github_url: 'https://github.com/morhetz/gruvbox',
            stargazers_count: 100,
            week_stargazers_count: 12,
            github_created_at: '2020-01-01T00:00:00.000Z',
            pushed_at: '2024-03-01T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            cs_id: 31,
            cs_name: 'gruvbox',
            csg_background: 'dark',
            csg_name: 'bg0',
            csg_hex_code: '#282828',
          },
        ],
      });

    const repository = await RepositoriesService.getRepository(
      'Morhetz',
      'Gruvbox',
    );

    expect(executeMock).toHaveBeenCalledTimes(2);
    expect(executeMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        sql: expect.stringContaining(
          'WHERE r.owner_name = ? COLLATE NOCASE AND r.name = ? COLLATE NOCASE',
        ),
        args: ['Morhetz', 'Gruvbox'],
      }),
    );
    expect(executeMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        sql: expect.stringContaining('WHERE cs.repository_id = ?'),
        args: [3],
      }),
    );
    expect(repository?.dto).toEqual({
      name: 'gruvbox',
      owner: { name: 'morhetz' },
      description: 'Popular theme',
      githubCreatedAt: new Date('2020-01-01T00:00:00.000Z'),
      pushedAt: new Date('2024-03-01T00:00:00.000Z'),
      githubURL: 'https://github.com/morhetz/gruvbox',
      stargazersCount: 100,
      weekStargazersCount: 12,
      vimColorSchemes: [
        {
          name: 'gruvbox',
          backgrounds: ['dark'],
          data: {
            light: null,
            dark: [{ name: 'bg0', hexCode: '#282828' }],
          },
        },
      ],
    });
  });
});
