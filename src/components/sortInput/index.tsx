import Link from 'next/link';

import FilterHelper from '@/helpers/filter';
import SortHelper from '@/helpers/sort';
import PageContext from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

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
          <li key={option} className={styles.option}>
            <Link href={`/${option}/${url}`}>
              <p>{SortHelper.getLabel(option)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
