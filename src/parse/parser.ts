/* eslint no-unmodified-loop-condition: "off" */
import { lexers } from 'lexers';
import { format } from 'format';
import { Lexers, Modes } from 'lexical/enum';
import * as lx from 'lexical/lexing';
import { NIL, NWL } from 'chars';
import { getLexerName, getLexerType, assign, ws } from 'utils';
import type { LiteralUnion } from 'type-fest';
import type {
  LanguageName,
  Syntactic,
  ParseStack,
  StackItem,
  Data,
  Record,
  Spacer,
  Splice,
  Rules,
  JSONRules,
  ScriptRules
} from 'types/internal';

/**
 * Parse Stack
 *
 * An extended array implementation for working with the `parse.stack` stock.
 */
export class Stack extends Array<StackItem> implements ParseStack {

  get entry () { return this[this.length - 1]; }
  get token () { return this[this.length - 1][0]; }
  get index () { return this[this.length - 1][1]; }

  update (token: string | number, index?: number) {

    const i = this.length - 1;

    if (i > 0) {
      if (index === undefined) {

        if (typeof token === 'string') {
          this[i][0] = token;
        } else {
          this[i][1] = token;
        }
      } else {
        this[i][0] = token as string;
        this[i][1] = index;
      }

      return this[i];

    } else {
      this.push([ token as string, index ]);
      return this[i + 1];
    }

  }

  pop () {

    const i = this.length - 1;
    const x = this[i];

    if (i > 0) this.splice(i, 1);

    return x;
  }

}

/**
 * Parse Store
 *
 * Class instance which holds reference to all data structures.
 */
class Parser {

  /**
   * Static reference of the provided input
   */
  static input: string | Buffer = NIL;

  /**
   * Static reference to the current external region input
   */
  static region: string | string[] = NIL;

  public hooks: {
    /**
     * The before formatting hooks
     */
    parse?: ((this: {
      readonly line: number;
      readonly stack: StackItem;
      readonly language: LanguageName;
    }, node: Record, index?: number) => void | Record)[];

    /**
     * The before formatting hooks
     */
    format?: ((this: {
      readonly record: Record;
      readonly language: LanguageName;
      readonly levels: number[];
      readonly structure: string[]
    }, token: string, level?: number) => void | {
      token?: string;
      level?: number
    })[];

  } = { parse: null, format: null };

  /**
   * The current environment runing within.
   */
  public env = typeof process !== 'undefined' && process.versions != null ? 'node' : 'browser';

  /**
   * Reference to a starting index within the data structure. This is typically
   * used for external regions, but can also provide incremental support.
   */
  public start = 0;

  /**
   * Reference to a ender index within the data structure. This is typically
   * used for external regions, but can also provide incremental support.
   */
  public ender = 0;

  /**
   * Reference to a
   */
  public iterator = 0;

  public scopes: any = [];

  /**
   * An extended array implementation for working with the
   */
  public stack: Stack;

  /**
   * Reference of attributes of new line values with containing Liquid block tokens.
   * It maintains a store which is generated in the markup lexer and used within the beautify process.
   */
  public attributes: Map<number, boolean> = new Map();

  /**
   * External language regions, typically embedded tokens which use a different lexer. This
   * map maintains stores during the lexing process for switching.
   */
  public regions: Map<number, { id: LanguageName, lexer: Lexers }> = new Map();

  /**
   * Holds a store reference to markup start/end pairs. This is used for potential parse errors and
   * keeps track of paired sequences for syntactic reporting.
   */
  public pairs: Map<number, Syntactic> = new Map();

  public error: string = NIL;

  /**
   * Hardcoded string reference to CRLF rule
   */
  public crlf = '\n';

  /**
   * The current operation mode running
   */
  public mode: Modes;

  /**
   * The language name indentifiable
   */
  public language: LanguageName;

  /**
   * Stores the declared variable names for the script lexer. This must be stored outside
   * the script lexer since some languages recursive use of the script lexer
   */
  public references = [ [] ];

