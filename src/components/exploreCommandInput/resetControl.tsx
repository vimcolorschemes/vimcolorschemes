'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

import styles from './index.module.css';

type ResetControlProps = {
  href: string;
};

export default function ResetControl({ href }: ResetControlProps) {
  const router = useRouter();

  useKeyboardShortcut({
    r: event => {
      event.preventDefault();
      router.replace(href, { scroll: false });
    },
  });

  return (
    <Link
      aria-keyshortcuts="r"
      aria-label="Reset repository search, filters, and sorting"
      className={styles.resetControl}
      href={href}
      prefetch={false}
      scroll={false}
    >
      reset
    </Link>
  );
}
