export interface MarkupRules {

  /**
   * #### Default: `preserve`
   *
   * >
   *
   * ### [Comment Delimiter](https://aesthetic.js.org/rules/markup/commentDelimiter/)
   *
   * This rule controls the formatting style of HTML and XML markup comment delimiters. Æsthetic
   * can produce 5 different output styles for markup comments, based on this ruleset as it will
   * augments delimiter (`<!--` and `-->`) placements.
   *
   */
  commentDelimiter?: 'preserve' | 'consistent'| 'force' | 'inline' | 'inline-align';

  /**
   * #### Default: `false`
   *
   * >
   *
   * If a blank new line should be inserted above comments.
   */
  commentNewline?: boolean;

  /**
   * #### Default: `true`
   *
   * >
   *
   * This will determine whether comments should always start at position
   * `0` of each line or if comments should be indented according to the code.
   * It is unlikely you will ever want to set this to `false` so generally, just
   * leave it to `true`
   *
   */
  commentIndent?: boolean;

  /**
   * **Default** `false`
   *
   * Prevent comment reformatting due to option wrap.
   */
  commentPreserve?: boolean;

  /**
   * #### Default: `preserve`
   *
   * >
   *
   * ### [Attribute Casing](https://aesthetic.js.org/rules/markup/attributeCasing/)
   *
   * How attribute keys and value casing should be processed. This defaults to `preserve`
   * which will leave casing intact and _typically_ the best option to use. Accepts one
   * of the following options:
   *
   * - `preserve`
   * - `lowercase`
   * - `lowercase-name`
   * - `lowercase-value`
   *
   */
  attributeCasing?: 'preserve' | 'lowercase' | 'lowercase-name' | 'lowercase-value';

  /**
   * **Default** `false`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`
   *
   * If markup tags should have their insides preserved.
   * This option is only available to markup and does not support
   * child tokens that require a different lexer. When enabled, this
   * rule will override and run precedence for all attribute related rules.
   *
   *
   * ---
   *
   * #### Example
   *
   * *Below is an example of how this rule works if it's enabled, ie: `true`.
   * There is no difference between the _before_ and _after_ version of the code
   * when this option is enabled.*
   *
   * ```html
   *
   * <!-- Before Formatting -->
   * <div
   *  id="x"    data-x="foo"
   * class="xx"></div>
   *
   * <!-- After Formatting -->
   * <div
   *  id="x"    data-x="foo"
   * class="xx"></div>
   *
   * ```
   */
  attributePreserve?: boolean;

  /**
   * #### Default: `preserve`
   *
   * ### [Value Line Breaks](https://aesthetic.js.org/rules/markup/valueLineBreaks/)
   *
   * Controls how Æsthetic should handle attribute values which exceed wrap or span
   * multiple lines. This rule is helpful for developers using Tailwind.
   *
   * >
   *
   * ---
   *
   * ### Preserve
   *
   * _Instructs Æsthetic to preserve attribute values as they have been provided.
   * The example below, where the `class` value contains a newline will be preserved._
   *
   * ```html
   *
   * <!-- Before formatting -->
   * <div
   *   class="
   *    a1-2 b1-2 c1-2 d1-2 e1-2 f1-2
   *    g1-2 h1-2 i1-2 j1-2
   *   "
   *   id="x"></div>
   *
   * <!-- After formatting -->
   * <div
   *   class="
   *    a1-2 b1-2 c1-2 d1-2 e1-2 f1-2
   *    g1-2 h1-2 i1-2 j1-2
   *   "
   *   id="x"></div>
   *
   *
   * ```
   *
   * >
   *
   * ---
   *
   * >
   *
   * ### Inline
   *
   * _Instructs Æsthetic ensure the value of an attribute which spans multiple lines
   * is always inlined, with quotation starting and ending on the same line._
   *
   * ```html
   *
   * <!-- Before formatting -->
   * <div
   *   id="x"
   *   class="
   *    a1-2 b1-2 c1-2 d1-2 e1-2 f1-2
   *    g1-2 h1-2 i1-2 j1-2
   *   ">
   * </div>
   *
   * <!-- After formatting -->
   * <div
   *   id="x"
   *   class="a1-2 b1-2 c1-2 d1-2 e1-2 f1-2
   *   g1-2 h1-2 i1-2 j1-2">
   * </div>
   *
   *
   * ```
   *
   *
   * >
   *
   * ---
   *
   * >
   *
   *
   * ### Align
   *
   * _Whenever values span multiple lines or exceed word wrap, the entries will be forced onto
   * a newline, and will align to the attributes starting point each line. In the below example
   * lets assume the class value has exceeded wrap length._
   *
   * ```html
   *
   * <!-- Before formatting -->
   * <div
   *   class="a1-2 b1-2 c1-2 d1-2 e1-2 f1-2 g1-2 h1-2 i1-2 j1-2"
   *   id="x">
   * </div>
   *
   * <!-- After formatting -->
   * <div
   *   class="
   *   a1-2 b1-2 c1-2 d1-2 e1-2
   *   f1-2 g1-2 h1-2 i1-2 j1-2
   *   "
   *   id="x">
   * </div>
   *
   *
   * ```
   *
   *
   * >
   *
   * ---
   *
   * >
   *
   *
   * ### Indent
   *
   * _Whenever values span multiple lines or exceed word wrap, the entries will be forced onto
   * a newline and be indented at the starting point of each line. In the below example
   * lets assume the class value has exceeded wrap length._
   *
   * ```html
   *
   * <!-- Before formatting -->
   * <div
   *   class="a1-2 b1-2 c1-2 d1-2 e1-2 f1-2 g1-2 h1-2 i1-2 j1-2"
   *   id="x">
   * </div>
   *
   * <!-- After formatting -->
   * <div
   *   class="
   *    a1-2 b1-2 c1-2 d1-2 e1-2
   *    f1-2 g1-2 h1-2 i1-2 j1-2
   *   "
   *   id="x">
   * </div>
   *
   *
   * ```
   */
  // valueLineBreak?:
  // | 'preserve'
  // | 'inline'
  // | 'force-align'
  // | 'force-indent';

