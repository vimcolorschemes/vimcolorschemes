import cn from 'classnames';

import Repository from '@/models/repository';

import IconStar from '@/components/ui/icons/star';
import IconTrending from '@/components/ui/icons/trending';

import styles from './index.module.css';

type RepositoryTitleProps = {
  repository: Repository;
  /**
   * The name of the HTML element to render the title as.
   */
  as?: string;
  classNames?: {
    container?: string;
    title?: string;
  };
};

export default function RepositoryTitle({
  repository,
  as,
  classNames,
}: RepositoryTitleProps) {
  const Component = (as as keyof JSX.IntrinsicElements) ?? 'h1';
  return (
    <div className={cn(styles.container, classNames?.container)}>
      <Component className={styles.title}>
        <div>{repository.owner.name}</div>
        <div className={classNames?.title}>{repository.name}</div>
      </Component>
      <div className={styles.stats}>
        <p className={styles.stat}>
          <IconStar />
          <strong>{repository.stargazersCount}</strong>
        </p>
        {repository.weekStargazersCount > 0 && (
          <p className={styles.stat}>
            <IconTrending />
            <span>
              <strong>{repository.weekStargazersCount}</strong>/week
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
