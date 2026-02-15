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
      <InteractivePreview
        colorschemes={repository.dto.vimColorSchemes}
        pageContext={pageContext}
        className={styles.preview}
      />
      <Link href={repository.route} className={styles.info}>
        <RepositoryTitle
          repository={repository}
          as="h2"
          classNames={{ title: styles.title }}
        />
        <RepositoryInfo repository={repository} />
      </Link>
    </article>
  );
}
