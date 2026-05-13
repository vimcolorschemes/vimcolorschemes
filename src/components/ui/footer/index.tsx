import cn from 'classnames';
import Link from 'next/link';

import styles from './index.module.css';

export default function Footer() {
  return (
    <footer className={styles.container}>
      <Link
        href="/"
        prefetch={false}
        className={styles.wordmark}
        aria-label="vimcolorschemes home"
      >
        {String.raw`           ░██                                      ░██                                           ░██
                                                    ░██                                           ░██
░██    ░██ ░██░█████████████   ░███████   ░███████  ░██  ░███████  ░██░████  ░███████   ░███████  ░████████   ░███████  ░█████████████   ░███████   ░███████
░██    ░██ ░██░██   ░██   ░██ ░██    ░██ ░██    ░██ ░██ ░██    ░██ ░███     ░██        ░██    ░██ ░██    ░██ ░██    ░██ ░██   ░██   ░██ ░██    ░██ ░██
 ░██  ░██  ░██░██   ░██   ░██ ░██        ░██    ░██ ░██ ░██    ░██ ░██       ░███████  ░██        ░██    ░██ ░█████████ ░██   ░██   ░██ ░█████████  ░███████
  ░██░██   ░██░██   ░██   ░██ ░██    ░██ ░██    ░██ ░██ ░██    ░██ ░██             ░██ ░██    ░██ ░██    ░██ ░██        ░██   ░██   ░██ ░██               ░██
   ░███    ░██░██   ░██   ░██  ░███████   ░███████  ░██  ░███████  ░██       ░███████   ░███████  ░██    ░██  ░███████  ░██   ░██   ░██  ░███████   ░███████  `}
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
