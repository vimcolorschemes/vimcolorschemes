import React, { useMemo } from 'react';
import { Link } from 'gatsby';

import URLHelper from '@/helpers/url';
import { Action } from '@/lib/actions';
import Background from '@/lib/background';

import IconArrow from '@/components/icons/arrow';

import './index.scss';

interface PageLinkProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function PageLink({ to, onClick, children }: PageLinkProps) {
  if (to) {
    return (
      <Link to={to} className="pagination__link" data-focusable>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="pagination__link"
      onClick={onClick}
      data-focusable
    >
      {children}
    </button>
  );
}

interface PaginationProps {
  activeAction: Action;
  activeFilters: Background[];
  currentPage: number;
  onChange?: (page: number) => void;
  pageCount: number;
}

function Pagination({
  activeAction,
  activeFilters,
  currentPage,
  onChange,
  pageCount,
}: PaginationProps) {
  const isFirstPage = useMemo(() => currentPage === 1, [currentPage]);
  const isLastPage = useMemo(
    () => currentPage === pageCount,
    [currentPage, pageCount],
  );

  const routePrefix = useMemo(() => {
    if (activeFilters.length === 1) {
      return `/${activeFilters[0]}`;
    }

    return '';
  }, [activeFilters]);

  return (
    <div className="pagination">
      <div>
        {!isFirstPage && (
          <PageLink
            to={
              !onChange
                ? URLHelper.paginateRoute(activeAction.route, currentPage - 1)
                : undefined
            }
            onClick={onChange ? () => onChange(currentPage - 1) : undefined}
          >
            <IconArrow className="pagination__icon" left />
            <span>Previous page</span>
          </PageLink>
        )}
      </div>
      <div>
        {currentPage}/{pageCount}
      </div>
      <div>
        {!isLastPage && (
          <PageLink
            to={
              !onChange
                ? URLHelper.paginateRoute(
                    routePrefix + activeAction.route,
                    currentPage + 1,
                  )
                : undefined
            }
            onClick={onChange ? () => onChange(currentPage + 1) : undefined}
          >
            <span>Next page</span>
            <IconArrow className="pagination__icon" />
          </PageLink>
        )}
      </div>
    </div>
  );
}

export default Pagination;
