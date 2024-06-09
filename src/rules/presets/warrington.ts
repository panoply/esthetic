import { merge } from 'utils/helpers';
import { Rules } from 'types';
import { defaults } from './default';

/**
 * Warrington Presets
 *
 * The `warrington` rule presets which are geared towards Shopify projects.
 */
export const warrington: Rules = merge(defaults, {
  preset: 'warrington',
  language: 'auto',
  preserveLine: 2,
  wrap: 0,
  liquid: {
    ignoreTagList: [ 'javascript' ],
    indentAttribute: true,
    lineBreakSeparator: 'after',
    quoteConvert: 'double'
  },
  markup: {
    attributeLineBreak: 1,
    commentNewline: true,
    commentDelimiter: 'consistent',
    delimiterTerminus: 'adapt',
    forceIndent: true,
    ignoreCSS: true,
    ignoreJSON: false,
    selfCloseSpace: true,
    selfCloseSVG: true,
    stripAttributeLines: true,
    quoteConvert: 'double',
    valueLineBreak: 'preserve'
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
