import { RepositoryDTO } from '@/models/DTO/repository';
import { Repository } from '@/models/repository';

import type { PageContext } from '@/lib/pageContext';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

import Card from '@/components/card';

import RepositoryCardInteractivePreviewLink from './interactivePreviewLink';

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
  const prioritizedBackground =
    pageContext.filter?.background === 'both'
      ? undefined
      : pageContext.filter?.background;
  const colorscheme = repository.getDefaultColorscheme(prioritizedBackground);
  const background = colorscheme.getDefaultBackground(prioritizedBackground);
  const style = RepositoryPageHelper.getColorschemeStyle(
    colorscheme,
    background,
  );

  return (
    <Card.Root framed interactive className={className} style={style}>
      <Card.Content>
        <RepositoryCardInteractivePreviewLink
          repositoryDTO={repositoryDTO}
          pageContext={pageContext}
        />
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
              <span aria-hidden="true">✶</span>
              {formatCount(repository.stargazersCount)}
            </Card.FooterStat>
            {repository.weekStargazersCount > 0 && (
              <Card.FooterStat
                label="trending"
                title={`${repository.weekStargazersCount} trending stars`}
              >
                <span aria-hidden="true">↗</span>
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
