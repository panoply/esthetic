/* eslint-disable no-use-before-define */

import { LiteralUnion } from 'type-fest';

/**
 * Lexer Names string literal
 */
export type LexerNames = (
  | 'auto'
  | 'text'
  | 'markup'
  | 'script'
  | 'style'
);

/**
 * Lexer Names string literal
 */
export type LanguageNames = LiteralUnion<(
  | 'auto'
  | 'text'
  | 'html'
  | 'liquid'
  | 'javascript'
  | 'jsx'
  | 'typescript'
  | 'tsx'
  | 'json'
  | 'css'
  | 'scss'
  | 'less'
  | 'xml'
  | 'unknown'
), string>

/**
 * The formatted proper names of supported languages
 */
export interface LanguageProperNames {
  text: 'Plain Text';
  html: 'HTML';
  liquid: 'Liquid';
  javascript: 'JavaScript'
  jsx: 'JSX';
  typescript: 'TypeScript';
  tsx: 'TSX';
  json: 'JSON';
  css: 'CSS';
  scss: 'SCSS';
  less: 'LESS';
  xml: 'XML';
  yaml: 'YAML';
  markdown: 'Markdown';
}

/**
 * Lexer names as an array type
 */
export type LexerArray = Array<LexerNames>;

/**
 * Structure reference applied on parser
 */
export type Structure = [token: string, index: number];

/**
 * Token Types string literal
 */
export type Types = `${MarkupTypes | ExtraTypes | ScriptTypes | StyleTypes}`

/**
 * Rule option defintions
 */
export type Definitions = { [K in keyof Defs]: Definition }

/**
 * Style lexer stack token types
 */
export enum StyleTypes {
  /**
   * Describes a : character. This types value exists to uniquely set colon
   * characters apart from other types values.
   */
  colon = 'colon',
  /**
   * Describes standard CSS block comments as well as line comments that
   * exist in languages like LESS and SCSS.
   */
  comment = 'comment',
  /**
   * Describes the characters `}` and `)` if the parenthesis closes a structure
   * described as map.
   */
  end = 'end',
  /**
   * Describes a name followed by a single set of parenthesis which is
   * followed by either a semicolon or closing curly brace.
   */
  function = 'function',
  /**
   * This is an internally used value that should not be exposed outside
   * the lexer unless the lexer receives an incomplete code sample.
   */
  item = 'item',
  /**
   * Describes a CSS selector.
   */
  selector = 'selector',
  /**
   * Describes a ; character. This types value exists to uniquely set semicolon
   * characters apart from other types values.
   */
  semi = 'semi',
  /**
   * Describes `{` and `(` if the parenthesis is part of a map structure.
   */
  start = 'start',
  /**
   * Describes a token comprising an external template language that is not
   * of start or end types.
   *
   * ---
   * @prettify
   *
   * This infers Liquid code in Prettify
   */
  template = 'template',
  /**
   * Various template languages commonly offer conditions with else branches.
   * Else tokens do not behave the same way as a templates start or end types.
   *
   * ---
   * @prettify
   *
   * This infers Liquid code in Prettify
   */
  template_else = 'template_else',
  /**
   * Describes the closing sequence for a third party language template tag.
   *
   * ---
   * @prettify
   *
   * This infers Liquid code in Prettify
   */
  template_end = 'template_end',
  /**
   * Describes the closing sequence for a third party language template tag.
   *
   * ---
   * @prettify
   *
   * This infers Liquid code in Prettify
   */
  template_start = 'template_start',
  /**
   * Describes CSS property values, which is generally anything that follows a colon,
   * even if not a known property, but does not immediately precede some sort of structure opening.
   */
  value = 'value',
  /**
   * Languages like LESS and SCSS allow defining and referencing from variables.
   */
  variable = 'variable',
}

/**
 * Script lexer stack token types
 */
