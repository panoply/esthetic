/**
 * CarriageNewline
 *
 * Newline and return feed global
 *
 * ---
 *
 * @exports /\r\n/g
 *
 */
export const CarriageNewline = /\r\n/g;
/**
 * Non Space
 *
 * Non whitespace or newline character
 *
 * ---
 *
 * @example /\S/
 *
 */
export const NonSpace = /\S/;

/**
 * Newline
 *
 * A single newline character
 *
 * ---
 *
 * @example /\n/
 *
 */
export const Newline = /\n/;

/**
 * Empty Line
 *
 * Leading and ending whitespace or newline characters
 *
 * ---
 *
 * @example /^\s+$/
 *
 */
export const EmptyLine = /^\s+$/;

/**
 * Whitespace and Newlines - `*` Zero or More
 *
 * Zero or more leading whitespace and newline characters
 *
 * ---
 *
 * @example '\s*'
 *
 */
export const Spaces = /\s*/;

/**
 * Whitespace and Newlines - `+` One or More
 *
 * Global captures for 1 or more leading whitespace and newline characters
 *
 * ---
 *
 * @example /\s+/g
 *
 */
export const SpacesGlob = /\s+/g;

/**
 * Leading Whitespace and Newlines
 *
 * 1 or more leading whitespace and newline characters
 *
 * ---
 *
 * @example /^\s+/
 *
 * BEFORE: '  \n  foo  '
 * AFTER:  'foo  '
 *
 */
export const SpaceLead = /^\s+/;

/**
 *
 * Ending Whitespace and Newlines
 *
 * 1 or more ending whitespace and newline characters
 *
 * ---
 *
 * @example /\s+$/
 *
 * BEFORE: '  foo   \n '
 * AFTER:  '  foo'
 *
 */
export const SpaceEnd = /\s+$/;

/**
 * Whitespace Hash - Preserves leading whitespace
 *
 * ---
 *
 *
 * @example /(^\s*#)[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]*?/
 *
 * BEFORE: '   #    \n   foo'
 * AFTER:  '   #\n   foo'
 *
 */
