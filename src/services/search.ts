import Background from '@/lib/background';
import RequestHelper from '@/helpers/request';
import { APIRepository } from '@/models/api';
import { ELASTIC_SEARCH_INDEX_NAME } from '.';
import { Repository, REPOSITORY_COUNT_PER_PAGE } from '@/models/repository';
import { SearchSort } from '@elastic/elasticsearch/api/types';

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

interface SearchProps {
  query: string;
  filters: Background[];
  page: number;
}

/**
 * Posts a search request to the repository search index and returns the result
 *
 * @param {string} query - The search input to match
 * @param {number} page - The search page
 *
 * @returns {Object[]} The repositories, total count and page count matching the
 * search input
 */
async function search({
  query,
  filters,
  page = 1,
}: SearchProps): Promise<SearchResult> {
  if (!query) {
    return Promise.reject();
  }

  // TODO do filters here

  const data = await RequestHelper.post<ElasticSearchResult<APIRepository>>(
    URL,
    {
      query: { query_string: { query: `*${query}*` } },
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
