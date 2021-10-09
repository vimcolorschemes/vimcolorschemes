import React from 'react';
import classnames from 'classnames';

import Buffer from '@/components/preview/buffer';
import StatusLine from '@/components/preview/statusLine';

import './index.scss';

interface Props {
  fileName: string;
  cursorLine?: number;
  lineCount: number;
  children: React.ReactNode;
  className: string;
}

function Code({
  fileName,
  cursorLine,
  lineCount,
  children,
  className,
}: Props) {
  return (
    <pre className={classnames('code', className)}>
      <Buffer cursorLine={cursorLine} lineCount={lineCount}>
        {children}
      </Buffer>
      <StatusLine
        fileName={fileName}
        cursorLine={cursorLine}
        lineCount={lineCount}
      />
    </pre>
  );
}

export default Code;
