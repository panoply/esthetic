/* eslint-disable no-mixed-operators */

import { DQO, NIL, NWL, SQO } from 'chars';
import { CommentBlock, commentLine } from 'comments';
import { cc } from 'lexical/codes';
import * as rx from 'lexical/regex';
import { parse } from 'parse/parser';
import { sortCorrect, sortObject } from 'parse/sorting';
import { BlockComments, Record, Structure, Types } from 'types';
import * as u from 'utils/helpers';

export function json () {

  /** Destructured `parse` methods and store reference */
  const { data, references, rules, source } = parse;

  /**
   * The document source as an array list, ie: source.split()
   */
  const c: string[] = u.isArray(source) ? source : source.split(NIL);

  /**
   * The length of the document source, ie: number of characters (`source.length`)
   */
  const b = c.length;

  /**
   * Last words
   */
  const lword: Structure[] = [];

  /**
   * Automatic brace store reference for applying `{` and `}`
   */
  const brace: string[] = [];

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Advancement iteration offset
   */
  let a: number = 0;

  /**
   * Last known token reference
   */
  let ltoke = NIL;

  /**
   * Last known type reference
   */
  let ltype: Types = NIL;

  /**
   * Parse Word, ie: `for`, `if` `while` etc etc
   */
  const pword: Partial<Structure> = [];

  /**
   * Parse count or similar
   */
  let lengthb = 0;

  /**
   * Hold reference of word test
   */
  let wtest = -1;

  /**
   * Function name reference store
   */
  let fnrefs: string[] = [];

  /**
   * Comment stack
   */
  let comment: BlockComments;

  /**
   * Push Record
   *
   * Determine the definition of containment by stack
   */
  function push (structure: string = NIL) {

    const record: Record = {
      begin: parse.stack.index,
      ender: -1,
      lexer: 'json',
      lines: parse.lineOffset,
      stack: parse.stack.token,
      token: ltoke,
      types: ltype
    };

    parse.push(data, record, structure);

  };

  /**
   * Get Next Character
   *
   * Peek at whats up next in the traversal
   */
  function peek (len: number, current: boolean) {

    /**
       * Current Index + 1
       */
    let n: number = current === true ? a : a + 1;

    /**
     * Next Character
     */
    let s: string = NIL;

    if (typeof len !== 'number' || len < 1) len = 1;

    if (u.is(c[a], cc.FWS)) {
      if (u.is(c[a + 1], cc.FWS)) {
        s = NWL;
      } else if (u.is(c[a + 1], cc.ARS)) {
        s = '/';
      }
    }

    if (n < b) {
      do {
        if (u.ws(c[n]) === false) {

          if (u.is(c[n], cc.FWS)) {
            if (s === NIL) {
              if (u.is(c[n + 1], cc.FWS)) {
                s = NWL;
              } else if (u.is(c[n + 1], cc.ARS)) {
                s = '/';
              }
            } else if (u.is(s, cc.FWS) && u.is(c[n - 1], cc.ARS)) {
              s = NIL;
            }
          }

          if (s === NIL && c[n - 1] + c[n] !== '\u002a/') return c.slice(n, n + len).join(NIL);

        } else if (u.is(s, cc.NWL) && u.is(c[n], cc.NWL)) {

          s = NIL;

        }

        n = n + 1;
      } while (n < b);
    }

    return NIL;

  };

  /**
   * Determines if a slash comprises a valid escape
   * or if it is escaped itself
   */
  function esc (index: number) {

    const cache = index;

    do index = index - 1;
    while (u.is(c[index], cc.BWS) && index > 0);

    return (cache - index) % 2 === 1;

  };

  /* -------------------------------------------- */
  /* ASI - AUTOMATIC SEMICOLON INSERTION          */
  /* -------------------------------------------- */

  /**
   * Clean Semicolon
   *
   * Removes improperly applied automatic semicolon insertions.
   */
  function cleanSemicolon () {

    let i = parse.count;

    if (data.types[i] === 'comment') {
      do i = i - 1;
      while (i > 0 && data.types[i] === 'comment');
    }

    data.token[i] === 'x;' && parse.splice({
      data,
      remove: 1,
      index: i
    });

  };

  /* -------------------------------------------- */
  /* PARSE TOKENIZERS                             */
  /* -------------------------------------------- */

  /**
   * Parse Block Comments
   *
   * Dispatches handling for block comments
   */
  function parseBlockComment () {

    if (wtest > -1) word();

    comment = CommentBlock(c, {
      end: b,
      lexer: 'json',
      begin: '/*',
      start: a,
      ender: '\u002a/'
    });

    a = comment[1];

    if (comment[0] !== NIL) {

      ltoke = comment[0];
      ltype = rx.CommIgnoreStart.test(ltoke) ? 'ignore' : 'comment';

      parse.push(data, {
        begin: parse.stack.index,
        ender: -1,
        lexer: 'json',
        lines: parse.lineOffset,
        stack: parse.stack.token,
        token: ltoke,
        types: ltype as any
      }, NIL);
    }

  };

  /**
   * Parse Line Comments
   *
   * Dispatches handling for line comments
   */
  function parseLineComment () {

    if (wtest > -1) word();

    comment = commentLine(c, {
      end: b,
      lexer: 'json',
      begin: '//',
      start: a,
      ender: NWL
    });

    a = comment[1];

    if (comment[0] !== NIL) {
      ltoke = comment[0];
      ltype = rx.CommIgnoreStart.test(ltoke) ? 'ignore' : 'comment';

      parse.push(data, {
        begin: parse.stack.index
        , ender: -1
        , lexer: 'json'
        , lines: parse.lineOffset
        , stack: parse.stack.token
        , token: ltoke
        , types: ltype as any
      }, NIL);
    }
  };

  /**
   * Get Number Token
   *
   * Tokenizer for numbers
   */
  function parseNumbers () {

    /**
     * The tokenized results
     */
    const build: string[] = [ c[a] ];

    /**
     * Traversal Iterator
     */
    let i: number = 0;

    /**
     * Whether or not current tokenizer is a `.` character
     */
    let dot: boolean = u.is(build[0], cc.DOT);

    /**
     * Regular expression for testing number
     */
    let exp: RegExp = /zz/;

    /* -------------------------------------------- */
    /* TRAVERSE                                     */
    /* -------------------------------------------- */

    if (a < b - 2 && c[a] === '0') {

      if (c[a + 1] === 'x') {
        exp = /[0-9a-fA-F]/;
      } else if (c[a + 1] === 'o') {
        exp = /[0-9]/;
      } else if (c[a + 1] === 'b') {
        exp = /0|1/;
      }

      if (exp.test(c[a + 2])) {

        build.push(c[a + 1]);
        i = a + 1;

        do {
          i = i + 1;
          build.push(c[i]);
        } while (exp.test(c[i + 1]));

        a = i;
        return build.join(NIL);
      }
    }

    i = a + 1;

    if (i < b) {
      do {

        if (u.digit(c[i]) || (u.is(c[i], cc.DOT) && dot === false)) {
          build.push(c[i]);
          if (u.is(c[i], cc.DOT)) dot = true;
        } else {
          break;
        }

        i = i + 1;
      } while (i < b);
    }

    if (i < b - 1 && (u.digit(c[i - 1]) || (
      u.digit(c[i - 2]) && (
        u.is(c[i - 1], cc.DSH) ||
        u.is(c[i - 1], cc.PLS)
      )
    )) && (
      c[i] === 'e' ||
      c[i] === 'E'
    )) {

      build.push(c[i]);

      if (u.is(c[i + 1], cc.DSH) || u.is(c[i + 1], cc.PLS)) {
        build.push(c[i + 1]);
        i = i + 1;
      }

      dot = false;
      i = i + 1;

      if (i < b) {
        do {
          if (u.digit(c[i]) || (u.is(c[i], cc.DOT) && dot === false)) {

            build.push(c[i]);

            if (u.is(c[i], cc.DOT)) dot = true;

          } else {
            break;
          }
          i = i + 1;
        } while (i < b);
      }
    }

    a = i - 1;

    return build.join(NIL);

  };

  /**
   * Parse Token
   *
   * This is a general parse function generic tokenizer. Start argument contains
   * the token's starting syntax offset argument is length of start minus
   * control chars end is how is to identify where the token ends
   */
  function parseTokens (starting: string, ending: string, type: Types) {

    let ee = 0;
    let escape = false;
    let ext = false;
    let build = [ starting ];
    let temp: string[];

    const ender = ending.split(NIL);
    const endlen = ender.length;
    const start = a;
    const base = a + starting.length;

    function finish () {

      let str = NIL;

      /**
       * Pads certain template tag delimiters with a space
       */
      function bracketSpace (input: string) {

        const spaceStart = (start: string) => start.replace(/\s*$/, ' ');
        const spaceEnd = (end: string) => end.replace(/^\s*/, ' ');

        if ((/\{(#|\/|(%>)|(%\]))/).test(input) || (/\}%(>|\])/).test(input)) return input;

        input = input.replace(/((\{\{-?)|(\{%-?))\s*/g, spaceStart);
        input = input.replace(/\s*((-?\}\})|(-?%\}))/g, spaceEnd);

        return input;

      };

      if (u.is(starting, cc.SQO)) {

        build[0] = DQO;
        build[build.length - 1] = DQO;

      } else if (escape === true) {

        str = build[build.length - 1];
        build.pop();
        build.pop();
        build.push(str);

      }

      a = ee;

      if (ending === NWL) {
        a = a - 1;
        build.pop();
      }

      ltoke = build.join(NIL);

      if (
        u.is(starting, cc.DQO) ||
        u.is(starting, cc.SQO) ||
        starting === '{{' ||
        starting === '{%'
      ) {

        ltoke = bracketSpace(ltoke);

      }

      if (starting === '{%' || starting === '{{') {

        temp = tname(ltoke);
        ltype = temp[0];

        push(temp[1]);

        return;
      }

      if (type === 'string') {

        ltype = 'string';

        if (parse.language === 'json') {

          ltoke = ltoke.replace(/\\u[\dA-F]{4}/gi, m => String.fromCharCode(parseInt(m.replace(/\\u/g, ''), 16)));

        } else if (starting.indexOf('#!') === 0) {

          ltoke = ltoke.slice(0, ltoke.length - 1);
          parse.lineOffset = 2;

        } else if (
          parse.stack.token !== 'object' || (
            parse.stack.token === 'object' &&
            u.not(peek(1, false), cc.COL) &&
            u.not(data.token[parse.count], cc.COM) &&
            u.not(data.token[parse.count], cc.LCB)
          )
        ) {

          if ((ltoke.length > rules.wordWrap && rules.wordWrap > 0) || (
            rules.wordWrap !== 0 &&
            u.is(data.token[parse.count], cc.PLS) && (
              u.is(data.token[parse.count - 1], cc.DOT) ||
              u.is(data.token[parse.count - 1], cc.SQO)
            )
          )) {

            let item = ltoke;
            let segment = NIL;
            let q = DQO;

            const limit = rules.wordWrap;

            const uchar = /u[0-9a-fA-F]{4}/;
            const xchar = /x[0-9a-fA-F]{2}/;

            item = item.slice(1, item.length - 1);

            if (
              u.is(data.token[parse.count], cc.PLS) && (
                u.is(data.token[parse.count - 1], cc.DOT) ||
                u.is(data.token[parse.count - 1], cc.SQO)
              )
            ) {

              parse.pop(data);

              q = data.token[parse.count].charAt(0);
              item = data.token[parse.count].slice(1, data.token[parse.count].length - 1) + item;

              parse.pop(data);
            }

            if (item.length > limit && limit > 0) {

              do {

                segment = item.slice(0, limit);

                if (u.is(segment[limit - 5], cc.BWS) && uchar.test(item.slice(limit - 4, limit + 1))) {

                  segment = segment.slice(0, limit - 5);

                } else if (u.is(segment[limit - 4], cc.BWS) && uchar.test(item.slice(limit - 3, limit + 2))) {

                  segment = segment.slice(0, limit - 4);

                } else if (u.is(segment[limit - 3], cc.BWS) && (
                  uchar.test(item.slice(limit - 2, limit + 3)) ||
                  xchar.test(item.slice(limit - 2, limit + 1))
                )) {

                  segment = segment.slice(0, limit - 3);

                } else if (u.is(segment[limit - 2], cc.BWS) && (
                  uchar.test(item.slice(limit - 1, limit + 4)) ||
                  xchar.test(item.slice(limit - 1, limit + 2))
                )) {

                  segment = segment.slice(0, limit - 2);

                } else if (u.is(segment[limit - 1], cc.BWS)) {

                  segment = segment.slice(0, limit - 1);
                }

                segment = q + segment + q;
                item = item.slice(segment.length - 2);
                ltoke = segment;
                ltype = 'string';

                push(NIL);

                parse.lineOffset = 0;
                ltoke = '+';
                ltype = 'operator';

                push(NIL);

              } while (item.length > limit);
            }

            ltoke = item === NIL ? q + q : q + item + q;
            ltype = 'string';
          }
        }

      } else if ((/\{\s*\?>$/).test(ltoke)) {

        ltype = 'liquid_start';

      } else {

        ltype = type;
      }

      if (ltoke.length > 0) push(NIL);

    };

    if (wtest > -1) word();

    // This insanity is for JSON where all the
    // required quote characters are escaped.
    if (u.is(c[a - 1], cc.BWS) && esc(a - 1) === true && (
      u.is(c[a], cc.DQO) ||
      u.is(c[a], cc.SQO))) {

      parse.pop(data);

      if (u.is(data.token[0], cc.LCB)) {
        if (u.is(c[a], cc.DQO)) {
          starting = DQO;
          ending = '\\"';
          build = [ DQO ];
        } else {
          starting = SQO;
          ending = "\\'";
          build = [ SQO ];
        }

        escape = true;

      } else {

        if (u.is(c[a], cc.DQO)) {
          build = [ '\\"' ];
          finish();
          return;
        }

        build = [ "\\'" ];
        finish();
        return;
      }
    }

    ee = base;

    if (ee < b) {

      do {

        if (
          u.not(data.token[0], cc.LCB) &&
          u.not(data.token[0], cc.LSB) && (
            u.is(c[ee], cc.DQO) ||
            u.is(c[ee], cc.SQO)
          )
        ) {

          if (u.is(c[ee - 1], cc.BWS)) {
            if (esc(ee - 1) === true) {
              if (u.is(c[ee], cc.SQO)) {
                build.pop();
              }
            }

          } else if (u.is(c[ee], cc.DQO) && u.is(c[a], cc.SQO)) {
            c[ee] = DQO;
          } else if (u.is(c[ee], cc.SQO) && u.is(c[a], cc.DQO)) {
            c[ee] = SQO;
          }

          build.push(c[ee]);

        } else if (ee > start) {

          ext = false;
          build.push(c[ee]);

        } else {

          build.push(c[ee]);
        }

        if (
          parse.language !== 'json' &&
          parse.language !== 'javascript' &&
          (u.is(starting, cc.DQO) || u.is(starting, cc.SQO)) &&
          (ext || ee > start) &&
          u.not(c[ee - 1], cc.BWS) &&
          u.not(c[ee], cc.DQO) &&
          u.not(c[ee], cc.SQO) &&
          (u.is(c[ee], cc.NWL) || (ee === b - 1) === true)
        ) {

          parse.error = 'Unterminated string in script on line number ' + parse.lineNumber;

          break;

        }

        if (c[ee] === ender[endlen - 1] && (u.not(c[ee - 1], cc.BWS) || esc(ee - 1) === false)) {

          if (endlen === 1) break;

          // `ee - base` is a cheap means of computing length of build array the `ee -
          // base` and `endlen` are both length based values, so adding two (1 for each)
          // provides an index based number
          if (build[ee - base] === ender[0] && build.slice(ee - base - endlen + 2).join(NIL) === ending) break;

        }

        ee = ee + 1;

      } while (ee < b);
    }

    finish();
  };

  /**
   * Ensures that commas immediately precede comments
   * instead of immediately follow
   */
  function getCommaComment () {

    let x = parse.count;

    if (data.stack[x] === 'object' && rules.objectSort === true) {

      ltoke = ',';
      ltype = 'separator';
      cleanSemicolon();
      push();

    } else {

      do { x = x - 1; } while (x > 0 && data.types[x - 1] === 'comment');

      parse.splice({
        data
        , remove: 0
        , index: x
        , record: {
          begin: data.begin[x]
          , ender: -1
          , lexer: 'json'
          , lines: parse.lineOffset
          , stack: data.stack[x]
          , token: ','
          , types: 'separator'
        }
      });

      push();
    }
  };

  /**
   * Operations for end types:
   *
   * - `)`
   * - `]`
   * - `}`
   */
  function end (x: string) {

    if (wtest > -1) word();

    if (u.is(x, cc.RSB)) {

      ltoke = ']';

    } else if (u.is(x, cc.RCB)) {

      if (rules.objectSort === true && parse.stack.token === 'object') sortObject(data);

      if (ltype === 'comment') {
        ltoke = data.token[parse.count];
        ltype = data.types[parse.count];
      }

      ltoke = '}';

    }

    ltype = 'end';

    lword.pop();
    brace.pop();

    // rules.endComma
    if (
      rules.endComma !== undefined &&
      rules.endComma !== 'preserve' &&
      parse.stack.token === 'array' ||
      parse.stack.token === 'object'
    ) {

      if (rules.endComma === 'always' && u.not(data.token[parse.count], cc.COM)) {

        const begin = parse.stack.index;
        let y = parse.count;

        do {
          if (data.begin[y] === begin) {
            if (u.is(data.token[y], cc.COM)) break;
          } else {
            y = data.begin[y];
          }

          y = y - 1;

        } while (y > begin);

        if (y > begin) {

          const type = ltype;
          const toke = ltoke;

          ltoke = ',';
          ltype = 'separator';

          push();

          ltoke = toke;
          ltype = type;
        }

      } else if (rules.endComma === 'never' && u.is(data.token[parse.count], cc.COM)) {

        parse.pop(data);
      }
    }

    push();

  };

  /**
   * Operations for start types:
   *
   * - `(`
   * - `[`
   * - `{`
   */
  function start (x: string) {

    let aa = parse.count;
    let wordx = NIL;
    let stack = NIL;

    brace.push(x);

    if (wtest > -1) {
      word();
      aa = parse.count;
    }

    lword.push([ ltoke, aa + 1 ]);

    ltoke = x;
    ltype = 'start';

    if (u.is(x, cc.LSB)) {
      if (ltype === 'comment' && u.is(data.token[aa - 1], cc.RPR)) {
        ltoke = data.token[aa];
        ltype = data.types[aa];
        data.token[aa] = '{';
        data.types[aa] = 'start';
      }
    }

    wordx = (() => {

      let bb = parse.count;

      if (data.types[bb] === 'comment') {
        do { bb = bb - 1; } while (bb > 0 && data.types[bb] === 'comment');
      }

      return data.token[bb];

    })();

    const wordy = (data.stack[aa] === undefined) ? NIL : (() => {

      let bb = parse.count;

      if (data.types[bb] === 'comment') {
        do bb = bb - 1;
        while (bb > 0 && data.types[bb] === 'comment');
      }

      return data.token[data.begin[bb] - 1];

    })();

    if (u.is(ltoke, cc.LCB) && (data.types[aa] === 'word' || u.is(data.token[aa], cc.RSB))) {

      let bb = aa;

      if (u.is(data.token[bb], cc.RSB)) {
        do bb = data.begin[bb] - 1;
        while (u.is(data.token[bb], cc.RSB));
      }

      do {
        if (data.types[bb] === 'start' || data.types[bb] === 'end' || data.types[bb] === 'operator') break;
        bb = bb - 1;
      } while (bb > 0);

    }

    if (stack === NIL && (u.is(ltoke, cc.LCB) || ltoke === 'x{')) {

      if (u.is(data.token[aa], cc.RSB) && u.is(data.token[aa - 1], cc.LSB)) {

        stack = 'array';

      } else if (
        parse.stack.length > 0 &&
        u.not(data.token[aa], cc.COL) &&
        parse.stack.token === 'object' && (
          u.is(data.token[data.begin[aa] - 2], cc.LCB) ||
          u.is(data.token[data.begin[aa] - 2], cc.COM)
        )
      ) {

        // if an object wrapped in some containment which is itself preceeded by a curly
        // brace or comma var a={({b:{cat:"meow"}})};
        stack = 'function';

      } else if (data.types[pword[1] - 1] === 'markup' && data.token[pword[1] - 3] === 'function') {

        // checking for TSX function using an angle brace name
        stack = 'function';

      } else if (wordx === '=>') {

        // checking for fat arrow assignment
        stack = 'function';

      } else {

        stack = 'object';
      }

      if (stack !== 'object' && stack !== 'class') {
        if (stack === 'function') {
          references.push(fnrefs);
          fnrefs = [];
        } else {
          references.push([]);
        }
      }

    } else if (u.is(ltoke, cc.LSB)) {

      stack = 'array';

    }

    push(stack);

  };

  /**
   * Determines tag names for {% %} based template tags
   * and returns a type
   */
  function tname (x: string) {

    let sn = 2;
    let en = 0;
    let name = NIL;

    const st = x.slice(0, 2);
    const len = x.length;

    if (u.is(x[2], cc.DSH)) sn = sn + 1;
    if (u.ws(x.charAt(sn)) === true) {
      do {
        sn = sn + 1;
      } while (u.ws(x.charAt(sn)) === true && sn < len);
    }

    en = sn;

    do {
      en = en + 1;
    } while (u.ws(x.charAt(en)) === false && x.charAt(en) !== '(' && en < len);

    if (en === len) en = x.length - 2;

    name = x.slice(sn, en);

    if (
      name === 'else' || (
        st === '{%' && (
          name === 'elseif' ||
          name === 'when' ||
          name === 'elif' ||
          name === 'elsif'
        )
      )
    ) {

      return [ 'liquid_else', `liquid_${name}` ];

    }

    if (st === '{{') {

      if (name === 'end') return [ 'liquid_end', NIL ];

      if (
      //  (name === 'block' && (/\{%\s*\w/).test(source) === false) ||
        name === 'define' ||
        name === 'form' ||
        name === 'if' ||
        name === 'unless' ||
        name === 'range' ||
        name === 'with'
      ) {

        return [ 'liquid_start', `liquid_${name}` ];
      }

      return [ 'liquid', NIL ];
    }

    en = namelist.length - 1;

    if (en > -1) {
      do {
        if (
          name === namelist[en] && (
            name !== 'block' // ||
          //   (/\{%\s*\w/).test(source) === false
          )
        ) {

          return [ 'liquid_start', `liquid_${name}` ];
        }

        if (name === 'end' + namelist[en]) {
          return [ 'liquid_end'
            , NIL ];
        }
        en = en - 1;

      } while (en > -1);
    }

    return [ 'liquid', NIL ];
  };

  /**
   * A lexer for keywords, reserved words, and variables
   */
  function word () {

    let f = wtest;
    let g = 1;
    let output = NIL;
    let typel = ltype;

    const lex = [];

    do {

      lex.push(c[f]);

      if (u.is(c[f], cc.BWS)) {
        // parse.error = `Illegal escape in JavaScript on line number ${parse.lineNumber}`;
      }

      f = f + 1;
    } while (f < a);

    if (ltoke.charAt(0) === '\u201c') {
      parse.error = `Quote looking character (\u201c, \\u201c) used instead of actual quotes on line number ${parse.lineNumber}`;
    } else if (ltoke.charAt(0) === '\u201d') {
      parse.error = `Quote looking character (\u201d, \\u201d) used instead of actual quotes on line number ${parse.lineNumber}`;
    }

    output = lex.join(NIL);
    wtest = -1;

    g = parse.count;
    f = g;

    if (typel === 'comment') {

      let d = parse.count;

      do d = d - 1;
      while (d > 0 && data.types[d] === 'comment');

      typel = data.types[d];

    }

    if (parse.stack.token === 'object' && (
      u.is(data.token[parse.count], cc.LCB) || (
        u.is(data.token[data.begin[parse.count]], cc.LCB) &&
          u.is(data.token[parse.count], cc.COM) || (
          data.types[parse.count] === 'liquid_end' && (
            u.is(data.token[data.begin[parse.count] - 1], cc.LCB) ||
              u.is(data.token[data.begin[parse.count] - 1], cc.COM)
          )
        )
      )
    )) {

      ltype = 'property';

    } else if (
      parse.stack.token !== 'object' || (
        parse.stack.token === 'object' &&
          ltoke !== ',' &&
          ltoke !== '{'
      )
    ) {

      let d = references.length;
      let e = 0;

      if (d > 0) {
        do {

          d = d - 1;
          e = references[d].length;

          if (e > 0) {
            do {

              e = e - 1;
              if (output === references[d][e]) break;

            } while (e > 0);

            if (output === references[d][e]) break;

          }
        } while (d > 0);

        ltype = 'word';

      } else {
        ltype = 'word';
      }

    } else {
      ltype = 'word';
    }

    ltoke = output;

    push();

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

      if (u.is(c[a], cc.NWL)) {
        parse.lineIndex = a;
        parse.lineOffset = parse.lineOffset + 1;
        parse.lineNumber = parse.lineNumber + 1;
      }

      if (u.ws(c[a + 1]) === false) break;

      a = a + 1;

    } while (a < b);

  }

  /* -------------------------------------------- */
  /* BEGIN                                        */
  /* -------------------------------------------- */

  do {

    if (u.ws(c[a])) {

      if (wtest > -1) word();

      parseSpace();

      if (
        parse.lineOffset > 1 &&
        lengthb < parse.count &&
        u.not(c[a + 1], cc.SEM) &&
        u.not(c[a + 1], cc.RCB)
      ) {

        lengthb = parse.count;
      }

    } else if (u.is(c[a], cc.LCB) && u.is(c[a + 1], cc.PER)) {

      // TODO: HANDLE LIQUID COMMENTS

      parseTokens('{%', '%}', 'liquid');

    } else if (u.is(c[a], cc.LCB) && u.is(c[a + 1], cc.LCB)) {

      parseTokens('{{', '}}', 'liquid');

    } else if (u.is(c[a], cc.LAN) && u.is(c[a + 1], cc.BNG) && u.is(c[a + 2], cc.DSH) && u.is(c[a + 3], cc.DSH)) {

      // markup comment
      parseTokens('<!--', '-->', 'comment');

    } else if (u.is(c[a], cc.FWS) && (a === b - 1 || u.is(c[a + 1], cc.ARS))) {

      // comment block
      parseBlockComment();

    } else if ((parse.count < 0 || data.lines[parse.count] > 0) &&
      u.is(c[a], cc.HSH) &&
      u.is(c[a + 1], cc.BNG) && (
      u.is(c[a + 2], cc.FWS) ||
      u.is(c[a + 3], cc.LSB)
    )) {

      // shebang
      parseTokens('#!' + c[a + 2], NWL, 'string');

    } else if (u.is(c[a], cc.FWS) && (a === b - 1 || u.is(c[a + 1], cc.FWS))) {

      // comment line
      parseLineComment();

    } else if (u.is(c[a], cc.DQO) || u.is(c[a], cc.SQO)) {

      // string
      parseTokens(c[a], c[a], 'string');

    } else if (wtest === -1 && (c[a] !== '0' || (
      c[a] === '0' &&
      c[a + 1] !== 'b'
    )) && (
      u.digit(c[a]) || (
        a !== b - 2 &&
        u.is(c[a], cc.DSH) &&
        u.is(c[a + 1], cc.DOT) &&
        u.digit(c[a + 2])
      ) || (
        a !== b - 1 && (
          u.is(c[a], cc.DSH) ||
          u.is(c[a], cc.DOT)
        ) && u.digit(c[a + 1])
      )
    )) {

      // number
      if (wtest > -1) word();

      if (ltype === 'end' && u.is(c[a], cc.DSH)) {
        ltoke = '-';
        ltype = 'operator';
      } else {
        ltoke = parseNumbers();
        ltype = 'number';
      }

      push();

    } else if (u.is(c[a], cc.COM)) {

      // comma
      if (wtest > -1) word();

      if (ltype === 'comment') {

        getCommaComment();

      } else {

        ltoke = ',';
        ltype = 'separator';

        cleanSemicolon();

        push();

      }

    } else if (u.is(c[a], cc.LPR) || u.is(c[a], cc.LSB) || u.is(c[a], cc.LCB)) {

      start(c[a]);

    } else if (u.is(c[a], cc.RPR) || u.is(c[a], cc.RSB) || u.is(c[a], cc.RCB)) {

      end(c[a]);

    } else if (
      wtest < 0 &&
      data.stack[parse.count] === 'object' &&
      u.is(c[a], cc.ARS) &&
      u.not(c[a + 1], cc.EQS) &&
      u.digit(c[a + 1]) === false &&
      u.ws(c[a + 1]) === false
    ) {

      wtest = a;

    } else if (u.is(c[a], cc.COL)) {

      ltoke = ':';
      ltype = 'operator';

      push();

    } else if (wtest < 0 && c[a] !== NIL) {

      wtest = a;
    }

  } while (++a < b);

  if (wtest > -1) word();

  if (rules.objectSort && data.begin.length > 0) {
    sortCorrect(0, parse.count + 1);
  }

  // console.log(data);
  return data;

};
