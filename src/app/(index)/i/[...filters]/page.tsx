import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import Backgrounds from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';
import Sort, { SortOptions } from '@/lib/sort';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import Repositories from '@/components/repositories';

export const dynamicParams = false;

export function generateStaticParams() {
  const sorts = Object.values(SortOptions);
  const backgrounds: (BackgroundFilter | undefined)[] = [
    undefined,
    Backgrounds.Dark,
    Backgrounds.Light,
    'both',
  ];

  return sorts.flatMap(sort =>
    backgrounds.map(background => {
      const filterURL = FilterHelper.getURLFromFilter(
        background ? { background } : {},
      );
      const filters = filterURL ? [sort, filterURL] : [sort];
      return { filters };
    }),
  );
}

type IndexPageProps = { params: Promise<{ filters: string[] }> };

export async function generateMetadata({
  params,
}: IndexPageProps): Promise<Metadata> {
  const { filters } = await params;
  const pageContext = PageContextHelper.get(filters);
  return { title: PageContextHelper.getPageTitle(pageContext) };
}

export default async function IndexPage({ params }: IndexPageProps) {
  const { filters } = await params;
  const [sort, ...rest] = filters as [Sort, ...string[]];
  const pageContext = PageContextHelper.get(filters);

  const validURL = FilterHelper.getURLFromFilter(pageContext.filter);

  if (!Object.values(SortOptions).includes(sort)) {
    redirect(`/i/${SortOptions.Trending}/${validURL}`);
  }

  if (validURL !== rest.join('/')) {
    redirect(`/i/${sort}/${validURL}`);
  }

  return <Repositories pageContext={pageContext} />;
}
