import Backgrounds, { Background } from '@/lib/backgrounds';
import Engines, { Engine } from '@/lib/engines';

import ColorschemeDTO, { ColorschemeDataDTO } from './DTO/colorscheme';

class Colorscheme {
  name: string;
  data: ColorschemeData;
  engine: Engine;
  backgrounds: Background[];

  constructor(dto?: ColorschemeDTO) {
    this.name = dto?.name || '';
    this.data = new ColorschemeData(dto?.data || null);
    this.engine = dto?.isLua ? Engines.Neovim : Engines.Vim;
    this.backgrounds = dto?.backgrounds || [];
  }

  /**
   * @returns a DTO representation of the colorscheme.
   */
  get dto(): ColorschemeDTO {
    return {
      name: this.name,
      data: this.data.dto,
      isLua: this.engine === Engines.Neovim,
      backgrounds: this.backgrounds,
    };
  }

  /**
   * @returns a list of flat colorschemes, where each colorscheme has only one background.
   */
  get flattened(): Colorscheme[] {
    return this.backgrounds.map(
      background =>
        new Colorscheme({
          name: this.name,
          isLua: this.engine === Engines.Neovim,
          backgrounds: [background],
          data: new ColorschemeData({
            light: background === Backgrounds.Light ? this.data.light : null,
            dark: background === Backgrounds.Dark ? this.data.dark : null,
          }),
        }),
    );
  }
}

export class ColorschemeData {
  light: ColorschemeGroup[] | null;
  dark: ColorschemeGroup[] | null;

  constructor(dto: ColorschemeDataDTO | null) {
    this.light = !!dto?.light?.length ? dto.light : null;
    this.dark = !!dto?.dark?.length ? dto.dark : null;
  }

  /**
   * @returns a DTO representation of the colorscheme data.
   */
  get dto(): ColorschemeDataDTO {
    return {
      light: this.light || [],
      dark: this.dark || [],
    };
  }
}

export type ColorschemeGroup = {
  name: string;
  hexCode: string;
};

export default Colorscheme;
