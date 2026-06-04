import { describe, expect, it } from 'vitest';

import { Colorscheme } from '@/models/colorscheme';

import { Backgrounds } from '@/lib/backgrounds';

import { RepositoryPageHelper } from '@/helpers/repositoryPage';

describe('RepositoryPageHelper.getColorschemeStyle', () => {
  it('maps vim highlight attributes to css variables', () => {
    const colorscheme = new Colorscheme({
      name: 'test',
      backgrounds: [Backgrounds.Dark],
      data: {
        light: null,
        dark: [
          {
            name: 'vimCommandFg',
            hexCode: '#ff0000',
            bold: true,
            italic: true,
            undercurl: true,
            strikethrough: true,
            reverse: true,
          },
        ],
      },
    });

    expect(RepositoryPageHelper.getColorschemeStyle(colorscheme)).toEqual({
      '--colorscheme-vimCommandFg': '#ff0000',
      '--colorscheme-vimCommandFg-font-weight': '700',
      '--colorscheme-vimCommandFg-font-style': 'italic',
      '--colorscheme-vimCommandFg-text-decoration-line':
        'underline line-through',
      '--colorscheme-vimCommandFg-text-decoration-style': 'wavy',
      '--colorscheme-vimCommandFg-color':
        'var(--colorscheme-NormalBg, var(--background))',
      '--colorscheme-vimCommandFg-background': '#ff0000',
    });
  });

  it('uses the selected background when provided', () => {
    const colorscheme = new Colorscheme({
      name: 'test',
      backgrounds: [Backgrounds.Light, Backgrounds.Dark],
      data: {
        light: [{ name: 'NormalFg', hexCode: '#111111' }],
        dark: [{ name: 'NormalFg', hexCode: '#eeeeee', bold: true }],
      },
    });

    expect(
      RepositoryPageHelper.getColorschemeStyle(colorscheme, Backgrounds.Dark),
    ).toEqual({
      '--colorscheme-NormalFg': '#eeeeee',
      '--colorscheme-NormalFg-font-weight': '700',
    });
  });
});
