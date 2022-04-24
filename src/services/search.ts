import Background from '../lib/background';
import RequestHelper from '../helpers/request';
import { Repository } from '../models/repository';

const SEARCH_INDEX_URL = process.env.GATSBY_SEARCH_INDEX_URL;
const SEARCH_INDEX_API_KEY = process.env.GATSBY_SEARCH_INDEX_API_KEY;

interface SearchResult {
  repositories: Repository[];
  pageCount: number;
  totalCount: number;
}

interface StoreResult {
  count: number;
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
  if (!query || !SEARCH_INDEX_URL) {
    return Promise.reject();
  }

  console.log(filters, page);

  const result = await RequestHelper.get<Repository[]>({
    url: SEARCH_INDEX_URL,
    queryParams: { query },
  });

  const repositories = result.map(hit => new Repository(hit));
  const totalCount = 10;
  const pageCount = 1;

  return { repositories, pageCount, totalCount };
}

async function index(repositories: Repository[]): Promise<StoreResult> {
  if (!SEARCH_INDEX_URL || !SEARCH_INDEX_API_KEY) {
    return Promise.reject();
  }

  const response = await RequestHelper.post({
    url: SEARCH_INDEX_URL,
    body: repositories,
    headers: {
      'x-api-key': SEARCH_INDEX_API_KEY,
    },
  });
  console.log(response);

  return { count: 0 };
}

const SearchService = {
  search,
  index,
};

export default SearchService;
