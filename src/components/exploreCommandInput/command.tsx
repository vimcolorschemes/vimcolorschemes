import { useId } from 'react';

import { Backgrounds } from '@/lib/backgrounds';
import type { BackgroundFilter } from '@/lib/filter';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

import HomeCommand from '@/components/homeCommand';

import CommandMenu from './commandMenu';
import styles from './index.module.css';
import SearchInput from './searchInput';

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
  searchQuery?: string;
};

export default function ExploreCommand({
  interactive = true,
  pageContext,
  searchQuery,
}: ExploreCommandProps) {
  const orderId = useId();
  const backgroundId = useId();

  const commandLead = (
    <span className={styles.shellLine}>
      <HomeCommand
        interactive={interactive}
        className={styles.homeCommand}
        classNames={{
          command: styles.command,
          operator: styles.operator,
          prompt: styles.prompt,
        }}
      />
      <span className={styles.subcommand}>explore</span>
    </span>
  );

  const searchControl = interactive ? (
    <SearchInput />
  ) : (
    <span className={styles.tuiControl}>
      <span className={styles.tuiLabel}>search</span>
      <span className={styles.searchInput} aria-hidden="true" />
    </span>
  );

  const orderControl = (
    <CommandMenu
      className={styles.tuiControl}
      prefix={
        interactive ? (
          <label className={styles.tuiLabel} htmlFor={orderId}>
            order
          </label>
        ) : (
          <span className={styles.tuiLabel}>order</span>
        )
      }
      id={orderId}
      label="Order repositories"
      interactive={interactive}
      preservedQuery={searchQuery}
      selected={pageContext.sort}
      options={sortOptions.map(option => ({
        href: buildIndexRoutePath({
          sort: option,
          filter: pageContext.filter,
        }),
        label: option,
        active: pageContext.sort === option,
      }))}
    />
  );

  const backgroundControl = (
    <CommandMenu
      className={styles.tuiControl}
      prefix={
        interactive ? (
          <label className={styles.tuiLabel} htmlFor={backgroundId}>
            background
          </label>
        ) : (
          <span className={styles.tuiLabel}>background</span>
        )
      }
      id={backgroundId}
      label="Filter by background"
      interactive={interactive}
      preservedQuery={searchQuery}
      selected={
        backgroundOptions.find(
          option => option.value === pageContext.filter.background,
        )?.label ?? 'any'
      }
      options={backgroundOptions.map(option => ({
        href: buildIndexRoutePath({
          sort: pageContext.sort,
          filter: {
            ...pageContext.filter,
            background: option.value,
          },
        }),
        label: option.label,
        active: pageContext.filter.background === option.value,
      }))}
    />
  );

  return (
    <section
      className={styles.container}
      aria-hidden={interactive ? undefined : true}
      aria-label={interactive ? 'Explore color schemes' : undefined}
    >
      {commandLead}
      <div className={styles.filterPanel}>
        {searchControl}
        <span className={styles.filterGroup}>
          {orderControl}
          {backgroundControl}
        </span>
      </div>
    </section>
  );
}
