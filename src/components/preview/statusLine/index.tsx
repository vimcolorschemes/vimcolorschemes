import React from 'react';
import classnames from 'classnames';

import './index.scss';

interface Props {
  fileName: string;
  cursorLine?: number;
  lineCount: number;
}

function StatusLine({ fileName, cursorLine = 0, lineCount }: Props) {
  let percentage = Math.ceil((cursorLine / lineCount) * 100).toString();
  if (percentage.length === 1) {
    percentage = ` ${percentage}`;
  }

  let lineCountIndicator = `${cursorLine || 0}:${lineCount}`;
  if (lineCount.toString().length === 1) {
    lineCountIndicator = ` ${lineCountIndicator}`;
  }

  return (
    <span className={classnames('status-line', 'StatusLineFg', 'StatusLineBg')}>
      <span className="status-line__content">
        <span
          className={classnames(
            'status-line__mode',
            'StatusLineFg--inverted',
            'StatusLineBg--inverted',
          )}
          data-ignore-a11y
        >
          NORMAL
        </span>
        <span data-ignore-a11y>{fileName}</span>
      </span>
      <span className="status-line__content">
        <span data-ignore-a11y>unix</span>
        <span data-ignore-a11y>utf-8</span>
        <span data-ignore-a11y>☰</span>
        <span data-ignore-a11y>{percentage}%</span>
        <span data-ignore-a11y>{lineCountIndicator}</span>
      </span>
    </span>
  );
}

export default StatusLine;
