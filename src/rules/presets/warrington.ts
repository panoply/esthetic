import { Rules } from 'types';
import { merge } from 'utils/helpers';

import { defaults } from './default';

/**
 * Warrington Presets
 *
 * The `warrington` rule presets which are geared towards Shopify projects.
 */
export const warrington: Rules = merge(defaults, {
  arrayFormat: 'indent',
  attributeLineBreak: 2,
  endNewline: true,
  language: 'auto',
  lineBreakLogical: 'after',
  lineBreakSeparator: 'after',
  objectIndent: 'indent',
  preset: 'prettier',
  preserveLine: 1,
  selfCloseSVG: true,
  singleQuote: 'never',
  stripAttributeLines: true,
  terminusBracket: 2,
  textBoundInline: false,
  wordWrap: 80
});
