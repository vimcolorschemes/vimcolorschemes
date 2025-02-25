import { describe, it, expect } from 'vitest';

import Colorscheme from '@/models/colorscheme';
import ColorschemeDTO from '@/models/DTO/colorscheme';

import Backgrounds from '@/lib/backgrounds';

describe('new Colorscheme()', () => {
  it('should create a new colorscheme from a DTO object', () => {
    const dto: ColorschemeDTO = {
      name: 'colorscheme',
      data: { light: [{ name: 'test', hexCode: '#ffffff' }], dark: null },
      backgrounds: [Backgrounds.Light],
    };

    const colorscheme = new Colorscheme(dto);

    expect(colorscheme.name).toBe(dto.name);
    expect(JSON.stringify(colorscheme.data.light)).toBe(
      JSON.stringify(dto.data?.light),
    );
  });
});

describe('colorscheme.dto', () => {
  it('should convert the colorscheme data to a DTO object', () => {
    const dto: ColorschemeDTO = {
      name: 'colorscheme',
      data: { light: [{ name: 'test', hexCode: '#ffffff' }], dark: null },
      backgrounds: [Backgrounds.Dark],
    };

    const colorscheme = new Colorscheme(dto);

    expect(colorscheme.dto).toEqual(dto);
  });
});

describe('colorscheme.getDefaultBackground', () => {
  it('should return dark as the default background if it exists', () => {
    const colorscheme = new Colorscheme({
      name: 'colorscheme',
      data: { light: null, dark: [{ name: 'test', hexCode: '#ffffff' }] },
      backgrounds: [Backgrounds.Dark],
    });
    expect(colorscheme.getDefaultBackground()).toBe(Backgrounds.Dark);
  });

  it('should return the only background if there is only one', () => {
    const colorscheme = new Colorscheme({
      name: 'colorscheme',
      data: { light: [{ name: 'test', hexCode: '#ffffff' }], dark: null },
      backgrounds: [Backgrounds.Light],
    });
    expect(colorscheme.getDefaultBackground()).toBe(Backgrounds.Light);
  });

  it('should return the prioritized background if it exists', () => {
    const colorscheme = new Colorscheme({
      name: 'colorscheme',
      data: {
        light: [{ name: 'test', hexCode: '#ffffff' }],
        dark: [{ name: 'test', hexCode: '#ffffff' }],
      },
      backgrounds: [Backgrounds.Light, Backgrounds.Dark],
    });
    expect(colorscheme.getDefaultBackground(Backgrounds.Light)).toBe(
      Backgrounds.Light,
    );
  });
});

describe('colorscheme.flattened', () => {
  it('should return all backgrounds as standalone colorschemes', () => {
    const colorscheme = new Colorscheme({
      name: 'colorscheme',
      data: {
        light: [{ name: 'test', hexCode: '#ffffff' }],
        dark: [{ name: 'test', hexCode: '#ffffff' }],
      },
      backgrounds: [Backgrounds.Light, Backgrounds.Dark],
    });
    expect(colorscheme.flattened.length).toBe(2);
    expect(colorscheme.flattened[0].backgrounds.length).toBe(1);
    expect(colorscheme.flattened[1].backgrounds.length).toBe(1);
    expect([
      ...colorscheme.flattened[0].backgrounds,
      ...colorscheme.flattened[1].backgrounds,
    ]).toEqual(colorscheme.backgrounds);
  });
});
