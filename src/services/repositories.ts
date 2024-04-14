import { RepositoryModel } from '@/models/DTO/repository';
import Repository from '@/models/repository';
import DatabaseService from '@/services/database';

/**
 * Get all repositories from the database.
 *
 * @example
 * const repositories = await RepositoriesService.getRepositories();
 *
 * @returns The repositories.
 */
async function getRepositories(): Promise<Repository[]> {
  await DatabaseService.connect();

  const repositoryDTOs = await RepositoryModel.find();
  return repositoryDTOs.map(dto => new Repository(dto));
}

const RepositoriesService = { getRepositories };
export default RepositoriesService;
