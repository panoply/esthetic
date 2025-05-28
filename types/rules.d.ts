import { LiteralUnion } from 'type-fest';

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
   * > `recommended`
   *
   * > This style guide is typically suited for most cases, it will apply a base set of
   * > rules aligned with the Æsthetic approach.
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
  preset?: LiteralUnion<'none'| 'recommended'| 'aesthetic'| 'warrington'| 'prettier', string> ;
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
   * Default: `false`
   *
   * **Global**
   *
   * **[CRLF](https://aesthetic.js.org/rules/crlf)**
   *
   * If line termination should be Windows (CRLF) format. Unix (LF) format is the default.
   */
  crlf?: boolean;
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
   * **Global Rule**
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

}

export interface SharedRules {
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

export interface LiquidRules {
  /**
   * Default: `0`
   *
   * **Liquid**
   *
   * **[Argument Line Break](https://aesthetic.js.org/rules/argumentLineBreak/)**
   *
   * The number of tag arguments or parameters allowed before applying a newline break.
   * By default, this is set to `0`, which signals Æsthetic to apply line breaks when the
   * tokens exceed the global word `wordWrap` limit. Providing a value of `1` or more will
   * apply line breaks based on the count, meaning line breaks will be applied when the
   * total number of arguments (or parameters) is **equal to** or **greater than** the specified value.
   *
   * > **NOTE**
   *
   * > **Wrap limit will always run precedence. If the number of arguments (or parameters) is**
   * > **less than the count limit defined but the word wrap has been exceeded, linebreaks will apply.**
   *
   */
  argumentLineBreak?: number;
  /**
   * **Default** `true`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `true`
   *
   * Will force indentation upon all content and tags without regard for the
   * text nodes.
   *
   * ---
   *
   * #### Example
   *
   * *Below is an example of how this rule works if it's enabled, ie: `true`*
   *
   *
   * ```liquid
   *
   * <!-- Before Formatting -->
   * {% if foo %}{{ object.prop }}{% endif %}
   *
   * <!-- After formatting -->
   * {% if foo %}
   *   {{ object.prop }}
   * {% endif %}
   * ```
   */
  forceIndent?: boolean;
  /**
   * Default: `preserve`
   *
   * **Liquid**
   *
   * **[Delimiter Trims](https://aesthetic.js.org/rules/delimiterTrims/)**
   *
   * How delimiter whitespace trim dashes should handled on Liquid tokens. Delimiter trims
   * represent the `-` character either suffixed or prefixed to delimiters of tags and output
   * tokens, (e.g: `{%-`, `{{-`, `-}}`, `-%}`).
   *
   * > **NOTE**
   * >
   * > **The rule will not touch tokens contained in strings and/or encapsulated within quotation characters.**
   *
   *
   * #### Options
   *
   * The rule accepts one of the following options be provided and defaults to `preserve`.
   *
   * > `preserve`
   *
   * > This is the **default** and will preserves delimiter trims. Typically, the preferred option to use.
   *
   * > `never`
   *
   * > Removes trims from all delimiters, both tag and ouput types
   *
   * > `always`
   *
   * > Applies trims to all delimiter occurances, both tag and output types
   *
   * > `tags`
   *
   * > Applies trims to all tag (`{%` and `%}`) delimiters only. Output token delimiter trims are preserved
   *
   * > `outputs`
   *
   * > Applies trims to all output (`{{` and `}}`) delimiters. Tag delimiter trims will be preserved
   *
   * > `multiline`
   *
   * > Trims will be applied to tags and output tokens which span multiple lines or contained newline occurences.
   * > This option will perform analysis of the internal markup and work together with other rules.
   *
   */
  delimiterTrims?: 'preserve' | 'never' | 'always' | 'tags' | 'outputs' | 'multiline'
  /**
   * Default: `preserve`
   *
   * **Liquid**
   *
   * [Delimiter Placement](https://aesthetic.js.org/rules/delimiterPlacement/)
   *
   * Controls the placement of opening (`{{`, `{%`) and closing (`}}`, `%}`) token delimiters.
   * By default, the rule will preserve the placement, however you may prefer that delimiters
   * instead apply different placement behaviour depending on containing content.
   *
   * > `preserve`
   *
   * > This is the default. When set to `preserve`, delimiters are left intact.
   *
   * > `consistent`
   *
   * > Consistent will use the opening delimiter (`{{` or `{%`) placement to determine the closing
   * > delimiter placement. Opening delimiters proceeded by newline character apply forcing.
   *
   * > `inline`
   *
   * > Ensures that opening and closing delimiters are placed on the same line as the token internal
   * > expression and will strip any newline occurances before (or after) delimiters.
   *
   * > `newline-multiline`
   *
   * > Forces both the opening and closing delimiters onto newlines when the internal structure of the
   * > token spans multiple lines.
   *
   */
  delimiterPlacement?: LiteralUnion<'preserve'| 'consistent'| 'inline'| 'newline-multiline', string>
  /**
   * Default: `true` OR `0`
   *
   * **Liquid**
   *
   * **[Filter Line Break](https://aesthetic.js.org/rules/filterLineBreak/)**
   *
   * Accepts either a `boolean` value or `number` limit. Controls filter newline break formatting
   * (i.e, pipe prefixed `|` expressions). If left undefined, when `wordWrap` is set to `0`, the
   * rule will default itself to `true` and used preservational formatting. When `wordWrap` is defined
   * then this rule defaults to `0` and applies wrap-based line breaks.
   *
   * > `false`
   *
   * > Prevents filter line breaks from applying. Filter expression will be output inline. Using a value
   * > of `false` is **highly discouraged**.
   *
   * > `true`
   *
   * > Passing a value of `true` will signal to Æsthetic that filter line breaks are to be applied
   * > using a preservational handling approach, wherein you decide when line breaks occur.
   *
   * > `0`
   *
   * > Providing a value of `0` will use word `wrap` limit to determine newline breaks. Only when the
   * > filter expression or token exceed wrap limit will line breaks apply.
   *
   * > `1` (or more)
   *
   * > When a value of `1` **or more** is provided, Æsthetic will apply line breaks according to the
   * > number of filter expression contained in the token. Whenever the number of filters exceeds or
   * > is equal to the value passed newline breaks will apply.
   * >
   * > **Wrap limit will run precedence, if the number of filters is less than the count limit defined**
   * > **but the word wrap has been exceeded, linebreaks will apply.**
   *
   */
  filterLineBreak?: boolean | number;
  /**
   * Default: `true`
   *
   * **Liquid**
   *
   * **[Indent Attribute](https://aesthetic.js.org/rules/indentAttribute/)**
   *
   * Whether or not Liquid tag expressions contained within attributes of markup tags should
   * apply indentation or be aligned at the starting point of each line.
   */
  indentAttribute?: boolean;
  /**
   * Default: `before`
   *
   * **Liquid**
   *
   * **[Line Break Separator](https://aesthetic.js.org/rules/lineBreakSeparator/)**
   *
   * Controls the placement of linebreak separator characters (typically comma `,` tokens).
   * By default, Æsthetic uses `before` placements.
   */
  lineBreakSeparator?: LiteralUnion<
  | 'preserve'
  | 'after'
  | 'before', string>;
  /**
   * Default: `before`
   *
   * **Liquid**
   *
   * **[Line Break Logical](https://aesthetic.js.org/rules/liquid/lineBreakLogical/)**
   *
   * Controls the placement of conditional keyword combinators (i.e, `and` or `or`) in Liquid
   * tokens. The rule will take effect when conditional expressions apply linebreaks, which occurs
   * when global `wordWrap` limit has been exceeded.
   *
   * > `preserve`
   *
   * > Placement is preserved. Conditional keyword combinators can be placed before or after.
   *
   * > `after`
   *
   * > Placement of conditional keyword combinators will be placed on the right side (after)
   * > the condition expression when linebreaks occur.
   *
   * > `before`
   *
   * > Placement of conditional keyword combinators will be placed on the left side (before)
   * > the condition expression when linebreaks occur.
   *
   */
  lineBreakLogical?: LiteralUnion<
  | 'preserve'
  | 'after'
  | 'before', string>;
  /**
   * default: `[]`
   *
   * >
   *
   * #### [Ignore Tag List](https://aesthetic.js.org/rules/liquid/ignoreTagList/)
   *
   * A list of Liquid **tag** tokens to be ignored from formatting. Only tag types are accepted,
   * Object type tokens, (i.e, `{{ }}`) are not permitted and will have no effect.
   *
   */
  ignoreTagList?: Array<LiteralUnion<
  | 'form'
  | 'paginate'
  | 'capture'
  | 'case'
  | 'for'
  | 'if'
  | 'raw'
  | 'tablerow'
  | 'liquid'
  | 'render'
  | 'include'
  | 'assign'
  | 'cycle'
  | 'unless'
  | 'schema'
  | 'style'
  | 'script'
  | 'stylesheet'
  | 'javascript', string>>;
}

export interface MarkupRules {
  /**
   * Default: `preserve`
   *
   * **Markup**
   *
   * **[Comment Bracket](https://aesthetic.js.org/rules/commentBracket/)**
   *
   * This rule controls the formatting style of HTML and XML markup comment delimiters. Æsthetic
   * can produce 5 different output styles for markup comments, based on this ruleset as it will
   * augments delimiter (`<!--` and `-->`) placements.
   *
   * > **NOTE**
   * >
   * > **If `commentPreserve` is set to `true` then this rule will have no effect.**
   *
   * ---
   *
   * >
   *
   * #### Options:
   *
   * This rule accepts the one of the following options:
   *
   * - `preserve`
   * - `consistent`
   * - `newline`
   * - `inline`
   * - `inline-align`
   *
   */
  commentBracket?: LiteralUnion<
    | 'preserve'
    | 'consistent'
    | 'newline'
    | 'inline'
    | 'inline-align', string>;

