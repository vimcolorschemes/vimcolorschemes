'use client';

import cn from 'classnames';
import { usePathname } from 'next/navigation';
import { ChangeEvent, useRef } from 'react';

import { getIndexRouteState } from '@/helpers/indexRoute';
import PageContextHelper from '@/helpers/pageContext';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

import { useIndexNavigation } from '@/components/providers/indexNavigationProvider';
import IconEnter from '@/components/ui/icons/enter';
import IconForwardSlash from '@/components/ui/icons/forwardSlash';

import styles from './index.module.css';

export default function SearchInput() {
  const pathname = usePathname();
  const { navigateToIndex } = useIndexNavigation();
  const routeState = getIndexRouteState(pathname);
  const pageContext = PageContextHelper.get(routeState.filters);
  const searchQuery = routeState.search;

  const input = useRef<HTMLInputElement>(null);
  const shouldRestoreFocus = useRef(false);

  useKeyboardShortcut({
    '/': event => {
      event.preventDefault();
      input.current?.focus();
      input.current?.select();
    },
  });

  function onSubmit(event: ChangeEvent) {
    event.preventDefault();
    submitSearch(input.current?.value ?? '');
  }

  function submitSearch(value: string) {
    shouldRestoreFocus.current = document.activeElement === input.current;
    navigateToIndex(pageContext, value);
  }

  return (
    <form onSubmit={onSubmit} className={styles.container}>
      <input
        key={searchQuery}
        name="search"
        type="search"
        placeholder="search"
        defaultValue={searchQuery}
        className={styles.input}
        ref={element => {
          input.current = element;

          if (element && shouldRestoreFocus.current) {
            element.focus();
            shouldRestoreFocus.current = false;
          }
        }}
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
