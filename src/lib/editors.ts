const Editors = { Vim: 'vim', Neovim: 'neovim' } as const;
export type Editor = (typeof Editors)[keyof typeof Editors];
export default Editors;
