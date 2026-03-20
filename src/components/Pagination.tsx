import { Link } from '@tanstack/react-router';

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  createHref: (page: number) => string;
};

export default function Pagination({
  currentPage,
  pageCount,
  createHref,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < pageCount;

  return (
    <nav aria-label="Repository pagination" className="pt-2">
      <div className="mx-auto flex w-full max-w-xs items-center justify-between">
        {hasPreviousPage ? (
          <Link
            to={createHref(currentPage - 1)}
            className="inline-flex h-8 items-center justify-center px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            rel="prev"
          >
            Prev
          </Link>
        ) : (
          <span className="inline-flex h-8 items-center justify-center px-2 text-sm text-muted-foreground/60">
            Prev
          </span>
        )}

        <span aria-live="polite" className="text-sm text-foreground">
          {currentPage} / {pageCount}
        </span>

        {hasNextPage ? (
          <Link
            to={createHref(currentPage + 1)}
            className="inline-flex h-8 items-center justify-center px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            rel="next"
          >
            Next
          </Link>
        ) : (
          <span className="inline-flex h-8 items-center justify-center px-2 text-sm text-muted-foreground/60">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
