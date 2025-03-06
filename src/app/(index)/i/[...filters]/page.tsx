import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import Sort, { SortOptions } from '@/lib/sort';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import RepositoryGrid from '@/components/repositories';

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

  return <RepositoryGrid pageContext={pageContext} />;
}
