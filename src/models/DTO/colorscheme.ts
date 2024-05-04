import ColorschemeDataDTO from '@/models/colorschemeData';

import { Background } from '@/lib/backgrounds';

type ColorschemeDTO = {
  name: string;
  data: ColorschemeDataDTO | null;
  isLua: boolean;
  backgrounds: Background[];
};

export default ColorschemeDTO;
