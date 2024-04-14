import { Background } from '@/lib/backgrounds';

type ColorschemeDTO = {
  name: string;
  valid: boolean;
  data: ColorschemeDataDTO | null;
  isLua: boolean;
  backgrounds: Background[];
};

export type ColorschemeDataDTO = {
  light: ColorGroupDTO[] | null;
  dark: ColorGroupDTO[] | null;
};

export type ColorGroupDTO = {
  name: string;
  hexCode: string;
};

export default ColorschemeDTO;
