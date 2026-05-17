import cn from 'classnames';

import styles from './index.module.css';

const LOADING_CELLS = Array.from({ length: 6 });
const INLINE_CELLS = Array.from({ length: 5 });

type TuiLoadingProps = {
  className?: string;
  compact?: boolean;
};

export default function TuiLoading({ className, compact }: TuiLoadingProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn(styles.container, compact && styles.compact, className)}
    >
      <span className={styles.srOnly}>Loading</span>
      <span className={styles.frame} aria-hidden="true">
        {LOADING_CELLS.map((_, index) => (
          <span key={index} className={styles.cell} />
        ))}
      </span>
    </div>
  );
}

type TuiLoadingInlineProps = {
  className?: string;
};

export function TuiLoadingInline({ className }: TuiLoadingInlineProps) {
  return (
    <span
      role="status"
      aria-busy="true"
      className={cn(styles.inline, className)}
    >
      <span className={styles.srOnly}>Loading</span>
      <span className={styles.inlineCells} aria-hidden="true">
        {INLINE_CELLS.map((_, index) => (
          <span key={index} className={styles.inlineCell} />
        ))}
      </span>
    </span>
  );
}
