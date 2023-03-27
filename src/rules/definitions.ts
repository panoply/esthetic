import type { Definitions } from 'types';

export const definitions: Definitions = {
  global: {
    preset: {
      description: 'Use preset style guide as the base defaults',
      default: 'default',
      type: 'choice',
      values: [
        {
          rule: 'default',
          description: 'This is the default and the most unobtrusive.'
        },
        {
          rule: 'recommended',
          description: 'This style guide is typically suited for most cases'
        },
        {
          rule: 'strict',
          description: 'This is a strict ruleset curated by the projects author.'
        },
        {
          rule: 'warrington',
          description: 'This style guide preset is best suited for Shopify theme developers'
        },
        {
          rule: 'prettier',
          description: 'This preset replicates the Prettier style'
        }
      ]
    },
    correct: {
      default: false,
      description: 'Automatically correct some sloppiness in code.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: true,
        recommended: true,
        strict: true,
        warrington: true
      }
    },
    crlf: {
      description: 'If line termination should be Windows (CRLF) format. Unix (LF) format is the default.',
      type: 'boolean',
      default: false,
      preset: {
        default: false,
        prettier: false,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    endNewline: {
      description: 'Insert an empty line at the end of output.',
      type: 'boolean',
      default: false,
      preset: {
        default: false,
        prettier: false,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    indentSize: {
      description: 'The number of character values to comprise a single indentation.',
      type: 'number',
      default: 2,
      preset: {
        default: 2,
        prettier: 2,
        recommended: 2,
        strict: 2,
        warrington: 2
      }
    },
    indentChar: {

      description: 'The string characters to comprise a single indentation. Any string combination is accepted.',
      type: 'string',
      default: ' ',
      preset: {
        default: ' ',
        prettier: ' ',
        recommended: ' ',
        strict: ' ',
        warrington: ' '
      }
    },
    indentLevel: {
      default: 0,
      type: 'number',
      description: 'How much indentation padding should be applied to beautification? This is typically used internally',
      preset: {
        default: 0,
        prettier: 0,
        recommended: 0,
        strict: 0,
        warrington: 0
      }
    },
    language: {
      description: 'The language name',
      type: 'choice',
      default: 'auto',
      values: [
        {
          rule: 'auto',
          description: 'Detect Language'
        },
        {
          rule: 'text',
          description: 'Plain Text'
        },
        {
          rule: 'html',
          description: 'HTML'
        },
        {
          rule: 'liquid',
          description: 'HTML + Liquid'
        },
        {
          rule: 'javascript',
          description: 'JavaScript'
        },
        {
          rule: 'jsx',
          description: 'JSX'
        },
        {
          rule: 'typescript',
          description: 'TypeScript'
        },
        {
          rule: 'tsx',
          description: 'TSX'
        },
        {
          rule: 'json',
          description: 'JSON'
        },
        {
          rule: 'css',
          description: 'CSS'
        },
        {
          rule: 'scss',
          description: 'SCSS'
        },
        {
          rule: 'less',
          description: 'LESS'
        },
        {
          rule: 'xml',
          description: 'XML'
        }
      ]
    },
    preserveLine: {
      default: 2,
      description: 'The maximum number of consecutive empty lines to retain.',
      type: 'number',
      preset: {
        default: 2,
        prettier: 2,
        recommended: 3,
        strict: 1,
        warrington: 3
      }
    },
    wrap: {
      default: 0,
      description: 'Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.',
      type: 'number',
      preset: {
        default: 0,
        prettier: 80,
        recommended: 120,
        strict: 0,
        warrington: 100
      }
    },
    wrapFraction: {
      default: 0,
      description: 'Wrap fraction is used on internal structures as a secondary point of control. By default, it will use a 75% metric according to `wrap` defined values.',
      type: 'number',
      preset: {
        default: 0,
        prettier: 80,
        recommended: 80,
        strict: 80,
        warrington: 0
      }
    }
  },
  liquid: {
    commentNewline: {
      default: false,
      description: 'If a blank new line should be forced above comments.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: true,
        recommended: true,
        strict: true,
        warrington: true
      }
    },
    commentIndent: {
      default: false,
      description: 'This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: true,
        recommended: true,
        strict: true,
        warrington: true
      }
    },
    delimiterTrims: {
      default: 'preserve',
      description: 'How delimiter whitespace trim dashes should handled on Liquid tokens. You should avoid setting this to force in order to avoid stripping whitespace between text content.',
      type: 'choice',
      values: [
        {
          rule: 'preserve',
          description: 'All trim dash occurances of trims intact'
        },
        {
          rule: 'never',
          description: 'Removes all trim dash occurances for tags and output tokens'
        },
        {
          rule: 'always',
          description: 'Applies trime dashes to all tags and output tokens'
        },
        {
          rule: 'tags',
          description: 'Applies trim dashes to tags tokens only'
        },
        {
          rule: 'outputs',
          description: 'Applies trim dashes to output object tokens only'
        },
        {
          rule: 'multiline',
          description: 'Applies trim dashes to multline token expressions only'
        }
      ],
      preset: {
        default: 'preserve',
        prettier: 'preserve',
        recommended: 'preserve',
        strict: 'multiline',
        warrington: 'preserve'
      }
    },
    ignoreTagList: {
      default: [],
      description: 'A list of liquid tag to ignore',
      type: 'array',
      preset: {
        default: [],
        prettier: [ 'javascript', 'capture' ],
        recommended: [ 'javascript' ],
        strict: [],
        warrington: []
      }
    },
    indentAttribute: {
      default: false,
      description: 'Whether or not markup tags with Liquid contained attributes should apply indentation',
      type: 'boolean',
      preset: {
        default: false,
        prettier: true,
        recommended: true,
        strict: false,
        warrington: true
      }
    },
    preserveComment: {
      default: false,
      description: 'Prevent comment reformatting due to option wrap.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    normalizeSpacing: {
      default: true,
      description: 'Whether or not to normalize the distributed spacing contained in Liquid tokens.',
      type: 'boolean',
      preset: {
        default: true,
        prettier: true,
        recommended: true,
        strict: true,
        warrington: true
      }
    },
    lineBreakSeparator: {
      default: 'default',
      description: 'Controls the placement of Liquid tag separator type characters in newline structures.',
      type: 'choice',
      values: [
        {
          rule: 'preserve',
          description: 'Leave line break character intace'
        },
        {
          rule: 'before',
          description: 'Place line break character at the start of expressions'
        },
        {
          rule: 'after',
          description: 'Place line break character at the end of expressions'
        }
      ],
      preset: {
        default: 'preserve',
        prettier: 'after',
        recommended: 'before',
        strict: 'before',
        warrington: 'after'
      }
    },
    dedentTagList: {
      default: [],
      description: 'List of tags which will have their inner contents excluded from indentation',
      type: 'array',
      preset: {
        default: [],
        prettier: [ 'schema' ],
        recommended: [],
        strict: [],
        warrington: []
      }
    },
    forceArgument: {
      default: 0,
      description: 'Forces arguments onto newlines. When this value is `0` then arguments will be forced according to wrap fraction limit.',
      type: 'number',
      preset: {
        default: 0,
        prettier: 0,
        recommended: 3,
        strict: 3,
        warrington: 0
      }
    },
    forceFilter: {
      default: 0,
      description: 'Forces filter pipes onto newlines. When this value is `0` then filters will be forced according to wrap fraction limit.',
      type: 'number',
      preset: {
        default: 0,
        prettier: 0,
        recommended: 5,
        strict: 4,
        warrington: 0
      }
    },
    delimiterPlacement: {
      default: 'preserve',
      description: 'Controls the placement of Liquid delimiters',
      type: 'choice',
      values: [
        {
          rule: 'preserve',
          description: 'Preserve delimiters'
        },
        {
          rule: 'default',
          description: 'Use defaults'
        },
        {
          rule: 'consistent',
          description: 'Place line break character at the start of expressions'
        },
        {
          rule: 'inline',
          description: 'Place line break character at the end of expressions'
        },
        {
          rule: 'force-inline',
          description: 'Place line break character at the end of expressions'
        },
        {
          rule: 'force-multiline',
          description: 'Place line break character at the end of expressions'
        }
      ],
      preset: {
        default: 'preserve',
        prettier: 'default',
        recommended: 'consistent',
        strict: 'force-multiline',
        warrington: 'consistent'
      }
    },
    preserveInternal: {
      default: false,
      description: 'Whether or not to preserve the inner contents of tokens',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    quoteConvert: {
      description: 'If the quotes should be converted to single quotes or double quotes.',
      type: 'choice',
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
      ],
      preset: {
        default: 'none',
        prettier: 'double',
        recommended: 'single',
        strict: 'single',
        warrington: 'single'
      }
    }
  },
  markup: {
    attributeSort: {
      default: false,
      description: 'Alphanumerically sort markup attributes. Attribute sorting is ignored on tags that contain attributes template attributes.',
      type: {
        array: 'A list of attributes to begin sorting order with',
        boolean: 'Whether or not to apply alphanumeric sorting'
      },
      preset: {
        default: false,
        prettier: false,
        recommended: true,
        strict: [ 'id', 'class', 'type', 'name', 'value' ],
        warrington: false
      }
    },
    attributeCasing: {
      default: 'preserve',
      description: 'Controls the casing of attribute values and keys.',
      type: 'choice',
      values: [
        {
          rule: 'preserve',
          description: 'All tag attribute keys/values are preserved and left intact.'
        },
        {
          rule: 'lowercase',
          description: 'All tag attribute keys/values are converted to lowercase'
        },
        {
          rule: 'lowercase-name',
          description: 'Only attribute keys are converted to lowercase'
        },
        {
          rule: 'lowercase-value',
          description: 'Only attribute values are converted to lowercase'
        }
      ],
      preset: {
        default: 'preserve',
        prettier: 'preserve',
        recommended: 'lowercase-name',
        strict: 'lowercase-name',
        warrington: 'preserve'
      }
    },
    commentNewline: {
      default: false,
      description: 'If a blank new line should be forced above comments.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: true,
        strict: true,
        warrington: false
      }
    },
    commentIndent: {
      default: false,
      description: 'This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: true,
        strict: true,
        warrington: true
      }
    },
    delimiterTerminus: {
      description: 'Whether or not ending HTML tag delimiters should be forced onto a newline. This will emulate the style of Prettier\'s singleAttributePerLine formatting option, wherein the last > delimiter character breaks itself onto a new line',
      default: 'inline',
      type: 'choice',
      values: [
        {
          rule: 'inline',
          description: 'Inline the ending delimiter'
        },
        {
          rule: 'force',
          description: 'Force the ending delimiter onto its own line'
        },
        {
          rule: 'adapt',
          description: 'adapt the delimiter in accordance with structure'
        }
      ],
      preset: {
        default: 'inline',
        prettier: 'force',
        recommended: 'adapt',
        strict: 'adapt',
        warrington: 'adapt'
      }
    },
    forceAttribute: {
      default: false,
      description: 'If all markup attributes should be indented each onto their own line. This option accepts either a boolean or number value, depending on your preferences you can either force attributes based a count limit, disable forcing or always enable enforcing.',
      type: {
        number: 'Optionally define an attribute force threshold. When the number of attributes exceeds this limit then they will be forced, otherwise they will be left intact.',
        boolean: 'Whether or not to enforce the rule. A value of true will always force attributes, whereas a value of false will never force attributes.'
      },
      preset: {
        default: false,
        prettier: 1,
        recommended: 2,
        strict: 2,
        warrington: 2
      }
    },
    forceIndent: {
      default: false,
      description: 'Will force indentation upon all content and tags without regard for the creation of new text nodes.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: true,
        recommended: true,
        strict: true,
        warrington: true
      }
    },
    ignoreJS: {
      default: true,
      description: 'Whether to ignore embedded regions of tags identified to contain JavaScript',
      type: 'boolean',
      preset: {
        default: true,
        prettier: true,
        recommended: true,
        strict: false,
        warrington: false
      }
    },
    ignoreCSS: {
      default: false,
      description: 'Whether to ignore embedded regions of tags identified to contain CSS',
      type: 'boolean',
      preset: {
        default: false,
        prettier: true,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    ignoreJSON: {
      default: false,
      description: 'Whether HTML <script> tags annotated with a JSON identifiable attribute should be ignored from beautification.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    preserveAttribute: {
      default: false,
      description: 'If markup tags should have their insides preserved. This option is only available to markup and does not support child tokens that require a different lexer.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    preserveComment: {
      default: false,
      description: 'Prevent comment reformatting due to option wrap.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    preserveText: {
      default: false,
      description: 'If text in the provided markup code should be preserved exactly as provided. This option eliminates beautification and wrapping of text content.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    lineBreakValue: {
      default: 'preserve',
      description: 'Determines how Æsthetic should handle line break occurance sequences within attribute values',
      type: 'choice',
      values: [
        {
          rule: 'preserve',
          description: 'Preserve the supplied value structure sequences'
        },
        {
          rule: 'align',
          description: 'Align all line breaks to the starting point of attribute name'
        },
        {
          rule: 'indent',
          description: 'Indent all line breaks from the starting point of attribute name'
        },
        {
          rule: 'force-preserve',
          description: 'Force encapsulated values onto newlines but preserve inner contents'
        },
        {
          rule: 'force-align',
          description: 'Force encapsulated values onto newlines and apply aligned formatting'
        },
        {
          rule: 'force-indent',
          description: 'Force encapsulated values onto newlines and apply indentation formatting'
        }
      ],
      preset: {
        default: 'preserve',
        prettier: 'indent',
        recommended: 'force-indent',
        strict: 'force-indent',
        warrington: 'force-indent'
      }
    },
    selfCloseSpace: {
      default: false,
      description: 'Markup self-closing tags end will end with " />" instead of "/>".',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: false,
        strict: false,
        warrington: false
      }
    },
    selfCloseSVG: {
      default: true,
      description: 'Whether or not SVG type tags should be converted to self closing void types.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: false,
        recommended: true,
        strict: true,
        warrington: true
      }
    },
    stripAttributeLines: {
      default: false,
      description: 'Whether or not newlines contained within tag attributes should be removed or preserved.',
      type: 'boolean',
      preset: {
        default: false,
        prettier: true,
        recommended: true,
        strict: true,
        warrington: false
      }
    },
    quoteConvert: {
      description: 'If the quotes should be converted to single quotes or double quotes.',
      type: 'choice',
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
      ],
      preset: {
        default: 'none',
        prettier: 'double',
        recommended: 'double',
        strict: 'double',
        warrington: 'double'
      }
    }
  },
  style: {
    classPadding: {
      description: 'Inserts new line characters between every CSS code block.',
      default: false,
      type: 'boolean'

    },
    commentNewline: {
      default: false,
      description: 'If a blank new line should be forced above comments.',
      type: 'boolean'
    },
    commentIndent: {
      default: false,
      description: 'This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.',
      type: 'boolean'
    },
    sortSelectors: {
      default: false,
      type: 'boolean',
      description: 'If comma separated CSS selectors should present on a single line of code.'
    },
    sortProperties: {
      description: 'This option will alphabetically sort CSS properties contained within classes.',
      default: false,
      type: 'boolean'
    },
    noLeadZero: {
      description: 'This will eliminate leading zeros from numbers expressed within values.',
      default: false,
      type: 'boolean'
    },
    preserveComment: {
      default: false,
      description: 'Prevent comment reformatting due to option wrap.',

      type: 'boolean'
    },
    atRuleSpace: {
      default: true,
      description: 'Insert a single whitespace character betwen @ rules.',
      type: 'boolean'
    },
    quoteConvert: {
      description: 'If the quotes should be converted to single quotes or double quotes.',
      type: 'choice',
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
  },
  json: {
    arrayFormat: {
      description: 'Determines if all array indexes should be indented, never indented, or left to the default',
      type: 'choice',
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
    braceAllman: {
      default: false,
      description: 'Determines if opening curly braces will exist on the same line as their condition or be forced onto a new line, otherwise known as "Allman Style" indentation.',
      type: 'boolean'
    },
    bracePadding: {
      default: false,
      description: 'This will create a newline before and after objects values',
      type: 'boolean'
    },
    objectIndent: {
      description: 'This option will alphabetically sort object properties in JSON objects',
      type: 'choice',
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
    objectSort: {
      default: false,
      description: 'This option will alphabetically sort object properties in JSON objects',
      type: 'boolean'
    }
  },
  script: {
    arrayFormat: {
      description: 'Determines if all array indexes should be indented, never indented, or left to the default',
      type: 'choice',
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
    braceAllman: {
      default: false,
      description: 'Determines if opening curly braces will exist on the same line as their condition or be forced onto a new line, otherwise known as "Allman Style" indentation.',
      type: 'boolean'
    },
    bracePadding: {
      default: false,
      description: 'This will create a newline before and after objects values',
      type: 'boolean'
    },
    braceNewline: {
      default: false,
      description: 'If true an empty line will be inserted after opening curly braces and before closing curly braces.',
      type: 'boolean'
    },
    braceStyle: {
      default: 'none',
      description: 'Emulates JSBeautify\'s brace_style option using existing Prettify options',
      type: 'choice',
      values: [
        {
          rule: 'none',
          description: 'Ignores this option'
        },
        {
          rule: 'collapse',
          description: 'Sets formatObject to indent and neverflatten to true.'
        },
        {
          rule: 'collapse-preserve-inline',
          description: 'Sets formatObject to inline and bracePadding to true'
        },
        {
          rule: 'expand',
          description: 'Sets objectIndent to indent and braceNewline + neverflatten to true.'
        }
      ]
    },
    caseSpace: {
      default: false,
      type: 'boolean',
      description: 'If the colon separating a case\'s expression (of a switch/case block) from its statement should be followed by a space instead of indentation thereby keeping the case on a single line of code.'
    },
    commentNewline: {
      default: false,
      description: 'If a blank new line should be forced above comments.',
      type: 'boolean'
    },
    commentIndent: {
      default: false,
      description: 'This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.',
      type: 'boolean'
    },
    elseNewline: {
      default: false,
      type: 'boolean',
      description: 'If keyword "else" is forced onto a new line.'
    },
    endComma: {
      description: 'If there should be a trailing comma in arrays and objects.',
      type: 'choice',
      default: 'none',
      values: [
        {
          rule: 'none',
          description: 'Ignore this option'
        },
        {
          rule: 'always',
          description: 'Always ensure there is a tailing comma'
        },
        {
          rule: 'never',
          description: 'Remove trailing commas'
        }
      ]
    },
    objectSort: {
      default: false,
      description: 'This option will alphabetically sort object properties in JSON objects',
      type: 'boolean'
    },
    objectIndent: {
      description: 'This option will alphabetically sort object properties in JSON objects',
      type: 'choice',
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
    functionSpace: {
      default: true,
      type: 'boolean',
      description: 'Inserts a space following the function keyword for anonymous functions.'
    },
    functionNameSpace: {
      default: true,
      type: 'boolean',
      description: 'If a space should follow a JavaScript function name.'
    },
    methodChain: {
      default: -1,
      description: 'When to break consecutively chained methods and properties onto separate lines. A negative value disables this option. A value of 0 ensures method chainsare never broken.',
      type: 'number'
    },
    preserveComment: {
      default: false,
      description: 'Prevent comment reformatting due to option wrap.',
      type: 'boolean'
    },
    ternaryLine: {
      description: 'If ternary operators in JavaScript `?` and `:` should remain on the same line.',
      type: 'boolean',
      default: false
    },
    neverFlatten: {
      default: true,
      description: 'If destructured lists in script should never be flattend.',
      type: 'boolean'
    },
    noCaseIndent: {
      description: 'If the colon separating a case\'s expression (of a switch/case block) from its statement should be followed by a space instead of indentation, thereby keeping the case on a single line of code.',
      default: false,
      type: 'boolean'
    },
    noSemicolon: {
      description: 'Removes semicolons that would be inserted by ASI. This option is in conflict with option `attemptCorrection` and takes precedence over conflicting features. Use of this option is a possible security/stability risk.',
      default: false,
      type: 'boolean'
    },
    quoteConvert: {
      description: 'If the quotes should be converted to single quotes or double quotes.',
      type: 'choice',
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
    variableList: {
      description: 'If consecutive JavaScript variables should be merged into a comma separated list or if variables in a list should be separated. each — Ensure each reference is a single declaration statement.',
      type: 'choice',
      default: 'none',
      values: [
        {
          rule: 'none',
          description: 'Ignores this option'
        },
        {
          rule: 'each',
          description: 'Ensure each reference is a single declaration statement'
        },
        {
          rule: 'list',
          description: 'Ensure consecutive declarations are a comma separated list'
        }
      ]
    },
    vertical: {
      description: 'If lists of assignments and properties should be vertically aligned',
      type: 'boolean',
      default: false
    }
  }
};
