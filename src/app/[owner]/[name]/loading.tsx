import RepositoryInfo from '@/components/repositoryInfo/repositoryInfo';
import styles from '@/components/repositoryPageContent/index.module.css';
import RepositoryTitle from '@/components/repositoryTitle';
import TuiLoading from '@/components/ui/tuiLoading';

export default function RepositoryPageLoading() {
  return (
    <div className={styles.layout}>
      <aside className={styles.variantPane} />
      <section className={styles.previewEmpty}>
        <TuiLoading />
      </section>
      <aside className={styles.infoPane}>
        <RepositoryTitle showStats={false} />
        <RepositoryInfo />
      </aside>
    </div>
  );
}
