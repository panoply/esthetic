
export const enum Modes {
  Parse = 1,
  Embed,
  Format
}

export const enum Lexers {
  Markup = 1,
  Script,
  Style,
  Ignore
}

export const enum Beautifiers {
  Markup = 1,
  Script,
  Style,
}

export const enum TokenType {
  /**
   * Liquid output token
   *
   * @example
   * {{ output }}
   */
  LiquidOutput = 1,
  /**
   * Liquid start tag token (requires end tag)
   *
   * @example
   * {% start %}
   */
  LiquidStartTag,
  /**
   * Liquid start tag token (requires start tag)
   *
   * @example
   * {% endtag %}
   */
  LiquidEndTag,
  /**
   * Liquid singular tag token
   *
   * @example
   * {% tag %}
   */
  LiquidSingular,
  /**
   * Markup start Tag
   *
   * @example
   * <div>
   */
  MarkupStart,
  /**
   * Markup end Tag
   *
   * @example
   * </div>
   */
  MarkupEnd,
  /**
   * Markup void tag
   *
   * @example
   * <tag />
   */
  MarkupVoid
}

export const enum Languages {
  /**
   * Automatic Detetection
   */
  Auto = 1,
  /**
   * HTML
   */
  HTML,
  /**
   * Liquid
   */
  Liquid,
  /**
   * JSON
   */
  JSON,
  /**
   * JSONC
   */
  JSONC,
  /**
   * YAML
   */
  YAML,
  /**
   * CSS
   */
  CSS,
  /**
   * SCSS
   */
  SCSS,
  /**
   * SASS
   */
  SASS,
  /**
   * LESS
   */
  LESS,
  /**
   * XML
   */
  XML,
  /**
   * JSX
   */
  JSX,
  /**
   * TSX
   */
  TSX,
  /**
   * JavaScript
   */
  JavaScript,
  /**
   * TypeScript
   */
  TypeScript
}

export const enum TagBlocks {
  /**
   * Infers a non Liquid tag match match, eg:
   *
   * `{{ output }}`
   */
  NonTagBlock = 1,
  /**
   * Infers a Liquid Start or Else but 2nd token is an output type, eg:
   *
   * `{% start %} {{ output }}`
   */
  StartAndObject,
  /**
   * Infers a Liquid Start or Else but 2nd token is an output type, eg:
   *
   * `{% ender %} {% ender %}`
   */
  EndAndEnd,
  /**
   * Infers a Liquid tag wherein the 1st token is an Ender type and 2nd an else, eg:
   *
   * `{% ender %} {% elsif %}`
   */
  EndAndElse,
  /**
   * Infers a Liquid tag wherein the 1st token is an Ender type and 3nd a starter, eg:
   *
   * `{% ender %} {% starter %}`
   */
  EndAndStart,
  /**
   * Infers a Liquid tag block wherein the 2nd token is an ELSE type, eg:
   *
   *  `{% start %} {% else %}`
   */
  StartAndElse,
  /**
   * Infers a Liquid tag wherein the 2nd token is an ELSE type, eg:
   *
   * `{% start %} {% endstart %}`
   */
  StartAndEnd,
  /**
   * Infers a Liquid tag wherein the 1st token is an ELSE type, eg:
   *
   * `{% when %} {% endcase %}`
   */
  ElseAndEnd,
}

/**
 * Liquid Tag enum reference which is use by the `isLiquid` utility.
 */
export const enum LT {
  /**
   * Check from index `0` opening delimiters,
   *
   * ```liquid
   *
   * {{    ✓ // true
   * {%    ✓ // true
   *
   * xx{{ 𐄂 // false
   * xx{% 𐄂 // false
   * ```
   */
  Open = 1,
  /**
   * Check from end of string for closing delimiters
   *
   * ```liquid
   *
   * }}    ✓ // true
   * %}    ✓ // true
   *
   * }}xx  𐄂 // false
   * %}xx  𐄂 // false
   * ```
   */
  Close,
  /**
   * Check for containment of both starting and ending delimiters at start and end index
   *
   * ```liquid
   *
   * {{ foo }}    ✓ // true
   * {% tag %}    ✓ // true
   *
   * x{{ foo }}x  𐄂 // false
   * x{% tag %}x  𐄂 // false
   * ```
   */
  OpenAndClose,
  /**
   * Check for containment of starting delimiters at any index
   *
   * ```liquid
   *
   * xx{{     ✓ // true
   * xx{%     ✓ // true
   *
   * string   𐄂 // false
   * {}%%     𐄂 // false
   * ```
   */
  HasOpen,
  /**
   * Check for containment of both opening and closing delimiters at any index
   *
   * ```liquid
   *
   * x{{ foo }}x  ✓ // true
   * x{% tag %}x  ✓ // true
   *
   * string       𐄂 // false
   * string={}    𐄂 // false
   * ```
   */
  HasOpenAndClose,
  /**
   * Check string starts with (from index `0` and `1`) tag opening delimiters
   *
   * ```liquid
   *
   * {%    ✓ // true
   * {{    𐄂 // false
   * x{%   𐄂 // false
   * ```
   */
  OpenTag,
  /**
   * Check string starts with (from index `0` and `1`) output opening delimiters
   *
   * ```liquid
   *
   * {{    ✓ // true
   * {%    𐄂 // false
   * x{{   𐄂 // false
   * ```
   */
  OpenOutput,
  /**
   * Check string ends with closing tag delimiters
   *
   * ```liquid
   *
   * xxx %}    ✓ // true
   * xxx }}    𐄂 // false
   *
   * ```
   */
  CloseTag,
  /**
   * Check string ends with closing output delimiters
   *
   * ```liquid
   *
   * xxx }}    ✓ // true
   * xxx %}    𐄂 // false
   *
   * ```
   */
  CloseOutput
}