export enum ScriptTypes {
  /**
   * Describes both block comments (`/*`) and line comments (`//`)
   *
   * ---
   * @prettify
   *
   * This infers Liquid `{% comment %}` and `{% endcomment%}` in Prettify
   */
  comment = 'comment',
  /**
   * Describes }, ], and ).
   */
  end = 'end',
  /**
   * Java and C# styled type generics as used in TypeScript
   */
  generic = 'generic',
  /**
   * JavaScript operators and other syntax characters not otherwise described here.
   */
  operator = 'operator',
  /**
   * Numbers.
   */
  number = 'number',
  /**
   * A named reference of an object.
   */
  property = 'property',
  /**
   * A word token type that is declared in the code sample.
   */
  reference = 'reference',
  /**
   * Regular expressions. Described as delimited by / characters but not in
   * such a way that the first character could suggestion a division operator.
   */
  regex = 'regex',
  /**
   * Describes `,`, `.`, and `;`.
   */
  separator = 'separator',
  /**
   * Strings, which includes JavaScript template strings.
   */
  string = 'string',
  /**
   * Describes `{`, `[`, and `(`.
   */
  start = 'start',
  /**
   * Describes syntax groups that comprise a known foreign language, often a
   * template language, and is otherwise illegal syntax in JavaScript.
   *
   * ---
   * @prettify
   *
   * This infers Liquid code in Prettify
   */
  template = 'template',
  /**
   * A template type that is used as the else block of a condition.
   *
   * ---
   * @prettify
   *
   * This infers Liquid code in Prettify
   */
  template_else = 'template_else',
  /**
   *  A terminal token of a template body
   *
   * ---
   * @prettify
   *
   * This infers Liquid code in Prettify
   */
  template_end = 'template_end',
  /**
   * A start token of a template body.
   */
  template_start = 'template_start',
  /**
   * A template (literal) string that terminates with `${`.
   */
  template_string_end = 'template_string_end',
  /**
   * A template string that starts with `}` and terminates with `${`.
   */
  template_string_else = 'template_string_else',
  /**
   * A template string that starts with `}`
   */
  template_string_start = 'template_string_start',
  /**
   *  A TypeScript data type declaration.
   */
  type = 'type',
  /**
   * Closing out a TypeScript data type.
   */
  type_end = 'type_end',
  /**
   * A starting structure of TypeScript data types.
   */
  type_start = 'type_start',
  /**
   * A markup type
   */
  markup = 'markup',
  /**
   * A collection of characters that comprise a JavaScript keyword or
   * reference not explicitly declared in the code sample. This parser is
   * less strict than a JavaScript compiler in that it does not, at this time,
   * trap certain extended UTF8 control characters that aren't valid in identifiers.
   */
  word = 'word',
}

/**
 * Markup lexer stack token types
 */
