'use client';

import cn from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { buildIndexRoutePath } from '@/helpers/indexRoute';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

import { useIndexPending } from '@/components/providers/indexPendingProvider';
import IconEnter from '@/components/ui/icons/enter';
import IconForwardSlash from '@/components/ui/icons/forwardSlash';

import styles from './index.module.css';

export default function SearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const { pageContext, searchQuery, startPending } = useIndexPending();

  const input = useRef<HTMLInputElement>(null);
  const shouldRestoreFocus = useRef(false);
  const [value, setValue] = useState(searchQuery);

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  useKeyboardShortcut({
    '/': event => {
      event.preventDefault();
      input.current?.focus();
      input.current?.select();
    },
  });

  function onSubmit(event: ChangeEvent) {
    event.preventDefault();
    submitSearch(value);
  }

  function submitSearch(value: string) {
    shouldRestoreFocus.current = document.activeElement === input.current;
    const nextPath = buildIndexRoutePath(pageContext, value);

    if (nextPath === pathname) {
      return;
    }

    startPending(nextPath, pageContext, value.trim());
    router.replace(nextPath, { scroll: false });
  }

  return (
    <form onSubmit={onSubmit} className={styles.container}>
      <input
        name="search"
        type="search"
        placeholder="search"
        value={value}
        className={styles.input}
        ref={element => {
          input.current = element;

          if (element && shouldRestoreFocus.current) {
            element.focus();
            shouldRestoreFocus.current = false;
          }
        }}
        onChange={event => setValue(event.currentTarget.value)}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            event.preventDefault();
            submitSearch(event.currentTarget.value);
          }
        }}
      />
      <IconEnter className={cn(styles.shortcut, styles.inFocus)} />
      <IconForwardSlash className={cn(styles.shortcut, styles.outOfFocus)} />
    </form>
  );
}
