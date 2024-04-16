import Link from 'next/link';

import IconLogo from '@/components/icons/logo';

import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.container}>
      <Link href="/" className={styles.link}>
        <IconLogo className={styles.logo} />
        <span className={styles.title}>
          <span>vim</span>colorschemes
        </span>
      </Link>
    </header>
  );
}
