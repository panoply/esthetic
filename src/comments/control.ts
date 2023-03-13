import * as rx from 'lexical/regex';
import { cc } from 'lexical/codes';
import { NIL } from 'chars';
import { keys, is, ws } from 'utils';
import { parse } from 'parse/parser';
import { definitions } from 'rules/definitions';

/**
 * Parses the inline comment settings. This has been adapted from
 * the Esthetic (formally PrettyDiff) comment parser and refactored
 * to focus purely on the Prettify supported logics.
 *
 * Source Priorities:
 *
 * - The comment is only accepted if it occurs before non-comments (near top)
 * - The `options.source` is the priority material for reading the comment
 *
 * Examples:
 *
 * - `/* @esthetic width: 80 preserveLine: 4 *\/`
 * - `// @esthetic width: 80 preserveLine: 4`
 * - `<!-- @esthetic width: 80 preserveLine: 4 -->`
 * - `{% # @esthetic width: 80 preserveLine: 4 %}`
 * - `{% comment %} @prettify width: 40 preserveLine: 2 {% endcomment %}`
 * - `# @esthetic width: 80 preserveLine: 4`
 *
 * Parsing Considerations:
 *
 * 1. There may be any amount of space at the start or end of the comment
 * 2. `@prettify` must exist at the start of the comment
 * 3. Comment must exist prior to non-comment tokens (near top of code)
 * 4. Parameters are name value pairs separated by white space
 * 5. The delimiter separating name and value must be a colon character, eg: `:`
 */
export function control (source: string) {

  const sindex = source.search(rx.CommControl);
  const signore = source.search(rx.CommIgnoreFile);
  const k = keys(definitions);
  const len = k.length;

  let a = 0;
  let b = 0;

  // const lang = NIL;
  // const lex = NIL;

  if (signore > -1 && source.slice(0, signore).trimStart() === NIL) return false;

  const { rules } = parse;

  if ((sindex > -1 && (sindex === 0 || "\"':".indexOf(source.charAt(sindex - 1)) < 0))) {

    const ops = [];
    const pdcom = sindex;
    const len = source.length;

    let a = pdcom;
    let b = 0;
    let quote = NIL;
    let item = NIL;
    let valkey = [];
    let op = [];
    let rcb: number;
    let comment: string;

    if (is(source[a], cc.LAN)) {
      comment = '<!--';
    } else if (is(source[a + 1], cc.FWS)) {
      comment = '//';
    } else if (is(source[a + 1], cc.PER)) {
      rcb = source.indexOf('}', a + 1);
      if (is(source[rcb - 1], cc.PER)) comment = source.slice(a, rcb + 1);
    } else {
      comment = '/\u002a';
    }

    function esc () {

      if (source.charAt(a - 1) !== '\\') return false;

      let x = a;

      do x = x - 1;
      while (x > 0 && source.charAt(x) === '\\');

      return (a - x) % 2 === 0;
    };

    do {
      if (source.slice(a - 9, a) === '@esthetic') break;
      a = a + 1;
    } while (a < len);

    do {

      if (esc() === false) {

        if (quote === NIL) {

          if (is(source[a], cc.DQO) || is(source[a], cc.SQO) || is(source[a], cc.TQO)) {

            quote = source.charAt(a);

            if (ops.length > 0 && ops[ops.length - 1].charAt(ops[ops.length - 1].length - 1) === ':') b = a;

          } else if ((/\s/).test(source.charAt(a)) === false && b === 0) {

            b = a;

          } else if (is(source[a], cc.COM) || (ws(source.charAt(a)) === true && b > 0)) {

            item = source.slice(b, a);

            if (ops.length > 0) {

              if (ops.length > 0 && is(item, cc.COL) && ops[ops.length - 1].indexOf(':') < 0) {

                // For cases where white space is between option name
                // and  assignment operator
                ops[ops.length - 1] = ops[ops.length - 1] + item;

                b = a;

              } else if (ops.length > 0 && ops[ops.length - 1].charAt(ops[ops.length - 1].length - 1) === ':') {

                // For cases where white space is between assignment
                // operator and value
                ops[ops.length - 1] = ops[ops.length - 1] + item;

                b = 0;

              } else {

                ops.push(item);
                b = 0;
              }

            } else {
              ops.push(item);
              b = 0;
            }
          }

          if (comment === '<!--' && source.slice(a - 2, a + 1) === '-->') break;
          if (comment === '//' && source.charAt(a) === '\n') break;
          if (comment === '/\u002a' && source.slice(a - 1, a + 1) === '\u002a/') break;

          // HANDLE CLOSING LIQUID COMMENT
          if (
            comment.charCodeAt(1) === cc.PER &&
            source.slice(a - 1, a + 1) === '%' &&
            source.indexOf('endcomment', source.indexOf('{%', rcb)) > 0
          ) break;

        } else if (source.charAt(a) === quote && quote !== '${') {
          quote = NIL;
        } else if (quote === '`' && source.slice(a, a + 2) === '${') {
          quote = '${';
        } else if (quote === '${' && source.charAt(a) === '}') {
          quote = '`';
        }
      }

      a = a + 1;

    } while (a < len);

    if (b > 0) {

      quote = source.slice(b, a + 1);

      if (comment === '<!--') {
        quote = quote.replace(/\s*-+>$/, NIL);
      } else if (comment === '//') {
        quote = quote.replace(/\s+$/, NIL);
      } else {
        quote = quote.replace(/\s*\u002a\/$/, NIL);
      }

      ops.push(quote);
    }

    a = ops.length;

    if (a > 0) {

      do {

        a = a - 1;

        if (ops[a].indexOf(':') > 0) {
          op = [ ops[a].slice(0, ops[a].indexOf(':')), ops[a].slice(ops[a].indexOf(':') + 1) ];
        } else if (definitions[ops[a]] !== undefined && definitions[ops[a]].type === 'boolean') {
          parse.rules[ops[a]] = true;
        }

        if (op.length === 2 && definitions[op[0]] !== undefined) {

          if (
            op[1].charAt(op[1].length - 1) === op[1].charAt(0) && (
              op[1].charAt(0) === '"' ||
              op[1].charAt(0) === "'" ||
              op[1].charAt(0) === '`'
            )
          ) {

            op[1] = op[1].slice(1, op[1].length - 1);
          }

          if (definitions[op[0]].type === 'number' && isNaN(Number(op[1])) === false) {

            rules[op[0]] = Number(op[1]);

          } else if (definitions[op[0]].type === 'boolean') {

            rules[op[0]] = op[1] === 'true';

          } else {

            if (definitions[op[0]].values !== undefined) {

              valkey = keys(definitions[op[0]].values);
              b = valkey.length;

              do {

                b = b - 1;

                if (valkey[b] === op[1]) {
                  rules[op[0]] = op[1];
                  break;
                }
              } while (b > 0);

            } else {

              // if (op[0] === 'language') {
              //   lang = op[1];
              // } else if (op[0] === 'lexer') {
              //   lex = op[1];
              // }

              rules[op[0]] = op[1];
            }
          }
        }
      } while (a > 0);

    }

  }

  do {

    if (rules[keys[a]] !== undefined) {
      b = definitions[keys[a]].lexer.length;
      do b = b - 1;
      while (b > 0);
    }

    a = a + 1;

  } while (a < len);

};
