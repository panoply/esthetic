import type { Record, Types, LanguageName, LiquidInternal } from 'types/index';
import { parse } from 'parse/parser';
import { sortSafe } from 'parse/sorting';
import { grammar } from 'parse/grammar';
import { MarkupError, SyntacticError } from 'parse/errors';
import { commentBlock } from 'comments';
import { DQO, NIL, NWL, SQO, WSP } from 'chars';
import * as external from 'parse/external';
import { ParseError } from 'lexical/errors';
import { cc } from 'lexical/codes';
import * as rx from 'lexical/regex';
import * as lx from 'lexical/lexing';
import * as lq from 'lexical/liquid';
import * as u from 'utils/helpers';
import { assign } from 'utils/native';
import { Languages } from 'lexical/enum';

/**
 * Markup Lexer
 *
 * Used to parse markup languages. This used to be used for multiple
 * template languages in options but has been refactored to solely
 * focus and support the following language only:
 *
 * - Liquid
 * - HTML
 * - XML
 * - JSX
 * - TSX
 */
export function markup (input?: string) {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * Deconstructed parser references
   */
  const { data, rules } = parse;

  /**
   * Source string, typically called from `parse.source` but can also be `input` parameter
   */
  const source = input || parse.source;

  /**
   * Whether or not language mode is TSX / JSX
   */
  const jsx = parse.language === 'jsx' || parse.language === 'tsx';

  /**
   * Ignored Liquid Tags
   */
  const ignored = new Set(rules.liquid.ignoreTagList);

  /**
   * Attribute sorting list length
   */
  const asl = u.isArray(rules.markup.attributeSort) ? rules.markup.attributeSort.length : -1;

  /**
   * The document source as an array list
   */
  const b: string[] = u.isArray(source) ? source : source.split(NIL);

  /**
   * The length of the document source, ie: number of characters
   */
  const c = b.length;

  /**
   * SVG Store reference for tracking singletons and blocks
   */
  const svg: {
    start: number;
    tname: string[],
    index: number[],
  } = {
    start: -1,
    tname: [],
    index: []
  };

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Advancement reference
   */
  let a: number = 0;

  /**
   * External tag language
   */
  let language: LanguageName;

  /**
   * embed Tag, eg: <scrip> or {% schema %} etc
   */
  let embed: boolean = false;

  /**
   * HTML String
   */
  let html = parse.language;

  /**
   * Stack nesting reference for Liquid tokens, increments by 1
   * for each opener and decrements for each ender.
   */
  let within: number = 0;

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

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

      assign(record, structure);

      parse.push(data, record, NIL);

    } else if (u.isArray(structure)) {

      for (const entry of structure as T[]) {
        assign(record, entry);
        parse.push(data, record, NIL);
      }

    } else if (param) {

      assign(record, param);
      parse.push(data, record, structure as Types);

    } else {

      console.log('isssue');

    }

  };

  /**
   * Inner
   *
   * Pads template tag delimters with a space. This function
   * was updated to also support whitespace dashes:
   *
   * - `{{` or `{{-`
   * - `{%` or`{%-`
   * - `}}` or `-}}`
   * - `%}`or `-%}`
   */
  function inner (input: string, tname: string = null) {

    if (parse.language !== 'html' && parse.language !== 'liquid' && jsx === false) return input;
    if (/(?:{[=#/]|%[>\]])|\}%[>\]]/.test(input)) return input;
    if (!lq.isType(input, 3)) return input;

    return lq.normalize(input, tname, rules.liquid);

  };

  /**
   * Indent
   *
   * Last known indentation level which is whitespace sequences.
   * Typically, we will want to use the `parse.iterator` store reference.
   * Optionally pass a `token` for which the indentation is to prepend.
   */
  function indent (from: number, token: string = NIL): string {

    if (from < 1) return token as string;

    let ws: string = NIL;

    const nl = b.lastIndexOf(NWL, from);

    if (nl > -1) {
      ws = source.slice(nl + 1, from);
      if (ws.length > 0 && ws.trim().length < 1) return token ? ws + token : ws;
    }

    return token as string;

  }

  /**
   * Newlines
   *
   * Counts the number of newlines between the `from` point up until
   * the the next non whitespace character detected
   */
  function newlines (from: number, input: string | string[] = b) {

    let i: number = from;
    let n: number = 1;

    while (u.is(input[i++], cc.NWL)) n = n + 1;

    return n;

  }

  /**
   * Glue
   *
   * Slices and joins the document array list starting at the provided `from`
   * index up until the provided `to` index. By default the function will apply
   * a `trimStart()` to the joined portion, unless a boolean `true` is passed as
   * a final parameter. The `to` parameter is optional, when not provided the array
   * list will slice `from` up until the end of the document.
   */
  function glue (from: number, to: number = -1, noTrim = false) {

    return noTrim === false
      ? source.slice(from, to).trimStart()
      : source.slice(from, to);

  }

  /**
   * Esc
   *
   * Finds escaped slash character sequences
   */
  function esc (idx: number) {

    let x: number = idx;

    do x = x - 1;
    while (u.is(b[x], cc.BWS));

    x = idx - x;

    return x % 2 === 1;

  };

  /**
   * Self Closer
   *
   * Utility function correction for self closing void tags,
   * applies a forward slash ender delimiter sequence.
   */
  function selfclose (token: string) {

    if (rules.correct === false || u.is(token[token.length - 2], cc.FWS)) return token;

    return /\/\s+>$/.test(token)
      ? `${token.slice(0, token.lastIndexOf('/'))}${rules.markup.selfCloseSpace ? '/>' : ' />'}`
      : `${token.slice(0, -1)}${rules.markup.selfCloseSpace ? '/>' : ' />'}`;
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
   * Parses tags, attrs, and template elements.
   * Markup is two smaller lexers that work together:
   *
   * 1. tag - evaluates markup (ie: HTML)
   * 2. template tags - (ie: Liquid)
   * 3. content - evaluates text content and code for embed lexers
   *
   * Type Definitions:
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
   * text       text     style
   * {{          }}      liquid
   * {%          %}      liquid_start/liquid_end
   * <?xml       ?>      xml
   *
   * ```
   */
  function parseToken (end: string) {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    const record: Record = {
      lexer: 'markup',
      lines: parse.lineOffset,
      stack: parse.stack.token !== 'global' ? parse.stack.token : 'global',
      begin: parse.stack.index,
      token: NIL,
      types: NIL,
      ender: -1
    };

    /* -------------------------------------------- */
    /* LOCAL SCOPES                                 */
    /* -------------------------------------------- */

    /**
     * The token string reference
     */
    let token: string = NIL;

    /**
     * The last known character of a token
     */
    let lchar: string = NIL;

    /**
     * Last Type, ie: `start`, `template` etc etc
     */
    let ltype: Types = NIL;

    /**
     * Tag Name, ie: `div`, `main` etc
     */
    let tname: string = NIL;

    /**
     * Starting delimeter token, ie: `{{` or `<` etc etc.
     */
    let start: string = NIL;

    /**
     * Whether or not to exit early from walk
     */
    let nowalk: boolean = false;

    /**
     * Ignored reference to skip lexing certain sources
     */
    let ignore: boolean = false;

    /**
     * Ignore count
     */
    let icount: number = 0;

    /**
     * Whether or not JavaScript comment exists
     */
    let jscomm: boolean = false;

    /**
     * Whether or not attribute sorting should be applied
     */
    let nosort: boolean = false;

    /**
     * Whether or not the contents of the token should be preserved
     */
    let preserve: boolean = false;

    /**
     * Infers a basic lex operation, typically used on easy tags, ie: <div>
     */
    let basic: boolean = false;

    /**
     * Attribute store reference. When chain is asserted (`index[2]`) then
     * the data type will be inferred to `liquid_attribute_chain` - This
     * is only used for template (liquid) attribute expressions.
     */
    let attrs: [ token: string, lines: number, chain?: boolean ][] = [];

    /* -------------------------------------------- */
    /* FUNCTIONS                                    */
    /* -------------------------------------------- */

    // function correct () {

    //   // determine if the current end tag is actually part of an HTML singleton
    //   if (ltype === 'end') {

    //     const lastToken = data.token[parse.count];

    //     if (
    //       data.types[parse.count - 1] === 'singleton' &&
    //       lastToken.charCodeAt(lastToken.length - 2) !== cc.FWS &&
    //       `/${lx.getTagName(lastToken)}` === tname
    //     ) {

    //       data.types[parse.count - 1] = 'start';
    //     }
    //   }

    //   if (parse.language === 'html' || parse.language === 'liquid') {

    //     // HTML gets tag names in lowercase, if you want to
    //     // preserveLine case sensitivity beautify as XML
    //     if (
    //       u.is(token[0], cc.LAN) &&
    //       u.not(token[1], cc.BNG) &&
    //       u.not(token[1], cc.QWS) && (
    //         parse.count < 0 ||
    //         data.types[parse.count].indexOf('liquid') < 0
    //       )
    //     ) {

    //       token = token.toLowerCase();
    //     }

    //     // console.log(parse.stack.token);

    //     if (
    //       grammar.html.tags.has(parse.stack.token) &&
    //       peers(tname.slice(1), parse.stack[parse.stack.length - 2][0])
    //     ) {

    //       // Looks for HTML tags missing an ending pair when encountering
    //       // an ending tag for a parent node
    //       insert(0);

    //     } else if (
    //       parse.stack.length > 3 &&
    //       grammar.html.tags.has(parse.stack.token) &&
    //       grammar.html.tags.has(parse.stack[parse.stack.length - 2][0]) &&
    //       grammar.html.tags.has(parse.stack[parse.stack.length - 3][0]) &&
    //       peers(tname, parse.stack[parse.stack.length - 4][0])
    //     ) {

    //       // Looks for consecutive missing end tags
    //       insert(3);

    //     } else if (
    //       parse.stack.length > 2 &&
    //       grammar.html.tags.has(parse.stack.token) &&
    //       grammar.html.tags.has(parse.stack[parse.stack.length - 2][0]) &&
    //       peers(tname, parse.stack[parse.stack.length - 3][0])
    //     ) {

    //       // Looks for consecutive missing end tags
    //       insert(2);

    //     } else if (
    //       parse.stack.length > 1 &&
    //       grammar.html.tags.has(parse.stack.token) &&
    //       peers(tname, parse.stack[parse.stack.length - 2][0])
    //     ) {

    //       // Looks for consecutive missing end tags
    //       insert(1);

    //     } else if (peers(tname, parse.stack.token)) {

    //       // Certain tags cannot contain other certain tags if such tags are peers
    //       insert(0);

    //     } else if (
    //       u.is(tname[0], cc.FWS) &&
    //       grammar.html.tags.has(parse.stack.token) &&
    //       parse.stack.token !== tname.slice(1)
    //     ) {

    //       // Looks for consecutive missing end tags if the current token is an end tag
    //       fix(token, false);

    //       record.begin = parse.stack.index;
    //       record.lines = parse.lineOffset;
    //       record.stack = lx.getTagName(parse.stack.token);
    //       record.token = token;
    //       record.types = 'end';

    //       data.lines[parse.count - 1] = 0;

    //     }

    //     // Inserts a trailing slash into singleton tags if they do not already have it
    //     if (jsx === false && grammar.html.voids.has(tname)) {

    //       if (rules.markup.correct === true && /\/>$/.test(token) === false) {
    //         token = token.slice(0, token.length - 1) + ' />';
    //       }

    //       return true;
    //     }

    //   }

    //   return false;

    // }¨

    /**
     * Parse CDATA
     *
     * Handling for <![CDATA[   ]]> markup (html) type comment expressions.
     * While rare this function correctly composes the data structures.
     *
     * @next parseAttribute()
     */
    function cdata (): ReturnType<typeof parseAttribute> {

      if (ltype !== 'cdata') return parseAttribute();

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

      return parseAttribute();

    }

    /**
     * Parse Liquid Capture
     *
     * Liquid `{% capture %}` tokens are handled a little differently
     * than other Liquid tokens. We will preserve the inner contents of
     * Liquid captures and assign it a unique `types`. This function carries
     * out the traversal and parse for this.
     */
    function parseLiquidCapture () {

      let i = source.indexOf('capture', a);

      if (b[i - 3] === 'e' && b[i - 2] === 'n' && b[i - 1] === 'd') {

        i = b.indexOf('}', i) + 1;

        record.types = ltype = 'liquid_capture';
        record.token = token + b.slice(a, i).join(NIL);
        parse.lineNumber = u.cline(token, parse.lineNumber);

        push(record);

        a = i;

      } else {

        const x = source.indexOf('endcapture', i + 7) + 9;

        if (x > -1 && /[a-z]/.test(b[x + 1]) === false) {

          i = b.indexOf('}', x) + 1;

          // Consume an ending newline
          //
          // In some cases the next character might be a newline
          // if the occurs, we need to to ensure to include it when
          // applying the slice.
          //
          //
          token = token + b.slice(a, i).join(NIL);
          parse.lineNumber = u.cline(token, parse.lineNumber);

          a = i;

          return parseLiquidCapture();

        }

        MarkupError(ParseError.MissingLiquidEndTag, token, tname);

      }

    }

    /**
     * Parse Liquid
     *
     * This will parse template identified tokens and tags (Liquid).
     * It aligns the the data `record` for identification.
     */
    function parseLiquid (): ReturnType<typeof cdata> {

      /* -------------------------------------------- */
      /* LIQUID TOKEN                                 */
      /* -------------------------------------------- */

      if (record.types.indexOf('liquid') < 0) return cdata();

      if (record.token === NIL) record.token = token;

      if (u.is(token[0], cc.LCB) && u.is(token[1], cc.PER)) {

        if (grammar.liquid.else.has(tname)) {

          record.types = ltype = tname === 'when' ? 'liquid_when' : 'liquid_else';

        } else if (grammar.liquid.tags.has(tname)) {

          if (tname === 'capture') {
            a = a + 1;
            return parseLiquidCapture();
          }

          record.types = ltype = 'liquid_start';

          return parseAttribute();

        } else if (tname.startsWith('end')) {

          const name = tname.slice(3);

          if (grammar.liquid.tags.has(name)) {
            record.types = ltype = 'liquid_end';
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
                break;
              }

              i = data.stack.indexOf(name, i + 1);

            } while (i > -1);

          }
        } else {

          record.stack = tname;

        }
      }

      if (rules.liquid.quoteConvert === 'double') {
        record.token = token = record.token.replace(/'[^"]*?'/g, lx.qc(DQO));
      } else if (rules.liquid.quoteConvert === 'single') {
        record.token = token = record.token.replace(/"[^']*?"/g, lx.qc(SQO));
      }

      return cdata();

    }

    /**
     * Parse Liquid Tag
     *
     * This will parse a Liquid tag `{% liquid %}` who's inner contents
     * contain liquid expressions
     */
    function parseLiquidTag () {

      /**
       * Iterator reference
       */
      let i = token.indexOf('liquid') + 6;

      /**
       * The atomic token reference
       */
      let liner = NIL;

      /**
       * The Liquid tag name
       */
      let lname = NIL;

      /**
       * The lines offset reference
       */
      let lines = 1;

      // Inserts the starting token into the data struture, eg: {% liquid
      //
      push(record, {
        token: lq.openDelims(token.slice(0, i), rules.liquid),
        types: 'liquid_start',
        stack: 'liquid'
      });

      /**
       * Split token onto newlines
       */
      const nl = token.slice(i).split(NWL);
      const ender = nl.pop().trim();
      const match = u.is(ender[ender.length - 3], cc.DSH) ? ender.length - 3 : ender.length - 2;
      const slice = ender.slice(0, match);
      const delim = ender.slice(match);

      if (slice.length !== 0) nl.push(slice);

      i = 0; // Reset Iterators

      do {

        liner = nl[i].trim();
        lname = liner.split(/\s/)[0];

        if (lname.startsWith('end')) {

          record.token = liner;
          record.types = 'liquid_end';
          record.lines = lines;

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
            record.types = 'liquid_start';
            record.lines = lines;

            push(record);

            lines = 1;

          } else if (grammar.liquid.else.has(lname)) {

            record.token = liner;
            record.types = lname === 'when' ? 'liquid_when' : 'liquid_else';
            record.lines = lines;

            push(record);

            lines = 1;

          } else if (grammar.liquid.singleton.has(lname)) {

            record.token = liner;
            record.types = 'liquid';
            record.lines = lines <= 1 ? 2 : lines;

            push(record);

            lines = 1;

          } else if (liner.trim().length > 0) {

            record.token = liner;
            record.types = 'content';
            record.lines = lines;

            push(record);

            lines = 1;
          }

        }

        i = i + 1;
        lines = lines + 1;

      } while (i < nl.length);

      if ((
        rules.liquid.delimiterPlacement === 'default' ||
        rules.liquid.delimiterPlacement === 'force-multiline'
      ) || (
        rules.liquid.delimiterPlacement === 'preserve' && /\n-?%}$/.test(token)
      ) || (
        rules.liquid.delimiterPlacement === 'consistent' && /^{%-?\n/.test(token)
      )) {

        push(record, {
          token: delim,
          types: 'liquid_end',
          lines: 2
        });

      } else {

        push(record, {
          token: WSP + delim,
          types: 'liquid_end',
          lines: 0
        });

      }

    }

    /**
     * Parse SVG
     *
     * This will parse SVG tag structures and correctly apply singular
     * types depending upon the stack.
     */
    function parseSVG (): ReturnType<typeof parseLiquid> {

      if (tname === 'svg') svg.start = parse.count + 1;

      if (grammar.svg.tags.has(tname) && svg.start > 0) {

        if (record.types === 'start') {

          record.types = 'singleton';

          svg.tname.push(tname);
          svg.index.push(parse.count + 1);

        } else if (record.types === 'end') {

          const i = svg.tname.indexOf(tname);
          const e = svg.tname.lastIndexOf(tname);

          if (i > -1) {
            if (e === i) {

              data.types[svg.index[e]] = 'start';
              svg.tname.splice(e, 1);
              svg.index.splice(e, 1);

            } else {

              if (data.begin[parse.count] === svg.index[i]) {

                data.types[data.begin[parse.count]] = 'start';

                svg.tname.splice(i, 1);
                svg.index.splice(i, 1);

              } else {

                data.types[svg.index[e]] = 'start';
              }
            }
          }

          if (tname === 'svg') svg.start = -1;

        }

      }

      return parseLiquid();

    }

    /**
     * Parse Singleton
     *
     * Utility function which will re-assign the `ltype` when HTML `void`
     * type tags. This only detects HTML tags, Liquid (template) types are
     * handled by the `parseLiquid()` function.
     *
     */
    function parseSingleton (): ReturnType<typeof parseSVG> {

      if (basic && ignore === false && ltype !== 'xml') {

        if (grammar.html.voids.has(tname)) {

          record.types = ltype = 'singleton';

          if (u.not(token[token.length - 2], cc.FWS)) {

            // Correct Voids
            // Add a forward slash character to void tokens which do not contain one
            //
            record.token = selfclose(token);
          }

        } else if (u.is(token[token.length - 2], cc.FWS) && u.is(token[token.length - 1], cc.RAN)) {
          record.types = ltype = 'singleton';
        } else {
          record.types = ltype = 'start';
        }
      }

      return parseSVG();

    }

    /**
     * Parse Ignores
     *
     * Additional logic required to find the end of a tag when it contains
     * a `data-esthetic-ignore` attribute annotation. The function also
     * handles `@esthetic-ignore-next` ignore comments placed above tag regions.
     *
     */
    function parseIgnore (): ReturnType<typeof parseSingleton | typeof parseScript> {

      if (parse.count < 1 && embed === false) return parseSingleton();

      /**
       * The ender token name, used for Liquid tag ignores
       */
      let ender: string = NIL;

      if (rx.CommIgnoreNext.test(data.token[parse.count])) {

        if (grammar.html.voids.has(tname)) {
          record.token = token.replace('>', attrs.map(([ value ]) => value).join(WSP) + '>');
          record.types = 'ignore';
          return push(record);
        }

        if (ltype.indexOf('liquid') > -1 && grammar.liquid.tags.has(tname)) {
          ender = `end${tname}`;
        }

        ignore = true;
        preserve = false;

      } else if (external.detect(tname, 'liquid') && ignored.has(tname)) {

        ender = null;

      }

      if (ender !== null && preserve === false && ignore === true && (
        end === '>' ||
        end === '}}' ||
        end === '%}'
      )) {

        /**
         * Lexed characters traversed in the ignored region
         */
        const tags: string[] = [];

        // if (cheat === true) ltype = 'singleton'; } else {

        preserve = true;

        a = a + 1;

        if (a < c) {

          if (
            ltype !== 'json_preserve' &&
            ltype !== 'script_preserve' &&
            ltype !== 'style_preserve' &&
            ltype !== 'liquid_json_preserve' &&
            ltype !== 'liquid_script_preserve' &&
            ltype !== 'liquid_style_preserve') {

            ltype = 'ignore';

          }

          /* -------------------------------------------- */
          /* LOCAL SCOPES                                 */
          /* -------------------------------------------- */

          /**
           * The delimiter match
           */
          let delim = NIL;

          /**
           * The token name used to skip start tags when using ignore next
           */
          let tcount = 0;

          /**
           * The token name used to skip start tags when using ignore next
           */
          let next = -1;

          /**
           * The token name used to skip start tags when using ignore next
           */
          let name = NIL;

          /**
           * The delimiter length used to validate endtag match
           */
          let ee: number = 0;

          /**
           * The iterator index for matching endtag
           */
          let ff: number = 0;

          /**
           * Whether or not we've reached the endtag
           */
          let endtag: boolean = false;

          /* -------------------------------------------- */
          /* ITERATOR                                     */
          /* -------------------------------------------- */

          do {

            if (u.is(b[a], cc.NWL)) parse.lines(a);

            tags.push(b[a]);

            if (delim === NIL) {

              delim = u.is(b[a], cc.DQO) ? DQO : u.is(b[a], cc.SQO) ? SQO : NIL;

              if (u.is(b[a], cc.LCB) && (u.is(b[a + 1], cc.LCB) || u.is(b[a + 1], cc.PER))) {

                next = u.is(b[a + 1], cc.PER) ? b.indexOf('}', a) + 1 : b.indexOf('}', a) + 2;
                name = glue(u.is(b[a + 2], cc.DSH) ? a + 3 : a + 2, next);

                if (name.startsWith(tname)) {

                  tcount = tcount + 1;

                } else if (name.startsWith(ender)) {

                  if (tcount > 0) {

                    tcount = tcount - 1;

                  } else {

                    if (u.is(b[a + 1], cc.LCB)) next = next + 1;

                    if (u.is(b[next - 2], cc.PER)) {
                      tags.push(...b.slice(a + 1, next));
                      ltype = 'liquid_ignore';
                      a = next - 1;
                      break;
                    }
                  }

                }

              } else if (u.is(b[a], cc.LAN) && basic === true) {

                endtag = u.is(b[a + 1], cc.FWS);

              } else if (b[a] === lchar && u.not(b[a - 1], cc.FWS)) {

                if (endtag === true) {

                  icount = icount - 1;

                  if (icount < 0) break;

                } else {

                  icount = icount + 1;

                }
              }

            } else if (u.is(b[a], delim.charCodeAt(delim.length - 1))) {

              ff = 0;
              ee = delim.length - 1;

              if (u.is(delim[ee], cc.RCB)) {

                if (glue(a + (u.is(b[a + 2], cc.DSH) ? 3 : 2), b.indexOf('%', a + 2)).startsWith(ender)) break;

              } else if (ee > -1) {

                do {

                  if (u.not(b[a - ff], delim.charCodeAt(ee))) break;

                  ff = ff + 1;
                  ee = ee - 1;

                } while (ee > -1);

              }

              if (ee < 0) delim = NIL;
            }

            a = a + 1;

          } while (a < c);

        }

        if (ltype === 'ignore') {

          if (!parse.is('types', 'ignore')) data.types[parse.count] = 'ignore';

          //
          // Capture the opening token and use the source array
          // to avoid any potential code errors that might be contained
          // in the starting tag. For example:
          //
          //  <!-- esthetic-ignore-next -->
          //
          //  <div class == 'invalid" !~=>
          //
          // Even though the div tag in the example is invalid, esthetic will
          // exclude the region. Using the parse.iterator reference assigned
          // within parseComments we determine the starting point of the beginning
          // token, basically consuming this portion:
          //
          // -->
          //
          // <div
          //
          // Whitespace and newlines contained between the closing delimiter ">" of
          // the ignore comment and the starting div "<" delimiter is consumed and
          // now the begins reference points to "<" which from here we can use the
          // tags[] array length to obtain starting token.
          //
          const begins = parse.iterator + b.slice(parse.iterator, a).join(NIL).search(rx.NonSpace);

          /**
           * Obtain the indentation spaces
           */
          let spacer = indent(begins);

          // Edge case to ensure the correct amount of indentation is applied
          // in situations where token is place inline, eg:
          //
          // foo   <!-- esthetic-ignore-next --> <div>
          //
          // In this situation the <div> tag is forced and aligned to the starting
          // point of the "<!--" delimiters, example:
          //
          // foo   <!-- esthetic-ignore-next -->
          //       <div>
          //
          if (spacer === NIL) {
            if (data.token[parse.count].search(rx.NonSpace) > 0) {
              spacer = u.repeatChar(data.token[parse.count].search(rx.NonSpace));
            } else {
              spacer = NIL;
            }
          }

          attrs = [];
          token = spacer + b.slice(begins, a - tags.length + 1).join(NIL) + tags.join(NIL);

          record.types = 'ignore';
          record.token = token;

        } else if (ltype === 'liquid_ignore') {

          if (!parse.is('types', 'ignore')) data.types[parse.count] = 'ignore';

          // Similar to regular ignores, we need to obtain the offset spacing
          // to ensure indentation of the first token following the ignore comment
          // We can obtain the starting point index using the following subtraction
          // and addition. The ending result will point to the {{ or {% location.
          //
          token = indent(a - token.length - tags.length + 1, token) + tags.join(NIL);
          ltype = 'ignore';

          record.types = 'ignore';
          record.token = token;

        } else {

          if (ltype.startsWith('liquid_')) {

            // TODO

          } else {

            record.types = 'start';

            // Parse the attributes
            //
            parseAttribute(true);

            // Get Closing Token
            //
            const close = tags.lastIndexOf('<');
            const inner = tags.slice(0, close).join(NIL);

            if (!rx.NonSpace.test(inner)) {

              // The inner content of the tag contains nothing
              // We will instead just push the ender token
              //
              push(record, [
                {
                  lexer: 'markup',
                  types: 'end',
                  token: tags.slice(close).join(NIL).trim()
                }
              ]);

            } else {

              // The inner content contains something other
              // than whitespace or newlines, so we add it and
              // also push the ender token
              //
              push(record, [
                {
                  lexer: 'markup',
                  types: ltype,
                  token: inner
                },
                {
                  lexer: 'markup',
                  types: 'end',
                  token: tags
                    .slice(close)
                    .join(NIL)
                    .trim()
                }
              ]);
            }

            embed = false;
            language = html;

            return parseScript();

          }

        }

      }

      return parseSingleton();

    }

    /**
     * Parse exts
     *
     * Determines whether or not the token contains an external region
     * like that of `<scrit>`, `<style>` and Liquid equivalents `{% schema %}` etc.
     * Some additional context is required before passing the contents of these tags
     * to different lexers. It's here where we establish that context.
     */
    function parseExternal (): ReturnType<typeof parseSingleton | typeof parseIgnore> {

      //  cheat = correct();

      if (u.is(token, cc.LAN) && u.is(token[1], cc.FWS)) return parseIgnore();

      /**
       * Length of the `attrs` store reference
       */
      let item: number = attrs.length - 1;

      if (u.is(token, cc.LAN)) {
        if (item > -1) {

          do {

            const q = external.determine(tname, 'html', attrname(attrs[item][0], false));

            if (q !== false) {
              if (q.language === 'json' && rules.markup.ignoreJSON) {

                ltype = 'json_preserve';
                ignore = true;
                break;

              } else if (q.language === 'javascript' && rules.markup.ignoreJS) {

                ltype = 'script_preserve';
                ignore = true;

                break;

              } else if (q.language === 'css' && rules.markup.ignoreCSS) {

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

            item = item - 1;

          } while (item > -1);

        } else {

          const q = external.determine(tname, 'html');

          if (q !== false) {
            if (q.language === 'json' && rules.markup.ignoreJSON) {

              ltype = 'json_preserve';
              ignore = true;

            } else if (q.language === 'javascript' && rules.markup.ignoreJS) {

              ltype = 'script_preserve';
              ignore = true;

            } else if (q.language === 'css' && rules.markup.ignoreCSS) {

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

        const q = external.determine(tname, 'liquid', token);

        if (q !== false) {

          if (ignored.has(tname)) {
            ignore = true;
            preserve = false;
            return parseIgnore();
          }

          embed = true;
          language = q.language;

        }
      }

      return parseIgnore();

    }

    /**
     * Attributes
     *
     * The attribute lexer and tokenizer. This reasons with the traversed
     * tokens and populates the data structure. It is only responsible for
     * attribute expressions.
     */
    function parseAttribute (advance = false): ReturnType<typeof parseScript> {

      /* PUSH RECORD -------------------------------- */
      if (advance !== null) push(record);

      // if (u.is(b[a], cc.RAN) && u.is(b[a + 1], cc.FWS)) return;
      // console.log(embed, end, ignore, preserve, token, b.slice(a).join(NIL));
      /* -------------------------------------------- */
      /* CONSTANTS                                    */
      /* -------------------------------------------- */

      /**
       * The index of data record in the tree
       */
      const begin: number = parse.count;

      /**
       * The tag name, ie: `tname`
       */
      const stack = tname.replace(/\/$/, NIL);

      /**
       * Type of quotation character to convert
       */
      const qc = rules.markup.quoteConvert;

      /* -------------------------------------------- */
      /* LOCAL SCOPES                                 */
      /* -------------------------------------------- */

      /**
       * The current index of the attribute
       */
      let idx = 0;

      /**
       * Equals `=` operator index in the token
       */
      let eq = 0;

      /**
       * Double quotation `"` index in the token
       */
      let dq = 0;

      /**
       * Single quotation `'` index in the token
       */
      // let sq = 0;

      /**
       * The attribute name
       */
      let name = NIL;

      /**
       * The attribute value
       */
      let value = NIL;

      /**
       * The amount of attrs in the store
       */
      let len = attrs.length;

      /* -------------------------------------------- */
      /* FUNCTIONS                                    */
      /* -------------------------------------------- */

      /**
       * Convert Quotes
       *
       * Converts quotation characters and pushes the attribute record.
       */
      function qconvert () {

        if (parse.attributes.has(begin)) {
          if (idx + 1 === len && u.notLast(record.token, cc.RAN)) record.token = record.token + '>';
        }

        let liq = record.types.indexOf('liquid_attribute') > -1;

        if (
          ignore === true ||
          qc === 'none' ||
          record.types.indexOf('attribute') < 0 || (
            liq === false &&
            qc === 'single' &&
            record.token.indexOf(DQO) < 0
          ) || (
            liq === false &&
            qc === 'double' &&
            record.token.indexOf(SQO) < 0
          )
        ) {

          push(record);

        } else {

          let ee = 0;
          let ex = false;

          const ch = record.token.split(NIL);
          const eq = record.token.indexOf('=');
          const ln = ch.length - 1;

          if (
            u.not(ch[eq + 1], cc.DQO) &&
            u.not(ch[ch.length - 1], cc.DQO) &&
            qc === 'single' &&
            liq === false) {

            push(record);

          } else if (
            u.not(ch[eq + 1], cc.SQO) &&
            u.not(ch[ch.length - 1], cc.SQO) &&
            qc === 'double' &&
            liq === false) {

            push(record);

          } else {

            ee = eq + 2;

            if (liq === false) {
              if (qc === 'double') {
                if (record.token.slice(eq + 2, ln).indexOf(DQO) > -1) ex = true;
                ch[eq + 1] = DQO;
                ch[ch.length - 1] = DQO;
              } else if (qc === 'single') {
                if (record.token.slice(eq + 2, ln).indexOf(SQO) > -1) ex = true;
                ch[eq + 1] = SQO;
                ch[ch.length - 1] = SQO;
              }
            }

            if (ex === true || liq === true) {

              liq = false;

              do {

                if (u.is(ch[ee - 1], cc.LCB) && (
                  u.is(ch[ee], cc.PER) ||
                  u.is(ch[ee], cc.LCB)
                )) {
                  liq = true;
                } else if (u.is(ch[ee], cc.RCB) && (
                  u.is(ch[ee - 1], cc.PER) ||
                  u.is(ch[ee - 1], cc.RCB)
                )) {
                  liq = false;
                }

                if (liq === true) {
                  if (u.is(ch[ee], cc.DQO) && qc === 'double') {
                    ch[ee] = SQO;
                  } else if (u.is(ch[ee], cc.SQO) && qc === 'single') {
                    ch[ee] = DQO;
                  }
                } else {
                  if (u.is(ch[ee], cc.SQO) && qc === 'double') {
                    ch[ee] = DQO;
                  } else if (u.is(ch[ee], cc.DQO) && qc === 'single') {
                    ch[ee] = SQO;
                  }
                }

                ee = ee + 1;

              } while (ee < ln);
            }

            record.token = ch.join(NIL);

            push(record);

          }
        }
      };

      /**
       * Sorting Attributes
       *
       * Applies attributes sorting when `attributeSort` and/or `attributeSortList`
       * rules are enabled or defined. The sorting is applied in post process.
       */
      function sorting () {

        if (!(!jsx && !jscomm && !nosort)) return;

        if (asl === 0) {
          attrs = sortSafe(attrs, NIL, false);
          return;
        }

        // if making use of the 'options.attributeSort` option

        const tstore = [];

        dq = 0;
        eq = 0;
        len = attrs.length;

        // loop through the options.attributeSortList looking for attribute name matches
        do {

          // loop through the attrs
          eq = 0;

          do {

            if (attrs.length > 0) {

              name = attrs[eq][0].split('=')[0];

              if (rules.markup.attributeSort[dq] === name) {
                tstore.push(attrs[eq]);
                attrs.splice(eq, 1);
                len = len - 1;
                break;
              }

            }

            eq = eq + 1;

          } while (eq < len);

          dq = dq + 1;

        } while (dq < asl);

        attrs = sortSafe(attrs, NIL, false);
        attrs = tstore.concat(attrs);
        len = attrs.length;

      }

      /**
       * JSX Attributes
       *
       * Passes JSX attributes literals to the `script` lexer and pushes the
       * attributes onto the data structure stack accordingly.
       */
      function jsxattr () {

        push(record, 'jsx_attribute', {
          token: `${name}={`,
          types: 'jsx_attribute_start'
        });

        parse.external('jsx', value.slice(1, value.length - 1));

        record.begin = parse.count;

        if (/\s\}$/.test(value)) {
          value = value.slice(0, value.length - 1);
          value = rx.SpaceEnd.exec(value)[0];
          record.lines = value.indexOf('\n') < 0 ? 1 : value.split('\n').length;
        } else {
          record.lines = 0;
        }

        record.begin = parse.stack.index;
        record.stack = parse.stack.token;
        record.token = '}';
        record.types = 'jsx_attribute_end';

        qconvert();

      }

      /**
       * Liquid Attributes
       *
       * Liquid infused attribute handling for record type assignment. Accepts an
       * optional `skipEnd` parameter to prevent checking of `endtag` liquid tokens.
       */
      function liqattr (): boolean {

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

          qconvert();

          return true;

        } else if (lq.isElse(attrs[idx][0])) {

          record.types = 'liquid_attribute_else';
          record.token = attrs[idx][0];

        } else {

          record.types = 'attribute';
          record.token = attrs[idx][0];

        }

        qconvert();

        return false;

      }

      /* -------------------------------------------- */
      /* TOKENIZE                                     */
      /* -------------------------------------------- */

      if (attrs.length < 1) {
        if (advance !== true) return;
        return parseScript();
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

          if (u.is(name[name.length - 1], cc.EQS) && attrs[dq][0].indexOf('=') < 0) {
            attrs[dq - 1][0] = name + attrs[dq][0];
            attrs.splice(dq, 1);

            eq = eq - 1;
            dq = dq - 1;
          }

          dq = dq + 1;
        } while (dq < eq);
      }

      // Attribute Sorting
      if (asl > 0 || rules.markup.attributeSort === true) sorting();

      record.begin = begin;
      record.stack = stack;
      record.types = 'attribute';

      if (idx < len) {

        do {

          if (attrs[idx] === undefined) break;

          record.lines = attrs[idx][1];

          // console.log(attrs[idx]);

          attrs[idx][0] = attrs[idx][0].replace(rx.SpaceEnd, NIL);

          if (jsx === true && /^\/[/*]/.test(attrs[idx][0])) {

            record.types = 'comment_attribute';
            record.token = attrs[idx][0];

            qconvert();

            idx = idx + 1;
            continue;
          }

          // console.log(attrs[idx]);

          if (attrs[idx][1] <= 1 && lq.isChain(attrs[idx][0])) {
            if (!lq.isValue(attrs[idx][0])) {

              record.types = 'liquid_attribute_chain';
              record.token = attrs[idx][0];
              qconvert();

              idx = idx + 1;
              continue;
            }
          }

          eq = attrs[idx][0].indexOf('=');
          dq = attrs[idx][0].indexOf(DQO);
          // sq = attrs[idx][0].indexOf(SQO);

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

            } else if (
              u.is(attrs[idx][0], cc.HSH) ||
              u.is(attrs[idx][0], cc.LSB) ||
              u.is(attrs[idx][0], cc.LCB) ||
              u.is(attrs[idx][0], cc.LPR) || jsx === true) {

              record.token = attrs[idx][0];

            } else {

              record.types = 'liquid_attribute';
              record.token = rules.markup.attributeCasing === 'preserve'
                ? attrs[idx][0]
                : attrs[idx][0].toLowerCase();

            }

            qconvert();

          } else if (lq.isType(attrs[idx][0], 6)) {

            liqattr();

          } else {

            // Separates out the attribute name from its value
            // We need context of the attribute expression for
            // dealing with and handling Liquid attributes specifically
            //
            name = attrs[idx][0].slice(0, eq);

            if (
              (
                rules.markup.lineBreakValue === 'force-preserve' ||
                rules.markup.lineBreakValue === 'force-indent' ||
                rules.markup.lineBreakValue === 'force-align'
              )
            ) {

              value = attrs[idx][0][eq + 1]
              + NWL
              + attrs[idx][0].slice(eq + 2, -1).trim()
              + NWL
              + attrs[idx][0][attrs[idx][0].length - 1];

            } else {

              value = attrs[idx][0].slice(eq + 1);

            }

            if (rules.markup.attributeCasing === 'lowercase-name') {
              name = name.toLowerCase();
              attrs[idx][0] = name + '=' + value;
            } else if (rules.markup.attributeCasing === 'lowercase-value') {
              value = value.toLowerCase();
              attrs[idx][0] = name + '=' + value;
            } else if (rules.markup.attributeCasing === 'lowercase') {
              name = name.toLowerCase();
              value = value.toLowerCase();
              attrs[idx][0] = name + '=' + value;
            } else {
              attrs[idx][0] = name + '=' + value;
            }

            if (rules.correct === true &&
              u.not(value, cc.LAN) &&
              u.not(value, cc.LCB) &&
              u.not(value, cc.EQS) &&
              u.not(value, cc.DQO) &&
              u.not(value, cc.SQO)
            ) {

              value = DQO + value + DQO;

            }

            if (jsx === true && /^\s*{/.test(value)) {

              jsxattr();

              record.types = 'attribute';
              record.begin = begin;
              record.stack = stack;

            } else {

              if (lq.isType(name, 6)) {

                liqattr();

              } else {

                record.types = 'attribute';
                record.token = attrs[idx][0];

                qconvert();

              }

            }
          }

          idx = idx + 1;
        } while (idx < len);
      }

      if (!advance) return parseScript();

    };

    /**
     * Tag/Content Exclusion
     *
     * This is a utility function for obtaining ending liquid tags
     * before traversal. Specifically for handling comment blocks
     * and/or ignored markup tags like scripts or styles.
     */
    function parseExclude (tag: string, from: number) {

      tag = tag.trimStart().split(/\s/)[0];

      // Lets look for liquid tokens keywords before proceeding,
      // We are skipping ahead from the normal parse here.
      //
      if (tag === 'comment' || ignored.has(tag)) {

        let idx1 = source.indexOf('{%', from);

        //  Lets reference this index
        let idx2 = idx1;

        // Lets make sure to consume any whitespace dash
        // characters that might be defined
        //
        if (b[idx1 + 1].charCodeAt(0) === cc.DSH) idx2 = idx1 + 1;

        // Lets now look for the starting index of the `endcomment` keyword
        //
        idx2 = source.indexOf(`end${tag}`, idx2);

        if (idx2 > 0) {

          idx2 = b.indexOf('}', idx2);

          if (idx2 > 0 && b[idx2 - 1].charCodeAt(0) === cc.PER) {

            if (tag !== 'comment') {

              ltype = 'ignore';
              ignore = true;
              start = source.slice(a, from + 1);
              end = source.slice(idx1, idx2 + 1);

            } else {

              ltype = 'comment';
              start = source.slice(a, from + 1);

              idx1 = source.lastIndexOf('{%', idx2);
              end = source.slice(idx1, idx2 + 1);

            }

          }
        }
      }
    }

    /**
     * Comments
     *
     * Handling for comment lines and blocks. Additional processing for
     * dealing with Liquid comment blocks. The function also reasons
     * with ignore comment regions.
     *
     * @note traverse() will run depending on current iteration
     */
    function parseComments (lineComment?: boolean): ReturnType<typeof parseExternal> {

      parse.iterator = a;

      const comm = commentBlock({
        chars: b,
        end: c,
        lexer: 'markup',
        begin: start,
        start: a,
        ender: end
      });

      token = comm[0];
      a = comm[1];

      if (rx.CommMarkupIgnore.test(token)) {
        if (rx.CommIgnoreStart.test(token)) {

          let begin: number;

          if (token.startsWith('<!--')) {

            begin = token.indexOf('-->') + 3;

          } else if (rx.LiquidLineComment.test(token)) {

            begin = token.indexOf('%}') + 2;

          } else {

            begin = token.indexOf('%}', token.indexOf('%}') + 2) + 2;

          }

          push(record, [
            {
              token: indent(parse.iterator, token.slice(0, begin)),
              types: 'ignore'
            },
            {
              token: token.slice(begin).replace(rx.NewlineLead, NIL),
              types: 'ignore',
              lines: newlines(begin, token)
            }
          ]);

        } else {

          push(record, {
            token: indent(parse.iterator, token),
            types: 'ignore'
          });

          parse.iterator = a + 1;

        }

      } else {

        if (u.is(token[0], cc.LCB) && u.is(token[1], cc.PER) && lineComment === false) {

          const begin = token.indexOf('%}', 2) + 2;
          const last = token.lastIndexOf('{%');

          token = inner(token.slice(0, begin), tname)
          + token.slice(begin, last)
          + inner(token.slice(last), tname);

        }

        record.token = token;
        record.types = 'comment';

        return parseExternal();

      }
    }

    /**
     * Bad Liquid
     *
     * Handling for Liquid tokens which are used to express tag names.
     *
     * @note traverse() will run depending on current iteration
     */
    function parseBadLiquid (offset: number) {

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

    /**
     * Delimiters
     *
     * This is the first function to execute and prepares the traversal
     * for what to expect in terms of tag types.
     */
    function parseDelimiter (): ReturnType<typeof parseComments | typeof parseExternal | typeof traverse> {

      if (end === '---') {

        start = '---';
        ltype = 'ignore';
        preserve = true;

      } else if (u.is(b[a], cc.LAN)) {

        if (u.is(b[a + 1], cc.LCB) && (u.is(b[a + 2], cc.LCB) || u.is(b[a + 2], cc.PER))) {

          const x = parseBadLiquid(3);

          nowalk = true;

          parse.stack.push([ 'liquid_bad', parse.count ]);
          push(record, { token: x, types: 'liquid_start_bad' });

          return;

        } else if (u.is(b[a + 1], cc.FWS)) {

          if (u.is(b[a + 2], cc.LCB) && (u.is(b[a + 3], cc.LCB) || u.is(b[a + 3], cc.PER))) {

            const x = parseBadLiquid(3);

            push(record, { token: x, types: 'liquid_end_bad' });

            return;

          } else {

            ltype = 'end';
            end = '>';

          }

        } else if (u.is(b[a + 1], cc.BNG)) {

          if ((
            u.is(b[a + 2], 100) || u.is(b[a + 2], 68) // d D
          ) && (
            u.is(b[a + 3], 111) || u.is(b[a + 3], 79) // o O
          ) && (
            u.is(b[a + 4], 99) || u.is(b[a + 4], 67) //  c C
          ) && (
            u.is(b[a + 5], 116) || u.is(b[a + 5], 84) // t T
          ) && (
            u.is(b[a + 6], 121) || u.is(b[a + 6], 89) // y Y
          ) && (
            u.is(b[a + 7], 112) || u.is(b[a + 7], 80) // p P
          ) && (
            u.is(b[a + 8], 101) || u.is(b[a + 8], 69) // e E
          )) {

            end = '>';
            ltype = 'doctype';
            preserve = true;

          } else if (u.is(b[a + 2], cc.DSH) && u.is(b[a + 3], cc.DSH)) {

            end = '-->';
            start = '<!--';
            ltype = 'comment';

          } else if (
            u.is(b[a + 2], cc.LSB) &&
            b[a + 3].charCodeAt(0) === 67 && // C
            b[a + 4].charCodeAt(0) === 68 && // D
            b[a + 5].charCodeAt(0) === 65 && // A
            b[a + 6].charCodeAt(0) === 84 && // T
            b[a + 7].charCodeAt(0) === 65 && // A
            u.is(b[a + 8], cc.LSB)
          ) {

            end = ']]>';
            ltype = 'cdata';
            preserve = true;

          }

        } else if (u.is(b[a + 1], cc.QWS)) {

          end = '?>';

          if (
            b[a + 2].charCodeAt(0) === 120 && // x
            b[a + 3].charCodeAt(0) === 109 && // m
            b[a + 4].charCodeAt(0) === 109 //    l
          ) {
            ltype = 'xml';
            basic = true;
          } else {
            preserve = true;
            ltype = 'liquid';
          }

        } else if (
          u.is(b[a + 1], 112) && //   p
          u.is(b[a + 2], 114) && //   r
          u.is(b[a + 3], 101) && ( // e
            u.is(b[a + 4], cc.RAN) ||
            u.ws(b[a + 4])
          )
        ) {

          end = '</pre>';
          ltype = 'ignore';
          preserve = true;

        } else {

          basic = true;
          end = '>';

        }

      } else if (u.is(b[a], cc.LCB)) {

        if (jsx) {

          embed = true;
          nowalk = true;

          parse.stack.push([ 'script', parse.count ]);
          push(record, { token: '{', types: 'script_start' });

          return;
        }

        if (u.is(b[a + 1], cc.LCB)) {

          preserve = true;
          end = '}}';
          ltype = 'liquid';

        } else if (u.is(b[a + 1], cc.PER)) {

          preserve = true; // Required for lexer
          end = '%}';
          ltype = 'liquid';

          /**
           * `}` - The index of the next Right Curly brace
           */
          const from = b.indexOf('}', a + 2);

          if (u.is(b[from - 1], cc.PER)) {

            let tag = source.slice(a + 2, from - 1);

            // Lets make sure we do not interfere with dash delimiters
            if (u.is(tag, cc.DSH)) {
              start = '{%-';
              tag = tag.slice(1).trimStart();
            } else {
              start = '{%';
              tag = tag.trimStart();
            }

            tname = tag.slice(0, tag.search(/[\s%}-]/));

            // Same as above but for closing delimiters
            if (u.is(tag[tag.length - 1], cc.DSH)) {
              end = '-%}';
              tag = tag.slice(0, tag.length - 1).trimEnd();
            } else {
              end = '%}';
              tag = tag.trimEnd();
            }

            parseExclude(tag, from);

            if (u.is(tag, cc.HSH)) {

              ltype = 'comment';
              end = '%}';
              lchar = end.charAt(end.length - 1);

              return parseComments(true);

            }

          } else {

            preserve = true;
            end = '%}';
            ltype = 'liquid';

          }
        } else {

          preserve = true;
          end = b[a + 1] + '}';
          ltype = 'liquid';

        }
      }

      if (preserve !== true && rules.markup.preserveAttribute === true) {

        // preserve attributes
        preserve = true;

      }

      if (nowalk) return parseExternal();

      lchar = end.charAt(end.length - 1);

      if (ltype === 'comment' && (u.is(b[a], cc.LAN) || (u.is(b[a], cc.LCB) && u.is(b[a + 1], cc.PER)))) {

        return parseComments();

      } else if (a < c) {

        return traverse();

      }

      return parseExternal();

    }

    /**
     * Scripts
     *
     * This the JSX related and does some additional processing for
     * the data structures. This will likely undergo refactors as the
     * script lexer operations are improved in later versions.
     *
     * This function concludes the `parseToken()` lexing operation.
     */
    function parseScript () {

      if (rules.wrap > 0 && jsx === true) {

        let clength: number = 0;
        let bb: number = parse.count;
        let cc: number = 0;

        if (data.types[bb].indexOf('attribute') > -1) {

          do {
            clength = clength + data.token[bb].length + 1;
            bb = bb - 1;
          } while (data.lexer[bb] !== 'markup' || data.types[bb].indexOf('attribute') > -1);

          if (data.lines[bb] === 1) clength = clength + data.token[bb].length + 1;

        } else if (data.lines[bb] === 1) {

          clength = data.token[bb].length + 1;
        }

        cc = bb - 1;

        if (clength > 0 && data.types[cc] !== 'script_end') {
          if (data.types[cc].indexOf('attribute') > -1) {
            do {
              clength = clength + data.token[cc].length + 1;
              cc = cc - 1;
            } while (data.lexer[cc] !== 'markup' || data.types[cc].indexOf('attribute') > -1);
            if (data.lines[cc] === 1) clength = clength + data.token[cc].length + 1;
          } else if (data.lines[cc] === 1) {
            clength = data.token[cc].length + 1;
          }
        }
      }

      parse.lineOffset = 0;

    }

    /**
     * Traverse
     *
     * The real tag lexer. This walks the tag/s and tokenizes
     * attributes and Liquid tokens contained within the markup.
     *
     *  @next ext()
     */
    function traverse (): ReturnType<typeof parseExternal | typeof parseLiquidTag> {

      /* -------------------------------------------- */
      /* CONSTANTS                                    */
      /* -------------------------------------------- */

      /**
       * Lexing store - Character in the lex will reside here
       */
      const lexed: string[] = [];

      /**
       * Liquid store - Interal index references of Liquid tokens
       */
      const liquid: LiquidInternal = {
        pipes: [],
        fargs: [],
        targs: [],
        logic: []
      };

      /* -------------------------------------------- */
      /* REFERENCES                                   */
      /* -------------------------------------------- */

      /**
       * An advancement index reference
       */
      let e: number = 0;

      /**
       * An advancement index reference
       */
      let f: number = 0;

      /**
       * A slice reference string to match sequences
       */
      let string: string = NIL;

      /**
       * Angle bracket count, ie: `<` and `>`
       */
      let acount: number = 0;

      /**
       * Brace count, ie: `{` and ``
       */
      let bcount: number = 0;

      /**
       * Parenthesis count, ie: `(` and `)`
       */
      let pcount: number = 0;

      /**
       * Line count - This is applied to the data structure
       */
      let lines: number = 0;

      /**
       * The quotation character store reference
       */
      let quote: string = NIL;

      /**
       * JSX/TSX quotataion character
       */
      let jsxqo: string = NIL;

      /**
       * JSX/TSX parenthesis counts, ie: `{` and `}`
       */
      let jsxpa: number = 0;

      /**
       * Whether or not we are within a Liquid template token
       */
      let isliq: boolean = false;

      /**
       * Whether or not newline preservation in Liquid tokens is applied
       */
      let ntest: boolean = false;

      /**
       * Whether or not we should invoke a whitespace test
       */
      let stest: boolean = false;

      /**
       * Whether or not we should invoke a quotation test
       */
      let qtest: boolean = false;

      /**
       * Whether or not we are at a starting attribute value quote.
       * This reference will always us to consume nested quotes
       * like those we'd encounter in Liquid tokens.
       */
      let qattr: boolean = false;

      /**
       * Liquid token internal store
       */
      let type: cc = NaN;

      /**
       * Attribute store
       */
      let store: string[] = [];

      /* -------------------------------------------- */
      /* FUNCTIONS                                    */
      /* -------------------------------------------- */

      /**
       * Liquid Normalizer
       *
       * This function is responsible for normalizing the inner contents of Liquid tokens.
       * Spacing corrections and composing a workable store reference as per `liquid` object
       * is the undertaking of this function. There are various complex checks based on
       * surrounding character sequences and current lexed store is also used to help determine
       * the imposed results for normalization.
       *
       * When the function returns a boolean `true` then the traversal will call `continue`
       * otherwise will proceed as normal.
       */
      function normalize () {

        if (u.isLast(lexed, cc.COM)) {

          // Liquid "{% when %}" expressions can be separated by commas
          //
          if (tname === 'when') liquid.logic.push(lexed.length - 1);

          if (rules.correct === true) {

            // Correct for hanging commas
            //
            if (/^,\s*-?[%}]}/.test(source.slice(a))) {
              lexed.pop();
              a = a + 1;
              return true;
            }

          }

          if (type === cc.COM) {
            liquid.fargs[liquid.fargs.length - 1].push(lexed.length - 1);
          } else if (type === cc.COL) {
            liquid.fargs[liquid.fargs.length - 1][0] += 1;
            liquid.fargs[liquid.fargs.length - 1].push(lexed.length - 1);
            type = cc.COM;
          } else {
            liquid.targs.push(lexed.length - 1);
          }

        } else if (u.isLast(lexed, cc.PIP)) {

          liquid.pipes.push(lexed.length - 1);
          type = cc.PIP;

        } else if (u.isLast(lexed, cc.COL) && type === cc.PIP) {

          liquid.fargs.push([ lexed.length - 1 ]);
          type = cc.COL;

        }

        // Liquid Newlines
        //
        // We will remove the last newline character inserted into the lexed
        // stack as we compose a new internal structure and extraneous newlines
        // are not something we want to include. The "ntest" variable holds a
        // reference to delimiter newline expression structures and we also make
        // an additional check to ensure we are not popping delimiters.
        //
        if (
          u.is(b[a], cc.NWL) &&
          tname !== 'liquid' &&
          ntest === false &&
          rules.liquid.preserveInternal === false &&
          lexed.length > 3 && !(
            (
              u.is(b[a + 1], cc.DSH) &&
              u.is(b[a + 2], cc.PER) &&
              u.is(b[a + 3], cc.RCB)
            ) || (
              u.is(b[a + 1], cc.PER) &&
              u.is(b[a + 2], cc.RCB)
            )
          )
        ) {

          lexed.pop();

        } else if (rules.liquid.normalizeSpacing === true) {

          if (
            u.not(b[a], cc.WSP) && (
              u.isLastAt(lexed, cc.SQO) ||
              u.isLastAt(lexed, cc.DQO)
            )
          ) {

            if (
              u.not(b[a], cc.COM) &&
              u.not(b[a], cc.RSB)
            ) {

              lexed.splice(lexed.length - 1, 1, WSP, b[a]);

              if (
                u.not(b[a + 1], cc.WSP) &&
                u.not(b[a + 1], cc.EQS) &&
                u.not(b[a + 1], cc.RCB)
              ) {

                lexed.push(WSP);

              }

            } else if (u.not(b[a + 1], cc.WSP)) {

              lexed.push(WSP);

            }

          } else if (u.is(b[a], cc.WSP) && u.is(b[a - 1], cc.RSB)) {

            lexed.pop();

          } else if (lexed.length > 3 && u.is(b[a + 1], cc.NWL) && u.not(b[a + 2], cc.WSP)) {

            lexed.push(WSP);

          } else if (u.is(b[a], cc.WSP) && u.is(b[a + 1], cc.WSP)) {

            lexed.pop();

          } else if (
            u.isLastAt(lexed, cc.RSB) &&
            u.isLast(lexed, cc.WSP) &&
            u.not(b[a], cc.WSP) &&
            u.not(b[a], cc.COM) &&
            u.not(b[a], cc.DOT)
          ) {

            lexed.splice(lexed.length - 1, 1, WSP, b[a]);

          } else if (u.isLastAt(lexed, cc.WSP) && u.is(b[a], cc.WSP) && u.is(b[a + 1], cc.WSP)) {

            lexed.pop();

          } else if (u.is(b[a], cc.COM) && u.not(b[a + 1], cc.WSP)) {

            lexed.push(WSP);

          } else if (u.is(b[a], cc.COL) && u.not(b[a + 1], cc.WSP)) {

            lexed.push(WSP);

          } else if (u.is(b[a], cc.WSP) && u.isLastAt(lexed, cc.DOT)) {

            lexed.pop();

          } else if (u.isLastSeq(lexed, cc.LSB, cc.WSP)) {

            lexed.pop();

          } else if (u.not(b[a], cc.WSP) && u.is(b[a + 1], cc.PIP)) {

            lexed.push(WSP);

          } else if (u.is(b[a], cc.PIP) && u.not(b[a + 1], cc.WSP)) {

            lexed.push(WSP);

          } else if (u.is(b[a], cc.WSP) && (
            u.is(b[a + 1], cc.DOT) ||
            u.is(b[a + 1], cc.RSB) ||
            u.is(b[a + 1], cc.LSB) ||
            u.is(b[a + 1], cc.COL) ||
            u.is(b[a + 1], cc.COM)
          )) {

            lexed.pop();

          } else if (tname === 'assign' && (
            (
              u.not(b[a], cc.WSP) &&
              u.is(b[a + 1], cc.EQS)
            ) || (
              u.is(b[a], cc.EQS) &&
              u.not(b[a + 1], cc.WSP)
            )
          )) {

            lexed.push(WSP);

          } else if (tname === 'if' || tname === 'unless' || tname === 'elsif') {

            if ((
              u.not(b[a], cc.WSP) ||
              u.is(b[a], cc.NWL)
            ) && (
              u.is(b[a + 1], cc.BNG) ||
              u.is(b[a + 1], cc.LAN) ||
              u.is(b[a + 1], cc.RAN) || (
                u.is(b[a + 1], cc.EQS) &&
                u.is(b[a + 2], cc.EQS)
              )
            )) {

              lexed.push(WSP);

            } else if (u.is(b[a], cc.EQS) && (u.not(b[a + 1], cc.WSP) || u.is(b[a + 1], cc.NWL)) && (
              u.is(b[a - 1], cc.EQS) ||
              u.is(b[a - 1], cc.LAN) ||
              u.is(b[a - 1], cc.RAN) ||
              u.is(b[a - 1], cc.BNG)
            )) {

              lexed.push(WSP);

            } else if (u.not(b[a + 1], cc.WSP) && u.not(b[a + 1], cc.EQS) && (
              u.is(b[a], cc.LAN) ||
              u.is(b[a], cc.RAN)
            )) {

              lexed.push(WSP);

            }
          }

        }

        // Liquid Logical Expressions
        //
        // Used in conditional tags. We will store the starting points for
        // each named operator expression. We also skip ahead if determined to be detected.
        //
        if (u.ws(b[a - 1])) {

          string = source.slice(a);

          if (tname === 'if' || tname === 'elsif' || tname === 'unless') {

            if (u.ws(b[a + 2]) && string.startsWith('or')) {

              liquid.logic.push(lexed.length - 1);

              lexed.pop();
              lexed.push(string.slice(0, 2));

              a = a + 2;
              return true;

            } else if (u.ws(b[a + 3]) && string.startsWith('and')) {

              liquid.logic.push(lexed.length - 1);

              lexed.pop();
              lexed.push(string.slice(0, 3));

              a = a + 3;
              return true;

            } else if (u.ws(b[a + 8]) && string.startsWith('contains')) {

              liquid.logic.push(lexed.length - 1);

              lexed.pop();
              lexed.push(string.slice(0, 8));

              a = a + 8;
              return true;

            }

          } else if (tname === 'when') {

            if (u.ws(b[a + 2]) && string.startsWith('or')) {

              liquid.logic.push(lexed.length - 1);

              lexed.pop();
              lexed.push(string.slice(0, 2));

              a = a + 2;
              return true;

            }
          }
        }

        // Detect Invalid Characters
        //
        if (u.is(lexed[lexed.length - 1], cc.COM)) {

          if (u.is(lexed[lexed.length - 2], cc.COM)) {

            return MarkupError(
              ParseError.InvalidLiquidCharacterSequence,
              lexed.join(NIL),
              lx.getTagName(lexed.join(NIL))
            );

          }
        }

        ntest = false;
      }

      /**
       * Attribute Tokenizer
       *
       * This function is responsible for reasoning with the lexed contents of
       * the recently traversed markup attributes. This updates the `attrs` reference
       * by using the `store[]` entries populated during traversal.
       */
      function tokenize (quotes: boolean) {

        /* -------------------------------------------- */
        /* LEXICAL SCOPES                               */
        /* -------------------------------------------- */

        /**
         * The attribute name (index `0`) and value (index `0`)
         */
        let each: [ name: string, value: string ];

        /**
         * The attribute token, eg: `id="foo"`
         */
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

          attr = store.join(NIL);

          if (jsx === false || (jsx && u.notLast(attr, cc.RCB))) attr = attr.replace(rx.SpacesGlob, WSP);

          each = attrname(attr);

          if (each[0] === 'data-esthetic-ignore') ignore = true;

          if (jsx && u.is(store[0], cc.LCB) && u.is(store[store.length - 1], cc.RCB)) jsxpa = 0;
        }

        // Prevent sorting of attributes when tags contains Liquid tokens
        if (u.is(attr[0], cc.LCB) && u.is(attr[1], cc.PER)) nosort = true;

        attr = attr.replace(/^\u0020/, NIL).replace(/\u0020$/, NIL);
        store = attr.replace(/\r\n/g, NWL).split(NWL);

        if (store.length < 1) store[0] = store[0].replace(rx.SpaceEnd, NIL);

        attr = inner(store.join(parse.crlf), tname);

        if (rules.markup.stripAttributeLines === true && lines >= 1) {
          lines = 1;
        }

        // if (within > 0 || lq.isType(attr, 1)) {

        //   if (lq.isType(attr, 5) === false) {

        //     lines = 0;

        //     if (u.is(b[a + 1], cc.NWL) || u.is(b[a], cc.NWL)) lines = 2;
        //     if (u.is(b[a], cc.WSP) && u.not(b[a + 1], cc.WSP)) lines = 1;

        //   } else {

        //     if (lines <= 2 && u.is(b[a + 1], cc.NWL)) {
        //       lines = 2;
        //     } else if (u.is(b[a + 1], cc.WSP)) {
        //       lines = 1;
        //     } else if (lines >= 1) {
        //       lines = 0;
        //     }
        //   }
        // } else {
        //   if (u.is(b[a + 1], cc.NWL)) {
        //     lines = 2;
        //   } else if (u.is(b[a + 1], cc.WSP)) {
        //     lines = 1;
        //   }
        // }

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

            //   if (attrs[ln][1] === 0 && within > 0) {

            //     attrs[ln][0] = attrs[ln][0] + attr;
            //     attrs[ln][1] = lines;
            //     attr = NIL;

            //   } else if (attrs[ln][1] === 1 && lq.isType(attr, LT.HasOpen)) {

            //     attrs[ln][0] = attrs[ln][0] + attr;
            //     attrs[ln][1] = lines;
            //     attr = NIL;

            //   } else if (within > 0 && lq.isControl(attrs[ln][0])) {

            //     attrs[ln][0] = attrs[ln][0] + attr;
            //     attrs[ln][1] = lines;
            //     attr = NIL;

            //   }

            // } else if (lines > 0) {

            //   if (attrs[ln][1] === 0) {

            //     if (lq.isEnd(attr)) {

            //       attrs[ln][0] = attrs[ln][0] + attr;
            //       attrs[ln][1] = lines;
            //       attr = NIL;

            //     }
            //     // else if (
            //     //   within > 0 &&
            //     //   lq.isType(attrs[ln][0], LT.HasOpen) &&
            //     //   rx.LiquidAttr.test(attrs[ln][0]) === false) {

            //     //   // Attributes contains a Liquid token
            //     //   //
            //     //   attrs[ln][0] = attrs[ln][0] + attr;
            //     //   attr = NIL;
            //     // }

            //   } else if (attrs[ln][1] > 0 && lq.isEnd(attr) && lq.isType(attr, LT.OpenTag) === false) {

            //     const i = attr.indexOf('{%');
            //     attrs.push([ attr.slice(0, i), lines ]);
            //     attr = attr.slice(i);

          //   }
          }
        }

        if (quotes === false) {
          if (lq.isStart(attr)) within = within + 1;
          if (lq.isEnd(attr)) within = within - 1;
        }

        // Populates the "attrs[]" array which will be used
        // when adding the records to the data structures
        //
        if (attr !== NIL && attr !== WSP) attrs.push([ attr, lines ]);

        //  console.log(attrs);

        // Parse Errors
        //
        if (attrs.length > 0) {

          const [ value ] = attrs[attrs.length - 1];

          if (value.indexOf('=\u201c') > 0) { // “

            return MarkupError(ParseError.InvalidQuotation, value);
            // parse.error = 'Invalid quote character (\u201c, &#x201c) used.';

          } else if (value.indexOf('=\u201d') > 0) { // ”

            return MarkupError(ParseError.InvalidQuotation, value);
            //  parse.error = 'Invalid quote character (\u201d, &#x201d) used.';

          }
        }

        store = [];
        lines = u.is(b[a], cc.NWL) ? 1 : 0;

      };

      /* -------------------------------------------- */
      /* TRAVERSAL                                    */
      /* -------------------------------------------- */

      if (parse.error) return;

      do {

        // Newline Increments
        //
        if (u.is(b[a], cc.NWL)) lines = parse.lines(a, lines);

        // Frontmatter Ignores
        //
        if (start === '---' && end === '---' && ltype === 'ignore') {

          lexed.push(b[a]);

          if (a > 3 && u.is(b[a], cc.DSH) && u.is(b[a - 1], cc.DSH) && u.is(b[a - 2], cc.DSH)) break;
          a = a + 1;
          continue;

        }

        // Liquid Tokens
        //
        if (preserve === true || ((u.ws(b[a]) === false && u.not(quote, cc.RCB)) || u.is(quote, cc.RCB))) {

          lexed.push(b[a]);

          // Liquid Token Types, eg: {% OR {{
          //
          if (isliq === false && u.is(b[a - 1], cc.LCB) && (
            u.is(b[a], cc.LCB) ||
            u.is(b[a], cc.PER)
          )) {

            isliq = true;

          } else if (isliq === true && u.is(b[a], cc.RCB)) {

            if (u.is(b[a - 1], cc.RCB) || u.is(b[a - 1], cc.PER)) {

              isliq = false;

            } else if ((u.is(b[a - 2], cc.RCB) || u.is(b[a - 2], cc.PER)) && u.ws(b[a - 1])) {

              return MarkupError(ParseError.MissingLiquidCloseDelimiter, lexed.join(NIL));

            }

          } else if (isliq === true && u.is(b[a], cc.NWL) &&
            rules.liquid.preserveInternal === false && (
            rules.liquid.delimiterPlacement === 'preserve' ||
            rules.liquid.delimiterPlacement === 'consistent'
          )) {

            // Preserve newlines at starting delimiter, eg: {{\n or {%\n etc
            //
            if ((
              u.is(b[a - 1], cc.DSH) &&
              u.is(b[a - 3], cc.LCB) && (
                u.is(b[a - 2], cc.LCB) ||
                u.is(b[a - 2], cc.PER)
              )
            ) || (
              u.is(b[a - 2], cc.LCB) && (
                u.is(b[a - 1], cc.LCB) ||
                u.is(b[a - 1], cc.PER)
              )
            )) {

              ntest = true;

            } else if (/^\s*-?[%}]}/.test(source.slice(a)) === true) {

              // Preserve newlines at ending delimiters, eg: \n}} or %} etc
              // We will also move ahead in the traversal, skipping additional
              // whitespace or newline occurances, as per the the do/while loop
              //
              while (u.ws(b[a]) === true) {
                a = a + 1;
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
            u.is(lexed[1], cc.FWS) && (
              u.is(lexed[lexed.length - 1], cc.FWS) ||
              u.is(lexed[lexed.length - 1], cc.LAN)
            )
          ) {

            if (rules.correct) {

              lexed.pop();
              lexed.push('>');

            } else {

              return MarkupError(ParseError.MissingHTMLEndingDelimiter, lexed.join(NIL));

            }

            break;
          }

          // Empty HTML Tags, eg: <>
          //
          if (
            u.is(lexed[0], cc.LAN) &&
            u.is(lexed[1], cc.RAN) &&
            u.is(end, cc.RAN)
          ) {

            return push(record, '(empty)', {
              token: '<>',
              types: 'start'
            });

          }

          // Empty HTML End Tags, eg: </>
          //
          if (
            u.is(lexed[0], cc.LAN) &&
            u.is(lexed[1], cc.FWS) &&
            u.is(lexed[2], cc.RAN) &&
            u.is(end, cc.RAN)) {

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
          if (b[a] === lchar && lexed.length > end.length + 1) {

            // Current character matches the last character of the tag ending sequence
            f = lexed.length;
            e = end.length - 1;

            if (e > -1) {
              do {
                f = f - 1;
                if (u.not(lexed[f], end.charCodeAt(e))) break;
                e = e - 1;
              } while (e > -1);
            }

            if (e < 0) break;

          }

        } else {

          if (quote === NIL) {

            // HTML Bang Sequence, eg: <!
            //
            if (u.is(lexed[0], cc.LAN) && u.is(lexed[1], cc.BNG) && ltype !== 'cdata') {

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
                    a = a + 1;
                    if (u.is(b[a], cc.NWL)) lines = parse.lines(a, lines);
                  } while (a < c - 1 && u.ws(b[a + 1]));
                }

                if (u.is(b[a + 1], cc.LAN)) {
                  ltype = 'start';
                  break;
                }
              }
            }

            // JSX Parenthesis, eg: { or }
            //
            if (jsx) {
              if (u.is(b[a], cc.LCB)) {
                jsxpa = jsxpa + 1;
              } else if (u.is(b[a], cc.RCB)) {
                jsxpa = jsxpa - 1;
              }
            }

            // HTML Invalid Structure
            //
            if (
              u.is(b[a], cc.LAN) &&
              basic === true &&
              preserve === false &&
              lexed.length > 1 &&
              />{2,3}/.test(end) === false) {
              parse.error = `Invalid structure detected ${b.slice(a, a + 8).join(NIL)}`;
              break;
            }

            // HTML/Liquid Attribute Sequences
            //
            // The traversal operations contained within this condition
            // pertain directly to attributes and innner markup <tag> content
            //
            if (u.ws(b[a]) === false && stest === true && b[a] !== lchar) {

              // Attribute start
              //

              icount = 0;
              stest = false;
              quote = jsxqo;

              lexed.pop();

              if (a < c) {

                do {

                  // Newline Increments
                  //
                  if (u.is(b[a], cc.NWL) && qattr === false) {

                    lines = parse.lines(a, lines);

                  }

                  if (rules.markup.preserveAttribute === true) {

                    lexed.push(b[a]);

                  } else {

                    store.push(b[a]);

                  }

                  if (u.not(quote, cc.DQO) || u.not(quote, cc.SQO)) {

                    if (u.is(b[a - 1], cc.LCB) && (
                      u.is(b[a], cc.PER) ||
                      u.is(b[a], cc.LCB)
                    )) {

                      isliq = true;

                    } else if (u.is(b[a], cc.RCB) && (
                      u.is(b[a - 1], cc.RCB) ||
                       u.is(b[a - 1], cc.PER)
                    )) {

                      isliq = false;

                    }
                  }

                  if (
                    jsx === false &&
                    qattr === false &&
                    isliq === true &&
                    rules.markup.preserveAttribute === false
                  ) {

                    while (a < c) {

                      a = a + 1;

                      // Newline Increments
                      //
                      if (u.is(b[a], cc.NWL)) lines = parse.lines(a, lines);

                      if (u.is(store[0], cc.EQS) && (
                        u.is(store[1], cc.LCB) ||
                        u.is(store[1], cc.PER)
                      ) && (
                        u.is(store[store.length - 2], cc.RCB) ||
                        u.is(store[store.length - 2], cc.PER)
                      ) && (
                        u.is(store[store.length - 1], cc.RCB)
                      )) {

                        isliq = false;
                        quote = NIL;
                        tokenize(false);
                        break;
                      }

                      // Equals Character
                      //
                      if (u.is(store[0], cc.EQS) && u.not(store[1], cc.LCB)) {
                        isliq = false;
                        quote = NIL;
                        tokenize(false);
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
                      if (u.not(store[0], cc.EQS) && u.is(b[a], cc.RCB) && (
                        u.is(b[a - 1], cc.RCB) ||
                        u.is(b[a - 1], cc.PER)
                      )) {

                        isliq = false;
                        quote = NIL;
                        tokenize(false);

                        break;

                      }

                    }

                  }

                  if (jsx === false && (
                    u.is(b[a], cc.LAN) ||
                    u.is(b[a], cc.RAN)
                  ) && (
                    quote === NIL ||
                    u.is(quote, cc.RAN)
                  )) {

                    if (quote === NIL && u.is(b[a], cc.LAN)) {

                      quote = '>';
                      acount = 1;

                    } else if (u.is(quote, cc.RAN)) {

                      if (u.is(b[a], cc.LAN)) {

                        acount = acount + 1;

                      } else if (u.is(b[a], cc.RAN)) {

                        acount = acount - 1;

                        if (acount === 0) {
                          quote = NIL;
                          icount = 0;
                          tokenize(false);
                          break;
                        }
                      }
                    }

                  } else if (quote === NIL) {

                    if (b[a + 1] === lchar) {

                      // If we are at end of tag, we exit the traversal.
                      //
                      if (u.isLast(store, cc.FWS) || (u.isLast(store, cc.QWS) && ltype === 'xml')) {

                        store.pop();
                        preserve === false || lexed.pop();
                        a = a - 1;

                      }

                      if (store.length > 0) tokenize(false);

                      break;
                    }

                    if (jsx === false && u.is(b[a], cc.LCB) && u.is(b[a - 1], cc.EQS)) {

                      quote = '}';

                    } else if (u.is(b[a], cc.DQO) || u.is(b[a], cc.SQO)) {

                      quote = b[a];

                      if (qattr === false && isliq === false) qattr = true;

                      if (u.is(b[a - 1], cc.EQS) && (u.is(b[a + 1], cc.LAN) || (
                        u.is(b[a + 1], cc.LCB) &&
                        u.is(b[a + 2], cc.PER)
                      ) || (
                        u.ws(b[a + 1]) &&
                        u.not(b[a - 1], cc.EQS)
                      ))) {

                        icount = a;

                      }

                    } else if (u.is(b[a], cc.LPR)) {

                      quote = ')';
                      pcount = 1;

                    } else if (jsx) {

                      // JSX Variable attribute
                      //
                      if ((u.is(b[a - 1], cc.EQS) || u.ws(b[a - 1])) && u.is(b[a], cc.LCB)) {

                        quote = '}';
                        bcount = 1;

                      } else if (u.is(b[a], cc.FWS)) {

                        // JSX Comments
                        if (u.is(b[a + 1], cc.ARS)) {
                          quote = '\u002a/';
                        } else if (u.is(b[a + 1], cc.FWS)) {
                          quote = NWL;
                        }

                      }

                    } else if (u.is(lexed[0], cc.LCB) && u.is(b[a], cc.LCB) && (
                      u.is(b[a + 1], cc.LCB) ||
                      u.is(b[a + 1], cc.PER)
                    )) {

                      // Opening parseExternal template expression
                      //
                      quote = u.is(b[a + 1], cc.LCB) ? '}}' : b[a + 1] + '}';

                    }

                    if (u.ws(b[a]) && quote === NIL) {

                      // Testing for a run of spaces between an attribute's = and a quoted value.
                      // Unquoted values separated by space are separate attrs
                      //
                      if (u.is(store[store.length - 2], cc.EQS)) {

                        e = a + 1;

                        if (e < c) {
                          do {

                            if (u.ws(b[e]) === false) {

                              if (u.is(b[e], cc.DQO) || u.is(b[e], cc.SQO)) {
                                a = e - 1;
                                qtest = true;
                                store.pop();
                              }

                              break;
                            }

                            e = e + 1;
                          } while (e < c);
                        }
                      }

                      if (qtest === true) {

                        qtest = false;

                      } else if (jsxpa === 0 || (jsxpa === 1 && u.is(store[0], cc.LCB))) {

                        // If there is an unquoted space attribute is complete
                        //
                        store.pop();

                        if (store.length > 0) tokenize(false);

                        stest = true;
                        break;
                      }
                    }

                  } else if (u.is(b[a], cc.LPR) && u.is(quote, cc.RPR)) {

                    pcount = pcount + 1;

                  } else if (u.is(b[a], cc.RPR) && u.is(quote, cc.RPR)) {

                    pcount = pcount - 1;

                    if (pcount === 0) {

                      quote = NIL;

                      if (u.is(b[a + 1], end.charCodeAt(0))) {

                        tokenize(false);
                        break;

                      }
                    }

                  } else if (jsx === true && (
                    u.is(quote, cc.RCB) || (
                      u.is(quote, cc.NWL) &&
                      u.is(b[a], cc.NWL)
                    ) || (
                      u.is(quote, cc.ARS) &&
                      u.is(b[a - 1], cc.ARS) &&
                      u.is(b[a], cc.FWS)
                    )
                  )) {

                    /* JSX ATTRIBUTES ----------------------------- */

                    if (u.is(b[a], cc.TQO)) {

                      a = a + 1;

                      do {
                        store.push(b[a]);
                        if (u.is(b[a], cc.TQO)) break;
                        a = a + 1;
                      } while (a < b.length);
                    }

                    // JSX Attributes
                    //
                    if (u.is(quote, cc.RCB)) {
                      if (u.is(b[a], cc.RCB) && b[a] !== quote) {

                        bcount = bcount + 1;

                      } else if (b[a] === quote) {

                        bcount = bcount - 1;

                        if (bcount === 0) {

                          jsxpa = 0;
                          quote = NIL;
                          token = store.join(NIL);

                          if (rules.markup.preserveAttribute === false) {
                            if (jsx) {
                              if (!/^\s*$/.test(token)) attrs.push([ token, lines ]);
                            } else {
                              token = token.replace(rx.SpacesGlob, WSP);
                              if (token !== WSP) attrs.push([ token, lines ]);
                            }
                          }

                          store = [];
                          lines = 1;
                          break;
                        }
                      }

                    } else {

                      jsxqo = NIL;
                      jscomm = true;
                      token = store.join(NIL);

                      if (token !== WSP) attrs.push([ token, lines ]);

                      store = [];
                      lines = u.is(quote, cc.NWL) ? 2 : 1;
                      quote = NIL;

                      break;
                    }

                  } else if (
                    u.is(b[icount - 1], cc.EQS) &&
                    u.is(b[a], cc.LCB) &&
                    u.is(b[a + 1], cc.PER) && (
                      u.is(quote, cc.DQO) ||
                      u.is(quote, cc.SQO)
                    )
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
                    u.is(end, cc.RAN) &&
                    u.is(b[icount - 1], cc.EQS) && (
                      u.is(quote, cc.DQO) ||
                      u.is(quote, cc.SQO)
                    )
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

                  } else if (
                    icount === 0 &&
                    u.not(quote, cc.RAN) && (
                      quote.length < 2 || (
                        u.not(quote, cc.DQO) &&
                        u.not(quote, cc.SQO)
                      )
                    )
                  ) {

                    // Terminate attribute at the conclusion of a quote pair
                    f = 0;
                    e = quote.length - 1;

                    if (e > -1) {

                      do {

                        if (u.not(b[a - f], quote.charCodeAt(e))) break;

                        f = f + 1;
                        e = e - 1;

                      } while (e > -1);
                    }

                    if (e < 0 && isliq === false && qattr === true) {
                      qattr = false;
                      tokenize(true);
                      if (b[a + 1] === lchar) break;
                    }

                    // TODO
                    // FIX ERROR
                    if (e === 0 && u.is(b[a], cc.RAN) && qattr === true && isliq === false) {
                      //   parse.error = 'missing quotataion';

                      //   break;
                    }

                  } else if (icount > 0 && u.ws(b[a]) === false) {

                    icount = 0;

                  }

                  a = a + 1;

                } while (a < c);
              }
            } else if (
              u.is(end, cc.NWL) === false && (
                u.is(b[a], cc.DQO) ||
                u.is(b[a], cc.SQO)
              )
            ) {

              // Opening quote
              quote = b[a];

            } else if (a > 0 && isliq === true && u.not(quote, cc.DQO) && u.not(quote, cc.SQO)) {

              if (normalize() === true) continue;

            } else if (
              ltype !== 'comment' &&
              u.not(end, cc.NWL) &&
              u.is(b[a], cc.LAN) &&
              u.is(b[a + 1], cc.BNG) &&
              u.is(b[a + 2], cc.DSH) &&
              u.is(b[a + 3], cc.DSH) &&
              data.types[parse.count] !== 'conditional'
            ) {

              quote = '-->';

            } else if (
              u.is(b[a], cc.LCB) &&
              u.not(lexed[0], cc.LCB) &&
              u.not(end, cc.NWL) && (
                u.is(b[a + 1], cc.LCB) ||
                u.is(b[a + 1], cc.PER)
              )
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

              if (quote === end) quote = NIL;

            } else if (
              basic &&
              u.not(end, cc.NWL) &&
              u.not(b[a - 1], cc.LAN) &&
              u.ws(b[a])
            ) {

              // Identify a space in a regular start or singleton tag
              //
              stest = true;

            } else if (
              basic &&
              jsx &&
              u.is(b[a], cc.FWS) && (
                u.is(b[a + 1], cc.ARS) ||
                u.is(b[a + 1], cc.FWS)
              )
            ) {

              // JSX Comment immediately following tag each
              //
              stest = true;
              lexed[lexed.length - 1] = WSP;
              jsxqo = u.is(b[a + 1], cc.ARS) ? '\u002a/' : NWL;
              store.push(b[a]);

            } else if (
              isliq === false && (
                b[a] === lchar || (
                  u.is(end, cc.NWL) &&
                  u.is(b[a + 1], cc.LAN)
                )
              ) && (
                lexed.length > end.length + 1 ||
                u.is(lexed[0], cc.RSB)
              ) && (
                jsx === false ||
                jsxpa === 0
              )
            ) {

              if (u.is(end, cc.NWL)) {
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
              f = lexed.length;
              e = end.length - 1;

              if (e > -1) {
                do {
                  f = f - 1;
                  if (lexed[f] !== end.charAt(e)) break;
                  e = e - 1;
                } while (e > -1);
              }

              if (e < 0) {

                // This condition will fix incorrect line spaces applied
                // on template attrs that are contained in the attribute store
                //
                if (
                  u.is(lexed[f], cc.RAN) &&
                  u.is(b[a], cc.RAN) &&
                  u.is(b[a - 1], cc.RCB) &&
                  u.ws(b[a + 1]) &&
                  attrs.length > 0 &&
                  attrs[attrs.length - 1][1] === 0
                ) {

                  attrs[attrs.length - 1][1] = u.is(b[a + 1], cc.WSP) ? 1 : 2;

                }

                break;

              }
            }
          } else if (
            u.is(b[a], quote.charCodeAt(quote.length - 1)) &&
            u.not(b[a - 1], cc.BWS) && (
              (
                jsx === true &&
                u.is(end, cc.RCB) &&
                esc(a) === false
              ) || (
                jsx === false ||
                u.not(end, cc.RCB)
              )
            )
          ) {

            // Find the closing quote or external template expression
            //
            f = 0;
            e = quote.length - 1;

            if (e > -1) {
              do {
                if (u.not(b[a - f], quote.charCodeAt(e))) break;
                f = f + 1;
                e = e - 1;
              } while (e > -1);
            }

            if (e < 0) quote = NIL;

          }
        }

        a = a + 1;

      } while (a < c);

      icount = 0;

      if (!tname) tname = lx.getTagName(lexed.join(NIL));

      if (ignore === false) {
        if (ltype === 'liquid') {

          token = lq.tokenize(lexed, tname, liquid, rules);

          // Normalize Patches
          //
          // A second pass-through to ensure no incorrect normalizations
          // have been applied to the token. Normalization is not always
          // perfect at the traverse level, this condition will quickly
          // check the token and fix any potential issues
          //
          if (rules.liquid.normalizeSpacing) {

            token = token
              .replace(/\] \[/g, '][') // Fixes object braces
              .replace(/(\])(\w+:)/, '$1 $2'); // Fixes argument spacing

            // Fixes "as" spacing on rendeer tag
            if (tname === 'render' && token.indexOf(']as') > -1) token = token.replace(/\]as(?=\s+)/, '] as');

          }

          if (tname === 'liquid') return parseLiquidTag();

        } else {
          token = lexed.join(NIL);
        }
      } else {

        token = lexed.join(NIL);

      }

      if (tname === 'xml') {
        html = 'xml';
      } else if (html === NIL && tname === 'html') {
        html = 'html';
      }

      record.token = token;
      record.types = ltype;

      if (preserve === false && jsx === false) token = token.replace(rx.SpacesGlob, WSP);

      return parseExternal();

    }

    /* -------------------------------------------- */
    /* INVOKE                                       */
    /* -------------------------------------------- */

    return parseDelimiter();

  }

  /**
   * Parse Content
   *
   * This function is responsible for parsing everything
   * other than markup identified tags.
   */
  function parseContent (): void {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    /**
     * The current lexed character references
     */
    const lexed: string[] = [];

    /**
     * The current index content parse has began, ie: `a` number
     */
    const now = a;

    /**
     * Whether or not content is JSX brace token
     */
    const jsxbrace = jsx === true && u.is(data.token[parse.count], cc.LCB);

    /**
     * Regex Characters
     */
    const regex = '([{!=,;.?:&<>';

    /* -------------------------------------------- */
    /* LEXICAL SCOPES                               */
    /* -------------------------------------------- */

    /**
     * The last known token
     */
    let ltoke: string = NIL;

    /**
     * The number of line spaces incurred, ie: `parse.lineOffset`
     */
    let lines: number = parse.lineOffset;

    /**
     * The tag name or known name reference
     */
    let type: Languages = Languages.HTML;

    /**
     * The tag name or known name reference
     */
    let name: string = NIL;

    /**
     * Initial data record state for the parsed content
     */
    const record: Record = {
      begin: parse.stack.index,
      ender: -1,
      lexer: 'markup',
      lines,
      stack: lx.getTagName(parse.stack.token) || 'global',
      token: NIL,
      types: 'content'
    };

    if (jsxbrace === true) {

      name = 'script';

    } else if (parse.stack.index > -1) {

      name = lx.getTagName(data.token[parse.stack.index]);

      if (data.types[parse.stack.index].startsWith('liquid_')) {
        type = Languages.Liquid;
      }

    } else {

      name = lx.getTagName(data.token[data.begin[parse.count]]);

      if (data.types[data.begin[parse.count]].startsWith('liquid_')) {
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

    if (type === Languages.Liquid) {
      if (name === 'capture') {

        const start = source.indexOf('endcapture', a);

        if (start > -1) {

          const from = b.lastIndexOf('{', start);

          record.token = b.slice(a, from).join(NIL);
          record.types = 'ignore';

          console.log(record);

          push(record);

          a = from - 1;

          return;

        } else {
          SyntacticError(ParseError.MissingLiquidEndTag, {
            expect: '{% endcapture%}',
            index: a,
            line: parse.lineNumber,
            stack: record.stack,
            token: b.slice(now, a).join(NIL),
            type: Languages.Liquid
          });
        }
      }
    }

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
        data.token[parse.count].charCodeAt(data.token[parse.count].length - 1) === cc.LSB
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

    if (a < c) {

      /**
       * Ending token/character value
       */
      let end: string = NIL;

      /**
       * Character reference
       */
      let quote: string = NIL;

      /**
       * External output string capture
       */
      let output: string = NIL;

      /**
       * Quotation character quotes
       */
      let quotes: number = 0;

      do {

        if (u.is(b[a], cc.NWL)) lines = parse.lines(a, lines);

        // Embed code requires additional parsing to look for the appropriate end
        // tag, but that end tag cannot be quoted or commented
        //
        if (embed === true) {

          if (type === Languages.Liquid) {

            const ename = `end${name}`;
            const ender = source.indexOf(ename, a);

            if (ender > -1) {

              const from = b.lastIndexOf('{', ender);
              const next = b.indexOf('}', ender + ename.length) + 1;

              end = b.slice(from, next).join(NIL);

              if (lq.exp(ename).test(end)) {

                lines = 1;
                output = b.slice(a, from).join(NIL);

                parse.external(language, output);

                if (lines !== parse.lineOffset) lines = parse.lineOffset;

                record.token = inner(end);
                record.types = 'liquid_end';
                record.lines = lines;

                push(record);

                a = next - 1;

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
              } else if (!jsx && name === 'script' && u.not(b[a - 1], cc.LAN) && regex.indexOf(b[a - 1]) > -1) {
                quote = 'r';
              }

            } else if (
              esctest() === false && (
                u.is(b[a], cc.DQO) ||
                u.is(b[a], cc.SQO) ||
                u.is(b[a], cc.TQO)
              )
            ) {

              quote = b[a];

            } else if (u.is(b[a], cc.LCB) && jsxbrace === true) {

              quotes = quotes + 1;

            } else if (u.is(b[a], cc.RCB) && jsxbrace === true) {

              if (quotes === 0) {

                output = lexed
                  .join(NIL)
                  .replace(rx.SpaceLead, NIL)
                  .replace(rx.SpaceEnd, NIL);

                parse.external(language, output);
                parse.stack.update(parse.stack.index + 1); // Added incremental

                if (data.types[parse.count] === 'end' && data.lexer[data.begin[parse.count] - 1] === 'script') {

                  push(record, {
                    lexer: 'script',
                    types: 'separator',
                    token: rules.correct === true ? ';' : 'x;'
                  });

                  record.lexer = 'markup';

                }

                push(record, {
                  token: '}',
                  types: 'script_end'
                });

                parse.stack.pop();

                break;
              }

              quotes = quotes - 1;

            }

            if (name === 'script') {

              end = b
                .slice(a + 1, a + 10)
                .join(NIL)
                .toLowerCase();

              if (end === '</script>') {

                if (lexed.length < 1) break;

                output = lexed.join(NIL).trimEnd();

                if (rx.HTMLCommDelimOpen.test(output) && rx.HTMLCommDelimClose.test(output)) {

                  push(record, { token: '<!--', types: 'comment' });

                  output = output
                    .replace(rx.HTMLCommDelimOpen, NIL)
                    .replace(rx.HTMLCommDelimClose, NIL);

                  parse.external('javascript', output);

                  push(record, { token: '-->' });

                } else {

                  parse.external(language, output);

                  record.token = end;
                  record.types = 'end';

                }

                break;

              }

            } else if (name === 'style') {

              if (u.is(b[a + 1], cc.LAN) && u.is(b[a + 2], cc.FWS)) {

                end = b
                  .slice(a + 1, a + 8)
                  .join(NIL)
                  .toLowerCase();

                if (end === '</style') {

                  if (lexed.length < 1) break;

                  output = lexed.join(NIL).trimEnd();

                  if (u.is(output, cc.RAN)) output = output.slice(1);

                  if ((rx.HTMLCommDelimOpen).test(output) && (rx.HTMLCommDelimClose).test(output)) {

                    push(record, { token: '<!--', types: 'comment' });

                    output = output
                      .replace(rx.HTMLCommDelimOpen, NIL)
                      .replace(rx.HTMLCommDelimClose, NIL);

                    parse.external('css', output);

                    push(record, { token: '-->' });

                  } else {

                    parse.external(language, output);

                  }

                  break;

                }
              }
            }

          } else if (
            quote === b[a] &&
            esctest() === false && (
              u.is(quote, cc.DQO) ||
              u.is(quote, cc.SQO) ||
              u.is(quote, cc.TQO) || (
                u.is(quote, cc.ARS) &&
                u.is(b[a + 1], cc.FWS)
              )
            )
          ) {

            quote = NIL;

          } else if (
            u.is(quote, cc.TQO) &&
            u.is(b[a], cc.DOL) &&
            u.is(b[a + 1], cc.LCB) &&
            esctest() === false
          ) {

            quote = '}';

          } else if (
            u.is(quote, cc.RCB) &&
            u.is(b[a], cc.RCB) &&
            esctest() === false
          ) {

            quote = '`';

          } else if (
            u.is(quote, cc.FWS) && (
              u.is(b[a], cc.NWL) ||
              u.is(b[a], cc.CAR)
            )
          ) {

            quote = NIL;

          } else if (
            quote === 'r' &&
            u.is(b[a], cc.FWS) &&
            esctest() === false
          ) {

            quote = NIL;

          } else if (
            u.is(quote, cc.FWS) &&
            u.is(b[a], cc.RAN) &&
            u.is(b[a - 1], cc.DSH) &&
            u.is(b[a - 2], cc.DSH)
          ) {

            end = source.slice(a + 1, a + 11).toLowerCase();
            end = end.slice(0, end.length - 2);

            if (name === 'script' && end === '</') quote = NIL;

            end = end.slice(0, end.length - 1);

            if (name === 'style' && end === '</style') quote = NIL;

          }
        }

        // Typically this logic is for artifacts nested within an SGML tag
        if (sgml() === true && u.is(b[a], cc.RSB)) {

          a = a - 1;

          lines = 0;
          ltoke = lexed.join(NIL).replace(rx.SpaceEnd, NIL);

          push(record, { token: ltoke });

          break;
        }

        // General Content Processing
        //
        if (embed === false && lexed.length > 0 && (
          (
            u.is(b[a], cc.LAN) &&
            u.not(b[a + 1], cc.EQS) &&
            u.digit(b[a + 1]) === false &&
            u.ws(b[a + 1]) === false
          ) || (
            u.is(b[a], cc.LSB) &&
            u.is(b[a + 1], cc.PER)
          ) || (
            u.is(b[a], cc.LCB) && (
              jsx === true ||
              u.is(b[a + 1], cc.LCB) ||
              u.is(b[a + 1], cc.PER)
            )
          )
        )) {

          a = a - 1;

          lines = 0;
          ltoke = parse.stack.token === 'comment'
            ? lexed.join(NIL)
            : lexed.join(NIL).replace(rx.SpaceEnd, NIL);

          record.token = ltoke;

          if (rules.wrap > 0 && rules.markup.preserveText === false) {

            /* -------------------------------------------- */
            /* LEXICALS                                     */
            /* -------------------------------------------- */

            /**
             * Wrap limit reference of `rules.wrap`
             */
            let width = rules.wrap;

            /**
             * Last known token length
             */
            let chars = ltoke.length;

            /* -------------------------------------------- */
            /* CONSTANTS                                    */
            /* -------------------------------------------- */

            /**
             * Character store which characters are inserted
             */
            const store: string[] = [];

            /**
             * Determines the character width limit before applying word wrapping.
             */
            function wrapper () {

              if (u.is(ltoke[width], cc.WSP)) {
                store.push(ltoke.slice(0, width));
                ltoke = ltoke.slice(width + 1);
                chars = ltoke.length;
                width = rules.wrap;
                return;
              }

              do width = width - 1;
              while (width > 0 && u.not(ltoke[width], cc.WSP));

              if (width > 0) {

                store.push(ltoke.slice(0, width));
                ltoke = ltoke.slice(width + 1);
                chars = ltoke.length;
                width = rules.wrap;

              } else {

                width = rules.wrap;

                do width = width + 1;
                while (width < chars && u.not(ltoke[width], cc.WSP));

                store.push(ltoke.slice(0, width));

                ltoke = ltoke.slice(width + 1);
                chars = ltoke.length;
                width = rules.wrap;

              }

            };

            // HTML Anchors Wrapping
            //
            // HTML anchor lists do not get wrapping unless the content itself exceeds
            // the wrapping limit defined in globals
            //
            if (
              data.token[data.begin[parse.count]] === '<a>' &&
              data.token[data.begin[data.begin[parse.count]]] === '<li>' &&
              data.lines[data.begin[parse.count]] === 0 &&
              parse.lineOffset === 0 &&
              ltoke.length < rules.wrap
            ) {
              push(record);
              break;
            }

            if (chars < rules.wrap) {
              push(record);
              break;
            }

            if (parse.lineOffset < 1 && parse.count > -1) {

              let count = parse.count;

              do {

                width = width - data.token[count].length;

                if (data.types[count].indexOf('attribute') > -1) width = width - 1;
                if (data.lines[count] > 0 && data.types[count].indexOf('attribute') < 0) break;

                count = count - 1;

              } while (count > 0 && width > 0);

              if (width < 1) width = ltoke.indexOf(WSP);

            }

            ltoke = lexed
              .join(NIL)
              .replace(rx.SpaceLead, NIL)
              .replace(rx.SpaceEnd, NIL)
              .replace(rx.SpacesGlob, WSP);

            do wrapper();
            while (width < chars);

            if (ltoke !== NIL && u.not(ltoke, cc.WSP)) store.push(ltoke);

            ltoke = store.join(parse.crlf);
            ltoke = NIL + ltoke + NIL;

          } else {

            const at = ltoke.indexOf(NWL);

            if (at > -1) {

              push(record, { token: ltoke.slice(0, at) });

              ltoke = ltoke.slice(at);

              if (rx.NewlineLead.test(ltoke)) {
                record.lines = 1;
              } else {
                record.lines = 2;
                ltoke = ltoke.replace(rx.SpaceLead, NIL);
              }
            }
          }

          lines = 0;
          record.token = ltoke;
          push(record);

          break;
        }

        lexed.push(b[a]);

        a = a + 1;
      } while (a < c);
    }

    if (a > now && a < c) {

      if (u.ws(b[a])) {

        let x = a;

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

      // regular content at the end of the supplied source
      if (type === Languages.Liquid && record.types === 'liquid_end') {
        ltoke = inner(lexed.join(NIL).replace(rx.SpaceEnd, NIL));
      } else {
        ltoke = lexed.join(NIL).replace(rx.SpaceEnd, NIL);
      }

      lines = 0;

      // this condition prevents adding content that was just added in the loop above
      if (record.token !== ltoke) {

        if (type === Languages.Liquid && record.types === 'liquid_end') ltoke = inner(ltoke);

        record.token = ltoke;
        push(record);
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
  function parseSpace (): void {

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

  //  console.log(parse.current);
  }

  if (parse.language === 'html' || parse.language === 'liquid') html = 'html';

  do {

    if (parse.error) return data;

    if (u.ws(b[a])) {

      parseSpace();

    } else if (embed === false) {

      if (u.is(b[a], cc.LAN)) {

        parseToken(NIL);

      } else if (u.is(b[a], cc.LCB) && (jsx || u.is(b[a + 1], cc.LCB) || u.is(b[a + 1], cc.PER))) {

        parseToken(NIL);

      } else if (u.is(b[a], cc.DSH) && u.is(b[a + 1], cc.DSH) && u.is(b[a + 2], cc.DSH)) {

        parseToken('---');

      } else {

        parseContent();

      }

    } else {

      parseContent();

    }

    a = a + 1;

    if (a === c) {
      if (parse.pairs.size > 0 && parse.pairs.has(parse.stack.index)) {

        console.log(parse.pairs);

        const pair = parse.pairs.get(parse.stack.index);

        if (pair.type === Languages.HTML) {

          SyntacticError(ParseError.MissingHTMLEndTag, pair);

        }

      }
    }

  } while (a < c);

  return data;

};
