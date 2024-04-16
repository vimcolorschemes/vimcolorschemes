const Engines = { Vim: 'vim', Neovim: 'neovim' } as const;
export type Engine = (typeof Engines)[keyof typeof Engines];
export default Engines;
