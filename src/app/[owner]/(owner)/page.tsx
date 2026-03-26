import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { OwnersService } from '@/services/owner';
import { RepositoriesService } from '@/services/repositoriesServer';

import { SortOptions } from '@/lib/sort';

import OwnerPageHeader from '@/components/ownerPageHeader';
import OwnerTitle from '@/components/ownerTitle';
import Repositories from '@/components/repositories';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

import styles from './page.module.css';

export const dynamicParams = false;

export async function generateStaticParams() {
  const repositories = await RepositoriesService.getAllRepositories();
  const owners = new Set(
    repositories.map(repo => repo.owner.name.toLowerCase()),
  );
  return Array.from(owners).map(owner => ({ owner }));
}

type OwnerPageProps = { params: Promise<{ owner: string }> };

export async function generateMetadata({
  params,
}: OwnerPageProps): Promise<Metadata> {
  const { owner: ownerParam } = await params;
  const owner = await OwnersService.getOwner(ownerParam);

  if (!owner) {
    return { title: 'artist not found | artists' };
  }

  return { title: `${owner.name} | artists` };
}

export default async function OwnerPage({ params }: OwnerPageProps) {
  const { owner: ownerParam } = await params;
  const owner = await OwnersService.getOwner(ownerParam);
  if (!owner) {
    notFound();
  }
  return (
    <>
      <OwnerPageHeader owner={owner} />
      <OwnerTitle owner={owner} as="h1" className={styles.owner} />
      <Suspense fallback={<RepositoriesSkeleton />}>
        <Repositories
          pageContext={{
            filter: { owner: owner.name },
            sort: SortOptions.Trending,
          }}
        />
      </Suspense>
    </>
  );
}
