'use client';

import cn from 'classnames';
import Link from 'next/link';

import { Backgrounds } from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';
import { Sort, SortOptions } from '@/lib/sort';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

import { useIndexPending } from '@/components/providers/indexPendingProvider';

import styles from './index.module.css';

const sortOptions = Object.values(SortOptions);
const backgroundOptions: {
  value: BackgroundFilter | undefined;
  label: string;
}[] = [
  { value: undefined, label: 'any' },
  { value: Backgrounds.Dark, label: 'dark' },
  { value: Backgrounds.Light, label: 'light' },
  { value: 'both', label: 'both' },
];

export default function ExploreCommandInput() {
  const { pageContext } = useIndexPending();

  return (
    <div className={styles.container} aria-label="Explore color schemes">
      <Link href="/i/trending" prefetch={false} className={styles.prompt}>
        ~/vimcolorschemes
      </Link>
      <span className={styles.operator}>❯</span>
      <span className={styles.command}>explore</span>
      <span className={styles.flag}>--sort</span>
      <span className={styles.group} aria-label="Sort repositories">
        {sortOptions.map((option, index) => (
          <CommandLink
            key={option}
            href={buildIndexRoutePath({
              sort: option,
              filter: pageContext.filter,
            })}
            active={pageContext.sort === option}
            separator={index > 0}
          >
            {option}
          </CommandLink>
        ))}
      </span>
      <span className={styles.flag}>--background</span>
      <span className={styles.group} aria-label="Filter by background">
        {backgroundOptions.map((option, index) => (
          <CommandLink
            key={option.label}
            href={buildIndexRoutePath({
              sort: pageContext.sort,
              filter: {
                ...pageContext.filter,
                background: option.value,
              },
            })}
            active={pageContext.filter.background === option.value}
            separator={index > 0}
          >
            {option.label}
          </CommandLink>
        ))}
      </span>
    </div>
  );
}

function CommandLink({
  active,
  children,
  href,
  separator,
}: {
  active: boolean;
  children: Sort | string;
  href: string;
  separator: boolean;
}) {
  return (
    <span className={styles.segment}>
      {separator && <span className={styles.pipe}>|</span>}
      <Link
        href={href}
        prefetch={false}
        scroll={false}
        className={cn(styles.option, { [styles.active]: active })}
        aria-current={active ? 'page' : undefined}
      >
        {children}
      </Link>
    </span>
  );
}
