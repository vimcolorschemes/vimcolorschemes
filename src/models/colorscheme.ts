import Backgrounds from '#/lib/backgrounds';
import type { Background } from '#/lib/backgrounds';
import ColorschemeData from '#/models/colorscheme-data';
import type { ColorschemeDTO } from '#/models/DTO/colorscheme';

class Colorscheme {
  name: string;
  data: ColorschemeData;
  backgrounds: Background[];

  constructor(dto?: ColorschemeDTO) {
    this.name = dto?.name || '';
    this.data = new ColorschemeData(dto?.data || null);
    this.backgrounds = dto?.backgrounds || [];
  }

  get dto(): ColorschemeDTO {
    return {
      name: this.name,
      data: this.data.dto,
      backgrounds: this.backgrounds,
    };
  }

  getDefaultBackground(prioritizedBackground?: Background): Background {
    const preferred = prioritizedBackground || Backgrounds.Dark;
    if (this.backgrounds.includes(preferred)) {
      return preferred;
    }
    return this.backgrounds[0];
  }

  get flattened(): Colorscheme[] {
    return this.backgrounds
      .slice()
      .sort()
      .map(
        background =>
          new Colorscheme({
            name: this.name,
            backgrounds: [background],
            data: {
              light: background === Backgrounds.Light ? this.data.light : null,
              dark: background === Backgrounds.Dark ? this.data.dark : null,
            },
          }),
      );
  }
}

export default Colorscheme;
