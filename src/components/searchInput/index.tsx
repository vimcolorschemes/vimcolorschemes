'use client';

import cn from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';

import IconEnter from '@/components/ui/icons/enter';
import IconForwardSlash from '@/components/ui/icons/forwardSlash';

import styles from './index.module.css';

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(2));

  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>(pageContext.filter.search || '');

  useKeyboardShortcut({
    '/': event => {
      event.preventDefault();
      input.current?.focus();
      input.current?.select();
    },
  });

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    search(value);
  }

  function search(value: string) {
    delete pageContext.filter.search;
    delete pageContext.filter.page;
    const url = FilterHelper.getURLFromFilter({
      ...pageContext.filter,
      ...(value ? { search: value } : {}),
    });
    router.replace(`/i/${pageContext.sort}/${url}`);
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
            search(value);
          }
        }}
      />
      <IconEnter className={cn(styles.shortcut, styles.inFocus)} />
      <IconForwardSlash className={cn(styles.shortcut, styles.outOfFocus)} />
    </form>
  );
}
