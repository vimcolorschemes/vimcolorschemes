import React, { useMemo } from 'react';
import { Link } from 'gatsby';

import { Action } from '@/lib/actions';

import URLHelper from '@/helpers/url';

import './index.scss';

interface Props {
  activeAction: Action;
  currentPage: number;
  pageCount: number;
}

function Pagination({ activeAction, currentPage, pageCount }: Props) {
  const isFirstPage = useMemo(() => currentPage === 1, [currentPage]);
  const isLastPage = useMemo(() => currentPage === pageCount, [
    currentPage,
    pageCount,
  ]);

  return (
    <div className="pagination">
      {!isFirstPage && (
        <Link to={URLHelper.paginateRoute(activeAction.route, currentPage - 1)}>
          {currentPage - 1}
        </Link>
      )}
      {currentPage}/{pageCount}
      {!isLastPage && (
        <Link to={URLHelper.paginateRoute(activeAction.route, currentPage + 1)}>
          {currentPage + 1}
        </Link>
      )}
    </div>
  );
}

export default Pagination;
