import cn from 'classnames';

import { Repository } from '@/models/repository';

import { DateHelper } from '@/helpers/date';

import { TuiLoadingInline } from '@/components/ui/tuiLoading';

import styles from './repositoryInfo.module.css';

type RepositoryInfoProps = {
  repository?: Repository;
  className?: string;
};

export default function RepositoryInfo({
  repository,
  className,
}: RepositoryInfoProps) {
  return (
    <div className={cn(styles.container, className)}>
      {(!repository || !!repository.description) && (
        <p className={styles.description}>
          {repository?.description || <TuiLoadingInline />}
        </p>
      )}
      <div>
        <p className={styles.info}>
          <span>published </span>
          {repository ? (
            <strong>{DateHelper.format(repository.githubCreatedAt)}</strong>
          ) : (
            <TuiLoadingInline />
          )}
        </p>
        <p className={styles.info}>
          <span>updated </span>
          {repository ? (
            <strong>{DateHelper.format(repository.pushedAt)}</strong>
          ) : (
            <TuiLoadingInline />
          )}
        </p>
      </div>
    </div>
  );
}
