import { Background } from '@/lib/backgrounds';
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

  toDTO(): ColorschemeDTO {
    return {
      name: this.name,
      data: this.data.toDTO(),
      isLua: this.engine === Engines.Neovim,
      backgrounds: this.backgrounds,
    };
  }
}

class ColorschemeData {
  light: ColorschemeGroup[] | null;
  dark: ColorschemeGroup[] | null;

  constructor(dto: ColorschemeDataDTO | null) {
    this.light = !!dto?.light?.length ? dto.light : null;
    this.dark = !!dto?.dark?.length ? dto.dark : null;
  }

  toDTO(): ColorschemeDataDTO {
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
