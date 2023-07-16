/* eslint-disable n/no-callback-literal */
import { Completions } from 'papyrus';

const types = {
  array: [
    'dedentTagList',
    'ignoreTagList'
  ],
  number: [
    'indentLevel',
    'indentSize',
    'preserveLine',
    'forceFilter',
    'forceArgument'
  ],
  boolean: [
    'endNewline',
    'crlf',
    'atRuleSpace',
    'classPadding',
    'noLeadZero',
    'sortSelectors',
    'sortProperties',
    'braceAllman',
    'bracePadding',
    'objectSort',
    'commentNewline',
    'commentIndent',
    'indentAttribute',
    'normalizeSpacing',
    'preserveComment',
    'preserveInternal',
    'preserveText',
    'preserveAttribute',
    'ignoreCSS',
    'ignoreJSON',
    'ignoreJS',
    'forceIndent',
    'stripAttributeLines',
    'selfCloseSpace'
  ]
};

const cache = {
  global: [
    'crlf',
    'preset',
    'language',
    'endNewline',
    'indentChar',
    'indentLevel',
    'indentSize',
    'preserveLine',
    'wrap',
    'wrapFraction'
  ],
  json: [
    'arrayFormat',
    'braceAllman',
    'bracePadding',
    'objectIndent',
    'objectSort'
  ],
  style: [
    'commentIndent',
    'commentNewline',
    'atRuleSpace',
    'classPadding',
    'noLeadZero',
    'preserveComment',
    'sortSelectors',
    'sortProperties',
    'quoteConvert'
  ],
  liquid: [
    'commentNewline',
    'commentIndent',
    'delimiterTrims',
    'delimiterPlacement',
    'forceFilter',
    'forceArgument',
    'ignoreTagList',
    'indentAttribute',
    'lineBreakSeparator',
    'normalizeSpacing',
    'preserveComment',
    'preserveInternal',
    'dedentTagList',
    'quoteConvert'
  ],
  markup: [
    'attributeCasing',
    'attributeSort',
    'commentNewline',
    'commentIndent',
    'delimiterTerminus',
    'forceAttribute',
    'forceAttributeValue',
    'forceIndent',
    'ignoreCSS',
    'ignoreJS',
    'ignoreJSON',
    'lineBreakValue',
    'preserveComment',
    'preserveText',
    'preserveAttribute',
    'selfCloseSpace',
    'selfCloseSVG',
    'stripAttributeLines',
    'quoteConvert'
  ]
};

function contextCheck (input: string, options: string[]) {

  const prev = input.lastIndexOf('\n');
  const quote = input.indexOf('"', prev);
  const last = input.slice(quote + 1, input.indexOf('"', quote + 1));

  return options.includes(last);

}

