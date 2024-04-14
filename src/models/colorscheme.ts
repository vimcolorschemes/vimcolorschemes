import Backgrounds, { Background } from '@/lib/backgrounds';
import Engines from '@/lib/engines';

import ColorschemeDTO, { ColorschemeDataDTO } from './DTO/colorscheme';

class Colorscheme {
  name: string;
  data: ColorschemeData;
  engine: Engines;
  backgrounds: Background[];
  private _defaultBackground: Background;

  constructor(dto?: ColorschemeDTO) {
    this.name = dto?.name || '';
    this.data = new ColorschemeData(dto?.data || null);
    this.engine = dto?.isLua ? Engines.Neovim : Engines.Vim;
    this.backgrounds = dto?.backgrounds || [];

    this._defaultBackground = this.backgrounds.includes(Backgrounds.Dark)
      ? Backgrounds.Dark
      : Backgrounds.Light;
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

  copy(): Colorscheme {
    const copy = new Colorscheme();
    copy.name = this.name;
    copy.data = this.data;
    copy.engine = this.engine;
    return copy;
  }
}

class ColorschemeData {
  light: VimColorSchemeGroup[] | null;
  dark: VimColorSchemeGroup[] | null;

  constructor(dto: ColorschemeDataDTO | null) {
    this.light = !!dto?.light?.length ? dto.light : null;
    this.dark = !!dto?.dark?.length ? dto.dark : null;
  }
}

interface VimColorSchemeGroup {
  name: string;
  hexCode: string;
}

export default Colorscheme;
