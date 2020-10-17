import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import classnames from "classnames";

import { paginateRoute } from "src/utils/pagination";

import { SECTIONS, LAYOUTS } from "src/constants";

import "./index.scss";

const PageLink = ({ children, to, onClick, limit, priority }) => {
  const Tag = to ? Link : "button";

  return (
    <Tag
      to={to}
      onClick={onClick}
      data-section={SECTIONS.PAGINATION}
      data-layout={LAYOUTS.LIST}
      data-priority={priority}
      className={classnames("pagination__link", {
        "pagination__link--limit": limit,
      })}
    >
      {children}
    </Tag>
  );
};

PageLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  onClick: PropTypes.func,
  limit: PropTypes.bool,
};

const Pagination = ({ page, pageCount, activeActionRoute, onChange }) => {
  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;

  const previousPage = page - 1;
  const nextPage = page + 1;

  return (
    <div className="pagination">
      <div className="pagination__link-block">
        {!isFirstPage && (
          <PageLink
            to={
              activeActionRoute
                ? paginateRoute(activeActionRoute, 1)
                : undefined
            }
            onClick={onChange ? () => onChange(1) : undefined}
            limit
          >
            First
          </PageLink>
        )}
        {!isFirstPage && (
          <PageLink
            to={
              activeActionRoute
                ? paginateRoute(activeActionRoute, previousPage)
                : undefined
            }
            onClick={onChange ? () => onChange(previousPage) : undefined}
            priority={2}
          >
            Previous
          </PageLink>
        )}
      </div>
      <p className="pagination__page-status">
        {page} / {pageCount}
      </p>
      <div className="pagination__link-block">
        {!isLastPage && (
          <PageLink
            to={
              activeActionRoute
                ? paginateRoute(activeActionRoute, nextPage)
                : undefined
            }
            onClick={onChange ? () => onChange(nextPage) : undefined}
            priority={1}
          >
            Next
          </PageLink>
        )}
        {!isLastPage && (
          <PageLink
            to={
              activeActionRoute
                ? paginateRoute(activeActionRoute, pageCount)
                : undefined
            }
            onClick={onChange ? () => onChange(pageCount) : undefined}
            limit
          >
            Last
          </PageLink>
        )}
      </div>
    </div>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  activeActionRoute: PropTypes.string,
  onChange: PropTypes.func,
};

export default Pagination;
