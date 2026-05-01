import { RepositoryDTO } from '@/models/DTO/repository';
import { Repository } from '@/models/repository';

import type { PageContext } from '@/lib/pageContext';

import Card, { cardFooterIconClassName } from '@/components/card';
import IconStar from '@/components/ui/icons/star';
import IconTrending from '@/components/ui/icons/trending';

import RepositoryCardInteractiveTerminalPreview from './interactiveTerminalPreview';

type RepositoryCardProps = {
  repositoryDTO: RepositoryDTO;
  pageContext: PageContext;
  className?: string;
  headingLevel?: 'h2' | 'h3';
};

export default function RepositoryCard({
  repositoryDTO,
  pageContext,
  className,
  headingLevel,
}: RepositoryCardProps) {
  const repository = new Repository(repositoryDTO);
  const title = `${repository.name} @${repository.owner.name}`;

  return (
    <Card.Root framed interactive className={className}>
      <Card.Content>
        <Card.Link href={repository.route} label={repository.title} />
        <Card.Preview flush interactiveControls>
          <RepositoryCardInteractiveTerminalPreview
            repositoryDTO={repositoryDTO}
            pageContext={pageContext}
          />
        </Card.Preview>
        <Card.Footer aria-label={title} title={title}>
          <Card.FooterIdentity>
            <Card.FooterTitle as={headingLevel}>
              {repository.name}
            </Card.FooterTitle>
            <Card.FooterMeta>@{repository.owner.name}</Card.FooterMeta>
          </Card.FooterIdentity>
          <Card.FooterStats>
            <Card.FooterStat
              label="stars"
              title={`${repository.stargazersCount} stars`}
            >
              <IconStar className={cardFooterIconClassName} />
              {formatCount(repository.stargazersCount)}
            </Card.FooterStat>
            {repository.weekStargazersCount > 0 && (
              <Card.FooterStat
                label="trending"
                title={`${repository.weekStargazersCount} trending stars`}
              >
                <IconTrending className={cardFooterIconClassName} />
                {formatCount(repository.weekStargazersCount)}
              </Card.FooterStat>
            )}
          </Card.FooterStats>
        </Card.Footer>
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
