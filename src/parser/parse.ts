/* eslint no-unmodified-loop-condition: "off" */
import type { Data, Types, Record, IParse, Structure, Spacer, WrapComment, Splice } from 'types/prettify';
import { prettify } from '@prettify/model';
import { isArray } from '@utils/native';
import { cc, NIL, NWL, WSP } from '@utils/chars';
import { is, safeSortAscend, safeSortDescend, safeSortNormal, sanitizeComment, ws } from '@utils/helpers';
import { StripEnd, StripLead } from '@utils/regex';

export const parse = new class Parse implements IParse {

  public datanames = [
    'begin',
    'ender',
    'lexer',
    'lines',
    'stack',
    'token',
    'types'
  ];

  public data: Data = {
    begin: [],
    ender: [],
    lexer: [],
    lines: [],
    stack: [],
    token: [],
    types: []
  };

  public structure: Structure[] = [
    [
      'global', -1
    ]
  ];

  public references = [ [] ];
  public count = -1;
  public lineNumber = 1;
  public linesSpace = 0;
  public error = NIL;

  /**
   * Returns the last known record within `data` set.
   * This is typically going to be the current item in
   * sequence, ie: the previus record before `push` is executed.
   */
  get current () {

    const {
      begin,
      ender,
      lexer,
      lines,
      stack,
      token,
      types
    } = this.data;

    return {
      begin: begin[begin.length - 1],
      ender: ender[ender.length - 1],
      lexer: lexer[lexer.length - 1],
      lines: lines[lines.length - 1],
      stack: stack[stack.length - 1],
      token: token[begin.length - 1],
      types: types[begin.length - 1]
    };

  }

  init () {

    this.error = NIL;
    this.count = -1;
    this.linesSpace = 0;
    this.lineNumber = 1;
    this.references = [ [] ];

    this.data.begin = [];
    this.data.ender = [];
    this.data.lexer = [];
    this.data.lines = [];
    this.data.stack = [];
    this.data.token = [];
    this.data.types = [];

    this.structure = [ [ 'global', -1 ] ];
    this.structure.pop = () => {
      const len = this.structure.length - 1;
      const arr = this.structure[len];
      if (len > 0) this.structure.splice(len, 1);
      return arr;
    };

    return this.data;
  }

  concat (data: Data, array: Data) {
    for (const v of this.datanames) data[v] = data[v].concat(array[v]);
    if (data === this.data) this.count = data.token.length - 1;
  }

  objectSort (data: Data) {

    let cc = this.count;
    let dd = this.structure[this.structure.length - 1][1];
    let ee = 0;
    let ff = 0;
    let gg = 0;
    let behind = 0;
    let commaTest = true;
    let front = 0;
    let keyend = 0;
    let keylen = 0;

    const keys = [];
    const begin = dd;
    const json = prettify.options.language === 'json';
    const global = data.lexer[cc] === 'style' && this.structure[this.structure.length - 1][0] === 'global';
    const style = data.lexer[cc] === 'style';
    const delim = style === true ? [ ';', 'separator' ] : [ ',', 'separator' ];
    const lines = this.linesSpace;
    const length = this.count;
    const stack = global === true ? 'global' : this.structure[this.structure.length - 1][0];

    function sort (x: number[], y: number[]) {

      let xx = x[0];
      let yy = y[0];

      if (data.types[xx] === 'comment') {
        do {
          xx = xx + 1;
        } while (xx < length && (data.types[xx] === 'comment'));
        if (data.token[xx] === undefined) {
          return 1;
        }
      }

      if (data.types[yy] === 'comment') {
        do { yy = yy + 1; } while (yy < length && (data.types[yy] === 'comment'));
        if (data.token[yy] === undefined) return 1;
      }

      if (style === true) {

        // JavaScript's standard array sort uses implementation specific algorithms.
        // This simple numeric trick forces conformance.
        if (data.token[xx].indexOf('@import') === 0 || data.token[yy].indexOf('@import') === 0) {
          return xx < yy ? -1 : 1;
        }

        if (data.types[xx] !== data.types[yy]) {
          if (data.types[xx] === 'function') return 1;
          if (data.types[xx] === 'variable') return -1;
          if (data.types[xx] === 'selector') return 1;
          if (data.types[xx] === 'property' && data.types[yy] !== 'variable') return -1;
          if (data.types[xx] === 'mixin' && data.types[yy] !== 'property' && data.types[yy] !== 'variable') return -1;
        }

      }

      if (data.token[xx].toLowerCase() > data.token[yy].toLowerCase()) return 1;

      return -1;

    }

    const store: Data = {
      begin: [],
      ender: [],
      lexer: [],
      lines: [],
      stack: [],
      token: [],
      types: []
    };

    behind = cc;

    do {

      if (
        data.begin[cc] === dd || (
          global === true &&
          cc < behind &&
          data.token[cc] === '}' &&
          data.begin[data.begin[cc]] === -1
        )
      ) {

        if (data.types[cc].indexOf('template') > -1) return;

        if (
          data.token[cc] === delim[0] || (
            style === true &&
            data.token[cc] === '}' &&
            data.token[cc + 1] !== ';'
          )
        ) {

          commaTest = true;
          front = cc + 1;

        } else if (
          style === true &&
          data.token[cc - 1] === '}'
        ) {

          commaTest = true;
          front = cc;
        }

        if (front === 0 && data.types[0] === 'comment') {

          // keep top comments at the top
          do { front = front + 1; } while (data.types[front] === 'comment');

        } else if (data.types[front] === 'comment' && data.lines[front] < 2) {

          // If a comment follows code on the same line then
          // keep the comment next to the code it follows
          front = front + 1;
        }

        if (
          commaTest === true && (
            data.token[cc] === delim[0] || (
              style === true &&
              data.token[cc - 1] === '}'
            )
          ) && front <= behind
        ) {

          if (style === true && '};'.indexOf(data.token[behind]) < 0) {
            behind = behind + 1;
          } else if (style === false && data.token[behind] !== ',') {
            behind = behind + 1;
          }

          keys.push([ front, behind ]);

          if (style === true && data.token[front] === '}') {
            behind = front;
          } else {
            behind = front - 1;
          }

        }
      }

      cc = cc - 1;

    } while (cc > dd);

    if (keys.length > 0 && keys[keys.length - 1][0] > cc + 1) {

      ee = keys[keys.length - 1][0] - 1;

      if (data.types[ee] === 'comment' && data.lines[ee] > 1) {
        do {
          ee = ee - 1;
        } while (ee > 0 && data.types[ee] === 'comment');
        keys[keys.length - 1][0] = ee + 1;
      }

      if (data.types[cc + 1] === 'comment' && cc === -1) {
        do {
          cc = cc + 1;
        } while (data.types[cc + 1] === 'comment');
      }

      keys.push([ cc + 1, ee ]);
    }

    if (keys.length > 1) {

      // HOT PATCH
      // Fixes JSON embedded region and language object sorting
      if (
        json === true ||
        style === true ||
        data.token[cc - 1] === '=' ||
        data.token[cc - 1] === ':' ||
        data.token[cc - 1] === '(' ||
        data.token[cc - 1] === '[' ||
        data.token[cc - 1] === ',' ||
        data.types[cc - 1] === 'word' ||
        cc === 0
      ) {

        keys.sort(sort);

        keylen = keys.length;
        commaTest = false;
        dd = 0;

        do {

          keyend = keys[dd][1];

          if (style === true) {
            gg = keyend;

            if (data.types[gg] === 'comment') gg = gg - 1;
            if (data.token[gg] === '}') {
              keyend = keyend + 1;
              delim[0] = '}';
              delim[1] = 'end';
            } else {
              delim[0] = ';';
              delim[1] = 'separator';
            }
          }

          ee = keys[dd][0];

          if (
            style === true &&
            data.types[keyend - 1] !== 'end' &&
            data.types[keyend] === 'comment' &&
            data.types[keyend + 1] !== 'comment' &&
            dd < keylen - 1
          ) {

            // missing a terminal comment causes many problems
            keyend = keyend + 1;
          }

          if (ee < keyend) {

            do {

              if (
                style === false &&
                dd === keylen - 1 &&
                ee === keyend - 2 &&
                data.token[ee] === ',' &&
                data.lexer[ee] === 'script' &&
                data.types[ee + 1] === 'comment'
              ) {

                // Do not include terminal commas that are followed by a comment
                ff = ff + 1;

              } else {

                this.push(store, {
                  begin: data.begin[ee],
                  ender: data.ender[ee],
                  lexer: data.lexer[ee],
                  lines: data.lines[ee],
                  stack: data.stack[ee],
                  token: data.token[ee],
                  types: data.types[ee]
                });

                ff = ff + 1;
              }

              // Remove extra commas
              if (data.token[ee] === delim[0] && (style === true || data.begin[ee] === data.begin[keys[dd][0]])) {

                commaTest = true;

              } else if (
                data.token[ee] !== delim[0] &&
                data.types[ee] !== 'comment'
              ) {

                commaTest = false;
              }

              ee = ee + 1;

            } while (ee < keyend);

          }

          // Injecting the list delimiter
          if (
            commaTest === false &&
            store.token[store.token.length - 1] !== 'x;' && (
              style === true ||
              dd < keylen - 1
            )
          ) {

            ee = store.types.length - 1;

            if (store.types[ee] === 'comment') {
              do {
                ee = ee - 1;
              } while (ee > 0 && (store.types[ee] === 'comment'));
            }

            ee = ee + 1;

            this.splice({
              data: store,
              howmany: 0,
              index: ee,
              record: {
                begin,
                stack,
                ender: this.count,
                lexer: store.lexer[ee - 1],
                lines: 0,
                token: delim[0],
                types: delim[1] as Types
              }
            });

            ff = ff + 1;

          }

          dd = dd + 1;

        } while (dd < keylen);

        this.splice({ data, howmany: ff, index: cc + 1 });
        this.linesSpace = lines;
        this.concat(data, store);

      }
    }

  }

  pop (data: Data): Record {

    const output = {
      begin: data.begin.pop(),
      ender: data.ender.pop(),
      lexer: data.lexer.pop(),
      lines: data.lines.pop(),
      stack: data.stack.pop(),
      token: data.token.pop(),
      types: data.types.pop()
    };

    if (data === this.data) this.count = this.count - 1;

    return output;

  }

  push (data: Data, record: Record, structure: string = NIL) {

    const ender = () => {

      let a = this.count;

      const begin = data.begin[a];

      if (
        (
          (data.lexer[a] === 'style' && prettify.options.style.sortProperties === true) ||
          (data.lexer[a] === 'script' && (
            prettify.options.script.objectSort === true ||
            prettify.options.json.objectSort === true
          ))
        )
      ) {

        // Sorting can result in a token whose begin value is greater than either
        // Its current index or the index of the end token, which results in
        // an endless loop. These end values are addressed at the end of
        // the "parser" function with this.sortCorrection
        return;
      }

      do {

        if (
          data.begin[a] === begin || (
            data.begin[data.begin[a]] === begin &&
            data.types[a].indexOf('attribute') > -1 &&
            data.types[a].indexOf('attribute_end') < 0
          )
        ) {

          //  console.log(data.token[a], this.count);

          data.ender[a] = this.count;

        } else {

          a = data.begin[a];
        }

        a = a - 1;

      } while (a > begin);

      if (a > -1) data.ender[a] = this.count;
    };

    // parse_push_datanames
    this.datanames.forEach(value => data[value].push(record[value]));

    if (data === this.data) {

      // console.log(data);
      this.count = this.count + 1;
      this.linesSpace = 0;

      if (record.lexer !== 'style') {
        if (structure.replace(/(\{|\}|@|<|>|%|#|)/g, NIL) === NIL) {
          // console.log(structure);
          structure = record.types === 'else' ? 'else' : structure = record.token;
          // console.log(structure);
        }
      }

      if (record.types === 'start' || record.types.indexOf('_start') > 0) {

        // console.log(structure);
        this.structure.push([ structure, this.count ]);

      } else if (record.types === 'end' || record.types.indexOf('_end') > 0) {

        // This big condition fixes language specific else blocks that
        // are children of start/end blocks not associated with
        // the if/else chain

        let case_ender = 0;

        if (this.structure.length > 2 && (
          data.types[this.structure[this.structure.length - 1][1]] === 'else' ||
          data.types[this.structure[this.structure.length - 1][1]].indexOf('_else') > 0
        ) && (
          data.types[this.structure[this.structure.length - 2][1]] === 'start' ||
            data.types[this.structure[this.structure.length - 2][1]].indexOf('_start') > 0
        ) && (
          data.types[this.structure[this.structure.length - 2][1] + 1] === 'else' ||
            data.types[this.structure[this.structure.length - 2][1] + 1].indexOf('_else') > 0
        )) {

          this.structure.pop();

          data.begin[this.count] = this.structure[this.structure.length - 1][1];
          data.stack[this.count] = this.structure[this.structure.length - 1][0];
          data.ender[this.count - 1] = this.count;

          case_ender = data.ender[data.begin[this.count] + 1];

        }

        ender();

        if (case_ender > 0) data.ender[data.begin[this.count] + 1] = case_ender;

        this.structure.pop();

      } else if (record.types === 'else' || record.types.indexOf('_else') > 0) {

        if (structure === NIL) structure = 'else';
        if (
          this.count > 0 && (
            data.types[this.count - 1] === 'start' ||
            data.types[this.count - 1].indexOf('_start') > 0
          )
        ) {

          this.structure.push([ structure, this.count ]);

        } else {

          ender();

          if (structure === NIL) {
            this.structure[this.structure.length - 1] = [ 'else', this.count ];
          } else {
            this.structure[this.structure.length - 1] = [ structure, this.count ];
          }

        }
      }
    }
  }

  safeSort (array: [string, number][], operation: string, recursive: boolean): [string, number][] {

    if (isArray(array) === false) return array;

    if (operation === 'normal') {
      return safeSortNormal.call({ array, recursive }, array);
    } else if (operation === 'descend') {
      return safeSortDescend.call({ recursive }, array);
    }

    return safeSortAscend.call({ recursive }, array);

  }

  sortCorrection (start: number, end: number) {

    let a = start;
    let endslen = -1;

    const data = this.data;
    const ends = [];
    const structure = (this.structure.length < 2)
      ? [ -1 ]
      : [ this.structure[this.structure.length - 2][1] ];

    // This first loop solves for the begin values
    do {

      if (a > 0 &&
        data.types[a].indexOf('attribute') > -1 &&
        data.types[a].indexOf('end') < 0 &&
        data.types[a - 1].indexOf('start') < 0 &&
        data.types[a - 1].indexOf('attribute') < 0 &&
        data.lexer[a] === 'markup') {
        structure.push(a - 1);
      }

      if (a > 0 &&
        data.types[a - 1].indexOf('attribute') > -1 &&
        data.types[a].indexOf('attribute') < 0 &&
        data.lexer[structure[structure.length - 1]] === 'markup' &&
        data.types[structure[structure.length - 1]].indexOf('start') < 0
      ) {
        structure.pop();
      }

      if (data.begin[a] !== structure[structure.length - 1]) {
        if (structure.length > 0) {
          data.begin[a] = structure[structure.length - 1];
        } else {
          data.begin[a] = -1;
        }
      }

      if (data.types[a].indexOf('else') > -1) {
        if (structure.length > 0) {
          structure[structure.length - 1] = a;
        } else {
          structure.push(a);
        }
      }

      if (data.types[a].indexOf('end') > -1) structure.pop();
      if (data.types[a].indexOf('start') > -1) structure.push(a);

      a = a + 1;

    } while (a < end);

    // Now for the ender values
    a = end;

    do {

      a = a - 1;

      if (data.types[a].indexOf('end') > -1) {
        ends.push(a);
        endslen = endslen + 1;
      }

      data.ender[a] = endslen > -1 ? ends[endslen] : -1;

      if (data.types[a].indexOf('start') > -1) {
        ends.pop();
        endslen = endslen - 1;
      }

    } while (a > start);

  }

  spacer (args: Spacer): number {

    // * array - the characters to scan
    // * index - the index to start scanning from
    // * end   - the length of the array, to break the loop
    this.linesSpace = 1;

    do {

      if (args.array[args.index] === NWL) {
        this.linesSpace = this.linesSpace + 1;
        this.lineNumber = this.lineNumber + 1;
      }

      if (ws(args.array[args.index + 1]) === false) break;

      args.index = args.index + 1;

    } while (args.index < args.end);

    return args.index;

  }

  splice (splice: Splice) {

    const finalItem = [ this.data.begin[this.count], this.data.token[this.count] ];

    // * data    - The data object to alter
    // * howmany - How many indexes to remove
    // * index   - The index where to start
    // * record  - A new record to insert
    if (splice.record !== undefined && splice.record.token !== NIL) {

      // parse_splice_datanames
      for (const value of this.datanames) {
        splice.data[value].splice(splice.index, splice.howmany, splice.record[value]);
      }

      if (splice.data === this.data) {

        this.count = (this.count - splice.howmany) + 1;

        if (finalItem[0] !== this.data.begin[this.count] || finalItem[1] !== this.data.token[this.count]) {
          this.linesSpace = 0;
        }
      }

      return;
    }

    for (const value of this.datanames) {
      splice.data[value].splice(splice.index, splice.howmany);
    }

    if (splice.data === this.data) {
      this.count = this.count - splice.howmany;
      this.linesSpace = 0;
    }

  }

  wrapCommentBlock (config: WrapComment): [string, number] {

    const { wrap, crlf, preserveComment } = prettify.options;
    const build = [];
    const second = [];
    const lf = (crlf === true) ? '\r\n' : NWL;
    const regEsc = (/(\/|\\|\||\*|\[|\]|\{|\})/g);
    const regEndEsc = (/{%-?\s*|\s*-?%}/g);

    /* -------------------------------------------- */
    /* LEXICAL SCOPES                               */
    /* -------------------------------------------- */

    let a = config.start;
    let b = 0;
    let c = 0;
    let d = 0;
    let len = 0;
    let lines = [];
    let space = NIL;
    let bline = NIL;
    let emptyLine = false;
    let bulletLine = false;
    let numberLine = false;
    let bigLine = false;
    let output = NIL;
    let terml = config.terminator.length - 1;
    let term = config.terminator.charAt(terml);
    let twrap = 0;
    let regEnd: RegExp;

    const opensan = config.opening.replace(regEsc, sanitizeComment);
    const regIgnore = new RegExp(`^(${opensan}\\s*@prettify-ignore-start)`);
    const regStart = new RegExp(`(${opensan}\\s*)`);
    const isLiquid = is(config.opening[0], cc.LCB) && is(config.opening[1], cc.PER);

    if (isLiquid) {

      regEnd = new RegExp(`\\s*${config.terminator.replace(regEndEsc, input => {
        if (input.charCodeAt(0) === cc.LCB) return '{%-?\\s*';
        return '\\s*-?%}';
      })}$`);

    }

    const emptylines = () => {

      if (/^\s+$/.test(lines[b + 1]) || lines[b + 1] === NIL) {
        do {
          b = b + 1;
        } while (b < len && (
          /^\s+$/.test(lines[b + 1]) ||
          lines[b + 1] === NIL
        ));
      }

      if (b < len - 1) second.push(NIL);

    };

    do {

      build.push(config.chars[a]);

      if (config.chars[a] === NWL) this.lineNumber = this.lineNumber + 1;
      if (config.chars[a] === term && config.chars.slice(a - terml, a + 1).join(NIL) === config.terminator) break;
      /* console.log(JSON.stringify([
        config.chars[config.start - 3]
        , config.chars[config.start - 2]
        , config.chars[config.start - 1]
        , config.chars[config.start]
        , config.chars[config.start + 1]
        , config.chars[config.start + 2]
        , config.chars[config.start + 3]
        , config.chars[config.start + 4]
        , config.chars[config.start + 5]
        , config.chars[config.start + 6]
        , config.chars[config.start + 7]
      ])); */

      // console.log(config.chars[a - 4], config.chars[a - 3], config.chars[a - 2], config.chars[a - 1]);
      // console.log(config);
      // build.push(config.chars[a]);

      a = a + 1;

    } while (a < config.end);

    output = build.join(NIL);

    if (regIgnore.test(output) === true) {

      let termination = NWL;

      a = a + 1;

      do {

        build.push(config.chars[a]);

        // HOT PATCH
        // Supports comment start/end comment ignores using Liquid
        // tags. We don't have any knowledge of the comment formation
        // upon parse, this will re-assign the terminator
        //
        if (build.slice(build.length - 20).join(NIL) === '@prettify-ignore-end') {

          if (isLiquid) {
            const d = config.chars.indexOf('{', a);
            if (is(config.chars[d + 1], cc.PER)) {
              const ender = config.chars.slice(d, config.chars.indexOf('}', d + 1) + 1).join(NIL);
              if (regEnd.test(ender)) config.terminator = ender;
            }
          }

          a = a + 1;

          break;
        }

        a = a + 1;

      } while (a < config.end);

      b = a;

      terml = config.opening.length - 1;
      term = config.opening.charAt(terml);

      do {

        if (
          config.opening === '/*' &&
          config.chars[b - 1] === '/' &&
         (config.chars[b] === '*' || config.chars[b] === '/')) break; // for script OR style

        if (
          config.opening !== '/*' &&
          config.chars[b] === term &&
          config.chars.slice(b - terml, b + 1).join(NIL) === config.opening) break; // for markup

        b = b - 1;

      } while (b > config.start);

      if (config.opening === '/*' && config.chars[b] === '*') {
        termination = '\u002a/';
      } else if (config.opening !== '/*') {
        termination = config.terminator;
      }

      terml = termination.length - 1;
      term = termination.charAt(terml);

      if (termination !== NWL || config.chars[a] !== NWL) {

        do {

          build.push(config.chars[a]);

          if (termination === NWL && config.chars[a + 1] === NWL) break;

          if (
            config.chars[a] === term &&
            config.chars.slice(a - terml, a + 1).join(NIL) === termination) break;

          a = a + 1;

        } while (a < config.end);

      }

      if (config.chars[a] === NWL) a = a - 1;

      output = build.join(NIL).replace(StripEnd, NIL);

      // console.log(output);

      /* -------------------------------------------- */
      /* RETURN COMMENT                               */
      /* -------------------------------------------- */

      return [ output, a ];
    }

    if (preserveComment === true || wrap < 1 || a === config.end || (
      output.length <= wrap &&
      output.indexOf(NWL) < 0
    ) || (
      config.opening === '/*' &&
      output.indexOf(NWL) > 0 &&
      output.replace(NWL, NIL).indexOf(NWL) > 0 &&
      (/\n(?!(\s*\*))/).test(output) === false
    )
    ) {

      /* -------------------------------------------- */
      /* RETURN COMMENT                               */
      /* -------------------------------------------- */

      return [ output, a ];
    }

    b = config.start;

    if (b > 0 && config.chars[b - 1] !== NWL && ws(config.chars[b - 1])) {
      do {
        b = b - 1;
      } while (b > 0 && config.chars[b - 1] !== NWL && ws(config.chars[b - 1]));
    }

    space = config.chars.slice(b, config.start).join(NIL);

    const spaceLine = new RegExp(NWL + space, 'g');

    lines = output.replace(/\r\n/g, NWL).replace(spaceLine, NWL).split(NWL);
    len = lines.length;
    lines[0] = lines[0].replace(regStart, NIL);
    lines[len - 1] = lines[len - 1].replace(regEnd, NIL);

    if (len < 2) lines = lines[0].split(WSP);

    if (lines[0] === NIL) {
      lines[0] = config.opening;
    } else {
      lines.splice(0, 0, config.opening);
    }

    len = lines.length;
    b = 0;

    do {

      bline = (b < len - 1) ? lines[b + 1].replace(StripLead, NIL) : NIL;

      if ((/^\s+$/).test(lines[b]) === true || lines[b] === NIL) {

        emptylines();

      } else if (lines[b].slice(0, 4) === '    ') {

        second.push(lines[b]);

      } else if (
        lines[b].replace(StripLead, NIL).length > wrap &&
        lines[b].replace(StripLead, NIL).indexOf(WSP) > wrap
      ) {

        lines[b] = lines[b].replace(StripLead, NIL);
        c = lines[b].indexOf(WSP);
        second.push(lines[b].slice(0, c));
        lines[b] = lines[b].slice(c + 1);
        b = b - 1;

      } else {

        lines[b] = (
          config.opening === '/*' &&
          lines[b].indexOf('/*') !== 0
        )
          ? `   ${lines[b].replace(StripLead, NIL).replace(StripEnd, NIL).replace(/\s+/g, WSP)}`
          : `${lines[b].replace(StripLead, NIL).replace(StripEnd, NIL).replace(/\s+/g, WSP)}`;

        twrap = (b < 1)
          ? wrap - (config.opening.length + 1)
          : wrap;

        c = lines[b].length;
        d = lines[b].replace(StripLead, NIL).indexOf(WSP);

        if (c > twrap && d > 0 && d < twrap) {

          c = twrap;

          do {
            c = c - 1;
            if (ws(lines[b].charAt(c)) && c <= wrap) break;
          } while (c > 0);

          if (
            lines[b].slice(0, 4) !== '    ' &&
            (/^\s*(\*|-)\s/).test(lines[b]) === true &&
            (/^\s*(\*|-)\s/).test(lines[b + 1]) === false
          ) {

            lines.splice(b + 1, 0, '* ');
          }

          if (
            lines[b].slice(0, 4) !== '    ' &&
            (/^\s*\d+\.\s/).test(lines[b]) === true &&
            (/^\s*\d+\.\s/).test(lines[b + 1]) === false) {

            lines.splice(b + 1, 0, '1. ');
          }

          if (c < 4) {

            second.push(lines[b]);
            bigLine = true;

          } else if (b === len - 1) {

            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            bigLine = true;
            b = b - 1;

          } else if ((/^\s+$/).test(lines[b + 1]) === true || lines[b + 1] === NIL) {

            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            emptyLine = true;
            b = b - 1;

          } else if (lines[b + 1].slice(0, 4) !== '    ' && (/^\s*(\*|-)\s/).test(lines[b + 1])) {

            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            bulletLine = true;
            b = b - 1;

          } else if (lines[b + 1].slice(0, 4) !== '    ' && (/^\s*\d+\.\s/).test(lines[b + 1])) {

            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            numberLine = true;
            b = b - 1;

          } else if (lines[b + 1].slice(0, 4) === '    ') {

            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            bigLine = true;
            b = b - 1;

          } else if (c + bline.length > wrap && bline.indexOf(WSP) < 0) {

            second.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            bigLine = true;
            b = b - 1;

          } else if (lines[b].replace(StripLead, NIL).indexOf(WSP) < wrap) {
            lines[b + 1] = lines[b].length > wrap
              ? lines[b].slice(c + 1) + lf + lines[b + 1]
              : `${lines[b].slice(c + 1)} ${lines[b + 1]}`;
          }

          if (
            emptyLine === false &&
            bulletLine === false &&
            numberLine === false &&
            bigLine === false
          ) {
            lines[b] = lines[b].slice(0, c);
          }

        } else if (
          lines[b + 1] !== undefined && (
            (
              lines[b].length + bline.indexOf(WSP) > wrap &&
              bline.indexOf(WSP) > 0
            ) || (
              lines[b].length + bline.length > wrap &&
              bline.indexOf(WSP) < 0
            )
          )
        ) {

          second.push(lines[b]);

          b = b + 1;

        } else if (
          lines[b + 1] !== undefined &&
          (/^\s+$/).test(lines[b + 1]) === false &&
          lines[b + 1] !== NIL &&
          lines[b + 1].slice(0, 4) !== '    ' &&
          (/^\s*(\*|-|(\d+\.))\s/).test(lines[b + 1]) === false
        ) {

          // LIQUID COMMENTS ARE AUGMENTED HERE

          // console.log(lines);

          lines[b + 1] = `${lines[b]} ${lines[b + 1]}`;
          emptyLine = true;
        }

        if (bigLine === false && bulletLine === false && numberLine === false) {

          if (emptyLine === true) {

            emptyLine = false;

          } else if ((/^\s*(\*|-|(\d+\.))\s*$/).test(lines[b]) === false) {

            if (
              b < len - 1 &&
              lines[b + 1] !== NIL &&
              (/^\s+$/).test(lines[b]) === false &&
              lines[b + 1].slice(0, 4) !== '    ' &&
              (/^\s*(\*|-|(\d+\.))\s/).test(lines[b + 1]) === false

            ) {

              lines[b] = `${lines[b]} ${lines[b + 1]}`;
              lines.splice(b + 1, 1);
              len = len - 1;
              b = b - 1;

            } else {
              if (config.opening === '/*' && lines[b].indexOf('/*') !== 0) {
                second.push(`   ${lines[b].replace(StripLead, NIL).replace(StripEnd, NIL).replace(/\s+/g, WSP)}`);
              } else {
                second.push(`${lines[b].replace(StripLead, NIL).replace(StripEnd, NIL).replace(/\s+/g, WSP)}`);
              }
            }
          }
        }

        bigLine = false;
        bulletLine = false;
        numberLine = false;
      }

      b = b + 1;

    } while (b < len);

    if (second.length > 0) {

      if (second[second.length - 1].length > wrap - (config.terminator.length + 1)) {
        second.push(config.terminator);
      } else {

        // second.push(config.terminator);
        second[second.length - 1] = `${second[second.length - 1]} ${config.terminator}`;
      }

      output = second.join(lf);

    } else {
      lines[lines.length - 1] = lines[lines.length - 1] + config.terminator;
      output = lines.join(lf);
    }

    // console.log(output);

    /* -------------------------------------------- */
    /* RETURN COMMENT                               */
    /* -------------------------------------------- */

    return [ output, a ];

  }

  wrapCommentLine (config: WrapComment): [string, number] {

    let a = config.start;
    let b = 0;
    let output = NIL;
    let build = [];

    const { wrap, preserveComment } = prettify.options;

    function recurse () {

      let line = NIL;

      do {

        b = b + 1;

        if (is(config.chars[b + 1], cc.NWL)) return;

      } while (b < config.end && ws(config.chars[b]) === true);

      if (config.chars[b] + config.chars[b + 1] === '//') {

        build = [];

        do {
          build.push(config.chars[b]);
          b = b + 1;
        } while (b < config.end && config.chars[b] !== NWL);

        line = build.join(NIL);

        if (
          (/^\/\/ (\*|-|(\d+\.))/).test(line) === false &&
          line.slice(0, 6) !== '//    ' &&
          (/^\/\/\s*$/).test(line) === false
        ) {
          output = `${output} ${line.replace(/(^\/\/\s*)/, NIL).replace(StripEnd, NIL)}`;
          a = b - 1;
          recurse();
        }
      }

    };

    const wordWrap = () => {

      const lines = [];
      const record: Partial<Record> = {
        ender: -1,
        types: 'comment',
        lexer: config.lexer,
        lines: this.linesSpace
      };

      if (this.count > -1) {
        record.begin = this.structure[this.structure.length - 1][1];
        record.stack = this.structure[this.structure.length - 1][0];
        record.token = this.data.token[this.count];
      } else {
        record.begin = -1;
        record.stack = 'global';
        record.token = NIL;
      };

      let c = 0;
      let d = 0;

      output = output.replace(/\s+/g, WSP).replace(StripEnd, NIL);

      d = output.length;

      if (wrap > d) return;

      do {
        c = wrap;

        if (output.charAt(c) !== WSP) {
          do {
            c = c - 1;
          } while (c > 0 && output.charAt(c) !== WSP);
          if (c < 3) {
            c = wrap;
            do {
              c = c + 1;
            } while (c < d - 1 && output.charAt(c) !== WSP);
          }
        }

        lines.push(output.slice(0, c));

        output = `// ${output.slice(c).replace(StripLead, NIL)}`;
        d = output.length;

      } while (wrap < d);

      c = 0;
      d = lines.length;

      do {

        record.token = lines[c];
        this.push(this.data, record as Record, NIL);
        record.lines = 2;
        this.linesSpace = 2;
        c = c + 1;

      } while (c < d);

    };

    do {
      build.push(config.chars[a]);
      a = a + 1;
    } while (a < config.end && config.chars[a] !== NWL);

    if (a === config.end) {

      // Necessary because the wrapping logic expects line termination
      config.chars.push(NWL);

    } else {
      a = a - 1;
    }

    output = build.join(NIL).replace(StripEnd, NIL);

    if ((/^(\/\/\s*@prettify-ignore-start\b)/).test(output) === true) {

      let termination = NWL;
      a = a + 1;

      do {

        build.push(config.chars[a]);
        a = a + 1;

      } while (
        a < config.end &&
        (
          config.chars[a - 1] !== 'd' ||
          (
            config.chars[a - 1] === 'd' &&
            build.slice(build.length - 20).join(NIL) !== '@prettify-ignore-end'
          )
        )
      );

      b = a;

      // eslint-disable-next-line
      do {} while (b > config.start && config.chars[b - 1] === '/' && (
        config.chars[b] === '*' ||
        config.chars[b] === '/'
      ));

      if (config.chars[b] === '*') termination = '\u002a/';
      if (termination !== NWL || config.chars[a] !== NWL) {

        do {
          build.push(config.chars[a]);
          if (termination === NWL && config.chars[a + 1] === NWL) break;
          a = a + 1;
        } while (a < config.end && (
          termination === NWL || (termination === '\u002a/' && (
            config.chars[a - 1] !== '*' ||
            config.chars[a] !== '/'
          ))
        ));

      }

      if (config.chars[a] === NWL) a = a - 1;

      output = build.join(NIL).replace(StripEnd, NIL);

      /* -------------------------------------------- */
      /* RETURN COMMENT                               */
      /* -------------------------------------------- */

      return [ output, a ];
    }

    if (
      output === '//' ||
      output.slice(0, 6) === '//    ' ||
      preserveComment === true
    ) {

      /* -------------------------------------------- */
      /* RETURN COMMENT                               */
      /* -------------------------------------------- */

      return [ output, a ];
    }

    output = output.replace(/(\/\/\s*)/, '// ');

    if (wrap < 1 || (a === config.end - 1 && this.data.begin[this.count] < 1)) return [ output, a ];

    b = a + 1;

    recurse();
    wordWrap();

    /* -------------------------------------------- */
    /* RETURN COMMENT                               */
    /* -------------------------------------------- */

    return [ output, a ];

  }

}();
