import TuiLoading from '@/components/ui/tuiLoading';

import styles from './index.module.css';

export default function ColorschemesGridSkeleton() {
  return (
    <div className={styles.container}>
      <TuiLoading />
    </div>
  );
}
