import { redirect } from 'next/navigation';

import RepositoriesService from '@/services/repositories';

import Constants from '@/lib/constants';
import PageContext from '@/lib/pageContext';

import FilterHelper from '@/helpers/filter';

import Pagination from '@/components/pagination';
import RepositoryCard from '@/components/repositoryCard';

import styles from './index.module.css';

type RepositoryGridProps = {
  pageContext: PageContext;
};

export default async function ResporitoryGrid({
  pageContext,
}: RepositoryGridProps) {
  const [count, repositories] = await Promise.all([
    RepositoriesService.getRepositoryCount(pageContext.filter),
    RepositoriesService.getRepositories(pageContext),
  ]);

  const pageCount = Math.ceil(count / Constants.REPOSITORY_PAGE_SIZE);
  if ((pageContext.filter.page || 1) > (pageCount || 1)) {
    delete pageContext.filter.page;
    redirect(
      `/${pageContext.sort}/${FilterHelper.getURLFromFilter(pageContext.filter)}`,
    );
  }

  return (
    <div className={styles.container}>
      <p>{count} repositories</p>
      <section className={styles.grid}>
        {repositories.map(repository => (
          <RepositoryCard
            key={repository.key}
            repository={repository}
            pageContext={pageContext}
          />
        ))}
      </section>
      <Pagination pageContext={pageContext} pageCount={pageCount} />
    </div>
  );
}
