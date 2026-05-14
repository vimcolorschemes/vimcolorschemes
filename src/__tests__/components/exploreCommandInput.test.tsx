import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Backgrounds } from '@/lib/backgrounds';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import ExploreCommandInput from '@/components/exploreCommandInput';

const navigation = vi.hoisted(() => ({
  pathname: '/i/trending',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
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
    navigation.pathname = '/i/trending';
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
});
