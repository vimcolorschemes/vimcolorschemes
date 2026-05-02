import RepositoryPageLoading from '@/app/[owner]/[name]/loading';

import RepositoryPageModal from '@/components/repositoryPageModal';

export default function RepositoryPageModalLoading() {
  return (
    <RepositoryPageModal>
      <RepositoryPageLoading />
    </RepositoryPageModal>
  );
}
