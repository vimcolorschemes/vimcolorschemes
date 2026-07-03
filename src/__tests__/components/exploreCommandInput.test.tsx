import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Backgrounds } from '@/lib/backgrounds';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import ExploreCommandInput from '@/components/exploreCommandInput';

const navigation = vi.hoisted(() => ({
  pathname: '/i/trending',
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ replace: navigation.replace }),
  useSearchParams: () => navigation.searchParams,
}));

vi.mock('next/link', () => ({
  default: ({
    as,
    children,
    href,
    ...props
  }: React.ComponentProps<'a'> & { as?: string }) => (
    <a
      href={typeof href === 'string' ? href : ''}
      data-as={typeof as === 'string' ? as : undefined}
      {...props}
    >
      {children}
    </a>
  ),
}));

vi.mock('@/services/repositorySearchManifestClient', () => ({
  RepositorySearchManifestClient: {
    loadRepositorySearchManifest: vi.fn(),
  },
}));

const fallbackPageContext: PageContext = {
  sort: SortOptions.Trending,
  filter: {},
};

describe('ExploreCommandInput', () => {
  beforeEach(() => {
    navigation.pathname = '/i/trending';
    navigation.replace.mockClear();
    navigation.searchParams = new URLSearchParams();
    document.body.innerHTML = '';
  });

  it('uses path filters for index routes', () => {
    navigation.pathname = '/i/old/b.dark';
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('button', { name: 'Sort repositories' }).textContent,
    ).toBe(SortOptions.Old);
    expect(
      screen.getByRole('button', { name: 'Filter by background' }).textContent,
    ).toBe(Backgrounds.Dark);
    expect(
      screen.getByRole('link', { name: 'light' }).getAttribute('href'),
    ).toBe('/i/old/b.light');
    expect(
      screen.getByRole('link', { name: 'light' }).getAttribute('data-as'),
    ).toBeNull();
  });

  it('updates links from the current path filters', () => {
    navigation.pathname = '/i/trending/b.light';

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('button', { name: 'Sort repositories' }).textContent,
    ).toBe(SortOptions.Trending);
    expect(
      screen.getByRole('button', { name: 'Filter by background' }).textContent,
    ).toBe(Backgrounds.Light);
    expect(screen.getByRole('link', { name: 'old' }).getAttribute('href')).toBe(
      '/i/old/b.light',
    );
    expect(
      screen.getByRole('link', { name: 'old' }).getAttribute('data-as'),
    ).toBeNull();
  });

  it('uses fallback context outside filtered index routes', () => {
    navigation.pathname = '/about';

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('button', { name: 'Sort repositories' }).textContent,
    ).toBe(SortOptions.Trending);
    expect(
      screen.getByRole('button', { name: 'Filter by background' }).textContent,
    ).toBe('any');
  });

  it('preserves search query in filter links', () => {
    navigation.pathname = '/i/trending/b.light';
    navigation.searchParams = new URLSearchParams({ q: 'tokyo night' });

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(screen.getByRole('link', { name: 'old' }).getAttribute('href')).toBe(
      '/i/old/b.light?q=tokyo+night',
    );
  });

  it('writes submitted search query to the current URL', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search repositories' }),
      {
        target: { value: 'gruvbox' },
      },
    );
    fireEvent.submit(
      screen.getByRole('searchbox', { name: 'Search repositories' }),
    );

    expect(navigation.replace).toHaveBeenCalledWith('/i/trending?q=gruvbox', {
      scroll: false,
    });
  });
});
