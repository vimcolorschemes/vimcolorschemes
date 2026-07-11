'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useId } from 'react';

import { RepositorySearchManifestClient } from '@/services/repositorySearchManifestClient';

import styles from './index.module.css';

export default function SearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const inputId = useId();

  function preloadManifest() {
    void RepositorySearchManifestClient.loadRepositorySearchManifest().catch(
      () => undefined,
    );
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
    <form
      action={pathname}
      className={styles.tuiControl}
      method="get"
      role="search"
      onSubmit={submitSearch}
    >
      <label className={styles.tuiLabel} htmlFor={inputId}>
        search<span className={styles.visuallyHidden}> repositories</span>
      </label>
      <span className={styles.searchForm}>
        <input
          aria-label="Search repositories"
          className={styles.searchInput}
          defaultValue={query}
          id={inputId}
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
      </span>
    </form>
  );
}
