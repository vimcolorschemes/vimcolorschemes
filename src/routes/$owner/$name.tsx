import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import Preview from '#/components/preview/Preview';
import DateHelper from '#/helpers/date';
import Repository from '#/models/repository';

const loadRepository = createServerFn({ method: 'GET' })
  .inputValidator((input: { owner: string; name: string }) => input)
  .handler(async ({ data }) => {
    const { getRepository } = await import('#/services/repositories.server');
    const repository = await getRepository(data.owner, data.name);

    if (!repository) {
      throw notFound();
    }

    return repository;
  });

export const Route = createFileRoute('/$owner/$name')({
  loader: ({ params }) =>
    loadRepository({ data: { owner: params.owner, name: params.name } }),
  component: RepositoryRoute,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.name}, by ${loaderData.owner.name}`
          : 'Repository',
      },
    ],
  }),
  notFoundComponent: () => (
    <main>
      <h1>Repository not found</h1>
    </main>
  ),
});

function RepositoryRoute() {
  const dto = Route.useLoaderData();
  const repository = new Repository(dto);

  return (
    <main>
      <header>
        <p>
          <Link to="/">Back to home</Link>
        </p>
        <a
          href={`https://github.com/${repository.key}`}
          target="_blank"
          rel="noreferrer"
        >
          View on GitHub
        </a>
      </header>

      <section>
        <h1>{repository.name}</h1>
        <p>by {repository.owner.name}</p>
        {repository.description ? <p>{repository.description}</p> : null}

        <dl>
          <div>
            <dt>Stars</dt>
            <dd>{repository.stargazersCount.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Trending</dt>
            <dd>{repository.weekStargazersCount.toLocaleString()}/week</dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd>{DateHelper.format(repository.githubCreatedAt)}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{DateHelper.format(repository.pushedAt)}</dd>
          </div>
        </dl>
      </section>

      <section>
        {repository.flattenedColorschemes.map((colorscheme, index) => (
          <Preview
            key={`${colorscheme.name}-${colorscheme.backgrounds[0]}-${index}`}
            colorscheme={colorscheme}
            background={colorscheme.backgrounds[0]}
          />
        ))}
      </section>
    </main>
  );
}