  /**
   * Stores the final index location of the data arrays
   */
  public count: number = -1;

  /**
   * The current line column character starting from left side of the
   * beginning of a newline. For example
   *
   * ```
   *
   * 1 | xxx
   * 2 | hello world
   *               ^   // Column 11
   *
   * ```
   *
   * In the example above, the column reference equals `[11]` and points
   * to the letter `d` in cases where we need this context, it exists
   * at this point.
   */
  public lineColumn: number = 0;

  /**
   * The current line number. This is used in errors and counts the
   * number of lines as we have spaned during traversal. For example:
   *
   * ```
   *
   * 1 | hello  // Line 1
   * 2 | world  // Line 2
   *
   *
   * ```
   */
  public lineNumber: number = 1;

  /**
   * The record `lines` value count before the next token, for example:
   *
   * ```
   *
   * 1 | foo  // line offset is: 0
   * 2 | bar  // line offset is: 2
   * 3
   * 4 | baz  // line offset is: 3
   * 5
   * 6
   * 7 | qux  // line offset is: 4
   * 8 | xxx  // line offset is: 2
   *
   *
   * ```
   *
   * Where `foo` is `0` as it exists on line `1` but `bar` is `2` because
   * it counts line `1` as a single line and given it exists on line `2`
   * another line offset increment is applies. The word `baz` is similar to
   * `bar` but has a count of `3` given a newline exists above it and this
   * pattern follows as we progress to `qux` which has 2 newlines, equating
   * to a value line offset of `4` whereas `xxx` only has `2` so on and so forth.
   */
  public lineOffset: number = 1;

  /**
   * The character index of the last known newline, for example:
   *
   * ```
   *
   * 1 | abcdefgh
   * 2 | ijklmnop
   *     ^
   *
   * ```
   *
   * Where character `i` is index `[8]` and index `[8]` is the
   * beginning of line `2`.
   *
   */
  public lineIndex: number = 0;

  /**
   * The offset index of the last known newline
   */
  public lexer: LiteralUnion<'script' | 'markup' | 'style', string>;

  /**
   * The formatting and parse rules
   */
  public rules: Rules = {
    crlf: false,
    defaults: 'none',
    language: 'auto',
    endNewline: false,
    indentChar: ' ',
    indentLevel: 0,
    indentSize: 2,
    preserveLine: 2,
    wrap: 0,
    liquid: {
      commentNewline: false,
      commentIndent: true,
      correct: false,
      delimiterTrims: 'preserve',
      ignoreTagList: [],
      indentAttributes: false,
      lineBreakSeparator: 'default',
      normalizeSpacing: true,
      preserveComment: false,
      quoteConvert: 'none'
    },
    markup: {
      attributeCasing: 'preserve',
      attributeSort: false,
      attributeSortList: [],
      correct: false,
      commentNewline: false,
      commentIndent: true,
      delimiterForce: false,
      forceAttribute: 3,
      forceLeadAttribute: true,
      forceIndent: false,
      ignoreCSS: false,
      ignoreJS: true,
      ignoreJSON: false,
      preserveComment: false,
      preserveText: false,
      preserveAttributes: false,
      selfCloseSpace: true,
      selfCloseSVG: true,
      stripAttributeLines: false,
      quoteConvert: 'none'
    },
    json: assign<JSONRules, ScriptRules, ScriptRules>({
      arrayFormat: 'default',
      braceAllman: false,
      bracePadding: false,
      objectIndent: 'default',
      objectSort: false
    }, {
      braceStyle: 'none',
      caseSpace: false,
      commentIndent: false,
      commentNewline: false,
      correct: false,
      elseNewline: false,
      endComma: 'never',
      functionNameSpace: false,
      functionSpace: false,
      methodChain: 4,
      neverFlatten: false,
      noCaseIndent: false,
      noSemicolon: false,
      preserveComment: false,
      quoteConvert: 'none',
      styleGuide: 'none',
      ternaryLine: false,
      variableList: 'none',
      vertical: false
    }, {
      quoteConvert: 'double',
      endComma: 'never',
      noSemicolon: true,
      vertical: false
    }),
    style: {
      commentIndent: false,
      commentNewline: false,
      correct: false,
      atRuleSpace: true,
      classPadding: false,
      noLeadZero: false,
      preserveComment: false,
      sortSelectors: false,
      sortProperties: false,
      quoteConvert: 'none'
    },
    script: {
      arrayFormat: 'default',
      braceNewline: false,
      bracePadding: false,
      braceStyle: 'none',
      braceAllman: false,
      caseSpace: false,
      commentIndent: false,
      commentNewline: false,
      correct: false,
      elseNewline: false,
      endComma: 'never',
      functionNameSpace: false,
      functionSpace: false,
      methodChain: 4,
      neverFlatten: false,
      noCaseIndent: false,
      noSemicolon: false,
      objectSort: false,
      objectIndent: 'default',
      preserveComment: false,
      quoteConvert: 'none',
      styleGuide: 'none',
      ternaryLine: false,
      variableList: 'none',
      vertical: false
    }
  };

