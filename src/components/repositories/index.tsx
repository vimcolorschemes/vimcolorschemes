import { Suspense } from 'react';

import { RepositoriesService } from '@/services/repositoriesServer';

import { RepositoryDTO } from '@/models/DTO/repository';

import type { PageContext } from '@/lib/pageContext';

import RepositoriesContent from '@/components/repositories/content';
import RepositoriesGridSkeleton from '@/components/repositories/grid/skeleton';
import LoadMore from '@/components/repositories/loadMore';
import Skeleton from '@/components/ui/skeleton';

import styles from './index.module.css';

type RepositoriesProps = {
  pageContext: PageContext;
};

function buildTitle(filter: PageContext['filter']): string {
  if (!filter.background && !filter.owner) {
    return 'All';
  }

  const parts: string[] = [];

  if (filter.background) {
    if (filter.background === 'both') {
      parts.push('with light and dark background');
    } else {
      parts.push(`with ${filter.background} background`);
    }
  }

  if (filter.owner) {
    parts.push(`${filter.owner}'s work`);
  }

  return parts.join(' ');
}

export default function Repositories({ pageContext }: RepositoriesProps) {
  const title = buildTitle(pageContext.filter);
  const repositoriesPromise =
    RepositoriesService.getRepositoryDTOs(pageContext);
  const initialRepositoriesPromise: Promise<RepositoryDTO[]> =
    repositoriesPromise;
  const countPromise = RepositoriesService.getRepositoryCount(
    pageContext.filter,
  );
  return (
    <section className={styles.container} aria-labelledby="repositories-title">
      <Suspense fallback={<RepositoriesHeaderFallback title={title} />}>
        <RepositoriesHeader countPromise={countPromise} title={title} />
      </Suspense>
      <Suspense fallback={<RepositoriesGridSkeleton />}>
        <RepositoriesContent
          repositoriesPromise={repositoriesPromise}
          pageContext={pageContext}
        />
      </Suspense>
      <Suspense>
        <LoadMore
          pageContext={pageContext}
          initialRepositoriesPromise={initialRepositoriesPromise}
          countPromise={countPromise}
        />
      </Suspense>
    </section>
  );
}

function RepositoriesHeaderFallback({ title }: { title: string }) {
  return (
    <div className={styles.header}>
      <h2 id="repositories-title" className={styles.title}>
        {title}
        <Skeleton inline className={styles.countSkeleton} />
      </h2>
    </div>
  );
}

async function RepositoriesHeader({
  countPromise,
  title,
}: {
  countPromise: Promise<number>;
  title: string;
}) {
  const count = await countPromise;

  return (
    <div className={styles.header}>
      <h2 id="repositories-title" className={styles.title}>
        {title}
        <span className={styles.count}>
          {count} repositor{count === 1 ? 'y' : 'ies'}
        </span>
      </h2>
    </div>
  );
}
