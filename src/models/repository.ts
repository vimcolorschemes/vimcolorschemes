import URLHelper from '@/helpers/url';
import { APIRepository } from './api';
import { VimColorScheme, VimColorSchemeData } from './vimColorScheme';

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

  constructor(apiRepository: APIRepository) {
    this.name = apiRepository.name;
    this.owner = apiRepository.owner;
    this.description = apiRepository.description;
    this.githubCreatedAt = apiRepository.githubCreatedAt;
    this.lastCommitAt = apiRepository.lastCommitAt;
    this.githubURL = apiRepository.githubURL;
    this.stargazersCount = apiRepository.stargazersCount;
    this.weekStargazersCount = apiRepository.weekStargazersCount;

    this.vimColorSchemes = (apiRepository.vimColorSchemes || []).reduce(
      (vimColorSchemes, vimColorScheme) => {
        if (vimColorScheme.valid) {
          return [...vimColorSchemes, new VimColorScheme(vimColorScheme)];
        }

        return vimColorSchemes;
      },
      [] as VimColorScheme[],
    );
  }

  get key(): string {
    return `${this.owner.name}/${this.name}`;
  }

  get route(): string {
    return `/${URLHelper.URLify(this.key)}`;
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
            return copy;
          },
        );

        return [...vimColorSchemes, ...copies];
      },
      [] as VimColorScheme[],
    );
  }
}

export interface Owner {
  name: string;
}
