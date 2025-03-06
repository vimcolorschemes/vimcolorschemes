import { redirect } from 'next/navigation';

import RepositoriesService from '@/services/repositories';

import Constants from '@/lib/constants';
import PageContext from '@/lib/pageContext';

import FilterHelper from '@/helpers/filter';



type RepositoriesCountProps = {
  pageContext: PageContext;
};

export default async function RepositoriesCount({
  pageContext,
}: RepositoriesCountProps) {
  const count = await RepositoriesService.getRepositoryCount(
    pageContext.filter,
  );

  const pageCount = Math.ceil(count / Constants.REPOSITORY_PAGE_SIZE);
  if ((pageContext.filter.page || 1) > (pageCount || 1)) {
    delete pageContext.filter.page;
    redirect(
      `/${pageContext.sort}/${FilterHelper.getURLFromFilter(pageContext.filter)}`,
    );
  }

  return <p>{count} repositories</p>;
}
