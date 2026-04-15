'use client';

import cn from 'classnames';
import Link from 'next/link';

import { SortOptions } from '@/lib/sort';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

import { useIndexPending } from '@/components/providers/indexPendingProvider';

import styles from './index.module.css';

export default function SortInput() {
  const { pageContext } = useIndexPending();

  return (
    <div className={styles.container}>
      <legend className={styles.legend}>Sort</legend>
      <ul className={styles.list}>
        {Object.values(SortOptions).map(option => {
          const href = buildIndexRoutePath({
            sort: option,
            filter: pageContext.filter,
          });

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
