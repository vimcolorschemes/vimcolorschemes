'use client';

import cn from 'classnames';
import Link from 'next/link';
import {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

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
  const menuRef = useRef<HTMLSpanElement>(null);

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

  function handleTriggerClick() {
    setOpen(currentOpen => !currentOpen);
  }

  function handlePointerEnter(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse') {
      setOpen(true);
    }
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse') {
      setOpen(false);
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <span
      ref={menuRef}
      className={cn(styles.menu, { [styles.open]: open })}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleMenuKeyDown}
    >
      <button
        type="button"
        className={cn(styles.option, styles.active)}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={handleTriggerClick}
      >
        {selected}
      </button>
      <span className={styles.menuList} role="group" aria-label={label}>
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
          >
            {option.label}
          </Link>
        ))}
      </span>
    </span>
  );
}
