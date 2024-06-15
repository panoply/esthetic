import { merge } from 'utils/helpers';
import { Rules } from 'types';
import { defaults } from './default';

/**
 * Strict Presets
 *
 * The `strict` ruleset.
 */
export const strict: Rules = merge(defaults, {
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
    argumentLineBreak: 3,
    filterLineBreak: 4,
    delimiterPlacement: 'consistent'
  },
  markup: {
    attributeLineBreak: 2,
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
    commentDelimiter: 'force',
    commentNewline: true,
    classListUnique: true,
    delimiterTerminus: false,
    forceIndent: true,
    forceInline: 3,
    ignoreCSS: false,
    ignoreJSON: false,
    ignoreJS: false,
    selfCloseSpace: true,
    selfCloseSVG: true,
    stripAttributeLines: true,
    stripTextWrapLines: true,
    quoteConvert: 'double',
    valueSpacing: 'equipoise'
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
