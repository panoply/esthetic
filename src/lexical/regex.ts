/**
 * Strip the leading whitespace and newlines.
 *
 * ---
 *
 * @example
 *
* BEFORE: '  \n  foo  '
* AFTER:  'foo  ' // leading whitespace and newlines are preserved
*/
export const SpaceLead = /^\s+/;

/**
* Strip the ending whitespace excluding newlines.
*
*
* ---
*
* @see https://stackoverflow.com/a/3873354/2021554
*
* @example
*
* BEFORE: '  foo  \n  '
* AFTER:  '  foo' // leading whitespace and newlines are preserved
*/
export const SpaceEnd = /\s+$/;

/**
* Strip the leading whitespace excluding newlines.
*
* This will remove carriage returns (`\r`), so if the input contains
* `\r\n` pairs, they will be converted to just `\n`.
*
* ---
*
* @see https://stackoverflow.com/a/3873354/2021554
*
* @example
*
* BEFORE: ' \n  foo'
* AFTER:  '\nfoo' // leading whitespace and newlines are preserved
*/
export const StripLead = /^[\t\v\f\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/;

/**
* Strip the ending whitespace excluding newlines.
*
* This will remove carriage returns (`\r`), so if the input contains
* `\r\n` pairs, they will be converted to just `\n`.
*
* ---
*
* @see https://stackoverflow.com/a/3873354/2021554
* @example
*
* BEFORE: '  foo  \n  '
* AFTER:  '  foo\n' // leading whitespace and newlines are preserved
*/
export const StripEnd = /[\t\v\f \u00a0\u2000-\u200b\u2028-\u2029\u3000]+$/;

/**
* Captures more than 1 whitespace character occurances but does not touch newlines.
*
* ---
*
* @example
*
* ' \t\v\r '
*/
export const SpaceOnly = /[\t\v\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]+/g;

/**
* Captures whitespace only
*
* ---
*
* @example
*
* '\t\v\r '
*/
export const Whitespace = /[\t\v\r \u00a0\u2000-\u200b\u2028-\u2029\u3000]/;
/**
* Captures more than 1 tab character occurances but does not touch newlines.
*
* ---
*
* @example
*
* BEFORE: 'foo   \t\n '
* AFTER:  'foo   \n'
*/
export const TabsOnly = /\t+/g;

/**
* Regex is used to inject whitespace and equally distributes spacing
* within Liquid tokens. It directly relates to `normalizeSpacing` rules.
*
* ---
*
* @see https://regex101.com/r/jxLNhv/1
* @example
*
* BEFORE: '|filter:" foo "|append:123'
* AFTER:  '| filter: " foo " | append: 123'
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
* Captures esthetic inline comment file ignores
*
* ---
* @see https://regex101.com/r/nZJp18/1
* @example
*
* LINE COMMENT:    // @esthetic-ignore
* BLOCK COMMENT:   /* @esthetic-ignore
* LINE LIQUID:     {% # @esthetic-ignore
* BLOCK LIQUID:    {% comment %} @esthetic-ignore
* HTML COMMENT:    <!-- @esthetic-ignore
* YAML COMMENT:    # @esthetic-ignore
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
export const CommIgnoreNext = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|<!-{2})\s*esthetic-ignore-next\b/;

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
