'use client';

import cn from 'classnames';
import Link from 'next/link';
import {
  FocusEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

import styles from './index.module.css';

type CommandMenuOption = {
  active: boolean;
  href: string;
  label: string;
};

type CommandMenuProps = {
  className?: string;
  id: string;
  interactive: boolean;
  label: string;
  options: CommandMenuOption[];
  prefix?: ReactNode;
  preservedQuery?: string;
  selected: string;
  shortcutKey: string;
};

type OpenMode = 'closed' | 'hover' | 'persistent';

export default function CommandMenu({
  className,
  id,
  interactive,
  label,
  options,
  prefix,
  preservedQuery,
  selected,
  shortcutKey,
}: CommandMenuProps) {
  const [openMode, setOpenMode] = useState<OpenMode>('closed');
  const menuRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const focusOnOpenRef = useRef<number | null>(null);
  const open = openMode !== 'closed';
  const menuId = `${id}-menu`;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenMode('closed');
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  useKeyboardShortcut(
    interactive
      ? {
          [shortcutKey]: event => {
            event.preventDefault();
            openAndFocus(getSelectedIndex());
          },
        }
      : {},
  );

  if (!interactive) {
    return (
      <span className={className}>
        {prefix}
        <span className={cn(styles.option, styles.active)}>{selected}</span>
      </span>
    );
  }

  function handleTriggerClick() {
    if (openMode === 'persistent') {
      setOpenMode('closed');
      return;
    }

    openAndFocus(getSelectedIndex());
  }

  function handlePointerEnter(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse' && openMode === 'closed') {
      setOpenMode('hover');
    }
  }

  function handlePointerLeave(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse' && openMode === 'hover') {
      setOpenMode('closed');
    }
  }

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  function getSelectedIndex() {
    const selectedIndex = options.findIndex(option => option.active);
    return selectedIndex < 0 ? 0 : selectedIndex;
  }

  function getRelativeSelectedIndex(offset: number) {
    return (getSelectedIndex() + offset + options.length) % options.length;
  }

  function setOptionRef(index: number, element: HTMLAnchorElement | null) {
    optionRefs.current[index] = element;

    if (element && focusOnOpenRef.current === index) {
      element.focus();
      focusOnOpenRef.current = null;
    }
  }

  function openAndFocus(index: number) {
    if (open) {
      setOpenMode('persistent');
      focusOption(index);
      return;
    }

    focusOnOpenRef.current = index;
    setOpenMode('persistent');
  }

  function closeAndRestoreFocus() {
    setOpenMode('closed');
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      const offset =
        event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
      openAndFocus(getRelativeSelectedIndex(offset));
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAndRestoreFocus();
      return;
    }

    if (event.key === 'Tab') {
      setOpenMode('closed');
      return;
    }

    const currentIndex = optionRefs.current.findIndex(
      option => option === event.target,
    );

    if (currentIndex < 0) {
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
      optionRefs.current[currentIndex]?.click();
      return;
    }

    let nextIndex: number | undefined;

    switch (event.key) {
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % options.length;
        break;
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + options.length) % options.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = options.length - 1;
        break;
      default:
        if (
          event.key.length === 1 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          const search = event.key.toLocaleLowerCase();

          for (let offset = 1; offset <= options.length; offset += 1) {
            const candidateIndex = (currentIndex + offset) % options.length;

            if (
              options[candidateIndex].label
                .toLocaleLowerCase()
                .startsWith(search)
            ) {
              nextIndex = candidateIndex;
              break;
            }
          }
        }
    }

    if (nextIndex !== undefined) {
      event.preventDefault();
      focusOption(nextIndex);
    }
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpenMode('closed');
    }
  }

  function handleOptionClick() {
    closeAndRestoreFocus();
  }

  function getOptionHref(href: string): string {
    if (!preservedQuery) {
      return href;
    }

    const params = new URLSearchParams({ q: preservedQuery });
    return `${href}?${params}`;
  }

  return (
    <span
      ref={menuRef}
      className={cn(className, styles.menu, {
        [styles.open]: open,
      })}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleMenuKeyDown}
      onBlur={handleBlur}
    >
      {prefix}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={cn(styles.option, styles.active)}
        aria-label={`${label}, current: ${selected}`}
        aria-keyshortcuts={shortcutKey}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        {selected}
      </button>
      {open && (
        <span
          id={menuId}
          className={styles.menuList}
          role="menu"
          aria-labelledby={id}
        >
          {options.map((option, index) => (
            <Link
              key={option.label}
              ref={element => setOptionRef(index, element)}
              href={getOptionHref(option.href)}
              prefetch={false}
              scroll={false}
              role="menuitem"
              tabIndex={-1}
              className={cn(styles.option, styles.menuOption, {
                [styles.active]: option.active,
              })}
              aria-current={option.active ? 'page' : undefined}
              onClick={handleOptionClick}
            >
              {option.label}
            </Link>
          ))}
        </span>
      )}
    </span>
  );
}
