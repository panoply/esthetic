import merge from 'mergerino';
import { Rules } from 'types';

/**
 * Strict Presets
 *
 * The `recommended` rule presets which produce the most common
 * and expect formatted results.
 */
export const strict: Rules = merge({
  preset: 'strict',
  language: 'auto',
  preserveLine: 1,
  wrap: 0,
  wrapFraction: 80,
  liquid: {
    ignoreTagList: [],
    commentNewline: true,
    delimiterTrims: 'never',
    lineBreakSeparator: 'before',
    quoteConvert: 'double',
    forceArgument: 3,
    forceFilter: 4,
    delimiterPlacement: 'consistent'
  },
  markup: {
    attributeSort: [
      'id',
      'class',
      'type',
      'name',
      'value',
      'href',
      'src'
    ],
    attributeCasing: 'lowercase-name',
    commentDelimiters: 'force',
    commentNewline: true,
    delimiterTerminus: 'adapt',
    forceAttribute: 1,
    forceIndent: true,
    ignoreCSS: false,
    ignoreJSON: false,
    ignoreJS: false,
    lineBreakValue: 'force-indent',
    selfCloseSpace: true,
    selfCloseSVG: true,
    stripAttributeLines: true,
    quoteConvert: 'double'
  },
  json: {
    arrayFormat: 'indent',
    objectIndent: 'indent',
    objectSort: true
  },
  style: {
    commentNewline: true,
    commentIndent: true,
    quoteConvert: 'double',
    noLeadZero: true,
    sortProperties: true,
    sortSelectors: true
  }
});
