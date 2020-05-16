import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

const Grid = ({ children }) => {
  return <div className="grid">{children}</div>;
};

Grid.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Grid;
