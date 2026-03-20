import RepositoryCard from '#/components/RepositoryCard';
import type Repository from '#/models/repository';

type RepositoryGridProps = {
  repositories: Repository[];
  emptyMessage: string;
};

export default function RepositoryGrid({
  repositories,
  emptyMessage,
}: RepositoryGridProps) {
  if (!repositories.length) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repositories.map(repository => (
        <RepositoryCard key={repository.key} repository={repository} />
      ))}
    </section>
  );
}
