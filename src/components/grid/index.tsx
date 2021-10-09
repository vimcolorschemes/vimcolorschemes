import React from 'react';

import './index.scss';

interface Props {
  children: React.ReactNode;
}

function Grid({ children }: Props) {
  return <div className="grid">{children}</div>;
}

export default Grid;
