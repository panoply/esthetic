import { Languages } from 'lexical/enum';
import { Types, LanguageOfficialName, LanguageName } from '../shared';
import { StackItem } from 'types/next';

export interface Scope {
  get token (): string;
  set token (token: string)
  get index (): number;
  set index (index: number)
}

/* -------------------------------------------- */
/* LEXING                                       */
/* -------------------------------------------- */

export interface VariableDeclarations {
  /**
   * Count reference
   */
  count: number[];
  /**
   * Index Reference
   */
  index: number[];
  /**
   * Word Stores
   */
  word: string[];
}

/* -------------------------------------------- */
/* DATA STRUCTURE                               */
/* -------------------------------------------- */

export interface IParseError {
  /**
   * The error message, to be thrown (combines all refs in this model)
   */
  message?: string;
  /**
   * Error details, holds more informative information about error
   */
  details?: string;
  /**
   * Snippet Error Code Sample
   */
  snippet?: string;
  /**
   * The parse error code enum reference
   */
  code?: number;
  /**
   * The error syntax Language (Proper Name)
   */
  language?: LanguageOfficialName;
  /**
   * The range based location of the error.
   */
  location?: {
    /**
     * The starting point of the error
     */
    start: {
      /**
       * The starting line number of the error
       */
      line: number;
      /**
       * Thestarting  character numer of the error
       */
      character: number;
      /**
       * The starting index offset of the error
       */
      offset: number;
    };
    end: {
      /**
       * The ending line number of the error
       */
      line: number;
      /**
       * The ending  character numer of the error
       */
      character: number;
      /**
       * The ending index offset of the error
       */
      offset: number;
    }
  };
}

/**
 * Parse Counter
 */
export interface Counter {
  end: number;
  start: number;
  index: number;
  line: number;
}

/**
 * Syntactical Tracking
 *
 * Maintains a reference of start and end type tokens
 * to be tracked ensuring opening and ending counts
 * match correctly. The data stored in this model is
 * used by the Parse Error logic.
 */
export interface Syntactic {
  line?: number;
  expect?: string;
  token?: string;
  stack?: string;
  type?: Languages
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
  types: Types[]
}

export interface Record {
  /**
   * The index where the current structure begins.
   * For tokens of type start this will refer to the parent
   * container or global scope.
   */
  begin: Data['begin'][number]
  /**
   * The index where the current structure ends. Unlike the
   * `begin` data a token of type end refers to itself.
   */
  ender: Data['ender'][number]
  /**
   * The type of rules use to scan and resolve the current token.
   */
  lexer: Data['lexer'][number]
  /**
   * Describes the white space immediate prior to the token's first
   * character. A value of `0` means no white space. A value of `1`
   * means some amount of whitespace not containing a new line character.
   * Values of `2` and greater indicate the 0 of new lines plus `1`.
   * For example, an empty line preceding the current token would mean a
   * value of `3`, because the white space would contain two new line characters.
   */
  lines: Data['lines'][number]
  /**
   * A description of the current structure represented by the
   * `begin` and `ender` data values.
   */
  stack: Data['stack'][number]
  /**
   * The atomic code fragment.
   */
  token: Data['token'][number]
  /**
   * A categorical description of the current token. Types are defined
   * in each markdown file accompanying a respective lexer file.
   */
  types: Types
}

type ParseHook = (this: {
  readonly line: number;
  readonly stack: StackItem;
  readonly language: LanguageName;
}, node: Record, index?: number) => void | Record

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
  start: number;
  begin: string;
  ender: string;
}

export interface LiquidInternal {
  /**
   * Pipes (Filters)
   *
   * A list of indexes which reference Liquid filter pipes:
   *
   * @example
   *
   * {{ object.prop | filter | filter }}
   *
   * // Indexes of the pipes will be stored
   */
  pipes: number[];
  /**
   * Filter Arguments
   *
   * A list of indexes which reference Liquid filter arguments. The
   * store is an array or arrays. Each entry holds the the indexes
   * of the `pipes[]` entry.
   *
   *
   * @example
   *
   * {{ object.prop | filter: arg_1: 'x', arg_2: 'xx' | filter: arg_1: 'x'  }}
   *
   * // Indexes of the arguments after the filter: parameter. The structure
   * // would describe it as follows:
   * //
   * // pipes[0]
   * // fargs[0][0] fargs[0][1]
   * //
   * // pipes[1]
   * // fargs[1][0]
   * //
   */
  fargs: number[][];
  /**
   * Tag Arguments
   *
   * A list of indexes which reference Liquid tag argument expression starting points
   *
   * @example
   *
   * {% tag, arg_1: 'foo', arg_2: 'bar' %}
   *
   * // Indexes of the args will be stores
   */
  targs: number[];
  /**
   * Logicals (Operators)
   *
   * A list of indexes which reference operator starting points
   *
   * @example
   *
   * {% if foo == bar and xx != tt or baz %}
   *
   * // Indexes of the "and" and the "or" operators are stored
   */
  logic: number[];
}

/**
 * Parse Scopes
 */
interface Scopes extends Array<[ string, number]>{
  [index: number]: [
    string,
    number
  ];
}

/* -------------------------------------------- */
/* PARSE HELPERS                                */
/* -------------------------------------------- */

export namespace Helper {

  /**
   * Utilities Helper for validating data structure types
   * in beautify parsing.
   */
  export interface Type {
    /**
     * Check whether the token type at specific index
     * equals the provided name. Returns a truthy.
     *
     * > Use `type.not()` for false comparisons.
     */
    is(index: number, name: Types): boolean;

    /**
     * Check whether the token type at specific index
     * does not equal the provided name. Returns a truthy.
     *
     * > Use `type.is()` for true comparisons.
     */
    not(index: number, name: Types): boolean;

    /**
     * Returns the `indexOf` a `data.types` name. This
     * is used rather frequently to determine the token
     * type we are dealing with.
     */
    idx(index: number, name: Types): number
  }

  /**
   * Utilities Helper for validating data structure tokens
   * in beautify parsing.
   */
  export interface Token {
    /**
     * Check whether the token equals the provided tag.
     * Returns a truthy.
     *
     * > Use `token.not()` for false comparisons.
     */
    is(index: number, tag: string): boolean;

    /**
     * Check whether the token does not equals the
     * provided tag. Returns a truthy.
     *
     * > Use `token.is()` for false comparisons.
     */
    not(index: number, tag: string): boolean;
  }

}
