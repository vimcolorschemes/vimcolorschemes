import styles from '@/components/repositoryPageContent/index.module.css';
import TuiSection from '@/components/tuiSection';
import TuiLoading from '@/components/ui/tuiLoading';

export default function RepositoryPageLoading() {
  return (
    <div className={styles.layout}>
      <TuiSection
        as="aside"
        title="variants"
        className={styles.variantPane}
        aria-label="Loading colorscheme variants"
      >
        <TuiLoading flush />
      </TuiSection>
      <TuiSection
        className={`${styles.previewPane} ${styles.loadingPane}`}
        aria-label="Loading selected colorscheme preview"
      >
        <TuiLoading flush />
      </TuiSection>
      <TuiSection
        as="aside"
        className={styles.infoPane}
        aria-label="Loading repository information"
      >
        <TuiLoading flush />
      </TuiSection>
    </div>
  );
}
