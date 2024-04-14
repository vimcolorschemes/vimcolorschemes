import ColorschemeDTO from '@/models/DTO/colorscheme';
import OwnerDTO from '@/models/owner';

type RepositoryDTO = {
  name: string;
  owner: OwnerDTO;
  description: string;
  githubCreatedAt: string;
  lastCommitAt: string;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  isVim: boolean;
  isLua: boolean;
  colorschemes: ColorschemeDTO[] | null;
};

export default RepositoryDTO;
