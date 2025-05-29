import type { LiteralUnion } from 'type-fest';

export interface GlobalRules {
  /**
   * Default: `none`
   *
   * **Global**
   *
   * **[Preset](https://aesthetic.js.org/rules/preset)**
   *
   * A preset ruleset style guide to use. This will assign rules according to a set of defaults
   * to produce a certain beautification result.
   *
   * > `none`
   *
   * > This is the default preset, it assumes custom rules to be provided and applies the least
   * > obtrusive formatting rules.
   *
   * > `aesthetic`
   *
   * > This is a strict ruleset curated by the projects author [Panoply](https://github.com/panoply).
   *
   * > `warrington`
   *
   * > This style guide preset is best suited for developers and specifically teams working with
   * > Shopify themes. The preset was curated by the talented [David Warrington](https://ellodave.dev/).
   *
   * > `prettier`
   *
   * > Replicates the Prettier style of formatting. If you've used the Shopify Liquid Prettier Plugin and
   * > enjoy that beautification style using this preset will produce the same results.
   *
   */
  preset?: LiteralUnion<'none' | 'aesthetic'| 'warrington'| 'prettier', string> ;
  /**
   * Default: `auto`
   *
   * **Global**
   *
   * **[Language](https://aesthetic.js.org/rules/language)**
   *
   * The name of the language provided.
   */
  language?: LiteralUnion<
    | 'auto'
    | 'liquid'
    | 'html'
    | 'xml'
    | 'json'
  , string>
  /**
   * Default: `2`
   *
   * **Global**
   *
   * **[Indent Size](https://aesthetic.js.org/rules/indentSize)**
   *
   * The number of `indentChar` values to comprise a single indentation.
   */
  indentSize?: number;
  /**
   * Default: `' '`
   *
   * **Global**
   *
   * **[Indent Char](https://aesthetic.js.org/rules/indentChar)**
   *
   * The string characters to comprise a single indentation. Any string combination is accepted.
   * Use the `indentSize` to set indentation limit for spaces. To use tabs, set this to `'\t'`
   * and `indentSize` to `1` (or more).
   */
  indentChar?: string;
  /**
   * Default: `0`
   *
   * **Global**
   *
   * **[Indent Level](https://aesthetic.js.org/rules/indentLevel)**
   *
   * Applies a starting point indentation level for applied usage with third parties.
   * It is very unlikely you'll want to use this and it best to keep it set to `0`.
   */
  indentLevel?: number;
  /**
   * Default: `0`
   *
   * **Global**
   *
   * **[Word Wrap](https://aesthetic.js.org/rules/wordWrap)**
   *
   * Character width limit before applying word wrap. A `0` value disables this option.
   */
  wordWrap?: number;
  /**
   * Default: `false`
   *
   * **Global**
   *
   * **[End Newline](https://aesthetic.js.org/rules/endNewline)**
   *
   * Whether or not to insert a final line.
   */
  endNewline?: boolean;
  /**
   * Default: `LF`
   *
   * **Global**
   *
   * **[CRLF](https://aesthetic.js.org/rules/crlf)**
   *
   * If line termination should be Windows (CRLF) format. Unix (LF) format is the default.
   */
  lineTermination?: 'CRLF' | 'LF';
  /**
   * Default: `2`
   *
   * **Global**
   *
   * **[Preserve Line](https://aesthetic.js.org/rules/preserveLine)**
   *
   * The maximum number of consecutive empty lines to retain.
   */
  preserveLine?: number;
  /**
   * Default: `false`
   *
   * **Global**
   *
   * **[Comment Preserve](https://aesthetic.js.org/rules/commentPreserve/)**
   *
   * Prevent Æsthetic from carrying out formatting on comments. When enabled comment formatting
   * will be ignored and comment related rules will be excluded.
   *
   * > **NOTE**
   * >
   * > **This rule will override and run precedence on the `commentIndent` rule.**
   * > **When enabled (i.e, `true`) it will have no effect.**
   *
   */
  commentPreserve?: boolean;
  /**
   * Default: `true`
   *
   * **Global**
   *
   * **[Comment Indent](https://aesthetic.js.org/rules/commentIndent/)**
   *
   * This will determine whether comments should always start at position `0` of each line
   * or if comments should be indented according to the code.
   */
  commentIndent?: boolean;
  /**
   * Default: `false`
   *
   * **HTML / Liquid**
   *
   * **[Ignore JSON](https://aesthetic.js.org/rules/ignoreJSON/)**
   *
   * Whether HTML `<script type="application/json>` tags or those annotated with a
   * JSON identifiable attribute should be ignored from beautification. When disabled,
   * formatting will be applied in accordancee with rules defined in the `json` ruleset.
   *
   */
  ignoreJSON?: boolean;
  /**
   * Default: `preserve`
   *
   * **HTML / Liquid**
   *
   * **[Single Quotes](https://aesthetic.js.org/rules/singleQuote/)**
   *
   * Controls quotation character conversion of markup and liquid tokens. The rule will
   * apply reverse conversion in nested quotation expressions.
   *
   * > `preserve`
   *
   * > Preserve single quotation character occurences
   *
   * > `never`
   *
   * > Prevent single quotation character usage, forcing double quotes.
   *
   * > `always`
   *
   * > Prevent double quotation character usage, forcing single quotes.
   *
   * > `liquid`
   *
   * > Use single quotation characters on Liquid tokens and double on Markup tokens.
   *
   * > `markup`
   *
   * > Use single quotation characters on markup tokens and double on Liquid tokens.
   */
  singleQuote?: LiteralUnion<'preserve' | 'never' | 'always' | 'liquid' | 'markup', string>;
}