export enum MarkupTypes {
  /**
   * A tag attribute from a regular start or singular tag type.
   */
  attribute = 'attribute',
  /**
   * An XML/SGML CDATA block. Typically used to allow extraneous string content in an XML
   * document that might otherwise break the XML syntax rules.
   */
  cdata = 'cdata',
  /**
   * When a CDATA segment terminates an enclosed grammar parsed with a different lexer.
   */
  cdata_end = 'cdata_end',
  /**
   * When a CDATA segment starts an enclosed grammar parsed with a different lexer.
   */
  cdata_start = 'cdata_start',
  /**
   * Comment in XML or supporting template syntax.
   */
  comment = 'comment',
  /**
   * JSX allows JavaScript style comments as tag attributes.
   */
  comment_attribute = 'comment_attribute',
  /**
   * Comments used in IE to hack references to CSS by IE version.
   * Follows a SGML square brace convention.
   */
  conditional = 'conditional',
  /**
   * Regular text nodes, but white space is removed from the front and end of the
   * node as an 'approximate value is accounted for in the lines data field.
   */
  content = 'content',
  /**
   * A content type that lets consuming applications this token must not be modified.
   */
  content_preserve = 'content_preserve',
  /**
   * An end tag of a tag pair.
   */
  end = 'end',
  /**
   * These types are used to excuse a structure from deeper evaluation and treats
   * the element as a singleton even if it is part of tag pair and contains descendant nodes.
   */
  ignore = 'ignore',
  /**
   * The end of an curly brace delimited escape, stated as a tag attribute, that
   * allows JavaScript inside the markup tag of a JSX markup element.
   */
  jsx_attribute_end = 'jsx_attribute_end',
  /**
   * The start of an curly brace delimited escape, stated as a tag attribute, that
   * allows JavaScript inside the markup tag of a JSX markup element.
   */
  jsx_attribute_start = 'jsx_attribute_start',
  /**
   * A curly brace indicating the contents that need to be passed to the script lexer for
   * JSX language.
   */
  script_start = 'script_start',
  /**
   * A curly brace indicating a script string has concluded.
   */
  script_end = 'script_end',
  /**
   * SGML type notations, which can be deeply nested using square brace notation.
   *
   * @deprecated
   * This will no longer be provided in Prettify
   */
  sgml = 'sgml',
  /**
   * A self-closing tag.
   */
  singleton = 'singleton',
  /**
   * A start tag of a tag pair.
   */
  start = 'start',
  /**
   * A tag indicating it may contain contents that need to be passed to the style lexer.
   */
  style = 'style',
  /**
   * A tag delimited by a known convention of an external template language.
   *
   * ---
   * @prettify
   *
   * This is typically going to represent singleton Liquid tags or Liquid objects,
   * but could also represent unknown Liquid tags.
   */
  template = 'template',
  /**
   * A tag attribute that conveys instructions to a template pre-parser opposed to
   * meta data describing the markup tag.
   *
   * ---
   * @prettify
   *
   * This is representative of Liquid tags infused within HTML attributes.
   */
  template_attribute = 'template_attribute',
  /**
   * A template tag acting as the else block of a condition.
   *
   * ---
   * @prettify
   *
   * This is representative of Liquid tags like `{% else %}` or `{% when %}` etc
   */
  template_else = 'template_else',
  /**
   * A closing template tag associated with a prior template_start tag type.
   *
   * ---
   * @prettify
   *
   * This is representative of Liquid tags like `{% endif %}` or `{% endfor %}` etc
   */
  template_end = 'template_else',
  /**
   * A template tag that contains content or other tags not associated with
   * the template language and expects a closing tag.
   *
   * ---
   * @prettify
   *
   * This is representative of Liquid tags like `{% if %}` or `{% for %}` etc
   */
  template_start = 'template_start',
  /**
   *  XML pragmas. Typically used to declare the document for an XML interpreter,
   * but otherwise not widely used.
   */
  xml = 'xml'
}

/**
 * Extra lexer stack token types
 */
export enum ExtraTypes {
  else = 'else',
  mixin = 'mixin',
  comment = 'comment',
  'content-ignore' = 'content-ignore'
}

interface Scopes extends Array<[string, number]>{
  [index:number]: [string, number];
}
/**
 * Parsed Data
 */
export interface Data {
  /**
   * The index where the current structure begins.
   * For tokens of type start this will refer to the parent
   * container or global scope.
   */
  begin: number[];
  /**
   * The index where the current structure ends. Unlike the
   * `begin` data a token of type end refers to itself.
   */
  ender: number[];
  /**
   * The type of rules use to scan and resolve the current token.
   */
  lexer: string[];
  /**
   * Describes the white space immediate prior to the token's first
   * character. A value of `0` means no white space. A value of `1`
   * means some amount of whitespace not containing a new line character.
   * Values of `2` and greater indicate the number of new lines plus `1`.
   * For example, an empty line preceding the current token would mean a
   * value of `3`, because the white space would contain two new line characters.
   */
  lines: number[];
  /**
   * A description of the current structure represented by the
   * `begin` and `ender` data values.
   */
  stack: string[];
  /**
   * The atomic code fragment.
   */
  token: string[];
  /**
   * A categorical description of the current token. Types are defined
   * in each markdown file accompanying a respective lexer file.
   */
  types: Array<`${Types}`>
}

export interface Definition {
  /**
   * The default setting
   */
  default: boolean | string[] | string | number;
  /**
   * Rules description
   */
  description: string;
  /**
   * Type
   */
  type: 'boolean' | 'array' | 'number' | 'string' | 'select';
  /**
   * The lexer the rule pertains
   */
  lexer: 'all' | 'markup' | 'script' | 'style';
  /**
   * An optional list of pre-selected rule values.
   */
  values?: {
    /**
     * The rule value
     */
    rule: string;
    /**
     * Rule value description
     */
    description: string;
  }[]
}

