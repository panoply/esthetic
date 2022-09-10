/* eslint-disable no-unused-vars */

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
