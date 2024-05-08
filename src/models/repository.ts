import Backgrounds, { Background } from '@/lib/backgrounds';
import Editors, { Editor } from '@/lib/editors';

import Colorscheme from './colorscheme';
import RepositoryDTO from './DTO/repository';
import Owner from './owner';

/**
 * Represents a repository containing one or multiple colorschemes.
 */
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
    this.colorschemes = (dto.colorschemes ?? []).map(
      dto => new Colorscheme(dto),
    );
  }

  /**
   * @returns The unique key of the repository, used to identify it in various contexts.
   */
  get key(): string {
    return `${this.owner.name}/${this.name}`;
  }

  /**
   * @returns The route of the repository, used to navigate to the repository page.
   */
  get route(): string {
    return `/${this.key}`.toLowerCase();
  }

  /**
   * @returns The page title of the repository composed by the name and the owner's name.
   */
  get title(): string {
    return `${this.name}, by ${this.owner.name}`;
  }

  /**
   * @returns A list of backgrounds used by the colorschemes in this repository.
   */
  get backgrounds(): Background[] {
    return Array.from(
      new Set(
        this.colorschemes.flatMap(colorscheme => colorscheme.backgrounds),
      ),
    );
  }

  /**
   * @returns A list of editors used by the colorschemes in this repository.
   */
  get editors(): Editor[] {
    return Array.from(
      new Set(this.colorschemes.map(colorscheme => colorscheme.editor)),
    );
  }

  /**
   * @returns The DTO version of this repository. Equivalent of the object that comes from the API.
   */
  get dto(): RepositoryDTO {
    return {
      name: this.name,
      owner: this.owner,
      description: this.description,
      githubCreatedAt: this.githubCreatedAt,
      lastCommitAt: this.lastCommitAt,
      githubURL: this.githubURL,
      stargazersCount: this.stargazersCount,
      weekStargazersCount: this.weekStargazersCount,
      isLua: this.editors.includes(Editors.Neovim),
      colorschemes: this.colorschemes.map(colorscheme => colorscheme.dto),
    };
  }

  /**
   * @returns a list of flat colorschemes, where each colorscheme has only one background.
   */
  get flattenedColorschemes(): Colorscheme[] {
    return this.colorschemes.flatMap(colorscheme => colorscheme.flattened);
  }

  /**
   * @param prioritizedBackground The background to prioritize if it's part of the colorscheme backgrounds.
   * @returns The default colorscheme to display for the repository.
   */
  getDefaultColorscheme(prioritizedBackground?: Background): Colorscheme {
    if (!prioritizedBackground) {
      prioritizedBackground = Backgrounds.Dark;
    }
    const colorsheme = this.colorschemes.find(colorscheme =>
      colorscheme.backgrounds.includes(prioritizedBackground),
    );
    return colorsheme || this.colorschemes[0];
  }
}

export default Repository;
