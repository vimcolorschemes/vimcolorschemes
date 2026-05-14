'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import type { PageContext } from '@/lib/pageContext';

import { PageContextHelper } from '@/helpers/pageContext';

import ExploreCommand from './command';

type ExploreCommandInputProps = {
  fallbackPageContext: PageContext;
};

function getFiltersFromPathname(pathname: string): string[] | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const indexRouteStart = segments.indexOf('i');

  if (indexRouteStart === -1) {
    return undefined;
  }

  return segments.slice(indexRouteStart + 1);
}

export default function ExploreCommandInput({
  fallbackPageContext,
}: ExploreCommandInputProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = getFiltersFromPathname(pathname);
  const pageContext = filters?.length
    ? PageContextHelper.get(filters)
    : filters
      ? PageContextHelper.getFromSearchParams(searchParams)
      : fallbackPageContext;

  return <ExploreCommand pageContext={pageContext} />;
}
