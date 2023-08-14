import merge from 'mergerino';
import { Rules } from 'types';

/**
 * Prettier Presets
 *
 * Rules which replicates the Prettier formatting style.
 * These also reflect the prettier-liquid plugin.
 */
export const prettier: Rules = merge({
  preset: 'prettier',
  language: 'auto',
  preserveLine: 1,
  wrap: 80,
  wrapFraction: 60,
  liquid: {
    ignoreTagList: [ 'javascript' ],
    indentAttribute: true,
    lineBreakSeparator: 'after',
    dedentTagList: [ 'schema' ],
    quoteConvert: 'double'
  },
  markup: {
    commentDelimiters: 'consistent',
    commentIndent: true,
    delimiterTerminus: 'force',
    forceAttribute: 1,
    forceIndent: true,
    ignoreJS: true,
    ignoreCSS: true,
    ignoreJSON: false,
    lineBreakValue: 'force-indent',
    selfCloseSpace: true,
    selfCloseSVG: true,
    stripAttributeLines: true,
    quoteConvert: 'double'
  },
  json: {
    arrayFormat: 'indent',
    objectIndent: 'indent'
  },
  style: {
    commentIndent: false,
    quoteConvert: 'double'
  }
});
