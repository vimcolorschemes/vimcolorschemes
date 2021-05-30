import { Owner, VimColorSchemeGroup } from '.';

export interface APIRepository {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: string;
  lastCommitAt: string;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  vimColorSchemes: APIVimColorScheme[] | null;
}

export interface APIVimColorScheme {
  name: string;
  valid: boolean;
  data: APIVimColorSchemeData | null;
}

export interface APIVimColorSchemeData {
  light: VimColorSchemeGroup[] | null;
  dark: VimColorSchemeGroup[] | null;
}
