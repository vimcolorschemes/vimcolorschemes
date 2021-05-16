import { VimColorScheme } from '@/models/vimColorScheme';

export interface Repository {
  name: string;
  description: string;
  stargazersCount: number;
  githubCreatedAt: string;
  lastCommitAt: string;
  githubURL: string;
  weekStargazersCount: number;
  owner: Owner;
  vimColorSchemes: VimColorScheme[] | null;
}

export interface Owner {
  name: string;
}
