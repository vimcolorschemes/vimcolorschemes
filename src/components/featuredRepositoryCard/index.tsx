import RepositoryDTO from '@/models/DTO/repository';
import Repository from '@/models/repository';

import Card, { cardTitleClassName } from '@/components/card';
import styles from '@/components/featuredRepositories/index.module.css';
import Preview from '@/components/preview';
import RepositoryTitle from '@/components/repositoryTitle';

type FeaturedRepositoryCardProps = {
  repositoryDTO: RepositoryDTO;
};

export default function FeaturedRepositoryCard({
  repositoryDTO,
}: FeaturedRepositoryCardProps) {
  const repository = new Repository(repositoryDTO);
  const colorscheme = repository.getDefaultColorscheme();
  const background = colorscheme.getDefaultBackground();

  return (
    <Card.Root className={styles.card}>
      <Card.Content>
        <Card.Preview className={styles.preview}>
          <Preview
            compact
            colorscheme={colorscheme}
            background={background}
            disableCodeHorizontalScroll
          />
        </Card.Preview>
        <Card.Body className={styles.body}>
          <Card.Link href={repository.route} label={repository.title} />
          <RepositoryTitle
            repository={repository}
            as="h3"
            classNames={{ title: cardTitleClassName }}
          />
        </Card.Body>
      </Card.Content>
    </Card.Root>
  );
}
