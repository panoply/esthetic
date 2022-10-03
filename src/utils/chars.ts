/* eslint-disable no-unused-vars */

/**
 * `''` –  Empty String
 */
export const NIL = '';

/**
 * ` ` – Single whitespace character
 */
export const WSP = ' ';

/**
 * `\n` – Newline character
 */
export const NWL = '\n';

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
  RAN = 62,

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
  COM = 44,

  /**
   * `+` - Plus
   */
  PLS = 43
}
