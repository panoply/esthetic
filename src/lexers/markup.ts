import type { LanguageName, LiquidInternal, Record, Types } from 'types/index';

import { COM, DQO, NIL, NWL, SQO, WSP } from 'chars';
import { CommentBlock } from 'comments';
import { cc } from 'lexical/codes';
import { CommentType, Equipoise, Languages, LiquidTag, Token } from 'lexical/enum';
import { ParseError } from 'lexical/errors';
import * as lq from 'lexical/liquid';
import * as regex from 'lexical/regex';
import { MarkupError, SyntacticError } from 'parse/errors';
import * as external from 'parse/external';
import { grammar } from 'parse/grammar';
import { parse } from 'parse/parser';
import { sortAttrs } from 'parse/sorting';
import * as u from 'utils/helpers';
import { assign, object } from 'utils/native';
import { LiquidStore, SVGStore } from 'utils/stores';

export function markup (input?: string) {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /** Deconstructed parser references */
  const { data, rules } = parse;

  /** Source string, typically {@link parse.source}, unless {@link input} parameter was passed */
  const source: string = input || parse.source;

  /** Set reference of ignored liquid tags as per {@link rules.ignoreTagList} */
  const ignored: Set<string> = new Set(rules.ignoreTagList);

  /** The document source split into a `string[]` array of characters */
  const b: readonly string[] = u.isArray(source) ? source : source.split(NIL);

  /** The length of the document source, i.e, the total number of characters in {@link b} */
  const c: number = b.length;

  /** SVG Store reference for tracking singletons and blocks */
  const svg: ReturnType<typeof SVGStore> = SVGStore();

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /** Advancement reference, this represents a character index in {@link b} */
  let a: number = 0;

  /** Language name reference, typically an external tag language */
  let language: LanguageName;

  /** Whether or not we handling an embedded type tag, e.g, `<script>` or `{% schema %}` etc */
  let embed: boolean = false;

  /** Stack nesting of Liquid tokens - incremented by `1` for each opener and decrements for each ender. */
  let within: number = 0;

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

  /**
   * Create Record
   *
   * Generates a parse table `record` entry.
   */
  function create (record?: Partial<Record>): Record {

    const entry = object(null);

    entry.lexer = 'markup';
    entry.lines = parse.lineOffset;
    entry.stack = parse.stack.token !== 'global' ? parse.stack.token : 'global';
    entry.begin = parse.stack.index;
    entry.token = NIL;
    entry.types = NIL;
    entry.ender = -1;

    return record ? assign(entry, record) : entry;

  }

  /**
   * Push Record
   *
   * Pushes a record into the parse table populating the data structure.
   * All tokenized tags and content will pass through this function.
   */
  function push <T extends Partial<Record>> (record: Record, structure: Types | T | T[] = NIL, param?: T) {

    if (structure === NIL && param === undefined) {
      parse.push(data, record, NIL);
    } else if (u.isObject(structure)) {
      parse.push(data, assign(record, structure), NIL);
    } else if (u.isArray(structure)) {
      while (structure.length > 0) parse.push(data, assign(record, structure.shift()), NIL);
    } else if (param) {
      parse.push(data, assign(record, param), structure as Types);
    } else {
      console.log('issue');
    }

  };

  /**
   * Inner
   *
   * Applies template tag delimiters with a space. This function is an isolation
   * handler, used on Liquid expressions placed within attributes.
   *
   * - `{{` or `{{-`
   * - `{%` or`{%-`
   * - `}}` or `-}}`
   * - `%}`or `-%}`
   */
  function inner (input: string, tname: string = null) {

    if (parse.language !== 'html' && parse.language !== 'liquid') return input;
    if (/(?:{[=#/]|%[>\]])|\}%[>\]]/.test(input)) return input;
    if (!lq.getTokenType(input, LiquidTag.OpenAndClose)) return input;

    return lq.delimiters(input, tname);

  };

  /**
   * Whitespace Lead
   *
   * Utility function correction return leading whitespace token.
   * This is used to ensure `preserveText` is handled correctly.
   */
  function wsbefore (from: number, append: string = NIL) {

    let ws: string | string[] = b.slice(b.lastIndexOf(NWL, from) + 1, from);

    if (u.isWS(ws[0])) {
      ws = ws.join(NIL);
      return (ws.trim() === NIL ? ws : NIL) + append;
    }

    return NIL + append;

  }

  /**
   * Attribute Name
   *
   * Returns the markup attribute name and its value reference. This is determined by
   * an `=` character and quotation character separator, the return type is an array,
   * where index `0` is attr name and index `1` is attribute value.
   *
   * > When a _void_ attribute exists an empty string is returned for index `1`.
   */
  function attrname (attr: string, withQuotes = true): [name: string, value: string] {

    const eq = attr.indexOf('=');

    if (eq > 0) {

      const dq = attr.indexOf(DQO);

      if (eq < dq && dq > 0) {

        return withQuotes
          ? [ attr.slice(0, eq), attr.slice(eq + 1) ]
          : [ attr.slice(0, eq), attr.slice(eq + 2, -1) ];
      }

      const sq = attr.indexOf(SQO);

      if (eq < sq && sq > 0) {

        return withQuotes
          ? [ attr.slice(0, eq), attr.slice(eq + 1) ]
          : [ attr.slice(0, eq), attr.slice(eq + 2, -1) ];
      }

    }

    return [ attr, NIL ];

  };

  /* -------------------------------------------- */
  /* PARSE HANDLERS                               */
  /* -------------------------------------------- */

  /**
   * ### Parse Token
   *
   * Parses tags, attributes, comments, and liquid templates. This is the initial cycle responsible for
   * constructing records and performing analysis. The markup operations use 2 different
   * mini lexers, as per the original Sparser algorithm:
   *
   * 1. {@link ParseToken}
   * 2. {@link ParseContent}
   *
   * We will forward embedded (external) language occurrences, such as those within `<script>`,
   * to the `ParseContent` lexer. This will include raw text content or occurrences that are
   * not encapsulated with delimiter matches. At the conclusion of tokenization, the iteration
   * cycle continues until we have reached the end of the provided string.
   *
   * It's important to note that we will also use isolated controllers, such as those found within
   * the {@link CommentBlock}. Any external languages are passed to their respective
   * lexer, but this will occur within {@link ParseContent} lexing.
   *
   * ---
   *
   * ### Order of Execution
   *
   * The order of execution runs in the following sequences. Items listen below with `|`
   * infer determination, meaning the previous function may return any one of those.
   * Advancements might apply depending on the operations occurring within functions,
   * but for the most part, the {@link TokenLexer} will be responsible for moving over
   * characters.
   *
   * 1.  {@link Delimiters}
   * 2.  {@link TokenLexer} | {@link CommentToken} | {@link ExternalToken}
   * 3.  {@link ExternalToken} | {@link LiquidTagToken}
   * 4.  {@link IgnoreDetect}
   * 5.  {@link SingletonToken} | {@link IgnoreToken} | {@link IgnoreNext}
   * 6.  {@link SVGToken}
   * 7.  {@link LiquidToken}
   * 8.  {@link LiquidTokenCapture} | {@link CDATA}
   * 9.  {@link AttributeToken}
   * 10. {@link JSXToken}
   *
   * Functions do not have conclusion values, meaning no values are returned. Each
   * runner resolves to a `void` fall-through. Functions that do return a value are considered
   * helper or utility functions. This fall-through tactic allows lexing to continue and interchange
   * when required.
   *
   * ---
   *
   * ### Token Definitions
   *
   * This function will look at the following delimiter tag patterns and handle them accordingly.
   * Unlike the original tactic of Sparser, Æsthetic will augment some entries before adding them
   * into the data structure. Though this is not ideal and is likely to be reverted in a future version
   * to offer a pure form parser, given Æsthetic aims to provide only formatting capabilities
   * for now, tokens will apply edits so the formatting cycle is less extraneous.
   *
   * ```none
   * START       END     TYPE
   *
   * ---         ---     frontmatter
   * <![CDATA[   ]]>     cdata
   * <!--        -->     comment
   * <!--[if     -->     conditional
   * text       text     content
   * <\/          >      end
   * <pre      </pre>    ignore (html only)
   * text       text     script
   * <!          >       sgml
   * <          />       singleton
   * <           >       start/end
   * {{          }}      liquid
   * {%          %}      liquid_start/liquid_end
   * <?xml       ?>      xml
   * ```
   *
   * ---
   *
   * ### Additional Note!
   *
   * Each function is heavily documented to provide clear and informative reference. However, please keep
   * in mind that until Æsthetic reaches full stability, some comment descriptions may not be entirely clear.
   * It is up to you to identify inaccuracies. Not many developers are likely to delve deeply into this
   * codebase or read this documentation. However, if you do find yourself here, I've made your life easier.
   *
   * Developers who are more well-versed may be puzzled by the overall algorithm. When I first
   * encountered this code, I felt the same. But rest assured, the Sparser lexing algorithm is poetically
   * beautiful, and if you can grasp the tactic, you'll be surprised at how easy it is to reason about.
   *
   * Happy Hacking.
   */
  function ParseToken (ender: string = NIL) {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    /** The data~structure record */
    const record: Record = create();

    /* -------------------------------------------- */
    /* LOCAL SCOPES                                 */
    /* -------------------------------------------- */

    /** The token string reference, e.g: `<tag>`, `{% if x%}` */
    let token: string = NIL;

    /** The last known character of a token, e.g: `>`, `}` etc */
    let lchar: string = NIL;

    /** Last Type, e.g: `start`, `liquid` etc etc */
    let ltype: Types = NIL;

    /** Tag Name, e.g: `div`, `main` etc */
    let tname: string = NIL;

    /** Starting delimeter token, e.g: `{{` or `<` etc etc. */
    let start: string = NIL;

    /** Ignore count used to determine lexing logic */
    let icount: number = 0;

    /** Angle bracket count, e.g: `<` and `>` */
    let acount: number = 0;

    /** embed Tag, e.g: <script> or {% schema %} etc */
    let ignore: boolean = false;

    /** Whether or not attribute sorting should be applied */
    let nosort: boolean = false;

    /** Infers a basic lex operation, typically used on easy tags, e.g: `<div>` */
    let basic: boolean = false;

    /** Whether or not the contents of the token should be preserved */
    let preserve: boolean = false;

    /**
     * Attribute store reference. When chain is asserted (`index[2]`) then
     * the data type will be inferred to `liquid_attribute_chain` - This
     * is only used for template (liquid) attribute expressions.
     */
    let attrs: [ token: string, lines: number, chain?: boolean ][] = [];

    /* -------------------------------------------- */
    /* FUNCTIONS                                    */
    /* -------------------------------------------- */

    /**
     * Delimiters
     *
     * This is the first function to execute and prepares the traversal
     * for what to expect in terms of tag types.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link ParseToken()}
     *
     * Next: {@link Determine()}
     */
    function Delimiters (): ReturnType<typeof CommentToken | typeof ExternalToken | typeof TokenLexer> {

      if (ender === '---') {

        start = '---';
        ltype = parse.data.token.length === 0 ? 'frontmatter' : 'ignore';
        preserve = true;
        a = a + 3;

      } else if (u.is(b[a], cc.LAN)) {

        if (
          u.is(b[a + 1], cc.LCB) &&
          u.or(b[a + 2], cc.LCB, cc.PER)) {

          record.token = BadLiquidToken(3);
          record.types = 'liquid_bad_start';
          push(record);

          return;

        } else if (u.is(b[a + 1], cc.FWS)) {

          if (
            u.is(b[a + 2], cc.LCB) &&
            u.or(b[a + 3], cc.LCB, cc.PER)) {

            record.token = BadLiquidToken(3);
            record.types = 'liquid_bad_end';
            push(record);

            return;

          } else {

            ltype = 'end';
            ender = '>';
            acount = 1;

          }

        } else if (u.is(b[a + 1], cc.BNG)) {

          if (
            u.or(b[a + 2], 'd', 'D') && // d D
            u.or(b[a + 3], 'o', 'O') && // o O
            u.or(b[a + 4], 'c', 'C') && //  c C
            u.or(b[a + 5], 't', 'T') && // t T
            u.or(b[a + 6], 'y', 'Y') && // y Y
            u.or(b[a + 7], 'p', 'P') && // p P
            u.or(b[a + 8], 'e', 'E')) { // e E

            ender = '>';
            ltype = 'doctype';
            preserve = true;
            acount = 1;

          } else if (u.is(b[a + 2], cc.DSH)) {

            if (u.is(b[a + 3], cc.DSH)) {

              ender = '-->';
              start = '<!--';
              ltype = 'comment';

            } else {

              return MarkupError(ParseError.InvalidHTMLCommentDelimiter, b.slice(a, a + 3).join(NIL), 'comment');

            }

          } else if (
            u.is(b[a + 2], cc.LSB) &&
            u.is(b[a + 3], 'C') && // C
            u.is(b[a + 4], 'D') && // D
            u.is(b[a + 5], 'A') && // A
            u.is(b[a + 6], 'T') && // T
            u.is(b[a + 7], 'A') && // A
            u.is(b[a + 8], cc.LSB)
          ) {

            ender = ']]>';
            ltype = 'cdata';
            preserve = true;

          }

        } else if (u.is(b[a + 1], cc.QWS)) {

          ender = '?>';

          if (
            u.is(b[a + 2], 'x') && // x
            u.is(b[a + 3], 'm') && // m
            u.is(b[a + 4], 'l') //    l
          ) {
            ltype = 'xml';
            basic = true;
          } else {
            preserve = true;
            ltype = 'liquid';
          }

        } else if (
          u.is(b[a + 1], 'p') &&
          u.is(b[a + 2], 'r') &&
          u.is(b[a + 3], 'e') && (u.is(b[a + 4], cc.RAN) || u.ws(b[a + 4]))
        ) {

          ender = '</pre>';
          ltype = 'ignore';
          preserve = true;

        } else {

          basic = true;
          ender = '>';
          acount = 1;

        }

      } else if (u.is(b[a], cc.LCB)) {

        if (u.is(b[a + 1], cc.LCB)) {

          preserve = true;
          ender = '}}';
          ltype = 'liquid';
          lchar = '}';

        } else if (u.is(b[a + 1], cc.PER)) {

          preserve = true; // Required for lexer
          ender = '%}';
          ltype = 'liquid';
          lchar = '}';

          return LiquidLexer();

        } else {

          preserve = true;
          ender = b[a + 1] + '}';
          ltype = 'liquid';
          lchar = '}';

        }
      }

      return StartLexing();

    }

    /**
     * Determine
     *
     * Determination step which will being the lexing cycle. This will be triggered
     * following base assignments. It's here where we disaptch.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link Delimiters()} OR {@link LiquidLexer()}
     *
     * Next: {@link TokenLexer()} OR {@link CommentToken()} OR {@link ExternalToken()}
     */
    function StartLexing () {

      if (preserve !== true && rules.attributePreserve === true) {

        preserve = true; // preserve attributes

      }

      if (parse.count > -1 && data.types[parse.count] === 'ignore_next') {
        ignore = true;
        parse.iterator = a;
      }

      if (!lchar) {
        lchar = ender[ender.length - 1];
      }

      if (ltype === 'comment') return CommentToken();

      if (a < c) return TokenLexer();

      return ExternalToken();

    }

    /**
     * Liquid Lexer
     *
     * Does a quick look-ahead to check whether or not we've encountered an
     * empty liquid tag. This runs upon delimiter match in the first parse cycle.
     * It does some basic analysis to give us a head start on Liquid occurences.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link Delimiters()}
     *
     * Next: {@link StartLexing()}
     */
    function LiquidLexer () {

      const next = source.indexOf(ender, a + 3);
      const from = u.is(b[a + 2], cc.DSH) ? 3 : 2;

      if (next === -1) {
        return MarkupError(ParseError.MissingLiquidCloseDelimiter, source.slice(a));
      }

      if (/^\s*-?%}/.test(source.slice(a + from))) {
        push(record, { token: source.slice(a, next + 2), types: 'liquid_empty' });
        a = next + 2;
      } else {
        start = from === 3 ? '{%-' : '{%';
        tname = regex.LiquidTagName.exec(source.slice(a + from, next).trimStart())[0];
      }

      if (tname === 'comment') {

        ltype = 'comment';

        // Lets find the endcomment token. We will skip ahead here
        //
        const i = source.indexOf('endcomment', next + 2);

        if (i < 0) return MarkupError(ParseError.MissingLiquidEndTag, source.slice(a, next + 2), 'comment');

        start = source.slice(a, next + 2);
        ender = source.slice(source.lastIndexOf('{', i), source.indexOf('}', i + 10) + 1);

        return CommentToken();

      } else {

        if (ignored.size > 0 && ignored.has(tname)) {
          parse.iterator = a;
          ignore = true;
        }

        if (u.is(tname, cc.HSH)) {

          let d = 0;
          let i = a;

          while (i < c) {
            // Check for open delimiter
            if (u.is(b[i], cc.LCB) && u.is(b[i + 1], cc.PER)) {
              d++;
              i = i + 2;
            } else if (u.is(b[i], cc.PER) && u.is(b[i + 1], cc.RCB)) {
              d--;
              i = i + 2;
              if (d === 0) break;
            } else {
              i++;
            }
          }

          if (d > 0) return MarkupError(ParseError.MissingLiquidCloseDelimiter, source.slice(a));

          ender = u.is(b[i - 3], cc.DSH) ? '-%}' : '%}';
          ltype = 'comment';

          return CommentToken();

        }

      }

      return StartLexing();

    }

    /**
     * Comments
     *
     * Handling for comment lines and blocks. Additional processing for
     * dealing with Liquid comment blocks. The function also reasons
     * with ignore comment regions.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link Delimiters()}
     *
     * Next: {@link ExternalToken()}
     */
    function CommentToken (): ReturnType<typeof ExternalToken> {

      parse.iterator = a;

      const [
        comment,
        advance,
        type,
        hint = null
      ] = CommentBlock(b, {
        end: c,
        start: a,
        lexer: 'markup',
        begin: start,
        ender
      });

      if (comment === NIL) {

        if (advance === -1) return;

        return MarkupError(
          ParseError.MissingHTMLEndingCommentDelimiter,
          b.slice(parse.iterator, parse.iterator + 5).join(NIL),
          'comment'
        );

      }

      token = comment;
      a = advance;

      if (type === CommentType.IgnoreNext) {

        push(record, { token, types: 'ignore_next' });

      } else if (type === CommentType.Ignore) {

        push(record, { token, types: 'ignore' });

      } else {

        if (type === CommentType.LiquidBlock) {

          push(record, [
            {
              token: hint[0],
              types: 'liquid_comment_start'
            },
            {
              token,
              lines: hint[1],
              types: 'liquid_comment'
            }
          ]);

          record.token = hint[2];
          record.lines = hint[3];
          record.types = 'liquid_comment_end';

        } else if (type === CommentType.Markup) {

          record.token = token;
          record.types = 'comment';

        } else if (type === CommentType.LiquidLine) {

          record.token = token;
          record.types = 'liquid_comment_line';

        }

        return ExternalToken();

      }
    }

    /**
     * Token Lexer
     *
     * The real tag lexer. This walks the tag/s and tokenizes
     * attributes and Liquid tokens contained within the markup.
     *
     * **CALL STACK**
     *
     * Prev: {@link Delimiters()}
     *
     * Next: {@link ExternalToken()} OR {@link LiquidTagToken()}
     */
    function TokenLexer (): ReturnType< typeof ExternalToken | typeof LiquidTagToken> {

      /** Lexing store - Characters lexed from {@link b} used to compose token entries */
      const lexed: string[] = ltype === 'frontmatter' ? [ '---' ] : [];

      /** Liquid store - Internal index references of Liquid tokens, see: {@link LiquidInternal} */
      const liquid: LiquidInternal = LiquidStore();

      /* -------------------------------------------- */
      /* REFERENCES                                   */
      /* -------------------------------------------- */

      /** An advancement index reference */
      let e: number = 0;

      /** An advancement index reference, typically a quote */
      let q: number = 0;

      /** A slice reference string to match sequences */
      let string: string = NIL;

      /** Quotation count, e.g: `"` and `"` or `'` and `'` */
      let qcount: number = 0;

      /** Line count - This is applied to the data structure `data.lines` record */
      let lines: number = 0;

      /** Liquid token internal store */
      let type: Equipoise = NaN;

      /** The quotation character store reference */
      let quote: string = NIL;

      /** Whether or not we are within a Liquid template token */
      let isliq: boolean = false;

      /** Whether or not newline preservation in Liquid tokens is applied */
      let ntest: boolean = false;

      /** Whether or not we should invoke a whitespace test */
      let stest: boolean = false;

      /** Whether or not we should invoke a quotation test */
      let qtest: boolean = false;

      /** Quotation index within the {@link store} array model */
      let qidx: number = -1;

      /** Attribute store, populated with characters being lexed from {@link b} */
      let store: string[] = [];

      /**
       * Whether or not we are at a starting attribute value quote.
       * This reference will be used to consume nested quotes such as
       * those we'd encounter in Liquid tokens.
       */
      let qatt: boolean = false;

      /* -------------------------------------------- */
      /* FUNCTIONS                                    */
      /* -------------------------------------------- */

      /**
       * Liquid Equipoise
       *
       * This function is responsible for normalizing the inner contents of Liquid tokens.
       * Spacing corrections and composing a workable reference as per the {@link liquid}
       * store is the responsibility of this function. There are various complex checks based
       * on surrounding character sequences. The current {@link lexed} store is used to help
       * determine the assumed results for equipoised normalization.
       *
       * The function expects a parameter value be provided. This will either be an existing
       * store model reference of {@link store} or the {@link lexed} character array. The
       * function will augment those stores if necessary. The current index of `b[a]` is
       * equal to `array[array.length - 1]` as `b[a]` was already pushed onto the stack
       * before equipoise executes.
       *
       * > **RETURN `true`**
       *
       * > When the function returns a boolean `true` then the traversal will call `continue`
       * > in the main lexing operation otherwise it will proceed as normal.
       *
       * > **NOTE**
       * >
       * > This is pre-process operation, wherein Liquid tokens will also be passed through to
       * > {@link lq.tokenize} for additional formatting which applies after token lexing completes.
       */
      function LiquidEquipoise (store: string[]): true | void {

        if (u.isLast(store, cc.COM)) {

          // Correct for hanging commas
          //
          // if (/^,\s*-?[%}]}/.test(source.slice(a))) {
          //   store.pop();
          //   a = a + 1;
          //   return true;
          // }

          // Liquid "{% when %}" expressions can be separated by commas
          //
          if (tname === 'when') {

            liquid.logic.push(store.length - 1);

          }

        }

        if (
          u.isEven(qcount) &&
          u.notWS(b[a]) &&
          u.isLastOf(u.last(store, 2), cc.SQO, cc.DQO)) {

          // Following a quotation character
          //
          // Matches:
          //
          // '^
          // "^
          //
          if (u.no(b[a], cc.COM, cc.RSB)) {

            if (source.startsWith('with', a) && (tname === 'render' || tname === 'include')) {

              store.pop();
              store.push(WSP, 'with');

              a = a + 3;

            } else if (u.notWS(b[a + 1]) && u.no(b[a + 1], cc.EQS, cc.RCB)) {

              store.push(WSP);

            }

          } else if (
            u.ns(b[a + 1]) &&
            u.no(b[a + 1], cc.LSB, cc.DOT)) {

            // Missing whitespace character (where > is the updated token)
            //
            // 'æ > ' æ
            // 'æ > ' æ
            //
            store.push(WSP);

          }

        } else if (
          u.isLastAt(store, cc.RSB) &&
          u.isWS(b[a]) &&
          u.no(b[a], cc.WSP, cc.COM, cc.DOT)
        ) {

          store.splice(store.length - 1, 1, WSP, b[a]);

        } else if (
          type === Equipoise.FilterParam &&
          u.is(b[a], cc.WSP) &&
          u.isLastSeq(store, cc.COL, cc.NWL, cc.WSP)) {

          store.pop();

        } else if (u.is(b[a], cc.WSP) && u.isLastAt(store, cc.DOT)) {

          store.pop();

        } else if (u.isLastSeq(store, cc.LSB, cc.WSP)) {

          store.pop();

        } else if (u.is(b[a], cc.COM)) {

          if (rules.lineBreakSeparator !== 'preserve') {

            // Line Break Separator is set to 'before'
            //
            // We will analyze the provided structure and move any comma
            // character placements. Additional rules will be looked up
            // to ensure arguments are correctly structured.
            //
            if (rules.lineBreakSeparator === 'before') {

              // Argument Format is set to 'preserve'
              //
              // We need to handle arguments differently when filterArgument
              // rule is set to preserve. In this case, we need to preserve
              // the structure provided and when arguments are placed inline
              // comma characters will apply 'after' placement structures.
              //
              if (u.isLastAt(store, cc.WSP)) {

                if (u.is(b[a + 1], cc.NWL)) {
                  store.push(NWL, store.pop(), store.pop());
                } else {
                  store.splice(-2, 2, NWL, COM, WSP);
                }

              } else if (u.is(b[a + 1], cc.NWL)) {

                if (u.isLastAt(store, cc.NWL)) {
                  store.push(store.pop(), WSP);
                } else {
                  store.push(NWL, store.pop(), WSP);
                }

              } else if (type !== Equipoise.FilterParam && !u.isLastAt(store, cc.NWL)) {

                store.push(NWL, store.pop(), WSP);

              } else if (u.ns(b[a + 1])) {

                store.push(WSP);

              }

            } else {

              if (u.isLastAt(store, cc.WSP)) {

                if (u.is(b[a + 1], cc.NWL)) {
                  store.splice(-2, 2, COM);
                } else {
                  store.splice(-2, 2, COM, NWL);
                }

              } else if (u.isLastAt(store, cc.NWL)) {

                store.splice(-2, 2, COM, NWL);

              } else if (type !== Equipoise.FilterParam) {

                store.push(store.pop(), NWL);

              } else if (u.ns(b[a + 1])) {

                store.push(WSP);

              }

            }

          } else {

            if (u.isLastAt(store, cc.WSP)) {
              store.splice(-2, 1);
            } else if (u.ns(b[a + 1])) {
              store.push(WSP);
            }

          }

        } else if (u.is(b[a], cc.COL)) {

          if (type === Equipoise.FilterPipe) {

            liquid.fargs.push([ store.length - 1 ]);

            type = Equipoise.FilterParam;

          } else if (type === Equipoise.FilterParam) {

            u.last(liquid.fargs).push(store.length - 1);

          } else {

            type = Equipoise.TagParam;

          }

          if (u.isLastAt(store, cc.WSP)) {

            store.push(store.pop(), store.pop());

          }

          // console.log(JSON.stringify([store.join(''), b.slice(a, a + 50).join('')]))

          // Missing whitespace character (where > is the updated token)
          //
          // :æ > : æ
          //
          if (u.ns(b[a + 1])) {

            store.push(WSP);

          } else if (u.is(b[a + 1], cc.NWL)) {

            store.push(WSP);

          }

        } else if (u.is(b[a], cc.PIP)) {

          if (u.ns(b[a - 1])) {
            if (tname === 'liquid' || rules.filterLineBreak === true) {
              store.push(WSP, store.pop());
            } else {
              store.push(NWL, store.pop());
            }
          } else if (u.isLastAt(store, cc.WSP) && rules.filterLineBreak !== true) {

            store[store.length - 2] = tname === 'liquid' ? WSP : NWL;

          }

          type = Equipoise.FilterPipe;

          // Missing whitespace character (where > is the updated token)
          //
          // |æ > | æ
          //
          if (u.ns(b[a + 1])) store.push(WSP);

        } else if (u.is(b[a], cc.WSP) && u.or(b[a + 1], cc.DOT, cc.RSB, cc.LSB)) {

          store.pop();

        } else if (
          u.isEven(qcount) &&
          u.not(b[a], cc.LSB) &&
          u.ns(b[a]) &&
          u.ns(u.lastChar(store)) &&
          u.isOf(b[a + 1], cc.DQO, cc.SQO)) {

          store.push(WSP);

        } else if (tname === 'assign' && ((
          u.ns(b[a]) &&
          u.is(b[a + 1], cc.EQS)
        ) || (
          u.is(b[a], cc.EQS) &&
          u.ns(b[a + 1])
        ))) {

          // Fixes whitespace on equal character in assign tag
          //
          // æ= > æ =
          // =æ > = æ
          //
          store.push(WSP);

        } else if (
          tname === 'if' ||
          tname === 'unless' ||
          tname === 'elsif' ||
          tname === 'liquid') {

          if ((u.not(b[a], cc.WSP) || u.is(b[a], cc.NWL)) && (u.isOf(b[a + 1], cc.BNG, cc.LAN, cc.RAN) || (
            u.is(b[a + 1], cc.EQS) &&
            u.is(b[a + 2], cc.EQS)
          ))) {

            // Spacing before logical sequence (where ^ represents current point)
            //
            // ^ !=
            // ^ <=
            // ^ >=
            // ^ ==
            store.push(WSP);

          } else if (
            u.is(b[a], cc.EQS) &&
            u.isOf(b[a - 1], cc.EQS, cc.LAN, cc.RAN, cc.BNG) && (
              u.not(b[a + 1], cc.WSP) ||
              u.is(b[a + 1], cc.NWL)
            )) {

            if (u.isOf(store[store.length - 5], cc.EQS, cc.RAN, cc.LAN)) {

              return MarkupError(ParseError.InvalidLiquidOperator, store.join(NIL), tname);

            }

            // Spacing after logical sequence (where ^ represents current point)
            //
            // != ^
            // <= ^
            // >= ^
            // == ^
            store.push(WSP);

          } else if (u.no(b[a + 1], cc.WSP, cc.EQS) && u.isOf(b[a], cc.LAN, cc.RAN)) {

            // Before logical more or less than characters (where ^ represents current point)
            //
            // ^<
            // ^>
            store.push(WSP);

          } else if (source.startsWith('contains', a + 1)) {

            store.push('contains');

            u.isOf(b[a + 9], cc.DQO, cc.SQO) && store.push(WSP);

            a = a + 8;

          }

        } else if (tname === 'for' && u.is(b[a], cc.COL)) {

          // {% for %} tag parameter
          //
          liquid.param.push(store.lastIndexOf(WSP));

        }

        if (
          u.isLastSeq(store, cc.WSP, cc.WSP) ||
          u.isLastSeq(store, cc.NWL, cc.WSP) ||
          u.isLastSeq(store, cc.WSP, cc.NWL) || (u.isLastSeq(store, cc.NWL, cc.NWL) && tname !== 'liquid')) {

          store.pop();

        }

        // Liquid Logical Expressions
        //
        // Used in conditional tags. We will store the starting points for
        // each named operator expression. We also skip ahead if determined to be detected.
        //
        if (u.ws(b[a - 1])) {

          string = source.slice(a);

          if (
            tname === 'if' ||
            tname === 'elsif' ||
            tname === 'unless') {

            if (u.ws(b[a + 2]) && string.startsWith('or')) {

              return LiquidLogical(2);

            } else if (u.ws(b[a + 3]) && string.startsWith('and')) {

              return LiquidLogical(3);

            }

          } else if (tname === 'when' && u.ws(b[a + 2]) && string.startsWith('or')) {

            return LiquidLogical(2);

          } else if (tname === 'for') {

            if (b[a] === 'i' && b[a + 1] === 'n' && u.ws(b[a + 2])) {

              store.pop();
              store.push('in', WSP);

              a = a + 2;

            }

          }
        }

        // Detect Invalid Characters
        //
        if (u.isLast(store, cc.COM) && u.isLastAt(store, cc.COM)) {
          return MarkupError(
            ParseError.InvalidLiquidCharacterSequence,
            store.join(NIL),
            u.getTagName(store.join(NIL))
          );
        }

        ntest = false;

        /**
         * Logical Expressions
         *
         * The internal conditional structures such as `{% if x == y and a > b %}`,
         * wherein the `lineBreakLogical` rule is correctly handled and the
         * `liquid.logic` data model adhere to the line breaks imposed.
         *
         * The starting point of {@link store} here will be the first character
         * of the the logical expression, for example:
         *
         * ```js
         * '{% if condition o^' // representing an "or" logical
         * '{% if condition a^' // representing an "and" logical
         * '{% if condition c^' // representing an "contains" logical
         * ```
         */
        function LiquidLogical (at: number): true {

          if (rules.lineBreakLogical === 'preserve') {

            if (u.isLastAt(store, cc.WSP)) {
              store.splice(store.length - 2, 2, WSP, string.slice(0, at), NWL);
            } else if (u.isLastAt(store, cc.NWL)) {
              store.splice(store.length - 2, 2, NWL, string.slice(0, at), WSP);
            }

          } else if (rules.lineBreakLogical === 'before') {

            if (u.isLastAt(store, cc.WSP)) {
              store.splice(store.length - 2, 2, NWL, string.slice(0, at), WSP);
            } else if (u.isLastAt(store, cc.NWL)) {
              store.splice(store.length - 1, 2, string.slice(0, at), WSP);
            }

          } else if (rules.lineBreakLogical === 'after') {

            if (u.isLastAt(store, cc.WSP)) {
              store.splice(store.length - 1, 1, string.slice(0, at), NWL);
            } else if (u.isLastAt(store, cc.NWL)) {
              store.splice(store.length - 2, 2, WSP, string.slice(0, at), NWL);
            }

          }

          a = a + at;

          return true;

        }

      }

      /**
       * Attribute Tokenizer
       *
       * This function is responsible for reasoning with the lexed contents of
       * the recently traversed markup attributes. This updates the {@link attrs} reference
       * by using the {@link store} entries which have been populated during lexing.
       *
       * An expected parameter value of `quotes` which expects a `boolean` value is used
       * to signal whether or not we are dealing with a token containing attributes or simply
       * a tag either with no attributes or a Liquid type tag.
       */
      function Attributes (quotes: boolean) {

        /* -------------------------------------------- */
        /* LEXICAL SCOPES                               */
        /* -------------------------------------------- */

        /** The attribute name (index `0`) and value (index `0`) */
        let each: [ name: string, value: string ];

        /** The attribute token, eg: `id="foo"` */
        let attr: string = NIL;

        /* -------------------------------------------- */
        /* LEXICAL HANDLING                             */
        /* -------------------------------------------- */

        if (quotes === true) {

          attr = store.join(NIL);
          each = attrname(attr);
          quote = NIL;

          if (each[0] === 'data-esthetic-ignore') ignore = true;

        } else {

          attr = store.join(NIL).replace(regex.SpacesGlob, WSP);
          each = attrname(attr);

          if (each[0] === 'data-esthetic-ignore') {

            ignore = true;

          }

        }

        // Prevent sorting of attributes when tags contain Liquid tokens
        //
        nosort = u.is(attr[0], cc.LCB) && u.is(attr[1], cc.PER);

        attr = attr.replace(/^\u0020/, NIL).replace(/\u0020$/, NIL);
        store = attr.replace(/\r\n/g, NWL).split(NWL);

        if (store.length < 1) {

          store[0] = store[0].replace(regex.SpaceEnd, NIL);

        }

        attr = inner(store.join(parse.crlf), tname);

        if (rules.stripAttributeLines === true && lines > 1) {

          lines = 1;
        }

        if (attrs.length > 0) {

          const ln = attrs.length - 1;

          if (within === 0 && (u.is(attr, cc.EQS) || u.is(attr, cc.DSH))) {

            // If an attribute starts with a `=` then adjoin it to the attrs.length -1 attribute
            //
            attrs[ln][0] = attrs[ln][0] + attr;
            attrs[ln][1] = lines;

            // Prevent adding the entry to store as we've connected it to the last entry
            //
            attr = NIL;

          } else if (lines === 0) {

            // TODO

          }
        }

        if (quotes === false) {
          if (lq.isStart(attr)) within = within + 1;
          if (lq.isEnd(attr)) within = within - 1;
        }

        // Populates the "attrs[]" store which will be used
        // when adding the records to the data structures
        //
        if (attr !== NIL && attr !== WSP) attrs.push([ attr, lines ]);

        //  console.log(attrs);

        // Parse Errors
        //
        if (attrs.length > 0) {

          const [ value ] = attrs[attrs.length - 1];

          if (value.indexOf('=\u201c') > 0) {

            // “
            return MarkupError(ParseError.InvalidQuotation, value);

          } else if (value.indexOf('=\u201d') > 0) {

            // ”
            return MarkupError(ParseError.InvalidQuotation, value);

          }
        }

        store = [];
        lines = u.is(b[a], cc.NWL) ? 1 : 0;

      };

      /* -------------------------------------------- */
      /* TRAVERSAL                                    */
      /* -------------------------------------------- */

      do {

        if (parse.error) return;

        // Newline Increments
        //
        if (u.is(b[a], cc.NWL)) lines = parse.lines(a, lines);

        // Frontmatter Ignores
        //
        if (start === '---' && ender === '---' && ltype === 'ignore') {

          lexed.push(b[a]);

          if (u.is(b[a], cc.DSH) && u.is(b[a + 1], cc.DSH) && u.is(b[a + 2], cc.DSH)) {
            a = a + 2;
            break;
          }

          ++a;

          continue; // continue lexing

        }

        // Liquid Tokens
        //
        if (preserve === true || ((u.ns(b[a]) && u.not(quote, cc.RCB)) || u.is(quote, cc.RCB))) {

          lexed.push(b[a]);

          // Liquid Token Types, eg: {% OR {{
          //
          if (
            isliq === false &&
            u.is(b[a - 1], cc.LCB) &&
            u.or(b[a], cc.LCB, cc.PER)) {

            isliq = true;

          } else if (isliq && u.is(b[a], cc.RCB)) {

            // Liquid Token Closed, } OR %
            //
            if (u.or(b[a - 1], cc.RCB, cc.PER)) {

              isliq = false;

            } else if (u.ws(b[a - 1]) && u.or(b[a - 2], cc.RCB, cc.PER)) {

              return MarkupError(ParseError.MissingLiquidCloseDelimiter, lexed.join(NIL));

            }

          } else if (isliq && u.is(b[a], cc.NWL) && (
            rules.delimiterPlacement === 'preserve' ||
            rules.delimiterPlacement === 'consistent')) {

            // Preserve newlines at starting delimiter, eg: {{\n or {%\n etc
            //
            if ((
              u.is(b[a - 1], cc.DSH) &&
              u.is(b[a - 3], cc.LCB) &&
              u.or(b[a - 2], cc.LCB, cc.PER)
            ) || (
              u.is(b[a - 2], cc.LCB) &&
              u.or(b[a - 1], cc.LCB, cc.PER)
            )) {

              ntest = true;

            } else if (/^\s*-?[%}]}/.test(source.slice(a))) {

              // Preserve newlines at ending delimiters, eg: \n}} or %} etc
              // We will also move ahead in the traversal, skipping additional
              // whitespace or newline occurances, as per the the do/while loop
              //
              while (u.ws(b[a])) {
                ++a;
                if (u.is(b[a], cc.NWL)) lines = parse.lines(a, lines);
              }

              lexed.push(b[a]);

              ntest = true;

            }
          }

          // HTML Eng Tags, eg: </tag>
          //
          if (
            ltype === 'end' &&
            lexed.length > 2 &&
            u.is(lexed[0], cc.LAN) &&
            u.is(lexed[1], cc.FWS) &&
            u.or(lexed[lexed.length - 1], cc.FWS, cc.LAN)
          ) {

            return MarkupError(ParseError.MissingHTMLEndingDelimiter, lexed.join(NIL));

          }

          // Empty HTML Tags, eg: <>
          //
          if (
            u.is(lexed[0], cc.LAN) &&
            u.is(lexed[1], cc.RAN) &&
            u.is(ender, cc.RAN)
          ) {

            return push(record, '(empty)', { token: '<>', types: 'start' });

          }

          // Empty HTML End Tags, eg: </>
          //
          if (
            u.is(lexed[0], cc.LAN) &&
            u.is(lexed[1], cc.FWS) &&
            u.is(lexed[2], cc.RAN) &&
            u.is(ender, cc.RAN)) {

            record.token = '</>';
            record.token = 'end';

            return push(record);

          }
        }

        // CDATA Parse Error
        //
        if (
          ltype === 'cdata' &&
          u.is(b[a], cc.RAN) &&
          u.is(b[a - 1], cc.RSB) &&
          u.not(b[a - 2], cc.RSB)) {

          return MarkupError(ParseError.InvalidQuotation, lexed.join(NIL));

        }

        // Comment Content
        //
        if (ltype === 'comment') {

          quote = NIL;

          // Comments must ignore fancy encapsulations and attribute parsing
          //
          if (b[a] === lchar && lexed.length > ender.length + 1) {

            // Current character matches the last character of the tag ending sequence
            q = lexed.length;
            e = ender.length - 1;

            if (e > -1) {
              do {
                --q;
                if (u.not(lexed[q], ender[e])) break;
              } while (--e > -1);
            }

            if (e < 0) break;

          }

        } else {

          if (quote === NIL) {

            // HTML Bang Sequence, eg: <!
            //
            if (
              ltype !== 'cdata' &&
              u.is(lexed[0], cc.LAN) &&
              u.is(lexed[1], cc.BNG)
            ) {

              // HTML Doctype
              //
              if (ltype === 'doctype' && u.is(b[a], cc.RAN)) break;

              // HTML CDATA or SGML
              //
              if (u.is(b[a], cc.LSB)) {

                if (u.is(b[a + 1], cc.LAN)) {
                  ltype = 'start';
                  break;
                }

                if (u.ws(b[a + 1])) {
                  do {
                    ++a;
                    if (u.is(b[a], cc.NWL)) lines = parse.lines(a, lines);
                  } while (a < c - 1 && u.ws(b[a + 1]));
                }

                if (u.is(b[a + 1], cc.LAN)) {
                  ltype = 'start';
                  break;
                }
              }
            }

            // HTML Invalid Structure
            //
            //
            if (
              basic &&
              preserve === false &&
              u.is(b[a], cc.LAN) &&
              lexed.length > 1 &&
              !/>{2,3}/.test(ender)) {

              parse.lineNumber -= 1;
              MarkupError(ParseError.UnterminatedHTMLStartTag, lexed.join(NIL), start);

              break;
            }

            // HTML/Liquid Attribute Sequences
            //
            // The traversal operations contained within this condition
            // pertain directly to attributes and innner markup <tag> content
            //
            if (u.ws(b[a]) === false && stest && b[a] !== lchar) {

              // Attribute start
              //

              icount = 0;
              stest = false;
              quote = NIL;

              lexed.pop();

              if (a < c) {

                do {

                  // Newline Increments
                  //
                  if (qatt === false && u.is(b[a], cc.NWL)) lines = parse.lines(a, lines);

                  if (rules.attributePreserve === true) {
                    lexed.push(b[a]);
                  } else {
                    store.push(b[a]);
                  }

                  // if (u.not(quote, cc.DQO) || u.not(quote, cc.SQO)) {

                  if (
                    u.is(b[a - 1], cc.LCB) &&
                    u.or(b[a], cc.PER, cc.LCB)) {

                    isliq = true;

                  } else if (
                    u.is(b[a], cc.RCB) &&
                    u.or(b[a - 1], cc.RCB, cc.PER)) {

                    isliq = false;

                  }

                  if (
                    qatt &&
                    u.isOdd(qcount) &&
                    u.is(b[a - 1], cc.LAN) &&
                    u.is(b[a], cc.FWS)) {

                    MarkupError(ParseError.UnterminatedString, source.slice(a));

                  }

                  // }

                  if (
                    isliq === true &&
                    qatt === false &&
                    rules.attributePreserve === false &&
                    u.no(quote, cc.DQO, cc.SQO)
                  ) {

                    while (a < c) {

                      ++a;

                      // Newline Increments
                      //
                      if (u.is(b[a], cc.NWL)) lines = parse.lines(a, lines);

                      if (
                        u.is(store[0], cc.EQS) &&
                        u.or(store[1], cc.LCB, cc.PER) &&
                        u.is(store[store.length - 1], cc.RCB) &&
                        u.or(store[store.length - 2], cc.RCB, cc.PER)) {

                        isliq = false;
                        quote = NIL;
                        Attributes(false);
                        break;
                      }

                      // Equals Character
                      //
                      if (u.is(store[0], cc.EQS) && u.not(store[1], cc.LCB)) {
                        isliq = false;
                        quote = NIL;
                        Attributes(false);
                        break;
                      }

                      store.push(b[a]);

                      // HTML Attribute
                      //
                      if (u.is(store[0], cc.EQS) && u.is(b[a + 1], cc.RAN)) {

                        isliq = false;
                        attrs[attrs.length - 1][0] += store.join(NIL);
                        store = [];
                        quote = NIL;

                        break;

                      }

                      // Liquid Token as HTML Attribute
                      //
                      if (
                        u.not(store[0], cc.EQS) &&
                        u.is(b[a], cc.RCB) &&
                        u.or(b[a - 1], cc.RCB, cc.PER)
                      ) {

                        isliq = false;
                        quote = NIL;

                        Attributes(false);

                        break;

                      }

                    }

                  }

                  if (quote === NIL && u.or(b[a], cc.LAN, cc.RAN)) {

                    if (quote === NIL && u.is(b[a], cc.LAN)) {

                      quote = '>';
                      ++acount;

                    } else if (u.is(quote, cc.RAN)) {

                      if (u.is(b[a], cc.LAN)) ++acount;
                      if (u.is(b[a], cc.RAN)) --acount;

                      if (acount === 0) {
                        quote = NIL;
                        icount = 0;
                        Attributes(false);
                        break;
                      }

                    }

                  } else if (quote === NIL) {

                    if (b[a + 1] === lchar) {

                      // If we are at end of a tag, we exit the traversal.
                      //
                      if (u.isLast(store, cc.FWS) || (u.isLast(store, cc.QWS) && ltype === 'xml')) {
                        store.pop();
                        preserve === false || lexed.pop();
                        --a;
                      }

                      if (store.length > 0) Attributes(false);

                      break;

                    }

                    if (u.is(b[a], cc.LCB) && u.is(b[a - 1], cc.EQS)) {

                      quote = '}';

                    } else if (u.or(b[a], cc.DQO, cc.SQO)) {

                      quote = b[a];
                      qatt = qatt === false && isliq === false;

                      ++qcount;

                      // Ignore Count
                      //
                      // =<
                      // ={%
                      //
                      if (u.is(b[a - 1], cc.EQS) && (u.is(b[a + 1], cc.LAN) || (
                        u.is(b[a + 1], cc.LCB) &&
                        u.is(b[a + 2], cc.PER)
                      ) || (
                        u.ws(b[a + 1]) &&
                        u.not(b[a - 1], cc.EQS)
                      ))) {

                        icount = a;

                      }

                    } else if (
                      u.is(lexed[0], cc.LCB) &&
                      u.is(b[a], cc.LCB) &&
                      u.or(b[a + 1], cc.LCB, cc.PER)) {

                      // Liquid token expression
                      //
                      // If lexed[0] is `{` and next character in either { or %
                      //
                      quote = u.is(b[a + 1], cc.LCB) ? '}}' : '%}';

                    }

                    if (u.ws(b[a]) && quote === NIL) {

                      // Testing for a run of spaces between an attribute's = and a quoted value.
                      // Unquoted values separated by space are separate attrs
                      //
                      if (u.is(store[store.length - 2], cc.EQS)) {

                        e = a + 1;

                        if (e < c) {
                          do {
                            if (u.ns(b[e])) {

                              if (u.or(b[e], cc.DQO, cc.SQO)) {
                                a = e - 1;
                                qtest = true;
                                store.pop();
                              }

                              break;
                            }

                          } while (++e < c);
                        }
                      }

                      if (qtest === true) {

                        qtest = false;

                      } else {

                        // If there is an unquoted space attribute is complete
                        //
                        store.pop();
                        store.length > 0 && Attributes(false);
                        stest = true;
                        break;

                      }
                    }

                  } else if (
                    u.is(b[icount - 1], cc.EQS) &&
                    u.is(b[a], cc.LCB) &&
                    u.is(b[a + 1], cc.PER) &&
                    u.or(quote, cc.DQO, cc.SQO)
                  ) {

                    quote = quote + '{%';
                    icount = 0;

                  } else if (
                    u.is(b[a - 1], cc.PER) &&
                    u.is(b[a], cc.RCB) && (
                      quote === '"{%' ||
                      quote === "'{%"
                    )
                  ) {

                    quote = quote[0];
                    icount = 0;

                  } else if ((
                    u.is(b[a], cc.LAN) &&
                    u.is(ender, cc.RAN) &&
                    u.is(b[icount - 1], cc.EQS) &&
                    u.or(quote, cc.DQO, cc.SQO)
                  )) {

                    quote = quote + '<';
                    icount = 0;

                  } else if (
                    u.is(b[a], cc.RAN) && (
                      quote === '"<' ||
                      quote === "'<"
                    )
                  ) {

                    quote = quote.charAt(0);
                    icount = 0;

                  } else if (icount === 0 && (u.not(b[a - 1], cc.BWS) && u.or(b[a], cc.SQO, cc.DQO)) &&
                    u.not(quote, cc.RAN) && (
                    quote.length < 2 ||
                    u.no(quote, cc.DQO, cc.SQO))) {

                    // Terminate attribute at the conclusion of a quote pair
                    q = 0;
                    e = quote.length - 1;

                    if (e > -1) {

                      do {
                        if (u.not(b[a - q], quote[e])) break;
                        ++q;
                      } while (--e > -1);

                      if (u.is(b[a], quote[0])) --qcount;

                    }

                    // Apply Value Forcing
                    //
                    // Inserts a newline `\n` character following the first known
                    // quotation character of the attribute value, e.g: class=" TO class="\n
                    //
                    if (
                      qatt &&
                      qidx > -1 &&
                      isliq === false &&
                      b[a + 1] === quote &&
                      u.is(store[qidx], cc.NWL) &&
                      u.not(b[a - 1], cc.BWS)) {

                      qidx = -1;

                    } else if (qatt === true && qidx < 0) {

                      qidx = store.length - 1;

                    }

                    // Apply Equipoise spacing refinements to attribute
                    //
                    if (rules.valueSpacing === 'equipoise') {

                      // Ensure no leading whitespace applies to values which have a newline inserted
                      //
                      if (isliq) {

                        if (u.not(b[a - 1], cc.BWS) && u.or(b[a], cc.SQO, cc.DQO)) {
                          u.isEven(qcount) ? ++qcount : --qcount;
                        }

                        LiquidEquipoise(store);

                      }

                    }

                    // Success - Proceed to Attribute Tokenize
                    //
                    if (e < 0 && isliq === false && qatt === true) {

                      qatt = false;
                      Attributes(true);

                      if (b[a + 1] === lchar) break;

                    }

                    if (
                      isliq === false &&
                      qidx > -1 &&
                      qatt === true &&
                      e === 0 &&
                      u.isEven(qcount) &&
                      u.is(b[a], cc.RAN)) {

                      MarkupError(ParseError.UnterminatedString, source.slice(a));

                    }

                  } else if (icount > 0 && u.ws(b[a]) === false) {

                    icount = 0;

                  }

                } while (++a < c);
              }

            } else if (u.not(ender, cc.NWL) && u.or(b[a], cc.DQO, cc.SQO)) {

              // Opening quote
              //
              quote = b[a];

            } else if (a > 0 && isliq && u.no(quote, cc.DQO, cc.SQO)) {

              if (LiquidEquipoise(lexed) === true) continue;

            } else if (
              ltype !== 'comment' &&
              parse.record.types !== 'conditional' &&
              u.not(ender, cc.NWL) &&
              u.is(b[a], cc.LAN) &&
              u.is(b[a + 1], cc.BNG) &&
              u.is(b[a + 2], cc.DSH) &&
              u.is(b[a + 3], cc.DSH)
            ) {

              quote = '-->';

            } else if (
              u.is(b[a], cc.LCB) &&
              u.not(lexed[0], cc.LCB) &&
              u.not(ender, cc.NWL) &&
              u.or(b[a + 1], cc.LCB, cc.PER)
            ) {

              if (u.is(b[a + 1], cc.LCB)) {

                quote = '}}';

              } else {

                quote = b[a + 1] + '}';

                if (store.length < 1 && (attrs.length < 1 || u.ws(b[a - 1]))) {

                  lexed.pop();

                  do {
                    if (u.is(b[a], cc.NWL)) lines = lines + 1;
                    store.push(b[a]);
                    a = a + 1;
                  } while (a < c && b[a - 1] + b[a] !== quote);

                  store.push('}');
                  attrs.push([ store.join(NIL), lines ]);

                  store = [];
                  lines = 1;
                  quote = NIL;

                }
              }

              if (quote === ender) quote = NIL;

            } else if (
              basic &&
              u.not(ender, cc.NWL) &&
              u.not(b[a - 1], cc.LAN) &&
              u.ws(b[a])
            ) {

              // Identify a space in a regular start or singleton tag
              //
              stest = true;

            } else if (
              isliq === false && (
                b[a] === lchar || (
                  u.is(ender, cc.NWL) &&
                  u.is(b[a + 1], cc.LAN)
                )
              ) && (
                lexed.length > ender.length + 1 ||
                u.is(lexed[0], cc.RSB)
              )
            ) {

              if (u.is(ender, cc.NWL)) {
                if (u.ws(lexed[lexed.length - 1])) {
                  do {
                    lexed.pop();
                    a = a - 1;
                  } while (u.ws(lexed[lexed.length - 1]));
                }

                break;
              }

              // If current character matches the last character of the tag ending sequence
              //
              q = lexed.length;
              e = ender.length - 1;

              if (e > -1) {
                do {
                  q = q - 1;
                  if (lexed[q] !== ender.charAt(e)) break;
                  e = e - 1;
                } while (e > -1);
              }

              if (e < 0) {

                if (u.is(lexed[q], cc.RAN) && u.is(b[a], cc.RAN)) {

                  // This condition will fix incorrect line spaces applied
                  // on template attrs that are contained in the attribute store
                  //
                  if (
                    u.is(b[a - 1], cc.RCB) &&
                    u.ws(b[a + 1]) &&
                    attrs.length > 0 &&
                    attrs[attrs.length - 1][1] === 0) {

                    attrs[attrs.length - 1][1] = u.is(b[a + 1], cc.WSP) ? 1 : 2;

                  }

                }

                break;

              }
            }
          } else if (u.is(b[a], quote[quote.length - 1]) && u.not(b[a - 1], cc.BWS)) {

            // Find the closing quote or external template expression
            //
            q = 0;
            e = quote.length - 1;

            if (e > -1) {
              do {
                if (u.not(b[a - q], quote[e])) break;
                ++q;
              } while (--e > -1);
            }

            if (e < 0) quote = NIL;

          }
        }

      } while (++a < c);

      icount = 0;

      if (!tname && start !== '---') tname = u.getTagName(lexed.join(NIL));

      if (ignore === false) {
        if (ltype === 'liquid') {
          if (tname === 'liquid') {
            token = lexed.join(NIL);
            return LiquidTagToken();
          } else {
            token = lq.delimiters(lexed.join(NIL), tname);
          }
        } else {
          token = lexed.join(NIL);
        }
      } else {
        token = lexed.join(NIL);
      }

      record.token = token;
      record.types = ltype;

      // console.log(record);

      return ExternalToken();

    }

    /**
     * External Token
     *
     * Determines whether or not the token contains an external region
     * like that of `<script>`, `<style>` and Liquid equivalents `{% schema %}` etc.
     * Some additional context is required before passing the contents of these tags
     * to different lexers. It's here where we establish that context.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link TokenLexer()}
     *
     * Next: {@link IgnoreDetect()}
     */
    function ExternalToken (): ReturnType<typeof IgnoreDetect> {

      //  cheat = correct();

      if (ignore || (u.is(token, cc.LAN) && u.is(token[1], cc.FWS))) return IgnoreDetect();

      /** Token query return value - references the {@link attrs} store */
      let q: ReturnType<typeof external.determine>;

      /** Length of the {@link attrs} store reference */
      let i: number = attrs.length - 1;

      if (u.is(token, cc.LAN)) {

        if (i > -1) {

          do {

            /** Query HTML type token and its attributes, i.e: {@link attrs} */
            q = external.determine(tname, 'html', attrname(attrs[i][0], false));

            if (q !== false) {
              if (q.language === 'json' && rules.ignoreJSON) {

                ltype = 'json_preserve';
                ignore = true;

                break;

              } else if (q.language === 'javascript') {

                ltype = 'script_preserve';
                ignore = true;

                break;

              } else if (q.language === 'css') {

                ltype = 'style_preserve';
                ignore = true;

                break;

              } else {

                language = q.language;
                ltype = 'start';
                embed = true;
                ignore = false;

                break;

              }
            }

            i = i - 1;

          } while (i > -1);

        } else {

          q = external.determine(tname, 'html');

          if (q !== false) {

            if (q.language === 'json' && rules.ignoreJSON) {

              ltype = 'json_preserve';
              ignore = true;

            } else if (q.language === 'javascript') {

              ltype = 'script_preserve';
              ignore = true;

            } else if (q.language === 'css') {

              ltype = 'style_preserve';
              ignore = true;

            } else {

              language = q.language;
              ltype = 'start';
              embed = true;
              ignore = false;

            }

          }
        }

      } else if (lq.isStart(token, true)) {

        q = external.determine(tname, 'liquid', token);

        if (q !== false) {
          if (ignored.has(tname)) {

            ignore = true;
            preserve = false;

          } else {

            ltype = 'liquid_start';
            language = q.language;
            embed = true;

          }
        }

      }

      return IgnoreDetect();

    }

    /**
     * Ignore Detect
     *
     * Additional logic required to find the end of a tag when it contains
     * a `data-esthetic-ignore` attribute annotation. The function also
     * handles `esthetic-ignore-next` ignore comments placed above tag regions.
     *
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link ExternalToken()}
     *
     * Next: {@link SingletonToken()} _see below note as next call is not definitive_
     *
     * > **NOTE**
     * >
     * > This function applies determination logic. `SingletonToken()` might not be next
     * > If the token is ignore type, then {@link IgnoreToken()} will be next to run.
     * > If the token is ignore next type {@link IgnoreNext()} will be next to run.
     * > Both ignore function calls are typically rare, expected next call is `SingletonToken`
     */
    function IgnoreDetect (): ReturnType<typeof SingletonToken | typeof IgnoreToken | typeof IgnoreNext> {

      // Parse Preserve
      //
      // We will first detect any preserved structures and pass it on.
      // These types infer ignores that respect indentation and are rule based.
      //
      if (
        ltype === 'script_preserve' ||
        ltype === 'json_preserve' ||
        ltype === 'style_preserve') {

        record.types = 'start';
        record.stack = ltype === 'style_preserve' ? 'style' : 'script';

        // External regions of code that are preserved will still
        // have attributes formatted, so before ignoring the inner
        // content we will first process attributes.
        //
        AttributeToken();

        a = a + 1; // Increment advancement by one
        attrs = []; // Reset attributes and proceed

        return IgnoreToken(`</${tname}>`, Languages.HTML);

      }

      // if (embed === false) return SingletonToken();

      // Ignore Next
      //
      // When the previous token type is ignore_next we need to determine
      // the next token and exclude it from formatting.
      //
      if (data.types[parse.count] === 'ignore_next') {

        if (ltype === 'liquid_start') {

          return IgnoreNext(`end${tname}`, Token.LiquidEndTag);

        } else if (ltype === 'liquid') {

          if (grammar.liquid.tags.has(tname)) {

            ltype = 'liquid_start';

            return IgnoreNext(`end${tname}`, Token.LiquidEndTag);

          } else {

            return IgnoreNext(ender, ender === '}}' ? Token.LiquidOutput : Token.LiquidSingular);

          }

        } else if (grammar.html.voids.has(tname)) {

          return IgnoreNext(ender, Token.MarkupVoid);

        } else if (u.is(ender, cc.RAN)) {

          return IgnoreNext(`</${tname}>`, Token.MarkupEnd);

        }

        // TODO: PARSE WARNINGS
        //
        // We will add a parse warning here in the future

        ignore = false;
        preserve = false;

        return SingletonToken();

      } else if (ignored.has(tname)) {

        return IgnoreToken(`end${tname}`, Languages.Liquid);

      }

      return SingletonToken();

    }

    /**
     * Ignore Token
     *
     * This function is responsible for skipping embedded code regions
     * when rules like `ignoreJS`, `ignoreJSON` and `ignoreCSS` are enabled.
     * This will push the entire token to the table.
     *
     * The function is only handling embedded regions, but may in the future be
     * used for different excluded/preservation imposed logic.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link IgnoreDetect()}
     *
     * Next: {@link AttributeToken()}
     */
    function IgnoreToken (ender: string, type: Languages): ReturnType<typeof AttributeToken> {

      /** The starting index */
      const now = a;

      /* -------------------------------------------- */
      /* LEXICAL SCOPE                                */
      /* -------------------------------------------- */

      /** Quotations store reference, is used to skip quotes */
      let i = -1;

      /** Tag count should be zero to negate repeating occurances */
      let n = 0;

      /** Tag capture letting for matching against `tname` */
      let t: string = NIL;

      do {

        // Comment Skipping
        //
        // We need to ensure that comment occurances within the tag blocks
        // are excluded to offset any occurances of tag names.
        if ((tname === 'script' || tname === 'style') && u.is(b[a], cc.FWS)) {
          if (u.is(b[a + 1], cc.FWS)) {
            a = b.indexOf(NWL, a + 1) + 1;
          } else if (u.is(b[a + 1], cc.ARS)) {
            a = source.indexOf('*/', a + 1) + 2;
          }
        }

        // String Handling
        //
        // We need to ensure the string occurances are digested and skipped.
        // This will prevent potention issues from occuring when string structures
        // contain enders or starters.
        //
        //
        if (u.or(b[a], cc.DQO, cc.SQO, cc.TQO)) {

          i = a + 1;
          t = b[a];

          // Proceed to next quotation
          while (t !== b[i] && i < c) {
            if (u.is(b[i], cc.BWS)) i = i + 1;
            if (t === b[i]) break;
            i = i + 1;
          }

          if (i !== c) {
            a = i + 1;
            i = -1;
          } else {
            return MarkupError(ParseError.UnterminatedString, source.slice(a));
          }
        }

        if (type === Languages.Liquid) {

          if (u.is(b[a - 2], cc.LCB) && u.is(b[a - 1], cc.PER)) {

            if (u.is(b[a], cc.DSH)) a = a + 1;

            i = a;

            // Proceed to first known character
            while (u.ws(b[i])) if (u.ns(b[++i])) break;

            t = source.slice(i, i + ender.length);

            if (t.startsWith(tname)) {

              a = i + tname.length;
              n = n + 1;
              i = -1;

              continue;

            } else if (t === ender) {

              if (n === 0) {

                i = b.indexOf('}', i + ender.length) + 1;

                if (i === -1) return MarkupError(ParseError.MissingLiquidCloseDelimiter, t, tname);

                break;

              } else {

                n = n - 1;
                a = i + ender.length;

              }
            }
          }

        } else {

          if (source.slice(a, a + ender.length) === ender) {

            token = source.slice(now, a)
              .replace(regex.WhitespaceLead, NIL)
              .replace(regex.WhitespaceEnd, NIL);

            break;

          }

        }

        a = a + 1;

      } while (a < c);

      if (type === Languages.Liquid) {

        const from = b.lastIndexOf(NWL, parse.iterator) + 1;
        record.types = ltype = 'ignore';
        record.token = token = source.slice(from, i);

        push(record);

        a = i - 1;
        attrs = [];

      } else {

        parse.lineNumber = u.countLines(token, parse.lineNumber);

        if (token.trim() !== NIL) {
          record.token = token;
          record.lines = parse.lineOffset;
          record.types = 'ignore';
          push(record);
        }

        record.types = ltype = 'end';
        record.token = token = ender;

        a = a + ender.length - 1;

        return AttributeToken();

      }

    }

    /**
     * Ignore Next
     *
     * This function is responsible for skipping embedded code regions
     * when rules like `ignoreJS`, `ignoreJSON` and `ignoreCSS` are enabled.
     * This will push the entire token to the table.
     *
     * The function is only handling embedded regions, but may in the future be
     * used for different excluded/preservation imposed logic.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link IgnoreDetect()}
     *
     * Next: {@link ParseSpace()} - **BACK TO LEXING**
     */
    function IgnoreNext (ender: string, type: Token): ReturnType<typeof ParseSpace> {

      /**
       * Index from which we will generate a `record.token` for the parse table.
       * We will capture the leading whitespace and newlines starting from the
       * `esthetic-ignore-next` comment.
       */
      const from = b.lastIndexOf(u.lastChar(data.token[parse.count]), parse.iterator) + 1;

      /* -------------------------------------------- */
      /* TRAVERSE                                     */
      /* -------------------------------------------- */

      if (type === Token.LiquidEndTag || type === Token.MarkupEnd) {

        /* -------------------------------------------- */
        /* LEXICAL SCOPE                                */
        /* -------------------------------------------- */

        /** Quotations store reference, is used to skip quotes */
        let i: number = -1;

        /** Tag count should be zero to negate repeating occurances */
        let n: number = 0;

        /** Tag capture letting for matching against `tname` */
        let t: string;

        do {

          // Comment Skipping
          //
          // We need to esnure that comment occurances within the tag blocks
          // are excluded to offset any occurances of tag names.
          //
          if ((tname === 'script' || tname === 'style') && u.is(b[a], cc.FWS)) {
            if (u.is(b[a + 1], cc.FWS)) {
              a = b.indexOf(NWL, a + 1) + 1;
            } else if (u.is(b[a + 1], cc.ARS)) {
              a = source.indexOf('*/', a + 1) + 2;
            }
          }

          // String Handling
          //
          // We need to ensure the string occurances are digested and skipped.
          // This will prevent potention issues from occuring when string structures
          // contain enders or starters.
          //
          //
          if (u.or(b[a], cc.DQO, cc.SQO, cc.TQO)) {

            i = b.indexOf(b[a], a + 1);

            if (i > -1) {

              parse.lineNumber = u.countLines(b.slice(a, i), parse.lineNumber);

              a = i + 1;
              i = -1;

              continue;

            }

            return MarkupError(ParseError.UnterminatedString, source.slice(a));

          }

          if (type === Token.LiquidEndTag) {

            if (u.is(b[a - 2], cc.LCB) && u.is(b[a - 1], cc.PER)) {

              if (u.is(b[a], cc.DSH)) a = a + 1;

              t = source.slice(a).trimStart();

              if (t.startsWith(tname)) {

                a = a + tname.length;
                n = n + 1;
                i = -1;

                continue;

              } else if (t.startsWith(ender)) {

                if (n === 0) {

                  i = b.indexOf('}', a + ender.length) + 1;

                  if (i === -1) return MarkupError(ParseError.MissingLiquidCloseDelimiter, t, tname);

                  a = i;

                  break;

                } else {

                  n = n - 1;
                  a = a + ender.length;

                }
              }

            }

          } else {

            if (
              u.is(b[a - 1], cc.LAN) &&
              source.slice(a, a + tname.length) === tname) {

              ++n;

            } else if (
              u.is(b[a], cc.LAN) &&
              u.is(b[a + 1], cc.FWS) &&
              source.slice(a, a + ender.length) === ender) {

              if (n === 0) {

                a = a + ender.length - 1;

                break;

              } else {

                --n;

              }

            }
          }

          a = a + 1;

        } while (a < c);

        // ERRORS
        //
        // We will quickly ensure that the traversal was successful.
        // if n is more than 0 then we have unclosed tag.
        //
        if (n > 0) {
          if (type === Token.LiquidEndTag) {
            return MarkupError(ParseError.MissingLiquidEndTag, token, tname);
          } else {
            return MarkupError(ParseError.MissingHTMLEndTag, token, tname);
          }
        }

        // Update Parse Table Record
        //
        record.types = 'ignore';
        record.token = token = source.slice(from, a + 1);

        // Align line numbers
        //
        parse.lineNumber = u.countLines(token, parse.lineNumber);

      } else {

        // Update Parse Table Record (this is singleton or void)
        //
        record.types = 'ignore';
        record.token = token = source.slice(from, a + 1);

      }

      attrs = [];
      ignore = false;

      push(record);

    }

    /**
     * Singleton Token
     *
     * Utility function which will re-assign the `ltype` when HTML `void`
     * type tags. This only detects HTML tags, Liquid (template) types are
     * handled by the `LiquidToken()` function.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link IgnoreDetect()}
     *
     * Next: {@link SVGToken()}
     */
    function SingletonToken (): ReturnType<typeof SVGToken> {

      if (basic && !ignore && ltype !== 'xml') {

        if (grammar.html.voids.has(tname)) {

          record.types = ltype = 'singleton';

          if (u.isLastAt(token, cc.FWS)) {
            record.token = token;
          } else {
            record.token = token = token.replace(/\/?\s*>$/, '/>');
          }

        } else if (u.isLastSeq(token, cc.FWS, cc.RAN)) {

          record.types = ltype = 'singleton';

        } else {

          record.types = ltype = 'start';

        }
      }

      return SVGToken();

    }

    /**
     * Parse SVG
     *
     * This will parse SVG tag structures and correctly apply singular
     * types depending upon the stack.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link SingletonToken()}
     *
     * Next: {@link LiquidToken()}
     */
    function SVGToken (): ReturnType<typeof LiquidToken> {

      if (tname === 'svg') {
        svg.start = parse.count + 1;
        record.stack = tname;
      }

      if (svg.start > -1 && grammar.svg.tags.has(tname)) {

        if (record.types === 'start') {

          record.types = 'singleton';
          record.stack = tname;

          svg.tname.push(tname);
          svg.index.push(parse.count + 1);

        } else if (record.types === 'end') {

          /** Index of the tag name in {@link svg.tname} store */
          const i = svg.tname.indexOf(tname);

          /** Last Index of the tag name in {@link svg.tname} store */
          const e = svg.tname.lastIndexOf(tname);

          /** References an index within {@link svg.index} store */
          let x: number;

          if (i > -1) {
            if (e === i) {

              x = svg.index[e];

              data.types[svg.index[e]] = 'start';

              svg.tname.splice(e, 1);
              svg.index.splice(e, 1);

            } else {

              if (data.begin[parse.count] === svg.index[i]) {

                x = data.begin[parse.count];

                data.types[data.begin[parse.count]] = 'start';

                svg.tname.splice(i, 1);
                svg.index.splice(i, 1);

              } else {

                x = svg.index[e];
                data.types[svg.index[e]] = 'start';

              }
            }

            for (let s = data.stack.length; x < s; x++) {

              data.stack[x] = tname;
              parse.stack.push([ tname, x ]);

            }

          }

          if (tname === 'svg') svg.start = -1;

        }

      }

      return LiquidToken();

    }

    /**
     * Parse Liquid
     *
     * This will parse template identified tokens and tags (Liquid).
     * It aligns the the data `record` for identification.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link SVGToken()}
     *
     * Next: {@link AttributeToken()} _see below note as next call is not definitive_
     *
     * > **NOTE**
     * >
     * > This function applies determination logic. `AttributeToken()` _might_ not be next.
     * > If the token is a Liquid `{% capture %}`, then {@link LiquidTokenCapture()} will be next.
     * > If the token is not of Liquid type, or then {@link CDATA()} will be next.
     * > If the function falls through, same as non-liquid types {@link CDATA()} will be run.
     */
    function LiquidToken (): ReturnType<typeof LiquidEncapsulate | typeof LiquidTokenCapture | typeof AttributeToken> {

      /* -------------------------------------------- */
      /* LIQUID TOKEN                                 */
      /* -------------------------------------------- */

      if (!record.types.includes('liquid')) {
        LiquidEncapsulate();
        return CDATA();
      }

      if (record.token === NIL) record.token = token;

      if (u.is(token[0], cc.LCB) && u.is(token[1], cc.PER)) {

        if (grammar.liquid.else.has(tname)) {

          if (parse.stack.token === 'case' && (tname === 'when' || tname === 'else')) {
            record.types = u.is(tname, 'e') ? 'liquid_case_else' : 'liquid_when';
          } else {
            record.types = 'liquid_else';
          }

        } else if (grammar.liquid.tags.has(tname)) {

          if (tname === 'capture') return LiquidTokenCapture();

          if (embed === true) record.types = ltype = 'liquid_start';

          record.types = ltype = tname === 'case'
            ? 'liquid_case_start'
            : 'liquid_start';

          return AttributeToken();

        } else if (tname.startsWith('end')) {

          const name = tname.slice(3);

          if (grammar.liquid.tags.has(name)) {

            record.types = ltype = name === 'case'
              ? 'liquid_case_end'
              : 'liquid_end';

          } else {

            // Unknown tag handling for situations where a custom endtag
            // name is used, we will look for a matching start tag name
            //
            record.stack = name;
            record.types = ltype = 'liquid_end';

            let i = 0;

            do {

              if (data.types[i] === 'liquid' && data.stack[i] === name) {

                data.types[i] = 'liquid_start';

                for (let x = i; x < data.stack.length; x++) {
                  parse.stack.push([ data.token[x], x ]);
                }

                break;
              }

              i = data.stack.indexOf(name, i + 1);

            } while (i > -1);

          }

          LiquidEncapsulate();

        } else {

          record.stack = tname;

        }
      }

      if (rules.singleQuote === 'never' || rules.singleQuote === 'markup') {

        record.token = token = record.token.replace(/'[^"]*?'/g, u.qc(DQO));

      } else if (rules.singleQuote === 'always' || rules.singleQuote === 'liquid') {

        record.token = token = record.token.replace(/"[^']*?"/g, u.qc(SQO));

      }

      return CDATA();

    }

    /**
     * Liquid Encapsulate
     *
     * Structural test for Liquid conditional syntactical expressions,
     * wherein a `start` or `end` type markup type is encapsulated within
     * a liquid conditional, for example:
     *
     * ```liquid
     *
     * {% if x %}
     *   <div>
     * {% endif %}
     *
     * {% if x %}
     *   </div>
     * {% endif %}
     *
     * ```
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link LiquidToken()}
     *
     */
    function LiquidEncapsulate (): void {

      if (parse.count > 0) {

        if (ltype === 'liquid_end' && (
          data.types[parse.count] === 'start' ||
          data.types[parse.count].includes('attribute'))) {

          let i: number = parse.count;
          let p: number = 0;

          do {
            if (data.types[i] === 'end') p = i;
            if (data.types[i] === 'start') p === 0 ? data.types[i] = 'liquid_markup_start' : --p;
          } while (--i > data.begin[record.begin]);

        } else if (ltype === 'end' && data.types[parse.count] === 'liquid_start') {

          record.types = 'liquid_markup_end';

        }
      }
    }

    /**
     * Liquid Capture
     *
     * Liquid `{% capture %}` tokens are handled a little differently
     * than other Liquid tokens. We will preserve the inner contents of
     * Liquid captures and assign it a unique `types`. This function carries
     * out the traversal and parse for this.
     *
     * This is recursive function, and will continue will return itself to
     * determine whether or not next token is a capture.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link LiquidToken()}
     *
     * Next: {@link ParseSpace()} - **BACK TO LEXING**
     */
    function LiquidTokenCapture (): ReturnType<typeof ParseSpace> {

      let i = a;
      let d = 1;
      let n = -1;

      while (i < c) {

        const start = source.slice(i).match(/{%-?\s*(?:end)?capture/);
        if (!start) break;

        if (/endcapture/.test(start[0])) {
          n = start.index + start[0].length;
          i = i + n;
          break;
        }

        i = i + start.index + start[0].length;
        d = 1;

        while (d > 0 && i < c) {

          n = source.indexOf('{%', i);

          if (n === -1) break;

          d += regex.CaptureBegin.test(source.slice(n))
            ? 1
            : regex.EndCaptureBegin.test(source.slice(n))
              ? -1
              : 0;

          i = n + 2;
        }

        i += 10;
      }

      i = b.indexOf('}', i) + 1;

      // Consume an ending newline
      //
      // In some cases the next character might be a newline
      // if the occurs, we need to to ensure to include it when
      // applying the slice.
      //
      //
      token += source.slice(a + 1, i);

      if (n < 0) return MarkupError(ParseError.MissingLiquidEndTag, token, tname);

      parse.lineNumber = u.countLines(token, parse.lineNumber);

      push(record, { token, types: 'liquid_capture' });

      a = i;

      ParseSpace();

    }

    /**
     * Parse Liquid Tag
     *
     * This will parse a Liquid tag `{% liquid %}` who's inner contents
     * contain liquid expressions
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link TokenLexer()} _see below note as prev call is not definitive_
     *
     * Next: {@link ParseSpace()} - **BACK TO LEXING**
     *
     * > **NOTE**
     * >
     * > The previous call may not come from `TokenLexer()` but instead, depending
     * > on analysis, the {@link IgnoreDetect()} function might be the previous caller.
     */
    function LiquidTagToken (): ReturnType<typeof ParseSpace> {

      /** Iterator reference */
      let i = token.indexOf('liquid') + 6;

      /** The atomic token reference */
      let liner = NIL;

      /** The Liquid tag name */
      let lname = NIL;

      /** Stack names */
      let stack = 0;

      /** The lines offset reference */
      let lines = 1;

      // Inserts the starting token into the data struture, eg: {% liquid
      //
      push(record, {
        token: lq.openDelims(token.slice(0, i), rules),
        types: 'liquid_tag_start',
        stack: 'liquid'
      });

      /** Split token onto newlines */
      const nl = token.slice(i).split(NWL);

      /** The last known token, expected to be ending delimiter */
      const ender = nl.pop().trim();

      /** Matches ending delimiter, checking for trim occurances */
      const match = u.is(ender[ender.length - 3], cc.DSH) ? ender.length - 3 : ender.length - 2;

      /** Remove any extraneous spacing and ensure ender is safe */
      const slice = ender.slice(0, match);

      /** The delimiter match */
      const delim = ender.slice(match);

      if (slice.length !== 0) nl.push(slice);

      i = 0; // Reset Iterators

      do {

        liner = nl[i].trim();
        lname = liner.split(/\s/)[0];

        if (lname.startsWith('end')) {

          record.token = liner;
          record.types = lname === 'endcase' ? 'liquid_case_end' : 'liquid_end';
          record.lines = lines <= 1 ? 2 : lines;

          if (lname === 'endcase' && stack > 0) --stack;
          push(record);

          lines = 1;

        } else if (lname.startsWith('#')) {

          record.token = liner;
          record.types = 'liquid';
          record.lines = lines <= 1 ? 2 : lines;

          push(record);

          lines = 1;

        } else if (lname.startsWith('comment')) {

          record.token = liner;
          record.types = 'liquid_start';
          record.lines = lines;

          push(record);

          lines = 1;

        } else {

          if (grammar.liquid.tags.has(lname)) {

            record.token = liner;
            record.types = lname === 'case' ? 'liquid_case_start' : 'liquid_start';
            record.lines = lines;

            if (lname === 'case') {
              ++stack;
              record.stack = lname;
            }

            push(record);

            lines = 1;

          } else if (grammar.liquid.else.has(lname)) {

            record.token = liner;
            record.lines = lines;
            record.types = lname === 'when'
              ? 'liquid_when'
              : stack > 0
                ? 'liquid_case_else'
                : 'liquid_else';

            push(record);

            lines = 1;

          } else if (grammar.liquid.singleton.has(lname)) {

            record.token = liner;
            record.types = 'liquid';
            record.lines = lines <= 1 ? 2 : lines;

            push(record);

            lines = 1;

          } else if (liner.length > 0) {

            record.token = liner;
            record.types = 'content';
            record.lines = lines;

            push(record);

            lines = 1;

          }

        }

        lines = lines + 1;

      } while (++i < nl.length);

      if ((
        rules.delimiterPlacement === 'newline-multiline'
      ) || (
        rules.delimiterPlacement === 'preserve' &&
        regex.LiquidRightDelimiterNL.test(token)
      ) || (
        rules.delimiterPlacement === 'consistent' &&
        regex.LiquidLeftDelimiterNL.test(token)
      )) {

        push(record, {
          token: delim,
          types: 'liquid_tag_end',
          lines,
          stack: 'liquid'
        });

      } else {

        push(record, {
          token: delim,
          types: 'liquid_tag_end',
          lines,
          stack: 'liquid'
        });

      }

    }

    /**
     * Parse CDATA - **CURRENTLY NOT IN USE**
     *
     * Handling for <![CDATA[   ]]> markup (html) type comment expressions.
     * While rare this function correctly composes the data structures.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link LiquidToken()}
     *
     * Next: {@link AttributeToken()}
     */
    function CDATA (): ReturnType<typeof AttributeToken> {

      if (ltype !== 'cdata') return AttributeToken();

      // const { stack } = record;

      // if (stack === 'script' || stack === 'style') {

      //   const x = external.determine(stack, 'html');

      //   let begin = parse.count;
      //   let ender = parse.count;

      //   if (data.types[ender] === 'attribute') {
      //     do {
      //       begin = begin - 1;
      //       ender = ender - 1;
      //     } while (data.types[ender] === 'attribute' && ender > -1);
      //   }

      //   token = token.replace(/^(\s*<!\[cdata\[)/i, NIL).replace(/(\]{2}>\s*)$/, NIL);

      //   push(record, { begin, token: '<![CDATA[', types: 'cdata_start' });

      //   parse.stack.push([ 'cdata', parse.count ]);
      //   parse.external(stack);
      //   prettify.lexers[stack](token);

      //   push(record, { begin: parse.stack.index, token: ']]>', types: 'cdata_end' });

      //   parse.stack.pop();
      // }

      return AttributeToken();

    }

    /**
     * Attribute Token
     *
     * The attribute lexer and tokenizer. This reasons with the traversed
     * tokens and populates the data structure. It is only responsible for
     * attribute expressions.
     *
     * ---
     *
     * **CALL STACK**
     *
     * Prev: {@link PhrasingToken()}
     *
     * Next: {@link ParseSpace()}
     */
    function AttributeToken (advance = false): ReturnType<typeof ParseSpace> {

      /* PUSH RECORD -------------------------------- */

      if (advance !== null) push(record);

      if (u.is(b[a], cc.RAN) && u.is(b[a + 1], cc.FWS)) return;

      // console.log(embed, end, ignore, preserve, token, b.slice(a).join(NIL));

      /* -------------------------------------------- */
      /* CONSTANTS                                    */
      /* -------------------------------------------- */

      /** The index of data record in the tree, references {@link parse.count} */
      const begin: number = parse.count;

      /** The tag name as per stack, i.e, `tname` */
      const stack = tname.replace(/\/$/, NIL);

      /* -------------------------------------------- */
      /* LOCAL SCOPES                                 */
      /* -------------------------------------------- */

      /** The current index of the attribute */
      let idx: number = 0;

      /** Equals `=` operator index in the token */
      let eq: number = 0;

      /** Double quotation `"` index in the token */
      let dq: number = 0;

      /** The attribute name, e.g: `id` in `id="foo"` */
      let name: string = NIL;

      /** The attribute value, e.g: `foo` in `id="foo" ` */
      let value = NIL;

      /** The amount of attributes in the {@link attrs} store, i.e: `attrs.length` */
      const len = attrs.length;

      /* -------------------------------------------- */
      /* FUNCTIONS                                    */
      /* -------------------------------------------- */

      /**
       * Convert Quotes
       *
       * Converts quotation characters and pushes the attribute record.
       */
      function QuoteConvert () {

        if (parse.attributes.has(begin) && u.notLast(record.token, cc.RAN) && idx + 1 === len) {

          record.token = record.token + '>';

        }

        /** Whether or not our record type is liquid */
        let isLiquid = record.types.includes('liquid_attribute');

        if (ignore === true || rules.singleQuote === 'preserve' || !record.types.includes('attribute') || (
          !isLiquid && rules.singleQuote === 'always' &&
          !record.token.includes(DQO)
        ) || (
          !isLiquid && rules.singleQuote === 'never' &&
          !record.token.includes(SQO)
        )) {

          push(record);

        } else {

          /** The start of the quote index */
          let qs = 0;

          /** Whether or not quote content should be walked */
          let qw = false;

          /** The entire attribute split */
          const qc = record.token.split(NIL);

          /** The index of the attribute equals character */
          const eq = record.token.indexOf('=');

          /** The index of the quotation end */
          const qe = qc.length - 1;

          if (
            u.not(qc[eq + 1], cc.DQO) &&
            u.notLast(qc, cc.DQO) &&
            !isLiquid &&
            !record.token.slice(eq + 1, qe).includes(DQO) && (
              rules.singleQuote === 'always' ||
              rules.singleQuote === 'markup')) {

            push(record);

          } else if (
            u.not(qc[eq + 1], cc.SQO) &&
            u.notLast(qc, cc.SQO) &&
            !isLiquid &&
            !record.token.slice(eq + 1, qe).includes(SQO) && (
              rules.singleQuote === 'never' ||
              rules.singleQuote === 'liquid')) {

            push(record);

          } else {

            qs = eq + 2;

            if (isLiquid === false) {
              if (
                rules.singleQuote === 'never' ||
                rules.singleQuote === 'liquid') {
                qw = record.token.slice(qs, qe).includes(DQO);
                qc[eq + 1] = DQO;
                qc[qe] = DQO;
              } else if (
                rules.singleQuote === 'always' ||
                rules.singleQuote === 'markup') {
                qw = record.token.slice(qs, qe).includes(SQO);
                qc[eq + 1] = SQO;
                qc[qe] = SQO;
              }
            }

            if (qw === true || isLiquid === true) {

              isLiquid = false;

              do {

                if (u.is(qc[qs - 1], cc.LCB) && u.or(qc[qs], cc.PER, cc.LCB)) {
                  isLiquid = true;
                } else if (u.is(qc[qs], cc.RCB) && u.or(qc[qs - 1], cc.PER, cc.RCB)) {
                  isLiquid = false;
                }

                if (isLiquid === true) {
                  if (u.is(qc[qs], cc.DQO) && (
                    rules.singleQuote === 'always' ||
                    rules.singleQuote === 'liquid')) {
                    qc[qs] = SQO;
                  } else if (u.is(qc[qs], cc.SQO) && (
                    rules.singleQuote === 'never' ||
                    rules.singleQuote === 'markup')) {
                    qc[qs] = DQO;
                  }
                } else {
                  if (u.is(qc[qs], cc.SQO) && (
                    rules.singleQuote === 'never' ||
                    rules.singleQuote === 'liquid')) {
                    qc[qs] = DQO;
                  } else if (u.is(qc[qs], cc.DQO) && (
                    rules.singleQuote === 'always' ||
                    rules.singleQuote === 'markup')) {
                    qc[qs] = SQO;
                  }
                }

                // Ensure we dont incorrectly nest quotation
                //
                if (u.is(qc[eq + 1], cc.SQO) && u.is(qc[qs], cc.SQO)) qc[qs] = DQO;
                if (u.is(qc[eq + 1], cc.DQO) && u.is(qc[qs], cc.DQO)) qc[qs] = SQO;

                qs = qs + 1;

              } while (qs < qe);
            }

            record.token = qc.join(NIL);

            push(record);

          }
        }
      };

      /**
       * Liquid Attributes
       *
       * Liquid infused attribute handling for record type assignment. Accepts an
       * optional `skipEnd` parameter to prevent checking of `endtag` liquid tokens.
       */
      function LiquidAttribute (): boolean {

        if (lq.isChain(attrs[idx][0])) {

          record.types = 'liquid_attribute_chain';
          record.token = attrs[idx][0];

        } else if (lq.isEnd(attrs[idx][0])) {

          record.token = attrs[idx][0];
          record.types = 'liquid_attribute_end';
          record.ender = record.begin;

        } else if (lq.isStart(attrs[idx][0], true)) {

          record.types = 'liquid_attribute_start';
          record.begin = parse.count;
          record.token = attrs[idx][0];

          QuoteConvert();

          return true;

        } else if (lq.isElse(attrs[idx][0])) {

          record.types = 'liquid_attribute_else';
          record.token = attrs[idx][0];

        } else {

          record.types = 'attribute';
          record.token = attrs[idx][0];

        }

        QuoteConvert();

        return false;

      }

      /* -------------------------------------------- */
      /* TOKENIZE                                     */
      /* -------------------------------------------- */

      if (attrs.length < 1) {
        if (!advance) return;
        parse.lineOffset = 0;
        return ParseSpace();
      }

      // Fixes Singleton Tags
      //
      // Since a forward slash "/" character at
      // the end of the tag then this is not an attribute
      //
      if (u.is(attrs[attrs.length - 1][0], cc.FWS)) {
        attrs.pop();
        token = token.replace(/>$/, '/>');
      }

      // Reconnects attribute names to their respective values if separated on "="
      eq = attrs.length;
      dq = 1;

      if (dq < eq) {
        do {

          name = attrs[dq - 1][0];

          if (u.isLast(name, cc.EQS) && !attrs[dq][0].includes('=')) {
            attrs[dq - 1][0] = name + attrs[dq][0];
            attrs.splice(dq, 1);
            eq = eq - 1;
            dq = dq - 1;
          }

        } while (++dq < eq);
      }

      // Attribute Sorting
      if (rules.attributeSort !== false) {
        attrs = sortAttrs(attrs, rules.attributeSort === true ? undefined : rules.attributeSort);
      }

      record.begin = begin;
      record.stack = stack;
      record.types = 'attribute';

      if (idx < len) {

        do {

          if (u.isUndefined(attrs[idx])) break;

          record.lines = attrs[idx][1];

          attrs[idx][0] = attrs[idx][0].replace(regex.SpaceEnd, NIL);

          if (attrs[idx][1] <= 1 && lq.isChain(attrs[idx][0])) {
            if (!lq.isValue(attrs[idx][0])) {

              record.types = 'liquid_attribute_chain';
              record.token = attrs[idx][0];

              QuoteConvert();

              idx = idx + 1;
              continue;
            }
          }

          eq = attrs[idx][0].indexOf('=');
          dq = attrs[idx][0].indexOf(DQO);

          if (eq < 0) {

            if (lq.isEnd(attrs[idx][0])) {

              record.token = attrs[idx][0];
              record.types = 'liquid_attribute_end';
              record.ender = record.begin;

            } else if (lq.isStart(attrs[idx][0], true)) {

              record.types = 'liquid_attribute_start';
              record.begin = parse.count;
              record.token = attrs[idx][0];

            } else if (lq.isElse(attrs[idx][0])) {

              record.types = 'liquid_attribute_else';
              record.token = attrs[idx][0];

            } else if (lq.isOutput(attrs[idx][0])) {

              record.types = 'liquid_attribute';
              record.token = attrs[idx][0];

            } else if (u.or(attrs[idx][0], cc.HSH, cc.LSB, cc.LCB)) {

              record.token = attrs[idx][0];

            } else {
              record.types = 'attribute';
              record.token = (rules.attributeCasing === 'lowercase' || rules.attributeCasing === 'lowercase-name')
                ? attrs[idx][0].toLowerCase()
                : attrs[idx][0];
            }

            QuoteConvert();

          } else if (lq.getTokenType(attrs[idx][0], 6)) {

            LiquidAttribute();

          } else {

            // Separates out the attribute name from its value
            // We need context of the attribute expression for
            // dealing with and handling Liquid attributes specifically
            //
            name = attrs[idx][0].slice(0, eq);
            value = attrs[idx][0].slice(eq + 1);

            switch (rules.attributeCasing) {
              case 'lowercase-name':
                name = name.toLowerCase();
                attrs[idx][0] = name + '=' + value;
                break;
              case 'lowercase-value':
                value = value.toLowerCase();
                attrs[idx][0] = name + '=' + value;
                break;
              case 'lowercase':
                name = name.toLowerCase();
                value = value.toLowerCase();
                attrs[idx][0] = name + '=' + value;
                break;
              default:
                attrs[idx][0] = name + '=' + value;
                break;
            }

            if (
              u.not(value, cc.LAN) &&
              u.not(value, cc.LCB) &&
              u.not(value, cc.EQS) &&
              u.not(value, cc.DQO) &&
              u.not(value, cc.SQO)
            ) {

              value = DQO + value + DQO;

            }

            if (lq.getTokenType(name, 6)) {

              LiquidAttribute();

            } else {

              record.types = 'attribute';
              record.token = attrs[idx][0];

              QuoteConvert();

            }

          }

          idx = idx + 1;

        } while (idx < len);

      }

      if (!advance) parse.lineOffset = 0;

    };

    /**
     * Bad Liquid
     *
     * Handling for Liquid tokens which are used to express tag names.
     */
    function BadLiquidToken (offset: number) {

      const from: number = a;

      let i: number = a + offset;

      do {

        if (u.is(b[i], cc.RAN)) {
          a = i;
          return source.slice(from, i + 1);
        }

        i = i + 1;
      } while (i < c);

    }

    /* -------------------------------------------- */
    /* INVOKE                                       */
    /* -------------------------------------------- */

    Delimiters();

  }

  /**
   * Parse Content
   *
   * This function is responsible for parsing everything
   * other than markup identified tags.
   */
  function ParseContent (): void {

    /** Initial data record state for the parsed content */
    const record: Record = create({
      begin: parse.stack.index,
      stack: u.getTagName(parse.stack.token) || 'global',
      types: 'content'
    });

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    /** The lexed store that will be populated string characters */
    const lexed: string[] = [];

    /** The current index of which the parse began, references {@link a} */
    const now = a;

    /* -------------------------------------------- */
    /* LEXICAL SCOPES                               */
    /* -------------------------------------------- */

    /** The last known token */
    let ltoke: string = NIL;

    /** The number of line spaces incurred, see: {@link parse.lineOffset} */
    let lines: number = parse.lineOffset;

    /** The current language enumerable, defaults to {@link Languages.HTML} */
    let type: Languages = Languages.HTML;

    /** The tag name or a known name reference */
    let name: string = NIL;

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    if (!u.ws(b[a - 1])) {

      record.lines = 0;

    }

    if (parse.stack.index > -1) {

      name = u.getTagName(data.token[parse.stack.index]);

      if (data.types[parse.stack.index].startsWith('liquid_')) {

        type = Languages.Liquid;

      }

    } else {

      name = u.getTagName(data.token[data.begin[parse.count]]);

      if (
        data.begin[parse.count] > -1 &&
        data.types[data.begin[parse.count]].startsWith('liquid_')) {

        type = Languages.Liquid;

      }
    }

    if (embed === true) {

      // EMPTY CONTENTS
      //
      // Handle occurances of empty inner embedded code regions.
      //
      //
      if (type === Languages.Liquid) {

        if (source.slice(a, source.lastIndexOf('{', source.indexOf(`end${name}`, a))).trim() === NIL) {

          embed = false;
          record.types = 'liquid_end';

        }

      } else {

        if (type === Languages.HTML && (name === 'script' || name === 'style')) {

          if (source.slice(a, source.indexOf('</script>', a)).trim() === NIL) {

            embed = false;
            record.types = 'end';

          } else if (source.slice(a, source.indexOf('</style>', a)).trim() === NIL) {

            embed = false;
            record.types = 'end';

          }

        }
      }
    }

    /* -------------------------------------------- */
    /* FUNCTIONS                                    */
    /* -------------------------------------------- */

    /**
     * SGML Test
     *
     * Checks parsed token for SGML sequence expression
     */
    function sgml () {

      return (
        data.types[parse.count] === 'liquid_start' &&
        data.token[parse.count].indexOf('<!') === 0 &&
        data.token[parse.count].indexOf('<![') < 0 &&
        data.token[parse.count][data.token[parse.count].length - 1] === cc.LSB &&
        u.is(b[a], cc.RSB)
      );

    }

    /**
     * ESC Test
     *
     * Checks for escaped character sequence using backslash.
     */
    function esctest () {

      let aa = a - 1;
      let bb = 0;

      if (u.not(b[a - 1], cc.BWS)) return false;

      if (aa > -1) {
        do {
          if (u.not(b[aa], cc.BWS)) break;
          bb = bb + 1;
          aa = aa - 1;
        } while (aa > -1);
      }

      return bb % 2 === 1;

    };

    /**
     * Content Test
     *
     * Checks to ensure we are dealing with text content sequence.
     * The function will perform analysis on the current character
     * being lexed and if it encounters a sequence of characters which
     * represent a tag expression a boolean `false` will be returned.
     *
     * Determination looks for the following sequences:
     *
     * > - `<\S` Left bracket followed by non-whitespace
     * > - `{%` Liquid tag delimiter
     * > - `{{` Liquid object tag delimiter
     *
     * It is important to not that content determination will also use
     * existing reference such as {@link embed} being `false` and {@link lexed}
     * length being **more than** `0` If the advancement index ({@link a}) is
     * equal to source length {@link c} then `true` will be returned.
     */
    function content () {

      return (embed === false && lexed.length > 0 && ((
        u.is(b[a], cc.LAN) &&
        u.ns(b[a + 1])
      ) || (
        u.is(b[a], cc.LCB) &&
        u.is(b[a + 1], cc.PER)
      ) || (
        u.is(b[a], cc.LCB) &&
        u.or(b[a + 1], cc.LCB, cc.PER)
      ) || (a === c)));

    }

    /* -------------------------------------------- */
    /* PARSE HANDLERS                               */
    /* -------------------------------------------- */

    if (a < c) {

      /** Ending token/character value, e.g: `{% endtag %}` or `</end>` etc */
      let ender: string = NIL;

      /** External output string capture */
      let output: string = NIL;

      /** Character reference */
      let quote: string = NIL;

      /** Quotation character quotes */
      let quotes: number = 0;

      /* -------------------------------------------- */
      /* TRAVERSE                                     */
      /* -------------------------------------------- */

      do {

        // Increment the newline references
        //
        if (u.is(b[a], cc.NWL)) {

          lines = parse.lines(a, lines);

        }

        // Embed code requires additional parsing to look for the appropriate end
        // tag, but that end tag cannot be quoted or commented. This condition will
        // perform handling of embedded (external) code regions and pass content to
        // different lexers for processing. Varying operations are had in this cycle
        // it is somewhat expensive and may not always be perfect, but suffices.
        //
        if (embed === true) {

          if (type === Languages.Liquid) {

            /** Liquid ending tag name, e.g: `endtag` */
            const ename = `end${name}`;

            /** The index location of the {@link ename} in {@link source} */
            const close = source.indexOf(ename, a);

            if (close > -1) {

              /** Index position of the starting `{` delimiter of `{% endtag %}` */
              const from = b.lastIndexOf('{', close);

              /** Index position of the ending `}` delimiter of `{% endtag %}` */
              const next = b.indexOf('}', close + ename.length) + 1;

              ender = source.slice(from, next);

              if (lq.exp(ename).test(ender)) {

                lines = 1;
                output = b.slice(a, from).join(NIL); // originally source.slice()

                parse.external(language, output);

                if (lines !== parse.lineOffset) lines = parse.lineOffset;

                record.token = inner(ender);
                record.types = 'liquid_end';
                record.lines = lines;

                push(record);

                a = next - 1;
                embed = false;

                break;
              }

            }

          }

          if (quote === NIL) {

            if (u.is(b[a], cc.FWS)) {

              if (u.is(b[a + 1], cc.ARS)) {

                quote = '*';

              } else if (u.is(b[a + 1], cc.FWS)) {

                quote = '/';

              } else if (name === 'script' && u.not(b[a - 1], cc.LAN) && '([{!=,;.?:&<>'.includes(b[a - 1])) {

                quote = 'r';

              }

            } else if (!esctest() && (u.is(b[a], cc.DQO) || u.is(b[a], cc.SQO) || u.is(b[a], cc.TQO))) {

              quote = b[a];

            }

            if (name === 'script' && u.is(b[a], cc.LAN) && u.is(b[a + 1], cc.FWS)) {

              ender = source.slice(a, a + 9).toLowerCase();

              if (ender === '</script>') {

                if (lexed.length < 1) break;

                output = lexed.join(NIL).trimEnd();

                if (regex.HTMLCommDelimOpen.test(output) && regex.HTMLCommDelimClose.test(output)) {

                  push(record, { token: '<!--', types: 'comment' });

                  output = output
                    .replace(regex.HTMLCommDelimOpen, NIL)
                    .replace(regex.HTMLCommDelimClose, NIL);

                  parse.external('javascript', output);

                  push(record, { token: '-->' });

                } else {

                  parse.external(language, output);

                  record.token = ender;
                  record.types = 'end';

                  a = a - 1;

                }

                break;

              }

            } else if (name === 'style' && u.is(b[a], cc.LAN) && u.is(b[a + 1], cc.FWS)) {

              ender = source.slice(a, a + 8).toLowerCase();

              if (ender === '</style>') {

                if (lexed.length < 1) break;

                output = lexed.join(NIL).trimEnd();

                if ((regex.HTMLCommDelimOpen).test(output) && (regex.HTMLCommDelimClose).test(output)) {

                  push(record, { token: '<!--', types: 'comment' });

                  output = output
                    .replace(regex.HTMLCommDelimOpen, NIL)
                    .replace(regex.HTMLCommDelimClose, NIL);

                  parse.external('css', output);

                  push(record, { token: '-->' });

                } else {

                  parse.external(language, output);

                  record.token = ender;
                  record.types = 'end';

                  a = a - 1;

                }

                break;

              }

            }

          } else if (quote === b[a] && !esctest() && (
            u.is(quote, cc.DQO) ||
            u.is(quote, cc.SQO) ||
            u.is(quote, cc.TQO) || (u.is(quote, cc.ARS) && u.is(b[a + 1], cc.FWS))
          )) {

            if (u.is(b[a], cc.DQO) && language === 'json') {

              quotes = quotes === 1 ? 0 : 1;

            }

            quote = NIL;

          } else if (u.is(quote, cc.TQO) && u.is(b[a], cc.DOL) && u.is(b[a + 1], cc.LCB) && !esctest()) {

            quote = '}';

          } else if (u.is(quote, cc.RCB) && u.is(b[a], cc.RCB) && !esctest()) {

            quote = '`';

          } else if (u.is(quote, cc.FWS) && (u.is(b[a], cc.NWL) || u.is(b[a], cc.CAR))) {

            quote = NIL;

          } else if (quote === 'r' && u.is(b[a], cc.FWS) && !esctest()) {

            quote = NIL;

          } else if (
            u.is(quote, cc.FWS) &&
            u.is(b[a], cc.RAN) &&
            u.is(b[a - 1], cc.DSH) &&
            u.is(b[a - 2], cc.DSH)
          ) {

            ender = source.slice(a + 1, a + 11).toLowerCase();
            ender = ender.slice(0, ender.length - 2);

            if (name === 'script' && ender === '</') {

              quote = NIL;

            }

            ender = ender.slice(0, ender.length - 1);

            if (name === 'style' && ender === '</style') {

              quote = NIL;

            }

          } else if (
            language === 'json' &&
            quotes === 1 &&
            u.is(b[a], cc.NWL) &&
            esctest() === false) {

            MarkupError(ParseError.UnterminatedJSONString, 'json');

          }
        }

        // Typically this logic is for artifacts nested within an SGML tag
        //
        if (sgml()) {

          a = a - 1;

          lines = 0;
          ltoke = lexed.join(NIL).replace(regex.SpaceEnd, NIL);

          push(record, { token: ltoke });

          break;

        }

        // General Content Processing
        //
        // It is here where we detect markup or Liquid delimiter structures
        // and break out of the traversal cycle.
        //
        if (content()) {

          // Plaintext sructures or occurances where there is only text content
          // the content() function will return true before the last known character
          // is reached within the advancement "a" reference.
          //
          // We need determine the this is the case by looking at the parse.count value
          // and peek forward to see if next character in advancement is (infact) the last.
          //
          if (a + 1 === c && parse.count === -1) {

            lexed.push(b[a]);

          } else {

            a = a - 1;

          }

          // lines = 0;
          ltoke = parse.stack.token === 'comment'
            ? lexed.join(NIL)
            : lexed.join(NIL).replace(regex.SpaceEnd, NIL);

          if (rules.textPreserve === true) {

            ltoke = wsbefore(now, ltoke);

            push(record, { token: ltoke });

          } else {

            push(record, { token: ltoke });

            record.lines = lines;
            lines = 0;

          }

          break;

        }

        lexed.push(b[a]);

        a = a + 1;

      } while (a < c);

    }

    if (a > now && a < c) {

      if (u.ws(b[a])) {

        let x: number = a;

        parse.lineOffset = parse.lineOffset + 1;

        do {

          if (u.is(b[x], cc.NWL)) {
            parse.lineNumber = parse.lineNumber + 1;
            parse.lineOffset = parse.lineOffset + 1;
          }

          x = x - 1;

        } while (x > now && u.ws(b[x]));

      } else {

        parse.lineOffset = 0;

      }

    } else if (a !== now || (a === now && embed === false)) {

      // Regular content at the end of the supplied source
      //
      if (type === Languages.Liquid && record.types === 'liquid_end') {

        ltoke = inner(lexed.join(NIL).trimEnd());

      } else {

        ltoke = lexed.join(NIL).trimEnd();

      }

      lines = 0;

      // This condition prevents adding content that was
      // just added in the loop above.
      //
      if (record.token !== ltoke) {

        if (type === Languages.Liquid && record.types === 'liquid_end') {

          ltoke = inner(ltoke);

        }

        push(record, { token: ltoke });

        parse.lineOffset = 0;

      }
    }

    embed = false;

  };

  /**
   * Parse Space
   *
   * This function is responsible for parsing whitespace
   * characters and newlines. The lexical `a` scope is incremented
   * and both `parse.lineNumber` and `parse.lineOffset` are
   * updated accordinly.
   */
  function ParseSpace (): void {

    parse.lineOffset = 1;

    do {

      if (u.is(b[a], cc.NWL)) {
        parse.lineIndex = a;
        parse.lineOffset = parse.lineOffset + 1;
        parse.lineNumber = parse.lineNumber + 1;
      }

      if (u.ws(b[a + 1]) === false) break;

      a = a + 1;

    } while (a < c);

  }

  /* -------------------------------------------- */
  /* LEXING                                       */
  /* -------------------------------------------- */

  do {

    if (parse.error) return data;

    if (u.ws(b[a])) {

      ParseSpace();

    } else if (embed) {

      ParseContent();

    } else if (u.is(b[a], cc.LAN) || (u.is(b[a], cc.LCB) && u.or(b[a + 1], cc.LCB, cc.PER))) {

      ParseToken();

    } else if (u.is(b[a], cc.DSH) && u.is(b[a + 1], cc.DSH) && u.is(b[a + 2], cc.DSH)) {

      ParseToken('---');

    } else {

      ParseContent();

    }

    ++a;

    if (a === c) {
      if (parse.stack.index in parse.pairs) {
        const pair = parse.pairs[parse.stack.index];
        if (pair.type === Languages.HTML) {
          SyntacticError(ParseError.MissingHTMLEndTag, pair);
        }
      }
    }

  } while (a < c);

  return data;

};
