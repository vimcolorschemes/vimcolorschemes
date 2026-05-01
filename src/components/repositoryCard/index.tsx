import { RepositoryDTO } from '@/models/DTO/repository';
import { Repository } from '@/models/repository';

import type { PageContext } from '@/lib/pageContext';

import Card from '@/components/card';
import IconStar from '@/components/ui/icons/star';
import IconTrending from '@/components/ui/icons/trending';

import styles from './index.module.css';
import InteractiveTerminalPreview from './interactiveTerminalPreview';

type RepositoryCardProps = {
  repositoryDTO: RepositoryDTO;
  pageContext: PageContext;
};

export default function RepositoryCard({
  repositoryDTO,
  pageContext,
}: RepositoryCardProps) {
  const repository = new Repository(repositoryDTO);
  const title = `${repository.name} @${repository.owner.name}`;

  return (
    <Card.Root interactive className={styles.card}>
      <Card.Content className={styles.content}>
        <Card.Link href={repository.route} label={repository.title} />
        <Card.Preview className={styles.previewFrame}>
          <InteractiveTerminalPreview
            repositoryDTO={repositoryDTO}
            pageContext={pageContext}
          />
        </Card.Preview>
        <footer className={styles.footer} aria-label={title} title={title}>
          <div className={styles.identity}>
            <h2 className={styles.name}>{repository.name}</h2>
            <span className={styles.owner}>@{repository.owner.name}</span>
          </div>
          <dl className={styles.stats}>
            <div
              className={styles.stat}
              title={`${repository.stargazersCount} stars`}
            >
              <dt className={styles.statLabel}>stars</dt>
              <dd className={styles.statValue}>
                <IconStar className={styles.icon} />
                {formatCount(repository.stargazersCount)}
              </dd>
            </div>
            {repository.weekStargazersCount > 0 && (
              <div
                className={styles.stat}
                title={`${repository.weekStargazersCount} trending stars`}
              >
                <dt className={styles.statLabel}>trending</dt>
                <dd className={styles.statValue}>
                  <IconTrending className={styles.icon} />
                  {formatCount(repository.weekStargazersCount)}
                </dd>
              </div>
            )}
          </dl>
        </footer>
      </Card.Content>
    </Card.Root>
  );
}

function formatCount(count: number): string {
  return Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(count);
}
