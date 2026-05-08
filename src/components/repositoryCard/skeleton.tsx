import Card from '@/components/card';
import TuiLoading from '@/components/ui/tuiLoading';

import styles from './index.module.css';

type RepositoryCardSkeletonProps = {
  className?: string;
};

export default function RepositoryCardSkeleton({
  className,
}: RepositoryCardSkeletonProps) {
  return (
    <Card.Root framed skeleton className={className}>
      <Card.Content>
        <Card.Preview flush className={styles.preview}>
          <TuiLoading compact />
        </Card.Preview>
        <Card.Footer aria-label="loading repository">
          <Card.FooterIdentity>
            <Card.FooterTitle>loading</Card.FooterTitle>
            <Card.FooterMeta>@repo</Card.FooterMeta>
          </Card.FooterIdentity>
          <Card.FooterStats>
            <Card.FooterStat label="stars">✶ --</Card.FooterStat>
            <Card.FooterStat label="trending">↗ --</Card.FooterStat>
          </Card.FooterStats>
        </Card.Footer>
      </Card.Content>
    </Card.Root>
  );
}
