import cn from 'classnames';
import Link from 'next/link';

import PageContext from '@/lib/pageContext';

import FilterHelper from '@/helpers/filter';

import IconArrow from '@/components/ui/icons/arrow';

import styles from './index.module.css';

type PaginationProps = {
  pageContext: PageContext;
  pageCount: number;
};

export default function Pagination({
  pageContext,
  pageCount,
}: PaginationProps) {
  const page = pageContext.filter.page || 1;
  const hasPrevious = page > 1;
  const hasNext = page < pageCount;

  function getPageURL(page: number): string {
    const newFilter = { ...pageContext.filter };
    delete newFilter.page;
    return `/${pageContext.sort}/${FilterHelper.getURLFromFilter({ ...newFilter, page })}`;
  }

  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className={styles.container}>
      {hasPrevious && (
        <Link
          href={getPageURL(page - 1)}
          className={cn(styles.button, styles.previous)}
        >
          <IconArrow />
          previous
        </Link>
      )}
      <span className={styles.page}>
        {page}/{pageCount}
      </span>
      {hasNext && (
        <Link
          href={getPageURL(page + 1)}
          className={cn(styles.button, styles.next)}
        >
          next
          <IconArrow />
        </Link>
      )}
    </nav>
  );
}
