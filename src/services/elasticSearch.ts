import { Client, ClientOptions } from '@elastic/elasticsearch';

import { APIRepository } from '@/models/api';
import { ELASTIC_SEARCH_INDEX_NAME } from '.';

const ELASTIC_SEARCH_CLOUD_ID = process.env.GATSBY_ELASTIC_SEARCH_CLOUD_ID;
const ELASTIC_SEARCH_URL =
  process.env.GATSBY_ELASTIC_SEARCH_URL || 'http://localhost:9200';
const ELASTIC_SEARCH_USERNAME =
  process.env.GATSBY_ELASTIC_SEARCH_USERNAME || '';
const ELASTIC_SEARCH_PASSWORD =
  process.env.GATSBY_ELASTIC_SEARCH_PASSWORD || '';

interface ElasticSearchResult {
  success: boolean;
  message?: string;
}

const INDEX_PROPERTY_MAPPINGS = {
  properties: {
    id: { type: 'keyword' },
    name: { type: 'text' },
    owner: { type: 'object' },
    description: { type: 'text' },
  },
};

class ElasticSearchClient {
  private readonly client: Client;

  /** Initializes the ElasticSearch client */
  constructor() {
    const options: ClientOptions = {};

    if (!!ELASTIC_SEARCH_CLOUD_ID) {
      options.cloud = { id: ELASTIC_SEARCH_CLOUD_ID };
    } else {
      options.node = ELASTIC_SEARCH_URL;
    }

    options.auth = {
      username: ELASTIC_SEARCH_USERNAME,
      password: ELASTIC_SEARCH_PASSWORD,
    };

    this.client = new Client(options);
  }

  /**
   * Erases the current search index, and replace it with the new repositories
   * @param {Object} repositories - The repositories to add to the search index
   * @returns {Object} A success value, and an error/success message if
   * applicable
   */
  async indexRepositories(
    repositories: APIRepository[],
  ): Promise<ElasticSearchResult> {
    try {
      const deletionResult = await this.deleteRepositoryIndex();
      if (!deletionResult.success) {
        return deletionResult;
      }

      await this.client.indices.create(
        {
          index: ELASTIC_SEARCH_INDEX_NAME,
          body: {
            mappings: INDEX_PROPERTY_MAPPINGS,
          },
        },
        { ignore: [400] },
      );

      const body = repositories.flatMap(repository => [
        { index: { _index: ELASTIC_SEARCH_INDEX_NAME } },
        repository,
      ]);

      await this.client.bulk({ refresh: true, body });

      const result = await this.client.count({
        index: ELASTIC_SEARCH_INDEX_NAME,
      });

      return {
        success: true,
        message: `Indexed ${result.body.count} repositories`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error || 'undefined error',
      };
    }
  }

  private async deleteRepositoryIndex(): Promise<ElasticSearchResult> {
    try {
      const { body: exists } = await this.client.indices.exists({
        index: ELASTIC_SEARCH_INDEX_NAME,
      });
      if (exists) {
        await this.client.indices.delete({ index: ELASTIC_SEARCH_INDEX_NAME });
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error || 'undefined error' };
    }
  }
}

export default ElasticSearchClient;
