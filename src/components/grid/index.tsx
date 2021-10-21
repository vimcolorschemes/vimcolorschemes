import React from 'react';

import './index.scss';

interface Props {
  children: React.ReactNode;
}

function Grid({ children }: Props) {
  return <section className="grid">{children}</section>;
}

export default Grid;
