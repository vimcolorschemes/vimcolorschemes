import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Backgrounds } from '@/lib/backgrounds';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import ExploreCommandInput from '@/components/exploreCommandInput';
import ExploreCommand from '@/components/exploreCommandInput/command';

const navigation = vi.hoisted(() => ({
  pathname: '/i/trending',
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

const searchManifestMocks = vi.hoisted(() => ({
  loadRepositorySearchManifest: vi.fn(() => Promise.resolve([])),
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
    prefetch,
    scroll,
    ...props
  }: React.ComponentProps<'a'> & {
    as?: string;
    prefetch?: boolean;
    scroll?: boolean;
  }) => (
    <a
      href={typeof href === 'string' ? href : ''}
      data-as={typeof as === 'string' ? as : undefined}
      data-prefetch={prefetch ? 'true' : undefined}
      data-scroll={scroll ? 'true' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
}));

vi.mock('@/services/repositorySearchManifestClient', () => ({
  RepositorySearchManifestClient: {
    loadRepositorySearchManifest:
      searchManifestMocks.loadRepositorySearchManifest,
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
    searchManifestMocks.loadRepositorySearchManifest.mockClear();
    searchManifestMocks.loadRepositorySearchManifest.mockImplementation(() =>
      Promise.resolve([]),
    );
    document.body.innerHTML = '';
  });

  it('uses path filters for index routes', () => {
    navigation.pathname = '/i/old/b.dark';
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('button', { name: 'Order repositories' }).textContent,
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
      screen.getByRole('button', { name: 'Order repositories' }).textContent,
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
      screen.getByRole('button', { name: 'Order repositories' }).textContent,
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

  it('shows filters as part of the TUI after the explore command', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const commandText = screen
      .getByLabelText('Explore color schemes')
      .textContent?.replace(/\s+/g, ' ');

    expect(commandText).toContain('vimcolorschemes');
    expect(commandText).toContain('explore');
    expect(commandText).toContain('search');
    expect(commandText).toContain('order');
    expect(commandText).toContain('background');
    expect(commandText?.indexOf('search')).toBeGreaterThan(
      commandText?.indexOf('explore') ?? -1,
    );
  });

  it('uses the standard search input without inline width', () => {
    navigation.searchParams = new URLSearchParams({ q: 'tokyo' });

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole<HTMLInputElement>('searchbox', {
        name: 'Search repositories',
      }).style.width,
    ).toBe('');
  });

  it('does not draw an extra outline around the focused search input', () => {
    const commandStyles = readFileSync(
      join(
        process.cwd(),
        'src/components/exploreCommandInput/index.module.css',
      ),
      'utf8',
    );

    expect(commandStyles).not.toContain('.searchInput:focus-visible');
    expect(commandStyles).toContain('.searchSubmit:focus-visible');
  });

  it('reserves the complete search control geometry in the static fallback', () => {
    const { container } = render(
      <ExploreCommand interactive={false} pageContext={fallbackPageContext} />,
    );
    const searchForm = Array.from(container.querySelectorAll('span')).find(
      element => element.className.includes('searchForm'),
    );

    expect(searchForm).toBeDefined();
    expect(
      Array.from(searchForm?.children ?? []).some(element =>
        element.className.includes('searchInput'),
      ),
    ).toBe(true);
    expect(
      Array.from(searchForm?.querySelectorAll('span') ?? []).some(
        element =>
          element.className.includes('searchLoading') &&
          element.textContent === 'Loading',
      ),
    ).toBe(true);
    expect(
      Array.from(searchForm?.children ?? []).some(element =>
        element.className.includes('searchSubmit'),
      ),
    ).toBe(true);
    expect(searchForm?.textContent).toContain('↵');
  });

  it('renders the submitted search value in the normal input', () => {
    navigation.searchParams = new URLSearchParams({
      q: 'tokyonight cappuccin gruvbox solarized nord',
    });

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole<HTMLInputElement>('searchbox', {
        name: 'Search repositories',
      }).value,
    ).toBe('tokyonight cappuccin gruvbox solarized nord');
  });

  it('shows a clickable enter hint for search submission', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('button', { name: 'Submit repository search' })
        .textContent,
    ).toBe('↵');
  });

  it('uses a valid labelled search form', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const form = screen.getByRole('search');
    const searchbox = screen.getByRole<HTMLInputElement>('searchbox', {
      name: 'Search repositories',
    });

    expect(searchbox.closest('form')).toBe(form);
    expect(searchbox.labels?.[0]?.textContent).toBe('search repositories');
    expect(form.parentElement?.tagName).not.toBe('SPAN');
    expect(form.className).toContain('tuiControl');
    expect(searchbox.parentElement?.className).toContain('searchForm');
    expect(form.getAttribute('method')).toBe('get');
    expect(form.getAttribute('action')).toBe('/i/trending');
  });

  it('handles failures while preloading the search manifest', async () => {
    const failedPreload = Promise.reject(new Error('manifest unavailable'));
    const catchSpy = vi.spyOn(failedPreload, 'catch');
    searchManifestMocks.loadRepositorySearchManifest.mockReturnValueOnce(
      failedPreload,
    );

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);
    fireEvent.focus(
      screen.getByRole('searchbox', { name: 'Search repositories' }),
    );

    expect(catchSpy).toHaveBeenCalledOnce();
    await expect(failedPreload).rejects.toThrow('manifest unavailable');
  });

  it('keeps spacing between TUI filter labels and values', () => {
    const commandStyles = readFileSync(
      join(
        process.cwd(),
        'src/components/exploreCommandInput/index.module.css',
      ),
      'utf8',
    );

    expect(commandStyles).toMatch(/\.tuiControl\s*{[\s\S]*?\bgap:\s*1ch;/);
  });

  it('groups order and background controls together for wrapping', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const orderControl = screen
      .getByRole('button', { name: 'Order repositories' })
      .closest('[class*="tuiControl"]');
    const backgroundControl = screen
      .getByRole('button', { name: 'Filter by background' })
      .closest('[class*="tuiControl"]');

    expect(orderControl?.parentElement).toBe(backgroundControl?.parentElement);
    expect(orderControl?.parentElement?.className).toContain('filterGroup');
  });

  it('marks the background menu for right alignment', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('button', { name: 'Filter by background' }).parentElement
        ?.className,
    ).toContain('alignEnd');
  });

  it('right-aligns marked menus', () => {
    const menuStyles = readFileSync(
      join(
        process.cwd(),
        'src/components/exploreCommandInput/commandMenu/index.module.css',
      ),
      'utf8',
    );

    expect(menuStyles).toMatch(
      /\.menu\.alignEnd\s+\.menuList\s*{[\s\S]*?right:\s*0;[\s\S]*?left:\s*auto;/,
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

  it('submits the current search query when the enter hint is clicked', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search repositories' }),
      {
        target: { value: 'catppuccin' },
      },
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Submit repository search' }),
    );

    expect(navigation.replace).toHaveBeenCalledWith(
      '/i/trending?q=catppuccin',
      {
        scroll: false,
      },
    );
  });

  it('removes the search query when blank text is submitted', () => {
    navigation.searchParams = new URLSearchParams({ q: 'tokyo' });
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const searchbox = screen.getByRole('searchbox', {
      name: 'Search repositories',
    });
    fireEvent.change(searchbox, { target: { value: '   ' } });
    fireEvent.submit(searchbox);

    expect(navigation.replace).toHaveBeenCalledWith('/i/trending', {
      scroll: false,
    });
  });
});
