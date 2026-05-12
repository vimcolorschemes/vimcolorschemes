import cn from 'classnames';
import Link from 'next/link';

import styles from './index.module.css';

type CommandMenuOption = {
  active: boolean;
  href: string;
  label: string;
};

type CommandMenuProps = {
  interactive: boolean;
  label: string;
  options: CommandMenuOption[];
  selected: string;
};

export default function CommandMenu({
  interactive,
  label,
  options,
  selected,
}: CommandMenuProps) {
  if (!interactive) {
    return <span className={cn(styles.option, styles.active)}>{selected}</span>;
  }

  return (
    <details className={styles.menu}>
      <summary className={cn(styles.option, styles.active)} aria-label={label}>
        {selected}
        <span className={styles.disclosure} aria-hidden="true">
          ▾
        </span>
      </summary>
      <span className={styles.menuList} role="listbox" aria-label={label}>
        {options.map(option => (
          <Link
            key={option.label}
            href={option.href}
            prefetch={false}
            scroll={false}
            className={cn(styles.option, styles.menuOption, {
              [styles.active]: option.active,
            })}
            aria-current={option.active ? 'page' : undefined}
            role="option"
            aria-selected={option.active}
          >
            {option.label}
          </Link>
        ))}
      </span>
    </details>
  );
}
