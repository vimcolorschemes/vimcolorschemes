import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import LoadMore from './loadMore';

type LoadMoreWrapperProps = {
  pageContext: PageContext;
  countPromise: Promise<number>;
  repositoriesPromise: Promise<Repository[]>;
};

export default async function LoadMoreWrapper({
  pageContext,
  countPromise,
  repositoriesPromise,
}: LoadMoreWrapperProps) {
  const [count, repositories] = await Promise.all([
    countPromise,
    repositoriesPromise,
  ]);

  return (
    <LoadMore
      pageContext={pageContext}
      count={count}
      initialCount={repositories.length}
    />
  );
}