  /**
   * Default: `preserve`
   *
   * **Markup**
   *
   * **[Attribute Casing](https://aesthetic.js.org/rules/attributeCasing/)**
   *
   * How attribute keys and value casing should be processed. This defaults to `preserve`
   * which will leave casing intact is _typically_ the best option to use. Accepts one
   * of the following options:
   *
   * ---
   *
   * >
   *
   * #### Options:
   *
   * This rule accepts the one of the following options:
   *
   * - `preserve`
   * - `lowercase`
   * - `lowercase-name`
   * - `lowercase-value`
   *
   */
  attributeCasing?: LiteralUnion<
  | 'preserve'
  | 'lowercase'
  | 'lowercase-name'
  | 'lowercase-value', string>;

  /**
   * Default: `false`
   *
   * **Markup**
   *
   * **[Attribute Line Break](https://aesthetic.js.org/attributeLineBreak/)**
   *
   * Controls the formatting tactic to apply on tag attributes. The rule accepts either
   * a boolean (i.e, `true` or `false`), or alternatively an integer (limit). By default,
   * Æsthetic will keep tag attributes inline and only apply linebreaks when (or if) the
   * global `wordWrap` limit has been exceeded.
   *
   *
   * > `true`
   *
   * > If you prefer to control attribute forcing on a per-tag basis, set this to `true` and
   * > signal to Æsthetic linebreaks should apply by inserting a newline character before the
   * > first attribute occurance within a tag.
   *
   * > `number`
   *
   * > Using an `integer` value will instruct Æsthetic to apply linebreaks on attributes only
   * > when the number of attributes is either **equal to** or **more than** the value provided.
   *
   */
  attributeLineBreak?: boolean | number;

