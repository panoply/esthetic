import { Rules } from 'types';

const r = {
  crlf: false,
  preset: 'default',
  language: 'auto',
  endNewline: false,
  indentChar: ' ',
  indentLevel: 0,
  indentSize: 2,
  preserveLine: 2,
  wordWrap: 0,
  commentIndent: true,
  commentPreserve: false,
  forceIndent: false,
  quoteConvert: 'none',
  attributeCasing: 'preserve',
  attributeSort: false,
  attributeLineBreak: 3,
  attributePreserve: false,
  argumentLineBreak: 0,
  classListSort: false,
  classListUnique: false,
  commentDelimiter: 'preserve',
  delimiterTrims: 'preserve',
  delimiterPlacement: 'preserve',
  bracketTerminus: false,
  filterLineBreak: 0,
  indentAttribute: true,
  lineBreakSeparator: 'before',
  lineBreakLogical: 'before',
  paddedTagList: [],
  dedentTagList: [],
  ignoreTagList: [],
  ignoreJSON: false,
  selfCloseSpace: true,
  selfCloseSVG: true,
  stripTextWrapLines: false,
  stripAttributeLines: false,
  textNodeList: [],
  textBoundInline: true,
  textPreserve: false,
  valueSpacing: 'preserve',
  arrayFormat: 'default',
  braceAllman: false,
  bracePadding: false,
  endComma: 'never',
  objectIndent: 'default',
  objectSort: false
};

const newDefaults = {
  crlf: false,
  preset: 'default',
  language: 'auto',
  endNewline: false,
  indentChar: ' ',
  indentLevel: 0,
  indentSize: 2,
  preserveLine: 2,
  wordWrap: 0,

  // HTML + LIQUID + JSON
  commentIndent: true,
  commentPreserve: false,
  forceIndent: false,

  quoteConvert: 'none',

  // HTML
  attributeCasing: 'preserve',
  attributeSort: false,
  attributeLineBreak: 3,
  attributePreserve: false,

  // LIQUID
  argumentLineBreak: 0,

  // HTML
  classListSort: false,
  classListUnique: false,

  // HTML
  commentDelimiter: 'preserve',

  delimiterTrims: 'preserve',
  delimiterPlacement: 'preserve',

  // HTML
  bracketTerminus: false,

  // LIQUID
  filterLineBreak: 0,
  indentAttribute: true,
  lineBreakSeparator: 'before',
  lineBreakLogical: 'before',
  paddedTagList: [],
  dedentTagList: [],
  ignoreTagList: [],

  // HTML + LIQUID
  ignoreJSON: false,
  selfCloseSpace: true,
  selfCloseSVG: true,
  stripTextWrapLines: false,
  stripAttributeLines: false,
  textNodeList: [],
  textBoundInline: true,
  textPreserve: false,
  valueSpacing: 'preserve',

  // JSON
  arrayFormat: 'default',
  braceAllman: false,
  bracePadding: false,
  endComma: 'never',
  objectIndent: 'default',
  objectSort: false
};

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
  selfCloseSpace: true,
  selfCloseSVG: false,
  singleQuote: 'preserve',
  stripAttributeLines: false,
  terminusBracket: false,
  textBoundInline: true,
  textPreserve: false,
  valueSpacing: 'preserve',
  wordWrap: 0
};
