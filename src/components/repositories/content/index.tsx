import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import RepositoriesGrid from '@/components/repositories/grid';

type RepositoriesContentProps = {
  repositoriesPromise: Promise<Repository[]>;
  pageContext: PageContext;
};

export default async function RepositoriesContent({
  repositoriesPromise,
  pageContext,
}: RepositoriesContentProps) {
  const repositories = await repositoriesPromise;

  return (
    <RepositoriesGrid repositories={repositories} pageContext={pageContext} />
  );
}
