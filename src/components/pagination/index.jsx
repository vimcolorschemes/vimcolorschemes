import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

import { SECTIONS, LAYOUTS } from "../../constants";

import "./index.scss";

const Pagination = ({ currentPage, pageCount, activeActionRoute }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;
  const prevPage = currentPage - 1 === 1 ? "" : (currentPage - 1).toString();
  const nextPage = (currentPage + 1).toString();

  return (
    <div className="pagination">
      <div className="pagination__link-block">
        {!isFirstPage && (
          <Link
            to={`${activeActionRoute}`}
            data-section={SECTIONS.PAGINATION}
            data-layout={LAYOUTS.LIST}
            className="pagination__link pagination__link--limit"
          >
            First
          </Link>
        )}
        {!isFirstPage && (
          <Link
            to={`${activeActionRoute}${prevPage}`}
            data-section={SECTIONS.PAGINATION}
            data-layout={LAYOUTS.LIST}
            data-priority={2}
            className="pagination__link"
          >
            Previous
          </Link>
        )}
      </div>
      <p className="pagination__page-status">
        {currentPage} / {pageCount}
      </p>
      <div className="pagination__link-block">
        {!isLastPage && (
          <Link
            to={`${activeActionRoute}${nextPage}`}
            data-section={SECTIONS.PAGINATION}
            data-layout={LAYOUTS.LIST}
            data-priority={1}
            className="pagination__link"
          >
            Next
          </Link>
        )}
        {!isLastPage && (
          <Link
            to={`${activeActionRoute}${pageCount}`}
            data-section={SECTIONS.PAGINATION}
            data-layout={LAYOUTS.LIST}
            className="pagination__link pagination__link--limit"
          >
            Last
          </Link>
        )}
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  activeActionRoute: PropTypes.string.isRequired,
};

export default Pagination;
