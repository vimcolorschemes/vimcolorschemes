'use client';

import cn from 'classnames';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import IconEnter from '@/components/ui/icons/enter';
import IconForwardSlash from '@/components/ui/icons/forwardSlash';

import styles from './index.module.css';

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(1));

  const [value, setValue] = useState<string>(pageContext.filter.search || '');

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
    router.replace(`/${pageContext.sort}/${url}`);
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
      />
      <IconEnter className={cn(styles.shortcut, styles.inFocus)} />
      <IconForwardSlash className={cn(styles.shortcut, styles.outOfFocus)} />
    </form>
  );
}
