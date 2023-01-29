import URLHelper from '../helpers/url';
import { APIRepository } from './api';
import Background from '../lib/background';
import { VimColorScheme, VimColorSchemeData } from './vimColorScheme';

export const REPOSITORY_COUNT_PER_PAGE = 20;

export class Repository {
  name: string;
  owner: Owner;
  description: string;
  githubCreatedAt: string;
  lastCommitAt: string;
  githubURL: string;
  stargazersCount: number;
  weekStargazersCount: number;
  isVim: boolean;
  isLua: boolean;
  vimColorSchemes: VimColorScheme[];
  private _defaultBackground: Background;

  constructor(apiRepository: APIRepository) {
    this.name = apiRepository.name;
    this.owner = apiRepository.owner;
    this.description = apiRepository.description;
    this.githubCreatedAt = apiRepository.githubCreatedAt;
    this.lastCommitAt = apiRepository.lastCommitAt;
    this.githubURL = apiRepository.githubURL;
    this.stargazersCount = apiRepository.stargazersCount;
    this.weekStargazersCount = apiRepository.weekStargazersCount;

    this.isVim = !!apiRepository.isVim;
    this.isLua = !!apiRepository.isLua;
    if (!this.isVim && !this.isLua) {
      this.isVim = true;
    }

    let defaultBackground = Background.Light;

    this.vimColorSchemes = (apiRepository.vimColorSchemes || []).reduce(
      (vimColorSchemes, vimColorScheme) => {
        if (vimColorScheme.valid) {
          if (vimColorScheme.backgrounds.includes(Background.Dark)) {
            defaultBackground = Background.Dark;
          }

          return [...vimColorSchemes, new VimColorScheme(vimColorScheme)];
        }

        return vimColorSchemes;
      },
      [] as VimColorScheme[],
    );

    this._defaultBackground = defaultBackground;
    this.sortVimColorSchemesByBackground();
  }

  set defaultBackground(background: Background) {
    this._defaultBackground = background;
    this.sortVimColorSchemesByBackground();
  }

  private sortVimColorSchemesByBackground() {
    this.vimColorSchemes = this.vimColorSchemes
      .map(vimColorScheme => {
        if (vimColorScheme.backgrounds.includes(this._defaultBackground)) {
          vimColorScheme.defaultBackground = this._defaultBackground;
        }
        return vimColorScheme;
      })
      .sort((a, _b) => {
        if (a.backgrounds.includes(this._defaultBackground)) {
          return -1;
        }

        return 1;
      });
  }

  get defaultBackground(): Background {
    return this._defaultBackground;
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

  get previewRoute(): string {
    return `${this.route}/preview`;
  }

  get previewImageRoute(): string {
    return `/previews/${this.owner.name}.${this.name}.preview.png`;
  }

  // Return all color scheme variations in a flat list
  get flattenedVimColorSchemes(): VimColorScheme[] {
    return this.vimColorSchemes.reduce(
      (vimColorSchemes: VimColorScheme[], vimColorScheme: VimColorScheme) => {
        if (!vimColorScheme.valid) {
          return vimColorSchemes;
        }

        const copies: VimColorScheme[] = vimColorScheme.backgrounds.map(
          background => {
            const copy = vimColorScheme.copy();
            copy.data = new VimColorSchemeData(null);
            copy.data[background] = vimColorScheme.data[background];
            copy.backgrounds = [background];
            copy.defaultBackground = background;
            return copy;
          },
        );

        return [...vimColorSchemes, ...copies];
      },
      [] as VimColorScheme[],
    );
  }

  get defaultVimColorScheme(): VimColorScheme {
    return this.flattenedVimColorSchemes[0];
  }
}

export interface Owner {
  name: string;
}

export interface RepositoryPageContext {
  ownerName: string;
  name: string;
}

export type SortProperty = { [key in keyof Repository]: 'ASC' | 'DESC' };

export interface RepositoriesPageContext {
  skip: number;
  limit: number;
  sort: SortProperty[];
  pageCount: number;
  currentPage: number;
  filters: Background[];
}
