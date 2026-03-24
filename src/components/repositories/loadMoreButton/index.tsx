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
      {loading ? 'loading...' : 'load more'}
    </button>
  );
}
