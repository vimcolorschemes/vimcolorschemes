import type { ColorGroupDTO } from '#/models/DTO/color-group';

export type ColorschemeDataDTO = {
  light: ColorGroupDTO[] | null;
  dark: ColorGroupDTO[] | null;
};
