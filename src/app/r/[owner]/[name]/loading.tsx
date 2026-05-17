import RepositoryPageLoadingState from '@/components/repositoryPageContent/loadingState';

import pageStyles from './page.module.css';

export default function RepositoryPageLoading() {
  return (
    <div className={`${pageStyles.page} repositoryDetailsPage`}>
      <RepositoryPageLoadingState className={pageStyles.loadingState} />
    </div>
  );
}
