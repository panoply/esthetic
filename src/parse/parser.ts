/* eslint no-unmodified-loop-condition: "off" */

import { NIL, NWL } from '@utils/chars';
import { Lexers, Modes } from '@shared/enums';
import { ws } from '@utils/helpers';
import { getTagName } from '@utils/lexical';
import { lexers } from '../lexers';
import { format } from '../format';
import type {
  LanguageName,
  Syntactic,
  ParseStack,
  StackItem,
  Data,
  Record,
  Spacer,
  Splice,
  RulesInternal,
  Stats
} from 'types/internal';
import { getLexerName, getLexerType } from '@utils/maps';
import { LiteralUnion } from 'type-fest/source/literal-union';

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
   * Static reference of the provided source input
   */
  static source: string | Buffer = NIL;

  /**
   * Static reference to the current external region input
   */
  static region: string | string[] = NIL;

  /**
   * Static reference to the operation statisticals for reporting.
   */
  static stats: Stats = {
    chars: -1,
    time: '',
    size: '',
    language: ''
  };

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
   * The current line character number
   */
  public character: number = 0;

  /**
   * Stores the 'lines' value before the next token
   */
  public space: number = -1;

  /**
   * The current line number
   */
  public line = 1;

  /**
   * The offset index of the last known newline
   */
  public lineOffset = 0;

  /**
   * The offset index of the last known newline
   */
  public lexer: LiteralUnion<'script' | 'markup' | 'style', string>;

  /**
   * The formatting and parse rules
   */
  public rules: RulesInternal = {
    crlf: false,
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
      delimiterTrims: 'preserve',
      ignoreTagList: [],
      lineBreakSeparator: 'default',
      normalizeSpacing: true,
      preserveComment: false,
      quoteConvert: 'none',
      valueForce: 'intent'
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
      quoteConvert: 'none'
    },
    json: {
      correct: false,
      arrayFormat: 'default',
      braceAllman: false,
      bracePadding: false,
      objectIndent: 'default',
      objectSort: false,
      quoteConvert: 'double',
      endComma: 'never',
      noSemicolon: true,
      vertical: false
    },
    style: {
      correct: false,
      atRuleSpace: true,
      classPadding: false,
      noLeadZero: false,
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

  get stats (): Stats {

    return Parser.stats;

  }

  get source (): string {

    if (this.mode === Modes.Embed) return Parser.region as string;

    return this.env === 'node' && Buffer.isBuffer(Parser.source)
      ? Parser.source.toString()
      : Parser.source as string;
  }

  set source (source: string | Buffer) {

    Parser.source = this.env === 'node'
      ? Buffer.isBuffer(source) ? source : Buffer.from(source)
      : source;
  }

  /**
   * Reset
   *
   * Resets the current stores for clean parse structures
   */
  public reset () {

    this.error = NIL;
    this.count = -1;
    this.mode = Modes.Parse;
    this.data.begin = [];
    this.data.ender = [];
    this.data.lexer = [];
    this.data.lines = [];
    this.data.stack = [];
    this.data.token = [];
    this.data.types = [];
    this.references = [ [] ];
    this.stack = new Stack([ 'global', -1 ]);

    if (this.pairs.size > 0) this.pairs.clear();
    if (this.attributes.size > 0) this.attributes.clear();
    if (this.regions.size > 0) this.regions.clear();

  }

  /**
   * Full Parse
   *
   * Executes a full parse - top to bottom.
   */
  public full (lexer: Lexers, mode: Modes = Modes.Format) {

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

    this.space = 0;
    this.count = this.count + 1;

    if (record.lexer !== 'style' && structure.replace(/[{}@<>%#]/g, NIL) === NIL) {
      structure = record.types === 'else'
        ? 'else'
        : getTagName(record.token);
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
          this.space = 0;
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
        this.space = 0;
      }
    }
  }

  public spacer (args: Spacer): number {

    // * array - the characters to scan
    // * index - the index to start scanning from
    // * end   - the length of the array, to break the loop
    this.space = 1;

    do {

      if (args.array[args.index] === NWL) {
        this.space = this.space + 1;
        this.line = this.line + 1;
      }

      if (ws(args.array[args.index + 1]) === false) break;

      args.index = args.index + 1;

    } while (args.index < args.end);

    return args.index;

  }

};

export const parse = new Parser();
