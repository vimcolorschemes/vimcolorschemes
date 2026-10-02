import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Constants } from '@/lib/constants';

const cacheKeyParts = vi.hoisted(() => [] as string[][]);

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  unstable_cache: (fn: unknown, keyParts: string[]) => {
    cacheKeyParts.push(keyParts);
    return fn;
  },
}));

describe('RepositoriesService repository cache', () => {
  beforeEach(() => {
    cacheKeyParts.length = 0;
  });

  it('keys every cache entry on the deployment so a rebuild starts clean', async () => {
    vi.stubEnv('BUILD_ID', 'bld_test');
    vi.resetModules();

    await import('@/services/repositoriesServer');

    expect(cacheKeyParts.flat()).toContain('bld_test-repository-dto');
    expect(
      cacheKeyParts.flat().every(keyPart => keyPart.startsWith('bld_test-')),
    ).toBe(true);

    vi.unstubAllEnvs();
  });

  it('falls back to dev when BUILD_ID is unset', async () => {
    vi.resetModules();

    await import('@/services/repositoriesServer');

    expect(cacheKeyParts.flat()).toContain('dev-repository-dto');

    vi.unstubAllEnvs();
  });

  it('caches the paginated query that serves load more', async () => {
    vi.stubEnv('BUILD_ID', 'bld_test');
    vi.resetModules();

    await import('@/services/repositoriesServer');

    expect(cacheKeyParts.flat()).toContain(
      `bld_test-repository-dto-page-${Constants.REPOSITORY_PAGE_SIZE}`,
    );

    vi.unstubAllEnvs();
  });
});
