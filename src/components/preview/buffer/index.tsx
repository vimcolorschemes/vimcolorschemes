import React from 'react';

import Gutter from '@/components/preview/gutter';

import './index.scss';

interface Props {
  cursorLine?: number;
  lineCount: number;
  children: React.ReactNode;
}

function Buffer({ cursorLine, lineCount, children }: Props) {
  return (
    <span className="buffer">
      <Gutter lineCount={lineCount} cursorLine={cursorLine} />
      <code className="buffer__code" tabIndex={0} data-ignore-a11y>
        {children}
      </code>
    </span>
  );
}

export default Buffer;
