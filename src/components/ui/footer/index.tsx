import cn from 'classnames';
import Link from 'next/link';

import styles from './index.module.css';

const WORDMARK = [
  '      _                         _                _                         ',
  '__   _(_)_ __ ___   ___ ___ | | ___  _ __ ___  ___| |__   ___ _ __ ___   ___  ___',
  "\\ \\ / / | '_ ` _ \\ / __/ _ \\| |/ _ \\| '__/ __|/ __| '_ \\ / _ \\ '_ ` _ \\ / _ \\/ __|",
  ' \\ v /| | | | | | | (_| (_) | | (_) | |  \\__ \\ (__| | | |  __/ | | | | |  __/\\__ \\',
  '  \\_/ |_|_| |_| |_|\\___\\___/|_|\\___/|_|  |___/\\___|_| |_|\\___|_| |_| |_|\\___||___/',
].join('\n');

export default function Footer() {
  return (
    <footer className={styles.container}>
      <Link
        href="/"
        prefetch={false}
        className={styles.wordmark}
        aria-label="vimcolorschemes home"
      >
        {WORDMARK}
      </Link>
      <nav className={styles.statusline} aria-label="Footer">
        <Link href="/" prefetch={false} className={styles.brand}>
          vimcolorschemes
        </Link>
        <div className={styles.links}>
          <Link href="/about" prefetch={false} className={styles.link}>
            <span className={styles.glyph}>?</span>
            about
          </Link>
          <a
            href="https://github.com/vimcolorschemes/vimcolorschemes"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(styles.link, styles.accent)}
          >
            <span className={styles.glyph}>#</span>
            github
          </a>
          <a
            href="https://github.com/reobin"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span className={styles.glyph}>@</span>
            contact
          </a>
          <a
            href="https://www.buymeacoffee.com/reobin"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span className={styles.glyph}>★</span>
            support
          </a>
        </div>
      </nav>
    </footer>
  );
}
