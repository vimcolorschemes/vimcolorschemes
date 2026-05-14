import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Backgrounds } from '@/lib/backgrounds';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import ExploreCommandInput from '@/components/exploreCommandInput';

const navigation = vi.hoisted(() => ({
  pathname: '/i',
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
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

const fallbackPageContext: PageContext = {
  sort: SortOptions.Trending,
  filter: {},
};

describe('ExploreCommandInput', () => {
  beforeEach(() => {
    navigation.pathname = '/i';
    navigation.searchParams = new URLSearchParams();
    document.body.innerHTML = '';
  });

  it('uses search params for the index route', () => {
    navigation.searchParams = new URLSearchParams({
      sort: SortOptions.Old,
      background: Backgrounds.Dark,
    });

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

  it('uses path filters over search params for filtered index routes', () => {
    navigation.pathname = '/i/trending/b.light';
    navigation.searchParams = new URLSearchParams({
      sort: SortOptions.Old,
      background: Backgrounds.Dark,
    });

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
});
