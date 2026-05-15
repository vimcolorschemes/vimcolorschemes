import { permanentRedirect } from 'next/navigation';

import { RepositoriesService } from '@/services/repositoriesServer';

export const dynamicParams = false;

export async function generateStaticParams() {
  const keys = await RepositoriesService.getAllRepositoryKeys();
  return keys.map(k => ({
    owner: k.ownerName.toLowerCase(),
    name: k.name.toLowerCase(),
  }));
}

type LegacyRepositoryRouteProps = {
  params: Promise<{ owner: string; name: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSearch(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else {
      params.set(key, value);
    }
  }

  const search = params.toString();
  return search ? `?${search}` : '';
}

export default async function LegacyRepositoryRoute({
  params,
  searchParams,
}: LegacyRepositoryRouteProps) {
  const { owner, name } = await params;
  const search = getSearch(await searchParams);

  permanentRedirect(`/r/${owner}/${name}${search}`);
}
