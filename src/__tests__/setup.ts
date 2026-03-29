import { vi } from 'vitest';

vi.mock('next/cache', () => ({
  unstable_cache: (fn: () => void) => fn,
  revalidateTag: vi.fn(),
}));
