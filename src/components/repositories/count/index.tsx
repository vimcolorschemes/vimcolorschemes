import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

import RepositoriesService from '@/services/repositories';

import Constants from '@/lib/constants';
import Filter from '@/lib/filter';
import PageContext from '@/lib/pageContext';

import FilterHelper from '@/helpers/filter';

const getRepositoryCount = unstable_cache(
  (filter: Filter) => RepositoriesService.getRepositoryCount(filter),
  ['getRepositoryCount'],
  { revalidate: 60 },
);

type RepositoriesCountProps = {
  pageContext: PageContext;
};

export default async function RepositoriesCount({
  pageContext,
}: RepositoriesCountProps) {
  const count = await getRepositoryCount(pageContext.filter);

  const pageCount = Math.ceil(count / Constants.REPOSITORY_PAGE_SIZE);
  if ((pageContext.filter.page || 1) > (pageCount || 1)) {
    delete pageContext.filter.page;
    redirect(
      `/${pageContext.sort}/${FilterHelper.getURLFromFilter(pageContext.filter)}`,
    );
  }

  return (
    <p>
      {count} repositor{count === 1 ? 'y' : 'ies'}
    </p>
  );
}
