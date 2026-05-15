import RepositoryPageLoadingState from '@/components/repositoryPageContent/loadingState';
import RepositoryPageModal from '@/components/repositoryPageModal';

export default function RepositoryPageModalLoading() {
  return (
    <RepositoryPageModal>
      <RepositoryPageLoadingState />
    </RepositoryPageModal>
  );
}
