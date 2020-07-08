import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

const Grid = ({ children }) => <ul className="grid">{children}</ul>;

Grid.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Grid;