export interface Record {
  begin: Data['begin'][number]
  ender: Data['ender'][number]
  lexer: Data['lexer'][number]
  lines: Data['lines'][number]
  stack: Data['stack'][number]
  token: Data['token'][number]
  types: `${Types}`
}

export interface Spacer {
  array: string[];
  end : number;
  index: number;
}

export interface Splice {
  data: Data;
  howmany: number;
  index: number;
  record?: Record;
}

export interface WrapComment {
  chars: string[];
  end: number;
  lexer: string;
  opening: string;
  start: number;
  terminator: string;
}

export interface IParse {
  /**
   * Parse Error
   */
  error: string;
  /**
   * Stores the final index location of the data arrays
   */
  count: number;
  /**
   *  Stores the name of the data arrays.  This is used for internal automation
   */
  datanames: string[];
  /**
   * Stores the current line number from the input string for logging parse errors
   */
  lineNumber: number;
  /**
   * Stores the 'lines' value before the next token
   */
  linesSpace: number;
  /**
   * Stores the various data arrays of the parse table
   */
  data: Data;
  /**
   * Stores the final index location of the data arrays
   */
  parse?: IParse;
  /**
   * Stores the declared variable names for the script lexer.
   * This must be stored outside the script lexer since some languages
   * recursive use of the script lexer
   */
  references: string[][];
  /**
   * Stores the stack and begin values by stacking depth
   */
  structure: Structure[];
  /**
   * An extension of `Array.prototype.concat` to work across
   * the data structure. This is an expensive operation.
   */
  concat(data: Data, array: Data): void;
  /**
   * The function that sorts object properties
   */
  objectSort(data: Data): void;
  /**
   * An extension of `Array.prototype.pop` to work across the data structure
   */
  pop(data: Data): Record;
  /**
   * An extension of `Array.prototype.push` to work across the data structure
   */
  push(data: Data, record: Record, structure: string): void;
  /**
   * A custom sort tool that is a bit more intelligent and
   * multidimensional than `Array.prototype.sort`
   */
  safeSort(array: [string, number][], operation: string, recursive: boolean): [string, number][];
  /**
   * This functionality provides corrections to the `begin` and `ender` values after use of objectSort
   */
  sortCorrection(start: number, end: number): void;
  /**
   * A simple tool to take note of whitespace between tokens parseSpacer
   */
  spacer(args: Spacer): number;
  /**
   * An extension of `Array.prototype.splice` to work across the data structure
   */
  splice(spliceData: Splice): void;
  /**
   * Parsing block comments and simultaneously applying word wrap
   */
  wrapCommentBlock(config: WrapComment): [string, number];
  /**
   * Parsing block comments and applying word wrap
   */
  wrapCommentLine(config: WrapComment): [string, number];
}

/* -------------------------------------------- */
/* PRETTIFY                                     */
/* -------------------------------------------- */

export interface SharedOptions {
  /**
   * **Default** `auto`
   *
   * Markup Language
   */
  language?: LanguageNames;

  /**
   * **Default** `2`
   *
   * The number of `indentChar` values to comprise a single indentation.
   * Defaults this to `4` but we overwrite to `2` or assign the vscode workspace
   * editor options.
   */
  indentSize?: number;

  /**
   * **Default** `0`
   *
   * How much indentation padding should be applied to beautification?
   * This option is internally used for code that requires switching
   * between libraries.
   */
  indentLevel?: number;

  /**
   *  **Default** `0`
   *
   * Character width limit before applying word wrap. A `0` value
   * disables this option. A negative value concatenates script strings.
   */
  wrap?: number;

  /**
   *  **Default** `false`
   *
   * Whether or not to insert a final line. When this rule is undefined in
   * a `.liquidrc` file the Text Editors settings will be used, in vscode
   * that is `*.endWithNewline` where `*` is a language name.  If an
   * `.editorconfig` file is found present in root, those rules will be
   * applied in **precedence** over Text Editor.
   */
  endNewline?: boolean;

