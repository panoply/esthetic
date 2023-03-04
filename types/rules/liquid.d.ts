import { LiteralUnion } from 'type-fest';

export interface LiquidRules {

  /**
   * **Default** `false`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `true`
   *
   * If a blank new line should be forced above comments.
   */
  commentNewline?: boolean;

  /**
   * **Default** `true`
   *
   * This will determine whether comments should always start at position
   * `0` of each line or if comments should be indented according to the code.
   * It is unlikely you will ever want to set this to `false` so generally, just
   * leave it to `true`
   *
   */
  commentIndent?: boolean;

  /**
   * **Default** `preserve`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `tags`
   *
   * How delimiter whitespace trim dashes should handled on
   * Liquid tokens. You should avoid setting this to `force` in order to
   * avoid stripping whitespace between text content. The rule accepts one
   * of the following options:
   *
   * - `preserve`
   * - `never`
   * - `always`
   * - `tags`
   * - `outputs`
   *
   * ---
   *
   * #### Preserve Example
   *
   * *Below is an example of how this rule works if set to `preserve` which is
   * the default and leaves all occurances of trims intact*
   *
   * ```liquid
   *
   * <!-- Before formatting -->
   * {% if x -%}
   *   {{- foo_bar }} {{- trims }}
   * {% endof -%}
   *
   * <!-- Before formatting -->
   * {% if x -%}
   *   {{- foo_bar }} {{- trims }}
   * {% endof -%}
   * ```
   *
   * ---
   *
   * #### Strip Example
   *
   * *Below is an example of how this rule works if set to `strip` which will
   * remove all occurances of trims from Liquid tokens.*
   *
   * ```liquid
   *
   * <!-- Before formatting -->
   * {%- if x -%}
   *   {{- foo_bar -}}
   * {%- endof -%}
   *
   * <!-- Before formatting -->
   * {% if x %}
   *   {{ foo_bar }}
   * {% endof %}
   *
   * ```
   *
   * ---
   *
   * #### Force Example
   *
   * *Below is an example of how this rule works if set to `force` which will
   * apply trims on all Liquid tokens.*
   *
   * ```liquid
   *
   * <!-- Before formatting -->
   * {% if x %}
   *   {{ foo_bar }}
   * {% endof %}
   *
   * <!-- Before formatting -->
   * {%- if x -%}
   *   {{- foo_bar -}}
   * {%- endof -%}
   *
   * ```
   *
   *
   * ---
   *
   * #### Tags Example
   *
   * *Below is an example of how this rule works if set to `tags` which will
   * apply trims to Liquid tag tokens but leave object output tokens intact.*
   *
   * ```liquid
   *
   * <!-- Before formatting -->
   * {% if x %}
   *  {{ foo_bar -}} {{ no_trims }}
   * {% endof %}
   *
   * <!-- After formatting -->
   * {%- if x -%}
   *   {{ foo_bar -}} {{ no_trims }}
   * {%- endof -%}
   *
   * ```
   *
   * ---
   *
   * #### Outputs Example
   *
   * *Below is an example of how this rule works if set to `outputs` which will
   * apply trims to Liquid object output tokens but leave tag tokens intact.*
   *
   * ```liquid
   *
   * <!-- Before formatting -->
   * {% if x -%}
   *  {{ foo_bar }} {{ trims }}
   * {%- endof %}
   *
   * <!-- After formatting -->
   * {% if x -%}
   *   {{- foo_bar -}} {{- trims -}}
   * {%- endof %}
   *
   * ```
   */
  delimiterTrims?:
  | 'preserve'
  | 'never'
  | 'always'
  | 'tags'
  | 'outputs'
  | 'multiline';

