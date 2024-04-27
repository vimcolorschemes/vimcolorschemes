import Link from 'next/link';
import { redirect } from 'next/navigation';

import RepositoriesService from '@/services/repositories';

import Constants from '@/lib/constants';
import PageContext from '@/lib/pageContext';

import FilterHelper from '@/helpers/filter';

import RepositoryCard from '@/components/repositoryCard';

import Pagination from '../pagination';

import styles from './index.module.css';

type RepositoryGridProps = {
  pageContext: PageContext;
};

export default async function Resporitories({
  pageContext,
}: RepositoryGridProps) {
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

  const repositories = await RepositoriesService.getRepositories(pageContext);

  return (
    <>
      <p>{count} repositories</p>
      <section className={styles.grid}>
        {repositories.map(repository => (
          <RepositoryCard repository={repository} key={repository.key} />
        ))}
      </section>
      <Pagination pageContext={pageContext} pageCount={pageCount} />
    </>
  );
}
