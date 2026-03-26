import { ColorschemeDataDTO } from '@/models/DTO/colorschemeData';

import { Background } from '@/lib/backgrounds';

export type ColorschemeDTO = {
  name: string;
  data: ColorschemeDataDTO | null;
  backgrounds: Background[];
};
