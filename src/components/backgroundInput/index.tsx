'use client';

import { usePathname, useRouter } from 'next/navigation';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';
import Backgrounds, { Background } from '@/lib/backgrounds';

import Radio from '@/components/ui/radio';

export default function BackgroundInput() {
  const router = useRouter();
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(1));

  function onChange(background?: Background) {
    delete pageContext.filter.background;
    const url = FilterHelper.getURLFromFilter({
      ...pageContext.filter,
      background,
    });
    router.push(`/${pageContext.sort}/${url}`);
  }

  return (
    <Radio
      name="background"
      value={pageContext.filter.background}
      onChange={onChange}
      options={[
        { value: undefined, label: 'all' },
        ...Object.values(Backgrounds).map(background => ({
          value: background,
          label: background,
        })),
      ]}
    />
  );
}
