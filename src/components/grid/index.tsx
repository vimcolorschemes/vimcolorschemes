import React from 'react';
import classnames from 'classnames';

import './index.scss';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function Grid({ children, className }: Props) {
  return (
    <section className={classnames('grid', className)}>{children}</section>
  );
}

export default Grid;
