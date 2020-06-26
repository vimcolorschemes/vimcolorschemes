import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

const Pagination = ({ currentPage, pageCount, activeActionRoute }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageCount;
  const prevPage = currentPage - 1 === 1 ? "" : (currentPage - 1).toString();
  const nextPage = (currentPage + 1).toString();

  return (
    <div style={{ display: "flex" }}>
      {!isFirstPage && (
        <Link to={`${activeActionRoute}${prevPage}`}>Previous page</Link>
      )}
      <p>{currentPage}</p>
      {!isLastPage && (
        <Link to={`${activeActionRoute}${nextPage}`}>Next page</Link>
      )}
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  activeActionRoute: PropTypes.string.isRequired,
};

export default Pagination;
