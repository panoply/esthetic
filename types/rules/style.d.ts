export interface StyleOptions {
  /**
   * **Default** `false`
   *
   * Automatically correct some sloppiness in code. This rules acts a very
   * mild form of linting, wherein otherwise invalid code is automatically
   * corrected.
   */
  correct?: boolean;

  /**
   * **Default** `preserve`
   *
   * The option will indent CSS selector property values onto newlines in CSS,
   * SCSS or LESS languages. The optional is particularly helpful when Liquid
   * tags are used as property values as in most cases CSS property value lengths
   * will rarely exceed wraps.
   *
   * ---
   *
   * #### Example
   *
   * *Below is an example of how this rule works if it's set to `wrap` or `collapse`*
   *
   * ```css
   * .selector {
   *  color:
   *    rgb(211, 211, 211);
   *  font-size:
   *     {{- settings.type_body_font.size  | plus: 5 | at_most: 30 }};
   *  font-weight:
   *    {{- settings.type_body_font.weight  | plus: 300 | at_most: 1000 }};
   *  font-family:
   *    {{-  settings.prop  | default: settings.type_body_font.family  }};
   *  background:
   *     #ffffff;
   * }
   * ```
   */
  forceValue?: 'preserve' | 'collapse' | 'wrap';

  /**
   * This option will alphabetically sort CSS properties contained
   * within classes.
   *
   * ---
   *
   * **Enabled**
   *
   * *Below is an example when this option is set to `true` first
   * and how a class would be formatted.*
   *
   * **Before:**
   *
   * ```css
   *
   * .class {
   *   width: 100px;
   *   color: blue;
   *   background: pink;
   * }
   * ```
   *
   * **After:**
   *
   * ```css
   *
   * .class {
   *   background: pink;
   *   color: blue;
   *   width: 100px;
   * }
   * ```
   *
   * ---
   *
   * **Description**
   *
   * Sorts markup attributes and properties by key name in script and style
   *
   * @default false
   */
  sortProperties?: boolean;

  /**
   * This option will alphabetically sort CSS properties contained
   * within classes.
   *
   * ---
   *
   * **Enabled**
   *
   * Below is an example when this option is set to `true` first
   * and how a class would be formatted.
   *
   * Before:
   *
   * ```css
   *
   * .class {
   *   width: 100px;
   *   color: blue;
   *   background: pink;
   * }
   * ```
   *
   * After:
   *
   * ```css
   *
   * .class {
   *   background: pink;
   *   color: blue;
   *   width: 100px;
   * }
   * ```
   *
   * ---
   *
   * **Description**
   *
   * Sorts markup attributes and properties by key name in script and style
   *
   * @default false
   */
  sortSelectors?: boolean

  /**
   * This will create a newline before and after objects values, for example:
   *
   * **Enabled**
   *
   * Below is an example when this option is set to `true`
   *
   * ```css
   *
   * .class-a { width: 100px; }
   * .class-b { width: 100px; }
   * ```
   *
   * ---
   *
   * **Disabled**
   *
   * Below is an example when this option is set to `false` notice
   * the newline between classes
   *
   * ```css
   *
   * .class-a { width: 100px; }
   * .class-b { width: 100px; }
   * ```
   *
   * ---
   *
   * **Description**
   *
   * Inserts new line characters between every CSS code block.
   *
   * @default false
   */
  classPadding?: boolean,

  /**
   * This will eliminate leading zeros from numbers expressed
   * within values.
   *
   * **Enabled**
   *
   * Below is an example when this option is set to `true`
   *
   * ```css
   *
   * .class { width: .10rem; }
   * ```
   *
   * ---
   *
   * **Disabled**
   *
   * Below is an example when this option is set to `false`
   *
   * ```css
   *
   * .class-a { width: 0.10rem; }
   * ```
   *
   * ---
   *
   * **Description**
   *
   * Inserts new line characters between every CSS code block.
   *
   * @default false
   */
  noLeadZero?: boolean;

  /**
   * **Description**
   *
   * If the quotes of markup attributes should be converted to single quotes
   * or double quotes.
   *
   * **Options**
   *
   * - `double` Converts single quotes to double quotes
   * - `none` Ignores this option
   * - `single` Converts double quotes to single quotes
   *
   * ---
   *
   * @default 'none'
   */
  quoteConvert?: 'double' | 'single' | 'none'

  /**
   * **Default:** `false`
   *
   * If CSS should be beautified in a style where the properties and
   * values are minifed for faster reading of selectors
   */
  compressCSS?: boolean;
}
