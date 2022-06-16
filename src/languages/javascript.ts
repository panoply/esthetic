import type { LanguagePattern } from 'types/language';

export const javascript: LanguagePattern[] = [
  {
    pattern: /undefined/g,
    type: 'keyword'
  },
  {
    pattern: /window\./g,
    type: 'keyword'
  },
  {
    pattern: /console\.log\s*\(/,
    type: 'keyword.print'
  },
  {
    pattern: /(var|const|let)\s+\w+\s*=?/,
    type: 'keyword.variable'
  },
  {
    pattern: /(('|").+('|")\s*|\w+):\s*[{[]/,
    type: 'constant.array'
  },
  {
    pattern: /===/g,
    type: 'keyword.operator'
  },
  {
    pattern: /!==/g,
    type: 'keyword.operator'
  },
  {
    pattern: /function\*?\s*([A-Za-z$_][\w$]*)?\s*[(][^:;()]*[)]\s*{/g,
    type: 'keyword.function'
  },
  {
    pattern: /\(* => {/g,
    type: 'keyword.function'
  },
  {
    pattern: /null/g,
    type: 'constant.null'
  },
  {
    pattern: /\(.*\)\s*=>\s*.+/,
    type: 'keyword.control'
  },
  {
    pattern: /(else )?if\s+\(.+\)/,
    type: 'keyword.control'
  },
  {
    pattern: /while\s+\(.+\)/,
    type: 'keyword.control'
  },
  {
    pattern: /\*\w+/,
    type: 'not'
  },
  {
    pattern: /<(\/)?script( type=('|")text\/javascript('|"))?>/,
    type: 'not'
  },
  {
    pattern: /<(\/)?style>/,
    type: 'not'
  },
  {
    pattern: /fn\s[A-Za-z0-9<>,]+\(.*\)\s->\s\w+(\s\{|)/,
    type: 'not'
  },
  {
    pattern: /{%-?\s*(end)?(schema|style(sheet)?|javascript)\s*-?%}/,
    type: 'not'
  },
  {
    pattern: /(var|const|let)\s+\w+:\s*(string|number|boolean|string)(?:\[\])?/,
    type: 'not'
  },
  {
    pattern: /(interface|type)\s+\w+?/,
    type: 'not'
  },
  {
    pattern: /(declare|namespace)\s+\w+?/,
    type: 'not'
  }
];
