import { CSSProperties } from 'react';

import { Colorscheme } from '@/models/colorscheme';

import { Background } from '@/lib/backgrounds';

const swatchGroupPriority = [
  'NormalBg',
  'NormalFg',
  'vimStringFg',
  'vimFuncNameFg',
  'vimFunctionFg',
  'vimCommandFg',
  'vimLetFg',
  'vimVarFg',
  'vimNumberFg',
  'vimOperFg',
  'vimParenSepFg',
  'vimFuncBodyFg',
  'vimIsCommandFg',
  'vimLineCommentFg',
];

function getNextVariantIndex(index: number, length: number): number {
  return (index + 1) % length;
}

function getPreviousVariantIndex(index: number, length: number): number {
  return (index - 1 + length) % length;
}

function getSwatchColors(colorscheme: Colorscheme | undefined): string[] {
  const background = colorscheme?.backgrounds[0];

  if (!colorscheme || !background) {
    return [];
  }

  const groups = colorscheme.data[background] ?? [];
  const colorByGroup = new Map(
    groups.map(group => [group.name, group.hexCode]),
  );
  const prioritizedColors = swatchGroupPriority
    .map(groupName => colorByGroup.get(groupName))
    .filter((color): color is string => Boolean(color));

  return Array.from(
    new Set([...prioritizedColors, ...groups.map(group => group.hexCode)]),
  ).slice(0, 10);
}

function getColorschemeStyle(
  colorscheme: Colorscheme | undefined,
): CSSProperties | undefined {
  const background = colorscheme?.backgrounds[0];

  if (!colorscheme || !background) {
    return undefined;
  }

  return colorscheme.data[background]?.reduce<CSSProperties>(
    (acc, group) => ({
      ...acc,
      [`--colorscheme-${group.name}`]: group.hexCode,
    }),
    {},
  );
}

function getVariantIndex(
  variants: Colorscheme[],
  colorschemeName?: string,
  background?: Background,
): number {
  const index = variants.findIndex(
    colorscheme =>
      colorscheme.name === colorschemeName &&
      colorscheme.backgrounds[0] === background,
  );

  return index === -1 ? 0 : index;
}

export const RepositoryPageHelper = {
  getColorschemeStyle,
  getNextVariantIndex,
  getPreviousVariantIndex,
  getSwatchColors,
  getVariantIndex,
};