  /**
   * Default: `false`
   *
   * **Markup**
   *
   * **[Attribute Preserve](https://aesthetic.js.org/rules/markup/attributePreserve/)**
   *
   * Whether or not markup tags should have their insides preserved. This option is only
   * available to markup and does not support child tokens that require a different lexer.
   * When enabled (i.e, `true`), attributes contained within tags will be excluded from
   * formatting.
   *
   * > **NOTE**
   * >
   * > **This rule will override and run precedence on all attribute related rules.**
   *
   */
  attributePreserve?: boolean;

  /**
   * Default: `false`
   *
   * **Markup**
   *
   * **[Attribute Sort](https://aesthetic.js.org/rules/attributeSort/)**
   *
   * This rule will alphanumerically sort attributes annotated on markup tags. The rule
   * accepts either a `boolean` or a `string[]` type. When a boolean value of `true` is
   * provided, Æsthetic will sort attributes alphanumerically. Passing a list of attribute
   * names allows you to customize the ordering of attribute names, wherein sorting applies
   * according to the provided list and then alphanumerically thereafter.
   *
   * > **NOTE**
   * >
   * > **Sorting will be skipped on elements which contain Liquid expressions or conditional**
   * > **rendering logic. The rule will only work on markup-safe elements.**
   *
   */
  attributeSort?: boolean | string[];
  /**
   * Default: `false`
   *
   * **Markup**
   *
   * **[Class List Unique](https://aesthetic.js.org/rules/classListUnique/)**
   *
   * Whether or not identical occurences of class names should be removed.
   *
   * **Example**
   *
   * ```html
   * <!-- before formatting -->
   * <div class="foo bar baz foo baz"></div>
   *
   * <!-- after formatting -->
   * <div class="foo bar baz"></div>
   * ```
   */
  classListUnique?: boolean;
  /**
   * Default: `true`
   *
   * **Markup**
   *
   * **[Self Close Space](https://aesthetic.js.org/selfCloseSpace/)**
   *
   * Markup self-closing tags will end with `' />'` instead of `'/>'`
   *
   */
  selfCloseSpace?: boolean;
  /**
   * Default: `false`
   *
   * **Markup**
   *
   * **[Self Close SVG](https://aesthetic.js.org/selfCloseSVG/)**
   *
   * Whether or not SVG type tags should be converted to self-closing void
   * types, or vice versa. When enabled (`true`), tags contained within an `<svg>`
   * element that use an end tag will be transformed to a
   * void, self-closing tag, i.e: `</path>` → `<path />`.
   */
  selfCloseSVG?: boolean;
  /**
   * Default: `false`
   *
   * **Markup**
   *
   * **[Terminus Bracket](https://aesthetic.js.org/rules/terminusBracket/)**
   *
   * Whether or not ending HTML tag delimiters should be forced onto a newline.
   * This will emulate the style of Prettier's `bracketSameLine` formatting
   * option, wherein the last `>` delimiter character is forced onto a newline.
   *
   * > **NOTE**
   * >
   * > If you wish to emulate the behaviour of Prettier, then set this to `2`
   */
  terminusBracket?: boolean | number;
  /**
   * Default: `true`
   *
   * **Markup**
   *
   * ### [Text Bound Inline](https://aesthetic.js.org/rules/textBoundInline/)
   *
   * Controls how text bound tags (i.e, tags surrounded by text content) should be formatted. By default,
   * Æsthetic will respect input intent, and format tags in accordance with the implied structures.
   *
   * > `true`
   *
   * > Tags which are encapsulated by text content will remain inline and not adhere to atrribute
   * > line breaks for forced indentation. Instead, Æsthetic will format in accordance with structure.
   *
   * > `false`
   *
   * > Setting this option to `false` will apply formatting in accordance with current rulesets and
   * > tags which are encapsulated by text content will format without regard for placement.
   *
   */
  textBoundInline?: boolean
  /**
   * #### Default: `false`
   *
   * >
   *
   * ### [Text Preserve](https://aesthetic.js.org/rules/textPreserve/)
   *
   * If text in the provided markup code should be preserved exactly as provided.
   * This option eliminates beautification and wrapping of text content.
   *
   *
   * > **NOTE**
   * >
   * > **Text bound tags will be formatted according to the `textBoundInline` rule.**
   * > **Enabling this rule will only apply preservation of text content, not bound tags**
   *
   */
  textPreserve?: boolean;
  /**
   * #### Default: `false`
   *
   * >
   *
   * ### [Strip Attribute Lines](https://aesthetic.js.org/rules/stripAttributeLines/)
   *
   * Whether or not newlines existing between tag attributes should be removed
   * or preserved. This rule will be used along side `attributeLineBreak` and when
   * enabled (i.e, `true`) Æsthetic will remove any newlines. When disabled (i.e, `false`)
   * then Æsthetic will preserve newlines in accordance with the **global** value
   * defined in `preserveLine`.
   *
   * > **NOTE**
   * >
   * > **This rule only applies to attributes names not values.**
   */
  stripAttributeLines?: boolean;
  /**
   * #### Default: `preserve`
   *
   * >
   *
   * ### [Value Spacing](https://aesthetic.js.org/rules/markup/valueSpacing/)
   *
   * Allows Æsthetic to carry-out formatting on attribute values. By default, Æsthetic
   * will preserve attribute values, but you may prefer to have values processed for consistency.
   * This should be used with consideration, especially if your project is leveraging a library
   * that require unique structures.
   *
   *
   * > `preserve`
   *
   * > This is the default. When set to `preserve`, values are left intact and the global `wrap`
   * > limit can be exceeded. This is the safest option to use.
   *
   * > `equipoise`
   *
   * > Setting this rule to `equipoise` will apply whitespace equalisation and format values in
   * > accordance with the implied structure. The Equipoise option performs predictive analysis
   * > in the safest way possible with newline occurences being aligned in equipose mode.
   *
   * > `wrap`
   *
   * > You may prefer to linebreak values when the global `wrap` limit is exceeded. When using `wrap`
   * > option, values will insert a `\n` character on wrap edge.
   *
   */
  valueSpacing?: LiteralUnion<
  | 'preserve'
  | 'equipoise'
  | 'wrap', string>

}

export interface JSONRules {
  /**
   * Default: `default`
   *
   * **JSON**
   *
   * **[arrayFormat](https://aesthetic.js.org/rules/arrayFormat/)**
   *
   * Controls how arrays on objects are formatted. This rules will
   * determines if all array indexes should be indented, never indented,
   * or left to the default.
   *
   *
   * > `default`
   * >
   * > Default formatting (default)
   *
   * > `indent`
   * >
   * > Always indent each index of an array
   *
   * > `inline`
   * >
   * > Ensure all array indexes appear on a single line
   */
  arrayFormat?: 'default' | 'indent' | 'inline';
  /**
   * Default: `true`
   *
   * **JSON**
   *
   * **[braceAllman](https://aesthetic.js.org/rules/braceAllman/)**
   *
   * This option will determine how arrays cotained on objects will
   * be formatted. If opening curly braces should exist on the same
   * line as their condition or be forced onto a new line.
   * (Allman style indentation).
   *
   * ---
   *
   * #### Enabled
   *
   * _Below is an example when this option is set to `true` and each
   * object in the array starts on a newline._
   *
   * ```json
   *
   * {
   *    "array": [
   *      {
   *        "name": "foo"
   *      },
   *      {
   *        "name": "bar"
   *      },
   *      {
   *        "name": "baz"
   *      }
   *    ]
   * }
   * ```
   *
   * ---
   *
   * #### Disabled
   *
   * _Below is an example when this option is set to `false` and
   * each object in the array starts curly braces inline._
   *
   * ```json
   *
   * {
   *    "array": [
   *      {
   *        "name": "foo"
   *      }, {
   *        "name": "bar"
   *      }, {
   *        "name": "baz"
   *      }
   *    ]
   * }
   * ```
   */
  braceAllman?: boolean;
  /**
   * Default: `false`
   *
   * **JSON**
   *
   * **[bracePadding](https://aesthetic.js.org/rules/bracePAdding/)**
   *
   * If true an empty line will be inserted after opening curly braces
   * and before closing curly braces.
   *
   * ---
   *
   * **Enabled**
   *
   * Below is an example when this option is set to `true`
   *
   * ```json
   *
   * {
   *
   *  "foo": {
   *
   *    "bar": {}
   *
   * }
   *
   * ```
   *
   * ---
   *
   * **Disabled**
   *
   * Below is an example when this option is set to `false`
   *
   * ```json
   *
   * {
   *   "foo": {
   *     "bar": {}
   *   }
   * }
   *
   * ```
   */
  bracePadding?: boolean;
  /**
   * **Default:** `default`
   *
   * Controls how arrays of objects are formatted. We will exclude
   * the `inline` option to prevent unreadable objects. If all object
   * keys should be indented, never indented, or left to the default.
   *
   * **Options**
   *
   * > `default` (default)
   *  Default formatting
   *
   * > `indent`
   *  "Always indent each index of an array
   */
  objectIndent?: 'default' | 'inline' | 'indent';
  /**
   * **Default:** `false`
   *
   * This option will alphabetically sort object properties in JSON objects.
   * When JSON objects have more than 2k keys then this will be an expensive
   * operation, but in most cases is fine to use.
   *
   * ---
   *
   * **Enabled**
   *
   * Below is an example when this option is set to `true`
   *
   * ```json
   *
   * {
   *   "e": 5,
   *   "d": 4,
   *   "b": 2,
   *   "c": 3,
   *   "a": 1
   * }
   * ```
   *
   * ---
   *
   * **Disabled**
   *
   * Below is an example when this option is set to `false`
   *
   * ```json
   *
   * {
   *   "a": 1,
   *   "b": 2,
   *   "c": 3,
   *   "d": 4,
   *   "e": 5
   * }
   *
   * ```
   */
  objectSort?: boolean;
}
