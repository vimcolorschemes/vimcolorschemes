'use client';

import cn from 'classnames';
import { usePathname } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

import { getIndexRouteState } from '@/helpers/indexRoute';
import PageContextHelper from '@/helpers/pageContext';

import { useSearchNavigation } from '@/components/providers/searchNavigationProvider';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

import IconEnter from '@/components/ui/icons/enter';
import IconForwardSlash from '@/components/ui/icons/forwardSlash';

import styles from './index.module.css';

export default function SearchInput() {
  const pathname = usePathname();
  const { navigateToSearch } = useSearchNavigation();
  const routeState = getIndexRouteState(pathname);
  const pageContext = PageContextHelper.get(routeState.filters);
  const searchQuery = routeState.search;

  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>(searchQuery);

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

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    submitSearch(value);
  }

  function submitSearch(value: string) {
    navigateToSearch(pageContext, value);
  }

  return (
    <form onSubmit={onSubmit} className={styles.container}>
      <input
        name="search"
        type="search"
        placeholder="search"
        value={value}
        onChange={event => setValue(event.target.value)}
        className={styles.input}
        ref={input}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            event.preventDefault();
            submitSearch(value);
          }
        }}
      />
      <IconEnter className={cn(styles.shortcut, styles.inFocus)} />
      <IconForwardSlash className={cn(styles.shortcut, styles.outOfFocus)} />
    </form>
  );
}
