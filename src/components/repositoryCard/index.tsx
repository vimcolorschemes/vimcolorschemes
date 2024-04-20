import Repository from '@/models/repository';

import Card from '@/components/ui/card';

type RepositoryCardProps = {
  repository: Repository;
};

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card>
      <h2>{repository.key}</h2>
      <p>{repository.description}</p>
      <p>{repository.stargazersCount} stars</p>
      <p>{repository.weekStargazersCount}/week</p>
      <p>{repository.backgrounds.join('/')}</p>
      <p>{repository.engines.join('/')}</p>
    </Card>
  );
}
