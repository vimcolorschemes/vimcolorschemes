import classNames from 'classnames';

import styles from './index.module.css';

type RepositoriesHeaderProps = {
  count?: number;
  headingId?: string;
  query?: string;
  title: string;
};

export default function RepositoriesHeader({
  count,
  headingId = 'repositories-title',
  query,
  title,
}: RepositoriesHeaderProps) {
  const repositoryLabel =
    count == null
      ? undefined
      : `${count} repositor${count === 1 ? 'y' : 'ies'}`;
  const titleLabel = query == null ? title : `${title} "${query}"`;
  const accessibleLabel = repositoryLabel
    ? `${titleLabel}, ${repositoryLabel}`
    : titleLabel;

  return (
    <div
      className={classNames(styles.header, {
        [styles.searchHeader]: query != null,
      })}
    >
      <h2 id={headingId} className={styles.title} aria-label={accessibleLabel}>
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
