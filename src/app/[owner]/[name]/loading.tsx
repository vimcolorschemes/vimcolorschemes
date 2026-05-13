import styles from '@/components/repositoryPageContent/index.module.css';
import TuiLoading from '@/components/ui/tuiLoading';

import pageStyles from './page.module.css';

export default function RepositoryPageLoading() {
  return (
    <div className={`${pageStyles.page} repositoryDetailsPage`}>
      <div className={`${styles.loadingState} repositoryDetailsLoading`}>
        <TuiLoading />
      </div>
    </div>
  );
}
