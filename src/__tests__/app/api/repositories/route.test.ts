import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SortOptions } from '@/lib/sort';

function makeRequest(query = '') {
  return new NextRequest(`http://localhost/api/repositories${query}`);
}

const repositoriesServiceMock = vi.hoisted(() => ({
  getRepositoryDTOs: vi.fn(),
  getRepositoryCount: vi.fn(),
}));

vi.mock('@/services/repositoriesServer', () => ({
  RepositoriesService: {
    getRepositoryDTOs: repositoriesServiceMock.getRepositoryDTOs,
    getRepositoryCount: repositoriesServiceMock.getRepositoryCount,
  },
}));

import { GET } from '@/app/api/repositories/route';

describe('GET /api/repositories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    repositoriesServiceMock.getRepositoryDTOs.mockResolvedValue([
      {
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
    ]);
    repositoriesServiceMock.getRepositoryCount.mockResolvedValue(1);
  });

  it('defaults missing sort to trending', async () => {
    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositoryDTOs).toHaveBeenCalledWith({
      sort: SortOptions.Trending,
      filter: { page: 1 },
    });
  });

  it('defaults invalid sort to trending', async () => {
    const response = await GET(makeRequest('?sort=wrong'));

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositoryDTOs).toHaveBeenCalledWith({
      sort: SortOptions.Trending,
      filter: { page: 1 },
    });
  });

  it('keeps valid sort values', async () => {
    const response = await GET(makeRequest('?sort=top'));

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositoryDTOs).toHaveBeenCalledWith({
      sort: SortOptions.Top,
      filter: { page: 1 },
    });
  });

  it('passes search filter to service', async () => {
    const response = await GET(makeRequest('?search=gruvbox'));

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositoryDTOs).toHaveBeenCalledWith({
      sort: SortOptions.Trending,
      filter: { page: 1, search: 'gruvbox' },
    });
  });

  it('passes background filter to service', async () => {
    const response = await GET(makeRequest('?background=dark'));

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositoryDTOs).toHaveBeenCalledWith({
      sort: SortOptions.Trending,
      filter: { page: 1, background: 'dark' },
    });
  });

  it('ignores invalid background values', async () => {
    const response = await GET(makeRequest('?background=invalid'));

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositoryDTOs).toHaveBeenCalledWith({
      sort: SortOptions.Trending,
      filter: { page: 1 },
    });
  });

  it('passes owner filter to service', async () => {
    const response = await GET(makeRequest('?owner=morhetz'));

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositoryDTOs).toHaveBeenCalledWith({
      sort: SortOptions.Trending,
      filter: { page: 1, owner: 'morhetz' },
    });
  });

  it('passes all filters together', async () => {
    const response = await GET(
      makeRequest(
        '?sort=new&search=gruvbox&background=light&page=2&owner=morhetz',
      ),
    );

    expect(response.status).toBe(200);
    expect(repositoriesServiceMock.getRepositoryDTOs).toHaveBeenCalledWith({
      sort: SortOptions.New,
      filter: {
        page: 2,
        search: 'gruvbox',
        background: 'light',
        owner: 'morhetz',
      },
    });
  });

  it('still rejects invalid page values', async () => {
    const response = await GET(makeRequest('?page=0'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Invalid page' });
    expect(repositoriesServiceMock.getRepositoryDTOs).not.toHaveBeenCalled();
    expect(repositoriesServiceMock.getRepositoryCount).not.toHaveBeenCalled();
  });
});