export const WhitespaceHash = /(^\s*#)[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]*?/;

/**
 * Leading Whitespace Only
 *
 * - `+` More Than 1
 * - `^` Starter
 *
 * 1 or more **leading** whitespace only characters. This will remove carriage
 * returns (`\r`), so if the input contains `\r\n` pairs, they can be converted to `\n`.
 * This is a more fluent capture and uses unicodes.
 *
 * ---
 *
 *
 * @example /^[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/
 *
 * BEFORE: ' \n  foo'
 * AFTER:  '\nfoo'
 *
 */
export const WhitespaceLead = /^[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/;

/**
 * Ending Whitespace Only
 *
 * 1 or more **ending** whitespace only characters. This will remove carriage
 * returns (`\r`), so if the input contains `\r\n` pairs, they can be converted to `\n`.
 * This is a more fluent capture and uses unicodes.
 *
 * ---
 *
 *
 * @example /[\t\v\f \u00a0\u2000-\u200b\u2028-\u2029\u3000]+$/
 *
 * BEFORE: ' \n  foo'
 * AFTER:  '\nfoo'
 */
export const WhitespaceEnd = /[\t\v\f \u00a0\u2000-\u200b\u2028-\u2029\u3000]+$/;

/**
 * All Whitespaces
 *
 * Global capture of more than 1 whitespace character occurances but does not touch newlines.
 *
 * ---
 *
 * @example /[\t\v\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g
 */
export const WhitespaceGlob = /[\t\v\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g;

/**
 * Single Whitespace character only
 *
 * - No global flag
 * - No starter or ender
 *
 * Captures single whitespace character but does not capture newlines
 *
 * ---
 *
 * @example [\t\v\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]
 *
 */
export const WhitespaceChar = /[\t\v\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]/;

/**
 * Leading Newlines
 *
 * 1 or more leading newline characters
 *
 * ---
 *
 * @example /^\n+/
 *
 */
export const NewlineLead = /^\n+/;

/**
 * Newlines
 *
 * 1 or more newline characters
 *
 * ---
 *
 * @example  /\n+/g
 *
 */
export const Newlines = /\n+/g;

/**
 * Non Word
 *
 * ---
 *
 * @example  /\W/
 *
 */
export const NonWordChar = /\W/;

/**
 * All Tab Characters
 *
 * Global captures of more than 1 tab character occurances but does not touch newlines.
 *
 * ---
 *
 * @example /\t+/g
 *
 * BEFORE: 'foo   \t\n '
 * AFTER:  'foo   \n'
 *
 */
export const TabsGlob = /\t+/g;

/**
 * Regex is used to inject whitespace and equally distributes spacing
 * within Liquid tokens. It directly relates to `normalizeSpacing` rules.
 *
 * [Regex101](https://regex101.com/r/jxLNhv/1)
 *
 * - `g` Global Flag
 *
 * ---
 *
 *
 * @example /[|:,[\]](?=[0-9a-z-])/g
 *
 * BEFORE: '|filter:" foo "|append:123'
 * AFTER:  '| filter: " foo " | append: 123'
 *
 */
export const SpaceInjectBefore = /[|:,[\]](?=[0-9a-z-])/g;

/**
 * Regex is used to inject whitespace and equally distributes spacing
 * within Liquid tokens. It directly relates to `normalizeSpacing` rules.
 * This regex is specifically used for prefixed token characters.
 *
 * [Regex101](https://regex101.com/r/jxLNhv/1)
 *
 * ---
 *
 * @example /(?<=[0-9a-z\]-])(?:[!=]=|[<>]=?)/g
 *
 * BEFORE: 'foo="bar"'
 * AFTER:  'foo = "bar"' // SpaceInjectBefore will handle `="bar"`
 */
export const SpaceInjectAfter = /(?<=[0-9a-z\]-])(?:[!=]=|[<>]=?)/g;

/**
* Regex is used to strip whitespaces expressed where they might otherwise
* can be avoided.
*
* ---
* @example /[.[\]] {1,}/g
*
* BEFORE: 'object . prop'
* AFTER:  'object.prop' // SpaceInjectBefore will handle `="bar"`
*/
export const StripSpaceInject = /[.[\]] {1,}/g;

/**
 * Comment Block type newline occurance for Script and Style Languages
 *
 * ---
 *
 * @example /\n(?!\s*\*)/
 *
 * BEFORE: 'object . prop'
 * AFTER:  'object.prop' // SpaceInjectBefore will handle `="bar"`
 */
export const CommBlockNewline = /\n(?!\s*\*)/;

/**
* Captures esthetic inline comment controls
*
* ---
* @see https://regex101.com/r/awwTh0/1
* @example
*
* LINE COMMENT:    // @esthetic
* BLOCK COMMENT:   /* @esthetic
* LINE LIQUID:     {% # @esthetic
* BLOCK LIQUID:    {% comment %} @esthetic
* HTML COMMENT:    <!-- @esthetic
* YAML COMMENT:    # @esthetic
*/
export const CommControl = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*esthetic\s+/;

/**
 * Captures esthetic inline comment ignore next line
 *
 * ---
 *
 * @see https://regex101.com/r/SLG0Or/1
 * @example
 *
 * LINE COMMENT:    // esthetic-ignore-(next|start|end)
 * BLOCK COMMENT:   /* esthetic-ignore-(next|start|end)
 * LINE LIQUID:     {% # esthetic-ignore-(next|start|end)
 * BLOCK LIQUID:    {% comment %} esthetic-ignore-(next|start|end)
 * HTML COMMENT:    <!-- esthetic-ignore-(next|start|end)
 * YAML COMMENT:    # esthetic-ignore-(next|start|end)
 */
export const CommIgnore = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*esthetic-ignore-(?:start|next|end)\b/;

/**
 * Captures esthetic inline comment ignore next line
 *
 * [Regex101](https://regex101.com/r/TTD6yY/1)
 *
 * ---
 *
 * @example
 *
 * LINE LIQUID:    // {% # esthetic-ignore-(next|start|end)
 * BLOCK LIQUID:   // {% comment %} esthetic-ignore-(next|start|end)
 * HTML COMMENT:   //  <!-- esthetic-ignore-(next|start|end)
 */
export const CommMarkupIgnore = /({%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*esthetic-ignore-(start|next|end)\b/;

/**
 * Captures esthetic inline comment file ignores
 *
 * [Regex101](https://regex101.com/r/wmnwOe/1)
 *
 * ---
 *
 * @example
 *
 * LINE COMMENT:    // esthetic-ignore
 * BLOCK COMMENT:   /* esthetic-ignore
 * LINE LIQUID:     {% # esthetic-ignore
 * BLOCK LIQUID:    {% comment %} esthetic-ignore
 * HTML COMMENT:    <!-- esthetic-ignore
 * YAML COMMENT:    # esthetic-ignore
 */
export const CommIgnoreFile = /^\s*(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*esthetic-ignore(?![a-z-][^-])/;

/**
 * Captures esthetic inline comment ignore starters
 *
 * [Regex101](https://regex101.com/r/BvjwOE/1)
 * ---
 *
 * @example
 *
 * LINE COMMENT:    // esthetic-ignore-start
 * BLOCK COMMENT:   /* esthetic-ignore-start
 * LINE LIQUID:     {% # esthetic-ignore-start
 * BLOCK LIQUID:    {% comment %} esthetic-ignore-start
 * HTML COMMENT:    <!-- esthetic-ignore-start
 * YAML COMMENT:    # esthetic-ignore-start
 */
export const CommIgnoreStart = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*esthetic-ignore-start\b/;

/**
 * Line Comment Start Ignore
 *
 * Starting position (`^`) expression for line comment (`//`) region ignore `esthetic-ignore-start` tokens.
 *
 * [Regex101](https://regex101.com/r/Uv5QGq/1)
 *
 * ---
 *
 * @example
 *
 * LINE COMMENT:    // esthetic-ignore-start
 */
export const CommLineIgnoreStart = /^\/\/\s*esthetic-ignore-start\b/;

/**
 * Block Comment Start Ignore
 *
 * Starting position (`^`) expression for line comment (`/*`) region ignore `esthetic-ignore-start` tokens.
 * This expression supports multiline comments like that used in jsdocs annotations.
 *
 * [Regex101](https://regex101.com/r/kfE18n/1)
 *
 * ---
 *
 * @example
 *
 * BLOCK COMMENT:    /* esthetic-ignore-start
 */
export const CommBlockIgnoreStart = /^\/\*{1,2}(?:\s*|\n\s*\*\s*)esthetic-ignore-start\b/;

/**
 * Captures esthetic inline comment ignore enders
 *
 * [Regex101](https://regex101.com/r/rAz9iQ/1)
 *
 * ---
 *
 * @example
 *
 * LINE COMMENT:    // esthetic-ignore-end
 * BLOCK COMMENT:   /* esthetic-ignore-end
 * LINE LIQUID:     {% # esthetic-ignore-end
 * BLOCK LIQUID:    {% comment %} esthetic-ignore-end
 * HTML COMMENT:    <!-- esthetic-ignore-end
 * YAML COMMENT:    # esthetic-ignore-end
 */
export const CommIgnoreEnd = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2}|#)\s*esthetic-ignore-end\b/;

/**
 * Captures esthetic inline comment ignore next line
 *
 * [Regex101](https://regex101.com/r/DBL6TR/1)
 * ---
 *
 * @example
 *
 * LINE COMMENT:    // @esthetic-ignore-next
 * BLOCK COMMENT:   /* @esthetic-ignore-next
 * LINE LIQUID:     {% # @esthetic-ignore-next
 * BLOCK LIQUID:    {% comment %} @esthetic-ignore-next
 * HTML COMMENT:    <!-- @esthetic-ignore-next
 * YAML COMMENT:    # @esthetic-ignore-next
 */
export const CommIgnoreNext = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!--)\s*esthetic-ignore-next\b/;

/**
 * Captures list item occurance of a bullet point character
 *
 * ---
 *
 * @example /^\s*[*-]\s/
 *
 * - one
 * - two
 *
 *  // OR
 *
 * * one
 * * two
 */
export const CommBulletLine = /^\s*[*-]\s/;

/**
 * Captures list item occurance of a number
 *
 * ---
 *
 *
 * @example /^\s*\d+\.\s/
 *
 *  1. one
 *  2. two
 *
 */
export const CommNumberLine = /^\s*\d+\.\s/;

/**
 * Captures list item occurances within comment blocks
 *
 * [Regex101](https://regex101.com/r/WB0gZp/1)
 *
 * ---
 *
 * @example /^\s*(?:[*-]|\d+\.)\s/
 *
 */
export const CommLineChars = /^\s*(?:[*-]|\d+\.)\s/;

/**
 * HTML Attribute End
 *
 * Closing delimiter detection for tag attributes
 *
 * ---
 *
 * @example /(?!=)\/?>$/
 *
 */
export const HTMLAttributeEnd = /(?!=)\/?>$/;

/**
 * HTML Comment Opening Delimiter
 *
 * Opening delimiter for HTML comment tokens
 *
 * ---
 *
 * @example /^<!--+/
 *
 */
export const HTMLCommDelimOpen = /^<!--+/;

/**
 * HTML Comment Closing Delimiter
 *
 * Closing delimiter for HTML comment tokens
 *
 * ---
 *
 * @example /--+>$/
 *
 */
export const HTMLCommDelimClose = /--+>$/;

/**
 * Liquid Left Tag Delimiter
 *
 * ---
 *
 * @example /[a-zA-Z0-9_$#]+/
 *
 */
export const LiquidTagName = /[a-zA-Z0-9_$#]+/;

/**
 * Liquid Left Tag Delimiter with spaces
 *
 * ---
 *
 * @example /({%-?)(\s*)/
 *
 */
export const LiquidLeftDelimiter = /({%-?)(\s*)/;

/**
 * Liquid Right Tag Delimiter with spaces
 *
 * ---
 *
 * @example /(\s*)(-?%})/
 *
 */
export const LiquidRightDelimiter = /(\s*)(-?%})/;

/**
 * Liquid Tag Delimiters
 *
 * Used in the `wrapCommentBlock` method of the `Parser` class, captures
 * Liquid Tag delimiters, see example.
 *
 * ---
 *
 * @example /{%-?|-?%}/g
 *
 */
export const LiquidDelimiters = /{%-?|-?%}/g;

/**
 * Liquid Tag Match
 *
 * Starting position (`^`) expression for capturing Liquid Tag Type `{% liquid %}` token.
 *
 * [Regex101]( https://regex101.com/r/EVf8kY/1)
 *
 * ---
 *
 * @example /^{%-?\s*liquid\b/
 *
 */
export const LiquidTag = /^{%-?\s*liquid\b/;

/**
 * Liquid Comment Match
 *
 * Starting position (`^`) expression for capturing a Liquid block comment
 * (`{% comment %}`) or line comment (`{% # %}`) tag token.
 *
 * [Regex101](https://regex101.com/r/EdCJTV/1)
 *
 * ---
 *
 * @example https://regex101.com/r/EdCJTV/1
 *
 */
export const LiquidComment = /^{%-?\s*(?:#|comment\b)/;

/**
 * Liquid Line Comment Match
 *
 * Starting position (`^`) expression for capturing a Liquid line comment (`{% # %}`) tag token.
 *
 * [Regex101](https://regex101.com/r/nKULIP/1)
 *
 * ---
 *
 * @example /^{%-?\s*#/
 *
 */
export const LiquidLineComment = /^{%-?\s*#/;

/**
 * Liquid Line Comment Hash
 *
 * Tests for a hash + whitespace (or none)
 *
 * ---
 *
 * @example /#\s+|#\S/
 *
 */
export const LiquidLineCommentHash = /#\s+|#/;

/**
 * Liquid Line Comment
 *
 * Tests for the existence of a newline following the first delimiter or first hash
 *
 * ---
 *
 * @example /^{%-?\n|{%-?\s*#\n/
 *
 */
export const LiquidLineCommForce = /^{%-?\n|{%-?\s*#\n/;

/**
 * Liquid Ending Delimiter Newline
 *
 * Tests for the existence of a newline at the ending delimiter point.
 *
 * ---
 *
 * @example /\n\s*-?%}$/
 *
 */
export const LiquidEndDelimiterNewline = /\n\s*-?%}$/;

/**
 * Liquid Block Comment Match
 *
 * Starting position (`^`) expression for capturing a Liquid block comment (`{% comment %}`) tag token.
 *
 * [Regex101](https://regex101.com/r/qw8avq/1)
 *
 * ---
 *
 * @example /^{%-?\s*comment\b/
 *
 */
export const LiquidBlockComment = /^{%-?\s*comment\b/;

/**
 * Liquid Block Comment Newline
 *
 * ---
 *
 * @example /comment\s*-?%}[\r\n]/
 *
 */
export const LiquidCommentNewline = /comment\s*-?%}[\r\n]/;

/**
 * Liquid Attribute
 *
 * [Regex101](https://regex101.com/r/qw8avq/1)
 *
 * ---
 *
 * @example /[%}]}=(?:["']|{[{%])/
 *
 */
export const LiquidAttr = /[%}]}=(?:["']|{[{%])/;

/**
 * Liquid Filter Existence
 *
 * ---
 *
 * @example /\|\s*[a-z0-9_]+/
 *
 */
export const LiquidFilter = /\|\s*[a-z0-9_]+/;

/**
* Character Escape
*
* Used in the `wrapCommentBlock` method of the `Parser` class.
*
* ---
*
* @example /(\/|\\|\||\*|\[|\]|\{|\})/g
*
*/
export const CharEscape = /(\/|\\|\||\*|\[|\]|\{|\})/g;
