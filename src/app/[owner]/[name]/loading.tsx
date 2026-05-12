import Card, { cardCodePreviewClassName } from '@/components/card';
import styles from '@/components/repositoryPageContent/index.module.css';
import TuiLoading from '@/components/ui/tuiLoading';

export default function RepositoryPageLoading() {
  return (
    <div className={styles.layout}>
      <aside
        className={styles.variantPane}
        aria-label="Loading colorscheme variants"
      >
        <div className={styles.variantHeader}>[variants]</div>
        <div className={styles.variantList}>
          <div className={styles.variantButton}>
            <TuiLoading flush />
          </div>
        </div>
      </aside>
      <section
        className={styles.previewPane}
        aria-label="Loading selected colorscheme preview"
      >
        <Card.Root framed className={styles.previewCard}>
          <Card.Content>
            <Card.Preview flush>
              <div
                className={`${cardCodePreviewClassName} ${styles.codePreview}`}
              >
                <TuiLoading />
              </div>
            </Card.Preview>
          </Card.Content>
        </Card.Root>
      </section>
      <aside className={styles.infoPane}>
        <TuiLoading flush />
      </aside>
    </div>
  );
}
