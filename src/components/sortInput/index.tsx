'use client';

import cn from 'classnames';
import { usePathname } from 'next/navigation';

import PageContext from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import { getIndexRouteState } from '@/helpers/indexRoute';

import { useIndexNavigation } from '@/components/providers/indexNavigationProvider';

import styles from './index.module.css';

type SortInputProps = {
  pageContext: PageContext;
};

export default function SortInput({ pageContext }: SortInputProps) {
  const pathname = usePathname();
  const { navigateToIndex } = useIndexNavigation();
  const routeState = getIndexRouteState(pathname);

  return (
    <div className={styles.container}>
      <legend className={styles.legend}>Sort</legend>
      <ul className={styles.list}>
        {Object.values(SortOptions).map(option => (
          <li
            key={option}
            className={cn(styles.option, {
              [styles.active]: pageContext.sort === option,
            })}
          >
            <button
              type="button"
              className={styles.button}
              onClick={() =>
                navigateToIndex(
                  { sort: option, filter: pageContext.filter },
                  routeState.search,
                )
              }
            >
              <p>{option}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
