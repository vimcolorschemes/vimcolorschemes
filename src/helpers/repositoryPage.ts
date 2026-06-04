import { CSSProperties } from 'react';

import { ColorGroup } from '@/models/colorGroup';
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

type ColorschemeStyle = CSSProperties & Record<string, string>;

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
  selectedBackground?: Background,
): CSSProperties | undefined {
  const background = selectedBackground ?? colorscheme?.backgrounds[0];

  if (!colorscheme || !background) {
    return undefined;
  }

  return colorscheme.data[background]?.reduce<ColorschemeStyle>(
    (acc, group) => ({
      ...acc,
      ...getColorGroupStyle(group),
    }),
    {},
  );
}

function getColorGroupStyle(group: ColorGroup): ColorschemeStyle {
  const style: ColorschemeStyle = {
    [`--colorscheme-${group.name}`]: group.hexCode,
  };

  if (group.bold) {
    style[`--colorscheme-${group.name}-font-weight`] = '700';
  }

  if (group.italic) {
    style[`--colorscheme-${group.name}-font-style`] = 'italic';
  }

  const hasUnderline =
    group.underline ||
    group.undercurl ||
    group.underdouble ||
    group.underdotted ||
    group.underdashed;
  const decorationLine = [
    hasUnderline ? 'underline' : null,
    group.strikethrough ? 'line-through' : null,
  ]
    .filter(Boolean)
    .join(' ');

  if (decorationLine) {
    style[`--colorscheme-${group.name}-text-decoration-line`] = decorationLine;
    style[`--colorscheme-${group.name}-text-decoration-style`] =
      getTextDecorationStyle(group);
  }

  if (group.reverse) {
    style[`--colorscheme-${group.name}-color`] =
      'var(--colorscheme-NormalBg, var(--background))';
    style[`--colorscheme-${group.name}-background`] = group.hexCode;
  }

  return style;
}

function getTextDecorationStyle(group: ColorGroup): string {
  if (group.undercurl) return 'wavy';
  if (group.underdouble) return 'double';
  if (group.underdotted) return 'dotted';
  if (group.underdashed) return 'dashed';
  return 'solid';
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
  getColorGroupStyle,
  getColorschemeStyle,
  getNextVariantIndex,
  getPreviousVariantIndex,
  getSwatchColors,
  getVariantIndex,
  getVariantIndexFromSearchParams,
};
