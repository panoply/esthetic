export interface Definition {
  /**
   * The default setting
   */
  default: boolean | string[] | string | number;
  /**
   * Rules description
   */
  description: string;
  /**
   * Type
   */
  type: 'boolean' | 'array' | 'number' | 'string' | 'select';
  /**
   * The name of the rule
   */
  rule: string;
  /**
   * An optional list of pre-selected rule values.
   */
  values?: {
    /**
     * The rule value
     */
    rule: string;
    /**
     * Rule value description
     */
    description: string;
  }[]
}

export const defs: {
  markup: Definition[];
  style: Definition[];
  json: Definition[];
  script: Definition[];
} = {
  markup: [
    {
      default: 0,
      description: 'Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.',
      rule: 'wrap',
      type: 'number'
    },
    {
      default: ' ',
      description: 'The string characters to comprise a single indentation. Any string combination is accepted.',
      rule: 'indentChar',
      type: 'string'
    },
    {
      default: false,
      description: 'If line termination should be Windows (CRLF) format. Unix (LF) format is the default.',
      rule: 'crlf',
      type: 'boolean'
    },
    {
      default: 2,
      description: 'The number of "indentChar" values to comprise a single indentation.',
      rule: 'indentSize',
      type: 'number'
    },
    {
      default: false,
      description: 'Automatically correct some sloppiness in code.',
      rule: 'attemptCorrection',
      type: 'boolean'
    },
    {
      default: false,
      description: 'Alphanumerically sort markup attributes. Attribute sorting is ignored on tags that contain attributes template attributes.',
      rule: 'attributeSort',
      type: 'boolean'
    },
    {
      default: [],
      description: "A comma separated list of attribute names. Attributes will be sorted according to this list and then alphanumerically. This option requires 'attributeSort' have a value of true.",
      rule: 'attributeSortList',
      type: 'array'
    },
    {
      default: false,
      description: 'This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.',
      rule: 'commentIndent',
      type: 'boolean'
    },
    {
      default: false,
      description: 'Prevent comment reformatting due to option wrap.',
      rule: 'preserveComment',
      type: 'boolean'
    },
    {
      default: false,
      description: 'If all markup attributes should be indented each onto their own line.',
      rule: 'forceAttribute',
      type: 'boolean'
    },
    {
      default: false,
      description: 'Will force indentation upon all content and tags without regard for the creation of new text nodes.',
      rule: 'forceIndent',
      type: 'boolean'
    },
    {
      default: false,
      description: 'Insert an empty line at the end of output.',
      rule: 'endNewline',
      type: 'boolean'
    },
    {
      default: false,
      description: 'If markup tags should have their insides preserved. This option is only available to markup and does not support child tokens that require a different lexer.',
      rule: 'preserveAttributes',
      type: 'boolean'
    },
    {
      default: 3,
      description: 'The maximum number of consecutive empty lines to retain.',
      rule: 'preserveLine',
      type: 'number'
    },
    {
      default: false,
      description: 'If text in the provided markup code should be preserved exactly as provided. This option eliminates beautification and wrapping of text content.',
      rule: 'preserveText',
      type: 'boolean'
    },
    {
      default: false,
      description: 'Markup self-closing tags end will end with " />" instead of "/>".',
      rule: 'selfCloseSpace',
      type: 'boolean'
    }
  ],
  style: [
    {
      default: 0,
      description: 'Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.',
      rule: 'wrap',
      type: 'number'
    },
    {
      default: ' ',
      description: 'The string characters to comprise a single indentation. Any string combination is accepted.',
      rule: 'indentChar',
      type: 'string'
    },
    {
      default: 2,
      description: 'The number of "indentChar" values to comprise a single indentation.',
      rule: 'indentSize',
      type: 'number'
    },
    {
      rule: 'braceAllman',
      default: false,
      description: 'Determines if opening curly braces will exist on the same line as their condition or be forced onto a new line. (Allman style indentation).',
      type: 'boolean'
    },
    {
      rule: 'inlineSelectors',
      default: false,
      type: 'boolean',
      description: 'If comma separated CSS selectors should present on a single line of code.'
    },
    {
      rule: 'classPadding',
      description: 'Inserts new line characters between every CSS code block.',
      default: false,
      type: 'boolean'
    },
    {
      rule: 'compressedCSS',
      description: 'If CSS should be beautified in a style where the properties and values are minifed for faster reading of selectors.',
      default: false,
      type: 'boolean'
    },
    {
      default: ' ',
      description: 'The string characters to comprise a single indentation. Any string combination is accepted.',
      rule: 'indentChar',
      type: 'string'
    },
    {
      default: 2,
      description: 'The number of "indentChar" values to comprise a single indentation.',
      rule: 'indentSize',
      type: 'number'
    },
    {
      default: false,
      description: 'Insert an empty line at the end of output.',
      rule: 'endNewline',
      type: 'boolean'
    },
    {
      rule: 'noLeadZero',
      description: 'This will eliminate leading zeros from numbers expressed within values.',
      default: false,
      type: 'boolean'
    },
    {
      rule: 'sortProperties',
      description: 'This option will alphabetically sort CSS properties contained within classes.',
      default: false,
      type: 'boolean'
    },
    {
      default: 3,
      description: 'The maximum number of consecutive empty lines to retain.',
      rule: 'preserveLine',
      type: 'number'
    },
    {
      rule: 'quoteConvert',
      description: 'If the quotes of markup attributes should be converted to single quotes or double quotes.',
      type: 'select',
      default: 'none',
      values: [
        {
          rule: 'none',
          description: 'Ignores this option'
        },
        {
          rule: 'single',
          description: 'Converts double quotes to single quotes'
        },
        {
          rule: 'double',
          description: 'Converts single quotes to double quotes'
        }
      ]
    },
    {
      default: 0,
      description: 'Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.',
      rule: 'wrap',
      type: 'number'
    }
  ],
  script: [
    {
      default: 0,
      description: 'Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.',
      rule: 'wrap',
      type: 'number'
    },
    {
      default: ' ',
      description: 'The string characters to comprise a single indentation. Any string combination is accepted.',
      rule: 'indentChar',
      type: 'string'
    },
    {
      default: 2,
      description: 'The number of "indentChar" values to comprise a single indentation.',
      rule: 'indentSize',
      type: 'number'
    },
    {
      default: false,
      description: 'Automatically correct some sloppiness in code.',
      rule: 'attemptCorrection',
      type: 'boolean'
    },
    {
      rule: 'arrayFormat',
      description: 'Determines if all array indexes should be indented, never indented, or left to the default',
      type: 'select',
      default: 'default',
      values: [
        {
          rule: 'default',
          description: 'Default formatting'
        },
        {
          rule: 'indent',
          description: 'Always indent each index of an array'
        },
        {
          rule: 'inline',
          description: 'Ensure all array indexes appear on a single line'
        }
      ]
    },
    {
      rule: 'braceAllman',
      default: false,
      description: 'Determines if opening curly braces will exist on the same line as their condition or be forced onto a new line. (Allman style indentation).',
      type: 'boolean'
    },
    {
      rule: 'bracePadding',
      default: false,
      description: 'This will create a newline before and after objects values',
      type: 'boolean'
    },
    {
      rule: 'braceNewline',
      default: false,
      description: 'If true an empty line will be inserted after opening curly braces and before closing curly braces.',
      type: 'boolean'
    },
    {
      rule: 'braceStyle',
      default: 'none',
      description: 'Emulates JSBeautify\'s brace_style option using existing Prettify options',
      type: 'select',
      values: [
        {
          rule: 'none',
          description: 'Ignores this option'
        },
        {
          rule: 'collapse',
          description: 'Sets `formatObject` to indent and `neverflatten` to true.'
        },
        {
          rule: 'collapse-preserve-inline',
          description: 'Sets `brace_padding` to true and `formatObject` to `inline`.'
        },
        {
          rule: 'expand',
          description: 'Sets `braces` to `true`, `format_object` to `indent`, and `neverflatten` to `true`'
        }
      ]
    },
    {
      rule: 'objectSort',
      default: false,
      description: 'This option will alphabetically sort object properties in JSON objects',
      type: 'boolean'
    },
    {
      rule: 'objectIndent',
      default: false,
      description: 'This option will alphabetically sort object properties in JSON objects',
      type: 'select',
      values: [
        {
          rule: 'default',
          description: 'Default formatting'
        },
        {
          rule: 'indent',
          description: 'Always indent each index of an array'
        },
        {
          rule: 'inline',
          description: 'Ensure all array indexes appear on a single line'
        }
      ]
    },
    {
      default: false,
      description: 'If a blank new line should be forced above comments.',
      rule: 'commentNewline',
      type: 'boolean'
    },
    {
      rule: 'commentIndent',
      default: false,
      type: 'boolean',
      description: 'This will determine whether comments should always start at position `0` of each line or if comments should be indented according to the code.'
    },
    {
      rule: 'preserveComment',
      default: false,
      type: 'boolean',
      description: 'Prevent comment reformatting due to option wrap.'
    },
    {
      rule: 'caseSpace',
      default: false,
      type: 'boolean',
      description: 'If the colon separating a case\'s expression (of a switch/case block) from its statement should be followed by a space instead of indentation thereby keeping the case on a single line of code.'
    },
    {
      rule: 'ifReturnInline',
      default: true,
      type: 'boolean',
      description: 'Allows an `if ()` condition expression to return inline'
    },
    {
      rule: 'elseNewline',
      default: true,
      type: 'boolean',
      description: 'If keyword "else" is forced onto a new line.'
    },
    {
      rule: 'functionSpace',
      default: true,
      type: 'boolean',
      description: 'Inserts a space following the function keyword for anonymous functions.'
    },
    {
      rule: 'functionNameSpace',
      default: true,
      type: 'boolean',
      description: 'If a space should follow a JavaScript function name.'
    },
    {
      rule: 'methodChain',
      default: -1,
      description: 'When to break consecutively chained methods and properties onto separate lines. A negative value disables this option. A value of 0 ensures method chainsare never broken.',
      type: 'number'
    },
    {
      rule: 'neverFlatten',
      default: false,
      description: 'If destructured lists in script should never be flattend.',
      type: 'boolean'
    },
    {
      rule: 'ternaryLine',
      description: 'If ternary operators in JavaScript `?` and `:` should remain on the same line.',
      type: 'boolean',
      default: false
    },
    {
      rule: 'variableList',
      description: 'If consecutive JavaScript variables should be merged into a comma separated list or if variables in a list should be separated. each — Ensurce each reference is a single declaration statement.',
      type: 'array',
      default: []
    },
    {
      rule: 'vertical',
      description: 'If lists of assignments and properties should be vertically aligned',
      type: 'boolean',
      default: false
    },
    {
      rule: 'noSemicolon',
      description: 'Removes semicolons that would be inserted by ASI. This option is in conflict with option `attemptCorrection` and takes precedence over conflicting features. Use of this option is a possible security/stability risk.',
      default: false,
      type: 'boolean'
    },
    {
      rule: 'quoteConvert',
      description: 'If the quotes of markup attributes should be converted to single quotes or double quotes.',
      type: 'select',
      default: 'none',
      values: [
        {
          rule: 'none',
          description: 'Ignores this option'
        },
        {
          rule: 'single',
          description: 'Converts double quotes to single quotes'
        },
        {
          rule: 'double',
          description: 'Converts single quotes to double quotes'
        }
      ]
    }

  ],
  json: [
    {
      default: 0,
      description: 'Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.',
      rule: 'wrap',
      type: 'number'
    },
    {
      default: ' ',
      description: 'The string characters to comprise a single indentation. Any string combination is accepted.',
      rule: 'indentChar',
      type: 'string'
    },
    {
      default: 2,
      description: 'The number of "indentChar" values to comprise a single indentation.',
      rule: 'indentSize',
      type: 'number'
    },
    {
      default: false,
      description: 'Automatically correct some sloppiness in code.',
      rule: 'attemptCorrection',
      type: 'boolean'
    },
    {
      rule: 'arrayFormat',
      description: 'Determines if all array indexes should be indented, never indented, or left to the default',
      type: 'select',
      default: 'default',
      values: [
        {
          rule: 'default',
          description: 'Default formatting'
        },
        {
          rule: 'indent',
          description: 'Always indent each index of an array'
        },
        {
          rule: 'inline',
          description: 'Ensure all array indexes appear on a single line'
        }
      ]
    },
    {
      rule: 'braceAllman',
      default: false,
      description: 'Determines if opening curly braces will exist on the same line as their condition or be forced onto a new line. (Allman style indentation).',
      type: 'boolean'
    },
    {
      rule: 'bracePadding',
      default: false,
      description: 'This will create a newline before and after objects values',
      type: 'boolean'
    },
    {
      rule: 'objectSort',
      default: false,
      description: 'This option will alphabetically sort object properties in JSON objects',
      type: 'boolean'
    },
    {
      rule: 'objectIndent',
      default: false,
      description: 'This option will alphabetically sort object properties in JSON objects',
      type: 'select',
      values: [
        {
          rule: 'default',
          description: 'Default formatting'
        },
        {
          rule: 'indent',
          description: 'Always indent each index of an array'
        },
        {
          rule: 'inline',
          description: 'Ensure all array indexes appear on a single line'
        }
      ]
    },
    {
      default: 3,
      description: 'The maximum number of consecutive empty lines to retain.',
      rule: 'preserveLine',
      type: 'number'
    }
  ]
};
