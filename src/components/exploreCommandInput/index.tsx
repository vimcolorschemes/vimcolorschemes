'use client';

import { usePathname } from 'next/navigation';

import { PageContextHelper } from '@/helpers/pageContext';

import ExploreCommand from './command';

function getFiltersFromPathname(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);
  const indexRouteStart = segments.indexOf('i');

  return indexRouteStart === -1
    ? segments
    : segments.slice(indexRouteStart + 1);
}

export default function ExploreCommandInput() {
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(getFiltersFromPathname(pathname));

  return <ExploreCommand pageContext={pageContext} />;
}
