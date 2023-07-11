import merge from 'mergerino';
import { Rules } from 'types';

/**
 * Warrington Presets
 *
 * The `warrington` rule presets which are geared towards
 * Shopify projects.
 */
export const warrington: Rules = merge({
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
    commentNewline: true,
    delimiterTerminus: 'adapt',
    forceAttribute: 1,
    forceIndent: true,
    ignoreCSS: true,
    ignoreJSON: false,
    lineBreakValue: 'indent',
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