  /**
   * Whitespace separator control for occurances contained within attribute values.
   *
   * **equipoise**
   *
   * ```html
   * <!-- Before Formatting -->
   * <div class="a   b    c  d"></div>
   *
   * <!-- After Formatting -->
   * <div class="a b c d"></div>
   * ```
   */
  valueSpacing?:
  | 'preserve'
  | 'equipoise'
  | 'wrap'
  | 'wrap-fraction'

  /**
   * List of HTML tag names to which should respect inline formatting on. By default,
   * Æsthetic treats applied inline formatting upon a cherry picked list
   * of tags. This option can be used to override the default list or alternatively
   * you can exclude certain tags by prefixing and exclimation mark `!`.
   *
   * **Example**
   *
   * ```js
   * {
   *  // will continue to use default but exclude <span> and <h1> tags
   *   inlineTagList: ['!span', '!h1']
   * }
   *
   * {
   *  // overrides all defaults and treats only <div> and <p> as inline
   *   inlineTagList: ['div', 'p']
   * }
   * ```
   */
  textNodeList?: string[];
  /**
   * #### Default: `inline`
   *
   * >
   *
   * ### [Delimiter Terminus](https://aesthetic.js.org/rules/markup/valueLineBreaks/)
   *
   * Whether or not ending HTML tag delimiters should be forced onto a newline.
   * This will emulate the style of Prettier's `singleAttributePerLine` formatting
   * option, wherein the last `>` delimiter character breaks itself onto a new line.
   *
   * > **NOTE**
   * >
   * > If you wish to emulate the behaviour of Prettier, then you will need to either
   * > set this to `adapt` or `force`. The `adapt` option is generally preferred.
   */
  delimiterTerminus?: boolean | number;

  /**
   * #### Default: `false`
   *
   * >
   *
   * ### [Attribute Sort](https://aesthetic.js.org/rules/markup/attributeSort/)
   *
   * The rule will alphanumerically sort attributes annotated on markup tags. The rules
   * accepts either a `boolean` or a `string[]` type. When a boolean value of `true` is
   * provided, Æsthetic will sort attributes alphanumerically. Passing a list of attribute
   * names allows you to customize the ordering of attributes names, wherein sorting applies
   * according to the provided list and then alphanumerically thereafter.
   *
   * > **NOTE**
   * >
   * > **Sorting will be skipped on elements which containg Liquid expressions or conditional**
   * > **rendering logic. The rule will only work on markup safe elements.**
   *
   * >
   * >
   *
   * ---
   *
   * >
   *
   * #### Enable: `true`
   *
   * _Below is an example of how this rule works if it's enabled, ie: `true`. Notice
   * how the attributes are not alphabetically sorted before formatting is applied
   * whereas after formatting they are sorted alphabetically._
   *
   * ```html
   *
   * <!-- Before formatting -->
   * <div
   *   id="x"
   *   data-b="100"
   *   data-a="foo"
   *   data-c="x"
   *   class="xx">
   *
   * </div>
   *
   * <!-- After formatting -->
   * <div
   *   class="xx"
   *   data-a="foo"
   *   data-b="100"
   *   data-c="x"
   *   id="x">
   *
   * </div>
   *
   * ```
   *
   * >
   *
   * ---
   *
   * >
   *
   * #### Enable: `string[]`
   *
   * _Below is an example of how this rule works if it's enabled and you've defined
   * the following attribute sorting structure:_
   *
   * ```js
   *
   * {
   *   attributeSort: ['id', 'class', 'data-b']
   * }
   *
   *
   * ```
   *
   * _Using the above options, notice how how `data-a`, `data-c` and `data-d` are sorted
   * alphabetically in order following the sort list we provided_
   *
   * ```html
   *
   * <!-- Before formatting -->
   * <div
   *   data-a
   *   id="x"
   *   data-d
   *   data-c
   *   data-b
   *   class="xx">
   *
   * </div>
   *
   * <!-- After formatting -->
   * <div
   *   id="x"
   *   class="xx"
   *   data-b
   *   data-a
   *   data-c
   *   data-d>
   *
   * </div>
   *
   * ```
   */
  attributeSort?: boolean | string[];

