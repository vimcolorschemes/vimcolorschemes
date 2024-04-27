import cn from 'classnames';
import { ReactNode } from 'react';

import styles from './index.module.css';

type CodeProps = {
  children: ReactNode;
  fileName: string;
  lineCount: number;
  activeLine?: number;
};

export default function Code(props: CodeProps) {
  return (
    <pre className={styles.container}>
      <Gutter {...props} />
      <code className={styles.code}>{props.children}</code>
      <StatusLine {...props} />
    </pre>
  );
}

function Gutter({ activeLine, lineCount }: CodeProps) {
  const lines = Array.from({ length: lineCount }).map((_, i) => i + 1);
  return (
    <code className={styles.gutter}>
      {lines.map(line => (
        <div
          key={line}
          className={cn(styles.gutterLine, {
            [styles.active]: activeLine === line,
          })}
        >
          {line}
        </div>
      ))}
    </code>
  );
}

function StatusLine({ fileName, activeLine, lineCount }: CodeProps) {
  const percentage = activeLine ? (activeLine / lineCount) * 100 : 0;
  return (
    <div className={styles.statusLine}>
      <span className={styles.mode}>NORMAL</span>
      <span className={styles.fileName}>{fileName}</span>
      <span>unix</span>
      <span>utf-8</span>
      <span>{percentage}%</span>
      <span>
        {activeLine || 0}:{lineCount}
      </span>
    </div>
  );
}
