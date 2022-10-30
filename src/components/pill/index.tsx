import React from 'react';

import './index.scss';

interface Props {
  children: React.ReactNode;
}

function Pill({ children }: Props) {
  return <div className="pill">{children}</div>;
}

export default Pill;
