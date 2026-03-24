'use client';

import cn from 'classnames';
import { usePathname } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';

import PageContextHelper from '@/helpers/pageContext';

import { useSearch } from '@/context/searchContext';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

import IconEnter from '@/components/ui/icons/enter';
import IconForwardSlash from '@/components/ui/icons/forwardSlash';

import styles from './index.module.css';

export default function SearchInput() {
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(2));
  const { search, clearSearch } = useSearch();

  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>('');

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
    if (value.trim()) {
      search(value, pageContext.sort, pageContext.filter.background);
    } else {
      clearSearch();
    }
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
