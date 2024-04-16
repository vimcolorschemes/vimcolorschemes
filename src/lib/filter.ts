type Filter = Record<string, string | boolean>;

export const FilterOptionMap: Record<string, Filter> = {
  'e.vim': { 'vimColorSchemes.isLua': false },
  'e.neovim': { 'vimColorSchemes.isLua': true },
  'b.light': { 'vimColorSchemes.backgrounds': 'light' },
  'b.dark': { 'vimColorSchemes.backgrounds': 'dark' },
};

export default Filter;
