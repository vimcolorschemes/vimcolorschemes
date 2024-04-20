import URLHelper from '@/helpers/url';
import { Background } from '@/lib/backgrounds';
import Engines, { Engine } from '@/lib/engines';

import Colorscheme from './colorscheme';
import RepositoryDTO from './DTO/repository';
import Owner from './owner';

class Repository {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: Date;
  lastCommitAt: Date;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
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
    this.colorschemes = (dto.vimColorSchemes ?? []).map(
      dto => new Colorscheme(dto),
    );
  }

  get key(): string {
    return `${this.owner.name}/${this.name}`;
  }

  get route(): string {
    return `/repositories/${URLHelper.encode(this.key)}`.toLowerCase();
  }

  get title(): string {
    return `${this.name}, by ${this.owner.name}`;
  }

  get backgrounds(): Background[] {
    return Array.from(
      new Set(
        this.colorschemes.flatMap(colorscheme => colorscheme.backgrounds),
      ),
    );
  }

  get engines(): Engine[] {
    return Array.from(
      new Set(this.colorschemes.map(colorscheme => colorscheme.engine)),
    );
  }
}

export default Repository;
