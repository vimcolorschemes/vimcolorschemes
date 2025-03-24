import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import OwnersService from '@/services/owner';

import { SortOptions } from '@/lib/sort';

import OwnerPageHeader from '@/components/ownerPageHeader';
import OwnerTitle from '@/components/ownerTitle';
import Repositories from '@/components/repositories';
import RepositoriesSkeleton from '@/components/repositories/skeleton';

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
      <OwnerTitle owner={owner} />
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
