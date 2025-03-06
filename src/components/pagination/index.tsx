import cn from 'classnames';

import RepositoriesService from '@/services/repositories';

import Constants from '@/lib/constants';
import PageContext from '@/lib/pageContext';

import FilterHelper from '@/helpers/filter';

import IconArrow from '@/components/ui/icons/arrow';

import styles from './index.module.css';

type PaginationProps = {
  pageContext: PageContext;
};

export default async function Pagination({ pageContext }: PaginationProps) {
  const count = await RepositoriesService.getRepositoryCount(
    pageContext.filter,
  );
  const pageCount = Math.ceil(count / Constants.REPOSITORY_PAGE_SIZE);

  const page = pageContext.filter.page || 1;
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  function getPageURL(page: number): string {
    const newFilter = { ...pageContext.filter };
    delete newFilter.page;
    return `/i/${pageContext.sort}/${FilterHelper.getURLFromFilter({ ...newFilter, page })}`;
  }

  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className={styles.container}>
      {hasPrevious && (
        <a
          href={getPageURL(page - 1)}
          className={cn(styles.button, styles.previous)}
        >
          <IconArrow />
          previous
        </a>
      )}
      <span className={styles.page}>
        {page}/{pageCount}
      </span>
      {hasNext && (
        <a
          href={getPageURL(page + 1)}
          className={cn(styles.button, styles.next)}
        >
          next
          <IconArrow />
        </a>
      )}
    </nav>
  );
}
