import Link from 'next/link';

import FilterHelper from '@/helpers/filter';
import PageContext from '@/lib/pageContext';

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
    return `${pageContext.sort}/${FilterHelper.getURLFromFilter({ ...newFilter, page })}`;
  }

  return (
    <nav>
      {hasPrevious && <Link href={getPageURL(page - 1)}>Previous</Link>}
      {page}
      {hasNext && <Link href={getPageURL(page + 1)}>Next</Link>}
    </nav>
  );
}
