import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import IndexPage from '@/app/(index)/i/[...filters]/page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/components/featuredRepositories', () => ({
  default: ({ pageContext }: { pageContext: PageContext }) => (
    <section data-testid="featured" data-sort={pageContext.sort} />
  ),
  FeaturedRepositoriesSkeleton: () => (
    <section data-testid="featured-loading" />
  ),
}));

vi.mock('@/components/repositories', () => ({
  default: ({ searchQuery }: { searchQuery?: string }) => (
    <section data-testid="repositories" data-query={searchQuery ?? ''} />
  ),
}));

afterEach(() => {
  cleanup();
});

describe('IndexPage', () => {
  it('shows featured repositories on the homepage without a search', async () => {
    render(await renderIndexPage());

    expect(screen.getByTestId('featured').getAttribute('data-sort')).toBe(
      SortOptions.Trending,
    );
  });

  it('hides featured repositories when a search is active', async () => {
    render(await renderIndexPage({ q: 'tokyo' }));

    expect(screen.queryByTestId('featured')).toBeNull();
    expect(screen.getByTestId('repositories').getAttribute('data-query')).toBe(
      'tokyo',
    );
  });

  it('accounts for the filter bar in loading height', () => {
    const pageStyles = readFileSync(
      join(process.cwd(), 'src/app/(index)/i/[...filters]/page.module.css'),
      'utf8',
    );

    expect(pageStyles).toContain('--index-filter-bar-height');
    expect(pageStyles).toContain('--index-loading-section-spacing');
    expect(pageStyles).toMatch(
      /--homepage-available-height:\s*calc\([\s\S]*var\(--index-filter-bar-height\)[\s\S]*var\(--index-loading-section-spacing\)[\s\S]*\)/,
    );
    expect(pageStyles).not.toMatch(
      /--repositories-loading-min-height:\s*calc\([\s\S]*var\(--statusline-height\)/,
    );
  });
});

function renderIndexPage(searchParams: { q?: string | string[] } = {}) {
  return IndexPage({
    params: Promise.resolve({ filters: [SortOptions.Trending] }),
    searchParams: Promise.resolve(searchParams),
  });
}
