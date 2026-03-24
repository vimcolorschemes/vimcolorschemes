import { NextRequest, NextResponse } from 'next/server';

import RepositoriesService from '@/services/repositoriesServer';

import type Filter from '@/lib/filter';
import type { BackgroundFilter } from '@/lib/filter';
import { SortOptions } from '@/lib/sort';
import type Sort from '@/lib/sort';

const sortOptions = new Set<string>(Object.values(SortOptions));

function getSort(sortParam: string | null): Sort {
  if (!sortParam || !sortOptions.has(sortParam)) {
    return SortOptions.Trending;
  }

  return sortParam as Sort;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const sort = getSort(searchParams.get('sort'));

  const filter: Filter = {};

  const background = searchParams.get('background');
  if (
    background === 'dark' ||
    background === 'light' ||
    background === 'both'
  ) {
    filter.background = background as BackgroundFilter;
  }

  const page = parseInt(searchParams.get('page') || '1', 10);
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
  }
  filter.page = page;

  const search = searchParams.get('search');
  if (search) {
    filter.search = search;
  }

  const owner = searchParams.get('owner');
  if (owner) {
    filter.owner = owner;
  }

  const [repositories, count] = await Promise.all([
    RepositoriesService.getRepositories({ sort, filter }),
    RepositoriesService.getRepositoryCount(filter),
  ]);

  return NextResponse.json({
    repositories: repositories.map(repo => repo.dto),
    count,
  });
}
