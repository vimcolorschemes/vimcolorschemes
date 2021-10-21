import React from 'react';
import classnames from 'classnames';

import './index.scss';

interface Props {
  className?: string;
}

function IconForwardSlash({ className }: Props) {
  return (
    <svg
      className={classnames('icon-forward-slash', className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="23" y1="1" x2="1" y2="23"></line>
    </svg>
  );
}

export default IconForwardSlash;
