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

  const repositoryDTOs = await RepositoryModel.find({
    updateValid: true,
    generateValid: true,
    'vimColorSchemes.valid': true,
  });

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
