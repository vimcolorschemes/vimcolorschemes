import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';

import Branding from '@/components/ui/branding';
import IconGithub from '@/components/ui/icons/github';

import styles from './index.module.css';

export default function Footer() {
  return (
    <footer className={styles.container}>
      <Link href="/">
        <Branding />
      </Link>
      <div className={styles.links}>
        <Link href="/about" className={styles.link}>
          about
        </Link>
        <a
          href="https://github.com/vimcolorschemes/vimcolorschemes"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(styles.link, styles.accent)}
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
        <Link
          href="https://www.buymeacoffee.com/reobin"
          target="_blank"
          aria-label="But me a Coffee"
        >
          <Image
            src="https://cdn.buymeacoffee.com/buttons/v2/arial-blue.png"
            alt="Buy me a Coffee"
            width={163}
            height={45}
            unoptimized
          />
        </Link>
      </div>
    </footer>
  );
}
