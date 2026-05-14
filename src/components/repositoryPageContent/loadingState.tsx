import RepositoryPageDelayedLoading from './delayedLoading';
import styles from './index.module.css';

export default function RepositoryPageLoadingState() {
  return (
    <div className={`${styles.loadingState} repositoryDetailsLoading`}>
      <RepositoryPageDelayedLoading />
    </div>
  );
}
