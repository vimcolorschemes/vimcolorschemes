import ColorGroupDTO from '@/models/DTO/colorGroup';

type ColorschemeDataDTO = {
  light: ColorGroupDTO[] | null;
  dark: ColorGroupDTO[] | null;
};

export default ColorschemeDataDTO;
