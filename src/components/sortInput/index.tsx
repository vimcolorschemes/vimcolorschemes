import cn from 'classnames';
import Link from 'next/link';

import PageContext from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import FilterHelper from '@/helpers/filter';
import SortHelper from '@/helpers/sort';

import styles from './index.module.css';

type SortInputProps = {
  pageContext: PageContext;
};

export default function SortInput({ pageContext }: SortInputProps) {
  const url = FilterHelper.getURLFromFilter(pageContext.filter);

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
            <Link href={`/${option}/${url}`}>
              <p>{SortHelper.getLabel(option)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
