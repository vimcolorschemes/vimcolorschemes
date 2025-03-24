import OwnerPageHeaderSkeleton from '@/components/ownerPageHeader/skeleton';
import OwnerTitle from '@/components/ownerTitle';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

export default function OwnerPageLoading() {
  return (
    <>
      <OwnerPageHeaderSkeleton />
      <OwnerTitle />
      <RepositoriesSkeleton />
    </>
  );
}
