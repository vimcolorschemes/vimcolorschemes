import { TuiLoadingInline } from '@/components/ui/tuiLoading';

import styles from './index.module.css';

type LoadMoreButtonProps = {
  loading: boolean;
  onClick: () => void;
};

export default function LoadMoreButton({
  loading,
  onClick,
}: LoadMoreButtonProps) {
  return (
    <button onClick={onClick} disabled={loading} className={styles.button}>
      {loading ? <TuiLoadingInline /> : 'load more'}
    </button>
  );
}