  public data: Data = {
    begin: [],
    ender: [],
    lexer: [],
    lines: [],
    stack: [],
    token: [],
    types: []
  };

  get source (): string {

    if (this.mode === Modes.Embed) return Parser.region as string;

    return this.env === 'node' && Buffer.isBuffer(Parser.input)
      ? Parser.input.toString()
      : Parser.input as string;
  }

  set source (source: string | Buffer) {

    Parser.input = this.env === 'node'
      ? Buffer.isBuffer(source) ? source : Buffer.from(source)
      : source;
  }

  get current () {

    return {
      begin: this.data.begin[this.count],
      ender: this.data.ender[this.count],
      lexer: this.data.lexer[this.count],
      lines: this.data.lines[this.count],
      stack: this.data.stack[this.count],
      token: this.data.token[this.count],
      types: this.data.types[this.count]
    };
  }

  /**
   * Reset
   *
   * Resets the current stores for clean parse structures
   */
  public reset () {

    this.error = NIL;
    this.count = -1;
    this.start = 0;
    this.ender = 0;
    this.mode = Modes.Parse;
    this.data.begin = [];
    this.data.ender = [];
    this.data.lexer = [];
    this.data.lines = [];
    this.data.stack = [];
    this.data.token = [];
    this.data.types = [];
    this.references = [ [] ];
    this.scopes = [];
    this.stack = new Stack([ 'global', -1 ]);

    if (this.pairs.size > 0) this.pairs.clear();
    if (this.attributes.size > 0) this.attributes.clear();
    if (this.regions.size > 0) this.regions.clear();

  }

  /**
   * Get Record
   *
   * Returns a record at the give index
   */
  public get (index: number) {

    return {
      begin: this.data.begin[index],
      ender: this.data.ender[index],
      lexer: this.data.lexer[index],
      lines: this.data.lines[index],
      stack: this.data.stack[index],
      token: this.data.token[index],
      types: this.data.types[index]
    };

  }

  /**
   * Document Parse
   *
   * Executes a full parse - top to bottom.
   */
  public document (lexer: Lexers, mode: Modes = Modes.Format) {

    this.reset();

    lexers(lexer);

    if (mode === Modes.Parse) return this.data;

    this.mode = Modes.Format;

    return format(lexer);

  }

