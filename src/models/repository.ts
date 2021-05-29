import URLHelper from '@/helpers/url';
import { VimColorScheme } from '@/models/vimColorScheme';

export interface Owner {
  name: string;
}

export interface RepositoryGraphqlNode {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: string;
  lastCommitAt: string;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  vimColorSchemes: VimColorScheme[] | null;
}

export class Repository {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: string;
  lastCommitAt: string;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  vimColorSchemes: VimColorScheme[];

  constructor(node: RepositoryGraphqlNode) {
    this.name = node.name;
    this.owner = node.owner;
    this.description = node.description;
    this.githubCreatedAt = node.githubCreatedAt;
    this.lastCommitAt = node.lastCommitAt;
    this.githubURL = node.githubURL;
    this.stargazersCount = node.stargazersCount;
    this.weekStargazersCount = node.weekStargazersCount;
    this.vimColorSchemes = node.vimColorSchemes || [];
  }

  get key(): string {
    return `${this.owner.name}/${this.name}`;
  }

  get route(): string {
    return `/${URLHelper.URLify(this.key)}`;
  }
}