  /**
   * **default** `preserve`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `consistent`
   *
   * Controls how opening and closing delimiters should be beautified.
   *
   * - `preserve`
   * - `default`
   * - `inline`
   * - `consistent`
   * - `force-inline`
   * - `force-multiline`
   *
   * ---
   *
   * #### Preserve Example
   *
   * *Below is an example of `preserve` which is the default option which will
   * not apply adjustments to delimiters*
   *
   * ```liquid
   *
   * <!-- Before Formatting -->
   *
   * {{ object.prop
   * }}
   *
   * <!-- After Formatting -->
   *
   * {{ object.prop
   * }}
   * ```
   *
   * ---
   *
   * #### Default Example
   *
   * *Below is an example of `default` which format delimiters in a default manner. This
   * option option replicates the Liquid Prettier plugin style.*
   *
   * ```liquid
   *
   * <!-- Before Formatting -->
   *
   * <div>
   *
   *   {% # multiline outputs will force leading and ending delimiter %}
   *   {{ object.prop
   *     | filter_1: 'foo'
   *     | filter_3: 'bar'
   *     | filter_3: 'baz' }}
   *
   *   {% liquid
   *     # The default option will force the ending delimiter
   *     # on this tag but inline the leading delimiter
   *     echo 'foo' %}
   *
   * </div>
   *
   * <!-- After Formatting -->
   *
   * <div>
   *
   *   {% # multiline outputs will force leading and ending delimiter %}
   *   {{
   *     object.prop
   *     | filter_1: 'foo'
   *     | filter_3: 'bar'
   *     | filter_3: 'baz'
   *   }}
   *
   *   {% liquid
   *     # The default option will force the ending delimiter
   *     # on this tag but inline the leading delimiter
   *   %}
   *
   * </div>
   *
   * ```
   *
   * ---
   *
   * #### Inline Example
   *
   * *Below is an example of `inline` which strip newlines and always inline the
   * delimiter expression.*
   *
   * ```liquid
   *
   * <!-- Before Formatting -->
   *
   * {{
   *   object.prop
   * }}
   *
   * <!-- After Formatting -->
   *
   * {{ object.prop }}
   *
   * ```
   *
   * ---
   *
   * #### Consistent Example
   *
   * *Below is an example of `consistent` which will force delimiter according to
   * the leading delimiter. When a newline follows the leading delimiter (`{{` or `{%`)
   * then the ending delimiter will be forced*
   *
   * ```liquid
   *
   * <!-- Before Formatting -->
   *
   * {{ object.prop
   * }}
   *
   * {%
   *   tag %}
   *
   * <!-- After Formatting -->
   *
   * {{ object.prop }}
   *
   * {%
   *   tag
   * %}
   *
   * ```
   *
   * ---
   *
   * #### Force Inline Example
   *
   * *Below is an example of `force-inline` which will force both the leading and
   * ending delimiters.*
   *
   * ```liquid
   *
   * <!-- Before Formatting -->
   *
   * {{ object.prop }}
   *
   * {% tag %}
   *
   * <!-- After Formatting -->
   *
   * {{
   *   object.prop
   * }}
   *
   * {%
   *   tag
   * %}
   *
   * ```
   * ---
   *
   * #### Force Multiline Example
   *
   * *Below is an example of `force-multiline` which will apply forcing to both the leading and
   * ending delimiter only when the inner contents of the tag has newlined content.*
   *
   * ```liquid
   *
   * <!-- Before Formatting -->
   *
   * {{
   *  object.prop
   * }}
   *
   * {% if condition_1 == assertion_1
   *    or condition_2 == assertion_2 %}
   *
   *   {{ object.prop
   *     | filter_1: 'foo'
   *     | filter_3: 'bar'
   *     | filter_3: 'baz' }}
   *
   *   {% liquid
   *     # The default option will force the ending delimiter
   *     # on this tag but inline the leading delimiter
   *   %}
   *
   * {% endif %}
   *
   * <!-- After Formatting -->
   *
   * {{ object.prop }}
   *
   * {%
   *   if condition_1 == assertion_1
   *   or condition_2 == assertion_2
   * %}
   *
   *   {{
   *     object.prop
   *     | filter_1: 'foo'
   *     | filter_3: 'bar'
   *     | filter_3: 'baz'
   *   }}
   *
   *   {%
   *     liquid
   *     # The force-multiline option will force the ending delimiter
   *   %}
   *
   * {% endif %}
   *
   * ```
   */
  delimiterPlacement?:
  | 'default'
  | 'inline'
  | 'preserve'
  | 'consistent'
  | 'force'

