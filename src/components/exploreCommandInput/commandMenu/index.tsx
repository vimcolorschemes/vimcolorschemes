'use client';

import cn from 'classnames';
import Link from 'next/link';
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';

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
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  if (!interactive) {
    return <span className={cn(styles.option, styles.active)}>{selected}</span>;
  }

  function handleSummaryClick(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    setOpen(currentOpen => !currentOpen);
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  function handleSummaryKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(currentOpen => !currentOpen);
    }
  }

  return (
    <details
      ref={menuRef}
      className={cn(styles.menu, { [styles.open]: open })}
      open={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={handleMenuKeyDown}
    >
      <summary
        className={cn(styles.option, styles.active)}
        aria-label={label}
        aria-expanded={open}
        onClick={handleSummaryClick}
        onKeyDown={handleSummaryKeyDown}
      >
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
