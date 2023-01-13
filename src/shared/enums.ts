/* eslint-disable no-unused-vars */

/* -------------------------------------------- */
/* CHARACTER CODES                              */
/* -------------------------------------------- */

export const enum cc {
  /**
   * `@` – The at character
   */
  ATT = 64,

  /**
   * `.` – The dot character
   */
  DOT = 46,

  /**
   * `^` – Upp Character
   */
  UPP = 94,

  /**
   * `~` – Squiggle Dash
   */
  SDH = 94,

  /**
   * `#` – Hashtag character
   */
  HSH = 35,

  /**
   * `(` – Left Parenthesis
   */
  LPR = 40,

  /**
   * `)` – Right Parenthesis
   */
  RPR = 41,

  /**
   * `{` – Left Curly Brace
   */
  LCB = 123,

  /**
   * `|` – Pipe Character
   */
  PIP = 124,

  /**
   * `}` – Right Curly Brace
   */
  RCB = 125,

  /**
   * `[` – Left Square Brace
   */
  LSB = 91,

  /**
   * `]` – Right Square Brace
   */
  RSB = 93,

  /**
   * `<` – Left Angle Bracket
   */
  LAN = 60,

  /**
   * `>` – Right Angle Bracket
   */
  RAN = 62,

  /**
   * `!` – Bang character
   */
  BNG = 33,

  /**
   * `-` – Dash character
   */
  DSH = 45,

  /**
   * `%` – Percent character
   */
  PER = 37,

  /**
   * `=` – Equals character
   */
  EQS = 61,

  /**
   * `"` – Double Quoted Character
   */
  DQO = 34,

  /**
   * `'` – Single Quoted Character
   */
  SQO = 39,

  /**
   * ` - Template Quoted charactets
   */
  TQO = 96,

  /**
   * ` ` – Whitespace Character
   */
  WSP = 32,

  /**
   * `\n` – Newline Character
   */
  NWL = 10,

  /**
   * `\r` – Carriage rEturn Character
   */
  CAR = 13,

  /**
   * `\` – Backward Slash
   */
  BWS = 92,

  /**
   * `/` – Forward Slash
   */
  FWS = 47,

  /**
   * `$` – Dollar Character
   */
  DOL = 36,

  /**
   * `?` – Question Mark
   */
  QWS = 63,
  /**
   * `*` – Asterix
   */
  ARS = 42,

  /**
   * `:` - Colon
   */
  COL = 58,

  /**
   * `;` - Semicolon
   */
  SEM = 59,

  /**
   * `,` - Comma
   */
  COM = 44,

  /**
   * `+` - Plus
   */
  PLS = 43,

  /**
   * `&` - And
   */
  AND = 38
}

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
