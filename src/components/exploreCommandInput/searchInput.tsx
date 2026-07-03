'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { RepositorySearchManifestClient } from '@/services/repositorySearchManifestClient';

import styles from './index.module.css';

export default function SearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  function preloadManifest() {
    void RepositorySearchManifestClient.loadRepositorySearchManifest();
  }

  function updateSearchValue(event: ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.currentTarget.value);
    preloadManifest();
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextSearchParams = new URLSearchParams(searchParams);
    const trimmedValue = String(formData.get('q') ?? '').trim();

    if (trimmedValue) {
      nextSearchParams.set('q', trimmedValue);
    } else {
      nextSearchParams.delete('q');
    }

    const search = nextSearchParams.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }

  return (
    <form className={styles.searchForm} onSubmit={submitSearch}>
      <input
        aria-label="Search repositories"
        className={styles.searchInput}
        name="q"
        style={{ inlineSize: `${Math.max(searchValue.length, 1)}ch` }}
        type="search"
        value={searchValue}
        onChange={updateSearchValue}
        onFocus={preloadManifest}
      />
    </form>
  );
}
