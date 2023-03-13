import { Rules } from 'types';

/**
 * Strict Presets
 *
 * The `recommended` rule presets which produce the most common
 * and expect formatted results.
 */
export const strict: Rules = {
  preset: 'strict',
  language: 'auto',
  preserveLine: 1,
  wrap: 0,
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
    attributeSort: true,
    attributeSortList: [
      'id',
      'class',
      'type',
      'name',
      'value',
      'href',
      'src'
    ],
    attributeCasing: 'lowercase-name',
    commentNewline: true,
    delimiterForce: true,
    forceAttribute: 1,
    forceLeadAttribute: true,
    forceIndent: true,
    ignoreCSS: false,
    ignoreJSON: false,
    ignoreJS: false,
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
    correct: true,
    quoteConvert: 'double',
    noLeadZero: true,
    sortProperties: true,
    sortSelectors: true
  }
};
