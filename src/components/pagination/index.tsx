import React, { useMemo } from 'react';
import { Link } from 'gatsby';

import { Action } from '@/lib/actions';

import URLHelper from '@/helpers/url';

import './index.scss';

interface PageLinkProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function PageLink({ to, onClick, children }: PageLinkProps) {
  if (to) {
    return <Link to={to}>{children}</Link>;
  }

  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
}

interface PaginationProps {
  activeAction: Action;
  currentPage: number;
  onChange?: (page: number) => void;
  pageCount: number;
}

function Pagination({
  activeAction,
  currentPage,
  onChange,
  pageCount,
}: PaginationProps) {
  const isFirstPage = useMemo(() => currentPage === 1, [currentPage]);
  const isLastPage = useMemo(
    () => currentPage === pageCount,
    [currentPage, pageCount],
  );

  return (
    <div className="pagination">
      {!isFirstPage && (
        <PageLink
          to={
            !onChange
              ? URLHelper.paginateRoute(activeAction.route, currentPage - 1)
              : undefined
          }
          onClick={onChange ? () => onChange(currentPage - 1) : undefined}
        >
          {currentPage - 1}
        </PageLink>
      )}
      {currentPage}/{pageCount}
      {!isLastPage && (
        <PageLink
          to={
            !onChange
              ? URLHelper.paginateRoute(activeAction.route, currentPage + 1)
              : undefined
          }
          onClick={onChange ? () => onChange(currentPage + 1) : undefined}
        >
          {currentPage + 1}
        </PageLink>
      )}
    </div>
  );
}

export default Pagination;
