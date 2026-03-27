import { vi } from 'vitest';

vi.mock('next/cache', () => ({
  unstable_cache: (fn: Function) => fn,
  revalidateTag: vi.fn(),
}));