  /**
   * Attribute class list sorting
   *
   * @default false
   */
  classListSort?: boolean | string[]

  /**
   * Whether or not to remove class names which are identical.
   *
   * **Example**
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
   * <h5>Default</h5>
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `true`
   *
   * Markup self-closing tags will end with `' />'` instead of `'/>'`
   *
   * ---
   *
   * #### Example
   *
   * *Below is an example of how this rule works if it's enabled, ie: `true`*
   *
   *
   * ```html
   *
   * <!-- Before formatting -->
   * <picture>
   *   <path srcset="."/>
   * </picture>
   *
   * <!-- After formatting - Notice the the space insertion applied -->
   * <picture>
   *   <path srcset="." />
   * </picture>
   *
   * ```
   */
  selfCloseSpace?: boolean;

  /**
   * #### Default: `true`
   *
   * >
   *
   * ### [Self Close SVG](https://aesthetic.js.org/rules/selfCloseSVG/)
   *
   * Whether or not SVG type tags should be converted to self closing void
   * types, or vice-versa. When enabled (`true`), tags contained within an `<svg>`
   * element and are determined to use an ender type will be transformed to a
   * void, self-closing tag, i.e: `</path>` → `<path />`.
   *
   * >
   *
   * ---
   *
   * >
   *
   * ### Enable: `true`
   *
   * _Below is an example of the `selfCloseSVG` rules when it is set to `true`.
   * Notice how the `</path>` tag transformed to a void type with self closing delimiter `/>`_
   *
   * ```html
   *
   * <!-- Before Formatting -->
   * <svg>
   *   <path d="M.865 15.978a.5.5"></path>
   * </svg>
   *
   * <!-- After Formatting -->
   * <svg>
   *   <path d="M.865 15.978a.5.5" />
   * </svg>
   *
   *
   * ```
   *
   * ---
   *
   * >
   *
   * ### Disable: `true`
   *
   * _Below is an example of the `selfCloseSVG` rules when it is set to `false`.
   * Notice how the self closing delimiter `/>` is replaced with an `</path>` end tag._
   *
   * ```html
   *
   * <!-- Before Formatting -->
   * <svg>
   *   <path d="M.865 15.978a.5.5" />
   * </svg>
   *
   * <!-- After Formatting -->
   * <svg>
   *   <path d="M.865 15.978a.5.5"></path>
   * </svg>
   *
   *
   * ```
   */
  selfCloseSVG?: boolean;

  /**
   *
   * **Default Setting**:`false`
   *
   * **Recommended:** `3`
   *
   * ----
   *
   * If all markup attributes should be indented each onto their own line. You
   * can optionally provide an integer value of `1` or more. When an integer value
   * is passed, attributes will be forced only if the number of attributes contained
   * on the tag exceeds the supplied value limit. When you define a `wrap` level then
   * attributes will be automatically forced. This is typically a better solution than
   * forcing all attributes onto newlines or an even better solution would be to set
   * a limit level.
   *
   * ---
   *
   * #### Disabled Example
   *
   * *Below is the default, wherein attributes are only forced when wrap is exceeded.*
   *
   * ```html
   *
   * <div class="x" id="{{ foo }}" data-x="xx">
   *
   * </div>
   *
   * ```
   *
   * ---
   *
   * #### Enabled Example
   *
   * *Below is an example of how this rule works if it's enabled, ie: `true`*
   *
   * ```html
   *
   * <div
   *   class="x"
   *   id="{{ foo }}"
   *   data-x="xx">
   *
   * </div>
   *
   * ```
   *
   * ---
   *
   * #### Limit Example
   *
   * *Below we provide a value of `2` so formatting will be applied as such:*
   *
   * ```html
   *
   * <!-- Tag contains 2 attributes, they will not be forced-->
   * <div class="x" id="{{ foo }}">
   *
   * </div>
   *
   * <!-- Tag contains 3 attributes, thus they will be forced -->
   * <div
   *   class="x"
   *   id="{{ foo }}"
   *   data-x="xx">
   *
   * </div>
   *
   * <!-- Tag contains 1 attribute, it will not be forced-->
   * <div class="x">
   *
   * </div>
   *
   * ```
   */
  attributeLineBreak?: boolean | number;

