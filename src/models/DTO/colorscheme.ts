import ColorschemeDataDTO from '@/models/DTO/colorschemeData';

import { Background } from '@/lib/backgrounds';

type ColorschemeDTO = {
  name: string;
  data: ColorschemeDataDTO | null;
  backgrounds: Background[];
};

export default ColorschemeDTO;