  /**
   *  **Default** `false`
   *
   * If line termination should be Windows (CRLF) format.
   * Unix (LF) format is the default.
   */
  crlf?: boolean;

  /**
   * **Default** ` `
   *
   * The string characters to comprise a single indentation.
   * Any string combination is accepted
   */
  indentChar?: string;

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
   * **Default** `false`
   *
   * Prevent comment reformatting due to option wrap.
   */
  preserveComment?: boolean;

  /**
   * **Default** `2`
   *
   * The maximum number of consecutive empty lines to retain.§
   */
  preserveLine?: number;

  /**
   * **Default** `false`
   *
   * Automatically correct some sloppiness in code. This rules acts a very
   * mild form of linting, wherein otherwise invalid code is automatically
   * corrected.
   */
  attemptCorrection?: boolean;

  /* -------------------------------------------- */
  /* OTHER                                        */
  /* -------------------------------------------- */

  tagMerge?: false;
  tagSort?: false;
  lexer?: LiteralUnion<LexerNames, string>;
  languageName?: string;
  mode?: 'beautify' | 'parse';
}

/* MARKUP ------------------------------------- */

export interface MarkupOptions {
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
   */
  attributeGlue?: boolean;

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
   * **Default** `false`
   *
   * If text in the provided markup code should be preserved exactly as provided.
   * This option eliminates beautification and wrapping of text content.
   */
  preserveText?: boolean,

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

  /**
   * **Default** `false`
   */
  preserveAttributeValues?: boolean

}

/* STYLE -------------------------------------- */

export interface StyleOptions {

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

/* SCRIPT ------------------------------------- */

export interface ScriptOptions {

  /**
   * **Former Rule**
   *
   * `end_comma`
   *
   * **Description**
   *
   * If there should be a trailing comma in arrays and objects.
   * Value "multiline" only applies to modes beautify and diff.
   * always — Always ensure there is a tailing comma._
   *
   * **Options**
   *
   * - `always` Always ensure there is a tailing comma
   * - `never` Remove trailing commas
   * - `none` Ignore this option
   *
   */
  endComma?: 'none' | 'always' | 'never'

  /**
   * **Default** `true`
   *
   * If a blank new line should be forced above comments.
   * When this rule is `true` comments will always have a
   * newline applied before they start, this includes within
   * objects.
   *
   * Please note, that this rule will only be applied to block
   * type comments, line (`//`) comments will not be touched.
   */
  commentNewline?: boolean;

  /**
   * **Description**
   *
   * > Emulates JSBeautify's brace_style option using existing
   * Pretty Diff options._
   *
   * **Options**
   *
   * `collapse`
   * > Sets `format_object` to `indent` and `neverflatten` to `true`.
   *
   * `collapse-preserve-inline`
   * > Sets `brace_padding` to true and `formatObject` to `inline`.
   *
   * `expand`
   * > Sets `braces` to `true`, `formatObject` to `indent`, and
   * `neverflatten` to `true`
   *
   * `none`
   * > Ignores this option
   */
  braceStyle?: 'none' | 'collapse' | 'collapse-preserve-inline' | 'expand',

  /**
   * This option will alphabetically sort object properties in JSON objects.
   *
   * ---
   * **Description**
   *
   * Sorts markup attributes and properties by key name in script and style
   *
   * @default false
   */
  objectSort?: boolean

  /**
   * This option will determine how arrays cotained on objects will
   * be formatted.
   *
   * ---
   *
   * **Enabled**
   *
   * Below is an example when this option is set to `true` and each
   * object in the array starts on a newline.
   *
   * ```javascript
   * const obj = {
   *    array: [
   *      {
   *        name: "foo"
   *      },
   *      {
   *        name: "bar"
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
   * **Disabled**
   *
   * Below is an example when this option is set to `false` and
   * each object in the array starts curly braces inline.
   *
   * ```javascript
   * const obj = {
   *    array: [
   *      {
   *        name: "foo"
   *      }, {
   *        name: "bar"
   *      }, {
   *        name: "baz"
   *      }
   *    ]
   * }
   * ```
   *
   * ---
   *
   * **Description**
   *
   * Determines if opening curly braces will exist on
   * the same line as their condition or be forced onto a new line.
   * (Allman style indentation).
   *
   */
  braceAllman?: boolean,

