import Link from 'next/link';

import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import DateHelper from '@/helpers/date';

import InteractivePreview from '@/components/interactivePreview';
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
      <InteractivePreview
        repositoryDTO={repository.dto}
        pageContext={pageContext}
        className={styles.preview}
      />
      <Link href={repository.route} className={styles.info}>
        <RepositoryTitle repository={repository} as="h2" />
        <div>
          <p>{repository.description}</p>
        </div>
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
      </Link>
    </article>
  );
}
