import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SortOptions } from '@/lib/sort';

function makeRequest(query = '') {
  return new NextRequest(`http://localhost/api/repositories${query}`);
}

const repositoriesServiceMock = vi.hoisted(() => ({
  getRepositories: vi.fn(),
  getRepositoryCount: vi.fn(),
}));

vi.mock('@/services/repositories', () => ({
  default: {
    getRepositories: repositoriesServiceMock.getRepositories,
    getRepositoryCount: repositoriesServiceMock.getRepositoryCount,
  },
}));

import { GET } from '@/app/api/repositories/route';

describe('GET /api/repositories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    repositoriesServiceMock.getRepositories.mockResolvedValue([
      {
        dto: {
          name: 'repo',
          owner: { name: 'owner' },
          description: '',
          githubCreatedAt: new Date('2024-01-01T00:00:00.000Z'),
          pushedAt: new Date('2024-01-01T00:00:00.000Z'),
          githubURL: 'https://github.com/owner/repo',
          stargazersCount: 1,
          weekStargazersCount: 1,
          vimColorSchemes: [],
        },
      },
    ]);
    repositoriesServiceMock.getRepositoryCount.mockResolvedValue(1);
  });

  it('defaults missing sort to trending', async () => {
    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositories).toHaveBeenCalledWith({
      sort: SortOptions.Trending,
      filter: { page: 1 },
    });
  });

  it('defaults invalid sort to trending', async () => {
    const response = await GET(makeRequest('?sort=wrong'));

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositories).toHaveBeenCalledWith({
      sort: SortOptions.Trending,
      filter: { page: 1 },
    });
  });

  it('keeps valid sort values', async () => {
    const response = await GET(makeRequest('?sort=top'));

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositories).toHaveBeenCalledWith({
      sort: SortOptions.Top,
      filter: { page: 1 },
    });
  });

  it('still rejects invalid page values', async () => {
    const response = await GET(makeRequest('?page=0'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Invalid page' });
    expect(repositoriesServiceMock.getRepositories).not.toHaveBeenCalled();
    expect(repositoriesServiceMock.getRepositoryCount).not.toHaveBeenCalled();
  });
});
