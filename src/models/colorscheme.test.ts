import { describe, expect, it } from 'vitest';

import Colorscheme from '#/models/colorscheme';

describe('Colorscheme', () => {
  it('prefers provided background when available', () => {
    const colorscheme = new Colorscheme({
      name: 'gruvbox',
      backgrounds: ['light', 'dark'],
      data: {
        light: [{ name: 'base00', hexCode: '#fbf1c7' }],
        dark: [{ name: 'base00', hexCode: '#282828' }],
      },
    });

    expect(colorscheme.getDefaultBackground('light')).toBe('light');
  });

  it('falls back to dark, then first background', () => {
    const darkPreferred = new Colorscheme({
      name: 'onedark',
      backgrounds: ['light', 'dark'],
      data: {
        light: [{ name: 'base00', hexCode: '#fafafa' }],
        dark: [{ name: 'base00', hexCode: '#1e1e1e' }],
      },
    });
    const firstOnly = new Colorscheme({
      name: 'solarized-light',
      backgrounds: ['light'],
      data: { light: [{ name: 'base00', hexCode: '#fdf6e3' }], dark: null },
    });

    expect(darkPreferred.getDefaultBackground()).toBe('dark');
    expect(firstOnly.getDefaultBackground()).toBe('light');
  });

  it('flattens into one colorscheme per background', () => {
    const colorscheme = new Colorscheme({
      name: 'catppuccin',
      backgrounds: ['light', 'dark'],
      data: {
        light: [{ name: 'base00', hexCode: '#eff1f5' }],
        dark: [{ name: 'base00', hexCode: '#1e1e2e' }],
      },
    });

    const flattened = colorscheme.flattened;

    expect(flattened).toHaveLength(2);
    expect(flattened[0].backgrounds).toEqual(['dark']);
    expect(flattened[0].data.dark).toEqual([
      { name: 'base00', hexCode: '#1e1e2e' },
    ]);
    expect(flattened[0].data.light).toBeNull();
    expect(flattened[1].backgrounds).toEqual(['light']);
    expect(flattened[1].data.light).toEqual([
      { name: 'base00', hexCode: '#eff1f5' },
    ]);
    expect(flattened[1].data.dark).toBeNull();
  });
});
