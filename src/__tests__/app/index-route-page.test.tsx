import { describe, expect, it, vi } from 'vitest';

const noStoreMock = vi.hoisted(() => vi.fn());
const redirectMock = vi.hoisted(() => vi.fn());
const repositoriesServiceMock = vi.hoisted(() => ({
  getRepositoryDTOsUncached: vi.fn(),
  getRepositoryCountUncached: vi.fn(),
}));

vi.mock('next/cache', () => ({
  unstable_noStore: noStoreMock,
}));

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

vi.mock('@/services/repositoriesServer', () => ({
  RepositoriesService: repositoriesServiceMock,
}));

vi.mock('@/components/featuredRepositories', () => ({
  default: () => null,
}));

vi.mock('@/components/repositories', () => ({
  default: () => null,
}));

vi.mock('@/components/searchResults', () => ({
  default: () => null,
}));

import IndexPage, { generateMetadata } from '@/app/(index)/i/[...filters]/page';

describe('index route page', () => {
  it('marks search pages as noindex', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ filters: ['trending', 's.gruvbox'] }),
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it('bypasses cache for search pages', async () => {
    repositoriesServiceMock.getRepositoryDTOsUncached.mockResolvedValue([]);
    repositoriesServiceMock.getRepositoryCountUncached.mockResolvedValue(0);

    await IndexPage({
      params: Promise.resolve({ filters: ['trending', 's.gruvbox'] }),
    });

    expect(noStoreMock).toHaveBeenCalledTimes(1);
    expect(
      repositoriesServiceMock.getRepositoryDTOsUncached,
    ).toHaveBeenCalledWith({
      sort: 'trending',
      filter: { search: 'gruvbox' },
    });
    expect(
      repositoriesServiceMock.getRepositoryCountUncached,
    ).toHaveBeenCalledWith({ search: 'gruvbox' });
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
