import { describe, expect, it, vi } from 'vitest';

import RepositoryPageModalRoute from '@/app/@modal/(.)r/[owner]/[name]/page';

const repositoriesServiceMock = vi.hoisted(() => ({
  getAllRepositoryKeys: vi.fn(),
  getRepository: vi.fn(),
}));

vi.mock('@/app/r/[owner]/[name]/page', () => ({
  generateMetadata: vi.fn(),
}));

vi.mock('@/helpers/repositoryPage', () => ({
  RepositoryPageHelper: {
    getColorschemeStyle: vi.fn(),
    getVariantIndexFromSearchParams: vi.fn(() => 0),
  },
}));

vi.mock('@/services/repositoriesServer', () => ({
  RepositoriesService: {
    getAllRepositoryKeys: repositoriesServiceMock.getAllRepositoryKeys,
    getRepository: repositoriesServiceMock.getRepository,
  },
}));

vi.mock('@/components/repositoryPageContent/content', () => ({
  default: () => null,
}));

vi.mock('@/components/repositoryPageModal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RepositoryPageModalRoute', () => {
  it('renders repository modals from the r route', async () => {
    repositoriesServiceMock.getRepository.mockResolvedValue({
      flattenedColorschemes: [],
    });

    const result = await RepositoryPageModalRoute({
      params: Promise.resolve({ owner: 'folke', name: 'tokyonight.nvim' }),
      searchParams: Promise.resolve({}),
    });

    expect(result).not.toBeNull();
    expect(repositoriesServiceMock.getRepository).toHaveBeenCalledWith(
      'folke',
      'tokyonight.nvim',
    );
  });
});
