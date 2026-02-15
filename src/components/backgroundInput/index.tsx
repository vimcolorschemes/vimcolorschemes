'use client';

import { usePathname, useRouter } from 'next/navigation';

import Backgrounds from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import Radio from '@/components/ui/radio';

export default function BackgroundInput() {
  const router = useRouter();
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(2));

  function onChange(background?: BackgroundFilter) {
    const filterUrl = FilterHelper.getURLFromFilter({
      ...pageContext.filter,
      page: undefined,
      background,
    });
    router.push(`/i/${pageContext.sort}/${filterUrl}`);
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
