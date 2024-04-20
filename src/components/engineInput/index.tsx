'use client';

import { usePathname, useRouter } from 'next/navigation';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';
import Engines, { Engine } from '@/lib/engines';

import Radio from '@/components/ui/radio';

export default function EngineInput() {
  const router = useRouter();
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(1));

  function onChange(engine?: Engine) {
    delete pageContext.filter.engine;
    const url = FilterHelper.getURLFromFilter({
      ...pageContext.filter,
      engine,
    });
    router.push(`/${pageContext.sort}/${url}`);
  }

  return (
    <Radio
      name="engine"
      value={pageContext.filter.engine}
      onChange={onChange}
      options={[
        { value: undefined, label: 'all' },
        ...Object.values(Engines).map(engine => ({
          value: engine,
          label: engine,
        })),
      ]}
    />
  );
}
