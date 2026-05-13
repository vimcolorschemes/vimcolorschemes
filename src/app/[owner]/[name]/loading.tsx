import styles from '@/components/repositoryPageContent/index.module.css';
import TuiSection from '@/components/tuiSection';

import pageStyles from './page.module.css';

export default function RepositoryPageLoading() {
  return (
    <div className={`${pageStyles.page} repositoryDetailsPage`}>
      <div className={styles.layout}>
        <TuiSection
          as="aside"
          className={styles.variantPane}
          isLoading
          aria-label="Loading colorscheme variants"
        />
        <TuiSection
          className={`${styles.previewPane} ${styles.loadingPane}`}
          isLoading
          aria-label="Loading selected colorscheme preview"
        />
        <TuiSection
          as="aside"
          className={styles.infoPane}
          isLoading
          aria-label="Loading repository information"
        />
      </div>
    </div>
  );
}
