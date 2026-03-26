import { ColorschemeDTO } from '@/models/DTO/colorscheme';
import { Owner } from '@/models/owner';

export type RepositoryDTO = {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: Date | string;
  pushedAt: Date | string;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  vimColorSchemes: ColorschemeDTO[];
};
