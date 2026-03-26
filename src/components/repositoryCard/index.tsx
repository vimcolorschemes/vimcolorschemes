import { RepositoryDTO } from '@/models/DTO/repository';
import { Repository } from '@/models/repository';

import type { PageContext } from '@/lib/pageContext';

import Card, { cardTitleClassName } from '@/components/card';
import InteractivePreview from '@/components/interactivePreview';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryTitle from '@/components/repositoryTitle';

import styles from './index.module.css';

type RepositoryCardProps = {
  repositoryDTO: RepositoryDTO;
  pageContext: PageContext;
};

export default function RepositoryCard({
  repositoryDTO,
  pageContext,
}: RepositoryCardProps) {
  const repository = new Repository(repositoryDTO);

  return (
    <Card.Root>
      <Card.Content>
        <Card.Preview className={styles.preview}>
          <InteractivePreview
            repositoryDTO={repositoryDTO}
            pageContext={pageContext}
          />
        </Card.Preview>
        <Card.Body>
          <Card.Link href={repository.route} label={repository.title} />
          <RepositoryTitle
            repository={repository}
            as="h2"
            classNames={{ title: cardTitleClassName }}
          />
          <RepositoryInfo repository={repository} />
        </Card.Body>
      </Card.Content>
    </Card.Root>
  );
}
