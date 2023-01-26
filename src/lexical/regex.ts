/**
 * Non Space
 *
 * Non whitespace or newline character
 *
 * ---
 *
 * ```js
 *
 * '\S'
 *
 * ```
 *
 */
export const NonSpace = /\S/;

/**
 * Empty Line
 *
 * Leading and ending whitespace or newline characters
 *
 * ---
 *
 * ```js
 *
 * /^\s+$/
 *
 * ```
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
 * ```js
 *
 * '\s*'
 *
 * ```
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
 * ```js
 *
 * /\s+/g
 *
 * ```
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
 * ```js
 *
 * /^\s+/
 *
 * BEFORE: '  \n  foo  '
 * AFTER:  'foo  '
 *
 *
 * ```
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
 * ```js
 *
 * /\s+$/
 *
 * BEFORE: '  foo   \n '
 * AFTER:  '  foo'
 *
 *
 * ```
 */
export const SpaceEnd = /\s+$/;

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
 * ```js
 *
 * /^[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/
 *
 * BEFORE: ' \n  foo'
 * AFTER:  '\nfoo'
 *
 *
 * ```
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
 * ```js
 *
 * /[\t\v\f \u00a0\u2000-\u200b\u2028-\u2029\u3000]+$/
 *
 * BEFORE: ' \n  foo'
 * AFTER:  '\nfoo'
 *
 *
 * ```
 */
export const WhitespaceEnd = /[\t\v\f \u00a0\u2000-\u200b\u2028-\u2029\u3000]+$/;

/**
 * All Whitespaces
 *
 * Global capture of more than 1 whitespace character occurances but does not touch newlines.
 *
 * ---
 *
 * ```js
 *
 * ' \t\v\r '
 *
 *
 * ```
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
 * ```js
 *
 * '\t\v\r '
 *
 * ```
 */
export const WhitespaceChar = /[\t\v\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]/;

/**
 * Leading Newlines
 *
 * 1 or more leading newline characters
 *
 * ---
 *
 * ```js
 *
 * /^\n+/
 *
 *
 * ```
 *
 */
export const NewlineLead = /^\n+/;

/**
 * All Tab Characters
 *
 * Global captures of more than 1 tab character occurances but does not touch newlines.
 *
 * ---
 *
 * ```js
 *
 * BEFORE: 'foo   \t\n '
 * AFTER:  'foo   \n'
 *
 * ```
 */
export const TabsGlob = /\t+/g;

/**
 * Regex is used to inject whitespace and equally distributes spacing
 * within Liquid tokens. It directly relates to `normalizeSpacing` rules.
 *
 * - `g` Global Flag
 *
 * ---
 *
 * https://regex101.com/r/jxLNhv/1
 *
 * ```js
 *
 * BEFORE: '|filter:" foo "|append:123'
 * AFTER:  '| filter: " foo " | append: 123'
 *
 * ```
 */
export const SpaceInjectBefore = /[|:,[\]](?=[0-9a-z-])/g;

/**
* Regex is used to inject whitespace and equally distributes spacing
* within Liquid tokens. It directly relates to `normalizeSpacing` rules.
* This regex is specifically used for prefixed token characters.
*
* ---
*
* @see https://regex101.com/r/jxLNhv/1
* @example
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
* @example
*
* BEFORE: 'object . prop'
* AFTER:  'object.prop' // SpaceInjectBefore will handle `="bar"`
*/
export const StripSpaceInject = /[.[\]] {1,}/g;

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
 * ---
 *
 * @see https://regex101.com/r/TTD6yY/1
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
* ---
* @see https://regex101.com/r/Niv3Z0/1
* @example
*
* LINE COMMENT:    // esthetic-ignore
* BLOCK COMMENT:   /* esthetic-ignore
* LINE LIQUID:     {% # esthetic-ignore
* BLOCK LIQUID:    {% comment %} esthetic-ignore
* HTML COMMENT:    <!-- esthetic-ignore
* YAML COMMENT:    # esthetic-ignore
*/
export const CommIgnoreFile = /(\/[*/]|{%-?\s*(?:comment\s*-?%})|<!-{2})\s*esthetic-ignore\b/;

/**
* Captures esthetic inline comment ignore starters
*
* ---
* @see https://regex101.com/r/BvjwOE/1
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
 * ---
 * @see https://regex101.com/r/Uv5QGq/1
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
 * ---
 * @see https://regex101.com/r/9LAPKl/1
 * @example
 *
 * BLOCK COMMENT:    /* esthetic-ignore-start
 */
export const CommBlockIgnoreStart = /^\/\*{1,2}(?:\s*|\n\s*\*\s*)esthetic-ignore-start\b/;

/**
* Captures esthetic inline comment ignore enders
*
* ---
* @see https://regex101.com/r/zau2rO/1
* @example
*
* LINE COMMENT:    // esthetic-ignore-end
* BLOCK COMMENT:   /* esthetic-ignore-end
* LINE LIQUID:     {% # esthetic-ignore-end
* BLOCK LIQUID:    {% comment %} esthetic-ignore-end
* HTML COMMENT:    <!-- esthetic-ignore-end
* YAML COMMENT:    # esthetic-ignore-end
*/
export const CommIgnoreEnd = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*esthetic-ignore-end\b/;

/**
 * Captures esthetic inline comment ignore next line
 *
 * ---
 *
 * @see https://regex101.com/r/dpJ3Xq/1
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
 * HTML Comment Opening Delimiter
 *
 * Opening delimiter for HTML comment tokens
 *
 * ---
 *
 * ```js
 *
 * /^<!--+/
 *
 * ```
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
 * ```js
 *
 * /--+>$/
 *
 * ```
 *
 */
export const HTMLCommDelimClose = /--+>$/;

/**
 * Liquid Tag Delimiters
 *
 * Used in the `wrapCommentBlock` method of the `Parser` class, captures
 * Liquid Tag delimiters, see example.
 *
 * ---
 *
 * @example /{%-?\s*|\s*-?%}/g
 *
 */
export const LiquidDelimiters = /{%-?|-?%}/g;

/**
 * Liquid Tag Match
 *
 * Starting position (`^`) expression for capturing Liquid Tag Type `{% liquid %}` token.
 *
 * ---
 * @see https://regex101.com/r/EVf8kY/1
 *
 */
export const LiquidTag = /^{%-?\s*liquid\b/;

/**
 * Liquid Comment Match
 *
 * Starting position (`^`) expression for capturing a Liquid block comment
 * (`{% comment %}`) or line comment (`{% # %}`) tag token.
 *
 * ---
 * @see https://regex101.com/r/EdCJTV/1
 *
 */
export const LiquidComment = /^{%-?\s*(?:#|comment\b)/;

/**
 * Liquid Line Comment Match
 *
 * Starting position (`^`) expression for capturing a Liquid line comment (`{% # %}`) tag token.
 *
 * ---
 * @see https://regex101.com/r/nKULIP/1
 *
 */
export const LiquidLineComment = /^{%-?\s*#/;

/**
 * Liquid Block Comment Match
 *
 * Starting position (`^`) expression for capturing a Liquid block comment (`{% comment %}`) tag token.
 *
 * ---
 * @see https://regex101.com/r/qw8avq/1
 *
 */
export const LiquidBlockComment = /^{%-?\s*comment\b/;

/**
 * Liquid Attribute
 *
 * ```js
 * /[%}]}=(?:["']|{[{%])/
 * ```
 *
 * ---
 * @see https://regex101.com/r/qw8avq/1
 *
 */
export const LiquidAttr = /[%}]}=(?:["']|{[{%])/;

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
