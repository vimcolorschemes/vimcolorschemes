import cn from 'classnames';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Backgrounds } from '@/lib/backgrounds';
import type { BackgroundFilter } from '@/lib/filter';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

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

type ExploreCommandProps = {
  interactive?: boolean;
  pageContext: PageContext;
};

export default function ExploreCommand({
  interactive = true,
  pageContext,
}: ExploreCommandProps) {
  return (
    <div
      className={styles.container}
      aria-hidden={interactive ? undefined : true}
      aria-label={interactive ? 'Explore color schemes' : undefined}
    >
      <Prompt interactive={interactive} />
      <span className={styles.commandLine}>
        <span className={styles.operator}>❯</span>
        <span className={styles.command}>explore</span>
        <span className={styles.argument}>
          <span className={styles.flag}>
            <span className={styles.fullFlag}>--sort</span>
            <span className={styles.shortFlag}>-s</span>
          </span>
          <span className={styles.group} aria-label="Sort repositories">
            {sortOptions.map((option, index) => (
              <CommandOption
                key={option}
                href={buildIndexRoutePath({
                  sort: option,
                  filter: pageContext.filter,
                })}
                active={pageContext.sort === option}
                interactive={interactive}
                separator={index > 0}
              >
                {option}
              </CommandOption>
            ))}
          </span>
        </span>
        <span className={styles.argument}>
          <span className={styles.flag}>
            <span className={styles.fullFlag}>--background</span>
            <span className={styles.shortFlag}>-b</span>
          </span>
          <span className={styles.group} aria-label="Filter by background">
            {backgroundOptions.map((option, index) => (
              <CommandOption
                key={option.label}
                href={buildIndexRoutePath({
                  sort: pageContext.sort,
                  filter: {
                    ...pageContext.filter,
                    background: option.value,
                  },
                })}
                active={pageContext.filter.background === option.value}
                interactive={interactive}
                separator={index > 0}
              >
                {option.label}
              </CommandOption>
            ))}
          </span>
        </span>
      </span>
    </div>
  );
}

function Prompt({ interactive }: { interactive: boolean }) {
  if (!interactive) {
    return <span className={styles.prompt}>~/vimcolorschemes</span>;
  }

  return (
    <Link href="/i/trending" prefetch={false} className={styles.prompt}>
      ~/vimcolorschemes
    </Link>
  );
}

function CommandOption({
  active,
  children,
  href,
  interactive,
  separator,
}: {
  active: boolean;
  children: ReactNode;
  href: string;
  interactive: boolean;
  separator: boolean;
}) {
  return (
    <span className={styles.segment}>
      {separator && <span className={styles.pipe}>|</span>}
      {interactive ? (
        <Link
          href={href}
          prefetch={false}
          scroll={false}
          className={cn(styles.option, { [styles.active]: active })}
          aria-current={active ? 'page' : undefined}
        >
          {children}
        </Link>
      ) : (
        <span className={cn(styles.option, { [styles.active]: active })}>
          {children}
        </span>
      )}
    </span>
  );
}
