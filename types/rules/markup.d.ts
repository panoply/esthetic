export interface MarkupOptions {

  /**
   * **Default** `false`
   *
   * Automatically correct some sloppiness in code and allow Prettify to
   * reason with the intended structures in order to reduce chaos in otherwise
   * unreadble and terrible code like that of Shopify's Dawn theme. The option acts
   * as a very mild form of linting, wherein invalid code will be attempt to be
   * corrected.
   *
   * The option enables Prettify to go about fixing your shitty code. It's not
   * going to produce miracles and for the most part it will have little effect
   * overall but can help in some situations.
   */
  correct?: boolean;

  /**
   * **Default** `preserve`
   *
   * How attribute keys and value casing should be processed. This defaults to
   * `preserve` which will leave casing intact.
   */
  attributeCasing?: 'preserve' | 'lowercase' | 'lowercase-name' | 'lowercase-value'
  /**
   * **Default** `false`
   *
   * HTML Attribute sorting. When enabled it will sort attributes
   * alphabetically. Attribute sorting is ignored on tags that contain
   * template attributes.
   *
   * ---
   *
   * #### Example
   *
   * *Below is an example of how this rule works if it's enabled, ie: `true`. Notice
   * how the attributes are not alphabetically sorted before formatting is applied
   * whereas after formatting they are sorted alphabetically.*
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
   * ```
   */
  attributeSort?: boolean

  /**
   * **Default** `[]`
   *
   * A comma separated list of attribute names. Attributes will be sorted according to
   * this list and then alphanumerically. This option requires `attributeSort` have
   * to be enabled, ie: have a value of `true`.
   *
   * ---
   *
   * #### Example
   *
   * *Below is an example of how this rule works if it's enabled and you've defined
   * the following attribute sorting structure:*
   *
   * ```js
   * {
   *   attributeSort: true, // Must be true when using this rule
   *   attributeSortList: ['id', 'class', 'data-b']
   * }
   * ```
   *
   * *Using the above options, notice how how `data-a`, `data-c` and `data-d` are sorted
   * alphabetically in order following the sort list we provided*
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
   * ```
   */
  attributeSortList?: string[];

  /**
   * **Default** `align`
   *
   * How attribute values should be handled. By default, Prettify strips extraneous
   * whitespaces from HTML attribute values but preserves newlines. You can control
   * how attribute values should be processed
   *
   * ---
   *
   * #### Preserve (default)
   *
   * *Preserves the structre of attributes values provided. Whitespace, newlines and contents
   * will be left intact.*
   *
   * ```html
   *
   * <!-- The attribute value before formatting -->
   * <div class="one   two
   *    {{ some.object }}"></div>
   *
   * <!-- The attribute value after formatting -->
   * <div class="one   two
   *    {{ some.object }}"></div>
   * ```
   *
   * #### Strip
   *
   * *Strips newlines and equally distributes spacing by stripping out extraneous whitespaces
   * and replacing them with a single space.*
   *
   * ```html
   * <!-- The attribute value before formatting -->
   * <div class="one   two
   *    {{ some.object }}"></div>
   *
   * <!-- The attribute value after formatting -->
   * <div class="one two {{ some.object }}"></div>
   * ```
   *
   * #### Wrap
   *
   * *Collapses attributes when wrap limit is exceeded. This option will preserve the inner
   * content (spacing/newlines) of any contained Liquid expressions. Using the `wrap` option
   * requires a `wrap` limit to be defined*
   *
   * ```html
   *
   * <!-- The attribute value before formatting -->
   * <div class="one two {{ some.object }} {% if x %} three {% endif %}"></div>
   *
   * <!-- The attribute value after formatting -->
   * <div class="one
   *      two
   *      {{ some.object }}
   *      {% if x %} three {% endif %}"></div>
   * ```
   *
   * #### Collapse
   *
   * *Collapses all attribute values separated by space or newline onto their own line. This
   * is typically undesirable for most cases.*
   *
   * ```html
   *
   * <!-- The attribute value before formatting -->
   * <div class="one two {{ some.object }} {% if x %} three {% endif %}"></div>
   *
   * <!-- The attribute value after formatting -->
   * <div class="
   *      one
   *      two
   *      {{ some.object }}
   *      {% if x %}
   *      three
   *      {% endif %}"></div>
   * ```
   */
  attributeValues?: 'preserve' | 'wrap' | 'strip' | 'collapse'

  /**
   * **Default** `false`
   *
   * If a blank new line should be forced above comments.
   */
  commentNewline?: boolean;

  /**
   * **Default** `false`
   *
   * Whether or not delimiter characters should apply
   * a single space at the start and end point. For example:
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
   * {% for i in arr   %}
   *   {{i.object
   *        }}
   *
   *   {%if x%}
   *
   *     {{foo}}
   *     {{bar   }}
   *     {{   baz   }}
   *
   *   {%   endif%}
   * {%endfor%}
   *
   * <!-- After formatting -->
   * {% for i in arr %}
   *   {{ i.object }}
   *
   *   {% if x %}
   *
   *     {{ foo }}
   *     {{ bar }}
   *     {{ baz }}
   *
   *   {% endif %}
   * {% endfor %}
   * ```
   */
  delimiterSpacing?: boolean

  /**
   * **Default** `false`
   *
   * Markup self-closing tags end will end with `' />'` instead of `'/>'`
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
  selfCloseSpace?: boolean,

  /**
   * **Default** `false`
   *
   * If text in the provided markup code should be preserved exactly as provided.
   * This option eliminates beautification and wrapping of text content.
   */
  preserveText?: boolean,

  /**
   * **Default** `false`
   *
   * If all markup attributes should be indented each onto their own line. You
   * can optionally provide an integer value of `1` or more. When an integer value
   * is passed, attributes will be forced only wheb the number of attributes contained
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
  forceAttribute?: boolean | number;

  /**
   * **Default** `false`
   *
   * Whether the leading attribute should be forced onto a newline when
   * word `wrap` limit is exceeded or if it should be preserved. By default,
   * Prettify preserves the leading attribute when applying wrap indentation.
   * Enabling this option will force indent all attributes if wrap is exceeded.
   *
   * This rule requires a `wrap` level to be defined. If you have `forceAttribute`
   * enabled or using a force attribute limit value it will override this option.
   * If you desire wrap based attribute indentation, set `forceAttribute` to `false`
   * and ensure a `wrap` level is defined.
   *
   * ---
   *
   * #### Disabled (default)
   *
   * *Below is an example of how this rule works if it's disabled (ie: `false`) and
   * attributes have exceeded a defined wrap limit. Notice how leading attributes
   * are preserved that have not exceeded wrap, but proceeding attributes are indented
   * onto their own lines, this is the default behaviour Prettify uses.*
   *
   * ```html
   *
   * <!-- Leading attribute is preserved -->
   * <div class="x"
   *   id="{{ foo }}"
   *   data-attribute-example="100"
   *   data-x="xx">
   *
   * </div>
   *
   * ```
   *
   * #### Enabled
   *
   * *Below is an example of how this rule works if it's enabled (ie: `true`) and
   * attributes have exceeded the defined wrap limit. Notice how all attributes
   * and indented onto their own line, including the leading attribute.*
   *
   *
   * ```html
   *
   * <!-- All attributes are forced including the leading attribute  -->
   * <div
   *   class="x"
   *   id="{{ foo }}"
   *   data-attribute-example="100"
   *   data-x="xx">
   *
   * </div>
   *
   * ```
   */
  forceLeadAttribute?: boolean | number;

  /**
   * **Default** `false`
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
  forceIndent?: boolean

  /**
   * **Default** `none`
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
  quoteConvert?: 'double' | 'single' | 'none'

  /**
   * **Default** `false`
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
   * ```
   */
  preserveAttributes?: boolean;

}
