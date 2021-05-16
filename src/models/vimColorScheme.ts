export interface VimColorScheme {
  name: string;
  valid: boolean;
  data: VimColorSchemeData | null;
}

export interface VimColorSchemeData {
  light: VimColorSchemeGroup[] | null;
  dark: VimColorSchemeGroup[] | null;
}

export interface VimColorSchemeGroup {
  name: string;
  hexCode: string;
}
