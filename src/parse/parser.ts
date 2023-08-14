/* eslint no-unmodified-loop-condition: "off" */
import type {
  LanguageName,
  Syntactic,
  ParseStack,
  StackItem,
  Data,
  Record,
  Spacer,
  Splice,
  LexerName,
  Rules,
  Hooks
} from 'types';
import { lexers } from 'lexers';
import { format } from 'format';
import { Languages, Lexers, Modes } from 'lexical/enum';
import * as lx from 'lexical/lexing';
import * as rx from 'lexical/regex';
import { NIL, NWL } from 'chars';
import { getLexerName, getLexerType } from 'rules/language';
import { defaults } from 'rules/presets/default';
import { is, ns } from 'utils/helpers';
import { SyntacticError } from 'parse/errors';
import { ParseError } from 'lexical/errors';
import { config } from 'config';
import { cc } from 'lexical/codes';
import { object } from 'utils/native';

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
 * Class instance which holds reference to the parse table. This acts
 * as a mediator from which the lexers and formatters will communicate
 * with during the parse traversals and beautification cycles.
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

  /**
   *
   */
  static range: { lineNumber: number; depth: number };

  /**
   * Hooks
   *
   * Event Listeners which will trigger during traversal and the
   * formatting cycle. This is a future feature to allow consumers
   * to augment and adjust tokens.
   */
  public hooks: Hooks = { parse: null, format: null };

  /**
   * Hard coded line numbers
   */
  public numbers: number[] = [];

  /**
   * Reference to a starting index within the data structure. This is
   * used for external regions, but can also provide incremental support.
   */
  public start = 0;

  /**
   * Reference to a ender index within the data structure. This is
   * used for external regions, but can also provide incremental support.
   */
  public ender = 0;

  /**
   * A reference to `a` which holds index reference. This is not always identical
   * to the current index when lexing, instead it acts as a universal store
   * when specific position reference indexes need to be referred.
   */
  public iterator = 0;

  /**
   * An extended array implementation for working with the stack
   */
  public stack: Stack;

  /**
   * Reference of attributes of newline values with containing Liquid block tokens.
   * It maintains a store which is generated in the markup lexer and used within
   * the beautification cycle
   */
  public attributes: Map<number, boolean> = new Map();

  /**
   * External language regions, typically embedded tokens which use a different
   * lexer. This map maintains stores during the lexing process for switching.
   */
  public regions: Map<number, { id: LanguageName, lexer: Lexers }> = new Map();

  /**
   * Holds a store reference to markup start/end pairs. This is used for potential
   * parse errors and keeps track of paired sequences for syntactic reporting.
   */
  public pairs: { [index: number]: Syntactic } = object(null);

  /**
   * Parse Error reference. Defaults to `null` and will be assigned an object reference exception
   */
  public error: string = null;

  /**
   * Hardcoded string reference to CRLF rule
   */
  public crlf = NWL;

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
   * The current line number. Line numbers start at index `1` instead of `0`,
   * which is something to keep in mind if referencing. This is used in errors
   * and counts the number of lines as we have spanned during traversal. For example:
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
   * The current line depth. This keep a reference to the indentation
   * depth currently traversed and used to capture the left most indent level.
   *
   * ```
   *
   * 1 | <div>        // 2
   * 2 | <ul>         // 4
   * 3 | <li>         // 6
   * 4 | {{ HERE }}   // 8
   * 5 | </li>        // 6
   * 6 | </ul>        // 4
   * 7 | </div>       // 2
   *
   * ```
   *
   * In the example above, it is assumed that `indentChar` is set to a value
   * of `2` (default). For every `start` token, the depth increases.
   */
  public lineDepth: number = 2;

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
  public lineOffset: number = 0;

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
  public lexer: LexerName;

  /**
   * The formatting and parse rules
   */
  public rules: Rules = defaults;

  /**
   * The parse table data structure
   */
  public data: Data = {
    begin: [],
    ender: [],
    lexer: [],
    lines: [],
    stack: [],
    token: [],
    types: []
  };

  /**
   * The document source `input` reference
   */
  get source (): string {

    if (this.mode === Modes.Embed) return Parser.region as string;

    return config.env === 'node' && Buffer.isBuffer(Parser.input)
      ? Parser.input.toString()
      : Parser.input as string;
  }

  /**
   * Set the source `input` reference
   */
  set source (source: string | Buffer) {

    Parser.input = config.env !== 'node'
      ? source
      : Buffer.isBuffer(source)
        ? source
        : Buffer.from(source);

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

    this.error = null;
    this.count = -1;
    this.start = 0;
    this.ender = 0;
    this.lineColumn = 0;
    this.lineNumber = 1;
    this.lineDepth = 2;
    this.lineIndex = 0;
    this.lineOffset = 0;
    this.numbers = [];
    this.data.begin = [];
    this.data.ender = [];
    this.data.lexer = [];
    this.data.lines = [];
    this.data.stack = [];
    this.data.token = [];
    this.data.types = [];
    this.references = [ [] ];
    this.stack = new Stack([ 'global', -1 ]);
    this.mode = Modes.Parse;
    this.pairs = object(null);

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

    if (rx.CommIgnoreFile.test(this.source)) return this.source;

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

      if (this.regions.size === 0) return this.source;

      const { id, lexer } = this.regions.get(this.start);

      this.mode = Modes.Embed;
      this.language = id;
      this.rules.indentLevel = ref as number;

      const beautify = format(lexer);

      this.mode = Modes.Format;
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
      data.lexer[a] === 'style' && (
        this.rules.style.sortProperties ||
        this.rules.style.sortSelectors
      )
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
      //
      return;

    }

    do {

      if (data.begin[a] === begin || (
        data.begin[data.begin[a]] === begin &&
        data.types[a].indexOf('attribute') > -1 &&
        data.types[a].indexOf('attribute_end') < 0)) {

        data.ender[a] = this.count;

      } else {

        a = data.begin[a];

      }

      a = a - 1;

    } while (a > begin);

    if (a > -1) data.ender[a] = this.count;

  };

  /**
   * Syntactical Tracking
   *
   * This is a store The `parse.data.begin` index. This will typically
   * reference the `parse.count` value, incremented by `1`
   */
  public syntactic (record: Record, stack: string) {

    if (record.types === 'liquid_start' || record.types === 'start') {

      this.pairs[this.count] = {
        index: this.count,
        line: this.lineNumber,
        token: record.token,
        skip: false,
        type: record.types === 'start' ? Languages.HTML : Languages.Liquid,
        stack
      };

    } else if (this.stack.index in this.pairs && (
      record.types === 'end' ||
      record.types === 'liquid_end'
    )) {

      const pair = this.pairs[this.stack.index];

      if (pair.skip) {
        delete this.pairs[this.stack.index];
      }

      if (pair.type === Languages.Liquid) {

        if (record.token.indexOf(`end${pair.stack}`) > -1) {

          delete this.pairs[this.stack.index];

        } else {

          // TODO:
          // IMPROVE LIQUID TAG HANDLING
          //
          if (record.stack === 'liquid' && (record.token === '%}' || record.token === '-%}')) {
            delete this.pairs[this.stack.index];
          } else {
            SyntacticError(ParseError.MissingLiquidEndTag, pair);
          }
        }

      } else if (pair.type === Languages.HTML) {

        if (`</${pair.stack}>` === record.token) {
          delete this.pairs[this.stack.index];
        } else {
          SyntacticError(ParseError.MissingHTMLEndTag, pair);
        }

      }

    }

  }

  /**
   * Replace Record
   *
   * Replaces a single record at the provided index. If no index is
   * passed it will use the last known record reference.
   */
  public replace (record: Partial<Record>, index = this.count) {

    for (const entry in record) this.data[entry][index] = record[entry];

  }

  /**
   * Push Structure
   *
   * An extension of `Array.prototype.push` to work across the parse table data structure
   */
  public push (data: Data, record: Record, token: string = NIL) {

    data.begin.push(record.begin);
    data.ender.push(record.ender);
    data.lexer.push(record.lexer);
    data.stack.push(record.stack);
    data.token.push(record.token);
    data.types.push(record.types);
    data.lines.push(record.lines);

    this.numbers.push(this.lineNumber);

    if (data !== this.data) return;

    this.count = this.count + 1;

    if (record.lexer !== 'style' && token.replace(/[{}<>%]/g, NIL) === NIL) {
      token = record.types === 'else'
        ? 'else'
        : lx.getTagName(record.token);
    }

    if (
      record.lexer === 'markup' &&
      record.stack !== 'liquid' &&
      record.stack !== 'svg') {

      //  this.syntactic(record, token);

    }

    this.lineOffset = 0;

    if (record.types === 'start' || record.types.indexOf('_start') > 0) {

      this.stack.push([ token, this.count ]);
      this.lineDepth = this.lineDepth + this.rules.indentSize;

    } else if (record.types === 'end' || record.types.indexOf('_end') > 0) {

      // This big condition fixes language specific else blocks that
      // are children of start/end blocks not associated with the if/else chain

      /**
       * Holds reference to the data structures `ender` index
       */
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
      this.lineDepth = this.lineDepth - this.rules.indentSize;

    } else if (record.types === 'else' || record.types.indexOf('_else') > 0) {

      if (token === NIL) token = 'else';

      if (this.count > 0 && (
        data.types[this.count - 1] === 'start' ||
        data.types[this.count - 1].indexOf('_start') > 0
      )) {
        this.stack.push([ token, this.count ]);
      } else {
        this.final(data);
        this.stack.update(token === NIL ? 'else' : token, this.count);
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

    this.numbers.pop();

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

    if (splice.record !== undefined && splice.record.token !== NIL) {

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

  /**
   * Is Checksum
   *
   * Checks a record value on the last know entry in the
   * parse table data strcuture
   */
  public is<T extends keyof Record> (prop: T, value: Record[T]) {

    return this.count > 0 ? this.data[prop][this.count] === value : false;

  }

  /**
   * Line Increment
   *
   * A small helper for incrementing newlines. Expects an `index` which
   * matches the current iteration point and an optional `lines` parameter
   * which will be incremented by `1` and the returning value.
   */
  public lines (index: number, lines?: number) {

    this.lineNumber = this.lineNumber + 1;
    this.lineIndex = index;

    return lines + 1;

  }

  public spacer (args: Spacer): number {

    this.lineOffset = 1;

    do {

      if (is(args.array[args.index], cc.NWL)) {
        this.lineIndex = args.index;
        this.lineOffset = this.lineOffset + 1;
        this.lineNumber = this.lineNumber + 1;
      }

      if (ns(args.array[args.index + 1])) break;

      args.index = args.index + 1;

    } while (args.index < args.end);

    return args.index;

  }

};

export const parse = new Parser();
