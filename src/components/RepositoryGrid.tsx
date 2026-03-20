import RepositoryCard from '#/components/RepositoryCard';
import type { Background } from '#/lib/backgrounds';
import type Repository from '#/models/repository';

type RepositoryGridProps = {
  repositories: Repository[];
  emptyMessage: string;
  preferredBackground?: Background;
};

export default function RepositoryGrid({
  repositories,
  emptyMessage,
  preferredBackground,
}: RepositoryGridProps) {
  if (!repositories.length) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <section className="grid grid-cols-1 items-stretch gap-x-8 gap-y-10 md:grid-cols-2">
      {repositories.map(repository => (
        <RepositoryCard
          key={`${repository.key}-${preferredBackground || 'default'}`}
          repository={repository}
          preferredBackground={preferredBackground}
        />
      ))}
    </section>
  );
}
