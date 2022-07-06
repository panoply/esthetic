export interface Rules {
  /**
   * **Lexers**
   *
   * - script
   *
   * **Languages**
   *
   * - json
   * - javascript
   * - typescript
   */
  arrayFormat?:
  | 'default'
  | 'indent'
  | 'inline';

  /**
   * Attempts to automatically correct some sloppiness in code. This is not
   * always desired but can help in some situations.
   *
   * ---
   *
   * **Default**
   *
   * - `false`
   *
   * **Lexers**
   *
   * - `markup`
   * - `script`
   * - `style`
   *
   * **Languages**
   *
   * - `html`
   * - `json`
   * - `css`
   * - `less`
   * - `scss`
   * - `jsx`
   * - `tsx`
   * - `javascript`
   * - `typescript`
   */
  attemptCorrection?: boolean;

  /**
   * Lexer: `markup`
   */
  attributeGlue?: boolean;

  /**
   * **Attribute Sorting**
   *
   * HTML Attribute sorting. When enabled it will sort attributes
   * alphabetically (A-Z). Attribute sorting is ignored on tags that contain
   * template attributes.
   *
   * ---
   *
   * **Default**
   *
   * - `false`
   *
   * ---
   *
   * **Lexers**
   *
   * - `markup`
   *
   * ---
   *
   * **Languages**
   *
   * - `html`
   * - `JSX`
   * - `TSX`
   *
   * ---
   *
   * **Example**
   *
   * ```html
   * <!-- Before Formatting -->
   * <div id="x" data-x="foo" class="xx"></div>
   *
   * <!-- After Formatting -->
   * <div class="xx" data-x="foo" id="x"></div>
   * ```
   */
  attributeSort?: boolean;

  /**
   * **Attribute Sorting List**
   *
   * A list of attribute names. Attributes will be sorted according to
   * this list and then alphanumerically. This option requires `attributeSort` to
   * to be enabled (ie: `true`).
   *
   * ---
   *
   * **Default**
   *
   * - `[]`
   *
   * ---
   *
   * **Lexers**
   *
   * - `markup`
   *
   * ---
   *
   * **Languages**
   *
   * - `html`
   * - `JSX`
   * - `TSX`
   *
   * ---
   *
   * **Example**
   *
   * Below is the expected rule definitions that need to be defined in
   * order for sorting to be applied:
   *
   * ```js
   * {
   *   attributeSort: true, // Must be true when using this rule
   *   attributeSortList: ['id', 'class', 'data-b']
   * }
   * ```
   *
   * **Results**
   *
   * Notice how `data-a`, `data-c` and `data-d` are sorted alphabetically
   * in order following the sort list we provided above.
   *
   * ```html
   * <!-- Before Formatting -->
   * <div data-a id="x" data-d data-c data-b class="xx"></div>
   *
   * <!-- After Formatting -->
   * <div id="x" class="xx" data-b data-a data-c data-d></div>
   * ```
   */
  attributeSortList?: string[];

  /**
   * Determines if opening curly braces will exist on the same line as their condition or
   * be forced onto a new line, otherwise known as "Allman Style" indentation.
   *
   * **Lexers**
   *
   * - script
   *
   * **Languages**
   *
   * - javascript
   * - typescript
   *
   * ---
   *
   * **Example**
   *
   * ```js
   * // If the option is set to true then braces will be
   * // placed onto a newline
   * if (x === true)
   * {
   *   console.log('Allman Style!')
   * }
   * ```
   */
  braceAllman?: boolean;

  /**
   * Lexer: `script`
   */
  braceNewline?: boolean;

  /**
   * **Brace Padding**
   *
   * If true an empty line will be inserted after opening curly braces
   * and before closing curly braces.
   *
   * **Default**
   * - `false`
   *
   * ---
   *
   * **Lexers**
   * - `script`
   *
   * ---
   *
   * **Languages**
   * - `json`
   * - `javascript`
   * - `typescript`
   *
   * ---
   *
   * **Example**
   *
   * ```js
   * // Below is an example when this option is set to true
   * // notice the newlines after 'foo' and 'bar'
   * {
   *
   *  "foo": {
   *
   *   "bar": {
   *      "baz": 0
   *    }
   *
   *   }
   *
   * }
   *
   * // Below is an example when this option is set to false
   * // notice how no newline are applied between 'foo' and 'bar'
   * {
   *  "foo": {
   *   "bar": {
   *      "baz": 0
   *    }
   *   }
   * }
   * ```
   */
  bracePadding?: boolean;

  /**
   * **Brace Style**
   *
   * Emulates JSBeautify's brace_style option using existing
   * rule options.
   *
   * **Default**
   * - `none`
   *
   * **Options**
   * - `none`- _Ignores this option_
   * - `collapse`
   * - `collapse-preserve-inline`
   * - `expand`
   *
   * ---
   *
   * **Lexers**
   * - `script`
   *
   * ---
   *
   * **Languages**
   * - `javascript`
   * - `typescript`
   *
   */
  braceStyle?:
  | 'none'
  | 'collapse'
  | 'collapse-preserve-inline'
  | 'expand';

  /**
   * Lexer: `script`
   */
  caseSpace?: boolean;
  /**
   * Lexer: `style`
   */
  classPadding?: boolean;
  /**
   * Lexer: `all`
   */
  commentIndent?: boolean;
  /**
   * Lexer: `all`
   */
  commentNewline?: boolean;
  /**
   * Lexer: `style`
   */
  compressCSS?: boolean;
  /**
   * Lexer: `script`
   */
  inlineReturn?: boolean;

  /**
   * If `true` then the keyword 'else' is forced onto a new line.
   *
   * ---
   * **Default**
   *
   * - `false`
   *
   * ---
   *
   * **Lexers**
   *
   * - `script`
   *
   * ---
   *
   * **Languages**
   *
   * - javascript
   * - typescript
   */
  elseNewline?: boolean;

  /**
   * **Ending Comma**
   *
   * If there should be a trailing comma in arrays and objects.
   *
   * **Default**
   *
   * - `none`
   *
   * **Options**
   *
   * - `always` _Always ensure there is a tailing comma_
   * - `never` _Remove trailing commas_
   * - `none` _Ignore this option_
   *
   * ---
   *
   * **Lexers**
   * - `script`
   *
   * ---
   *
   * **Languages**
   * - `javascript`
   * - `typescript`
   *
   * ---
   *
   * **Example**
   *
   * ```js
   * // If the rule is defined to 'always'
   * const x = {
   *  a: 'a',
   *  b: 'b', // Notice the trailing comma
   * }
   * ```
   */
  endComma?: 'none' | 'always' | 'never';

  /**
   * **End Newline**
   *
   * Insert an empty line at the end of output.
   *
   * **Default**
   * - `false`
   *
   * ---
   *
   * **Lexers**
   *
   * - `markup`
   * - `script`
   * - `style`
   *
   * ---
   *
   * **Languages**
   *
   * - `html`
   * - `json`
   * - `css`
   * - `less`
   * - `scss`
   * - `jsx`
   * - `tsx`
   * - `javascript`
   * - `typescript`
   */
  endNewline?: boolean;

  /**
   * If all markup attributes should be indented each onto their own line.
   * Please note that when you define a `wrap` level then attributes will
   * be automatically forced. Defining a `wrap` level is typically a better
   * solution than forcing all attributes onto newlines.
   *
   * **Default**
   *
   * - `false`
   *
   * ---
   *
   * **Lexers**
   *
   * - `markup`
   *
   * ---
   *
   * **Languages**
   *
   * - `html`
   * - `jsx`
   * - `tsx`
   *
   * ---
   *
   * **Example**
   *
   * ```html
   * <!-- Before Formatting -->
   * <div class="x" id="{{ foo }}" data-x="xx"></div>
   *
   * <!-- After Formatting -->
   * <div
   *   class="x"
   *   id="{{ foo }}"
   *   data-x="xx"></div>
   * ```
   */
  forceAttribute?: boolean;

  /**
   * Lexer:
   *
   * - markup
   *
   * Languages:
   *
   * - html
   * - jsx
   * - tsx
   */
  forceIndent?: boolean;
  /**
   * Lexer:
   *
   * - markup
   *
   * Languages:
   *
   * - javascript
   * - typescript
   */
  functionNameSpace?: boolean;
  /**
   * Lexer:
   *
   * - markup
   *
   * Languages:
   *
   * - javascript
   * - typescript
   */
  functionSpace?: boolean;
  /**
   * Lexer:
   *
   * - markup
   * - script
   * - style
   *
   * Languages:
   *
   * - html
   * - css/scss
   * - javascript
   * - typescript
   */
  indentLevel?: number;
  /**
   * Lexer:
   *
   * - markup
   * - script
   * - style
   *
   * Languages:
   *
   * - html
   * - css/scss
   * - javascript
   * - typescript
   */
  crlf?: boolean;
  /**
   * **Lexers**
   *
   * - markup
   * - script
   * - style
   *
   * **Languages**
   * - html
   * - css/scss
   * - javascript
   * - typescript
   */
  indentChar?: ' ' | '\u0009';
  /**
   * The number of `indentChar` values to comprise a single indentation.
   * Defaults this to `4` but we overwrite to `2` or assign the vscode workspace
   * editor options.
   *
   * **Lexers**
   *
   * - markup
   * - script
   * - style
   *
   * **Languages**
   *
   * - html
   * - css/scss
   * - javascript
   * - typescript
   */
  indentSize?: number;
  languageName?: string;
  languageDefault?: string,
  /**
   * Lexer:
   *
   * - markup
   * - script
   * - style
   *
   * Languages:
   *
   * - html
   * - css/scss
   * - javascript
   * - typescript
   */
  language?: string;
  lexer?: string;
  mode?: 'beautify' | 'parse'
  methodChain?: number;
  neverFlatten?: boolean;
  noCaseIndent?: boolean;
  noLeadZero?: boolean;
  noSemicolon?: boolean;
  objectSort?: boolean;
  objectIndent?:
  | 'default'
  | 'indent'
  | 'inline',
  preserveAttributes?: boolean;
  preserveAttributeValues?: boolean;
  parseFormat?: 'parallel';
  parseSpace?: boolean;
  preserveComment?: boolean;
  preserveLine?: number;
  preserveText?: boolean;
  quoteConvert?:
  | 'none'
  | 'double'
  | 'single';
  sortProperties?: boolean, // object_sort
  inlineSelectors?: boolean, // selector_list
  selfCloseSpace?: boolean,
  styleGuide?:
  | 'none'
  | 'airbnb'
  | 'crockford'
  | 'google'
  | 'jquery'
  | 'jslint'
  | 'standard'
  | 'yandex'
  tagMerge?: false;
  tagSort?: false;
  ternaryLine?: boolean;
  variableList?:
  | 'none'
  | 'each'
  | 'list';
  vertical?: boolean;
  wrap?: number;
}
