import classNames from 'classnames';
import type { ReactNode } from 'react';

import styles from './index.module.css';

type RepositoriesHeaderProps = {
  count?: number;
  query?: string;
  title: ReactNode;
};

export default function RepositoriesHeader({
  count,
  query,
  title,
}: RepositoriesHeaderProps) {
  return (
    <div
      className={classNames(styles.header, {
        [styles.searchHeader]: query != null,
      })}
    >
      <h2 id="repositories-title" className={styles.title}>
        <span className={styles.titleSummary}>
          <span>{title}</span>
          {query != null && (
            <span className={styles.quotedQuery}>
              <span className={styles.queryQuote}>&quot;</span>
              <span className={styles.queryText}>{query}</span>
              <span className={styles.queryQuote}>&quot;</span>
            </span>
          )}
        </span>
        {count != null && (
          <>
            <span className={styles.titleRule} aria-hidden="true" />
            <span className={styles.count}>
              {count} repositor{count === 1 ? 'y' : 'ies'}
            </span>
          </>
        )}
      </h2>
    </div>
  );
}
