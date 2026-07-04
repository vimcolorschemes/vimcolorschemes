'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';

import { RepositorySearchManifestClient } from '@/services/repositorySearchManifestClient';

import styles from './index.module.css';

export default function SearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';

  function preloadManifest() {
    void RepositorySearchManifestClient.loadRepositorySearchManifest();
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextSearchParams = new URLSearchParams();
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
        defaultValue={query}
        key={query}
        name="q"
        type="search"
        onChange={preloadManifest}
        onFocus={preloadManifest}
      />
      <button
        aria-label="Submit repository search"
        className={styles.searchSubmit}
        type="submit"
      >
        ↵
      </button>
    </form>
  );
}
