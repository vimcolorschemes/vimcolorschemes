'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Backgrounds from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import Radio from '@/components/ui/radio';

export default function BackgroundInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(2));
  const search = searchParams.get('search') ?? '';

  function onChange(background?: BackgroundFilter) {
    const filterUrl = FilterHelper.getURLFromFilter({
      ...pageContext.filter,
      background,
    });

    const nextPath = `/i/${pageContext.sort}/${filterUrl}`;
    const params = new URLSearchParams();

    if (search) {
      params.set('search', search);
    }

    const nextUrl = params.size > 0 ? `${nextPath}?${params}` : nextPath;
    router.push(nextUrl);
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
