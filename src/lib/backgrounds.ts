export const Backgrounds = { Light: 'light', Dark: 'dark' } as const;
export type Background = (typeof Backgrounds)[keyof typeof Backgrounds];
