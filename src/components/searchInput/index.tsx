'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(1));

  const [value, setValue] = useState<string>(pageContext.filter.search || '');

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    delete pageContext.filter.search;
    delete pageContext.filter.page;
    const url = FilterHelper.getURLFromFilter({
      ...pageContext.filter,
      ...(value ? { search: value } : {}),
    });
    router.push(`/${pageContext.sort}/${url}`);
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        name="search"
        type="search"
        placeholder="search"
        value={value}
        onChange={event => setValue(event.target.value)}
      />
    </form>
  );
}