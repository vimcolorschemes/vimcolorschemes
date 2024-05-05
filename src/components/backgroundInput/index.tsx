'use client';

import { usePathname, useRouter } from 'next/navigation';

import Backgrounds, { Background } from '@/lib/backgrounds';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import Radio from '@/components/ui/radio';

export default function BackgroundInput() {
  const router = useRouter();
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(1));

  function onChange(background?: Background) {
    delete pageContext.filter.background;
    delete pageContext.filter.page;
    const url = FilterHelper.getURLFromFilter({
      ...pageContext.filter,
      background,
    });
    router.push(`/${pageContext.sort}/${url}`);
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
