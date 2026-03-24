import RepositoryDTO from '@/models/DTO/repository';

import PageContext from '@/lib/pageContext';

import RepositoriesGrid from '@/components/repositories/grid';

type RepositoriesContentProps = {
  repositoriesPromise: Promise<RepositoryDTO[]>;
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
