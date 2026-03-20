import type { ColorschemeDTO } from '#/models/DTO/colorscheme';
import type { Owner } from '#/models/owner';

export type RepositoryDTO = {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: Date;
  pushedAt: Date;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  vimColorSchemes: ColorschemeDTO[];
};
