import type { Rules } from 'types';

import { merge } from 'utils/helpers';

import { defaults } from './default';

/**
 * Aesthetic Presets
 */
export const aesthetic: Rules = merge(defaults, {
  argumentLineBreak: 3,
  arrayFormat: 'indent',
  attributeLineBreak: 3,
  attributeCasing: 'lowercase-name',
  classListUnique: true,
  commentBracket: 'inline-align',
  delimiterPlacement: 'consistent',
  endNewline: true,
  filterLineBreak: 3,
  forceIndent: false,
  language: 'auto',
  objectIndent: 'indent',
  preset: 'aesthetic',
  preserveLine: 2,
  selfCloseSVG: true,
  singleQuote: 'liquid',
  stripAttributeLines: true,
  terminusBracket: 5,
  valueSpacing: 'preserve',
  wordWrap: 120
});
