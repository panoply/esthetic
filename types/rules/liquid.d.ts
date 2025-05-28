import type { LiteralUnion } from 'type-fest';

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
