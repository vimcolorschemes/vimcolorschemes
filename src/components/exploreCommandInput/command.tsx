import { Backgrounds } from '@/lib/backgrounds';
import type { BackgroundFilter } from '@/lib/filter';
import type { PageContext } from '@/lib/pageContext';
import { SortOptions } from '@/lib/sort';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

import HomeCommand from '@/components/homeCommand';

import CommandMenu from './commandMenu';
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
      <span className={styles.commandLead}>
        <HomeCommand
          interactive={interactive}
          className={styles.homeCommand}
          classNames={{
            command: styles.command,
            operator: styles.operator,
            prompt: styles.prompt,
          }}
        />
        <span className={styles.subcommand}>list</span>
      </span>
      <span className={styles.commandLine}>
        {' '}
        <span className={styles.argument}>
          <span className={styles.flag}>
            <span className={styles.fullFlag}>--sort</span>
            <span className={styles.shortFlag}>-s</span>
          </span>{' '}
          <CommandMenu
            label="Sort repositories"
            interactive={interactive}
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
        </span>{' '}
        <span className={styles.argument}>
          <span className={styles.flag}>
            <span className={styles.fullFlag}>--background</span>
            <span className={styles.shortFlag}>-b</span>
          </span>{' '}
          <CommandMenu
            label="Filter by background"
            interactive={interactive}
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
        </span>
      </span>
    </div>
  );
}
