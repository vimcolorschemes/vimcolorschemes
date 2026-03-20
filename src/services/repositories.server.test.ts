import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getRepositories,
  getRepository,
  getRepositoryCount,
  REPOSITORY_PAGE_SIZE,
} from '#/services/repositories.server';

const { getClientMock } = vi.hoisted(() => ({ getClientMock: vi.fn() }));

vi.mock('#/services/database.server', () => ({
  default: {
    getClient: getClientMock,
  },
}));

describe('repositories.server', () => {
  const executeMock = vi.fn();

  beforeEach(() => {
    executeMock.mockReset();
    getClientMock.mockReset();
    getClientMock.mockReturnValue({ execute: executeMock });
  });

  it('builds count query using both light and dark filters', async () => {
    executeMock.mockResolvedValue({ rows: [{ count: 42 }] });

    const count = await getRepositoryCount({ background: 'both' });

    expect(count).toBe(42);
    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(executeMock).toHaveBeenCalledWith(
      expect.stringContaining("csg.background = 'light'"),
    );
    expect(executeMock).toHaveBeenCalledWith(
      expect.stringContaining("csg.background = 'dark'"),
    );
    expect(executeMock).toHaveBeenCalledWith(expect.stringContaining(' AND '));
  });

  it('returns null when repository is not found', async () => {
    executeMock.mockResolvedValue({ rows: [] });

    const repository = await getRepository('foo', 'bar');

    expect(repository).toBeNull();
    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('maps repository data and attached colorschemes', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            owner_name: 'owner',
            name: 'repo',
            description: 'desc',
            github_url: 'https://github.com/owner/repo',
            stargazers_count: 123,
            week_stargazers_count: 7,
            github_created_at: '2024-01-01T00:00:00.000Z',
            pushed_at: '2024-01-02T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            repository_id: 1,
            cs_id: 10,
            cs_name: 'gruvbox',
            csg_background: 'dark',
            csg_name: 'base00',
            csg_hex_code: '#282828',
          },
          {
            repository_id: 1,
            cs_id: 10,
            cs_name: 'gruvbox',
            csg_background: 'dark',
            csg_name: 'base01',
            csg_hex_code: '#3c3836',
          },
        ],
      });

    const repository = await getRepository('owner', 'repo');

    expect(repository).not.toBeNull();
    if (!repository) {
      throw new Error('Repository should be found');
    }

    expect(repository.name).toBe('repo');
    expect(repository.owner.name).toBe('owner');
    expect(repository.vimColorSchemes).toHaveLength(1);
    const colorscheme = repository.vimColorSchemes[0];

    expect(colorscheme.backgrounds).toEqual(['dark']);
    expect(colorscheme.data).not.toBeNull();
    if (!colorscheme.data) {
      throw new Error('Colorscheme data should exist');
    }

    expect(colorscheme.data.dark).toEqual([
      { name: 'base00', hexCode: '#282828' },
      { name: 'base01', hexCode: '#3c3836' },
    ]);
    expect(repository.githubCreatedAt.toISOString()).toBe(
      '2024-01-01T00:00:00.000Z',
    );
  });

  it('uses pagination args and returns repository list', async () => {
    executeMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: 5,
            owner_name: 'catppuccin',
            name: 'nvim',
            description: null,
            github_url: null,
            stargazers_count: null,
            week_stargazers_count: null,
            github_created_at: '2024-02-01T00:00:00.000Z',
            pushed_at: '2024-02-02T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const repositories = await getRepositories({
      page: 2,
      background: 'light',
    });

    expect(repositories).toHaveLength(1);
    expect(repositories[0].description).toBe('');
    expect(repositories[0].githubURL).toBe('');
    expect(repositories[0].stargazersCount).toBe(0);
    expect(repositories[0].weekStargazersCount).toBe(0);

    expect(executeMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        sql: expect.stringContaining("csg.background = 'light'"),
        args: [REPOSITORY_PAGE_SIZE, REPOSITORY_PAGE_SIZE],
      }),
    );
  });
});
