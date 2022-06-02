
import { PrettyDiffOptions } from './prettydiff';

type languageAuto = [
  string,
  string,
  string
];

type lexers = 'markup' | 'script' | 'style';

type lexerArray = Array<lexers>;

export const enum StyleTypes {
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

export const enum ScriptTypes {
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
   * A collection of characters that comprise a JavaScript keyword or
   * reference not explicitly declared in the code sample. This parser is
   * less strict than a JavaScript compiler in that it does not, at this time,
   * trap certain extended UTF8 control characters that aren't valid in identifiers.
   */
  word = 'word',
}

export const enum MarkupTypes {
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
 * Addition markup types
 */
export const enum ExtraTypes {
  else = 'else',
  mixin = 'mixin',
  comment = 'comment',
  'content-ignore' = 'content-ignore'
}

/**
 * Token Types
 */
export type Types = `${MarkupTypes | ExtraTypes | ScriptTypes | StyleTypes}`

/**
 * HTML block types (used in markup lexer)
 *
 * > I am unsure what this actually equates too,
 * the type is defined here for convenience sake
 */
export type HTMLBlocks = (
 | 'body'
 | 'colgroup'
 | 'dd'
 | 'dt'
 | 'head'
 | 'html'
 | 'li'
 | 'option'
 | 'p'
 | 'tbody'
 | 'td'
 | 'tfoot'
 | 'th'
 | 'thead'
 | 'tr'
)

/**
 * HTML void types (used in markup lexer)
 *
 * > I am unsure what this actually equates too,
 * the type is defined here for convenience sake
 */
export type HTMLVoids = (
 | 'area'
 | 'base'
 | 'basefont'
 | 'br'
 | 'col'
 | 'embed'
 | 'eventsource'
 | 'frame'
 | 'hr'
 | 'image'
 | 'img'
 | 'input'
 | 'isindex'
 | 'keygen'
 | 'link'
 | 'meta'
 | 'param'
 | 'progress'
 | 'source'
 | 'wbr'
)

/**
 * Parsed
 */
export interface Parsed {
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

interface Lexers { [key:string]: (source: string, rules?:any) => Parsed; }

interface option {
  default: boolean | number | string;
  definition: string;
  label: string;
  lexer: Array<'all'> | lexerArray;
  type: 'boolean' | 'number' | 'string';
  values?: {
    [key: string]: string;
  }
}

export interface IRecord {
  begin: Parsed['begin'][number]
  ender: Parsed['ender'][number]
  lexer: Parsed['lexer'][number]
  lines: Parsed['lines'][number]
  stack: Parsed['stack'][number]
  token: Parsed['token'][number]
  types: `${Types}`
}

interface spacer {
  array: string[];
  end : number;
  index: number;
}

interface splice {
  data: Parsed;
  howmany: number;
  index: number;
  record?: IRecord;
}

interface wrapConfig {
  chars: string[];
  end: number;
  lexer: string;
  opening: string;
  start: number;
  terminator: string;
}

interface SparserSharedOptions {
  readonly format?: 'arrays';
  attemptCorrection?: boolean;
  crlf?: boolean;
  preserveComment?: boolean;
  lexer?: 'markup' | 'script' | 'style';
  quoteConvert?: 'none' | 'double' | 'single';
  wrap?: number;
}

export interface SparserMarkupOptions extends SparserSharedOptions {
  attributeSort?: boolean;
  attributeSortList?: string[];
  language?: 'html' | 'jsx' | 'tsx' | 'xml';
  lexer?: 'markup';
  parseSpace?: boolean;
  preserveAttributes?: boolean;
  preserveComment?: boolean;
  preserveText?: boolean;
  tagMerge?: boolean;
  tagSort?: boolean;
}

export interface SparserScriptOptions extends SparserSharedOptions {
  endComma?: 'always' |'never' |'none';
  language?: 'javascript' | 'typescript' | 'json';
  objectSort?: boolean;
  variableList?: 'each' | 'list' | 'none';
}

export interface SparserStyleOptions extends SparserSharedOptions {
  language?: 'css' | 'scss';
  lexer?: 'style';
  noLeadZero?: boolean;
  objectSort?: boolean;
}

export interface SparserOptions extends PrettyDiffOptions {
  format?: 'arrays';
  lexerOptions: {
    markup?:SparserMarkupOptions
    script?: SparserScriptOptions
    style?: SparserStyleOptions
  }
}

export interface Language {
  auto(sample: string, defaultLang: string): languageAuto;
  nameproper(input : string): string;
  setlexer(input : string): string;
}

export interface OptionDef {
  [key:string]: option;
}

export interface Parse {
  /**
   * Stores the final index location of the data arrays
   */
  parse?: Parse;
  /**
   * An extension of `Array.prototype.concat` to work across
   * the data structure. This is an expensive operation.
   */
  concat(data: Parsed, array: Parsed): void;
  /**
   * Stores the final index location of the data arrays
   */
  count: number;
  /**
   * Stores the various data arrays of the parse table
   */
  data: Parsed;
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
   * The function that sorts object properties
   */
  objectSort(data: Parsed): void;
  /**
   * An extension of `Array.prototype.pop` to work across the data structure
   */
  pop(data: Parsed): IRecord;
  /**
   * An extension of `Array.prototype.push` to work across the data structure
   */
  push(data: Parsed, record: IRecord, structure: string): void;
  /**
   * Stores the declared variable names for the script lexer.
   * This must be stored outside the script lexer since some languages
   * recursive use of the script lexer
   */
  references: string[][];
  /**
   * A custom sort tool that is a bit more intelligent and
   * multidimensional than `Array.prototype.sort`
   */
  safeSort(array: any[], operation: string, recursive: boolean): any[];
  /**
   * This functionality provides corrections to the `begin` and `ender` values after use of objectSort
   */
  sortCorrection(start: number, end: number): void;
  /**
   * A simple tool to take note of whitespace between tokens parseSpacer
   */
  spacer(args: spacer): number;
  /**
   * An extension of `Array.prototype.splice` to work across the data structure
   */
  splice(spliceData: splice): void;
  /**
   * Stores the stack and begin values by stacking depth
   */
  structure: Array<[string, number]>;
  /**
   * Parsing block comments and simultaneously applying word wrap
   */
  wrapCommentBlock(config: wrapConfig): [string, number];
  /**
   * Parsing block comments and applying word wrap
   */
  wrapCommentLine(config: wrapConfig): [string, number];
}

export interface Sparser {
  lexers?: Lexers;
  libs?: { [key: string]: any };
  options?: SparserOptions
  parse?: Parse;
  parser?(): Parsed;
  parseError?: string;
  version?: {
    date: string;
    number: string;
  };
}
