'use client';

import { usePathname } from 'next/navigation';

import Backgrounds from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';

import { getIndexRouteState } from '@/helpers/indexRoute';
import PageContextHelper from '@/helpers/pageContext';

import { useIndexNavigation } from '@/components/providers/indexNavigationProvider';
import Radio from '@/components/ui/radio';

export default function BackgroundInput() {
  const pathname = usePathname();
  const { navigateToIndex } = useIndexNavigation();
  const routeState = getIndexRouteState(pathname);
  const pageContext = PageContextHelper.get(routeState.filters);

  function onChange(background?: BackgroundFilter) {
    navigateToIndex(
      {
        sort: pageContext.sort,
        filter: {
          ...pageContext.filter,
          background,
        },
      },
      routeState.search,
    );
  }

  return (
    <Radio<BackgroundFilter>
      name="background"
      value={pageContext.filter.background}
      onChange={onChange}
      options={[
        { value: undefined, label: 'any' },
        { value: Backgrounds.Dark, label: 'dark' },
        { value: Backgrounds.Light, label: 'light' },
        { value: 'both', label: 'both' },
      ]}
    />
  );
}
