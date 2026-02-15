import { MetadataRoute } from 'next';

import RepositoriesService from '@/services/repositories';

import Backgrounds from '@/lib/backgrounds';
import { BackgroundFilter } from '@/lib/filter';
import { SortOptions } from '@/lib/sort';

import FilterHelper from '@/helpers/filter';

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

  const repositories = await RepositoriesService.getAllRepositories();
  const repositoryURLs = repositories.map(repository => ({
    url: `${process.env.APP_URL}/${repository.key}`,
    lastModified: repository.pushedAt,
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
