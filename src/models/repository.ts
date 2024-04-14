import URLHelper from '@/helpers/url';
import Engines from '@/lib/engines';

import Colorscheme from './colorscheme';
import RepositoryDTO from './DTO/repository';
import Owner from './owner';

export class Repository {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: string;
  lastCommitAt: string;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  engine: Engines;
  colorschemes: Colorscheme[];

  constructor(dto: RepositoryDTO) {
    this.name = dto.name;
    this.owner = dto.owner;
    this.description = dto.description;
    this.githubCreatedAt = dto.githubCreatedAt;
    this.lastCommitAt = dto.lastCommitAt;
    this.githubURL = dto.githubURL;
    this.stargazersCount = dto.stargazersCount;
    this.weekStargazersCount = dto.weekStargazersCount;
    this.engine = dto.isLua ? Engines.Neovim : Engines.Vim;
    this.colorschemes = (dto.colorschemes ?? []).map(cs => new Colorscheme(cs));
  }

  get key(): string {
    return `${this.owner.name}/${this.name}`;
  }

  get route(): string {
    return `/${URLHelper.urlify(this.key)}`.toLowerCase();
  }

  get title(): string {
    return `${this.name}, by ${this.owner.name}`;
  }
}
