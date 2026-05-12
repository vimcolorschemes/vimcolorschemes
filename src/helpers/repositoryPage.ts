import { CSSProperties } from 'react';

import { Colorscheme } from '@/models/colorscheme';

export type ActiveVariantIndexChange = (
  index: number | ((index: number) => number),
) => void;

const swatchGroupPriority = [
  'NormalBg',
  'NormalFg',
  'vimLineCommentFg',
  'vimStringFg',
  'vimFuncNameFg',
  'vimNumberFg',
  'vimCommandFg',
  'StatusLineBg',
  'CursorLineBg',
  'LineNrFg',
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
  ).slice(0, 6);
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

export const RepositoryPageHelper = {
  getColorschemeStyle,
  getNextVariantIndex,
  getPreviousVariantIndex,
  getSwatchColors,
};
