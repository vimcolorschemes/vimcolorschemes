import Link from 'next/link';

import FilterHelper from '@/helpers/filter';
import IndexPageContext from '@/lib/indexPageContext';
import { SortOptions } from '@/lib/sort';

import styles from './index.module.css';

type SortInputProps = {
  pageContext: IndexPageContext;
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
              <p>{option}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
