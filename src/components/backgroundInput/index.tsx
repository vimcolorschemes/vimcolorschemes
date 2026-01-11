'use client';

import { usePathname, useRouter } from 'next/navigation';

import Backgrounds, { Background } from '@/lib/backgrounds';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import Radio from '@/components/ui/radio';

export default function BackgroundInput() {
  const router = useRouter();
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(2));

  function onChange(background?: Background) {
    const filterUrl = FilterHelper.getURLFromFilter({
      ...pageContext.filter,
      page: undefined,
      background,
    });
    router.push(`/i/${pageContext.sort}/${filterUrl}`);
  }

  return (
    <Radio<Background>
      name="background"
      value={pageContext.filter.background}
      onChange={onChange}
      options={[
        { value: undefined, label: 'all' },
        { value: Backgrounds.Dark, label: 'dark' },
        { value: Backgrounds.Light, label: 'light' },
      ]}
    />
  );
}
