import React from 'react';
import classnames from 'classnames';

import './index.scss';

interface Props {
  className?: string;
  left?: boolean;
}

function IconArrow({ className, left }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classnames('icon-arrow', className, {
        'icon-arrow--left': left,
      })}
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

export default IconArrow;
