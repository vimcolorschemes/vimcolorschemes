import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    vi.stubEnv('VERCEL_DEPLOYMENT_ID', 'dpl_test');
    vi.resetModules();

    await import('@/services/repositoriesServer');

    expect(cacheKeyParts.flat()).toContain('dpl_test-repository-dto');
    expect(
      cacheKeyParts.flat().every(keyPart => keyPart.startsWith('dpl_test-')),
    ).toBe(true);

    vi.unstubAllEnvs();
  });
});
