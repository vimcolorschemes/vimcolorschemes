import Link from 'next/link';

import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import InteractivePreview from '@/components/interactivePreview';
import Card from '@/components/ui/card';

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
    <Card className={styles.container}>
      <InteractivePreview
        repositoryDTO={repository.dto}
        pageContext={pageContext}
        className={styles.preview}
      />
      <Link href={repository.route}>
        <p className={styles.owner}>{repository.owner.name}</p>
        <h3 className={styles.title}>{repository.name}</h3>
        <p>{repository.description}</p>
        <p>{repository.stargazersCount} stars</p>
        <p>{repository.weekStargazersCount}/week</p>
        <p>{repository.backgrounds.join('/')}</p>
        <p>{repository.editors.join('/')}</p>
      </Link>
    </Card>
  );
}
