import type { Definitions } from 'types';

export const definitions: Definitions = {
  preset: {
    description: 'A preset ruleset style guide to use. This will assign rules according to a set of defaults to produce a certain beautification result.',
    default: 'none',
    type: 'choice',
    values: [
      { rule: 'none', description: 'Default, least obtrusive formatting.' },
      { rule: 'aesthetic', description: 'Specialist and refined styling.' },
      { rule: 'warrington', description: 'Best for Shopify theme developers.' },
      { rule: 'prettier', description: 'Replicates Prettier style formatting.' }
    ]
  },
  language: {
    description: 'The name of the language provided.',
    default: 'auto',
    type: 'choice',
    values: [
      { rule: 'auto', description: 'Detect Language' },
      { rule: 'liquid', description: 'HTML + Liquid' },
      { rule: 'html', description: 'HTML' },
      { rule: 'xml', description: 'XML' },
      { rule: 'json', description: 'JSON' }
    ],
    preset: {
      none: 'auto',
      aesthetic: 'auto',
      warrington: 'auto',
      prettier: 'auto'
    }
  },
  indentSize: {
    description: 'The number of `indentChar` values to comprise a single indentation.',
    default: 2,
    type: 'number',
    preset: {
      none: 2,
      aesthetic: 2,
      warrington: 2,
      prettier: 2
    }
  },
  indentChar: {
    description: 'The string characters to comprise a single indentation. Any string combination is accepted.',
    default: ' ',
    type: 'string',
    preset: {
      none: ' ',
      aesthetic: ' ',
      warrington: ' ',
      prettier: ' '
    }
  },
  indentLevel: {
    description: 'Applies a starting point indentation level for applied usage with third parties.',
    default: 0,
    type: 'number',
    preset: {
      none: 0,
      aesthetic: 0,
      warrington: 0,
      prettier: 0
    }
  },
  wordWrap: {
    description: 'Character width limit before applying word wrap. A `0` value disables this option.',
    default: 0,
    type: 'number',
    preset: {
      none: 0,
      aesthetic: 120,
      warrington: 80,
      prettier: 80
    }
  },
  endNewline: {
    description: 'Whether or not to insert a final line.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: true,
      warrington: true,
      prettier: true
    }
  },
  lineTermination: {
    description: 'If line termination should be Windows (CRLF) format. Unix (LF) format is the default.',
    default: 'LF',
    type: 'choice',
    values: [
      { rule: 'CRLF', description: 'Windows format' },
      { rule: 'LF', description: 'Unix format' }
    ],
    preset: {
      none: 'LF',
      aesthetic: 'LF',
      warrington: 'LF',
      prettier: 'LF'
    }
  },
  preserveLine: {
    description: 'The maximum number of consecutive empty lines to retain.',
    default: 2,
    type: 'number',
    preset: {
      none: 2,
      aesthetic: 2,
      warrington: 1,
      prettier: 1
    }
  },
  commentPreserve: {
    description: 'Prevent Æsthetic from carrying out formatting on comments.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: false,
      warrington: false,
      prettier: false
    }
  },
  commentIndent: {
    description: 'This will determine whether comments should always start at position `0` of each line or if comments should be indented according to the code.',
    default: true,
    type: 'boolean',
    preset: {
      none: true,
      aesthetic: true,
      warrington: true,
      prettier: true
    }
  },
  ignoreJSON: {
    description: 'Whether HTML `<script type="application/json>` tags or those annotated with a JSON identifiable attribute should be ignored from beautification.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: false,
      warrington: false,
      prettier: false
    }
  },
  singleQuote: {
    description: 'Controls quotation character conversion of markup and liquid tokens.',
    default: 'preserve',
    type: 'choice',
    values: [
      { rule: 'preserve', description: 'Preserve single quotation character occurrences' },
      { rule: 'never', description: 'Prevent single quotation character usage, forcing double quotes.' },
      { rule: 'always', description: 'Prevent double quotation character usage, forcing single quotes.' },
      { rule: 'liquid', description: 'Use single quotation characters on Liquid tokens and double on Markup tokens.' },
      { rule: 'markup', description: 'Use single quotation characters on markup tokens and double on Liquid tokens.' }
    ],
    preset: {
      none: 'preserve',
      aesthetic: 'liquid',
      warrington: 'never',
      prettier: 'never'
    }
  },
  arrayFormat: {
    description: 'Controls how arrays on objects are formatted.',
    default: 'default',
    type: 'choice',
    values: [
      { rule: 'default', description: 'Default formatting' },
      { rule: 'indent', description: 'Always indent each index of an array' },
      { rule: 'inline', description: 'Ensure all array indexes appear on a single line' }
    ],
    preset: {
      none: 'default',
      aesthetic: 'indent',
      warrington: 'indent',
      prettier: 'indent'
    }
  },
  braceAllman: {
    description: 'This option will determine how arrays contained on objects will be formatted.',
    default: true,
    type: 'boolean',
    preset: {
      none: true,
      aesthetic: true,
      warrington: true,
      prettier: true
    }
  },
  bracePadding: {
    description: 'If true an empty line will be inserted after opening curly braces and before closing curly braces.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: false,
      warrington: false,
      prettier: false
    }
  },
  objectIndent: {
    description: 'Controls how arrays of objects are formatted.',
    default: 'default',
    type: 'choice',
    values: [
      { rule: 'default', description: 'Default formatting' },
      { rule: 'indent', description: 'Always indent each index of an array' },
      { rule: 'inline', description: 'Ensure all array indexes appear on a single line' }
    ],
    preset: {
      none: 'default',
      aesthetic: 'indent',
      warrington: 'indent',
      prettier: 'indent'
    }
  },
  objectSort: {
    description: 'This option will alphabetically sort object properties in JSON objects.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: false,
      warrington: false,
      prettier: false
    }
  },
  endComma: {
    description: 'If there should be a trailing comma in arrays and objects.',
    default: 'preserve',
    type: 'choice',
    values: [
      { rule: 'preserve', description: 'Ignore this option' },
      { rule: 'always', description: 'Always ensure there is a trailing comma' },
      { rule: 'never', description: 'Remove trailing commas' }
    ],
    preset: {
      none: 'never',
      aesthetic: 'never',
      warrington: 'never',
      prettier: 'never'
    }
  },
  argumentLineBreak: {
    description: 'The number of tag arguments or parameters allowed before applying a newline break.',
    default: 0,
    type: 'number',
    preset: {
      none: 0,
      aesthetic: 3,
      warrington: 0,
      prettier: 0
    }
  },
  forceIndent: {
    description: 'Will force indentation upon all content and tags without regard for the text nodes.',
    default: true,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: false,
      warrington: false,
      prettier: false
    }
  },
  delimiterTrims: {
    description: 'How delimiter whitespace trim dashes should handled on Liquid tokens.',
    default: 'preserve',
    type: 'choice',
    values: [
      { rule: 'preserve', description: 'Preserves delimiter trims.' },
      { rule: 'never', description: 'Removes trims from all delimiters.' },
      { rule: 'always', description: 'Applies trims to all delimiter occurrences.' },
      { rule: 'tags', description: 'Applies trims to tag delimiters only.' },
      { rule: 'outputs', description: 'Applies trims to output delimiters.' },
      { rule: 'multiline', description: 'Trims applied to tags and output tokens spanning multiple lines.' }
    ],
    preset: {
      none: 'preserve',
      aesthetic: 'preserve',
      warrington: 'preserve',
      prettier: 'preserve'
    }
  },
  delimiterPlacement: {
    description: 'Controls the placement of opening and closing token delimiters.',
    default: 'preserve',
    type: 'choice',
    values: [
      { rule: 'preserve', description: 'Delimiters are left intact.' },
      { rule: 'consistent', description: 'Uses opening delimiter placement to determine closing.' },
      { rule: 'inline', description: 'Places delimiters on the same line as the expression.' },
      { rule: 'newline-multiline', description: 'Forces delimiters onto newlines for multiline tokens.' }
    ],
    preset: {
      none: 'preserve',
      aesthetic: 'consistent',
      warrington: 'preserve',
      prettier: 'preserve'
    }
  },
  filterLineBreak: {
    description: 'Controls filter newline break formatting.',
    default: true,
    type: [ 'boolean', 'number' ],
    preset: {
      none: 0,
      aesthetic: 3,
      warrington: 0,
      prettier: 0
    }
  },
  indentAttribute: {
    description: 'Whether or not Liquid tag expressions contained within attributes of markup tags should apply indentation.',
    default: true,
    type: 'boolean',
    preset: {
      none: true,
      aesthetic: true,
      warrington: true,
      prettier: true
    }
  },
  lineBreakSeparator: {
    description: 'Controls the placement of linebreak separator characters.',
    default: 'before',
    type: 'choice',
    values: [
      { rule: 'preserve', description: 'Placement is preserved.' },
      { rule: 'after', description: 'Places separators after expressions.' },
      { rule: 'before', description: 'Places separators before expressions.' }
    ],
    preset: {
      none: 'before',
      aesthetic: 'before',
      warrington: 'after',
      prettier: 'after'
    }
  },
  lineBreakLogical: {
    description: 'Controls the placement of conditional keyword combinators in Liquid tokens.',
    default: 'before',
    type: 'choice',
    values: [
      { rule: 'preserve', description: 'Placement is preserved.' },
      { rule: 'after', description: 'Places combinators after the condition expression.' },
      { rule: 'before', description: 'Places combinators before the condition expression.' }
    ],
    preset: {
      none: 'before',
      aesthetic: 'before',
      warrington: 'after',
      prettier: 'after'
    }
  },
  ignoreTagList: {
    description: 'A list of Liquid tag tokens to be ignored from formatting.',
    default: [],
    type: 'array',
    preset: {
      none: [],
      aesthetic: [],
      warrington: [],
      prettier: []
    }
  },
  commentBracket: {
    description: 'This rule controls the formatting style of HTML and XML markup comment delimiters.',
    default: 'preserve',
    type: 'choice',
    values: [
      { rule: 'preserve', description: 'Preserve the HTML comment delimiter' },
      { rule: 'consistent', description: 'Formatting determined by starting delimiter placement.' },
      { rule: 'newline', description: 'Forces HTML comment delimiters onto newlines' },
      { rule: 'inline', description: 'Forces HTML comment delimiters inline' },
      { rule: 'inline-align', description: 'Applies aligned inline formatting with additional indentation' }
    ],
    preset: {
      none: 'preserve',
      aesthetic: 'inline-align',
      warrington: 'preserve',
      prettier: 'preserve'
    }
  },
  attributeCasing: {
    description: 'How attribute keys and value casing should be processed.',
    default: 'preserve',
    type: 'choice',
    values: [
      { rule: 'preserve', description: 'Preserve casing' },
      { rule: 'lowercase', description: 'Convert keys and values to lowercase' },
      { rule: 'lowercase-name', description: 'Convert attribute keys to lowercase' },
      { rule: 'lowercase-value', description: 'Convert attribute values to lowercase' }
    ],
    preset: {
      none: 'preserve',
      aesthetic: 'lowercase-name',
      warrington: 'preserve',
      prettier: 'preserve'
    }
  },
  attributeLineBreak: {
    description: 'Controls the formatting tactic to apply on tag attributes.',
    default: false,
    type: [ 'boolean', 'number' ],
    preset: {
      none: false,
      aesthetic: 3,
      warrington: 2,
      prettier: 2
    }
  },
  attributePreserve: {
    description: 'Whether or not markup tags should have their insides preserved.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: false,
      warrington: false,
      prettier: false
    }
  },
  attributeSort: {
    description: 'This rule will alphanumerically sort attributes annotated on markup tags.',
    default: false,
    type: [ 'boolean', 'array' ],
    preset: {
      none: false,
      aesthetic: false,
      warrington: false,
      prettier: false
    }
  },
  classListUnique: {
    description: 'Whether or not identical occurrences of class names should be removed.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: true,
      warrington: false,
      prettier: false
    }
  },
  selfCloseSlash: {
    description: 'Renders a forward slash on self-closing markup tags identified to be void.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: false,
      warrington: false,
      prettier: false
    }
  },
  selfCloseSVG: {
    description: 'Whether or not SVG type tags should be converted to self-closing void types.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: true,
      warrington: true,
      prettier: true
    }
  },
  terminusBracket: {
    description: 'Whether or not ending HTML tag delimiters should be forced onto a newline.',
    default: false,
    type: [ 'boolean', 'number' ],
    preset: {
      none: false,
      aesthetic: 5,
      warrington: 2,
      prettier: 2
    }
  },
  textBoundInline: {
    description: 'Controls how text bound tags should be formatted.',
    default: true,
    type: 'boolean',
    preset: {
      none: true,
      aesthetic: true,
      warrington: false,
      prettier: false
    }
  },
  textPreserve: {
    description: 'If text in the provided markup code should be preserved exactly as provided.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: false,
      warrington: false,
      prettier: false
    }
  },
  stripAttributeLines: {
    description: 'Whether or not newlines existing between tag attributes should be removed or preserved.',
    default: false,
    type: 'boolean',
    preset: {
      none: false,
      aesthetic: true,
      warrington: true,
      prettier: true
    }
  },
  valueSpacing: {
    description: 'Allows Æsthetic to carry-out formatting on attribute values.',
    default: 'preserve',
    type: 'choice',
    values: [
      { rule: 'preserve', description: 'Values are left intact.' },
      { rule: 'equipoise', description: 'Applies whitespace equalization.' },
      { rule: 'wrap', description: 'Linebreak values when wrap limit is exceeded.' }
    ],
    preset: {
      none: 'preserve',
      aesthetic: 'preserve',
      warrington: 'preserve',
      prettier: 'preserve'
    }
  }
};
