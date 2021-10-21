import { APIVimColorScheme, APIVimColorSchemeData } from './api';

export enum Background {
  Light = 'light',
  Dark = 'dark',
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

  get defaultBackground(): Background {
    return this.backgrounds.length === 2
      ? Background.Light
      : this.backgrounds[0];
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
