import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { LAYOUTS, SECTIONS } from "src/constants";

import "./index.scss";

const Actions = ({ actions, activeAction }) => (
  <ul className="actions">
    {actions.map((action, index) => (
      <li
        key={`${action.route}-${index}`}
        className={`actions__item ${
          activeAction === action ? "actions__item--active" : ""
        }`}
      >
        <Link
          data-section={SECTIONS.ACTIONS}
          data-layout={LAYOUTS.LIST}
          to={action.route}
          aria-label={`${action.label} vim color schemes`}
        >
          {action.label}
        </Link>
      </li>
    ))}
  </ul>
);

const actionType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
});

Actions.propTypes = {
  actions: PropTypes.arrayOf(actionType).isRequired,
  activeAction: actionType.isRequired,
};

export default Actions;
