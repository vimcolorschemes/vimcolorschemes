import Link from 'next/link';

import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import InteractivePreview from '@/components/interactivePreview';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryTitle from '@/components/repositoryTitle';

import styles from './index.module.css';

type RepositoryCardProps = {
  repository: Repository;
  pageContext: PageContext;
};

export default function RepositoryCard({
  repository,
  pageContext,
}: RepositoryCardProps) {
  return (
    <article className={styles.container}>
      <Link
        href={repository.route}
        className={styles.link}
        aria-label={repository.title}
      >
        <span className={styles.linkLabel}>{repository.title}</span>
      </Link>
      <div className={styles.content}>
        <InteractivePreview
          repositoryDTO={repository.dto}
          pageContext={pageContext}
          className={styles.preview}
        />
        <div className={styles.info}>
          <RepositoryTitle
            repository={repository}
            as="h2"
            classNames={{ title: styles.title }}
          />
          <RepositoryInfo repository={repository} />
        </div>
      </div>
    </article>
  );
}
