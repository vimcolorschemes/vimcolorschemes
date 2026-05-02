import ColorschemesGridSkeleton from '@/components/colorschemesGrid/skeleton';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import styles from '@/components/repositoryPageContent/index.module.css';
import RepositoryPageHeaderSkeleton from '@/components/repositoryPageHeader/skeleton';
import RepositoryTitle from '@/components/repositoryTitle';

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
