'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useEffect, useId, useState } from 'react';

import { RepositorySearchManifestClient } from '@/services/repositorySearchManifestClient';

import { TuiLoadingInline } from '@/components/ui/tuiLoading';

import styles from './index.module.css';

const MINIMUM_SEARCH_FEEDBACK_MS = 250;
const MAXIMUM_SEARCH_FEEDBACK_MS = 10_000;

export default function SearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const inputId = useId();
  const currentSearch = searchParams.toString();
  const currentURL = currentSearch ? `${pathname}?${currentSearch}` : pathname;
  const [pendingSearch, setPendingSearch] = useState<{
    startedAt: number;
    url: string;
  } | null>(null);
  const isSearching = pendingSearch !== null;

  useEffect(() => {
    if (!pendingSearch) {
      return;
    }

    const navigationFinished = currentURL === pendingSearch.url;
    const feedbackDuration = navigationFinished
      ? MINIMUM_SEARCH_FEEDBACK_MS
      : MAXIMUM_SEARCH_FEEDBACK_MS;
    const remainingDuration = Math.max(
      0,
      feedbackDuration - (Date.now() - pendingSearch.startedAt),
    );
    const timeout = window.setTimeout(() => {
      setPendingSearch(currentSearch =>
        currentSearch === pendingSearch ? null : currentSearch,
      );
    }, remainingDuration);

    return () => window.clearTimeout(timeout);
  }, [currentURL, pendingSearch]);

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
    const nextURL = search ? `${pathname}?${search}` : pathname;

    setPendingSearch({ startedAt: Date.now(), url: nextURL });
    router.replace(nextURL, {
      scroll: false,
    });
  }

  return (
    <>
      <form
        action={pathname}
        className={styles.tuiControl}
        method="get"
        role="search"
        aria-busy={isSearching}
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
            disabled={isSearching}
            type="submit"
          >
            {isSearching ? (
              <TuiLoadingInline
                announce={false}
                className={styles.searchSubmitLoading}
              />
            ) : (
              '↵'
            )}
          </button>
        </span>
      </form>
      <span
        aria-atomic="true"
        aria-live="polite"
        className={styles.visuallyHidden}
        role="status"
      >
        {isSearching ? 'searching repositories' : ''}
      </span>
    </>
  );
}
