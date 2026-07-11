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

  it('shares one request between concurrent manifest loads', async () => {
    let resolveResponse: (response: Response) => void;
    const responsePromise = new Promise<Response>(resolve => {
      resolveResponse = resolve;
    });
    const fetchMock = vi.fn().mockReturnValue(responsePromise);
    vi.stubGlobal('fetch', fetchMock);

    const { RepositorySearchManifestClient } =
      await import('@/services/repositorySearchManifestClient');

    const firstLoad =
      RepositorySearchManifestClient.loadRepositorySearchManifest();
    const secondLoad =
      RepositorySearchManifestClient.loadRepositorySearchManifest();

    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveResponse!(
      new Response(JSON.stringify(repositories), {
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(Promise.all([firstLoad, secondLoad])).resolves.toEqual([
      repositories,
      repositories,
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('reuses a successfully loaded manifest', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(repositories), {
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { RepositorySearchManifestClient } =
      await import('@/services/repositorySearchManifestClient');

    await expect(
      RepositorySearchManifestClient.loadRepositorySearchManifest(),
    ).resolves.toEqual(repositories);
    await expect(
      RepositorySearchManifestClient.loadRepositorySearchManifest(),
    ).resolves.toEqual(repositories);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries after a non-successful manifest response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
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
    ).rejects.toThrow('Failed to load search manifest: 503');
    await expect(
      RepositorySearchManifestClient.loadRepositorySearchManifest(),
    ).resolves.toEqual(repositories);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries after the manifest contains invalid JSON', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response('{invalid json', {
          headers: { 'Content-Type': 'application/json' },
        }),
      )
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
    ).rejects.toBeInstanceOf(SyntaxError);
    await expect(
      RepositorySearchManifestClient.loadRepositorySearchManifest(),
    ).resolves.toEqual(repositories);
    expect(fetchMock).toHaveBeenCalledTimes(2);
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
