import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import BackgroundFilter from '#/components/BackgroundFilter';
import RepositoryGrid from '#/components/RepositoryGrid';
import Backgrounds from '#/lib/backgrounds';
import type { BackgroundFilter as RepositoryBackgroundFilter } from '#/lib/filter';
import type { RepositoryDTO } from '#/models/DTO/repository';
import Repository from '#/models/repository';

type IndexSearch = {
  page: number;
  background?: RepositoryBackgroundFilter;
};

type IndexResult = {
  repositories: RepositoryDTO[];
  total: number;
  pageSize: number;
  search: IndexSearch;
};

function parseSearch(search: Record<string, unknown>): IndexSearch {
  const pageValue = Number(search.page);
  const background =
    search.background === Backgrounds.Dark ||
    search.background === Backgrounds.Light ||
    search.background === 'both'
      ? search.background
      : undefined;

  return {
    page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1,
    background,
  };
}

const loadRepositories = createServerFn({ method: 'GET' })
  .inputValidator((input: IndexSearch) => input)
  .handler(async ({ data }): Promise<IndexResult> => {
    const { getRepositories, getRepositoryCount, REPOSITORY_PAGE_SIZE } =
      await import('#/services/repositories.server');
    const [repositories, total] = await Promise.all([
      getRepositories({ page: data.page, background: data.background }),
      getRepositoryCount({ background: data.background }),
    ]);

    return {
      repositories,
      total,
      pageSize: REPOSITORY_PAGE_SIZE,
      search: data,
    };
  });

export const Route = createFileRoute('/')({
  loaderDeps: ({ search }) => parseSearch(search as Record<string, unknown>),
  loader: ({ deps }) => loadRepositories({ data: deps }),
  component: App,
});

function App() {
  const { repositories: dto, total, pageSize, search } = Route.useLoaderData();
  const repositories = dto.map(repository => new Repository(repository));
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const toURL = (overrides: Partial<IndexSearch>): string => {
    const next = { ...search, ...overrides };
    const params = new URLSearchParams();

    if (next.page > 1) {
      params.set('page', String(next.page));
    }

    if (next.background) {
      params.set('background', next.background);
    }

    const value = params.toString();
    return value ? `/?${value}` : '/';
  };

  return (
    <main className="mx-auto w-full max-w-[80rem] space-y-6 px-4 py-6 md:px-8 lg:py-10">
      <header className="space-y-4">
        <div className="space-y-1">
          <h1>vimcolorschemes</h1>
          <p>Discover vim and neovim themes from GitHub.</p>
        </div>
        <BackgroundFilter value={search.background} />

        <p className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Showing
          <span className="font-medium text-foreground">
            {repositories.length.toLocaleString()}
          </span>
          of
          <span className="font-medium text-foreground">
            {total.toLocaleString()}
          </span>
          repositories
        </p>
      </header>

      <RepositoryGrid
        repositories={repositories}
        emptyMessage="No repositories found."
      />

      {pageCount > 1 ? (
        <nav className="pt-2">
          {search.page > 1 ? (
            <a href={toURL({ page: search.page - 1 })}>Previous</a>
          ) : null}{' '}
          <span>
            {search.page}/{pageCount}
          </span>{' '}
          {search.page < pageCount ? (
            <a href={toURL({ page: search.page + 1 })}>Next</a>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
