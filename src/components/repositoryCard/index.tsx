import Link from 'next/link';

import Repository from '@/models/repository';

import PageContext from '@/lib/pageContext';

import InteractivePreview from '@/components/interactivePreview';
import Card from '@/components/ui/card';

type RepositoryCardProps = {
  repository: Repository;
  pageContext: PageContext;
};

export default function RepositoryCard({
  repository,
  pageContext,
}: RepositoryCardProps) {
  return (
    <Card>
      <InteractivePreview
        repositoryDTO={repository.dto}
        pageContext={pageContext}
      />
      <Link href={repository.route}>
        <h2>{repository.key}</h2>
        <p>{repository.description}</p>
        <p>{repository.stargazersCount} stars</p>
        <p>{repository.weekStargazersCount}/week</p>
        <p>{repository.backgrounds.join('/')}</p>
        <p>{repository.editors.join('/')}</p>
      </Link>
    </Card>
  );
}
