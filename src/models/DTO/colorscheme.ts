import type { Background } from '#/lib/backgrounds';
import type { ColorschemeDataDTO } from '#/models/DTO/colorscheme-data';

export type ColorschemeDTO = {
  name: string;
  data: ColorschemeDataDTO | null;
  backgrounds: Background[];
};
