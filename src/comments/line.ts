import { Record, WrapComment } from 'types/index';
import { parse } from 'parse/parser';
import * as rx from 'lexical/regex';
import { cc as ch } from 'lexical/codes';
import { NWL, NIL, WSP } from 'chars';
import { ws, is, not } from 'utils';

/**
 * Wrap Comment Lines
 *
 * Parsing of comment line type tokens
 * Beautification and handling for block style comments.
 * traverse lexing for all comment identified sequences.
 */
export function commentLine (config: WrapComment): [string, number] {

  const { wrap } = parse.rules;
  const { preserveComment } = parse.rules[parse.lexer];

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
      if (is(config.chars[b + 1], ch.NWL)) return;
    } while (b < config.end && ws(config.chars[b]));

    if (config.chars[b] + config.chars[b + 1] === '//') {

      build = [];

      do {
        build.push(config.chars[b]);
        b = b + 1;
      } while (b < config.end && not(config.chars[b], ch.NWL));

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

    if (wrap > d) return;

    do {
      c = wrap;

      if (not(output[c], ch.WSP)) {

        do c = c - 1;
        while (c > 0 && not(output[c], ch.WSP));

        if (c < 3) {
          c = wrap;
          do c = c + 1;
          while (c < d - 1 && not(output[c], ch.WSP));
        }

      }

      lines.push(output.slice(0, c));

      output = `// ${output.slice(c).replace(rx.SpaceLead, NIL)}`;

      d = output.length;
    } while (wrap < d);

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
    build.push(config.chars[a]);
    a = a + 1;
  } while (a < config.end && not(config.chars[a], ch.NWL));

  if (a === config.end) {

    // Necessary because the wrapping logic expects line termination
    config.chars.push(NWL);

  } else {
    a = a - 1;
  }

  output = build.join(NIL).replace(rx.SpaceEnd, NIL);

  if (rx.CommLineIgnoreStart.test(output) === true) {

    let termination = NWL;

    a = a + 1;

    do {

      build.push(config.chars[a]);
      a = a + 1;

    } while (a < config.end && (
      not(config.chars[a - 1], 100) || (
        is(config.chars[a - 1], 100) &&
        build.slice(build.length - 19).join(NIL) !== 'esthetic-ignore-end'
      ))
    );

    b = a;

    do; while (b > config.start && is(config.chars[b - 1], ch.FWS) && (
      is(config.chars[b], ch.ARS) ||
      is(config.chars[b], ch.FWS)
    ));

    if (is(config.chars[b], ch.ARS)) termination = '\u002a/';
    if (termination !== NWL || not(config.chars[a], ch.NWL)) {

      do {
        build.push(config.chars[a]);
        if (termination === NWL && is(config.chars[a + 1], ch.NWL)) break;
        a = a + 1;
      } while (a < config.end && (termination === NWL || (
        termination === '\u002a/' && (
          is(config.chars[a - 1], ch.ARS) ||
          is(config.chars[a], ch.FWS)
        ))
      ));

    }

    if (config.chars[a] === NWL) a = a - 1;

    output = build.join(NIL).replace(rx.SpaceEnd, NIL);

    return [ output, a ];
  }

  if (output === '//' || preserveComment === true) return [ output, a ];

  output = output.replace(/(\/\/\s*)/, '// ');

  if (wrap < 1 || (a === config.end - 1 && parse.data.begin[parse.count] < 1)) return [ output, a ];

  b = a + 1;

  traverse();
  wordwrap();

  /* -------------------------------------------- */
  /* RETURN COMMENT                               */
  /* -------------------------------------------- */

  return [ output, a ];

}
