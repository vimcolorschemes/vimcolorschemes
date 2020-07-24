import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { SECTIONS } from "../../constants/sections";

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
        <Link data-section={SECTIONS.ACTIONS} to={action.route}>
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
