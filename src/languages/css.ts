import type { LanguagePattern } from 'types/language';

export const css: LanguagePattern[] = [
  {
    pattern: /[a-z-]+:(?!:).+;/,
    type: 'keyword'
  },
  {
    pattern: /<(\/)?style>/,
    type: 'not'
  }
];
