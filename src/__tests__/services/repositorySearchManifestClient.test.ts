import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RepositoryDTO } from '@/models/DTO/repository';

const repositories: RepositoryDTO[] = [
  {
    name: 'gruvbox',
    owner: { name: 'morhetz' },
    description: 'retro groove color scheme',
    githubCreatedAt: '2024-01-01T00:00:00.000Z',
    pushedAt: '2024-01-02T00:00:00.000Z',
    githubURL: 'https://github.com/morhetz/gruvbox',
    stargazersCount: 1000,
    weekStargazersCount: 10,
    vimColorSchemes: [],
  },
];

describe('RepositorySearchManifestClient', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('refetches after a failed manifest request', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('network failed'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(repositories), {
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const { RepositorySearchManifestClient } =
      await import('@/services/repositorySearchManifestClient');

    await expect(
      RepositorySearchManifestClient.loadRepositorySearchManifest(),
    ).rejects.toThrow('network failed');
    await expect(
      RepositorySearchManifestClient.loadRepositorySearchManifest(),
    ).resolves.toEqual(repositories);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
