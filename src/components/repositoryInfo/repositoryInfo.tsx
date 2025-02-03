import Repository from '@/models/repository';

import DateHelper from '@/helpers/date';

import Skeleton from '@/components/ui/skeleton';

import styles from './repositoryInfo.module.css';

type RepositoryInfoProps = {
  repository?: Repository;
};

export default function RepositoryInfo({ repository }: RepositoryInfoProps) {
  return (
    <div className={styles.container}>
      {(!repository || !!repository.description) && (
        <p className={styles.description}>
          {repository?.description || <Skeleton inline />}
        </p>
      )}
      <div>
        <p className={styles.info}>
          <span>published </span>
          {repository ? (
            <strong>{DateHelper.format(repository.githubCreatedAt)}</strong>
          ) : (
            <Skeleton inline />
          )}
        </p>
        <p className={styles.info}>
          <span>last commit </span>
          {repository ? (
            <strong>{DateHelper.format(repository.lastCommitAt)}</strong>
          ) : (
            <Skeleton inline />
          )}
        </p>
      </div>
    </div>
  );
}
