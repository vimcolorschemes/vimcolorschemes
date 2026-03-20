import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from '#/components/preview/ui/Code.module.css';

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
  const lines = Array.from({ length: lineCount }, (_, index) => index + 1);
  return (
    <code className={styles.gutter}>
      {lines.map(line => (
        <div
          key={line}
          className={clsx(styles.gutterLine, {
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
  const percentage = activeLine
    ? Math.floor((activeLine / lineCount) * 100)
    : 0;

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
