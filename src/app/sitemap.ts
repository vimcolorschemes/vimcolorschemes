import { MetadataRoute } from 'next';

import { RepositoriesService } from '@/services/repositoriesServer';

import { Backgrounds } from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';
import { SortOptions } from '@/lib/sort';

import { FilterHelper } from '@/helpers/filter';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const indexURLs = [];
  const backgrounds: Array<BackgroundFilter | undefined> = [
    undefined,
    'both',
    ...Object.values(Backgrounds),
  ];
  for (const sortOption of Object.values(SortOptions)) {
    for (const background of backgrounds) {
      indexURLs.push({
        url: `${process.env.APP_URL}/i/${sortOption}/${FilterHelper.getURLFromFilter({ background })}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      });
    }
  }

  const keys = await RepositoriesService.getAllRepositoryKeys();
  const repositoryURLs = keys.map(k => ({
    url: `${process.env.APP_URL}/${k.ownerName}/${k.name}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: `${process.env.APP_URL}/about`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    ...indexURLs,
    ...repositoryURLs,
  ];
}
