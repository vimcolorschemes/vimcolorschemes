'use client';

import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SortOptions } from '@/lib/sort';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

import { useIndexPending } from '@/components/providers/indexPendingProvider';

import styles from './index.module.css';

export default function SortInput() {
  const pathname = usePathname();
  const { pageContext, searchQuery, startPending } = useIndexPending();

  return (
    <div className={styles.container}>
      <legend className={styles.legend}>Sort</legend>
      <ul className={styles.list}>
        {Object.values(SortOptions).map(option => {
          const href = buildIndexRoutePath(
            { sort: option, filter: pageContext.filter },
            searchQuery,
          );

          return (
            <li
              key={option}
              className={cn(styles.option, {
                [styles.active]: pageContext.sort === option,
              })}
            >
              <Link
                className={styles.button}
                href={href}
                prefetch={false}
                onClick={() => {
                  if (searchQuery && href !== pathname) {
                    startPending(
                      href,
                      { sort: option, filter: pageContext.filter },
                      searchQuery,
                    );
                  }
                }}
                scroll={false}
              >
                <p>{option}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
