import type { LanguagePattern } from 'types/language';

export const json: LanguagePattern[] = [
  {
    pattern: /^[{[]$/,
    type: 'meta.module',
    nearTop: true
  },
  {
    pattern: /^\s*".+":\s*(".+"|[0-9]+|null|true|false)(,)?$/,
    type: 'keyword'
  },
  {
    pattern: /^\s*".+":\s*(\{|\[)$/,
    type: 'keyword'
  },
  {
    pattern: /^\s*".+":\s*\{(\s*".+":\s*(".+"|[0-9]+|null|true|false)(,)?\s*){1,}\}(,)?$/,
    type: 'keyword'
  },
  {
    pattern: /\s*".+"\s*\[\s*((".+"|[0-9]+|null|true|false)(,)?\s*){1,}\](,)?$/,
    type: 'keyword'
  }
];
