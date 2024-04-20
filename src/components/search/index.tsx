'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

import FilterHelper from '@/helpers/filter';
import URLHelper from '@/helpers/url';

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState('');
  const [sortOption, ...filters] = pathname.split('/').filter(Boolean);

  const filter = useMemo(
    () => FilterHelper.getFilterFromURL(filters),
    [filters],
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const url = FilterHelper.getURLFromFilter({
      ...filter,
      search: URLHelper.encode(search),
    });
    router.push(`${sortOption}/${url}`);
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="search"
        placeholder="Search"
        value={search}
        onChange={event => setSearch(event.target.value)}
      />
    </form>
  );
}
