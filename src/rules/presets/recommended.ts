import { merge } from 'utils/helpers';
import { Rules } from 'types';

/**
 * Recommended Presets
 *
 * The `recommended` rule presets which produce the most common
 * and expect formatted results.
 */
export const recommended: Rules = merge({
  preset: 'recommended',
  language: 'auto',
  preserveLine: 2,
  wrap: 120,
  wrapFraction: 90,
  liquid: {
    ignoreTagList: [ 'javascript' ],
    indentAttribute: true,
    commentNewline: true,
    delimiterTrims: 'tags',
    lineBreakSeparator: 'after',
    quoteConvert: 'double',
    delimiterPlacement: 'consistent'
  },
  markup: {
    attributeCasing: 'lowercase-name',
    commentDelimiters: 'preserve',
    commentNewline: true,
    delimiterTerminus: 'adapt',
    forceAttribute: 2,
    forceIndent: true,
    ignoreCSS: false,
    ignoreJSON: false,
    lineBreakValue: 'indent',
    selfCloseSpace: true,
    selfCloseSVG: true,
    quoteConvert: 'double'
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
