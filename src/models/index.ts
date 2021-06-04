import URLHelper from '@/helpers/url';
import { APIRepository, APIVimColorScheme, APIVimColorSchemeData } from './api';

export enum Background {
  Light = 'light',
  Dark = 'dark',
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

  get expandedVimColorSchemes(): VimColorScheme[] {
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

export class VimColorScheme {
  name: string;
  valid: boolean;
  data: VimColorSchemeData;

  constructor(apiVimColorScheme?: APIVimColorScheme) {
    this.name = apiVimColorScheme?.name || '';
    this.valid = apiVimColorScheme?.valid || false;
    this.data = new VimColorSchemeData(apiVimColorScheme?.data || null);
  }

  get backgrounds(): Background[] {
    if (!this.data) {
      return [];
    }

    return [
      ...(this.data.light != null ? [Background.Light] : []),
      ...(this.data.dark != null ? [Background.Dark] : []),
    ];
  }

  copy(): VimColorScheme {
    const copy = new VimColorScheme();
    copy.name = this.name;
    copy.valid = this.valid;
    copy.data = this.data;
    return copy;
  }
}

export class VimColorSchemeData {
  light: VimColorSchemeGroup[] | null;
  dark: VimColorSchemeGroup[] | null;

  constructor(apiVimColorSchemeData: APIVimColorSchemeData | null) {
    this.light = !!apiVimColorSchemeData?.light?.length
      ? apiVimColorSchemeData.light
      : null;
    this.dark = !!apiVimColorSchemeData?.dark?.length
      ? apiVimColorSchemeData.dark
      : null;
  }
}

export interface VimColorSchemeGroup {
  name: string;
  hexCode: string;
}
