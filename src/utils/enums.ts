/* eslint-disable no-unused-vars */

export const enum cc {

  /**
   * `{` – Left Curly Brace - Used in Liquid delimiters
   */
  LCB = 123,

  /**
   * `}` – Right Curly Brace - Used in Liquid delimiters
   */
  RCB = 125,

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