  /**
   * This will create a newline before and after objects values, for example:
   *
   * ---
   *
   * **Enabled**
   *
   * Below is an example when this option is set to `true`
   *
   * ```javascript
   * const obj = {
   *
   *  foo: {
   *
   *   bar: {
   *      baz: 0
   *    }
   *
   *   }
   *
   * }
   * ```
   *
   * ---
   *
   * **Disabled**
   *
   * Below is an example when this option is set to `false`
   *
   * ```javascript
   * const obj = {
   *  foo: {
   *   bar: {
   *      baz: 0
   *    }
   *   }
   * }
   * ```
   *
   * ---
   *
   * **Description**
   *
   * If true an empty line will be inserted after opening curly braces
   * and before closing curly braces.
   *
   */
  bracePadding?: boolean,

  /**
   * Controls how arrays on objects are formatted.
   *
   * ---
   *
   * **Description**
   *
   * Determines if all array indexes should be indented, never indented,
   * or left to the default._
   *
   * **Options**
   *
   * - `default`
   *  Default formatting (**Selected**)
   *
   * - `indent`
   *  "Always indent each index of an array
   *
   * - `inline`
   *  Ensure all array indexes appear on a single line
   *
   * @default 'default'
   */
  arrayFormat?: 'default' | 'indent' | 'inline',

  /**
   * Controls how arrays on objects are formatted. We will exclude
   * the `inline` option to prevent unreadable objects.
   *
   * ---
   *
   * **Description**
   *
   * Determines if all object keys should be indented, never indented,
   * or left to the default._
   *
   * **Options**
   *
   * > `default` (**Selected**)
   *  Default formatting
   *
   * > `indent`
   *  "Always indent each index of an array
   *
   * > `inline` (**Disabled**)
   *  Ensure all array indexes appear on a single line
   *
   * @default 'default'
   */
  objectIndent?: 'default' | 'indent' | 'inline',

  /**
   * **Description**
   *
   * If true an empty line will be inserted after opening curly braces
   * and before closing curly braces.
   *
   * @default false
   */
  braceNewline?: boolean,

  /**
   * **Description**
   *
   * If the colon separating a case's expression (of a switch/case block)
   * from its statement should be followed by a space instead of indentation,
   * thereby keeping the case on a single line of code.
   */
  caseSpace?: boolean,

  /**
   * **Description**
   *
   * Inlines `return` calls when contained within conditionals. This rule
   * will also correct conditions.
   *
   * ---
   *
   * **Example**
   *
   * Below is an example of how this rule works if it's enabled, ie: `true`
   *
   * **Before Formatting:**
   *
   * ```js
   * function fn (x) {
   *
   *  if(x === true)
   *     return 'Hello!'
   *
   * }
   *
   * ```
   *
   * **After Formatting:**
   *
   * ```js
   * function fn (x) {
   *
   *  if(x === true) return 'Hello!'
   *
   * }
   *
   * ```
   */
  inlineReturn?: boolean,

  /**
   * **Description**
   *
   * If else_line is true then the keyword 'else' is
   * forced onto a new line.
   */
  elseNewline?: boolean,

  /**
   * **Description**
   *
   * If a space should follow a JavaScript function name.
   */
  functionNameSpace?: boolean,

  /**
   * **Description**
   *
   * Inserts a space following the function keyword for anonymous functions.
   */
  functionSpace?: boolean,

  /**
   * **Description**
   *
   * When to break consecutively chained methods and properties onto
   * separate lines. A negative value disables this option. A value of 0
   * ensures method chainsare never broken.
   */
  methodChain?: number,

  /**
   * **Description**
   *
   * If destructured lists in script should never be flattend.
   */
  neverFlatten?: boolean,

  /**
   * **Description**
   *
   * If the colon separating a case's expression (of a switch/case block)
   * from its statement should be followed by a space instead of indentation,
   * thereby keeping the case on a single line of code.
   */
  noCaseIndent?: boolean,

