import Card, { cardTitleClassName } from '@/components/card';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryTitle from '@/components/repositoryTitle';
import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

export default function RepositoryCardSkeleton() {
  return (
    <Card.Root skeleton>
      <Card.Preview className={styles.preview}>
        <Skeleton />
      </Card.Preview>
      <Card.Body>
        <RepositoryTitle classNames={{ title: cardTitleClassName }} />
        <RepositoryInfo />
      </Card.Body>
    </Card.Root>
  );
}
