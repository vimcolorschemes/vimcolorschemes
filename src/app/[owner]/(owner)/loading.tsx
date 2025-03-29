import OwnerPageHeaderSkeleton from '@/components/ownerPageHeader/skeleton';
import OwnerTitle from '@/components/ownerTitle';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

import styles from './page.module.css';

export default function OwnerPageLoading() {
  return (
    <>
      <OwnerPageHeaderSkeleton />
      <OwnerTitle className={styles.owner} />
      <RepositoriesSkeleton />
    </>
  );
}