  /**
   * **Description**
   *
   * Removes semicolons that would be inserted by ASI.
   * This option is in conflict with option `attemptCorrection` and takes
   * precedence over conflicting features. Use of this option is
   * a possible security/stability risk.
   */
  noSemicolon?: boolean;

  /**
   * **Description**
   *
   * If ternary operators in JavaScript `?` and `:` should remain on the same line.
   */
  ternaryLine?: boolean,

  /**
   * **Description**
   *
   * If consecutive JavaScript variables should be merged into a
   * comma separated list or if variables in a list should be separated.
   */
  variableList?:
  | 'none'
  | 'each'
  | 'list';

  /**
   * **Description**
   *
   * If lists of assignments and properties should be vertically aligned
   */

  vertical?: boolean,
  /**
   * **Description**
   *
   * If the quotes of script attributes should be converted to single quotes
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
  quoteConvert?: 'double' | 'single' | 'none';

  styleGuide?:
  | 'none'
  | 'airbnb'
  | 'crockford'
  | 'google'
  | 'jquery'
  | 'jslint'
  | 'none'
  | 'standard'
  | 'yandex';
}

export interface JSONOptions {
  /**
   * **Default:** `false`
   *
   * This option will alphabetically sort object properties in JSON objects.
   */
  objectSort?: boolean

  /**
   * **Default:** `true`
   *
   * This option will determine how arrays cotained on objects will
   * be formatted. If opening curly braces should exist on the same
   * line as their condition or be forced onto a new line.
   * (Allman style indentation).
   *
   * ---
   *
   * **Enabled**
   *
   * Below is an example when this option is set to `true` and each
   * object in the array starts on a newline.
   *
   * ```json
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
   * **Disabled**
   *
   * Below is an example when this option is set to `false` and
   * each object in the array starts curly braces inline.
   *
   * ```json
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
  braceAllman?: boolean,

  /**
   * **Default:** `false`
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
   * ```
   *
   * ---
   *
   * **Disabled**
   *
   * Below is an example when this option is set to `false`
   *
   * ```json
   * {
   *  "foo": {
   *   "bar": {
   *      "baz": 0
   *    }
   *   }
   * }
   * ```
   */
  bracePadding?: boolean,

  /**
   * **Default:** `default`
   *
   * Controls how arrays on objects are formatted. This rules will
   * determines if all array indexes should be indented, never indented,
   * or left to the default.
   *
   * **Options**
   *
   * - `default`
   *  Default formatting (default)
   *
   * - `indent`
   *  "Always indent each index of an array
   *
   * - `inline`
   *  Ensure all array indexes appear on a single line
   *
   * @default 'default'
   */
  arrayFormat?: 'default' | 'indent' | 'inline',

  /**
   * **Default:** `default`
   *
   * Controls how arrays on objects are formatted. We will exclude
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
  objectIndent?: 'default' | 'indent',
}

/* UNIVERSAL ---------------------------------- */

export interface Defs extends SharedOptions, MarkupOptions, StyleOptions, ScriptOptions {}

export interface Options extends SharedOptions {
  markup?: MarkupOptions;
  style?: StyleOptions;
  script?: ScriptOptions;
  json?: JSONOptions;
}

export interface Rules extends SharedOptions {
  markup: MarkupOptions;
  style: StyleOptions;
  script: ScriptOptions;
  json: JSONOptions;
}

export interface Language {
  /**
   * The language name in lowercase.
   */
  language: keyof LanguageProperNames
  /**
   * The lexer the language uses.
   */
  lexer: LexerNames;
  /**
   * The language proper name (used in reporting)
   */
  languageName: LanguageProperNames[Language['language']]
}

export interface Prettify {
  start: number;
  end: number;
  iterator: number;
  source: string;
  scopes: Scopes;
  mode: 'beautify' | 'parse'
  parsed?: Data;
  options?: Options;
  definitions?: Definitions;
  lexers: {
    style?(source: string): Data,
    markup?(source: string): Data,
    script?(source: string): Data,
  }
  beautify: {
    style?(options: Options): string,
    markup?(options: Options): string,
    script?(options: Options): string,
  },
}
