import ColorschemesGridSkeleton from '@/components/colorschemesGrid/skeleton';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryPageHeaderSkeleton from '@/components/repositoryPageHeader/skeleton';
import RepositoryTitle from '@/components/repositoryTitle';

import styles from './page.module.css';

export default function RepositoryPageLoading() {
  return (
    <>
      <RepositoryPageHeaderSkeleton />
      <RepositoryTitle classNames={{ container: styles.pageWidth }} />
      <RepositoryInfo className={styles.pageWidth} />
      <ColorschemesGridSkeleton />
    </>
  );
}
