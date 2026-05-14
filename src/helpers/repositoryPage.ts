import { CSSProperties } from 'react';

import { Colorscheme } from '@/models/colorscheme';

import { Background, Backgrounds } from '@/lib/backgrounds';

type VariantSearchParams = {
  colorscheme?: string | string[] | null;
  background?: string | string[] | null;
};

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

function getVariantIndexFromSearchParams(
  variants: Colorscheme[],
  searchParams: VariantSearchParams,
): number {
  return getVariantIndex(
    variants,
    getSearchParamValue(searchParams.colorscheme),
    getBackground(getSearchParamValue(searchParams.background)),
  );
}

function getSearchParamValue(
  value: string | string[] | null | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value ?? undefined;
}

function getBackground(value: string | undefined): Background | undefined {
  if (value === Backgrounds.Dark || value === Backgrounds.Light) {
    return value;
  }

  return undefined;
}

export const RepositoryPageHelper = {
  getColorschemeStyle,
  getNextVariantIndex,
  getPreviousVariantIndex,
  getSwatchColors,
  getVariantIndex,
  getVariantIndexFromSearchParams,
};
