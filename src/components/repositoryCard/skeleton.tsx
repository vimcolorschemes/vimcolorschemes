import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryTitle from '@/components/repositoryTitle';
import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

export default function RepositoryCardSkeleton() {
  return (
    <article className={styles.container}>
      <Skeleton className={styles.preview} />
      <span className={styles.info}>
        <RepositoryTitle classNames={{ title: styles.title }} />
        <RepositoryInfo />
      </span>
    </article>
  );
}
