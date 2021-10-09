import React from 'react';

import './index.scss';

interface IProps {
  children: React.ReactNode;
}

function Grid({ children }: IProps) {
  return <div className="grid">{children}</div>;
}

export default Grid;
