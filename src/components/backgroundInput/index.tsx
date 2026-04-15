'use client';

import cn from 'classnames';
import Link from 'next/link';

import { Backgrounds } from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

import { useIndexPending } from '@/components/providers/indexPendingProvider';
import radioStyles from '@/components/ui/radio/index.module.css';

import styles from './index.module.css';

export default function BackgroundInput() {
  const { pageContext } = useIndexPending();
  const options: { value: BackgroundFilter | undefined; label: string }[] = [
    { value: undefined, label: 'any' },
    { value: Backgrounds.Dark, label: 'dark' },
    { value: Backgrounds.Light, label: 'light' },
    { value: 'both', label: 'both' },
  ];

  return (
    <fieldset className={radioStyles.container}>
      <legend className={radioStyles.legend}>background:</legend>
      <div className={radioStyles.options}>
        {options.map(option => {
          const href = buildIndexRoutePath({
            sort: pageContext.sort,
            filter: {
              ...pageContext.filter,
              background: option.value,
            },
          });

          return (
            <Link
              key={option.label}
              href={href}
              prefetch={false}
              scroll={false}
              className={cn(radioStyles.option, styles.option)}
            >
              <span
                className={styles.indicator}
                data-active={pageContext.filter.background === option.value}
              />
              <span>{option.label}</span>
            </Link>
          );
        })}
      </div>
    </fieldset>
  );
}
