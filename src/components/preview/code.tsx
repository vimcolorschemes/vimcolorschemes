import React from 'react';

import StatusLine from './statusLine';

interface IProps {
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
}: IProps) {
  return (
    <pre className={className}>
      <code>{children}</code>
      <StatusLine
        fileName={fileName}
        cursorLine={cursorLine}
        lineCount={lineCount}
      />
    </pre>
  );
}

export default Code;
