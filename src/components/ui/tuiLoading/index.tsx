import cn from 'classnames';

import styles from './index.module.css';

type TuiLoadingProps = {
  className?: string;
  compact?: boolean;
  flush?: boolean;
};

export default function TuiLoading({
  className,
  compact,
  flush,
}: TuiLoadingProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn(
        styles.container,
        compact && styles.compact,
        flush && styles.flush,
        className,
      )}
    >
      <span>loading</span>
      <span className={styles.dots} aria-hidden="true" />
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
      <span>loading</span>
      <span className={styles.dots} aria-hidden="true" />
    </span>
  );
}
