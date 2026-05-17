import TuiLoading from '@/components/ui/tuiLoading';

import styles from './index.module.css';

type RepositoryPageLoadingStateProps = {
  className?: string;
};

export default function RepositoryPageLoadingState({
  className,
}: RepositoryPageLoadingStateProps) {
  return (
    <div
      className={`${styles.loadingState} repositoryDetailsLoading ${className ?? ''}`}
    >
      <TuiLoading />
    </div>
  );
}
