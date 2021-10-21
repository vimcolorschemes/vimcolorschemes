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
    <div className="actions">
      {Object.values(ActionsEnum).map(action => (
        <Link
          key={action.route}
          to={action.route}
          className={classnames('actions__action', {
            ['actions__action--active']: activeAction.route === action.route,
          })}
          data-focusable
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}

export default Actions;
