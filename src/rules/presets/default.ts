import { Rules } from 'types';

/**
 * Default Presets
 *
 * The default rules of Æsthetic from which all **presets** and
 * custom rules will be merged.
 */
export const defaults: Rules = {
  argumentLineBreak: 0,
  arrayFormat: 'default',
  attributeCasing: 'preserve',
  attributeLineBreak: false,
  attributePreserve: false,
  attributeSort: false,
  braceAllman: true,
  bracePadding: false,
  classListUnique: false,
  commentBracket: 'preserve',
  commentIndent: true,
  commentPreserve: false,
  delimiterPlacement: 'preserve',
  delimiterTrims: 'preserve',
  endComma: 'never',
  endNewline: false,
  filterLineBreak: 0,
  forceIndent: false,
  ignoreJSON: false,
  ignoreTagList: [],
  indentAttribute: true,
  indentChar: ' ',
  indentLevel: 0,
  indentSize: 2,
  language: 'auto',
  lineBreakLogical: 'before',
  lineBreakSeparator: 'before',
  lineTermination: 'LF',
  objectIndent: 'default',
  objectSort: false,
  preset: 'default',
  preserveLine: 2,
  selfCloseSlash: false,
  selfCloseSVG: false,
  singleQuote: 'preserve',
  stripAttributeLines: false,
  terminusBracket: false,
  textBoundInline: true,
  textPreserve: false,
  valueSpacing: 'preserve',
  wordWrap: 0
};
