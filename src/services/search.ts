import Background from '@/lib/background';
import RequestHelper from '@/helpers/request';
import { APIRepository } from '@/models/api';
import { ELASTIC_SEARCH_INDEX_NAME } from '.';
import { Repository, REPOSITORY_COUNT_PER_PAGE } from '@/models/repository';

const ELASTIC_SEARCH_PROXY_URL = process.env.GATSBY_ELASTIC_SEARCH_PROXY_URL;

const URL = `${ELASTIC_SEARCH_PROXY_URL}/${ELASTIC_SEARCH_INDEX_NAME}/_search`;

interface SearchResult {
  repositories: Repository[];
  pageCount: number;
  totalCount: number;
}

interface ElasticSearchHit<T> {
  _source: T;
}

interface ElasticSearchResult<T> {
  hits: {
    hits: ElasticSearchHit<T>[];
    total: { value: number };
  };
}

/**
 * Posts a search request to the repository search index and returns the result
 *
 * @param {string} query - The search input to match
 * @param {Background[]} filters - The background filters to apply
 * @param {number} page - The search page
 *
 * @returns {SearchResult} The repositories, total count and page count matching the
 * search input
 */
async function search(
  query: string,
  filters: Background[],
  page: number = 1,
): Promise<SearchResult> {
  if (!query) {
    return Promise.reject();
  }

  const data = await RequestHelper.post<ElasticSearchResult<APIRepository>>(
    URL,
    {
      query,
      filters,
      from: (page - 1) * REPOSITORY_COUNT_PER_PAGE,
      size: REPOSITORY_COUNT_PER_PAGE,
    },
  );

  const repositories = data.hits.hits.map(hit => new Repository(hit._source));
  const totalCount = data.hits.total.value;
  const pageCount = Math.ceil(totalCount / REPOSITORY_COUNT_PER_PAGE);

  return { repositories, pageCount, totalCount };
}

const SearchService = {
  search,
};

export default SearchService;
