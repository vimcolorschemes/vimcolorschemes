import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "./index.scss";

const RepositoryTitle = ({ ownerName, name, tag, className }) => {
  const TitleTag = tag;
  return (
    <TitleTag className={classnames("repository-title", className)}>
      <span className="repository-title__owner-name">{ownerName} </span>
      <span className="repository-title__name title">{name}</span>
    </TitleTag>
  );
};

RepositoryTitle.defaultProps = {
  tag: "span",
};

RepositoryTitle.propTypes = {
  ownerName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tag: PropTypes.string,
  className: PropTypes.string,
};

export default RepositoryTitle;
