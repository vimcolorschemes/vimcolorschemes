import Repository from '@/models/repository';

import styles from './index.module.css';

type RepositoryTitleProps = {
  repository: Repository;
  /**
   * The name of the HTML element to render the title as.
   */
  as?: string;
};

export default function RepositoryTitle({
  repository,
  as,
}: RepositoryTitleProps) {
  const Component = (as as keyof JSX.IntrinsicElements) ?? 'h1';
  return (
    <Component className={styles.container}>
      <div>{repository.owner.name}</div>
      <div>{repository.name}</div>
    </Component>
  );
}
