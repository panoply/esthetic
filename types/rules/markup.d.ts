import type { LiteralUnion } from 'type-fest';

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
   * > `preserve`
   * >
   * > Preserve the HTML comment delimiter
   *
   *
   * > `consistent`
   * >
   * > Formatting is determined by the starting delimiter placement.
   *
   *
   * > `newline`
   * >
   * > Forces HTML comment delimeters onto newlines
   *
   * > `inline`
   * >
   * > Forces HTML comment delimiters inline
   *
   *
   * > `inline-align`
   * >
   * > Applies aligned inline formatting with additional indentation
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
   * Default: `false`
   *
   * **Markup**
   *
   * **[Self Close Slash](https://aesthetic.js.org/selfCloseSlash/)**
   *
   * Applies old-school self-closing slash to singleton identifiable tags.
   *
   */
  selfCloseSlash?: boolean;
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
   * **[Text Bound Inline](https://aesthetic.js.org/rules/textBoundInline/)**
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
   * Default: `false`
   *
   * **Markup**
   *
   * **[Text Preserve](https://aesthetic.js.org/rules/textPreserve/)**
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
   * Default: `false`
   *
   * **Markup**
   *
   * **[Strip Attribute Lines](https://aesthetic.js.org/rules/stripAttributeLines/)**
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
   * Default: `preserve`
   *
   * **Markup**
   *
   * **[Value Spacing](https://aesthetic.js.org/rules/valueSpacing/)**
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
