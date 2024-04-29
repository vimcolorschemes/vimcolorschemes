import cn from 'classnames';
import Link from 'next/link';

import Branding from '@/components/ui/branding';

import IconGithub from '../icons/github';

import styles from './index.module.css';

export default function Footer() {
  return (
    <footer className={styles.container}>
      <Link href="/">
        <Branding />
      </Link>
      <div className={styles.linkGroup}>
        <Link href="/about" className={styles.link}>
          about
        </Link>
        <a
          href="https://github.com/vimcolorschemes/vimcolorschemes"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(styles.link, styles.github)}
        >
          follow <span className={styles.desktop}>vimcolorschemes </span>on
          Github
          <IconGithub />
        </a>
        <a
          href="https://github.com/reobin"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          contact
        </a>
      </div>
    </footer>
  );
}
