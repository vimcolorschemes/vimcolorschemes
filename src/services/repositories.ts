import QueryHelper from '@/helpers/query';
import Filter from '@/lib/filter';
import Sort from '@/lib/sort';
import { RepositoryModel } from '@/models/DTO/repository';
import Repository from '@/models/repository';
import DatabaseService from '@/services/database';

type GetRepositoriesParams = {
  sort: Sort;
  filter: Filter;
};

/**
 * Get all repositories from the database.
 *
 * @example
 * const repositories = await RepositoriesService.getRepositories();
 *
 * @params params.sort The order and property to sort by.
 *
 * @returns The repositories.
 */
async function getRepositories({
  sort,
  filter,
}: GetRepositoriesParams): Promise<Repository[]> {
  await DatabaseService.connect();

  const repositoryDTOs = await RepositoryModel.find(
    {
      updateValid: true,
      generateValid: true,
      'vimColorSchemes.valid': true,
      ...QueryHelper.getFilterQuery(filter),
    },
    null,
    { sort: QueryHelper.getSortQuery(sort) },
  );

  return repositoryDTOs.map(dto => new Repository(dto));
}

/**
 * Get a repository from the database.
 *
 * @example
 * const repository = await RepositoriesService.getRepository('morhetz', 'gruvbox');
 *
 * @param owner The owner of the repository.
 * @param name The name of the repository.
 *
 * @returns The repository.
 */
async function getRepository(owner: string, name: string): Promise<Repository> {
  await DatabaseService.connect();

  const repositoryDTO = await RepositoryModel.findOne({
    'owner.name': { $regex: owner, $options: 'i' },
    name: { $regex: name, $options: 'i' },
    updateValid: true,
    generateValid: true,
    'vimColorSchemes.valid': true,
  });

  if (!repositoryDTO) {
    throw new Error('Repository not found');
  }

  return new Repository(repositoryDTO);
}

const RepositoriesService = { getRepositories, getRepository };
export default RepositoriesService;
