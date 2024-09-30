import type { Rules } from 'types';
import { merge } from 'utils/helpers';
import { defaults } from './default';

/**
 * Prettier Presets
 *
 * Rules which replicates the Prettier formatting style.
 * These also reflect the prettier-liquid plugin.
 */
export const prettier: Rules = merge(defaults, {
  preset: 'prettier',
  language: 'auto',
  preserveLine: 1,
  wrap: 80,
  liquid: {
    ignoreTagList: [ 'javascript' ],
    indentAttribute: true,
    lineBreakSeparator: 'after',
    dedentTagList: [ 'schema' ],
    quoteConvert: 'double'
  },
  markup: {
    attributeLineBreak: 2,
    commentDelimiter: 'consistent',
    commentIndent: true,
    delimiterTerminus: 2,
    forceIndent: true,
    ignoreJS: true,
    ignoreCSS: true,
    ignoreJSON: false,
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
