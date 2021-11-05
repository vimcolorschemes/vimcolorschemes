import { APIVimColorScheme, APIVimColorSchemeData } from './api';
import { Background } from '../lib/background';

export class VimColorScheme {
  name: string;
  valid: boolean;
  data: VimColorSchemeData;
  backgrounds: Background[];
  private _defaultBackground: Background;

  constructor(apiVimColorScheme?: APIVimColorScheme) {
    this.name = apiVimColorScheme?.name || '';
    this.valid = apiVimColorScheme?.valid || false;
    this.data = new VimColorSchemeData(apiVimColorScheme?.data || null);

    this.backgrounds = apiVimColorScheme?.backgrounds || [];

    this._defaultBackground = this.backgrounds.includes(Background.Dark)
      ? Background.Dark
      : Background.Light;
    this.sortBackgrounds();
  }

  get defaultBackground(): Background {
    return this._defaultBackground;
  }

  set defaultBackground(background: Background) {
    this._defaultBackground = background;
    this.sortBackgrounds();
  }

  sortBackgrounds() {
    this.backgrounds.sort(a => (a === this._defaultBackground ? -1 : 1));
  }

  get key(): string {
    return `${this.name} (${this.defaultBackground})`;
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
