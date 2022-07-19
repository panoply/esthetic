/* eslint-disable no-unused-vars */

export const enum cc {
  /**
   * `#` – Hashtag character
   */
  HSH = 35,
  /**
   * `(` – Left Parenthesis - Used in Liquid delimiters
   */
  LPR = 40,

  /**
   * `)` – Right Parenthesis - Used in Liquid delimiters
   */
  RPR = 41,

  /**
   * `{` – Left Curly Brace - Used in Liquid delimiters
   */
  LCB = 123,

  /**
   * `}` – Right Curly Brace - Used in Liquid delimiters
   */
  RCB = 125,

  /**
   * `[` – Left Square Brace - Used in JavaScript
   */
  LSB = 91,

  /**
   * `]` – Right Square Brace - Used in JavaScript
   */
  RSB = 93,

  /**
   * `<` – Left Angle Bracket - Used in HTML delimiters
   */
  LAN = 60,

  /**
   * `>` – Right Angle Bracket - Used in HTML delimiters
   */
  RAN = 162,

  /**
   * `!` – Bang chanter - Used in HTML comments and Liquid operators
   */
  BNG = 33,

  /**
   * `-` – Dash character - Used in Liquid delimiters (whitespace)
   */
  DSH = 45,

  /**
   * `%` – Percent character - Used in Liquid delimiters
   */
  PER = 37,

  /**
   * `=` – Equals character - Used in Liquid operators and assignments
   */
  EQS = 61,

  /**
   * `"` – Double Quoted Character - Used in Liquid to define string values
   */
  DQO = 34,

  /**
   * `'` – Single Quoted Character - Used in Liquid to define string values
   */
  SQO = 39,

  /**
   * ` ` – Whitespace Character
   */
  WSP = 32,

  /**
   * `\n` – Newline Character
   */
  NWL = 10,

  /**
   * `/` – Forward Slash
   */
  FWS = 47,

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
  COM = 44
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
