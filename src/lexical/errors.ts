export const enum ErrorTypes {
  /**
   * Syntax Error
   */
  SyntaxError = 1,
  /**
   * Configuration Error
   */
  ConfigurationError,
  /**
   * Grammar Error
   */
  GrammarError
}

export const enum ParseWarn {

  LiquidHangingComma = 201
}

export const enum ParseError {

  /* -------------------------------------------- */
  /* COMMON                                       */
  /* -------------------------------------------- */

  /**
   * Unterminated String
   *
   * @example
   *  const x '
   */
  UnterminateString = 101,
  /**
   * Invalid Quotation Character
   *
   * @example
   * <div id=“xx”> // Invalid quote characters
   */
  InvalidCharacter,
  /**
   * Invalid Quotation Character
   *
   * @example
   * <div id=“xx”> // Invalid quote characters
   */
  InvalidQuotation,

  /* -------------------------------------------- */
  /* HTML                                         */
  /* -------------------------------------------- */

  /**
   * Invalid HTML End Tag Placement
   *
   * @example
   * <div>
   * </div>
   * </div> // missing HTML Start tag
   */
  MissingHTMLStartTag,
  /**
   * Missing HTML End Tag
   *
   * @example
   * <div> // Missing ending </div> tag
   */
  MissingHTMLEndTag,
  /**
   * Invalid HTML End Tag Placement
   *
   * @example
   * <div>
   * </div // missing HTML Delimiter
   */
  MissingHTMLEndingDelimiter,
  /**
   * Invalid Comment Attribute
   *
   * @example
   * <div <!-- comment --> id="foo"> // Comment cannot be placed within a attribute
   */
  InvalidHTMLCommentAttribute,
  /**
   * Invalid CDATA Termination
   *
   * @example
   * ]]> // Invalid CDATA ending
   */
  InvalidCDATATermination,

  /* -------------------------------------------- */
  /* CSS / SCSS                                   */
  /* -------------------------------------------- */

  /**
   * Brace Mismatch
   *
   * @example
   */
  BraceMismatchCSS,

  /* -------------------------------------------- */
  /* LIQUID                                       */
  /* -------------------------------------------- */

  /**
   * Missing Liquid Start Tag
   *
   * @example
   * {% for xxx %}
   * {% endfor %}
   * {% endunless %} // missing Liquid Start tag
   */
  MissingLiquidStartTag,
  /**
   * Missing Liquid Ending Delimiter
   *
   * @example
   * {% for xx  // Missing  %} delimiter
   * {{ object  // Missing  }} delimiter
   */
  MissingLiquidCloseDelimiter,
  /**
   * Missing HTML End Tag
   *
   * @example
   * {% for xxx %} // Missing {% endfor %} tag
   */
  MissingLiquidEndTag,
  /**
   * Missing Liquid Filter Argument
   *
   * @example
   * {{ xxx || }}
   */
  MissingLiquidFilter,
  /**
   * Invalid Liquid Character Sequence
   *
   * @example
   * {% render 'x',, %} // double commas is not valid
   */
  InvalidLiquidCharacterSequence
}
