import ColorGroup from '@/models/colorGroup';
import ColorschemeDataDTO from '@/models/DTO/colorschemeData';

/**
 * Represents the colorscheme color data.
 */
class ColorschemeData {
  light: ColorGroup[] | null;
  dark: ColorGroup[] | null;

  constructor(dto: ColorschemeDataDTO | null) {
    this.light = !!dto?.light?.length ? dto.light : null;
    this.dark = !!dto?.dark?.length ? dto.dark : null;
  }

  /**
   * @returns a DTO representation of the colorscheme data.
   */
  get dto(): ColorschemeDataDTO {
    return { light: this.light, dark: this.dark };
  }
}

export default ColorschemeData;
