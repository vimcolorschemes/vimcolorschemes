import { ColorGroupDTO } from '@/models/DTO/colorGroup';

export type ColorschemeDataDTO = {
  light: ColorGroupDTO[] | null;
  dark: ColorGroupDTO[] | null;
};
