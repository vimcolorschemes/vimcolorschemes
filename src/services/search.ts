import Background from '../lib/background';
import RequestHelper from '../helpers/request';
import { Repository, REPOSITORY_COUNT_PER_PAGE } from '../models/repository';
import { APIRepository } from '@/models/api';

interface StoreResult {
  count: number;
}

interface SearchProxyResult {
  repositories: APIRepository[];
  totalCount: number;
}

interface SearchResult {
  repositories: Repository[];
  totalCount: number;
  pageCount: number;
}

/**
 * Posts a search request to the repository search index and returns the result
 *
 * @param {string} query - The search input to match
 * @param {Background[]} backgrounds - The background filters to apply
 * @param {number} page - The search page
 *
 * @returns {SearchResult} The repositories, total count and page count matching the
 * search input
 */
async function search(
  query: string,
  backgrounds: Background[],
  page: number = 1,
): Promise<SearchResult> {
  if (!query) {
    return Promise.reject();
  }

  const result = await RequestHelper.get<SearchProxyResult>({
    url: process.env.GATSBY_SEARCH_INDEX_URL!,
    queryParams: {
      query,
      page,
      perPage: REPOSITORY_COUNT_PER_PAGE,
      backgrounds,
    },
  });

  if (!result) {
    return { repositories: [], totalCount: 0, pageCount: 1 };
  }

  const repositories = result.repositories.map(hit => new Repository(hit));
  const pageCount = Math.ceil(result.totalCount / REPOSITORY_COUNT_PER_PAGE);

  return { repositories, pageCount, totalCount: result.totalCount };
}

async function index(repositories: Repository[]): Promise<StoreResult> {
  if (
    !process.env.GATSBY_SEARCH_INDEX_URL ||
    !process.env.GATSBY_SEARCH_INDEX_API_KEY
  ) {
    return Promise.reject();
  }

  await RequestHelper.post({
    url: process.env.GATSBY_SEARCH_INDEX_URL,
    body: repositories,
    headers: {
      'x-api-key': process.env.GATSBY_SEARCH_INDEX_API_KEY,
    },
  });

  return { count: repositories.length };
}

const SearchService = {
  search,
  index,
};

export default SearchService;
