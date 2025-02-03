import DatabaseService from '@/services/database';

import { RepositoryModel } from '@/models/DTO/repository';
import Repository from '@/models/repository';

import Constants from '@/lib/constants';
import Filter from '@/lib/filter';
import Sort from '@/lib/sort';

import QueryHelper from '@/helpers/query';

type GetRepositoriesParams = {
  sort: Sort;
  filter: Filter;
};

/**
 * Get the total number of repositories from the database.
 *
 * @example
 * const count = await RepositoriesService.getRepositoryCount({ background: 'dark' });
 *
 * @params filter The filter to apply.
 * @returns The total number of repositories.
 */
async function getRepositoryCount(filter: Filter): Promise<number> {
  await DatabaseService.connect();

  return RepositoryModel.countDocuments({
    updateValid: true,
    generateValid: true,
    $expr: { $gt: [{ $size: '$vimColorSchemes' }, 0] },
    ...QueryHelper.getFilterQuery(filter),
  });
}

/**
 * Get paginated repositories from the database.
 *
 * @example
 * const repositories = await RepositoriesService.getRepositories({ sort: 'trending', filter: { background: Backgrounds.Dark }});
 *
 * @params params.sort The order and property to sort by.
 * @params params.filter The filter to apply to the query.
 *
 * @returns The repositories.
 */
async function getRepositories({
  sort,
  filter,
}: GetRepositoriesParams): Promise<Repository[]> {
  await DatabaseService.connect();

  const repositoryDTOs = await RepositoryModel.aggregate([
    {
      $match: {
        updateValid: true,
        generateValid: true,
        $expr: { $gt: [{ $size: '$vimColorSchemes' }, 0] },
        ...QueryHelper.getFilterQuery(filter),
      },
    },
    { $sort: QueryHelper.getSortQuery(sort) },
    { $skip: ((filter.page ?? 1) - 1) * Constants.REPOSITORY_PAGE_SIZE },
    { $limit: Constants.REPOSITORY_PAGE_SIZE },
  ]);

  return repositoryDTOs.map(dto => new Repository(dto));
}

/**
 * @returns all repositories from the database.
 */
async function getAllRepositories(): Promise<Repository[]> {
  await DatabaseService.connect();

  const repositoryDTOs = await RepositoryModel.aggregate([
    {
      $match: {
        updateValid: true,
        generateValid: true,
        $expr: { $gt: [{ $size: '$vimColorSchemes' }, 0] },
      },
    },
  ]);

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
async function getRepository(
  owner: string,
  name: string,
): Promise<Repository | null> {
  await DatabaseService.connect();

  const repositoryDTOs = await RepositoryModel.aggregate([
    {
      $match: {
        'owner.name': { $regex: `^${owner}$`, $options: 'i' },
        name: { $regex: `^${name}$`, $options: 'i' },
        updateValid: true,
        generateValid: true,
        $expr: { $gt: [{ $size: '$vimColorSchemes' }, 0] },
      },
    },
    { $limit: 1 },
  ]);

  if (!repositoryDTOs.length) {
    return null;
  }

  return new Repository(repositoryDTOs[0]);
}

const RepositoriesService = {
  getRepositoryCount,
  getRepositories,
  getAllRepositories,
  getRepository,
};

export default RepositoriesService;
