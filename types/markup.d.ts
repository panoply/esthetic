import { SharedOptions, SharedEnforced } from './shared';

/**
 * Enforced HTML Formatting Rules
 *
 * These rulesets are enforced for the HTML language
 * in order to prevent any errors occuring while a format
 * is being executed. This are not exposed as exports,
 * they are used internally only.
 */
export interface MarkupEnforced extends SharedEnforced {

  readonly languageName: 'HTML/Liquid';
  readonly language: 'html';
  readonly languageDefault: 'html';
  readonly lexer: 'markup';

  /**
   * We want to avoid this at all costs, it should ALWAYS be `false`.
   * It's a legacy rule that will wreak havoc within HTML.
   *
   * ---
   *
   * **Description**
   *
   * Allows immediately adjacement start and end markup tags
   * of the same name to be combined into a single self-closing tag.
   */
  readonly tagMerge: false

  /**
   * We want to avoid this at all costs, it should ALWAYS be `false`.
   * It's attempts to sort tag placements. Its wreaks havoc within HTML.
   *
   * ---
   *
   * **Description**
   *
   * Sort child items of each respective markup parent element.
   */
  readonly tagSort: false

}

/**
 * Markup Formatting Rules
 *
 * These rulesets are enforced for the HTML language
 * in order to prevent any errors occuring while a format
 * is being executed. This are not exposed as exports,
 * they are used internally only.
 */
export interface IMarkupOptions extends SharedOptions {
  /**
   * Markup Language
   */
  language: 'html' | 'jsx' | 'tsx' | 'liquid' | 'xml';

  /**
   * **Default** `false`
   *
   * HTML Attribute sorting. When enabled it will sort attributes
   * alphabetically. Attribute sorting is ignored on tags that contain
   * template attributes.
   *
   * ---
   *
   * **Example**
   *
   * Below is an example of how this rule works if it's enabled, ie: `true`
   *
   * **Before Formatting:**
   *
   * ```html
   * <div id="x" data-x="foo" class="xx"></div>
   * ```
   *
   * **After Formatting:**
   *
   * ```html
   * <div class="xx" data-x="foo" id="x"></div>
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
   * **Example**
   *
   * Below is an example of how this rule works if it's enabled and you've defined
   * the following attribute sorting structure:
   *
   * ```js
   * {
   *   attributeSort: true, // Must be true when using this rule
   *   attributeSortList: ['id', 'class', 'data-b']
   * }
   * ```
   *
   * **Before Formatting:**
   *
   * ```html
   * <div data-a id="x" data-d data-c data-b class="xx"></div>
   * ```
   *
   * **After Formatting:**
   *
   * ```html
   * <div id="x" class="xx" data-b data-a data-c data-d></div>
   * ```
   *
   * Notice how `data-a`, `data-c` and `data-d` are sorted alphabetically
   * in order following the sort list we provided above.
   */
  attributeSortList?: string[]

  /**
   * **Default** `false`
   *
   * If a blank new line should be forced above comments.
   */
  commentNewline?: boolean

  /**
   * **Default** `false`
   *
   * Whether or not delimiter characters should apply
   * a single space at the start and end point. For example:
   *
   * ---
   *
   * **Example**
   *
   * Below is an example of how this rule works if it's enabled, ie: `true`
   *
   * **Before Formatting:**
   *
   * ```liquid
   * {{foo}}
   * {%if x%}
   *   Hello World
   * {%endif%}
   * ```
   *
   * **After Formatting:**
   *
   * ```liquid
   * {{ foo }}
   * {% if x %}
   *   Hello World
   * {% endif %}
   * ```
   */
  delimiterSpacing?: boolean

  /**
   * **Default** `false`
   *
   * This will determine whether comments should always start at position
   * `0` of each line or if comments should be indented according to the code.
   * It is unlikely you will ever want to set this to `true` so generally, just
   * leave it to `false`
   *
   */
  commentIndent?: boolean

  /**
   * **Default** `false`
   *
   * Markup self-closing tags end will end with `' />'` instead of `'/>'`
   *
   * ---
   *
   * **Example**
   *
   * Below is an example of how this rule works if it's enabled, ie: `true`
   *
   * **Before Formatting:**
   *
   * ```html
   * <picture>
   *   <path srcset="."/>
   * </picture>
   * ```
   *
   * **After Formatting:**
   *
   * ```html
   * <picture>
   *   <path srcset="." />
   * </picture>
   * ```
   */
  selfCloseSpace?: boolean,

  /**
   * **Default** `true`
   *
   * Prevent comment reformatting due to option wrap.
   */
  preserveComment?: boolean,

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
   * Automatically correct some sloppiness in code. This rules acts a very
   * mild form of linting, wherein otherwise invalid code is automatically
   * corrected.
   */
  attemptCorrection?: boolean

  /**
   * **Default** `false`
   *
   * If all markup attributes should be indented each onto their own line.
   * Please note that when you define a `wrap` level then attributes will
   * be automatically forced. This is typically a better solution than forcing
   * all attributes onto newlines.
   *
   * ---
   *
   * **Example**
   *
   * Below is an example of how this rule works if it's enabled, ie: `true`
   *
   * **Before Formatting:**
   *
   * ```html
   * <div class="x" id="{{ foo }}" data-x="xx"></div>
   * ```
   *
   * **After Formatting:**
   *
   * ```html
   * <div
   *   class="x"
   *   id="{{ foo }}"
   *   data-x="xx"></div>
   * ```
   */
  forceAttribute?: boolean

  /**
   * **Default** `false`
   *
   * Will force indentation upon all content and tags without regard for the
   * of new text nodes.
   *
   * ---
   *
   * **Example**
   *
   * Below is an example of how this rule works if it's enabled, ie: `true`
   *
   * **Before Formatting:**
   *
   * ```html
   * <ul>
   *  <li>Hello</li>
   *  <li>World</li>
   * </ul>
   * ```
   *
   * **After Formatting:**
   *
   * ```html
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
   * or double quotes.
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
   * child tokens that require a different lexer.
   *
   * ---
   *
   * **Example**
   *
   * Below is an example of how this rule works if it's enabled, ie: `true`
   *
   * **Before Formatting:**
   *
   * ```html
   * <div
   *  id="x"    data-x="foo"
   * class="xx"></div>
   * ```
   *
   * **After Formatting:**
   *
   * ```html
   * <div
   *  id="x"    data-x="foo"
   * class="xx"></div>
   * ```
   *
   * There is no difference between the _before_ and _after_ version of the code
   * when this option is enabled.
   */
  preserveAttributes?: boolean

}
