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
 * BEFORE: '  foo'
 * AFTER:  'foo' // leading whitespace and newlines are preserved
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
 * Captures Prettify inline comment controls
 *
 * ---
 * @see https://regex101.com/r/js1E4u/1
 * @example
 *
 * LINE COMMENT:    // @prettify
 * BLOCK COMMENT:   /* @prettify
 * LINE LIQUID:     {% # @prettify
 * BLOCK LIQUID:    {% comment %} @prettify
 * HTML COMMENT:    <!-- @prettify
 * YAML COMMENT:    # @prettify
 */
export const CommControl = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|#|<!-{2})\s*@prettify\s+/;

/**
 * Captures Prettify inline comment file ignores
 *
 * ---
 * @see https://regex101.com/r/ww472j/1
 * @example
 *
 * LINE COMMENT:    // @prettify-ignore
 * BLOCK COMMENT:   /* @prettify-ignore
 * LINE LIQUID:     {% # @prettify-ignore
 * BLOCK LIQUID:    {% comment %} @prettify-ignore
 * HTML COMMENT:    <!-- @prettify-ignore
 * YAML COMMENT:    # @prettify-ignore
 */
export const CommIgnoreFile = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|#|<!-{2})\s*@prettify-ignore\b/;

/**
 * Captures Prettify inline comment ignore starters
 *
 * ---
 * @see https://regex101.com/r/QWwU3p/1
 * @example
 *
 * LINE COMMENT:    // @prettify-ignore-start
 * BLOCK COMMENT:   /* @prettify-ignore-start
 * LINE LIQUID:     {% # @prettify-ignore-start
 * BLOCK LIQUID:    {% comment %} @prettify-ignore-start
 * HTML COMMENT:    <!-- @prettify-ignore-start
 * YAML COMMENT:    # @prettify-ignore-start
 */
export const CommIgnoreStart = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|#|<!-{2})\s*@prettify-ignore-start\b/;

/**
 * Captures Prettify inline comment ignore enders
 *
 * ---
 * @see https://regex101.com/r/sVwE1z/1
 * @example
 *
 * LINE COMMENT:    // @prettify-ignore-end
 * BLOCK COMMENT:   /* @prettify-ignore-end
 * LINE LIQUID:     {% # @prettify-ignore-end
 * BLOCK LIQUID:    {% comment %} @prettify-ignore-end
 * HTML COMMENT:    <!-- @prettify-ignore-end
 * YAML COMMENT:    # @prettify-ignore-end
 */
export const CommIgnoreEnd = /(\/[*/]|{%-?\s*(?:comment\s*-?%}|#)|#|<!-{2})\s*@prettify-ignore-end\b/;

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
export const LiquidTagDelimiters = /{%-?\s*|\s*-?%}/g;

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
