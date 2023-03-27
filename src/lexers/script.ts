/* eslint-disable no-mixed-operators */
/* eslint-disable no-control-regex */

import { Record, ScriptRules, Structure, Types, VariableDeclarations } from 'types';
import { commentBlock, commentLine } from 'comments';
import { parse } from 'parse/parser';
import { sortCorrect, sortObject } from 'parse/sorting';
import { DQO, NIL, NWL, SQO } from 'chars';
import * as rx from 'lexical/regex';
import { cc } from 'lexical/codes';
import * as u from 'utils/helpers';

// prettify.lexers.script =

export function script () {

  /**
   * Destructured `parse` methods and store reference
   */
  const { data, references, rules, source } = parse;

  /**
   * Script Lexer Options
   */
  const option: ScriptRules = parse.language === 'json' ? rules.json : rules.script;

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

  /**
   * Class count reference
   */
  const classy: number[] = [];

  /**
   * Sourcemap reference
   */
  const sourcemap = [ 0, NIL ];

  /**
   * TypeScript Data Types store reference
   */
  const tstype: boolean[] = [ false ];

  /**
   * Identify variable declarations
   */
  const vstore: VariableDeclarations = { count: [], index: [], word: [] };

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Variable Declaration index length reference
   */
  let v: number = -1;

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
  let pword: Partial<Structure> = [];

  /**
   * Parse count or similar
   */
  let lengthb = 0;

  /**
   * Hold reference of word test
   */
  let wtest = -1;

  /**
   * Hold reference of parenthesis test
   */
  let paren = -1;

  /**
   * Function name reference store
   */
  let fnrefs: string[] = [];

  /**
   * Temporary token store reference record
   */
  let tstore: Record;

  /**
   * Parse Stack
   */
  let pstack: Structure;

  /**
   * Comment stack
   */
  let comment: [string, number];

  /**
   * Name list tests (used within `tname()`)
   * Helps determine tag names for {% %} based template tags
   *
   * @todo This needs to refactored to better support liquid
   */
  const namelist = [
    'autoescape',
    'block',
    'capture',
    'case',
    'comment',
    'embed',
    'filter',
    'for',
    'form',
    'if',
    'macro',
    'paginate',
    'raw',
    'sandbox',
    'spaceless',
    'tablerow',
    'unless',
    'verbatim'
  ];

  /**
   * Pop Variable
   * Remove "vart" object data
   */
  function pop () {

    vstore.count.pop();
    vstore.index.pop();
    vstore.word.pop();

    v = v - 1;

  };

  /**
   * Push Record
   *
   * Determine the definition of containment by stack
   */
  function push (structure: string = NIL) {

    const record: Record = {
      begin: parse.stack.index,
      ender: -1,
      lexer: 'script',
      lines: parse.lineOffset,
      stack: parse.stack.token,
      token: ltoke,
      types: ltype
    };

    // console.log(record);

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
   * Apply Semicolon
   *
   * Logic pertaining to automatic semicolon insertion correction rule.
   */
  function applySemicolon (isEnd: boolean) {

    const next = peek(1, false);
    const clist = parse.stack.length === 0 ? NIL : parse.stack.token;
    const record: Record = {
      begin: data.begin[parse.count],
      ender: data.begin[parse.count],
      lexer: data.lexer[parse.count],
      lines: data.lines[parse.count],
      stack: data.stack[parse.count],
      token: data.token[parse.count],
      types: data.types[parse.count]
    };

    if (rx.CommIgnoreStart.test(ltoke)) {

      return; // RETURN EARLY

    }

    if (ltype === 'start' || ltype === 'type_start') {

      return; // RETURN EARLY

    }

    if (parse.language === 'json') {

      return; // RETURN EARLY
    }

    if (
      u.is(next, cc.LCB) ||
      u.is(record.token, cc.SEM) ||
      u.is(record.token, cc.COM) ||
      record.stack === 'class' ||
      record.stack === 'map' ||
      record.stack === 'attribute' ||
      data.types[record.begin - 1] === 'generic' ||
      clist === 'initializer'
    ) {

      return; // RETURN EARLY
    }

    if (
      u.is(record.token, cc.RCB) &&
      data.stack[record.begin - 1] === 'global' &&
      data.types[record.begin - 1] !== 'operator' &&
      record.stack === data.stack[parse.count - 1]) {

      return; // RETURN EARLY

    }

    if (record.stack === 'array' && u.not(record.token, cc.RSB)) {

      return; // RETURN EARLY

    }
    if (u.is(data.token[data.begin[parse.count]], cc.LCB) && record.stack === 'data_type') {

      return; // RETURN EARLY

    }

    if (
      record.types !== undefined &&
      record.types.indexOf('liquid') > -1 &&
      record.types.indexOf('template_string') < 0
    ) {

      return; // RETURN EARLY
    }

    if (u.is(next, cc.SEM) && isEnd === false) {

      return; // RETURN EARLY

    }

    if (data.lexer[parse.count - 1] !== 'script' && (
      (a < b && b === source.length - 1) ||
      (b < source.length - 1)
    )) {

      return; // RETURN EARLY

    }

    let i: number = 0;

    if (u.is(record.token, cc.RCB) && (
      record.stack === 'function' ||
      record.stack === 'if' ||
      record.stack === 'else' ||
      record.stack === 'for' ||
      record.stack === 'do' ||
      record.stack === 'while' ||
      record.stack === 'switch' ||
      record.stack === 'class' ||
      record.stack === 'try' ||
      record.stack === 'catch' ||
      record.stack === 'finally' ||
      record.stack === 'block'
    )) {

      if (record.stack === 'function' && (
        data.stack[record.begin - 1] === 'data_type' ||
        data.types[record.begin - 1] === 'type'
      )) {

        i = record.begin;

        do i = i - 1;
        while (i > 0 && u.not(data.token[i], cc.RPR) && data.stack[i] !== 'arguments');

        i = data.begin[i];
      } else {

        i = data.begin[record.begin - 1];
      }

      if (u.is(data.token[i], cc.LPR)) {

        i = i - 1;

        if (data.token[i - 1] === 'function') i = i - 1;
        if (data.stack[i - 1] === 'object' || data.stack[i - 1] === 'switch') return;
        if (
          u.not(data.token[i - 1], cc.EQS) &&
          u.not(data.token[i - 1], cc.COL) &&
          data.token[i - 1] !== 'return') return;

      } else {

        return;
      }
    }

    if (
      record.types === 'comment' ||
      clist === 'method' ||
      clist === 'paren' ||
      clist === 'expression' ||
      clist === 'array' ||
      clist === 'object' || (clist === 'switch' &&
        record.stack !== 'method' &&
        u.is(data.token[data.begin[parse.count]], cc.LPR) &&
        data.token[data.begin[parse.count] - 1] !== 'return' &&
        data.types[data.begin[parse.count] - 1] !== 'operator'
      )
    ) {

      return;
    }

    if (data.stack[parse.count] === 'expression' && (
      data.token[data.begin[parse.count] - 1] !== 'while' || (
        data.token[data.begin[parse.count] - 1] === 'while' &&
        data.stack[data.begin[parse.count] - 2] !== 'do'
      )
    )) {

      return;
    }

    if (next !== NIL && '=<>+*?|^:&%~,.()]'.indexOf(next) > -1 && isEnd === false) return;

    if (record.types === 'comment') {

      i = parse.count;

      do i = i - 1;
      while (i > 0 && data.types[i] === 'comment');

      if (i < 1) return;

      record.token = data.token[i];
      record.types = data.types[i];
      record.stack = data.stack[i];
    }

    if (
      record.token === undefined ||
      record.types === 'start' ||
      record.types === 'separator' || (
        record.types === 'operator' &&
        record.token !== '++' &&
        record.token !== '--'
      ) ||
      record.token === 'x}' ||
      record.token === 'var' ||
      record.token === 'let' ||
      record.token === 'const' ||
      record.token === 'else' ||
      record.token.indexOf('#!/') === 0 ||
      record.token === 'instanceof'
    ) {

      return;
    }

    if (record.stack === 'method' && (
      data.token[record.begin - 1] === 'function' ||
      data.token[record.begin - 2] === 'function')
    ) {

      return;
    }

    if (option.variableList === 'list') vstore.index[v] = parse.count;

    ltoke = rules.correct === true ? ';' : 'x;';
    ltype = 'separator';

    i = parse.lineOffset;

    parse.lineOffset = 0;

    push();

    parse.lineOffset = i;

    applyBrace();

  };

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

    if (data.token[i] === 'from') i = i - 2;
    if (data.token[i] === 'x;') parse.splice({ data, howmany: 1, index: i });

  };

  /**
   * Brace Semicolon
   *
   * Fixes automatic semicolon insertions location if inserted after an inserted brace
   */
  function braceSemicolon () {

    let i = parse.count;

    do i = i - 1;
    while (i > -1 && data.token[i] === 'x}');

    if (data.stack[i] === 'else') return push();

    i = i + 1;

    parse.splice({
      data,
      howmany: 0,
      index: i,
      record: {
        begin: data.begin[i],
        ender: -1,
        lexer: 'script',
        lines: parse.lineOffset,
        stack: data.stack[i],
        token: ltoke,
        types: ltype as any
      }
    });

    push();

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

    applySemicolon(false);

    if (wtest > -1) word();

    comment = commentBlock({
      chars: c,
      end: b,
      lexer: 'script',
      begin: '/*',
      start: a,
      ender: '\u002a/'
    });

    a = comment[1];

    if (
      data.token[parse.count] === 'var' ||
      data.token[parse.count] === 'let' ||
      data.token[parse.count] === 'const'
    ) {

      tstore = parse.pop(data);

      push();

      parse.push(data, tstore, NIL);

      if (data.lines[parse.count - 2] === 0) data.lines[parse.count - 2] = data.lines[parse.count];

      data.lines[parse.count] = 0;

    } else if (comment[0] !== NIL) {

      ltoke = comment[0];
      ltype = rx.CommIgnoreStart.test(ltoke) ? 'ignore' : 'comment';

      if (ltoke.indexOf('# sourceMappingURL=') === 2) {
        sourcemap[0] = parse.count + 1;
        sourcemap[1] = ltoke;
      }

      parse.push(data, {
        begin: parse.stack.index,
        ender: -1,
        lexer: 'script',
        lines: parse.lineOffset,
        stack: parse.stack.token,
        token: ltoke,
        types: ltype as any
      }, NIL);
    }

    if ((/\/\*\s*global\s+/).test(data.token[parse.count]) && data.types.indexOf('word') < 0) {

      references[0] = data.token[parse.count]
        .replace(/\/\*\s*global\s+/, NIL)
        .replace('\u002a/', NIL)
        .replace(/,\s+/g, ',').split(',');
    }
  };

  /**
   * Parse Line Comments
   *
   * Dispatches handling for line comments
   */
  function parseLineComment () {

    applySemicolon(false);
    applyBrace();

    if (wtest > -1) word();

    comment = commentLine({
      chars: c,
      end: b,
      lexer: 'script',
      begin: '//',
      start: a,
      ender: NWL
    });

    a = comment[1];

    if (comment[0] !== NIL) {
      ltoke = comment[0];
      ltype = rx.CommIgnoreStart.test(ltoke) ? 'ignore' : 'comment';

      if (ltoke.indexOf('# sourceMappingURL=') === 2) {
        sourcemap[0] = parse.count + 1;
        sourcemap[1] = ltoke;
      }

      parse.push(data, {
        begin: parse.stack.index
        , ender: -1
        , lexer: 'script'
        , lines: parse.lineOffset
        , stack: parse.stack.token
        , token: ltoke
        , types: ltype as any
      }, NIL);
    }
  };

  /**
   * Parse Regex
   *
   * A tokenizer for regular expressions
   */
  function parseRegex () {

    let h: number = 0;
    let i: number = 0;
    let n: number = a + 1;
    let square = false;

    const length = b;
    const build = [ '/' ];

    if (n < length) {

      do {

        build.push(c[n]);

        if (u.not(c[n - 1], cc.BWS) || u.is(c[n - 2], cc.BWS)) {
          if (u.is(c[n], cc.LSB)) square = true;
          if (u.is(c[n], cc.RSB)) square = false;
        }

        if (u.is(c[n], cc.FWS) && square === false) {

          if (u.is(c[n - 1], cc.BWS)) {

            i = 0;
            h = n - 1;

            if (h > 0) {

              do {
                if (u.is(c[h], cc.BWS)) i = i + 1;
                else break;
                h = h - 1;
              } while (h > 0);

            }

            if (i % 2 === 0) break;

          } else {

            break;

          }
        }

        n = n + 1;
      } while (n < length);
    }

    if (
      c[n + 1] === 'g' ||
      c[n + 1] === 'i' ||
      c[n + 1] === 'm' ||
      c[n + 1] === 'y' ||
      c[n + 1] === 'u'
    ) {

      build.push(c[n + 1]);

      if (
        c[n + 2] !== c[n + 1] && (
          c[n + 2] === 'g' ||
          c[n + 2] === 'i' ||
          c[n + 2] === 'm' ||
          c[n + 2] === 'y' ||
          c[n + 2] === 'u'
        )
      ) {

        build.push(c[n + 2]);

        if (
          c[n + 3] !== c[n + 1] && c[n + 3] !== c[n + 2] && (
            c[n + 3] === 'g' ||
            c[n + 3] === 'i' ||
            c[n + 3] === 'm' ||
            c[n + 3] === 'y' ||
            c[n + 3] === 'u'
          )
        ) {

          build.push(c[n + 3]);

          if (
            c[n + 4] !== c[n + 1] &&
            c[n + 4] !== c[n + 2] &&
            c[n + 4] !== c[n + 3] && (
              c[n + 4] === 'g' ||
              c[n + 4] === 'i' ||
              c[n + 4] === 'm' ||
              c[n + 4] === 'y' ||
              c[n + 4] === 'u'
            )
          ) {

            build.push(c[n + 4]);

            if (
              c[n + 5] !== c[n + 1] &&
              c[n + 5] !== c[n + 2] &&
              c[n + 5] !== c[n + 3] &&
              c[n + 5] !== c[n + 4] && (
                c[n + 5] === 'g' ||
                c[n + 5] === 'i' ||
                c[n + 5] === 'm' ||
                c[n + 5] === 'y' ||
                c[n + 5] === 'u'
              )
            ) {

              build.push(c[n + 4]);

              a = n + 5;

            } else {
              a = n + 4;
            }
          } else {
            a = n + 3;
          }
        } else {
          a = n + 2;
        }
      } else {
        a = n + 1;
      }
    } else {
      a = n;
    }

    return build.join(NIL);

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
   * Parse Operators
   *
   * A unique parse tokenizer for operator characters
   */
  function parseOperator () {

    let g = 0;
    let h = 0;
    let jj = b;
    let output = NIL;

    const syntax = [
      '=',
      '<',
      '>',
      '+',
      '*',
      '?',
      '|',
      '^',
      ':',
      '&',
      '%',
      '~'
    ];

    const synlen = syntax.length;

    if (wtest > -1) word();

    if (u.is(c[a], cc.FWS) && (parse.count > -1 && ((ltype !== 'word' && ltype !== 'reference') ||
      ltoke === 'typeof' ||
      ltoke === 'return' ||
      ltoke === 'else'
    ) && ltype !== 'number' &&
      ltype !== 'string' &&
      ltype !== 'end'
    )) {

      if (ltoke === 'return' || ltoke === 'typeof' || ltoke === 'else' || ltype !== 'word') {
        ltoke = parseRegex();
        ltype = 'regex';
      } else {
        ltoke = '/';
        ltype = 'operator';
      }

      push();

      return 'regex';
    }

    if (
      u.is(c[a], cc.QWS) &&
      ('+-\u002a/.?'.indexOf(c[a + 1]) > -1 || (
        u.is(c[a + 1], cc.COL) &&
        syntax.join(NIL).indexOf(c[a + 2]) < 0
      ))
    ) {

      if (u.is(c[a + 1], cc.DOT) && u.digit(c[a + 2]) === false) {
        output = '?.';
      } else if (u.is(c[a + 1], cc.QWS)) {
        output = '??';
      }

      if (output === NIL) return '?';
    }

    if (u.is(c[a], cc.COL) && '+-\u002a/'.indexOf(c[a + 1]) > -1) return ':';

    if (a < b - 1) {

      if (u.not(c[a], cc.LAN) && u.is(c[a + 1], cc.LAN)) return c[a];
      if (u.is(c[a], cc.BNG) && u.is(c[a + 1], cc.FWS)) return '!';
      if (u.is(c[a], cc.DSH)) {

        tstype[tstype.length - 1] = false;

        if (u.is(c[a + 1], cc.DSH)) {
          output = '--';
        } else if (u.is(c[a + 1], cc.EQS)) {
          output = '-=';
        } else if (u.is(c[a + 1], cc.RAN)) {
          output = '->';
        }

        if (output === NIL) return '-';
      }

      if (u.is(c[a], cc.PLS)) {

        tstype[tstype.length - 1] = false;

        if (u.is(c[a + 1], cc.PLS)) {
          output = '++';
        } else if (u.is(c[a + 1], cc.EQS)) {
          output = '+=';
        }

        if (output === NIL) return '+';
      }

      if (
        u.is(c[a], cc.EQS) &&
        u.not(c[a + 1], cc.EQS) &&
        u.not(c[a + 1], cc.BNG) &&
        u.not(c[a + 1], cc.RAN)
      ) {

        tstype[tstype.length - 1] = false;
        return '=';

      }
    }

    if (u.is(c[a], cc.SEM)) {

      if (parse.language === 'typescript') {

        if (data.stack[parse.count] === 'arguments') {

          if (data.token[parse.count] === '?') {
            parse.pop(data);
            output = '?:';
            a = a - 1;
          }

          tstype[tstype.length - 1] = true;

        } else if (u.is(ltoke, cc.RPR) && (
          data.token[data.begin[parse.count] - 1] === 'function' ||
          data.token[data.begin[parse.count] - 2] === 'function'
        )) {

          tstype[tstype.length - 1] = true;

        } else if (ltype === 'reference') {

          g = parse.count;

          let colon = false;

          do {
            if (data.begin[g] === data.begin[parse.count]) {

              if (g < parse.count && data.token[g] === ':' && data.types[g + 1] !== 'type') colon = true;

              if (data.token[g] === '?' && colon === false) break;
              if (data.token[g] === ';' || data.token[g] === 'x;') break;

              if (
                data.token[g] === 'var' ||
                data.token[g] === 'let' ||
                data.token[g] === 'const' || data.types[g] === 'type'
              ) {

                tstype[tstype.length - 1] = true;
                break;
              }

            } else {

              if (data.types[g] === 'type_end') {
                tstype[tstype.length - 1] = true;
                break;
              }

              g = data.begin[g];
            }

            g = g - 1;

          } while (g > data.begin[parse.count]);
        }

      } else if (data.token[parse.count - 1] === '[' && (
        data.types[parse.count] === 'word' ||
        data.types[parse.count] === 'reference'
      )) {

        parse.stack.update('attribute');
        data.stack[parse.count] = 'attribute';
      }
    }

    if (output === NIL) {

      if (
        (u.is(c[a + 1], cc.PLS) && u.is(c[a + 2], cc.PLS)) ||
        (u.is(c[a + 1], cc.DSH) && u.is(c[a + 2], cc.DSH))
      ) {

        output = c[a];
      } else {

        const buildout = [ c[a] ];

        g = a + 1;

        if (g < jj) {
          do {

            if ((
              u.is(c[g], cc.PLS) &&
              u.is(c[g + 1], cc.PLS)
            ) || (
              u.is(c[g], cc.DSH) &&
              u.is(c[g + 1], cc.DSH)
            )) break;

            h = 0;

            if (h < synlen) {
              do {
                if (c[g] === syntax[h]) {
                  buildout.push(syntax[h]);
                  break;
                }

                h = h + 1;
              } while (h < synlen);
            }

            if (h === synlen) break;

            g = g + 1;
          } while (g < jj);
        }

        output = buildout.join(NIL);
      }
    }

    a = a + (output.length - 1);

    if (output === '=>' && u.is(ltoke, cc.RPR)) {

      g = parse.count;
      jj = data.begin[g];

      do {

        if (data.begin[g] === jj) data.stack[g] = 'method';
        g = g - 1;

      } while (g > jj - 1);
    }

    return output;
  };

  /**
   * Parse Template Literal
   *
   * ES6 template string support
   */
  function parseLiteral () {

    const build: string[] = [ c[a] ];

    a = a + 1;

    if (a < b) {
      do {

        build.push(c[a]);

        if (u.is(c[a], cc.TQO) && (u.not(c[a - 1], cc.BWS) || !esc(a - 1))) break;
        if (u.is(c[a - 1], cc.DOL) && u.is(c[a], cc.LCB) && (u.not(c[a - 2], cc.BWS) || !esc(a - 2))) break;

        a = a + 1;
      } while (a < b);
    }

    return build.join(NIL);

  };

  /**
   * Parse Markup
   *
   * Identifies blocks of markup embedded within JavaScript
   * for language super sets like React JSX.
   */
  function parseMarkup () {

    let d = 0;
    let curlytest = false;
    let endtag = false;
    let anglecount = 0;
    let curlycount = 0;
    let tagcount = 0;
    let next = NIL;

    /**
     * Prior Token
     */
    let ptoke = NIL;

    /**
     * Prior Type
     */
    let ptype = NIL;

    const output = [];
    const dt = tstype[tstype.length - 1];
    const syntaxnum = '0123456789=<>+-*?|^:&.,;%(){}[]~';

    function applyMarkup () {

      if (u.is(ltoke, cc.LPR)) parse.stack.update('paren', parse.count);

      // console.log(output.join(NIL));
      parse.external('html', output.join(NIL));

    };

    if (wtest > -1) word();

    // type generics tokenizer
    ptoke = (parse.count > 0) ? data.token[parse.count - 1] : NIL;
    ptype = (parse.count > 0) ? data.types[parse.count - 1] : NIL;
    next = peek(1, false);

    if (parse.language !== 'jsx' && parse.language !== 'tsx' && u.digit(next) === false && (
      ltoke === 'function' ||
      ptoke === '=>' ||
      ptoke === 'void' ||
      ptoke === '.' ||
      ltoke === 'return' ||
      ltype === 'operator' ||
      data.stack[parse.count] === 'arguments' || (
        ltype === 'type' &&
        ptoke === 'type'
      ) || (
        ltype === 'reference' && (
          ptype === 'operator' ||
          ptoke === 'function' ||
          ptoke === 'class' ||
          ptoke === 'new'
        )
      ) || (
        ltype === 'type' &&
        ptype === 'operator'
      )
    )) {

      const build: string[] = [];

      let i: number = 0;
      let e: number = 0;

      d = a;

      do {

        build.push(c[d]);

        if (u.is(c[d], cc.LAN)) {
          i = i + 1;
        } else if (u.is(c[d], cc.RAN)) {
          i = i - 1;
          if (i < 1) break;
        }

        d = d + 1;

      } while (d < b);

      e = a;
      a = d;

      next = peek(1, false);

      if (u.is(c[d], cc.RAN) && (
        dt === true ||
        ptoke === '=>' ||
        ptoke === '.' ||
        ptype !== 'operator' || (
          ptype === 'operator' && (
            u.is(next, cc.LPR) ||
            u.is(next, cc.EQS)
          )
        )
      )) {

        ltype = 'generic';
        ltoke = build
          .join(NIL)
          .replace(/^<\s+/, '<')
          .replace(/\s+>$/, '>')
          .replace(/,\s*/g, ', ');

        push();

        return;

      }

      a = e;
    }

    d = parse.count;

    if (data.types[d] === 'comment') {
      do { d = d - 1; } while (d > 0 && data.types[d] === 'comment');
    }

    if (
      dt === false &&
      peek(1, false) !== '>' && ((u.not(c[a], cc.LAN) && syntaxnum.indexOf(c[a + 1]) > -1) ||
        data.token[d] === '++' ||
        data.token[d] === '--' ||
        u.ws(c[a + 1]) === true || (
        u.digit(c[a + 1]) === true && (
          ltype === 'operator' ||
            ltype === 'string' ||
            ltype === 'number' ||
            ltype === 'reference' || (
            ltype === 'word' &&
            ltoke !== 'return'
          )
        )
      ))
    ) {

      ltype = 'operator';
      ltoke = parseOperator();

      return push();

    }

    if (
      parse.language !== 'typescript' && (
        data.token[d] === 'return' ||
        data.types[d] === 'operator' ||
        data.types[d] === 'start' ||
        data.types[d] === 'separator' ||
        data.types[d] === 'jsx_attribute_start' || (
          u.is(data.token[d], cc.RCB) &&
          parse.stack.token === 'global'
        )
      )
    ) {

      ltype = 'markup';
      parse.language = 'jsx';

      do {

        output.push(c[a]);

        if (u.is(c[a], cc.LCB)) {

          curlycount = curlycount + 1;
          curlytest = true;

        } else if (u.is(c[a], cc.RCB)) {

          curlycount = curlycount - 1;

          if (curlycount === 0) curlytest = false;

        } else if (u.is(c[a], cc.LAN) && curlytest === false) {

          if (u.is(c[a + 1], cc.LAN)) {

            do {
              output.push(c[a]);
              a = a + 1;
            } while (a < b && u.is(c[a + 1], cc.LAN));
          }

          anglecount = anglecount + 1;

          if (u.is(peek(1, false), cc.FWS)) endtag = true;

        } else if (u.is(c[a], cc.RAN) && curlytest === false) {

          if (u.is(c[a + 1], cc.RAN)) {
            do {
              output.push(c[a]);
              a = a + 1;
            } while (u.is(c[a + 1], cc.RAN));
          }

          anglecount = anglecount - 1;

          if (endtag === true) {
            tagcount = tagcount - 1;
          } else if (u.not(c[a - 1], cc.FWS)) {
            tagcount = tagcount + 1;
          }

          if (anglecount === 0 && curlycount === 0 && tagcount < 1) {

            next = peek(2, false);

            // if followed by nonmarkup
            if (u.not(next, cc.LAN)) return applyMarkup();

            // catch additional trailing tag sets
            if (
              u.is(next, cc.LAN) &&
              syntaxnum.indexOf(next.charAt(1)) < 0 &&
              u.ws(next.charAt(1)) === false) {

              // perform a minor safety test to verify if "<" is a tag start
              // or a less than operator
              d = a + 1;

              do {

                d = d + 1;
                if (u.is(c[d], cc.RAN) || (u.ws(c[d - 1]) && syntaxnum.indexOf(c[d]) < 0)) break;

                // if followed by additional markup tags
                if (syntaxnum.indexOf(c[d]) > -1) return applyMarkup();

              } while (d < b);

            } else {

              return applyMarkup(); // if a nonmarkup "<" follows markup
            }
          }

          endtag = false;
        }

        a = a + 1;

      } while (a < b);

      return applyMarkup();
    }

    ltype = 'operator';
    ltoke = parseOperator();

    push();

  };

  /**
   * Parse Logical
   *
   * Convert `++` and `--` into `"= x +"`  and `"= x -"` in most cases
   */
  function parseLogical () {

    let pre = true;
    let toke = '+';
    let tokea = NIL;
    let tokeb = NIL;
    let tokec = NIL;
    let next = NIL;
    let ind = 0;
    let walk = 0;

    /**
     * Iterator
     */
    let i: number = 0;

    const store = [];

    function getEnd () {

      walk = data.begin[walk] - 1;

      if (data.types[walk] === 'end') {
        getEnd();
      } else if (u.is(data.token[walk - 1], cc.DOT)) {
        getPeriod();
      }

    };

    function getPeriod () {

      walk = walk - 2;

      if (data.types[walk] === 'end') {
        getEnd();
      } else if (u.is(data.token[walk - 1], cc.DOT)) {
        getPeriod();
      }

    };

    function applyStore () {

      let n: number = 0;

      if (n < store.length) {
        do {
          parse.push(data, store[n], NIL);
          n = n + 1;
        } while (n < store.length);
      }

    };

    function getRecord (index: number) {

      return {
        begin: data.begin[index],
        ender: data.ender[index],
        lexer: data.lexer[index],
        lines: data.lines[index],
        stack: data.stack[index],
        token: data.token[index],
        types: data.types[index]
      };

    };

    tokea = data.token[parse.count];
    tokeb = data.token[parse.count - 1];
    tokec = data.token[parse.count - 2];

    if (tokea !== '++' && tokea !== '--' && tokeb !== '++' && tokeb !== '--') {

      walk = parse.count;

      if (data.types[walk] === 'end') {
        getEnd();
      } else if (u.is(data.token[walk - 1], cc.DOT)) {
        getPeriod();
      }
    }

    if (data.token[walk - 1] === '++' || data.token[walk - 1] === '--') {

      if ('startendoperator'.indexOf(data.types[walk - 2]) > -1) return;

      i = walk;

      if (i < parse.count + 1) {

        do {
          store.push(getRecord(i));
          i = i + 1;
        } while (i < parse.count + 1);

        parse.splice({ data, howmany: parse.count - walk, index: walk });

      }

    } else {

      if (rules.correct === false || (
        tokea !== '++' &&
        tokea !== '--' &&
        tokeb !== '++' &&
        tokeb !== '--'
      )) {
        return; // RETURN EARLY
      }

      next = peek(1, false);

      if ((tokea === '++' || tokea === '--') && (
        u.is(c[a], cc.SEM) ||
        u.is(next, cc.SEM) ||
        u.is(c[a], cc.RCB) ||
        u.is(next, cc.RCB) ||
        u.is(c[a], cc.RPR) ||
        u.is(next, cc.RPR)
      )) {

        toke = data.stack[parse.count];

        if (
          toke === 'array' ||
          toke === 'method' ||
          toke === 'object' ||
          toke === 'paren' ||
          toke === 'notation' || (
            data.token[data.begin[parse.count] - 1] === 'while' &&
             toke !== 'while'
          )
        ) {

          return; // RETURN EARLY

        }

        i = parse.count;

        do {

          i = i - 1;

          if (data.token[i] === 'return') return;
          if (data.types[i] === 'end') {
            do i = data.begin[i] - 1;
            while (data.types[i] === 'end' && i > 0);
          }

        } while (i > 0 && (
          u.is(data.token[i], cc.DOT) ||
          data.types[i] === 'word' ||
          data.types[i] === 'reference' ||
          data.types[i] === 'end'
        ));

        if (
          u.is(data.token[i], cc.COM) &&
          u.not(c[a], cc.SEM) &&
          u.not(next, cc.SEM) &&
          u.not(c[a], cc.RCB) &&
          u.not(next, cc.RCB) &&
          u.not(c[a], cc.RPR) &&
          u.not(next, cc.RPR)
        ) {
          return;
        }

        if (data.types[i] === 'operator') {
          if (data.stack[i] === 'switch' && u.is(data.token[i], cc.COL)) {

            do {

              i = i - 1;

              if (data.types[i] === 'start') {
                ind = ind - 1;
                if (ind < 0) break;
              } else if (data.types[i] === 'end') {
                ind = ind + 1;
              }

              if (u.is(data.token[i], cc.QWS) && ind === 0) return;

            } while (i > 0);

          } else {

            return;
          }
        }

        pre = false;
        toke = tokea === '--' ? '-' : '+';

      } else if (
        u.is(tokec, cc.LSB) ||
        u.is(tokec, cc.SEM) ||
        u.is(tokec, cc.LCB) ||
        u.is(tokec, cc.RCB) ||
        u.is(tokec, cc.LPR) ||
        u.is(tokec, cc.RPR) ||
        u.is(tokec, cc.COM) ||
        tokec === 'return' ||
        tokec === 'x;'
      ) {

        if (tokea === '++' || tokea === '--') {
          if (u.is(tokec, cc.LSB) || u.is(tokec, cc.LPR) || u.is(tokec, cc.COM) || tokec === 'return') return;
          if (tokea === '--') toke = '-';
          pre = false;
        } else if (tokeb === '--' || tokea === '--') {
          toke = '-';
        }
      } else {
        return;
      }

      if (pre === false) tstore = parse.pop(data);

      walk = parse.count;

      if (data.types[walk] === 'end') {
        getEnd();
      } else if (u.is(data.token[walk - 1], cc.DOT)) {
        getPeriod();
      }

      i = walk;

      if (i < parse.count + 1) {
        do {
          store.push(getRecord(i));
          i = i + 1;
        } while (i < parse.count + 1);
      }
    }

    if (pre === true) {
      parse.splice({
        data
        , howmany: 1
        , index: walk - 1
      });

      ltoke = '=';
      ltype = 'operator';
      push();
      applyStore();

      ltoke = toke;
      ltype = 'operator';
      push();

      ltoke = '1';
      ltype = 'number';
      push();

    } else {

      ltoke = '=';
      ltype = 'operator';
      push();
      applyStore();

      ltoke = toke;
      ltype = 'operator';
      push();

      ltoke = '1';
      ltype = 'number';
      push();

    }
    ltoke = data.token[parse.count];
    ltype = data.types[parse.count];

    if (u.is(next, cc.RCB) && u.not(c[a], cc.SEM)) applySemicolon(false);

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
    const qc = option.quoteConvert;

    function cleanUp () {

      let linesSpace = 0;

      build = [];
      ltype = type;
      ee = a;

      if (type === 'string' && u.ws(c[ee + 1])) {

        linesSpace = 1;

        do {
          ee = ee + 1;
          if (u.is(c[ee], cc.NWL)) linesSpace = linesSpace + 1;
        } while (ee < b && u.ws(c[ee + 1]) === true);

        parse.lineOffset = linesSpace;

      }
    };

    function finish () {

      let str = NIL;

      /**
       * Pads certain template tag delimiters with a space
       */
      function bracketSpace (input: string) {

        if (
          parse.language !== 'javascript' &&
          parse.language !== 'typescript' &&
          parse.language !== 'jsx' &&
          parse.language !== 'tsx'
        ) {

          const spaceStart = (start: string) => start.replace(/\s*$/, ' ');
          const spaceEnd = (end: string) => end.replace(/^\s*/, ' ');

          if ((/\{(#|\/|(%>)|(%\]))/).test(input) || (/\}%(>|\])/).test(input)) return input;

          input = input.replace(/\{((\{+)|%-?)\s*/g, spaceStart);
          input = input.replace(/\s*((\}\}+)|(-?%\}))/g, spaceEnd);

          return input;
        }

        return input;
      };

      if (u.is(starting, cc.DQO) && qc === 'single') {

        build[0] = SQO;
        build[build.length - 1] = SQO;

      } else if (u.is(starting, cc.SQO) && qc === 'double') {

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

          ltoke = ltoke
            .replace(/\u0000/g, '\\u0000')
            .replace(/\u0001/g, '\\u0001')
            .replace(/\u0002/g, '\\u0002')
            .replace(/\u0003/g, '\\u0003')
            .replace(/\u0004/g, '\\u0004')
            .replace(/\u0005/g, '\\u0005')
            .replace(/\u0006/g, '\\u0006')
            .replace(/\u0007/g, '\\u0007')
            .replace(/\u0008/g, '\\u0008')
            .replace(/\u0009/g, '\\u0009')
            .replace(/\u000a/g, '\\u000a')
            .replace(/\u000b/g, '\\u000b')
            .replace(/\u000c/g, '\\u000c')
            .replace(/\u000d/g, '\\u000d')
            .replace(/\u000e/g, '\\u000e')
            .replace(/\u000f/g, '\\u000f')
            .replace(/\u0010/g, '\\u0010')
            .replace(/\u0011/g, '\\u0011')
            .replace(/\u0012/g, '\\u0012')
            .replace(/\u0013/g, '\\u0013')
            .replace(/\u0014/g, '\\u0014')
            .replace(/\u0015/g, '\\u0015')
            .replace(/\u0016/g, '\\u0016')
            .replace(/\u0017/g, '\\u0017')
            .replace(/\u0018/g, '\\u0018')
            .replace(/\u0019/g, '\\u0019')
            .replace(/\u001a/g, '\\u001a')
            .replace(/\u001b/g, '\\u001b')
            .replace(/\u001c/g, '\\u001c')
            .replace(/\u001d/g, '\\u001d')
            .replace(/\u001e/g, '\\u001e')
            .replace(/\u001f/g, '\\u001f');

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

          if ((ltoke.length > rules.wrap && rules.wrap > 0) || (
            rules.wrap !== 0 &&
            u.is(data.token[parse.count], cc.PLS) && (
              u.is(data.token[parse.count - 1], cc.DOT) ||
              u.is(data.token[parse.count - 1], cc.SQO)
            )
          )) {

            let item = ltoke;
            let segment = NIL;
            let q = (qc === 'double') ? DQO : (qc === 'single') ? SQO : item.charAt(0);

            const limit = rules.wrap;

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
    if (u.is(c[a - 1], cc.BWS) && esc(a - 1) === true && (u.is(c[a], cc.DQO) || u.is(c[a], cc.SQO))) {

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
          u.not(data.token[0], cc.LSB) &&
          qc !== 'none' && (
            u.is(c[ee], cc.DQO) ||
            u.is(c[ee], cc.SQO)
          )
        ) {

          if (u.is(c[ee - 1], cc.BWS)) {
            if (esc(ee - 1) === true) {
              if (qc === 'double' && u.is(c[ee], cc.SQO)) {
                build.pop();
              } else if (qc === 'single' && u.is(c[ee], cc.DQO)) {
                build.pop();
              }
            }

          } else if (qc === 'double' && u.is(c[ee], cc.DQO) && u.is(c[a], cc.SQO)) {
            c[ee] = DQO;
          } else if (qc === 'single' && u.is(c[ee], cc.SQO) && u.is(c[a], cc.DQO)) {
            c[ee] = SQO;
          }

          build.push(c[ee]);

        } else if (ee > start) {

          ext = true;

          if (u.is(c[ee], cc.LCB) && u.is(c[ee + 1], cc.PER) && c[ee + 2] !== starting) {

            finish();
            parseTokens('{%', '%}', 'liquid');
            cleanUp();

          } else if (u.is(c[ee], cc.LCB) && u.is(c[ee + 1], cc.LCB) && c[ee + 2] !== starting) {

            finish();
            parseTokens('{{', '}}', 'liquid');
            cleanUp();

          } else {
            ext = false;
            build.push(c[ee]);
          }

        } else {

          build.push(c[ee]);
        }

        if (
          parse.language !== 'json' &&
          parse.language !== 'javascript' &&
          (u.is(starting, cc.DQO) || u.is(starting, cc.SQO)) &&
          (ext === true || ee > start) &&
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
   * Inserts ending curly brace (where absent)
   */
  function applyBrace () {

    let name = NIL;

    const next = peek(5, false);
    const g = parse.count;
    const lines = parse.lineOffset;

    if (
      parse.language === 'json' ||
      brace.length < 1 ||
      brace[brace.length - 1].charAt(0) !== 'x' ||
      (/^x?(;|\}|\))$/).test(ltoke) === false
    ) {

      return;
    }

    if (data.stack[parse.count] === 'do' && next === 'while' && u.is(data.token[parse.count], cc.RCB)) {
      return;
    }

    if (u.is(ltoke, cc.SEM) && data.token[g - 1] === 'x{') {

      name = data.token[data.begin[g - 2] - 1];

      if (data.token[g - 2] === 'do' || (u.is(data.token[g - 2], cc.RPR) && 'ifforwhilecatch'.indexOf(name) > -1)) {

        tstore = parse.pop(data);
        ltoke = rules.correct === true ? '}' : 'x}';
        ltype = 'end';
        pstack = parse.stack.entry;
        push();
        brace.pop();
        parse.lineOffset = lines;
        return;
      }

      // to prevent the semicolon from inserting between the braceAllman --> while (x) {};
      tstore = parse.pop(data);
      ltoke = rules.correct === true ? '}' : 'x}';
      ltype = 'end';
      pstack = parse.stack.entry;

      push();
      brace.pop();

      ltoke = ';';
      ltype = 'end';

      parse.push(data, tstore, NIL);
      parse.lineOffset = lines;

      return;
    }

    ltoke = rules.correct === true ? '}' : 'x}';
    ltype = 'end';

    if (data.token[parse.count] === 'x}') return;

    if (next === 'else' && data.stack[parse.count] === 'if' && (
      u.is(data.token[parse.count], cc.SEM) ||
      data.token[parse.count] === 'x;'
    )) {

      pstack = parse.stack.entry;
      push();
      brace.pop();
      parse.lineOffset = lines;

      return;
    }

    do {

      pstack = parse.stack.entry;
      push();
      brace.pop();

      if (data.stack[parse.count] === 'do') break;

    } while (brace[brace.length - 1] === 'x{');

    parse.lineOffset = lines;

  };

  /**
   * Ensures that commas immediately precede comments
   * instead of immediately follow
   */
  function getCommaComment () {

    let x = parse.count;

    if (data.stack[x] === 'object' && option.objectSort === true) {

      ltoke = ',';
      ltype = 'separator';
      cleanSemicolon();
      push();

    } else {

      do { x = x - 1; } while (x > 0 && data.types[x - 1] === 'comment');

      parse.splice({
        data
        , howmany: 0
        , index: x
        , record: {
          begin: data.begin[x]
          , ender: -1
          , lexer: 'script'
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

    let insert = false;
    let newarr = false;

    const next = peek(1, false);
    const count = u.is(data.token[parse.count], cc.LPR) ? parse.count : data.begin[parse.count];

    function newarray () {

      let arraylen = 0;

      const ar = data.token[count - 1] === 'Array';
      const startar = ar ? '[' : '{';
      const endar = ar ? ']' : '}';
      const namear = ar ? 'array' : 'object';

      if (ar === true && data.types[parse.count] === 'number') {
        arraylen = Number(data.token[parse.count]);
        tstore = parse.pop(data);
      }

      tstore = parse.pop(data);
      tstore = parse.pop(data);
      tstore = parse.pop(data);

      parse.stack.pop();

      ltoke = startar;
      ltype = 'start';

      push(namear);

      if (arraylen > 0) {

        ltoke = ',';
        ltype = 'separator';

        do {
          push();
          arraylen = arraylen - 1;
        } while (arraylen > 0);
      }

      ltoke = endar;
      ltype = 'end';

      push();

    };

    if (wtest > -1) word();

    if (classy.length > 0) {

      if (classy[classy.length - 1] === 0) {
        classy.pop();
      } else {
        classy[classy.length - 1] = classy[classy.length - 1] - 1;
      }
    }

    if (u.is(x, cc.RPR) || x === 'x)' || u.is(x, cc.RSB)) {
      if (rules.correct === true) parseLogical();
      cleanSemicolon();
    }

    if (u.is(x, cc.RPR) || x === 'x)') applySemicolon(false);

    if (v > -1) {
      if (u.is(x, cc.RCB) && (
        (option.variableList === 'list' && vstore.count[v] === 0) ||
        (data.token[parse.count] === 'x;' && option.variableList === 'each')
      )) {

        pop();
      }

      vstore.count[v] = vstore.count[v] - 1;

      if (vstore.count[v] < 0) pop();

    }

    if (u.is(ltoke, cc.COM) &&
      data.stack[parse.count] !== 'initializer' && (
      (u.is(x, cc.RSB) && u.is(data.token[parse.count - 1], cc.LSB)) ||
      (u.is(x, cc.RCB))
    )) {

      tstore = parse.pop(data);
    }

    if (u.is(x, cc.RPR) || x === 'x)') {

      ltoke = x;

      if (lword.length > 0) {

        pword = lword[lword.length - 1];

        if (pword.length > 1 &&
          u.not(next, cc.LCB) && (
          pword[0] === 'if' ||
            pword[0] === 'for' ||
            pword[0] === 'with' || (
            pword[0] === 'while' &&
              data.stack[pword[1] - 2] !== undefined &&
              data.stack[pword[1] - 2] !== 'do'
          )
        )) {

          insert = true;
        }
      }

    } else if (u.is(x, cc.RSB)) {

      ltoke = ']';

    } else if (u.is(x, cc.RCB)) {

      if (u.not(ltoke, cc.COM) && rules.correct === true) {
        parseLogical();
      }

      if (parse.stack.length > 0 && parse.stack.token !== 'object') {
        applySemicolon(true);
      }

      if (option.objectSort === true && parse.stack.token === 'object') {
        sortObject(data);
      }

      if (ltype === 'comment') {
        ltoke = data.token[parse.count];
        ltype = data.types[parse.count];
      }

      ltoke = '}';
    }

    if (parse.stack.token === 'data_type') {
      ltype = 'type_end';
    } else {
      ltype = 'end';
    }

    lword.pop();
    pstack = parse.stack.entry;

    if (
      u.is(x, cc.RPR) &&
      rules.correct === true &&
      count - parse.count < 2 && (
        u.is(data.token[parse.count], cc.LPR) ||
        data.types[parse.count] === 'number'
      ) && (
        data.token[count - 1] === 'Array' ||
        data.token[count - 1] === 'Object'
      ) && data.token[count - 2] === 'new'
    ) {

      newarray();
      newarr = true;
    }

    if (brace[brace.length - 1] === 'x{' && u.is(x, cc.RCB)) {

      applyBrace();
      brace.pop();

      if (data.stack[parse.count] !== 'try') {
        if (u.not(next, cc.COL) && u.not(next, cc.SEM) && data.token[data.begin[a] - 1] !== '?') applyBrace();
      }

      ltoke = '}';

    } else {

      brace.pop();
    }

    // rules.endComma
    if (
      option.endComma !== undefined &&
      option.endComma !== 'none' &&
      parse.stack.token === 'array' ||
      parse.stack.token === 'object' ||
      parse.stack.token === 'data_type'
    ) {

      if (option.endComma === 'always' && u.not(data.token[parse.count], cc.COM)) {

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

      } else if (option.endComma === 'never' && u.is(data.token[parse.count], cc.COM)) {

        parse.pop(data);
      }
    }

    if (newarr === false) {
      push();
      if (
        u.is(ltoke, cc.RCB) &&
        data.stack[parse.count] !== 'object' &&
        data.stack[parse.count] !== 'class' &&
        data.stack[parse.count] !== 'data_type'
      ) {
        references.pop();
        applyBrace();
      }
    }

    if (insert === true) {

      ltoke = rules.correct === true ? '{' : 'x{';
      ltype = 'start';

      push(pword[0]);

      brace.push('x{');
      pword[1] = parse.count;
    }

    tstype.pop();

    if (parse.stack.token !== 'data_type') tstype[tstype.length - 1] = false;

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
    let wordy = NIL;
    let stack = NIL;
    let func = false;

    brace.push(x);

    if (u.is(x, cc.LCB) && (
      data.types[parse.count] === 'type' ||
      data.types[parse.count] === 'type_end' ||
      data.types[parse.count] === 'generic'
    )) {

      /**
       * This block determines if a function body follows a type annotation
       */
      let begin: number = 0;

      if (data.types[parse.count] === 'type_end') aa = data.begin[parse.count];

      begin = aa;

      do {
        aa = aa - 1;
        if (data.begin[aa] !== begin && data.begin[aa] !== -1) break;
        if (u.is(data.token[aa], cc.COL)) break;
      } while (aa > data.begin[aa]);

      if (u.is(data.token[aa], cc.COL) && data.stack[aa - 1] === 'arguments') {

        tstype.push(false);
        func = true;

      } else {

        tstype.push(tstype[tstype.length - 1]);
      }

      aa = parse.count;

    } else if (u.is(x, cc.LSB) && data.types[parse.count] === 'type_end') {

      tstype.push(true);

    } else {

      tstype.push(tstype[tstype.length - 1]);
    }

    if (wtest > -1) {
      word();
      aa = parse.count;
    }

    if (v > -1) vstore.count[v] = vstore.count[v] + 1;

    if (data.token[aa - 1] === 'function') {
      lword.push([ 'function', aa + 1 ]);
    } else {
      lword.push([ ltoke, aa + 1 ]);
    }

    ltoke = x;

    if (tstype[tstype.length - 1] === true) {
      ltype = 'type_start';
    } else {
      ltype = 'start';
    }

    if (u.is(x, cc.LPR) || x === 'x(') {

      cleanSemicolon();

    } else if (u.is(x, cc.LSB)) {

      if (paren > -1) {
        if (
          data.begin[paren - 1] === data.begin[data.begin[aa] - 1] ||
          data.token[data.begin[aa]] === 'x('
        ) {

          paren = -1;

          if (rules.correct === true) {
            end(')');
          } else {
            end('x)');
          }

          cleanSemicolon();

          ltoke = '{';
          ltype = 'start';
        }

      } else if (u.is(ltoke, cc.RPR)) {

        cleanSemicolon();
      }

      if (ltype === 'comment' && u.is(data.token[aa - 1], cc.RPR)) {

        ltoke = data.token[aa];
        data.token[aa] = '{';

        ltype = data.types[aa];
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

    wordy = (data.stack[aa] === undefined) ? NIL : (() => {

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

      if (u.is(data.token[bb], cc.COL) && data.stack[bb - 1] === 'arguments') {
        stack = 'function';
        references.push(fnrefs);
        fnrefs = [];
      }
    }

    if (ltype === 'type_start') {

      stack = 'data_type';

    } else if (stack === NIL && (u.is(ltoke, cc.LCB) || ltoke === 'x{')) {

      if (
        wordx === 'else' ||
        wordx === 'do' ||
        wordx === 'try' ||
        wordx === 'finally' ||
        wordx === 'switch'
      ) {

        stack = wordx;
      } else if (
        classy[classy.length - 1] === 0 &&
        wordx !== 'return'
      ) {

        classy.pop();
        stack = 'class';

      } else if (data.token[aa - 1] === 'class') {

        stack = 'class';

      } else if (u.is(data.token[aa], cc.RSB) && u.is(data.token[aa - 1], cc.LSB)) {

        stack = 'array';

      } else if (
        (
          data.types[aa] === 'word' ||
          data.types[aa] === 'reference'
        ) && (
          data.types[aa - 1] === 'word' ||
          data.types[aa - 1] === 'reference' || (
            data.token[aa - 1] === '?' && (
              data.types[aa - 2] === 'word' ||
              data.types[aa - 2] === 'reference'
            )
          )
        ) &&
        data.token[aa] !== 'in' &&
        data.token[aa - 1] !== 'export' &&
        data.token[aa - 1] !== 'import'
      ) {

        stack = 'map';

      } else if (
        data.stack[aa] === 'method' &&
        data.types[aa] === 'end' &&
        (data.types[data.begin[aa] - 1] === 'word' || data.types[data.begin[aa] - 1] === 'reference') &&
        data.token[data.begin[aa] - 2] === 'new'
      ) {

        stack = 'initializer';

      } else if (
        u.is(ltoke, cc.LCB) && (
          u.is(wordx, cc.RPR) ||
          wordx === 'x)'
        ) && (
          data.types[data.begin[aa] - 1] === 'word' ||
          data.types[data.begin[aa] - 1] === 'reference' ||
          data.token[data.begin[aa] - 1] === ']'
        )
      ) {

        if (wordy === 'if') {
          stack = 'if';
        } else if (wordy === 'for') {
          stack = 'for';
        } else if (wordy === 'while') {
          stack = 'while';
        } else if (wordy === 'class') {
          stack = 'class';
        } else if (wordy === 'switch' || data.token[data.begin[aa] - 1] === 'switch') {
          stack = 'switch';
        } else if (wordy === 'catch') {
          stack = 'catch';
        } else {
          stack = 'function';
        }

      } else if (u.is(ltoke, cc.LCB) && (u.is(wordx, cc.SEM) || wordx === 'x;')) {

        // ES6 block
        stack = 'block';

      } else if (
        u.is(ltoke, cc.LCB) &&
        u.is(data.token[aa], cc.COL) &&
        data.stack[aa] === 'switch'
      ) {

        // ES6 block
        stack = 'block';

      } else if (
        data.token[aa - 1] === 'import' ||
        data.token[aa - 2] === 'import' ||
        data.token[aa - 1] === 'export' ||
        data.token[aa - 2] === 'export'
      ) {

        stack = 'object';

      } else if (
        u.is(wordx, cc.RPR) &&
        (
          pword[0] === 'function' ||
          pword[0] === 'if' ||
          pword[0] === 'for' ||
          pword[0] === 'class' ||
          pword[0] === 'while' ||
          pword[0] === 'switch' ||
          pword[0] === 'catch'
        )
      ) {

        // if preceeded by a paren the prior containment is preceeded by a keyword if
        // (...) {
        stack = pword[0];

      } else if (data.stack[aa] === 'notation') {

        // if following a TSX array type declaration
        stack = 'function';

      } else if ((
        data.types[aa] === 'number' ||
        data.types[aa] === 'string' ||
        data.types[aa] === 'word' ||
        data.types[aa] === 'reference'
      ) && (
        data.types[aa - 1] === 'word' ||
        data.types[aa - 1] === 'reference'
      ) && data.token[data.begin[aa] - 1] !== 'for') {

        // if preceed by a word and either string or word public class {
        stack = 'function';

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

      } else if (func === true || (
        data.types[parse.count] === 'type_end' &&
        data.stack[data.begin[parse.count] - 2] === 'arguments')
      ) {

        // working around typescript inline interface
        stack = 'function';

      } else if (
        u.is(wordx, cc.RPR) &&
        data.stack[aa] === 'method' &&
        (
          data.types[data.begin[aa] - 1] === 'word' ||
          data.types[data.begin[aa] - 1] === 'property' ||
          data.types[data.begin[aa] - 1] === 'reference'
        )
      ) {

        stack = 'function';

      } else if (
        u.is(ltoke, cc.LCB) &&
        data.types[aa] === 'word' &&
        data.token[aa] !== 'return' &&
        data.token[aa] !== 'in' &&
        data.token[aa] !== 'import' &&
        data.token[aa] !== 'const' &&
        data.token[aa] !== 'let' &&
        data.token[aa] !== NIL
      ) {

        // ES6 block
        stack = 'block';

      } else if (
        u.is(ltoke, cc.LCB) &&
        'if|else|for|while|function|class|switch|catch|finally'.indexOf(data.stack[aa]) > -1 && (
          data.token[aa] === 'x}' ||
          u.is(data.token[aa], cc.RCB)
        )
      ) {

        // ES6 block
        stack = 'block';

      } else if (data.stack[aa] === 'arguments') {

        stack = 'function';

      } else if (data.types[aa] === 'generic') {

        do {
          aa = aa - 1;

          if (data.token[aa] === 'function' || data.stack[aa] === 'arguments') {
            stack = 'function';
            break;
          }

          if (data.token[aa] === 'interface') {
            stack = 'map';
            break;
          }

          if (u.is(data.token[aa], cc.SEM)) {
            stack = 'object';
            break;
          }

        } while (aa > data.begin[parse.count]);

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

    } else if (u.is(ltoke, cc.LPR) || ltoke === 'x(') {

      if (
        wordx === 'function' ||
        data.token[aa - 1] === 'function' ||
        data.token[aa - 1] === 'function*' ||
        data.token[aa - 2] === 'function'
      ) {

        stack = 'arguments';

      } else if (
        u.is(data.token[aa - 1], cc.DOT) ||
        u.is(data.token[data.begin[aa] - 2], cc.DOT)
      ) {

        stack = 'method';

      } else if (data.types[aa] === 'generic') {

        stack = 'method';

      } else if (
        u.is(data.token[aa], cc.RCB) &&
        data.stack[aa] === 'function'
      ) {

        stack = 'method';

      } else if (
        wordx === 'if' ||
        wordx === 'for' ||
        wordx === 'class' ||
        wordx === 'while' ||
        wordx === 'catch' ||
        wordx === 'finally' ||
        wordx === 'switch' ||
        wordx === 'with'
      ) {

        stack = 'expression';

      } else if (
        data.types[aa] === 'word' ||
        data.types[aa] === 'property' ||
        data.types[aa] === 'reference'
      ) {

        stack = 'method';

      } else {

        stack = 'paren';
      }
    }

    push(stack);

    if (classy.length > 0) classy[classy.length - 1] = classy[classy.length - 1] + 1;

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
    let next = NIL;
    let tokel = ltoke;
    let typel = ltype;

    const lex = [];

    function elsefix () {

      brace.push('x{');

      parse.splice({
        data
        , howmany: 1
        , index: parse.count - 3
      });
    };

    function hoisting (index: number, ref: string, samescope: boolean) {

      const begin = data.begin[index];

      let parent = 0;

      do {
        if (data.token[index] === ref && data.types[index] === 'word') {
          if (samescope === true) {

            // the simple state is for hoisted references, var and function declarations
            data.types[index] = 'reference';

          } else if (
            data.begin[index] > begin &&
            data.token[data.begin[index]] === '{' &&
            data.stack[index] !== 'object' &&
            data.stack[index] !== 'class' &&
            data.stack[index] !== 'data_type'
          ) {

            // the complex state is for non-hoisted references living
            // in prior functions of the same parent scope
            if (data.stack[index] === 'function') {

              data.types[index] = 'reference';

            } else {

              // this looping is necessary to determine if there is a function
              // between the reference and the declared scope
              parent = data.begin[index];

              do {

                if (data.stack[parent] === 'function') {
                  data.types[index] = 'reference';
                  break;
                }

                parent = data.begin[parent];

              } while (parent > begin);
            }
          }
        }

        index = index - 1;

      } while (index > begin);

    };

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

    if (
      parse.count > 0 &&
      output === 'function' &&
      u.is(data.token[parse.count], cc.LPR) && (
        u.is(data.token[parse.count - 1], cc.LCB) ||
        data.token[parse.count - 1] === 'x{'
      )
    ) {

      data.types[parse.count] = 'start';
    }

    if (
      parse.count > 1 &&
      output === 'function' &&
      u.is(ltoke, cc.LPR) && (
        u.is(data.token[parse.count - 1], cc.RCB) ||
        data.token[parse.count - 1] === 'x}'
      )
    ) {

      if (u.is(data.token[parse.count - 1], cc.RCB)) {

        f = parse.count - 2;

        if (f > -1) {

          do {

            if (data.types[f] === 'end') {
              g = g + 1;
            } else if (data.types[f] === 'start' || data.types[f] === 'end') {
              g = g - 1;
            }

            if (g === 0) break;
            f = f - 1;

          } while (f > -1);
        }

        if (u.is(data.token[f], cc.LCB) && u.is(data.token[f - 1], cc.RPR)) {

          g = 1;
          f = f - 2;

          if (f > -1) {
            do {

              if (data.types[f] === 'end') {
                g = g + 1;
              } else if (data.types[f] === 'start' || data.types[f] === 'end') {
                g = g - 1;
              }

              if (g === 0) break;

              f = f - 1;

            } while (f > -1);
          }

          if (data.token[f - 1] !== 'function' && data.token[f - 2] !== 'function') {
            data.types[parse.count] = 'start';
          }
        }
      } else {
        data.types[parse.count] = 'start';
      }
    }

    if (
      rules.correct === true && (output === 'Object' || output === 'Array') &&
      u.is(c[a + 1], cc.LPR) &&
      u.is(c[a + 2], cc.RPR) &&
      u.is(data.token[parse.count - 1], cc.EQS) &&
      data.token[parse.count] === 'new'
    ) {

      if (output === 'Object') {
        data.token[parse.count] = '{';
        ltoke = '}';
        data.stack[parse.count] = 'object';
        parse.stack.update('object');
      } else {
        data.token[parse.count] = '[';
        ltoke = ']';
        data.stack[parse.count] = 'array';
        parse.stack.update('array');
      }

      data.types[parse.count] = 'start';

      ltype = 'end';
      c[a + 1] = NIL;
      c[a + 2] = NIL;
      a = a + 2;

    } else {

      g = parse.count;
      f = g;

      if (
        option.variableList !== 'none' && (
          output === 'var' ||
          output === 'let' ||
          output === 'const'
        )
      ) {

        if (data.types[g] === 'comment') {

          do { g = g - 1; } while (g > 0 && (data.types[g] === 'comment'));
        }

        if (
          option.variableList === 'list' &&
          v > -1 &&
          vstore.index[v] === g &&
          output === vstore.word[v]
        ) {

          ltoke = ',';
          ltype = 'separator';
          data.token[g] = ltoke;
          data.types[g] = ltype as any;
          vstore.count[v] = 0;
          vstore.index[v] = g;
          vstore.word[v] = output;
          return;
        }

        v = v + 1;

        vstore.count.push(0);
        vstore.index.push(g);
        vstore.word.push(output);

        g = f;

      } else if (
        v > -1 &&
        output !== vstore.word[v] &&
        parse.count === vstore.index[v] &&
        u.is(data.token[vstore.index[v]], cc.SEM) &&
        ltoke !== vstore.word[v] &&
        option.variableList === 'list'
      ) {

        pop();
      }

      if (
        output === 'from' &&
        data.token[parse.count] === 'x;' &&
        u.is(data.token[parse.count - 1], cc.RCB)
      ) {

        cleanSemicolon();
      }

      if (output === 'while' && data.token[parse.count] === 'x;' && u.is(data.token[parse.count - 1], cc.RCB)) {

        let d = 0;
        let e = parse.count - 2;

        if (e > -1) {

          do {

            if (data.types[e] === 'end') {
              d = d + 1;
            } else if (data.types[e] === 'start') {
              d = d - 1;
            }

            if (d < 0) {
              if (u.is(data.token[e], cc.LCB) && data.token[e - 1] === 'do') cleanSemicolon();
              return;
            }

            e = e - 1;

          } while (e > -1);
        }
      }

      if (typel === 'comment') {

        let d = parse.count;

        do d = d - 1;
        while (d > 0 && data.types[d] === 'comment');

        typel = data.types[d];
        tokel = data.token[d];
      }

      next = peek(2, false);

      if (output === 'void') {

        if (tokel === ':' && data.stack[parse.count - 1] === 'arguments') {
          ltype = 'type';
        } else {
          ltype = 'word';
        }

      } else if ((
        parse.stack.token === 'object' ||
        parse.stack.token === 'class' ||
        parse.stack.token === 'data_type'
      ) && (
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

        if (output === 'return' || output === 'break') {
          ltype = 'word';
        } else {
          ltype = 'property';
        }

      } else if (
        tstype[tstype.length - 1] === true ||
        ((parse.language === 'typescript' || parse.language === 'flow') && tokel === 'type')
      ) {

        ltype = 'type';

      } else if (references.length > 0 && (
        tokel === 'function' ||
        tokel === 'class' ||
        tokel === 'const' ||
        tokel === 'let' ||
        tokel === 'var' ||
        tokel === 'new' ||
        tokel === 'void'
      )) {

        ltype = 'reference';
        references[references.length - 1].push(output);

        if (
          parse.language === 'javascript' ||
          parse.language === 'jsx' ||
          parse.language === 'typescript' ||
          parse.language === 'tsx' // originally was "flow" changed to TSX
        ) {

          if (tokel === 'var' || (
            tokel === 'function' &&
            data.types[parse.count - 1] !== 'operator' &&
            data.types[parse.count - 1] !== 'start' &&
            data.types[parse.count - 1] !== 'end'
          )) {
            hoisting(parse.count, output, true);
          } else {
            hoisting(parse.count, output, false);
          }

        } else {
          hoisting(parse.count, output, false);
        }

      } else if (parse.stack.token === 'arguments' && ltype !== 'operator') {

        ltype = 'reference';
        fnrefs.push(output);

      } else if (
        u.is(tokel, cc.COM) &&
        data.stack[parse.count] !== 'method' && (
          data.stack[parse.count] !== 'expression' ||
          data.token[data.begin[parse.count] - 1] === 'for'
        )
      ) {

        let d = parse.count;
        const e = parse.stack.index;

        do {
          if (data.begin[d] === e) {

            if (data.token[d] === ';') break;
            if (
              data.token[d] === 'var' ||
              data.token[d] === 'let' ||
              data.token[d] === 'const' ||
              data.token[d] === 'type'
            ) {

              break;
            }

          } else if (data.types[d] === 'end') {
            d = data.begin[d];
          }

          d = d - 1;

        } while (d > e);

        if (references.length > 0 && data.token[d] === 'var') {

          ltype = 'reference';
          references[references.length - 1].push(output);

          if (
            parse.language === 'javascript' ||
            parse.language === 'jsx' ||
            parse.language === 'typescript' ||
            parse.language === 'tsx' // originally was "flow" changed to TSX
          ) {
            hoisting(d, output, true);
          } else {
            hoisting(d, output, false);
          }

        } else if (references.length > 0 && (
          data.token[d] === 'let' ||
          data.token[d] === 'const' ||
          (data.token[d] === 'type' && (
            parse.language === 'typescript' ||
            parse.language === 'tsx' // originally was "flow" changed to TSX
          ))
        )) {

          ltype = 'reference';
          references[references.length - 1].push(output);
          hoisting(d, output, false);

        } else {

          ltype = 'word';
        }

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

          if (references[d][e] === output && tokel !== '.') {
            ltype = 'reference';
          } else {
            ltype = 'word';
          }

        } else {
          ltype = 'word';
        }

      } else {
        ltype = 'word';
      }

      ltoke = output;

      if (output === 'from' && data.token[parse.count] === '}') cleanSemicolon();

    }

    push();

    if (output === 'class') classy.push(0);
    if (output === 'do') {

      next = peek(1, true);

      if (next !== '{') {

        ltoke = (rules.correct === true) ? '{' : 'x{';
        ltype = 'start';

        brace.push('x{');
        push('do');

      }
    }

    if (output === 'else') {

      next = peek(2, true);
      let x = parse.count - 1;

      if (data.types[x] === 'comment') {
        do { x = x - 1; } while (x > 0 && data.types[x] === 'comment');
      }

      if (data.token[x] === 'x}') {
        if (data.token[parse.count] === 'else') {

          if (
            data.stack[parse.count - 1] !== 'if' &&
            data.types[parse.count - 1] !== 'comment' &&
            data.stack[parse.count - 1] !== 'else'
          ) {

            brace.pop();
            parse.splice({
              data,
              howmany: 0,
              index: parse.count - 1,
              record: {
                begin: data.begin[data.begin[data.begin[parse.count - 1] - 1] - 1],
                ender: -1,
                lexer: 'script',
                lines: 0,
                stack: 'if',
                token: (rules.correct === true) ? '}' : 'x}',
                types: 'end'
              }
            });

            if (parse.stack.length > 1) {
              parse.stack.splice(parse.stack.length - 2, 1);
              parse.stack.update(parse.count);
            }

          } else if (
            data.token[parse.count - 2] === 'x}' &&
            pstack[0] !== 'if' &&
            data.stack[parse.count] === 'else'
          ) {

            elsefix();

          } else if (
            data.token[parse.count - 2] === '}' &&
            data.stack[parse.count - 2] === 'if' &&
            pstack[0] === 'if' &&
            data.token[pstack[1] - 1] !== 'if' &&
            data.token[data.begin[parse.count - 1]] === 'x{'
          ) {

            // fixes when "else" is following a block that isn't "if"
            elsefix();
          }

        } else if (data.token[parse.count] === 'x}' && data.stack[parse.count] === 'if') {
          elsefix();
        }
      }

      if (next !== 'if' && u.not(next, cc.LCB)) {
        ltoke = (rules.correct === true) ? '{' : 'x{';
        ltype = 'start';
        brace.push('x{');
        push('else');
      }
    }

    if ((
      output === 'for' ||
      output === 'if' ||
      output === 'switch' ||
      output === 'catch'
    ) && data.token[parse.count - 1] !== '.') {

      next = peek(1, true);

      if (next !== '(') {
        paren = parse.count;
        if (rules.correct === true) {
          start('(');
        } else {
          start('x(');
        }
      }
    }

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

        applySemicolon(false);
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

    } else if (u.is(c[a], cc.LAN)) {

      // markup
      parseMarkup();

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

    } else if (u.is(c[a], cc.TQO) || (u.is(c[a], cc.RCB) && parse.stack.token === 'template_string')) {

      // template string
      if (wtest > -1) word();

      ltoke = parseLiteral();

      if (u.is(ltoke, cc.RCB) && ltoke.slice(ltoke.length - 2) === '${') {

        ltype = 'template_string_else';
        push('template_string');

      } else if (ltoke.slice(ltoke.length - 2) === '${') {

        ltype = 'template_string_start';
        push('template_string');

      } else if (u.is(ltoke[0], cc.RCB)) {

        ltype = 'template_string_end';
        push();

      } else {

        ltype = 'string';
        push();
      }

    } else if (u.is(c[a], cc.DQO) || u.is(c[a], cc.SQO)) {

      // string
      parseTokens(c[a], c[a], 'string');

    } else if (
      u.is(c[a], cc.DSH) && (
        a < b - 1 &&
        u.not(c[a + 1], cc.EQS) &&
        u.not(c[a + 1], cc.DSH)
      ) && (
        ltype === 'number' ||
        ltype === 'word' ||
        ltype === 'reference'
      ) &&
        ltoke !== 'return' && (
        ltype === 'word' ||
        ltype === 'reference' ||
        ltype === 'number' ||
        u.is(ltoke, cc.RPR) ||
        u.is(ltoke, cc.RSB)
      )
    ) {

      // subtraction
      if (wtest > -1) word();

      ltoke = '-';
      ltype = 'operator';

      push();

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

    } else if (u.is(c[a], cc.COL) && u.is(c[a + 1], cc.COL)) {

      if (wtest > -1) word();
      if (rules.correct === true) parseLogical();

      cleanSemicolon();

      a = a + 1;
      ltoke = '::';
      ltype = 'separator';

      push();

    } else if (u.is(c[a], cc.COM)) {

      // comma
      if (wtest > -1) word();
      if (rules.correct === true) parseLogical();

      if (
        tstype[tstype.length - 1] === true &&
        data.stack[parse.count].indexOf('type') < 0
      ) {

        tstype[tstype.length - 1] = false;
      }

      if (ltype === 'comment') {

        getCommaComment();

      } else if (
        v > -1 &&
        vstore.count[v] === 0 &&
        option.variableList === 'each'
      ) {

        cleanSemicolon();

        ltoke = ';';
        ltype = 'separator';

        push();

        ltoke = vstore.word[v];
        ltype = 'word';

        push();

        vstore.index[v] = parse.count;

      } else {

        ltoke = ',';
        ltype = 'separator';

        cleanSemicolon();

        push();

      }

    } else if (u.is(c[a], cc.DOT)) {

      // getPeriod
      if (wtest > -1) word();

      tstype[tstype.length - 1] = false;

      if (u.is(c[a + 1], cc.DOT) && u.is(c[a + 2], cc.DOT)) {

        ltoke = '...';
        ltype = 'operator';

        a = a + 2;

      } else {

        cleanSemicolon();
        ltoke = '.';
        ltype = 'separator';
      }

      if (u.ws(c[a - 1])) parse.lineOffset = 1;

      push();

    } else if (u.is(c[a], cc.SEM)) {

      // semicolon
      if (wtest > -1) word();

      if (
        tstype[tstype.length - 1] === true &&
        data.stack[parse.count].indexOf('type') < 0
      ) {

        tstype[tstype.length - 1] = false;
      }

      if (classy[classy.length - 1] === 0) classy.pop();
      if (v > -1 && vstore.count[v] === 0) {

        if (option.variableList === 'each') {
          pop();
        } else {
          vstore.index[v] = parse.count + 1;
        }
      }

      if (rules.correct === true) parseLogical();

      ltoke = ';';
      ltype = 'separator';

      if (data.token[parse.count] === 'x}') {
        braceSemicolon();
      } else {
        push();
      }

      applyBrace();

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

    } else if (
      u.is(c[a], cc.EQS) ||
      u.is(c[a], cc.AND) ||
      u.is(c[a], cc.LAN) ||
      u.is(c[a], cc.RAN) ||
      u.is(c[a], cc.PLS) ||
      u.is(c[a], cc.DSH) ||
      u.is(c[a], cc.ARS) ||
      u.is(c[a], cc.FWS) ||
      u.is(c[a], cc.BNG) ||
      u.is(c[a], cc.QWS) ||
      u.is(c[a], cc.PIP) ||
      u.is(c[a], cc.UPP) ||
      u.is(c[a], cc.COL) ||
      u.is(c[a], cc.PER) ||
      u.is(c[a], cc.SDH)
    ) {

      // operator
      ltoke = parseOperator();

      if (ltoke === 'regex') {

        ltoke = data.token[parse.count];

      } else if (u.is(ltoke, cc.ARS) && data.token[parse.count] === 'function') {

        data.token[parse.count] = 'function*';

      } else {

        ltype = 'operator';

        if (u.not(ltoke, cc.BNG) && ltoke !== '++' && ltoke !== '--') cleanSemicolon();

        push();

      }

    } else if (wtest < 0 && c[a] !== NIL) {

      wtest = a;
    }

    if (
      v > -1 &&
      parse.count === vstore.index[v] + 1 &&
      u.is(data.token[vstore.index[v]], cc.SEM) &&
      ltoke !== vstore.word[v] &&
      ltype !== 'comment' &&
      option.variableList === 'list'
    ) {

      pop();
    }

    a = a + 1;

  } while (a < b);

  if (wtest > -1) word();

  if ((
    (
      u.not(data.token[parse.count], cc.RCB) &&
      u.is(data.token[0], cc.LCB)
    ) ||
     u.not(data.token[0], cc.LCB)
  ) && (
    (
      u.not(data.token[parse.count], cc.RSB) &&
      u.is(data.token[0], cc.LSB)
    ) ||
      u.not(data.token[0], cc.LSB)
  )) {

    applySemicolon(false);

  }

  if (sourcemap[0] === parse.count) {
    ltoke = NWL + sourcemap[1];
    ltype = 'string';
    push();
  }

  if (data.token[parse.count] === 'x;' && (
    u.is(data.token[parse.count - 1], cc.RCB) ||
    u.is(data.token[parse.count - 1], cc.RSB)
  ) && data.begin[parse.count - 1] === 0) {

    parse.pop(data);
  }

  if (option.objectSort && data.begin.length > 0) {
    sortCorrect(0, parse.count + 1);
  }

  // console.log(data);
  return data;

};
