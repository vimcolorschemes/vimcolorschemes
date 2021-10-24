import React from 'react';
import { Link } from 'gatsby';
import classnames from 'classnames';

import { Action, Actions as ActionsEnum } from '@/lib/actions';

import './index.scss';

interface Props {
  activeAction: Action;
}

function Actions({ activeAction }: Props) {
  return (
    <nav className="actions" aria-label="repository list sort actions">
      <div className="actions__shadow-overlay" />
      <ul className="actions__list">
        {Object.values(ActionsEnum).map(action => (
          <li
            key={action.route}
            className={classnames('actions__action', {
              ['actions__action--active']: activeAction.route === action.route,
            })}
          >
            <Link to={action.route} data-focusable>
              {action.label}
            </Link>
          </li>
        ))}
        <li className="actions__shadow-overlay-block" aria-hidden />
      </ul>
    </nav>
  );
}

export default Actions;
