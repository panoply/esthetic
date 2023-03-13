import type { Definitions } from 'types';

export const definitions: Definitions = {
  global: {
    preset: {
      default: 'default',
      description: 'Use preset style guide as the base defaults',
      lexer: 'all',
      type: 'select',
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
    crlf: {
      default: false,
      description: 'If line termination should be Windows (CRLF) format. Unix (LF) format is the default.',
      lexer: 'all',
      type: 'boolean'
    },
    endNewline: {
      default: false,
      description: 'Insert an empty line at the end of output.',
      lexer: 'all',
      type: 'boolean'
    },
    indentSize: {
      default: 2,
      description: 'The number of "indentChar" values to comprise a single indentation.',
      lexer: 'all',
      type: 'number'
    },
    indentChar: {
      default: ' ',
      description: 'The string characters to comprise a single indentation. Any string combination is accepted.',
      lexer: 'all',
      type: 'string'
    },
    language: {
      description: 'The language name',
      lexer: 'all',
      type: 'select',
      default: 'auto',
      values: [
        {
          rule: 'auto',
          description: 'Prettify will automatically detect the language'
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
      lexer: 'all',
      type: 'number'
    },
    wrap: {
      default: 0,
      description: 'Character width limit before applying word wrap. A 0 value disables this option. A negative value concatenates script strings.',
      lexer: 'all',
      type: 'number'
    }
  },
  liquid: {
    commentNewline: {
      default: false,
      description: 'If a blank new line should be forced above comments.',
      lexer: 'all',
      type: 'boolean'
    },
    commentIndent: {
      default: false,
      description: 'This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.',
      lexer: 'all',
      type: 'boolean'
    },
    correct: {
      default: false,
      description: 'Automatically correct some sloppiness in code.',
      lexer: 'markup',
      type: 'boolean'
    },
    delimiterTrims: {
      default: 'preserve',
      description: 'How delimiter whitespace trim dashes should handled on Liquid tokens. You should avoid setting this to force in order to avoid stripping whitespace between text content.',
      lexer: 'markup',
      type: 'select',
      values: [
        {
          rule: 'preserve',
          description: 'All trim dash occurances of trims intact'
        },
        {
          rule: 'strip',
          description: 'Removes all trim dash occurances for tags and output tokens'
        },
        {
          rule: 'force',
          description: 'Applies trime dashes to all tags and output tokens'
        },
        {
          rule: 'tags',
          description: 'Applies trim dashes to tags tokens only'
        },
        {
          rule: 'output',
          description: 'Applies trim dashes to output object tokens only'
        }
      ]
    },
    ignoreTagList: {
      default: [],
      description: 'A list of liquid tag to ignore',
      lexer: 'liquid',
      type: 'array'
    },
    indentAttributes: {
      default: false,
      description: 'Whether or not markup tags with Liquid contained attributes should apply indentation',
      lexer: 'liquid',
      type: 'boolean'
    },
    preserveComment: {
      default: false,
      description: 'Prevent comment reformatting due to option wrap.',
      lexer: 'markup',
      type: 'boolean'
    },
    normalizeSpacing: {
      default: true,
      description: 'Whether or not to normalize the distributed spacing contained in Liquid tokens.',
      lexer: 'markup',
      type: 'boolean'
    },
    lineBreakSeparator: {
      default: 'default',
      description: 'Controls the placement of Liquid tag separator type characters in newline structures.',
      lexer: 'markup',
      type: 'select',
      values: [
        {
          rule: 'default',
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
      ]
    },
    delimiterPlacement: {
      default: 'preserve',
      description: 'Controls the placement of Liquid delimiters',
      lexer: 'markup',
      type: 'select',
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
      ]
    },
    quoteConvert: {
      lexer: 'all',
      description: 'If the quotes should be converted to single quotes or double quotes.',
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
  },
  markup: {
    attributeSort: {
      default: false,
      description: 'Alphanumerically sort markup attributes. Attribute sorting is ignored on tags that contain attributes template attributes.',
      lexer: 'markup',
      type: 'boolean'
    },
    attributeSortList: {
      default: [],
      description: "A comma separated list of attribute names. Attributes will be sorted according to this list and then alphanumerically. This option requires 'attributeSort' have a value of true.",
      lexer: 'markup',
      type: 'array'
    },
    attributeCasing: {
      default: 'preserve',
      description: 'Controls the casing of attribute values and keys.',
      type: 'select',
      lexer: 'markup',
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
      ]
    },
    commentNewline: {
      default: false,
      description: 'If a blank new line should be forced above comments.',
      lexer: 'all',
      type: 'boolean'
    },
    commentIndent: {
      default: false,
      description: 'This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.',
      lexer: 'all',
      type: 'boolean'
    },
    correct: {
      default: false,
      description: 'Automatically correct some sloppiness in code.',
      lexer: 'markup',
      type: 'boolean'
    },
    delimiterForce: {
      description: 'Whether or not ending HTML tag delimiters should be forced onto a newline. This will emulate the style of Prettier\'s singleAttributePerLine formatting option, wherein the last > delimiter character breaks itself onto a new line',
      default: false,
      lexer: 'markup',
      type: 'boolean'
    },
    forceAttribute: {
      default: false,
      description: 'If all markup attributes should be indented each onto their own line. This option accepts either a boolean or number value, depending on your preferences you can either force attributes based a count limit, disable forcing or always enable enforcing.',
      lexer: 'markup',
      type: [ 'number', 'boolean' ],
      multi: {
        number: {
          default: 1,
          description: 'Optionally define an attribute force threshold. When the number of attributes exceeds this limit then they will be forced, otherwise they will be left intact.'
        },
        boolean: {
          default: false,
          description: 'Whether or not to enforce the rule. A value of true will always force attributes, whereas a value of false will never force attributes.'
        }
      }
    },
    forceLeadAttribute: {
      default: false,
      description: 'Forces leading attribute onto a newline when using wrap based indentation.',
      lexer: 'markup',
      type: 'boolean'
    },
    forceIndent: {
      default: false,
      description: 'Will force indentation upon all content and tags without regard for the creation of new text nodes.',
      lexer: 'markup',
      type: 'boolean'
    },
    ignoreJS: {
      default: false,
      description: 'Whether to ignore embedded regions of tags identified to contain JavaScript',
      lexer: 'markup',
      type: 'boolean'
    },
    ignoreCSS: {
      default: false,
      description: 'Whether to ignore embedded regions of tags identified to contain CSS',
      lexer: 'markup',
      type: 'boolean'
    },
    ignoreJSON: {
      default: false,
      description: 'Whether HTML <script> tags annotated with a JSON identifiable attribute should be ignored from beautification.',
      lexer: 'markup',
      type: 'boolean'
    },
    preserveAttributes: {
      default: false,
      description: 'If markup tags should have their insides preserved. This option is only available to markup and does not support child tokens that require a different lexer.',
      lexer: 'markup',
      type: 'boolean'
    },
    preserveComment: {
      default: false,
      description: 'Prevent comment reformatting due to option wrap.',
      lexer: 'markup',
      type: 'boolean'
    },
    preserveText: {
      default: false,
      description: 'If text in the provided markup code should be preserved exactly as provided. This option eliminates beautification and wrapping of text content.',
      lexer: 'markup',
      type: 'boolean'
    },
    selfCloseSpace: {
      default: false,
      description: 'Markup self-closing tags end will end with " />" instead of "/>".',
      lexer: 'markup',
      type: 'boolean'
    },
    selfCloseSVG: {
      default: true,
      description: 'Whether or not SVG type tags should be converted to self closing void types.',
      lexer: 'markup',
      type: 'boolean'
    },
    stripAttributeLines: {
      default: false,
      description: 'Whether or not newlines contained within tag attributes should be removed or preserved.',
      lexer: 'markup',
      type: 'boolean'
    },
    quoteConvert: {
      lexer: 'all',
      description: 'If the quotes should be converted to single quotes or double quotes.',
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
  },
  style: {
    correct: {
      default: false,
      description: 'Automatically correct some sloppiness in code.',
      lexer: 'style',
      type: 'boolean'
    },
    classPadding: {
      description: 'Inserts new line characters between every CSS code block.',
      default: false,
      type: 'boolean',
      lexer: 'style'
    },
    commentNewline: {
      default: false,
      description: 'If a blank new line should be forced above comments.',
      lexer: 'all',
      type: 'boolean'
    },
    commentIndent: {
      default: false,
      description: 'This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.',
      lexer: 'all',
      type: 'boolean'
    },
    sortSelectors: {
      default: false,
      type: 'boolean',
      description: 'If comma separated CSS selectors should present on a single line of code.',
      lexer: 'style'
    },
    sortProperties: {
      lexer: 'style',
      description: 'This option will alphabetically sort CSS properties contained within classes.',
      default: false,
      type: 'boolean'
    },
    noLeadZero: {
      lexer: 'style',
      description: 'This will eliminate leading zeros from numbers expressed within values.',
      default: false,
      type: 'boolean'
    },
    preserveComment: {
      default: false,
      description: 'Prevent comment reformatting due to option wrap.',
      lexer: 'markup',
      type: 'boolean'
    },
    atRuleSpace: {
      default: true,
      description: 'Insert a single whitespace character betwen @ rules.',
      type: 'boolean',
      lexer: 'style'
    },
    quoteConvert: {
      lexer: 'style',
      description: 'If the quotes should be converted to single quotes or double quotes.',
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
  },
  script: {
    arrayFormat: {
      lexer: 'script',
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
    braceAllman: {
      lexer: 'script',
      default: false,
      description: 'Determines if opening curly braces will exist on the same line as their condition or be forced onto a new line, otherwise known as "Allman Style" indentation.',
      type: 'boolean'
    },
    bracePadding: {
      default: false,
      description: 'This will create a newline before and after objects values',
      type: 'boolean',
      lexer: 'script'
    },
    braceNewline: {
      default: false,
      description: 'If true an empty line will be inserted after opening curly braces and before closing curly braces.',
      type: 'boolean',
      lexer: 'script'
    },
    braceStyle: {
      default: 'none',
      description: 'Emulates JSBeautify\'s brace_style option using existing Prettify options',
      type: 'select',
      lexer: 'script',
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
      description: 'If the colon separating a case\'s expression (of a switch/case block) from its statement should be followed by a space instead of indentation thereby keeping the case on a single line of code.',
      lexer: 'script'
    },
    commentNewline: {
      default: false,
      description: 'If a blank new line should be forced above comments.',
      lexer: 'all',
      type: 'boolean'
    },
    commentIndent: {
      default: false,
      description: 'This will determine whether comments should always start at position 0 of each line or if comments should be indented according to the code.',
      lexer: 'all',
      type: 'boolean'
    },
    correct: {
      default: false,
      description: 'Automatically correct some sloppiness in code.',
      lexer: 'markup',
      type: 'boolean'
    },
    elseNewline: {
      lexer: 'script',
      default: false,
      type: 'boolean',
      description: 'If keyword "else" is forced onto a new line.'
    },
    endComma: {
      description: 'If there should be a trailing comma in arrays and objects.',
      type: 'select',
      lexer: 'script',
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
      type: 'boolean',
      lexer: 'script'
    },
    objectIndent: {
      description: 'This option will alphabetically sort object properties in JSON objects',
      type: 'select',
      lexer: 'script',
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
      lexer: 'script',
      default: true,
      type: 'boolean',
      description: 'Inserts a space following the function keyword for anonymous functions.'
    },
    functionNameSpace: {
      lexer: 'script',
      default: true,
      type: 'boolean',
      description: 'If a space should follow a JavaScript function name.'
    },
    methodChain: {
      lexer: 'script',
      default: -1,
      description: 'When to break consecutively chained methods and properties onto separate lines. A negative value disables this option. A value of 0 ensures method chainsare never broken.',
      type: 'number'
    },
    preserveComment: {
      default: false,
      description: 'Prevent comment reformatting due to option wrap.',
      lexer: 'markup',
      type: 'boolean'
    },
    ternaryLine: {
      lexer: 'script',
      description: 'If ternary operators in JavaScript `?` and `:` should remain on the same line.',
      type: 'boolean',
      default: false
    },
    neverFlatten: {
      lexer: 'script',
      default: true,
      description: 'If destructured lists in script should never be flattend.',
      type: 'boolean'
    },
    noCaseIndent: {
      lexer: 'script',
      description: 'If the colon separating a case\'s expression (of a switch/case block) from its statement should be followed by a space instead of indentation, thereby keeping the case on a single line of code.',
      default: false,
      type: 'boolean'
    },
    noSemicolon: {
      lexer: 'script',
      description: 'Removes semicolons that would be inserted by ASI. This option is in conflict with option `attemptCorrection` and takes precedence over conflicting features. Use of this option is a possible security/stability risk.',
      default: false,
      type: 'boolean'
    },
    quoteConvert: {
      lexer: 'style',
      description: 'If the quotes should be converted to single quotes or double quotes.',
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
    variableList: {
      lexer: 'script',
      description: 'If consecutive JavaScript variables should be merged into a comma separated list or if variables in a list should be separated. each — Ensure each reference is a single declaration statement.',
      type: 'select',
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
      lexer: 'script',
      description: 'If lists of assignments and properties should be vertically aligned',
      type: 'boolean',
      default: false
    }
  }
};
