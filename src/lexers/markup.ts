import type { Record, Types, LanguageName } from 'types/internal';
import { parse } from '@parse/parser';
import { sortSafe } from '@parse/sorting';
import { grammar } from '@parse/grammar';
import { commentBlock, commentLine } from 'comments';
import { DQO, NIL, NWL, SQO, WSP } from 'chars';
import { cc } from 'lexical/codes';
import * as rx from 'lexical/regex';
import * as lx from 'lexical/lexing';
import * as lq from 'lexical/liquid';
import * as u from 'utils';
import * as external from '@parse/external';
/**
 * Markup Lexer
 *
 * Used to parse markup languages. This used to be used for multiple
 * template languages in options but has been refactored to solely
 * focus and support the following language only:
 *
 * - HTML
 * - XML
 * - JSX
 * - SGML
 * - Liquid.
 */
// esthetic.lexers.markup =

export function markup (input?: string) {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * Parse data reference
   */
  const { data, rules } = parse;

  /**
   * Source string, typically called from `parse.source` but can also be `input` parameter
   */
  const source = input || parse.source;

  /**
   * Whether or not language mode is TSX / JSX
   */
  const jsx = rules.language === 'jsx' || rules.language === 'tsx';

  /**
   * Ignored Liquid Tags
   */
  const ignored = new Set(rules.liquid.ignoreTagList);

  /**
   * Attribute sorting list length
   */
  const asl = rules.markup.attributeSortList.length;

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
    tname: string[],
    index: number[],
  } = {
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
   * embed Tags parseExternal language
   */
  let language: LanguageName;

  /**
   * embed Tag, eg: <scrip> or {% schema %} etc
   */
  let embed: boolean = false;

  /**
   * HTML String
   */
  let html = markup ? rules.language : 'html';

  /**
   * Stack nesting reference for Liquid tokens, increments by 1
   * for each opener and decrements for each ender.
   */
  let within: number = 0;

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

  /**
   * Syntactical Tracking
   *
   * This is a store The `parse.data.begin` index. This will typically
   * reference the `parse.count` value, incremented by `1`
   */
  function syntactic (record: Record) {

    function excerpt (no: number) {

      const line = source.split(NWL);

      return [
        `${no - 2} │ ${line[no - 3].trim().length === 0 ? '␤' : line[no - 3].trim()}`,
        `${no - 1} │ ${line[no - 2].trim().length === 0 ? '␤' : line[no - 2].trim()}`,
        `${no} │ ${line[no - 1].trim()}\n`
      ];
    }

    function error (line: number, message: string[]) {

      parse.error = parseError({
        lineNumber: line,
        sample: excerpt(line),
        message
      });

    }

    if (record.types === 'liquid_start') {

      parse.pairs.set(parse.count + 1, {
        line: parse.lineNumber,
        token: record.token,
        stack: lx.getTagName(record.token),
        expect: `end${lx.getTagName(record.token)}`,
        syntax: 'Liquid'
      });

    } else if (record.types === 'start') {

      parse.pairs.set(parse.count + 1, {
        line: parse.lineNumber,
        token: record.token,
        stack: lx.getTagName(record.token),
        expect: `</${record.token.slice(1)}`,
        syntax: 'HTML'
      });

    } else if (record.types === 'end') {

      if (parse.pairs.has(parse.stack.index)) {

        const ref = parse.pairs.get(parse.stack.index);

        if (ref.expect === record.token) {

          parse.pairs.delete(parse.stack.index);

        } else if (ref.syntax === 'HTML') {

          error(ref.line, [
            `Incomplete HTML syntactic structure for: ${ref.token}`,
            'The start/open type tag is missing an end/close type.\n'
          ]);

        } else if (ref.syntax === 'Liquid') {

          // Allow for conditional based wrapping of Liquid tokens
          // For example
          //
          // {% if x %}
          // <tag>
          // {% endif %}
          //
          if (!grammar.liquid.control.has(data.stack[parse.stack.index])) {
            error(ref.line, [
              `Incomplete Liquid syntactic structure for: ${ref.token}`,
              'The start/open type tag is missing an end/close type.\n'
            ]);
          }
        } else {

          error(parse.lineNumber, [
            `Invalid syntactic placement of: ${record.token}\n`
          ]);

        }
      }

    } else if (record.types === 'liquid_end') {

      if (parse.pairs.has(parse.stack.index)) {

        const ref = parse.pairs.get(parse.stack.index);

        if (ref.expect === lx.getTagName(record.token)) {

          parse.pairs.delete(parse.stack.index);

        } else if (ref.syntax === 'Liquid') {

          error(ref.line, [
            `Incomplete Liquid syntactic structure for: ${ref.token}`,
            'The start/open type tag is missing an end/close type.\n'
          ]);

        } else if (ref.syntax === 'HTML') {

          // Allow for conditional based wrapping of Liquid tokens
          // For example
          //
          // {% if x %}
          // <tag>
          // {% endif %}
          //
          if (!grammar.liquid.control.has(data.stack[parse.stack.index])) {
            error(ref.line, [
            `Incomplete HTML syntactic structure for: ${ref.token}`,
            'The start/open type tag is missing an end/close type.\n'
            ]);
          }

        } else {

          parse.error = parseError({
            lineNumber: parse.lineNumber,
            sample: excerpt(parse.lineNumber),
            message: `Invalid syntactic placement of: ${record.token}\n`
          });

        }

      }
    }
  }

  /**
   * Push Record
   *
   * Pushes a record into the parse table populating the data structure.
   * All tokenized tags and content will pass through this function.
   */
  function push <T extends Partial<Record> > (record: Record, structure: Types | T | T[] = NIL, param?: T) {

    if (structure === NIL && param === undefined) {

      // parse.error = error.syntactic(record);
      parse.push(data, record, NIL);

    } else if (typeof structure === 'object' && !(structure as T[]).length) {

      u.assign(record, structure);

      // p.error = error.syntactic(record);
      parse.push(data, record, NIL);

    } else if (u.isArray(structure)) {

      for (const entry of structure as T[]) {

        u.assign(record, entry);

        //  p.error = error.syntactic(record);
        parse.push(data, record, NIL);

        //  if (parse.error) return;

      }

    } else if (param) {

      u.assign(record, param);

      //  parse.error = error.syntactic(record);
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
  function inner (input: string) {

    if (parse.language !== 'html' && parse.language !== 'liquid' && jsx === false) return input;
    if (/(?:{[=#/]|%[>\]])|\}%[>\]]/.test(input)) return input;
    if (!lq.isType(input, 3)) return input;

    const end = input.length - 3;

    if (rules.liquid.delimiterTrims === 'force') {

      if (u.is(input[1], cc.PER)) {

        if (u.not(input[2], cc.DSH)) input = input.replace(/^{%/, '{%-');
        if (u.not(input[end], cc.DSH)) input = input.replace(/%}$/, '-%}');

      } else {

        if (u.not(input[2], cc.DSH)) input = input.replace(/^{{/, '{{-');
        if (u.not(input[end], cc.DSH)) input = input.replace(/}}$/, '-}}');

      }

    } else if (rules.liquid.delimiterTrims === 'strip') {

      input = input
        .replace(/^{%-/, '{%')
        .replace(/-%}$/, '%}')
        .replace(/^{{-/, '{{')
        .replace(/-}}$/, '}}');

    } else if (rules.liquid.delimiterTrims === 'tags' && u.is(input[1], cc.PER)) {

      if (u.not(input[2], cc.DSH)) input = input.replace(/^{%/, '{%-');
      if (u.not(input[end], cc.DSH)) input = input.replace(/%}$/, '-%}');

    } else if (rules.liquid.delimiterTrims === 'outputs' && u.is(input[1], cc.LCB)) {

      if (u.not(input[2], cc.DSH)) input = input.replace(/^{{/, '{{-');
      if (u.not(input[end], cc.DSH)) input = input.replace(/}}$/, '-}}');
    }

    // ensure normalize spacing is enabld
    if (rules.liquid.normalizeSpacing === false) return input;

    // skip line comments or liquid tag
    if (rx.LiquidComment.test(input) || rx.LiquidTag.test(input)) return input;

    /**
     * The starting quotation code character
     */
    let t: cc.DQO | cc.SQO;

    /**
     * Quotation Reference
     *
     * Tracks string quotes allowing them to be skipped.
     *
     * - `0` token is not a string
     * - `1` We have encountered a string, eg: {{ '^
     * - `2` We have closed the last known string, eg: {{ 'foo'^
     */
    let q: 0 | 1 | 2 = 0;

    return input.split(/(["']{1})/).map((char, idx, arr) => {

      const quotation = u.is(char[0], cc.DQO) || u.is(char[0], cc.SQO);

      if (q > 0 || (quotation && q === 0 && u.not(arr[idx - 1], cc.BWS)) || quotation) {

        if (q === 0) t = char.charCodeAt(0);

        // Move forward for nested quote type, eg: DQO or SQO
        if (q === 1 && u.not(arr[idx - 1], cc.BWS)) {
          if (t === char.charCodeAt(0)) q = 2;
          return char;
        }

        if (q !== 2) {
          q = q === 0 ? 1 : q === 1 ? u.is(arr[idx - 1], cc.BWS) ? 1 : 2 : 0;
          return char;
        }

        q = 0;

      }

      return char
        .replace(rx.SpaceOnly, WSP)
        .replace(/^({[{%]-?)/, '$1 ')
        .replace(/([!=]=|[<>]=?)/g, ' $1 ')
        .replace(/ +(?=[|[\],:.])|(?<=[[.]) +/g, NIL)
        .replace(/(\||(?<=[^=!<>])(?:(?<=assign[^=]+)=(?=[^=!<>])|=$))/g, ' $1 ')
        .replace(/([:,]$|[:,](?=\S))/g, '$1 ')
        .replace(/(-?[%}]})$/, ' $1')
        .replace(rx.SpaceOnly, WSP);

    }).join(NIL);

  };

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
   * Peer Detection
   *
   * This function is used together with `fix()` and `correct()`.
   * The correct/fix feature needs refactoring, so this like the
   * the functions which leverage this will likely be overhauled.
   */
  function peers (n: string, i: string) {

    if (!grammar.html.tags.has(n)) return false;
    if (n === i) return true;
    if (n === 'dd' && i === 'dt') return true;
    if (n === 'dt' && i === 'dd') return true;
    if (n === 'td' && i === 'th') return true;
    if (n === 'th' && i === 'td') return true;
    if (n === 'colgroup' && (i === 'tbody' || i === 'tfoot' || i === 'thead' || i === 'tr')) return true;
    if (n === 'tbody' && (i === 'colgroup' || i === 'tfoot' || i === 'thead')) return true;
    if (n === 'tfoot' && (i === 'colgroup' || i === 'tbody' || i === 'thead')) return true;
    if (n === 'thead' && (i === 'colgroup' || i === 'tbody' || i === 'tfoot')) return true;
    if (n === 'tr' && i === 'colgroup') return true;

    return false;

  }

  /**
   * Fix Tags
   *
   * Utility function fixer for HTML missing end tags.
   * This is a little buggy and I'll likely remove or
   * refactor this in later versions, for now it suffices.
   */
  function fix (token: string, end: boolean) {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    /**
     * The tag name
     */
    const tname = lx.getTagName(token);

    /**
     * Parse record - This is generated as a drop-in as
     * this function is a fix utility that borders "linting"
     */
    const record = {
      begin: parse.stack.index,
      ender: -1,
      lexer: 'markup',
      lines: data.lines[parse.count] > 0 ? 1 : 0,
      stack: lx.getTagName(parse.stack.token),
      token: `</${parse.stack.token}>`,
      types: 'end'
    };

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    push(record);

    if (grammar.html.tags.has(parse.stack.token) && (
      (
        end === true &&
        parse.stack.length > 1
      ) || (
        end === false &&
        `/${parse.stack.token}` !== tname
      )
    )) {

      do {

        push(record, {
          begin: parse.stack.index,
          stack: lx.getTagName(parse.stack.token),
          token: `</${parse.stack.token}>`
        });

      } while (
        grammar.html.tags.has(parse.stack.token) && ((
          end === true &&
          parse.stack.length > 1
        ) || (
          end === false &&
          `/${parse.stack.token}` !== tname
        ))
      );
    }

  };

  /**
   * Self Closer
   *
   * Utility function correction for self closing void tags,
   * applies a forward slash ender delimiter sequence.
   */
  function selfclose (token: string) {

    if (rules.markup.correct === false || u.is(token[token.length - 2], cc.FWS)) return token;

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
  function attrname (x: string, withQuotes = true): [name: string, value: string] {

    const eq = x.indexOf('=');

    if (eq > 0) {

      const dq = x.indexOf(DQO);
      if ((eq < dq && dq > 0)) {

        return withQuotes
          ? [ x.slice(0, eq), x.slice(eq + 1) ]
          : [ x.slice(0, eq), x.slice(eq + 2, -1) ];
      }

      const sq = x.indexOf(SQO);

      if ((eq < sq && sq > 0)) {

        return withQuotes
          ? [ x.slice(0, eq), x.slice(eq + 1) ]
          : [ x.slice(0, eq), x.slice(eq + 2, -1) ];
      }

    }

    return [ x, NIL ];

  };

  /* -------------------------------------------- */
  /* PARSE HANDLERS                               */
  /* -------------------------------------------- */

  /**
   * Parse Error
   *
   * This function is responsible cancelling the traversal and
   * returning a parse error when the lexing encounters an error.
   * The `parse.error` is assigned a string value that informs about the issue.
   */
  function parseError (ref?: string | {
    lineNumber: number;
    lineSpace?: number;
    sample?: string[];
    message: string | string[]
  }) {

    console.log(ref);

    // if (typeof ref === 'object') {

    //   parse.diagnostic.line = ref.line;
    //   parse.diagnostic.character = ref.lineSpace || parse.lineOffset;

    //   return u.join(
    //     `Parse Error (line ${ref.line}):\n`,
    //     typeof ref.message === 'string' ? ref.message : u.join(...ref.message),
    //     ...(ref.sample || [])
    //   );

    // } else if (typeof ref === 'string') {

    //   parse.diagnostic.line = parse.lineNumber;
    //   parse.diagnostic.character = parse.lineOffset;

    //   return u.join(
    //     `Parse Error (line ${parse.lineNumber}):\n`,
    //     ref
    //   );

    // } else {

    //   parse.diagnostic.line = parse.lineNumber;
    //   parse.diagnostic.character = parse.lineOffset;

    //   return 'Parse Error:\n' + parse.error;

    // }
  }

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
   * {{          }}      template
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
     * Whether or not to pass to cheat functions.
     */
    const cheat: boolean = false;

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

    function insert (count: number) {

      record.lines = data.lines[parse.count] > 0 ? 1 : 0;
      record.token = `</${parse.stack.token}>`;
      record.types = 'end';

      push(record, NIL);

      if (count > 0) {
        do {
          record.begin = parse.stack.index;
          record.stack = lx.getTagName(parse.stack.token);
          record.token = `</${parse.stack.token}>`;

          push(record, NIL);
          count = count - 1;
        } while (count > 0);
      }

      record.begin = parse.stack.index;
      record.lines = parse.lineOffset;
      record.stack = lx.getTagName(parse.stack.token);
      record.token = token;
      record.types = 'end';

      data.lines[parse.count - 1] = 0;

    };

    function correct () {

      // determine if the current end tag is actually part of an HTML singleton
      if (ltype === 'end') {

        const lastToken = data.token[parse.count];

        if (
          data.types[parse.count - 1] === 'singleton' &&
          lastToken.charCodeAt(lastToken.length - 2) !== cc.FWS &&
          `/${lx.getTagName(lastToken)}` === tname
        ) {

          data.types[parse.count - 1] = 'start';
        }
      }

      if (parse.language === 'html' || parse.language === 'liquid') {

        // HTML gets tag names in lowercase, if you want to
        // preserveLine case sensitivity beautify as XML
        if (
          u.is(token[0], cc.LAN) &&
          u.not(token[1], cc.BNG) &&
          u.not(token[1], cc.QWS) && (
            parse.count < 0 ||
            data.types[parse.count].indexOf('liquid') < 0
          )
        ) {

          token = token.toLowerCase();
        }

        // console.log(parse.stack.token);

        if (
          grammar.html.tags.has(parse.stack.token) &&
          peers(tname.slice(1), parse.stack[parse.stack.length - 2][0])
        ) {

          // Looks for HTML tags missing an ending pair when encountering
          // an ending tag for a parent node
          insert(0);

        } else if (
          parse.stack.length > 3 &&
          grammar.html.tags.has(parse.stack.token) &&
          grammar.html.tags.has(parse.stack[parse.stack.length - 2][0]) &&
          grammar.html.tags.has(parse.stack[parse.stack.length - 3][0]) &&
          peers(tname, parse.stack[parse.stack.length - 4][0])
        ) {

          // Looks for consecutive missing end tags
          insert(3);

        } else if (
          parse.stack.length > 2 &&
          grammar.html.tags.has(parse.stack.token) &&
          grammar.html.tags.has(parse.stack[parse.stack.length - 2][0]) &&
          peers(tname, parse.stack[parse.stack.length - 3][0])
        ) {

          // Looks for consecutive missing end tags
          insert(2);

        } else if (
          parse.stack.length > 1 &&
          grammar.html.tags.has(parse.stack.token) &&
          peers(tname, parse.stack[parse.stack.length - 2][0])
        ) {

          // Looks for consecutive missing end tags
          insert(1);

        } else if (peers(tname, parse.stack.token)) {

          // Certain tags cannot contain other certain tags if such tags are peers
          insert(0);

        } else if (
          u.is(tname[0], cc.FWS) &&
          grammar.html.tags.has(parse.stack.token) &&
          parse.stack.token !== tname.slice(1)
        ) {

          // Looks for consecutive missing end tags if the current token is an end tag
          fix(token, false);

          record.begin = parse.stack.index;
          record.lines = parse.lineOffset;
          record.stack = lx.getTagName(parse.stack.token);
          record.token = token;
          record.types = 'end';

          data.lines[parse.count - 1] = 0;

        }

        // Inserts a trailing slash into singleton tags if they do not already have it
        if (jsx === false && grammar.html.voids.has(tname)) {

          if (rules.markup.correct === true && /\/>$/.test(token) === false) {
            token = token.slice(0, token.length - 1) + ' />';
          }

          return true;
        }

      }

      return false;

    }

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
     * Parse Template
     *
     * This will parse template identified tokens and tags (Liquid).
     * It aligns the the data `record` for identification.
     */
    function parseLiquid (): ReturnType<typeof cdata> {

      /* -------------------------------------------- */
      /* LIQUID TOKEN                                 */
      /* -------------------------------------------- */

      if (record.types.indexOf('liquid') === -1) return cdata();

      if (u.is(token[0], cc.LCB) && u.is(token[1], cc.PER)) {

        if (grammar.liquid.else.has(tname)) {

          record.types = 'liquid_else';

        } else if (grammar.liquid.tags.has(tname)) {

          record.types = 'liquid_start';

        } else if (tname.startsWith('end')) {

          const name = tname.slice(3);

          if (grammar.liquid.tags.has(name)) {

            record.types = 'liquid_end';

          } else {

            // Unknown tag handling for situations where a custom endtag
            // name is used, we will look for a matching start tag name
            //
            record.stack = name;
            record.types = 'liquid_end';

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
        record.token = record.token.replace(/'/g, DQO);
      } else if (rules.liquid.quoteConvert === 'single') {
        record.token = record.token.replace(/"/g, SQO);
      }

      return cdata();

    }

    /**
     * Parse SVG
     *
     * This will parse SVG tag structures and correctly apply singular
     * types depending upon the stack.
     */
    function parseSVG (): ReturnType<typeof parseLiquid> {

      if (grammar.svg.tags.has(tname)) {

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
        }

      }

      return parseLiquid();

    }

    /**
     * Singular Types
     *
     * Utility function which will re-assign the `ltype` when HTML `void`
     * type tags. This only detects HTML tags, Liquid (template) types are
     * handled by the `parseLiquid()` function.
     *
     */
    function parseSingular (): ReturnType<typeof parseSVG> {

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
     * a `data-prettify-ignore` attribute annotation. The function also
     * handles `@prettify-ignore-next` ignore comments placed above tag regions.
     *
     */
    function parseIgnore (): ReturnType<typeof parseSingular | typeof parseScript> {

      /**
       * The ender token name, used for Liquid tag ignores
       */
      let ender: string = NIL;

      // console.log(token);

      if (rx.CommIgnoreNext.test(data.token[parse.count])) {

        ignore = true;
        preserve = false;

        if (ltype.indexOf('liquid') > 0 && grammar.liquid.tags.has(tname)) {
          ender = `end${tname}`;
        } else if (grammar.html.voids.has(tname)) {
          ender = null;
        }

      } else if (grammar.html.voids.has(tname)) {

        ender = null;

      } else if (external.detect(tname, 'liquid') !== false && ignored.has(tname) === true) {

        ender = null;

      }

      if (ender !== null && preserve === false && ignore === true && (
        end === '>' ||
        end === '%}' ||
        end === '}}'
      )) {

        /**
         * Lexed characters traversed in the ignored region
         */
        const tags: string[] = [];

        if (cheat === true) {

          ltype = 'singleton';

        } else {

          preserve = true;

          if ((
            ltype !== 'json_preserve' &&
            ltype !== 'script_preserve' &&
            ltype !== 'style_preserve' &&
            ltype !== 'liquid_json_preserve' &&
            ltype !== 'liquid_script_preserve' &&
            ltype !== 'liquid_style_preserve'
          )) {

            ltype = 'ignore';
          }

          a = a + 1;

          if (a < c) {

            /* -------------------------------------------- */
            /* LOCAL SCOPES                                 */
            /* -------------------------------------------- */

            /**
             * The delimiter match
             */
            let delim = NIL;

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

              if (u.is(b[a], cc.NWL)) {
                parse.lineNumber = parse.lineNumber + 1;
                parse.lineIndex = a;
              }

              tags.push(b[a]);

              if (delim === NIL) {

                delim = u.is(b[a], cc.DQO) ? DQO : u.is(b[a], cc.SQO) ? SQO : NIL;

                if (u.not(tags[0], cc.LCB) && u.is(b[a], cc.LCB) && (
                  u.is(b[a + 1], cc.LCB) ||
                  u.is(b[a + 1], cc.PER)
                )) {

                  delim = b[a + 1] + '}';

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

                  if (b
                    .slice(a + (u.is(b[a + 2], cc.DSH) ? 3 : 2), b.indexOf('%', a + 2))
                    .join(NIL)
                    .trim()
                    .startsWith(ender)) break;

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
        }

        // console.log(token);

        // token = token + tags.join(NIL);
        // token = token.replace('>', ` ${attrs.map(([ value ]) => value).join(WSP)}>`);
        //  attrs = [];

        if (ltype === 'ignore') {

          token = token + tags.join(NIL);
          token = token.replace('>', ` ${attrs.map(([ value ]) => value).join(WSP)}>`);
          attrs = [];

          data.types[parse.count] = 'ignore';
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

            if (!/\S/.test(inner)) {

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

      return parseSingular();

    }

    /**
     * Parse exts
     *
     * Determines whether or not the token contains an external region
     * like that of `<script>`, `<style>` and Liquid equivalents `{% schema %}` etc.
     * Some additional context is required before passing the contents of these tags
     * to different lexers. It's here where we establish that context.
     */
    function parseExternal (): ReturnType<typeof parseSingular | typeof parseIgnore> {

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

      if (embed === true) {
        item = a + 1;
        if (item < c) {
          do {
            if (u.ws(b[item]) === false) {
              if (b[item] === '<') {
                if (b.slice(item + 1, item + 4).join(NIL) === '!--') {
                  item = item + 4;
                  if (item < c) {
                    do {
                      if (u.ws(b[item]) === false) {
                        embed = false;
                        break;
                      }
                      if (b[item] === '\n' || b[item] === '\r') {
                        break;
                      }
                      item = item + 1;
                    } while (item < c);
                  }
                } else {
                  embed = false;
                }
              }
              break;
            }
            item = item + 1;
          } while (item < c);
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

      push(record);

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
      let sq = 0;

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
      function quotes () {

        if (parse.attributes.has(begin)) {
          if (idx + 1 === len && u.notLast(record.token, cc.RAN)) {
            record.token = record.token + '>';
          }
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

                if (u.is(ch[ee - 1], cc.LCB) && (u.is(ch[ee], cc.PER) || u.is(ch[ee], cc.LCB))) {
                  liq = true;
                } else if (u.is(ch[ee], cc.RCB) && (u.is(ch[ee - 1], cc.PER) || u.is(ch[ee - 1], cc.RCB))) {
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

            push(record, { token: ch.join(NIL) });

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

        // if making use of the 'options.attributeSortList` option

        const tstore = [];

        dq = 0;
        eq = 0;
        len = attrs.length;

        // loop through the options.attributeSortList looking for attribute name matches
        do {

          // loop through the attrs
          eq = 0;

          do {

            name = attrs[eq][0].split('=')[0];

            if (rules.markup.attributeSortList[dq] === name) {
              tstore.push(attrs[eq]);
              attrs.splice(eq, 1);
              len = len - 1;
              break;
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

        quotes();

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

          quotes();

          return true;

        } else if (lq.isElse(attrs[idx][0])) {

          record.types = 'liquid_attribute_else';
          record.token = attrs[idx][0];

        } else {

          record.types = 'attribute';
          record.token = attrs[idx][0];

        }

        quotes();

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
      if (rules.markup.attributeSort) sorting();

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

            quotes();

            idx = idx + 1;
            continue;
          }

          if (attrs[idx][1] <= 1 && lq.isChain(attrs[idx][0])) {
            if (!lq.isValue(attrs[idx][0])) {

              record.types = 'liquid_attribute_chain';
              record.token = attrs[idx][0];

              quotes();

              idx = idx + 1;
              continue;
            }
          }

          eq = attrs[idx][0].indexOf('=');
          dq = attrs[idx][0].indexOf(DQO);
          sq = attrs[idx][0].indexOf(SQO);

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

              record.token = rules.markup.attributeCasing === 'preserve'
                ? attrs[idx][0]
                : attrs[idx][0].toLowerCase();

            }

            quotes();

          } else if (lq.isType(attrs[idx][0], 6)) {

            liqattr();

          } else {

            // Separates out the attribute name from its value
            // We need context of the attribute expression for
            // dealing with and handling Liquid attributes specifically
            //
            name = attrs[idx][0].slice(0, eq);
            value = attrs[idx][0].slice(eq + 1);

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
            }

            if (rules.markup.correct === true &&
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

                quotes();

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

      // Lets look for liquid tokens keyword sbefore proceeding,
      // We are skipping ahead from the normal parse here.
      //
      if (tag === 'comment' || ignored.has(tag)) {

        const idx1 = source.indexOf('{%', from);

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
              start = b.slice(a, from + 1).join(NIL);
              end = b.slice(idx1, idx2 + 1).join(NIL);
            } else {
              ltype = 'comment';
              start = b.slice(a, from + 1).join(NIL);
              end = b.slice(idx1, idx2 + 1).join(NIL);
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

      const comm = lineComment === true ? commentLine({
        chars: b,
        end: c,
        lexer: 'markup',
        begin: start,
        start: a,
        ender: end
      }) : commentBlock({
        chars: b,
        end: c,
        lexer: 'markup',
        begin: start,
        start: a,
        ender: end
      });

      token = comm[0];
      a = comm[1];

      if (token.replace(start, NIL).trimStart().startsWith('esthetic-ignore-start')) {

        push(record, { token, types: 'ignore' });

      } else {

        if (u.is(token[0], cc.LCB) && u.is(token[1], cc.PER) && lineComment === false) {

          const begin = token.indexOf('%}', 2) + 2;
          const last = token.lastIndexOf('{%');

          token = inner(token.slice(0, begin)) + token.slice(begin, last) + inner(token.slice(last));
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
          return b.slice(from, i + 1).join(NIL);
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
    function parseDelimiter (): ReturnType< typeof parseComments | typeof parseExternal | typeof traverse> {

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

            let tag = b.slice(a + 2, from - 1).join(NIL);

            // Lets make sure we do not interfere with dash delimiters
            if (u.is(tag, cc.DSH)) {
              start = '{%-';
              tag = tag.slice(1).trimStart();
            } else {
              start = '{%';
              tag = tag.trimStart();
            }

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

      if (rules.markup.preserveAttributes) preserve = true;
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
    function traverse (): ReturnType<typeof parseExternal> {

      /* -------------------------------------------- */
      /* CONSTANTS                                    */
      /* -------------------------------------------- */

      /**
       * Lexing store - Character in the lex will reside here
       */
      const lexed: string[] = [];

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
      let jsxquote: string = NIL;

      /**
       * JSX/TSX parenthesis counts, ie: `{` and `}`
       */
      let jsxparen: number = 0;

      /**
       * Whether or not we are within a Liquid template token
       */
      let isliq: boolean = false;

      /**
       * Whether or not we should invoke a whitespace test
       */
      let stest: boolean = false;

      /**
       * Whether or not we are at a starting attribute value quote.
       * This reference will always us to consume nested quotes
       * like those we'd encounter in Liquid tokens.
       */
      let qattr: boolean = false;

      /**
       * Whether or not we should invoke a quotation test
       */
      let qtest: boolean = false;

      /**
       * Attribute store
       */
      let store: string[] = [];

      /* -------------------------------------------- */
      /* FUNCTIONS                                    */
      /* -------------------------------------------- */

      /**
       * Attribute Tokenizer
       *
       * This function is responsible reasoning with the lexed contents of
       * the recently traversed attribute. This updates the `attrs` reference
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

          if (jsx === false || (jsx && !u.is(attr[attr.length - 1], cc.RCB))) attr = attr.replace(/\s+/g, WSP);

          each = attrname(attr);

          if (each[0] === 'data-esthetic-ignore') ignore = true;

          if (jsx && u.is(store[0], cc.LCB) && u.is(store[store.length - 1], cc.RCB)) jsxparen = 0;
        }

        // Prevent sorting of attributes when tags contains Liquid tokens
        if (u.is(attr[0], cc.LCB) && u.is(attr[1], cc.PER)) nosort = true;

        if (quotes === false) {
          if (lq.isStart(attr)) within = within + 1;
          if (lq.isEnd(attr)) within = within - 1;
        }

        attr = attr.replace(/^\u0020/, NIL).replace(/\u0020$/, NIL);
        store = attr.replace(/\r\n/g, NWL).split(NWL);

        if (!store.length) store[0] = store[0].replace(/\s+$/, NIL);

        attr = rules.crlf === true ? inner(store.join('\r\n')) : inner(store.join(NWL));

        if (within > 0 || lq.isType(attr, 1)) {
          if (lq.isType(attr, 5) === false) {
            lines = 0;
            if (u.is(b[a + 1], cc.NWL) || u.is(b[a], cc.NWL)) lines = 2;
            if (u.is(b[a], cc.WSP) && u.not(b[a + 1], cc.WSP)) lines = 1;
          } else {

            if (lines <= 2 && u.is(b[a + 1], cc.NWL)) {
              lines = 2;
            } else if (u.is(b[a + 1], cc.WSP)) {
              lines = 1;
            } else if (lines >= 1) {
              lines = 0;
            }
          }
        } else {
          if (u.is(b[a + 1], cc.NWL)) {
            lines = 2;
          } else if (u.is(b[a + 1], cc.WSP)) {
            lines = 1;
          }
        }

        if (attrs.length > 0) {

          const ln = attrs.length - 1;

          if (u.is(attr, cc.EQS) || u.is(attr, cc.DSH)) {

            // If an attribute starts with a `=` then adjoin it to the attrs.length -1 attribute
            attrs[ln][0] = attrs[ln][0] + attr;
            attrs[ln][1] = lines;

            // Prevent adding the entry to store as we've connected it to the last entry
            attr = NIL;

          } else if (lines === 0 && attrs[ln][1] === 0) {

            attrs[ln][0] = attrs[ln][0] + attr;
            attrs[ln][1] = lines;
            attr = NIL;

          } else if (lines > 0 && attrs[ln][1] === 0 && lq.isEnd(attr) === true) {

            attrs[ln][0] = attrs[ln][0] + attr;
            attrs[ln][1] = lines;
            attr = NIL;

          } else if (lines > 0 && attrs[ln][1] === 0 && lq.isType(attrs[ln][0], 4)) {

            attrs[ln][0] = attrs[ln][0] + attr;
            attr = NIL;

          } else if (attrs[ln][1] > 0 && lines === 0 && lq.isControl(attr) === false) {

            lines = attrs[ln][1];

          } else if (attrs[ln][1] > 0 && lines > 0 && lq.isEnd(attr) && !lq.isType(attr, 6)) {

            // Edge Case
            const i = attr.indexOf('{%');

            attrs.push([ attr.slice(0, i), lines ]);
            attr = attr.slice(i);

          }
        }

        // Populates the "attrs[]" array which will be used
        // when adding the records to the data structures
        //
        if (attr !== NIL && attr !== WSP) attrs.push([ attr, lines ]);

        if (attrs.length > 0) {

          const [ value ] = attrs[attrs.length - 1];

          if (value.indexOf('=\u201c') > 0) { // “

            parse.error = parseError('Invalid quote character (\u201c, &#x201c) used.');

          } else if (value.indexOf('=\u201d') > 0) { // ”

            parse.error = parseError('Invalid quote character (\u201d, &#x201d) used.');

          }
        }

        store = [];
        lines = u.is(b[a], cc.NWL) ? 2 : 1;

      };

      /* -------------------------------------------- */
      /* TRAVERSAL                                    */
      /* -------------------------------------------- */

      if (parse.error) return;

      do {

        // Newline Increments
        //
        if (u.is(b[a], cc.NWL)) {
          lines = lines + 1;
          parse.lineNumber = parse.lineNumber + 1;
          parse.lineIndex = a;
        }

        // Frontmatter Ignores
        //
        if (start === '---' && end === '---' && ltype === 'ignore') {

          lexed.push(b[a]);

          if (a > 3 && u.is(b[a], cc.DSH) && u.is(b[a - 1], cc.DSH) && u.is(b[a - 2], cc.DSH)) break;

          a = a + 1;
          continue;
        }

        if (preserve === true || ((u.ws(b[a]) === false && u.not(quote, cc.RCB)) || u.is(quote, cc.RCB))) {

          lexed.push(b[a]);

          // Liquid Token Types, eg: {% OR {{
          //
          if (isliq === false && u.is(b[a - 1], cc.LCB) && (
            u.is(b[a], cc.LCB) ||
            u.is(b[a], cc.PER)
          )) {

            isliq = true;

          } else if (isliq === true && u.is(b[a], cc.RCB) && (
            u.is(b[a - 1], cc.RCB) ||
            u.is(b[a - 1], cc.PER)
          )) {

            isliq = false;

          }

          // HTML Eng Tags, eg: </tag>
          //
          if (ltype === 'end' && lexed.length > 2 && u.is(lexed[0], cc.LAN) && u.is(lexed[1], cc.FWS) && (
            u.is(lexed[lexed.length - 1], cc.FWS) ||
            u.is(lexed[lexed.length - 1], cc.LAN)
          )) {

            if (rules.markup.correct) {

              lexed.pop();
              lexed.push('>');

            } else {

              parse.error = parseError({
                lineNumber: parse.lineNumber,
                message: [
                  `Missing closing delimiter character: ${lexed.join(NIL)}`,
                  '\nTIP',
                  'esthetic can autofix these issues when the correct rule is enabled'
                ]
              });

              return;

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

            return push(record, {
              token: '</>',
              types: 'end'
            });

          }
        }

        // CDATA Parse Error
        //
        if (
          ltype === 'cdata' &&
          u.is(b[a], cc.RAN) &&
          u.is(b[a - 1], cc.RSB) &&
          u.not(b[a - 2], cc.RSB)
        ) {

          parse.error = parseError(`CDATA tag (${lexed.join(NIL)}) not properly terminated with "]]>`);
          break;

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
                    if (u.is(b[a], cc.NWL)) lines = lines + 1;
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
                jsxparen = jsxparen + 1;
              } else if (u.is(b[a], cc.RCB)) {
                jsxparen = jsxparen - 1;
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
              parse.error = parseError(`Invalid structure detected ${b.slice(a, a + 8).join(NIL)}`);
              break;
            }

            // HTML/Liquid Attribute Sequences
            //
            if (u.ws(b[a]) === false && stest === true && b[a] !== lchar) {

              // Attribute start
              //
              stest = false;
              icount = 0;
              quote = jsxquote;

              lexed.pop();

              if (a < c) {

                do {

                  // Newline Increments
                  //
                  if (u.is(b[a], cc.NWL)) parse.lineNumber = parse.lineNumber + 1;

                  if (rules.markup.preserveAttributes === true) {
                    lexed.push(b[a]);
                  } else {
                    store.push(b[a]);
                  }

                  if (u.not(quote, cc.DQO) || u.not(quote, cc.SQO)) {
                    if (u.is(b[a - 1], cc.LCB) && (u.is(b[a], cc.PER) || u.is(b[a], cc.LCB))) {
                      isliq = true;
                    } else if ((u.is(b[a - 1], cc.RCB) || u.is(b[a - 1], cc.PER)) && u.is(b[a], cc.RCB)) {
                      isliq = false;
                    }
                  }

                  if (
                    jsx === false &&
                    qattr === false &&
                    isliq === true &&
                    rules.markup.preserveAttributes === false
                  ) {

                    while (a < c) {

                      a = a + 1;

                      // Newline Increments
                      //
                      if (u.is(b[a], cc.NWL)) {

                        parse.lineNumber = parse.lineNumber + 1;

                        if (u.is(store[0], cc.EQS)) {

                          isliq = false;
                          quote = NIL;

                          tokenize(false);
                          break;
                        }
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
                      if (u.is(store[0], cc.EQS) === false && u.is(b[a], cc.RCB) && (
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
                      if (u.is(store[store.length - 1], cc.FWS) || (
                        u.is(store[store.length - 1], cc.QWS) &&
                        ltype === 'xml'
                      )) {

                        store.pop();
                        if (preserve === true) lexed.pop();
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

                      } else if (jsxparen === 0 || (jsxparen === 1 && u.is(store[0], cc.LCB))) {

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
                      quote === '\u002a/' &&
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
                    if (u.is(quote, cc.RCB)) {
                      if (u.is(b[a], cc.RCB) && b[a] !== quote) {

                        bcount = bcount + 1;

                      } else if (b[a] === quote) {

                        bcount = bcount - 1;

                        if (bcount === 0) {

                          jsxparen = 0;
                          quote = NIL;
                          token = store.join(NIL);

                          if (rules.markup.preserveAttributes === false) {
                            if (jsx) {
                              if (!/^\s*$/.test(token)) attrs.push([ token, lines ]);
                            } else {
                              token = token.replace(/\s+/g, WSP);
                              if (token !== WSP) attrs.push([ token, lines ]);
                            }
                          }

                          store = [];
                          lines = 1;
                          break;
                        }
                      }

                    } else {

                      jsxquote = NIL;
                      jscomm = true;
                      token = store.join(NIL);

                      if (token !== WSP) attrs.push([ token, lines ]);

                      store = [];
                      lines = u.is(quote, cc.NWL) ? 2 : 1;
                      quote = NIL;

                      break;
                    }

                  } else if (
                    u.is(b[a], cc.LCB) &&
                    u.is(b[a + 1], cc.PER) &&
                    u.is(b[icount - 1], cc.EQS) && (
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
            } else if (u.is(end, cc.NWL) === false && (u.is(b[a], cc.DQO) || u.is(b[a], cc.SQO))) {

              // Opening quote
              quote = b[a];

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

            } else if (u.is(b[a], cc.LCB) && u.not(lexed[0], cc.LCB) && u.not(end, cc.NWL) && (
              u.is(b[a + 1], cc.LCB) ||
              u.is(b[a + 1], cc.PER)
            )) {

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

            } else if (basic && u.not(end, cc.NWL) && u.ws(b[a]) && u.not(b[a - 1], cc.LAN)) {

              // Identify a space in a regular start or singleton tag
              //
              stest = true;

            } else if (basic && jsx && u.is(b[a], cc.FWS) && (u.is(b[a + 1], cc.ARS) || u.is(b[a + 1], cc.FWS))) {

              // JSX Comment immediately following tag each
              //
              stest = true;
              lexed[lexed.length - 1] = WSP;
              jsxquote = u.is(b[a + 1], cc.ARS) ? '\u002a/' : NWL;
              store.push(b[a]);

            } else if (isliq === false && (b[a] === lchar || (
              u.is(end, cc.NWL) &&
              u.is(b[a + 1], cc.LAN)
            )) && (
              lexed.length > end.length + 1 ||
              u.is(lexed[0], cc.RSB)
            ) && (
              jsx === false ||
              jsxparen === 0
            )) {

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
                if (u.is(lexed[f], cc.RAN) && u.is(b[a], cc.RAN) && attrs.length > 0) {
                  if (attrs[attrs.length - 1][1] === 0 && u.is(b[a - 1], cc.RCB) && u.ws(b[a + 1])) {
                    attrs[attrs.length - 1][1] = u.is(b[a + 1], cc.WSP) ? 1 : 2;
                  }
                }

                break;

              }
            }
          } else if ((
            u.is(b[a], quote.charCodeAt(quote.length - 1)) && ((
              jsx === true &&
              u.is(end, cc.RCB) && (
                u.not(b[a - 1], cc.BWS) ||
                esc(a) === false
              )
            ) || (
              jsx === false ||
              u.not(end, cc.RCB)
            ))
          )) {

            // Find the closing quote or parseExternal template expression
            //
            f = 0;
            e = quote.length - 1;

            if (e > -1) {
              do {
                if (b[a - f] !== quote.charAt(e)) break;
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
      token = lexed.join(NIL);
      tname = lx.getTagName(token);

      if (ignore === false) token = inner(token);

      if (tname === 'xml') {
        html = 'xml';
      } else if (html === NIL && tname === 'html') {
        html = 'html';
      }

      record.token = token;
      record.types = ltype;

      if (preserve === false && jsx === false) {
        token = token.replace(/\s+/g, WSP);
      }

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
     * The current lexed character references
     */
    let lexed: string[] = [];

    /**
     * The last known token
     */
    let ltoke: string = NIL;

    /**
     * The number of line spaces incurred, ie: `parse.lineOffset`
     */
    let liner: number = parse.lineOffset;

    /**
     * The tag name or known name reference
     */
    let name: string = NIL;

    if (embed === true) {
      if (jsxbrace === true) {
        name = 'script';
      } else if (parse.stack.index > -1) {
        name = lx.getTagName(data.token[parse.stack.index]);
      } else {
        name = lx.getTagName(data.token[data.begin[parse.count]]);
      }
    }

    /**
     * Initial data record state for the parsed content
     */
    const record: Record = {
      begin: parse.stack.index,
      ender: -1,
      lexer: 'markup',
      lines: liner,
      stack: lx.getTagName(parse.stack.token) || 'global',
      token: NIL,
      types: 'content'
    };

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
       * Liquid Ended
       */
      let lq: number = -1;

      /**
       * External output string capture
       */
      let output: string = NIL;

      /**
       * Quotation character quotes
       */
      let quotes: number = 0;

      do {

        if (u.is(b[a], cc.NWL)) parse.lineNumber = parse.lineNumber + 1;

        // Embed code requires additional parsing to look for the appropriate end
        // tag, but that end tag cannot be quoted or commented
        //
        if (embed === true) {
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
                    token: rules.markup.correct === true ? ';' : 'x;'
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

            if (data.types[parse.count] === 'liquid_start') {

              lq = b.indexOf('%', a);

              if (u.is(b[lq - 1], cc.LCB)) {

                end = u.is(b[lq + 1], cc.DSH)
                  ? b.slice(lq + 2, b.indexOf('%', lq + 3)).join(NIL).trimStart()
                  : b.slice(lq + 1, b.indexOf('%', lq + 2)).join(NIL).trimStart();

                if (end.startsWith(`end${name}`)) {

                  lexed = b.slice(a, lq - 2);

                  if (lexed.length < 1) break;

                  output = lexed
                    .join(NIL)
                    .replace(rx.SpaceLead, NIL)
                    .replace(rx.SpaceEnd, NIL);

                  parse.external(language, output);

                  a = a + lexed.length;

                  end = b
                    .slice(a, b.indexOf('}', a) + 1)
                    .join(NIL)
                    .replace(rx.SpaceLead, NIL)
                    .replace(rx.SpaceEnd, NIL);

                  a = a + end.length;

                  push(record, {
                    types: 'liquid_end',
                    token: inner(end)
                  });

                  break;

                }

              }

            } else {

              if (name === 'script') {

                end = b
                  .slice(a + 1, a + 9)
                  .join(NIL)
                  .toLowerCase();

                if (end === '</script') {

                  output = lexed
                    .join(NIL)
                    .replace(rx.SpaceLead, NIL)
                    .replace(rx.SpaceEnd, NIL);

                  if (lexed.length < 1) break;

                  if (/^<!--+/.test(output) && /--+>$/.test(output)) {

                    push(record, { token: '<!--', types: 'comment' });
                    output = output.replace(/^<!--+/, NIL).replace(/--+>$/, NIL);
                    parse.external('javascript', output);
                    push(record, { token: '-->' });

                  } else {

                    parse.external(language, output);

                    end = b
                      .slice(a, b.indexOf('>', a + 9) + 1)
                      .join(NIL)
                      .replace(rx.SpaceLead, NIL)
                      .replace(rx.SpaceEnd, NIL);

                    a = a + end.length;

                    push(record, { types: 'end', token: end });

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

                    output = lexed
                      .join(NIL)
                      .replace(rx.SpaceLead, NIL)
                      .replace(rx.SpaceEnd, NIL);

                    if (lexed.length < 1) break;

                    if ((/^<!--+/).test(output) && (/--+>$/).test(output)) {

                      push(record, { token: '<!--', types: 'comment' });
                      output = output.replace(/^<!--+/, NIL).replace(/--+>$/, NIL);
                      parse.external('css', output);
                      push(record, { token: '-->' });

                    } else {

                      parse.external(language, output);

                      end = b
                        .slice(a, b.indexOf('>', a + 8) + 1)
                        .join(NIL)
                        .replace(rx.SpaceLead, NIL)
                        .replace(rx.SpaceEnd, NIL);

                      a = a + end.length;

                      push(record, { types: 'end', token: end });

                      break;

                    }

                  }
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

            end = b.slice(a + 1, a + 11).join(NIL).toLowerCase();
            end = end.slice(0, end.length - 2);

            if (name === 'script' && end === '</script') quote = NIL;

            end = end.slice(0, end.length - 1);

            if (name === 'style' && end === '</style') quote = NIL;

          }
        }

        // Typically this logic is for artifacts nested within an SGML tag
        if (sgml() === true && u.is(b[a], cc.RSB)) {

          a = a - 1;

          liner = 0;
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

          liner = 0;
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
              .replace(/\s+/g, WSP);

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

              if (/^\n+/.test(ltoke)) {
                record.lines = 1;
              } else {
                record.lines = 2;
                ltoke = ltoke.replace(rx.SpaceLead, NIL);
              }
            }
          }

          liner = 0;
          push(record, { token: ltoke });

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
      ltoke = lexed.join(NIL).replace(rx.SpaceEnd, NIL);
      liner = 0;

      // this condition prevents adding content that was just added in the loop above
      if (record.token !== ltoke) {
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

  }

  if (rules.language === 'html' || rules.language === 'liquid') html = 'html';

  do {

    if (parse.error) return data;

    if (u.ws(b[a])) {

      parseSpace();

    } else if (u.is(b[a], cc.LAN)) {

      parseToken(NIL);

    } else if (u.is(b[a], cc.LCB) && (jsx || u.is(b[a + 1], cc.LCB) || u.is(b[a + 1], cc.PER))) {

      parseToken(NIL);

    } else if (u.is(b[a], cc.DSH) && u.is(b[a + 1], cc.DSH) && u.is(b[a + 2], cc.DSH)) {

      parseToken('---');

    } else {

      parseContent();

    }

    a = a + 1;

  } while (a < c);

  // if (syntactic.count > 0) {

  // for (const e in syntactic) {
  //   console.log(syntactic);

  //   parse.error = parseError({
  //     message: `Parse Error (line ${syntactic[e].line})`,
  //     lineNumber: syntactic[e].line
  //   });

  // }

  // }

  // console.log(data);

  return data;

};
