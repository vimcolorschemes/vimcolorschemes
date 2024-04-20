import PageContext from '@/lib/pageContext';

import FilterHelper from '@/helpers/filter';

import ButtonLink from '@/components/ui/buttonLink';

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
    <nav>
      {hasPrevious && (
        <ButtonLink href={getPageURL(page - 1)}>Previous</ButtonLink>
      )}
      {page}
      {hasNext && <ButtonLink href={getPageURL(page + 1)}>Next</ButtonLink>}
    </nav>
  );
}
