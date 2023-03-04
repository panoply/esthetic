import { Rules } from 'types';

/**
 * Warrington Presets
 *
 * The `warrington` rule presets which are geared towards
 * Shopify projects.
 */
export const warrington: Rules = {
  preset: 'warrington',
  language: 'auto',
  preserveLine: 2,
  wrap: 0,
  liquid: {
    forceLeadArgument: true,
    ignoreTagList: [ 'javascript' ],
    indentAttributes: true,
    lineBreakSeparator: 'after',
    quoteConvert: 'double'
  },
  markup: {
    commentNewline: true,
    delimiterForce: false,
    forceAttribute: 1,
    forceLeadAttribute: true,
    forceIndent: true,
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
    correct: true,
    quoteConvert: 'double'
  }
};
