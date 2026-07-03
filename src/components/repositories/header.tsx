import styles from './index.module.css';

type RepositoriesHeaderProps = {
  count?: number;
  title: string;
};

export default function RepositoriesHeader({
  count,
  title,
}: RepositoriesHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 id="repositories-title" className={styles.title}>
        {title}
        {count != null && (
          <span className={styles.count}>
            {count} repositor{count === 1 ? 'y' : 'ies'}
          </span>
        )}
      </h2>
    </div>
  );
}
