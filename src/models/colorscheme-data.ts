import type { ColorGroup } from '#/models/color-group';
import type { ColorschemeDataDTO } from '#/models/DTO/colorscheme-data';

class ColorschemeData {
  light: ColorGroup[] | null;
  dark: ColorGroup[] | null;

  constructor(dto: ColorschemeDataDTO | null) {
    this.light = dto?.light?.length ? dto.light : null;
    this.dark = dto?.dark?.length ? dto.dark : null;
  }

  get dto(): ColorschemeDataDTO {
    return { light: this.light, dark: this.dark };
  }
}

export default ColorschemeData;