  /**
   * **Default** `true`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`
   *
   * Forces lead argument in multiline structures.
   *
   */
  forceLeadArgument?: boolean;

  /**
   * **Default** `0`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `50`
   *
   * Forces filter pipes `|` onto newlines when the filters contained on the token
   * exceed the defined wrap limit. By default, filters will be forced according to
   * the global `wrap` limit.
   *
   */
  filterWrap?: number;

  /**
   * **Default** `0`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `50`
   *
   * Forces arguments onto newlines when arguments exceed the defined wrap limit.
   * By default, filters will be forced according to the global `wrap` limit.
   */
  argumentWrap?: number;

  /**
   * **Default** `false`
   *
   * Applies indentation of Liquid contained attributes contained on markup tags.
   * This rule will emulate the liquid-prettier-plugin logic.
   */
  indentAttributes?: boolean;

  /**
   * **Default** `[]`
   *
   * Prevent indentation from being applied to containing content of the tag.
   */
  dedentTagList?: Array<LiteralUnion<
  | 'form'
  | 'paginate'
  | 'capture'
  | 'case'
  | 'for'
  | 'if'
  | 'raw'
  | 'tablerow'
  | 'liquid'
  | 'unless'
  | 'schema'
  | 'style'
  | 'script'
  | 'stylesheet'
  | 'javascript', string>>;

  /**
   * **Default** `true`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `true`
   *
   * Whether or not to normalize and correct the inner spacing of Liquid tokens.
   * This rules will equally distribute whitespace characters contained within
   * Liquid tags and output tokens.
   *
   * **Note**
   *
   * Normalized spacing does not strip newline characters or code wrapped in quotation
   * characters (strings) from the inner contents of Liquid tokens.
   *
   * ---
   *
   * #### Example
   *
   * *Below is an example of how this rule works if it's enabled, ie: `true` which is the default.
   * Notice how in the below example, all string tokens are left intact whereas other tokens will
   * normalize the whitespace distribution*
   *
   *
   * ```liquid
   *
   * <!-- Before formatting -->
   * {{  object.prop   |filter:'x'  , 'xx'|    filter   :   'preserves   strings'   }}
   * {% assign  'foo '  =   ' x '   |  append : object . prop    %}
   *
   * <!-- After formatting -->
   *
   * {{ object.prop | filter: 'x', 'xx' | filter: 'preserves   strings' }}
   *
   * {% assign 'foo ' = ' preserved ' | append: object.prop %}
   * ```
   */
  normalizeSpacing?: boolean;

  /**
   * **Default** `none`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `double`
   *
   * If the quotes of markup attributes should be converted to single quotes
   * or double quotes. Don't be a fucking hero with this option. Markup content
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
   * **Default** `default`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `before`
   *
   * Controls the placement of Liquid tag operator type characters in newline structures.
   * In situations where you write a multiline tag expression this rule can augment the
   * order of leading operator characters such as the parameter comma `,` separator.
   */
  lineBreakSeparator?: 'before' | 'after';

  /**
   * **Default** `wrap`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `newline`
   *
   * Controls the strategy to use when forcing filters, arguments or other tag contained
   * structures onto newlines.
   *
   */
  lineBreakForcing?: boolean;

  /**
   * **Default** `false`
   *
   * Prevent comment reformatting due to option wrap.
   */
  preserveComment?: boolean;

  /**
   * **Default** `false`
   *
   * Prevent the internals structures of Liquid tokens from being formatted. When enabled, Æsthetic
   * will preserve the internal formations of output and tags.
   */
  preserveInternal?: boolean;

  /**
   * **Default** `[]`
   *
   * 💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is subjective
   *
   * A list of Liquid tags that should excluded from formatting.
   * Only tags which contain a start and end types are valid.
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
  | 'unless'
  | 'schema'
  | 'style'
  | 'script'
  | 'stylesheet'
  | 'javascript', string>>;

}
