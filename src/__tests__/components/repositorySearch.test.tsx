import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import type { ComponentProps } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { RepositoryDTO } from '@/models/DTO/repository';

import type { PageContext } from '@/lib/pageContext';

import RepositorySearch from '@/components/repositories/search';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    prefetch,
    scroll,
    ...props
  }: ComponentProps<'a'> & {
    href: string;
    prefetch?: boolean;
    scroll?: boolean;
  }) => (
    <a
      href={href}
      data-prefetch={prefetch ? 'true' : undefined}
      data-scroll={scroll ? 'true' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
}));

const pageContext: PageContext = {
  sort: 'trending',
  filter: {},
};
const changedPageContexts: [string, PageContext][] = [
  ['sort', { sort: 'top', filter: {} }],
  ['background', { sort: 'trending', filter: { background: 'dark' } }],
];

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('RepositorySearch', () => {
  it('preserves the active search in repository result links', () => {
    const result = repository(1);
    result.vimColorSchemes.push({
      name: 'palette-alt',
      backgrounds: ['dark'],
      data: {
        light: null,
        dark: [
          { name: 'NormalBg', hexCode: '#111111' },
          { name: 'NormalFg', hexCode: '#eeeeee' },
        ],
      },
    });
    renderSearch([result], 'searchable palette');

    const link = screen.getByRole('link', { name: 'palette-1, by local' });
    expect(link.getAttribute('href')).toBe(
      '/r/local/palette-1?q=searchable+palette',
    );

    fireEvent.click(screen.getByRole('button', { name: /"palette-1".*⟳/ }));

    expect(link.getAttribute('href')).toBe(
      '/r/local/palette-1?colorscheme=palette-alt&background=dark&q=searchable+palette',
    );
  });

  it('exposes the result count and visible results as an accessible status', () => {
    renderSearch([repository(1)]);

    const results = screen.getByRole('region', {
      name: 'results for "palette", 1 repository',
    });

    expect(results.getAttribute('aria-busy')).toBe('false');
    expect(within(results).getByRole('status').textContent).toBe(
      '1 repository found for "palette"; 1 shown',
    );
    expect(within(results).getAllByRole('article')).toHaveLength(1);
  });

  it('announces an empty result set', () => {
    renderSearch([]);

    const results = screen.getByRole('region', {
      name: 'results for "palette", 0 repositories',
    });

    expect(within(results).getByRole('status').textContent).toBe(
      'no repositories found for "palette"',
    );
    expect(within(results).getByText('no results found')).toBeDefined();
  });

  it('exposes manifest failures as an alert', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    renderWithQueryClient(createQueryClient());

    expect((await screen.findByRole('alert')).textContent).toBe(
      'search failed to load',
    );
    expect(
      screen
        .getByRole('region', { name: 'results for "palette"' })
        .getAttribute('aria-busy'),
    ).toBe('false');
  });

  it('announces how many matching repositories are visible', () => {
    renderSearch(Array.from({ length: 25 }, (_, index) => repository(index)));

    const results = screen.getByRole('region', {
      name: 'results for "palette", 25 repositories',
    });

    expect(within(results).getAllByRole('article')).toHaveLength(24);
    expect(within(results).getByRole('status').textContent).toBe(
      '25 repositories found for "palette"; 24 shown',
    );

    fireEvent.click(within(results).getByRole('button', { name: /load more/ }));

    expect(within(results).getAllByRole('article')).toHaveLength(25);
    expect(within(results).getByRole('status').textContent).toBe(
      '25 repositories found for "palette"; 25 shown',
    );
    expect(
      within(results).queryByRole('button', { name: /load more/ }),
    ).toBeNull();
  });

  it('resets pagination when the search changes', () => {
    const repositories = Array.from({ length: 25 }, (_, index) =>
      repository(index),
    );
    const queryClient = createQueryClient();
    queryClient.setQueryData(['repository-search-manifest'], repositories);
    const { rerender } = render(searchTree(queryClient, 'palette'));

    fireEvent.click(screen.getByRole('button', { name: /load more/ }));
    expect(screen.getAllByRole('article')).toHaveLength(25);

    rerender(searchTree(queryClient, 'theme'));

    expect(screen.getAllByRole('article')).toHaveLength(24);
    expect(screen.getByRole('status').textContent).toBe(
      '25 repositories found for "theme"; 24 shown',
    );
  });

  it.each(changedPageContexts)(
    'resets pagination when the %s changes',
    (_change, nextPageContext) => {
      const repositories = Array.from({ length: 25 }, (_, index) =>
        repository(index),
      );
      const queryClient = createQueryClient();
      queryClient.setQueryData(['repository-search-manifest'], repositories);
      const { rerender } = render(searchTree(queryClient, 'palette'));

      fireEvent.click(screen.getByRole('button', { name: /load more/ }));
      expect(screen.getAllByRole('article')).toHaveLength(25);

      rerender(searchTree(queryClient, 'palette', nextPageContext));

      expect(screen.getAllByRole('article')).toHaveLength(24);
      expect(screen.getByRole('status').textContent).toBe(
        '25 repositories found for "palette"; 24 shown',
      );
    },
  );

  it('exposes one accessible loading status', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined)),
    );
    renderWithQueryClient(createQueryClient());

    const results = screen.getByRole('region', {
      name: 'results for "palette"',
    });

    expect(results.getAttribute('aria-busy')).toBe('true');
    expect(within(results).getAllByRole('status')).toHaveLength(1);
    expect(within(results).getByRole('status').textContent).toBe(
      'searching repositories',
    );
  });
});

function renderSearch(repositories: RepositoryDTO[], query = 'palette') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(['repository-search-manifest'], repositories);

  return renderWithQueryClient(queryClient, query);
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function renderWithQueryClient(queryClient: QueryClient, query = 'palette') {
  return render(searchTree(queryClient, query));
}

function searchTree(
  queryClient: QueryClient,
  query: string,
  currentPageContext = pageContext,
) {
  return (
    <QueryClientProvider client={queryClient}>
      <RepositorySearch pageContext={currentPageContext} query={query} />
    </QueryClientProvider>
  );
}

function repository(index: number): RepositoryDTO {
  return {
    name: `palette-${index}`,
    owner: { name: 'local' },
    description: 'a searchable palette theme',
    githubCreatedAt: '2024-01-01T00:00:00.000Z',
    pushedAt: '2024-01-02T00:00:00.000Z',
    githubURL: `https://github.com/local/palette-${index}`,
    stargazersCount: index,
    weekStargazersCount: index,
    vimColorSchemes: [
      {
        name: `palette-${index}`,
        backgrounds: ['dark'],
        data: {
          light: null,
          dark: [
            { name: 'NormalBg', hexCode: '#000000' },
            { name: 'NormalFg', hexCode: '#ffffff' },
          ],
        },
      },
    ],
  };
}
