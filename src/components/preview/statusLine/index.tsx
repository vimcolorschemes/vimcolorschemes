import React from 'react';
import classnames from 'classnames';

import './index.scss';

interface IProps {
  fileName: string;
  cursorLine?: number;
  lineCount: number;
}

function StatusLine({ fileName, cursorLine = 0, lineCount }: IProps) {
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
        >
          NORMAL
        </span>
        <span>{fileName}</span>
      </span>
      <span className="status-line__content">
        <span>unix</span>
        <span>utf-8</span>
        <span>☰</span>
        <span>{percentage}%</span>
        <span>{lineCountIndicator}</span>
      </span>
    </span>
  );
}

export default StatusLine;
