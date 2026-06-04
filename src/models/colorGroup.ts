/**
 * Type for a color group definition.
 */
export type ColorGroup = {
  /**
   * Original vim color group name.
   */
  name: string;
  /**
   * Hex code for the color group.
   */
  hexCode: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  undercurl?: boolean;
  underdouble?: boolean;
  underdotted?: boolean;
  underdashed?: boolean;
  strikethrough?: boolean;
  reverse?: boolean;
};