export default <Completions[]>[

  /* -------------------------------------------- */
  /* GLOBAL RULES                                 */
  /* -------------------------------------------- */

  {
    match: /" *(\w*)"?$/,
    context: (beforeCursor) => {
      if (/"(liquid|markup|style|json|script)":\s*\{/.test(beforeCursor)) return false;
      return true;
    },
    cache: true,
    id: 'global',
    search: (term, callback) => callback(cache.global.filter(tag => tag.indexOf(term) > -1)),
    replace: (result: string) => `"${result}`
  },

  /* -------------------------------------------- */
  /* WARPPING VALUES                              */
  /* -------------------------------------------- */

  {
    match: /: *(\w*)$/,
    index: 1,
    cache: false,
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'wrap', 'wrapFraction' ]),
    replace: (result: string) => `: ${result}`,
    search: (term, callback) => callback(term.length >= 1 ? [
      '0',
      '50',
      '60',
      '70',
      '80',
      '90',
      '100',
      '110',
      '120'
    ].filter(tag => tag.indexOf(term) > -1) : [
      '0',
      '50',
      '60',
      '70',
      '80',
      '90',
      '100',
      '110',
      '120'
    ])
  },

  /* -------------------------------------------- */
  /* NUMBER VALUES                                */
  /* -------------------------------------------- */

  {
    match: /: *(\w*)$/,
    index: 1,
    cache: false,
    context: (beforeCursor: string) => contextCheck(beforeCursor, types.number),
    replace: (result: string) => `: ${result}`,
    search: (term, callback) => callback(term.length === 1 ? [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10'
    ].filter(tag => tag[0] === term[0]) : [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10'
    ])
  },

  /* -------------------------------------------- */
  /* ARRAY VALUES                                 */
  /* -------------------------------------------- */

  {
    match: /: *(\w*)$/,
    index: 1,
    cache: false,
    context: (beforeCursor: string) => contextCheck(beforeCursor, types.array),
    replace: (result: string) => `: ${result}`,
    search: (term, callback) => callback([ '[]' ])
  },

  /* -------------------------------------------- */
  /* BOOLEAN VALUES                               */
  /* -------------------------------------------- */

  {
    match: /: *(\w*)$/,
    index: 1,
    cache: false,
    context: (beforeCursor: string) => contextCheck(beforeCursor, types.boolean),
    replace: (result: string) => `: ${result}`,
    search: (term, callback) => callback(term.length >= 1 ? [
      'true',
      'false'
    ].filter(tag => tag[0] === term[0]) : [
      'true',
      'false'
    ])
  },

  /* -------------------------------------------- */
  /* INDENT CHARACTER                             */
  /* -------------------------------------------- */

  {
    match: /: *(\w*)$/,
    index: 1,
    cache: false,
    id: 'indentChar',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'indentChar' ]),
    replace: (result: string) => `: ${result}`,
    search: (term, callback) => callback([
      '" "',
      '"\\t"'
    ])
  },

  /* -------------------------------------------- */
  /* FORCE ATTRIBUTE                              */
  /* -------------------------------------------- */

  {
    match: /: *([\d\w]*)$/,
    index: 1,
    cache: false,
    id: 'forceAttribute',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'forceAttribute' ]),
    replace: (result: string) => `: ${result}`,
    search: (term, callback) => callback(/\d/.test(term) ? [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6'
    ].filter(n => n === term) : term.length >= 2 ? [
      'true',
      'false'
    ].filter(tag => tag[0] === term[0]) : [
      'true',
      'false',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6'
    ])
  },
  {
    match: /" *(\w*)"?$/,
    index: 1,
    cache: true,
    id: 'markup',
    context: (beforeCursor: string) => {

      if (/"markup":\s*\{[\S\s]*?\}/.test(beforeCursor)) return false;
      if (/"markup":\s*\{/.test(beforeCursor)) return (/:\s*("\w*")?$/).test(beforeCursor) === false;

      return false;

    },
    replace: (result: string) => `"${result}`,
    search: (term: string, callback: ((param: string[]) => void)) => callback(
      [
        'attributeCasing',
        'attributeSort',
        'commentNewline',
        'commentIndent',
        'delimiterTerminus',
        'forceAttribute',
        'forceAttributeValue',
        'forceIndent',
        'ignoreCSS',
        'ignoreJS',
        'ignoreJSON',
        'lineBreakValue',
        'preserveComment',
        'preserveText',
        'preserveAttribute',
        'selfCloseSpace',
        'selfCloseSVG',
        'stripAttributeLines',
        'quoteConvert'
      ].filter(tag => tag.indexOf(term) > -1)
    )

  },

  /* -------------------------------------------- */
  /* LIQUID RULES                                 */
  /* -------------------------------------------- */

  {
    match: /" *(\w*)"?$/,
    index: 1,
    cache: true,
    id: 'liquid',
    context: (beforeCursor: string) => {

      if (/"liquid":\s*\{[\S\s]*?\}/.test(beforeCursor)) return false;
      if (/"liquid":\s*\{/.test(beforeCursor)) return (/:\s*("\w*")?$/).test(beforeCursor) === false;

      return false;

    },
    replace: (result: string) => `"${result}`,
    search: (term: string, callback: ((param: string[]) => void)) => callback(
      [
        'commentNewline',
        'commentIndent',
        'delimiterTrims',
        'delimiterPlacement',
        'forceFilter',
        'forceArgument',
        'ignoreTagList',
        'indentAttribute',
        'lineBreakSeparator',
        'normalizeSpacing',
        'preserveComment',
        'preserveInternal',
        'dedentTagList',
        'quoteConvert'
      ].filter(tag => tag.indexOf(term) > -1)
    )

  },

  /* -------------------------------------------- */
  /* JSON RULES                                   */
  /* -------------------------------------------- */

  {
    match: /" *(\w*)"?$/,
    index: 1,
    cache: true,
    id: 'json',
    context: (beforeCursor: string) => {

      if (/"json":\s*\{[\S\s]*?\}/.test(beforeCursor)) return false;
      if (/"json":\s*\{/.test(beforeCursor)) return (/:\s*("\w*")?$/).test(beforeCursor) === false;

      return false;

    },
    replace: (result: string) => `"${result}`,
    search: (term: string, callback: ((param: string[]) => void)) => callback(
      [
        'arrayFormat',
        'braceAllman',
        'bracePadding',
        'objectIndent',
        'objectSort'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* STYLE RULES                                  */
  /* -------------------------------------------- */
  {
    match: /" *(\w*)"?$/,
    index: 1,
    cache: true,
    id: 'style',
    context: (beforeCursor: string) => {

      if (/"style":\s*\{[\S\s]*?\}/.test(beforeCursor)) return false;
      if (/"style":\s*\{/.test(beforeCursor)) return (/:\s*("\w*")?$/).test(beforeCursor) === false;

      return false;

    },
    replace: (result: string) => `"${result}`,
    search: (term: string, callback: ((param: string[]) => void)) => callback(
      [
        'commentIndent',
        'commentNewline',
        'atRuleSpace',
        'classPadding',
        'noLeadZero',
        'preserveComment',
        'sortSelectors',
        'sortProperties',
        'quoteConvert'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* QUOTE CONVERT                                */
  /* -------------------------------------------- */

  {
    match: /:\s*"? *(\w*)$/,
    index: 1,
    cache: true,
    id: 'quoteConvert',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'quoteConvert' ]),
    replace: (result: string) => `: "${result}`,
    search: (term, callback) => callback(
      [
        'none',
        'double',
        'single'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* ARRAY FORMAT AND OBJECT INDENT               */
  /* -------------------------------------------- */

  {
    match: /:\s*"? *([[\w]*)$/,
    index: 1,
    cache: true,
    id: 'arrayFormat',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'arrayFormat', 'objectIndent' ]),
    replace: (result: string) => `: "${result}`,
    search: (term, callback) => callback(
      [
        'default',
        'inline',
        'indent'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* DELIMITER TERMINUS                           */
  /* -------------------------------------------- */

  {
    match: /:\s*"? *([[\w]*)$/,
    index: 1,
    cache: true,
    id: 'delimiterTerminus',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'delimiterTerminus' ]),
    replace: (result: string) => `: "${result}`,
    search: (term, callback) => callback(
      [
        'inline',
        'force',
        'adapt'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* ATTRIBUTE CASING                             */
  /* -------------------------------------------- */

  {
    match: /:\s*"? *([[\w]*)"?$/,
    index: 1,
    cache: true,
    id: 'attributeCasing',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'attributeCasing' ]),
    replace: (result: string) => `: "${result}`,
    search: (term, callback) => callback(
      [
        'preserve',
        'lowercase',
        'lowercase-name',
        'lowercase-value'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* ATTRIBUTE SORT                               */
  /* -------------------------------------------- */

  {
    match: /:\s*"? *([[\w]*)"$/,
    index: 1,
    cache: true,
    id: 'attributeSort',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'attributeSort' ]),
    replace: (result: string) => `: ${result}`,
    search: (term, callback) => callback(
      [
        'true',
        'false',
        '[]'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* DELIMITER PLACEMENT                          */
  /* -------------------------------------------- */

  {
    match: /:\s*"? *(\w*)"$/,
    index: 1,
    cache: true,
    id: 'delimiterPlacement',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'delimiterPlacement' ]),
    replace: (result: string) => `: "${result}`,
    search: (term, callback) => callback(
      [
        'default',
        'inline',
        'preserve',
        'consistent',
        'force',
        'force-multiline'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* DELIMITER TRIMS                              */
  /* -------------------------------------------- */

  {
    match: /:\s*"? *(\w*)"$/,
    index: 1,
    cache: true,
    id: 'delimiterTrims',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'delimiterTrims' ]),
    replace: (result: string) => `: "${result}`,
    search: (term, callback) => callback(
      [
        'preserve',
        'never',
        'always',
        'tags',
        'outputs',
        'multiline'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* LANGUAGE                                     */
  /* -------------------------------------------- */

  {
    match: /:\s*"? *(\w*)$/,
    index: 1,
    cache: true,
    id: 'language',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'language' ]),
    replace: (result: string) => `: "${result}`,
    search: (term, callback) => callback(
      [
        'auto',
        'text',
        'html',
        'liquid',
        'javascript',
        'jsx',
        'typescript',
        'tsx',
        'json',
        'css',
        'scss',
        'less',
        'xml',
        'unknown'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  },

  /* -------------------------------------------- */
  /* PRESET                                       */
  /* -------------------------------------------- */

  {
    match: /:\s*"? *(\w*)$/,
    index: 1,
    cache: true,
    id: 'preset',
    context: (beforeCursor: string) => contextCheck(beforeCursor, [ 'preset' ]),
    replace: (result: string) => `: "${result}`,
    search: (term, callback) => callback(
      [
        'default',
        'warrington',
        'strict',
        'recommended',
        'prettier'
      ].filter(tag => tag.indexOf(term) > -1)
    )
  }

];