  /**
   * Switch
   *
   * Used to switch between lexers and formatters when
   * dealing with embedded regions.
   */
  public external (ref: LanguageName | number, input?: string | string[]) {

    if (this.mode === Modes.Parse) {

      this.mode = Modes.Embed;

      const lexer = getLexerType(ref as LanguageName);

      Parser.region = input;

      this.language = ref as LanguageName;
      this.lexer = getLexerName(this.language);
      this.regions.set(this.count + 1, { lexer, id: this.language });

      lexers(lexer);

      this.mode = Modes.Parse;
      this.lexer = getLexerName(this.rules.language);
      this.language = this.rules.language;

    } else {

      const { id, lexer } = this.regions.get(this.start);

      this.language = id;
      this.rules.indentLevel = ref as number;

      const beautify = format(lexer);

      this.rules.indentLevel = 0;
      this.language = this.rules.language;
      this.lexer = getLexerName(this.language);

      return beautify;
    }

  }

  /**
   * Push Final
   *
   * The final conclusion for the data strucuture uniform.
   */
  private final (data: Data) {

    let a = this.count;

    const begin = data.begin[a];

    if ((
      data.lexer[a] === 'style' &&
      this.rules.style.sortProperties
    ) || (
      data.lexer[a] === 'script' && (
        this.rules.script.objectSort ||
        this.rules.json.objectSort
      )
    )) {

      // Sorting can result in a token whose begin value is greater than either
      // its current index or the index of the end token, which results in
      // an endless loop. These end values are addressed at the end of
      // the "parser" function with this.sortCorrection
      return;

    }

    do {

      if (data.begin[a] === begin || (
        data.begin[data.begin[a]] === begin &&
        data.types[a].indexOf('attribute') > -1 &&
        data.types[a].indexOf('attribute_end') < 0
      )) {

        data.ender[a] = this.count;

      } else {

        a = data.begin[a];

      }

      a = a - 1;

    } while (a > begin);

    if (a > -1) data.ender[a] = this.count;

  };

