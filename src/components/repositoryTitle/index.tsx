import cn from 'classnames';

import { Repository } from '@/models/repository';

import OwnerTitle from '@/components/ownerTitle';
import IconStar from '@/components/ui/icons/star';
import IconTrending from '@/components/ui/icons/trending';
import { TuiLoadingInline } from '@/components/ui/tuiLoading';

import styles from './index.module.css';

type RepositoryTitleProps = {
  repository?: Repository;
  /** The name of the HTML element to render the title as. */
  as?: 'h1' | 'h2' | 'h3';
  ownerPrefix?: string;
  showStats?: boolean;
  classNames?: {
    container?: string;
    titleContainer?: string;
    title?: string;
  };
};

export default function RepositoryTitle({
  repository,
  as,
  ownerPrefix,
  showStats = true,
  classNames,
}: RepositoryTitleProps) {
  const Title = as ?? 'h1';
  return (
    <div className={cn(styles.container, classNames?.container)}>
      <Title className={cn(styles.titleContainer, classNames?.titleContainer)}>
        <OwnerTitle
          owner={repository?.owner}
          prefix={ownerPrefix}
          className={styles.ownerTitle}
        />
        <span className={styles.separator}>/</span>
        <div className={cn(styles.title, classNames?.title)}>
          {repository?.name ?? <TuiLoadingInline />}
        </div>
      </Title>
      {showStats && (
        <div className={styles.stats}>
          <p className={styles.stat}>
            <IconStar />
            {repository ? (
              <strong>{repository.stargazersCount}</strong>
            ) : (
              <TuiLoadingInline />
            )}
          </p>
          {(repository?.weekStargazersCount || 0) > 0 && (
            <p className={styles.stat}>
              <IconTrending />
              <span>
                <strong>{repository?.weekStargazersCount}</strong>/week
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
