import { redirect } from 'next/navigation';

import Constants from '@/lib/constants';
import PageContext from '@/lib/pageContext';

import FilterHelper from '@/helpers/filter';

type RepositoriesCountProps = {
  pageContext: PageContext;
  countPromise: Promise<number>;
};

export default async function RepositoriesCount({
  pageContext,
  countPromise,
}: RepositoriesCountProps) {
  const count = await countPromise;

  const pageCount = Math.ceil(count / Constants.REPOSITORY_PAGE_SIZE);
  if ((pageContext.filter.page || 1) > (pageCount || 1)) {
    redirect(
      `/${pageContext.sort}/${FilterHelper.getURLFromFilter({ ...pageContext.filter, page: undefined })}`,
    );
  }

  return (
    <p>
      {count} repositor{count === 1 ? 'y' : 'ies'}
    </p>
  );
}
