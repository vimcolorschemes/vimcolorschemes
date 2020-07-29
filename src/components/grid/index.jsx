import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

import "./index.scss";

const Grid = ({ className, children }) => (
  <ul className={classnames("grid", className)}>{children}</ul>
);

Grid.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Grid;
