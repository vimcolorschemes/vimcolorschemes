import cn from 'classnames';
import { ReactNode } from 'react';

import styles from './index.module.css';

type CodeEditorProps = {
  children: ReactNode;
  fileName: string;
  lineCount: number;
  activeLine?: number;
};

export default function CodeEditor(props: CodeEditorProps) {
  return (
    <pre className={styles.container}>
      <Gutter {...props} />
      <code className={styles.code}>{props.children}</code>
      <Footer {...props} />
    </pre>
  );
}

function Gutter({ activeLine, lineCount }: CodeEditorProps) {
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

function Footer({ fileName, activeLine, lineCount }: CodeEditorProps) {
  const percentage = activeLine ? (activeLine / lineCount) * 100 : 0;
  return (
    <div className={styles.footer}>
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
