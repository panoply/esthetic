import type { LanguagePattern } from 'types/language';

export const markdown: LanguagePattern[] = [
  {
    pattern: /^(#){2,6}\s.+/,
    type: 'keyword'
  },
  {
    pattern: /^(?!!)(=|-){2,}(?<!>)$/,
    type: 'meta.module'
  },
  {
    pattern: /(!)?\[.+\]\(.+\)/,
    type: 'keyword'
  },
  {
    pattern: /\[.+\]\[.+\]/,
    type: 'keyword'
  },
  {
    pattern: /^\[.+\]:\s?(<)?(http)?/,
    type: 'keyword'
  },
  {
    pattern: /^(> .*)+/,
    type: 'macro'
  },
  {
    pattern: /^```([A-Za-z0-9#_]+)?$/,
    type: 'keyword'
  },
  {
    pattern: /^---$/,
    type: 'meta.module',
    nearTop: true
  }
];
