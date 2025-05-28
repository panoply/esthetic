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
