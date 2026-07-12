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
      screen.getByRole('button', { name: /Order repositories/ }).textContent,
    ).toBe(SortOptions.Old);
    expect(
      screen.getByRole('button', { name: /Filter by background/ }).textContent,
    ).toBe(Backgrounds.Dark);
    fireEvent.click(
      screen.getByRole('button', { name: /Filter by background/ }),
    );
    expect(
      screen.getByRole('menuitem', { name: 'light' }).getAttribute('href'),
    ).toBe('/i/old/b.light');
    expect(
      screen.getByRole('menuitem', { name: 'light' }).getAttribute('data-as'),
    ).toBeNull();
  });

  it('updates links from the current path filters', () => {
    navigation.pathname = '/i/trending/b.light';

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('button', { name: /Order repositories/ }).textContent,
    ).toBe(SortOptions.Trending);
    expect(
      screen.getByRole('button', { name: /Filter by background/ }).textContent,
    ).toBe(Backgrounds.Light);
    fireEvent.click(screen.getByRole('button', { name: /Order repositories/ }));
    expect(
      screen.getByRole('menuitem', { name: 'old' }).getAttribute('href'),
    ).toBe('/i/old/b.light');
    expect(
      screen.getByRole('menuitem', { name: 'old' }).getAttribute('data-as'),
    ).toBeNull();
  });

  it('uses fallback context outside filtered index routes', () => {
    navigation.pathname = '/about';

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('button', { name: /Order repositories/ }).textContent,
    ).toBe(SortOptions.Trending);
    expect(
      screen.getByRole('button', { name: /Filter by background/ }).textContent,
    ).toBe('any');
  });

  it('preserves search query in filter links', () => {
    navigation.pathname = '/i/trending/b.light';
    navigation.searchParams = new URLSearchParams({ q: 'tokyo night' });

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    fireEvent.click(screen.getByRole('button', { name: /Order repositories/ }));
    expect(
      screen.getByRole('menuitem', { name: 'old' }).getAttribute('href'),
    ).toBe('/i/old/b.light?q=tokyo+night');
  });

  it('resets repository search, filters, and sorting together', () => {
    navigation.pathname = '/i/old/b.dark';
    navigation.searchParams = new URLSearchParams({ q: 'tokyo night' });

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const reset = screen.getByRole('link', {
      name: 'Reset repository search, filters, and sorting',
    });

    expect(reset.textContent).toBe('reset');
    expect(reset.getAttribute('href')).toBe('/i/trending');
  });

  it('does not show reset when repository controls are at their defaults', () => {
    navigation.searchParams = new URLSearchParams({ q: '   ' });

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.queryByRole('link', {
        name: 'Reset repository search, filters, and sorting',
      }),
    ).toBeNull();
  });

  it('shows reset when only repository search is active', () => {
    navigation.searchParams = new URLSearchParams({ q: 'tokyo night' });

    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('link', {
        name: 'Reset repository search, filters, and sorting',
      }),
    ).toBeDefined();
  });

  it.each(['/i/old', '/i/trending/b.dark'])(
    'shows reset for non-default path state at %s',
    pathname => {
      navigation.pathname = pathname;

      render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

      expect(
        screen.getByRole('link', {
          name: 'Reset repository search, filters, and sorting',
        }),
      ).toBeDefined();
    },
  );

  it('reflects the default controls after reset navigation', () => {
    navigation.pathname = '/i/old/b.dark';
    navigation.searchParams = new URLSearchParams({ q: 'tokyo night' });

    const { rerender } = render(
      <ExploreCommandInput fallbackPageContext={fallbackPageContext} />,
    );

    navigation.pathname = '/i/trending';
    navigation.searchParams = new URLSearchParams();
    rerender(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    expect(
      screen.getByRole('button', { name: /Order repositories/ }).textContent,
    ).toBe('trending');
    expect(
      screen.getByRole('button', { name: /Filter by background/ }).textContent,
    ).toBe('any');
    expect(
      screen.getByRole<HTMLInputElement>('searchbox', {
        name: 'Search repositories',
      }).value,
    ).toBe('');
    expect(
      screen.queryByRole('link', {
        name: 'Reset repository search, filters, and sorting',
      }),
    ).toBeNull();
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
    expect(
      screen.queryByRole('link', {
        name: 'Reset repository search, filters, and sorting',
      }),
    ).toBeNull();
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
      .getByRole('button', { name: /Order repositories/ })
      .closest('[class*="tuiControl"]');
    const backgroundControl = screen
      .getByRole('button', { name: /Filter by background/ })
      .closest('[class*="tuiControl"]');

    expect(orderControl?.parentElement).toBe(backgroundControl?.parentElement);
    expect(orderControl?.parentElement?.className).toContain('filterGroup');
  });

  it.each([
    ['order', 'Order repositories'],
    ['background', 'Filter by background'],
  ])('opens the %s menu when its visible label is clicked', (text, name) => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const trigger = screen.getByRole('button', { name: new RegExp(name) });
    const label = screen.getByText(text, { selector: 'label' });

    expect(label.getAttribute('for')).toBe(trigger.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(label);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it.each([
    ['order', 'Order repositories'],
    ['background', 'Filter by background'],
  ])('opens the %s menu when its visible label is hovered', (text, name) => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const trigger = screen.getByRole('button', { name: new RegExp(name) });
    const label = screen.getByText(text, { selector: 'label' });

    fireEvent.pointerEnter(label, { pointerType: 'mouse' });

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('sizes menu lists from the complete label and value control', () => {
    const menuStyles = readFileSync(
      join(
        process.cwd(),
        'src/components/exploreCommandInput/commandMenu/index.module.css',
      ),
      'utf8',
    );

    expect(menuStyles).toMatch(
      /\.menuList\s*{[\s\S]*?min-width:\s*max\(100%,\s*10rem\);/,
    );
  });

  it('left-aligns both filter menus', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const orderMenu = screen.getByRole('button', {
      name: /Order repositories/,
    }).parentElement;
    const backgroundMenu = screen.getByRole('button', {
      name: /Filter by background/,
    }).parentElement;

    expect(orderMenu?.className).not.toContain('alignEnd');
    expect(backgroundMenu?.className).not.toContain('alignEnd');
  });

  it('exposes the current value and menu relationship', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const trigger = screen.getByRole('button', {
      name: 'Order repositories, current: trending',
    });

    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
    fireEvent.click(trigger);

    const menu = screen.getByRole('menu', {
      name: 'Order repositories, current: trending',
    });

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(screen.getByRole('menuitem', { name: 'trending' }).tabIndex).toBe(
      -1,
    );
  });

  it.each([
    ['Enter', 'trending'],
    [' ', 'trending'],
    ['ArrowDown', 'trending'],
    ['ArrowUp', 'old'],
  ])('opens the order menu with %s and focuses %s', (key, option) => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const trigger = screen.getByRole('button', {
      name: /Order repositories/,
    });

    trigger.focus();
    fireEvent.keyDown(trigger, { key });

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menuitem', { name: option })).toBe(
      document.activeElement,
    );
  });

  it('moves focus within a menu with arrow, Home, End, and character keys', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const trigger = screen.getByRole('button', {
      name: /Order repositories/,
    });

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const trending = screen.getByRole('menuitem', { name: 'trending' });
    const top = screen.getByRole('menuitem', { name: 'top' });
    const old = screen.getByRole('menuitem', { name: 'old' });

    fireEvent.keyDown(trending, { key: 'ArrowUp' });
    expect(old).toBe(document.activeElement);

    fireEvent.keyDown(old, { key: 'ArrowDown' });
    expect(trending).toBe(document.activeElement);

    fireEvent.keyDown(trending, { key: 'End' });
    expect(old).toBe(document.activeElement);

    fireEvent.keyDown(old, { key: 'Home' });
    expect(trending).toBe(document.activeElement);

    fireEvent.keyDown(trending, { key: 't' });
    expect(top).toBe(document.activeElement);
  });

  it('closes with Escape and restores focus to the trigger', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const trigger = screen.getByRole('button', {
      name: /Order repositories/,
    });

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger).toBe(document.activeElement);
  });

  it.each([false, true])(
    'closes on Tab without trapping focus (shift: %s)',
    shiftKey => {
      render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

      const orderTrigger = screen.getByRole('button', {
        name: /Order repositories/,
      });
      const backgroundTrigger = screen.getByRole('button', {
        name: /Filter by background/,
      });

      fireEvent.keyDown(orderTrigger, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement as HTMLElement, {
        key: 'Tab',
        shiftKey,
      });
      const nextControl = shiftKey ? orderTrigger : backgroundTrigger;
      nextControl.focus();

      expect(orderTrigger.getAttribute('aria-expanded')).toBe('false');
      expect(nextControl).toBe(document.activeElement);
    },
  );

  it('activates a focused menu link with Space', () => {
    render(<ExploreCommandInput fallbackPageContext={fallbackPageContext} />);

    const trigger = screen.getByRole('button', {
      name: /Order repositories/,
    });

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const top = screen.getByRole('menuitem', { name: 'top' });
    const preventNavigation = (event: Event) => event.preventDefault();
    top.addEventListener('click', preventNavigation);

    fireEvent.keyDown(document.activeElement as HTMLElement, {
      key: 'ArrowDown',
    });
    fireEvent.keyDown(top, { key: ' ' });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger).toBe(document.activeElement);

    top.removeEventListener('click', preventNavigation);
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
