import { Client, ClientOptions } from '@elastic/elasticsearch';

import { APIRepository } from '@/models/api';

export const ELASTICSEARCH_INDEX_NAME =
  process.env.GATSBY_ELASTICSEARCH_INDEX_NAME || 'vimcolorschemes_repositories';
const ELASTICSEARCH_CLOUD_ID = process.env.GATSBY_ELASTICSEARCH_CLOUD_ID;
const ELASTICSEARCH_URL =
  process.env.GATSBY_ELASTICSEARCH_URL || 'http://localhost:9200';
const ELASTICSEARCH_USERNAME = process.env.GATSBY_ELASTICSEARCH_USERNAME || '';
const ELASTICSEARCH_PASSWORD = process.env.GATSBY_ELASTICSEARCH_PASSWORD || '';

interface ServiceResult {
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

class SearchService {
  private readonly client: Client;

  constructor() {
    const options: ClientOptions = {};

    if (!!ELASTICSEARCH_CLOUD_ID) {
      options.cloud = { id: ELASTICSEARCH_CLOUD_ID };
    } else {
      options.node = ELASTICSEARCH_URL;
    }

    options.auth = {
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    };

    this.client = new Client(options);
  }

  async indexRepositories(
    repositories: APIRepository[],
  ): Promise<ServiceResult> {
    try {
      const deletionResult = await this.deleteRepositoryIndex();
      if (!deletionResult.success) {
        return deletionResult;
      }

      await this.client.indices.create(
        {
          index: ELASTICSEARCH_INDEX_NAME,
          body: {
            mappings: INDEX_PROPERTY_MAPPINGS,
          },
        },
        { ignore: [400] },
      );

      const body = repositories.flatMap(repository => [
        { index: { _index: ELASTICSEARCH_INDEX_NAME } },
        repository,
      ]);

      await this.client.bulk({ refresh: true, body });

      const result = await this.client.count({
        index: ELASTICSEARCH_INDEX_NAME,
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

  private async deleteRepositoryIndex(): Promise<ServiceResult> {
    try {
      const { body: exists } = await this.client.indices.exists({
        index: ELASTICSEARCH_INDEX_NAME,
      });
      if (exists) {
        await this.client.indices.delete({ index: ELASTICSEARCH_INDEX_NAME });
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error || 'undefined error' };
    }
  }
}

export default SearchService;
