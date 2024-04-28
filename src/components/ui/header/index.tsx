import Link from 'next/link';

import Branding from '@/components/ui/branding';

import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.container}>
      <Link href="/" className={styles.link}>
        <Branding />
      </Link>
    </header>
  );
}
