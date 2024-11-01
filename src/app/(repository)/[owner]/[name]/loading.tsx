import ColorschemesGridSkeleton from '@/components/colorschemesGrid/skeleton';
import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import RepositoryPageHeaderSkeleton from '@/components/repositoryPageHeader/skeleton';
import RepositoryTitle from '@/components/repositoryTitle';

export default function RepositoryPageLoading() {
  return (
    <>
      <RepositoryPageHeaderSkeleton />
      <RepositoryTitle />
      <RepositoryInfo />
      <ColorschemesGridSkeleton count={4} />
    </>
  );
}
