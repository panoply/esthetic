import { NIL, NWL, WSP } from 'chars';
import { cc as ch } from 'lexical/codes';
import * as rx from 'lexical/regex';
import { parse } from 'parse/parser';
import { Comments, Record } from 'types';
import { is, not, ws } from 'utils/helpers';

/**
 * Wrap Comment Lines
 *
 * Parsing of comment line type tokens
 * Beautification and handling for block style comments.
 * traverse lexing for all comment identified sequences.
 */
export function commentLine (chars: string[], config: Comments): any {

  const { wordWrap, commentPreserve } = parse.rules;

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  let a: number = config.start;
  let b: number = 0;
  let output: string = NIL;
  let build: string[] = [];

  function traverse () {

    let line = NIL;

    do {
      b = b + 1;
      if (is(chars[b + 1], ch.NWL)) return;
    } while (b < config.end && ws(chars[b]));

    if (chars[b] + chars[b + 1] === '//') {

      build = [];

      do {
        build.push(chars[b]);
        b = b + 1;
      } while (b < config.end && not(chars[b], ch.NWL));

      line = build.join(NIL);

      if (/^\/\/ (?:[*-]|\d+\.)/.test(line) === false && /^\/\/\s*$/.test(line) === false) {
        output = `${output} ${line.replace(/(^\/\/\s*)/, NIL).replace(rx.SpaceEnd, NIL)}`;
        a = b - 1;
        traverse();
      }
    }

  };

  function wordwrap () {

    /**
     * Line store
     */
    const lines: string[] = [];

    /**
     * Record to be applied in data structure
     */
    const record: Partial<Record> = {
      ender: -1,
      types: 'comment',
      lexer: config.lexer,
      lines: parse.lineOffset
    };

    if (parse.count > -1) {
      record.begin = parse.stack.index;
      record.stack = parse.stack.token;
      record.token = parse.data.token[parse.count];
    } else {
      record.begin = -1;
      record.stack = 'global';
      record.token = NIL;
    };

    let c = 0;
    let d = 0;

    output = output
      .replace(/\s+/g, WSP)
      .replace(rx.SpaceEnd, NIL);

    d = output.length;

    if (wordWrap > d) return;

    do {
      c = wordWrap;

      if (not(output[c], ch.WSP)) {

        do c = c - 1;
        while (c > 0 && not(output[c], ch.WSP));

        if (c < 3) {
          c = wordWrap;
          do c = c + 1;
          while (c < d - 1 && not(output[c], ch.WSP));
        }

      }

      lines.push(output.slice(0, c));

      output = `// ${output.slice(c).replace(rx.SpaceLead, NIL)}`;

      d = output.length;

    } while (wordWrap < d);

    c = 0;
    d = lines.length;

    do {

      record.token = lines[c];
      parse.push(parse.data, record as Record, NIL);
      record.lines = 2;
      parse.lineOffset = 2;

      c = c + 1;

    } while (c < d);

  };

  do {
    build.push(chars[a]);
    a = a + 1;
  } while (a < config.end && not(chars[a], ch.NWL));

  if (a === config.end) {

    // Necessary because the wordWrap ping logic expects line termination
    chars.push(NWL);

  } else {
    a = a - 1;
  }

  output = build.join(NIL).replace(rx.SpaceEnd, NIL);

  if (rx.CommLineIgnoreStart.test(output) === true) {

    let termination = NWL;

    a = a + 1;

    do {

      build.push(chars[a]);
      a = a + 1;

    } while (a < config.end && (
      not(chars[a - 1], 'd') || (
        is(chars[a - 1], 'd') &&
        build.slice(build.length - 19).join(NIL) !== 'esthetic-ignore-end'
      ))
    );

    b = a;

    do; while (b > config.start && is(chars[b - 1], ch.FWS) && (
      is(chars[b], ch.ARS) ||
      is(chars[b], ch.FWS)
    ));

    if (is(chars[b], ch.ARS)) termination = '\u002a/';
    if (termination !== NWL || not(chars[a], ch.NWL)) {

      do {
        build.push(chars[a]);
        if (termination === NWL && is(chars[a + 1], ch.NWL)) break;
        a = a + 1;
      } while (a < config.end && (termination === NWL || (
        termination === '\u002a/' && (
          is(chars[a - 1], ch.ARS) ||
          is(chars[a], ch.FWS)
        ))
      ));

    }

    if (chars[a] === NWL) a = a - 1;

    output = build.join(NIL).replace(rx.SpaceEnd, NIL);

    return [ output, a ];
  }

  if (output === '//' || commentPreserve === true) return [ output, a ];

  output = output.replace(/(\/\/\s*)/, '// ');

  if (wordWrap < 1 || (a === config.end - 1 && parse.data.begin[parse.count] < 1)) return [ output, a ];

  b = a + 1;

  traverse();
  wordwrap();

  /* -------------------------------------------- */
  /* RETURN COMMENT                               */
  /* -------------------------------------------- */

  return [ output, a ];

}
