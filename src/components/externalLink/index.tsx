import React from 'react';
import classnames from 'classnames';

import './index.scss';

interface Props {
  to: string;
  children?: React.ReactNode;
  className?: string;
}

function ExternalLink({ to, children, className, ...props }: Props) {
  return (
    <a
      href={to}
      rel="noopener"
      target="_blank"
      className={classnames('external-link', className)}
      {...props}
    >
      {children}
    </a>
  );
}

export default ExternalLink;
