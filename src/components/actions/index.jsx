import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import { LAYOUTS, SECTIONS } from "src/constants";

import { isInViewport } from "src/utils/navigation";

import "./index.scss";

const Actions = ({ actions, activeAction }) => {
  useEffect(() => {
    const activeActionElement = document.querySelector(
      ".actions__item--active",
    );
    if (!isInViewport(activeActionElement))
      activeActionElement.scrollIntoView({ block: "end", inline: "start" });
  }, []);

  return (
    <nav className="actions">
      <div className="actions__shadow-overlay" />
      <ul className="actions__list">
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
              data-priority={index + 1}
              to={action.route}
              aria-label={`${action.label} vim color schemes`}
            >
              {action.label}
            </Link>
          </li>
        ))}
        <li className="actions__shadow-overlay-block" aria-hidden />
      </ul>
    </nav>
  );
};

const actionType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
});

Actions.propTypes = {
  actions: PropTypes.arrayOf(actionType).isRequired,
  activeAction: actionType.isRequired,
};

export default Actions;
