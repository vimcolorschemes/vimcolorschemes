import React from 'react';

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
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

export default ExternalLink;
