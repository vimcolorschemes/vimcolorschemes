import type { Background } from '#/lib/backgrounds';
import Colorscheme from '#/models/colorscheme';
import type { RepositoryDTO } from '#/models/DTO/repository';
import type { Owner } from '#/models/owner';

class Repository {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: Date;
  pushedAt: Date;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  colorschemes: Colorscheme[];

  constructor(dto: RepositoryDTO) {
    this.name = dto.name;
    this.owner = dto.owner;
    this.description = dto.description;
    this.githubCreatedAt = dto.githubCreatedAt;
    this.pushedAt = dto.pushedAt;
    this.githubURL = dto.githubURL;
    this.stargazersCount = dto.stargazersCount;
    this.weekStargazersCount = dto.weekStargazersCount;
    this.colorschemes = dto.vimColorSchemes.map(
      colorscheme => new Colorscheme(colorscheme),
    );
  }

  get key(): string {
    return `${this.owner.name}/${this.name}`;
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

  get flattenedColorschemes(): Colorscheme[] {
    return this.colorschemes.flatMap(colorscheme => colorscheme.flattened);
  }
}

export default Repository;