  /**
   * Push Structure
   *
   * An extension of `Array.prototype.push` to work across the data structure
   */
  public push (data: Data, record: Record, structure: string = NIL) {

    // parse_push_datanames
    data.begin.push(record.begin);
    data.ender.push(record.ender);
    data.lexer.push(record.lexer);
    data.stack.push(record.stack);
    data.token.push(record.token);
    data.types.push(record.types);
    data.lines.push(record.lines);

    if (data !== this.data) return;

    this.lineOffset = 0;
    this.count = this.count + 1;

    if (record.lexer !== 'style' && structure.replace(/[{}@<>%#]/g, NIL) === NIL) {
      structure = record.types === 'else'
        ? 'else'
        : lx.getTagName(record.token);
    }

    if (record.types === 'start' || record.types.indexOf('_start') > 0) {

      this.stack.push([ structure, this.count ]);

    } else if (record.types === 'end' || record.types.indexOf('_end') > 0) {

      // This big condition fixes language specific else blocks that
      // are children of start/end blocks not associated with
      // the if/else chain

      let ender: number = 0;

      /**
       * Cached reference of `this.stack` for minor optimisations
       */
      const length = this.stack.length;

      if (length > 2 && (
        data.types[this.stack[length - 1][1]] === 'else' ||
        data.types[this.stack[length - 1][1]].indexOf('_else') > 0
      ) && (
        data.types[this.stack[length - 2][1]] === 'start' ||
        data.types[this.stack[length - 2][1]].indexOf('_start') > 0
      ) && (
        data.types[this.stack[length - 2][1] + 1] === 'else' ||
        data.types[this.stack[length - 2][1] + 1].indexOf('_else') > 0
      )) {

        this.stack.pop();

        data.begin[this.count] = this.stack.index;
        data.stack[this.count] = this.stack.token;
        data.ender[this.count - 1] = this.count;

        ender = data.ender[data.begin[this.count] + 1];

      }

      this.final(data);

      if (ender > 0) data.ender[data.begin[this.count] + 1] = ender;

      this.stack.pop();

    } else if (record.types === 'else' || record.types.indexOf('_else') > 0) {

      if (structure === NIL) structure = 'else';
      if (this.count > 0 && (
        data.types[this.count - 1] === 'start' ||
        data.types[this.count - 1].indexOf('_start') > 0
      )) {

        this.stack.push([ structure, this.count ]);

      } else {
        this.final(data);
        this.stack.update(structure === NIL ? 'else' : structure, this.count);

      }
    }

    if (this.hooks.parse !== null) {

      this.hooks.parse[0].call({
        line: this.lineNumber,
        stack: this.stack.entry,
        language: this.language
      }, record, this.count);
    }

  }

  /**
   * Pop Structure
   *
   * An extension of `Array.prototype.pop` to work across the data
   * structure
   */
  public pop (data: Data): Record {

    if (data === this.data) this.count = this.count - 1;

    return {
      begin: data.begin.pop(),
      ender: data.ender.pop(),
      lexer: data.lexer.pop(),
      lines: data.lines.pop(),
      stack: data.stack.pop(),
      token: data.token.pop(),
      types: data.types.pop()
    };

  }

  /**
   * Concat Structure
   *
   * An extension of `Array.prototype.concat` to work across
   * the data structure. This is an expensive operation.
   */
  public concat (data: Data, record: Data) {

    // parse_push_datanames
    data.begin = data.begin.concat(record.begin);
    data.ender = data.ender.concat(record.ender);
    data.lexer = data.lexer.concat(record.lexer);
    data.stack = data.stack.concat(record.stack);
    data.token = data.token.concat(record.token);
    data.types = data.types.concat(record.types);
    data.lines = data.lines.concat(record.lines);

    if (data === this.data) this.count = data.token.length - 1;
  }

  /**
   * Splice Structure
   *
   * An extension of `Array.prototype.splice` to work across the data structure
   */
  public splice (splice: Splice) {

    const begin = this.data.begin[this.count];
    const token = this.data.token[this.count];

    // * data    - The data object to alter
    // * howmany - How many indexes to remove
    // * index   - The index where to start
    // * record  - A new record to insert
    if (splice.record !== undefined && splice.record.token !== NIL) {

      // parse_splice_datanames
      splice.data.begin.splice(splice.index, splice.howmany, splice.record.begin);
      splice.data.ender.splice(splice.index, splice.howmany, splice.record.ender);
      splice.data.token.splice(splice.index, splice.howmany, splice.record.token);
      splice.data.lexer.splice(splice.index, splice.howmany, splice.record.lexer);
      splice.data.stack.splice(splice.index, splice.howmany, splice.record.stack);
      splice.data.types.splice(splice.index, splice.howmany, splice.record.types);
      splice.data.lines.splice(splice.index, splice.howmany, splice.record.lines);

      if (splice.data === this.data) {

        this.count = (this.count - splice.howmany) + 1;
        if (begin !== this.data.begin[this.count] || token !== this.data.token[this.count]) {
          this.lineOffset = 0;
        }
      }

    } else {

      splice.data.begin.splice(splice.index, splice.howmany);
      splice.data.ender.splice(splice.index, splice.howmany);
      splice.data.token.splice(splice.index, splice.howmany);
      splice.data.lexer.splice(splice.index, splice.howmany);
      splice.data.stack.splice(splice.index, splice.howmany);
      splice.data.types.splice(splice.index, splice.howmany);
      splice.data.lines.splice(splice.index, splice.howmany);

      if (splice.data === this.data) {
        this.count = this.count - splice.howmany;
        this.lineOffset = 0;
      }
    }
  }

  public spacer (args: Spacer): number {

    // * array - the characters to scan
    // * index - the index to start scanning from
    // * end   - the length of the array, to break the loop
    this.lineOffset = 1;

    do {

      if (args.array[args.index] === NWL) {
        this.lineOffset = this.lineOffset + 1;
        this.lineNumber = this.lineNumber + 1;
      }

      if (ws(args.array[args.index + 1]) === false) break;

      args.index = args.index + 1;

    } while (args.index < args.end);

    return args.index;

  }

};

export const parse = new Parser();
