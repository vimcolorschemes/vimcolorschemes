import Link from 'next/link';

import styles from './index.module.css';

type HomeCommandProps = {
  interactive?: boolean;
};

export default function HomeCommand({ interactive = true }: HomeCommandProps) {
  const content = (
    <>
      <span className={styles.prompt}>~</span>
      <span className={styles.operator}>❯</span>
      <span className={styles.command}>vimcolorschemes</span>
    </>
  );

  if (!interactive) {
    return <span className={styles.homeCommand}>{content}</span>;
  }

  return (
    <Link href="/i/trending" prefetch={false} className={styles.homeCommand}>
      {content}
    </Link>
  );
}
