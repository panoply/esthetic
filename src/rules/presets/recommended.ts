import type { Rules } from 'types';

import { merge } from 'utils/helpers';

import { defaults } from './default';

/**
 * Recommended Presets
 *
 * The `recommended` rule presets which produce the most common
 * and expect formatted results.
 */
export const recommended: Rules = merge(defaults, {
  preset: 'recommended',
  language: 'auto',
  preserveLine: 2,
  wrap: 120,
  liquid: {
    ignoreTagList: [ 'javascript' ],
    indentAttribute: true,
    delimiterTrims: 'preserve',
    lineBreakSeparator: 'after',
    quoteConvert: 'double',
    delimiterPlacement: 'consistent'
  },
  markup: {
    attributeLineBreak: 2,
    attributeCasing: 'lowercase-name',
    commentDelimiter: 'preserve',
    delimiterTerminus: false,
    forceIndent: true,
    ignoreCSS: false,
    ignoreJSON: false,
    selfCloseSpace: true,
    selfCloseSVG: true,
    quoteConvert: 'double',
    valueSpacing: 'preserve'
  },
  json: {
    arrayFormat: 'indent',
    objectIndent: 'indent'
  },
  style: {
    commentNewline: true,
    commentIndent: true,
    quoteConvert: 'double',
    noLeadZero: true,
    sortProperties: true
  }
});
