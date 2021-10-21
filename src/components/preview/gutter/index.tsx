import React from 'react';
import classnames from 'classnames';

import './index.scss';

interface Props {
  cursorLine?: number;
  lineCount: number;
}

function Gutter({ cursorLine, lineCount }: Props) {
  const lines = new Array(lineCount).fill(null).map((_, index) => index + 1);

  return (
    <code className="gutter LineNrFg LineNrBg">
      {lines.map(line => (
        <span
          key={line}
          className={classnames('gutter__number LineNrBg', {
            'CursorLineNrFg CursorLineNrBg':
              cursorLine != null && line === cursorLine,
          })}
          data-ignore-a11y
        >
          {line}
        </span>
      ))}
    </code>
  );
}

export default Gutter;
