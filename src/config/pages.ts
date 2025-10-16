export const PAGES = {
  home: { path: '/' },
  menu: { path: '/menu' },
  info: { path: '/info' },
  contact: { path: '/contact' },
} as const;

export type PageKey = keyof typeof PAGES;
