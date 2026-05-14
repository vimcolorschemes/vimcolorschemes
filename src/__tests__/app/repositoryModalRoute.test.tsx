import { describe, expect, it, vi } from 'vitest';

import RepositoryPageModalRoute from '@/app/@modal/(.)[owner]/[name]/page';

const repositoriesServiceMock = vi.hoisted(() => ({
  getAllRepositoryKeys: vi.fn(),
  getRepository: vi.fn(),
}));

vi.mock('@/app/[owner]/[name]/page', () => ({
  generateMetadata: vi.fn(),
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
  it('does not treat index filter routes as repository modals', async () => {
    const result = await RepositoryPageModalRoute({
      params: Promise.resolve({ owner: 'i', name: 'old' }),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeNull();
    expect(repositoriesServiceMock.getRepository).not.toHaveBeenCalled();
  });
});