  /**
   * **Default** `false`
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
   * ```html
   *
   * <!-- Before Formatting -->
   * <ul>
   *  <li>Hello</li>
   *  <li>World</li>
   * </ul>
   *
   * <!-- After formatting -->
   * <ul>
   *   <li>
   *     Hello
   *   </li>
   *   <li>
   *     World
   *   </li>
   * </ul>
   * ```
   */
  forceIndent?: boolean;

  /**
   * **Default** `false`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`
   *
   * Controls the forcing behaviour of text node (phrasing content) intra-paragraph elements.
   * Tags like `<strong>`, `<i>`, `<label>` etc etc are categorized as "Phrasing Content".
   * This rule will apply to only those elements.
   *
   * The rule accepts either a `boolean` or `number` value.
   *
   * - Passing a value of `false` will preventing forcing from being applied.
   * - Passing a value of `true` will force text node content.
   * - Passing a value of `0` will apply forcing in accordance with `forceAttribute`
   * - Passing a value of `1` or more will apply forcing when attribute count exeeds limit defined
   *
   */
  forceInline?: boolean | number;

  /**
   * **Default** `none`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `double`
   *
   * If the quotes of markup attributes should be converted to single quotes
   * or double quotes. Don't be a hero with this option. Markup content
   * should use double quotations, it's the standard.
   *
   * **Options**
   *
   * - `double` Converts single quotes to double quotes
   * - `none` Ignores this option (default)
   * - `single` Converts double quotes to single quotes
   */
  quoteConvert?: 'double' | 'single' | 'none';

  /**
   * **Default** `false`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`
   *
   * If text in the provided markup code should be preserved exactly as provided.
   * This option eliminates beautification and wrapping of text content.
   */
  preserveText?: boolean;

  /**
   * **Default** `false`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `true`
   *
   * Whether or not newlines contained within tag attributes should be removed
   * or preserved. This rule will be used along side `forceAttribute` and when
   * enabled (`true`) will remove any newlines. When disabled (`false`) then the
   * newline limits will respect the **global** value defined in `preserveLine`.
   *
   * > **NOTE**
   * >
   * > This rule only applies to attributes names not values.
   */
  stripAttributeLines?: boolean;

  /**
   * #### Default: `false`
   *
   * >
   *
   * ### [Strip Text Wrap Lines](https://aesthetic.js.org/rules/markup/stripTextWrapLines/)
   *
   * Whether or not Æsthetic should strip newline occurances when applying word-wrap on text
   * content. This rule will only take effect if a word wrap limit has been defined via `wrap` option.
   * When enabled, Æsthetic will remove newline occurances from text identified content and produce a
   * strictly formed wrap.
   *
   * By default, this rule is `false` and Æsthetic will preserve newlines within text content, ensuring that
   * newline occurances adhere to the `preserveLine` limit regardless of whether or not a `wrap` limit has been set.
   * Setting this to `true` will override `preserveLine` within text specific content and instead refer to the `wrap`
   * limitation.
   *
   *
   * > **NOTE**
   * >
   * > If you have set `preserveText` to `true` this rule will be ignored, as `preserveText` take precedence and
   * > will override all text content related formatting options.
   */
  stripTextWrapLines?: boolean;

  /**
   * **Default** `false`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`
   *
   * Whether HTML and Liquid tags identified to be containing CSS or SCSS
   * should be ignored from beautification.
   */
  ignoreCSS?: boolean;

  /**
   * **Default** `true`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`
   *
   * Whether HTML and Liquid tags identified to be containing JavaScript
   * should be ignored from beautification. When disabled, formatting will
   * be applied in accordance with rules defined in the `script` lexer.
   *
   * _This rules is currently set to `true` by default as JavaScript formatting
   * is not yet production ready, but still operational to an extent. Enable at
   * your on discretion_
   *
   */
  ignoreJS?: boolean;

  /**
   * **Default** `false`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`
   *
   * Whether HTML `<script type="application/json>` tags or those annotated with a
   * JSON identifiable attribute should be ignored from beautification. When disabled,
   * formatting will be applied in accordancee with rules defined in the `json` ruleset.
   *
   */
  ignoreJSON?: boolean;

}
