import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

const RepositoryTitle = ({ ownerName, name, isRepositoryPage, className }) => {
  const TitleTag = isRepositoryPage ? "h1" : "span";

  return (
    <div className={`repository-title${!!className ? ` ${className}` : ""}`}>
      <span className="repository-title__owner-name">{ownerName}</span>
      <TitleTag className="repository-title__name title">{name}</TitleTag>
    </div>
  );
};

RepositoryTitle.propTypes = {
  ownerName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRepositoryPage: PropTypes.bool,
  className: PropTypes.string
};

export default RepositoryTitle;
