import Repository from '@/models/repository';

import DateHelper from '@/helpers/date';

import styles from './repositoryInfo.module.css';

type RepositoryInfoProps = {
  repository: Repository;
};

export default function RepositoryInfo({ repository }: RepositoryInfoProps) {
  return (
    <div className={styles.container}>
      <p className={styles.description}>{repository.description}</p>
      <div>
        <p>
          created{' '}
          <strong>{DateHelper.format(repository.githubCreatedAt)}</strong>
        </p>
        <p>
          last commit{' '}
          <strong>{DateHelper.format(repository.lastCommitAt)}</strong>
        </p>
      </div>
    </div>
  );
}
