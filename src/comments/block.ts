import { WrapComment } from 'types/index';
import { parse } from 'parse/parser';
import * as rx from 'lexical/regex';
import { cc as ch } from 'lexical/codes';
import { NWL, NIL, WSP } from 'chars';
import { sanitizeComment, ws, is, not } from 'utils/helpers';

/**
 * Wrap Comment Block
 *
 * Beautification and handling for block style comments.
 * Traversal lexing for all comment identified sequences.
 */
export function commentBlock (config: WrapComment): [string, number] {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * Deconstructed Rules
   */
  const { rules } = parse;

  /**
   * The composed output structure
   */
  const build: string[] = [];

  /**
   * An additional composed structure
   */
  const store: string[] = [];

  /**
   * Sanatized opening delimiter sequence
   */
  const sanitize = config.begin.replace(rx.CharEscape, sanitizeComment);

  /**
   * Whether or not we are dealing with a Liquid comment
   */
  const isLiquid = is(config.begin[0], ch.LCB) && is(config.begin[1], ch.PER);

  /**
   * Whether or not we are dealing with a Liquid Line comment
   */
  const isLiquidLine = isLiquid === false ? false : config.chars
    .slice(config.start + 2, config.chars.indexOf('%}', config.start + 2))
    .join(NIL)
    .trimStart()
    .charCodeAt(0) === ch.HSH;

  /**
   * Regular expression for ignore comment starters
   */
  const regexIgnore = new RegExp(`^(${sanitize}\\s*esthetic-ignore-start)`);

  /**
   * Regular expression start type comment blocks
   */
  const regexStart = new RegExp(`(${sanitize}\\s*)`);
  /**
   * Liquid ending expression
   */
  const regexEnder: RegExp = isLiquid
    ? new RegExp(`\\s*${config.ender.replace(rx.LiquidDelimiters, i => is(i, ch.LCB) ? '{%-?\\s*' : '\\s*-?%}')}$`)
    : new RegExp(config.ender.replace(rx.CharEscape, sanitizeComment));

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Starting index offset of the comment
   */
  let a = config.start;
  let b = 0;
  let c = 0;
  let d = 0;

  /**
   * Newlines store reference
   */
  let lines: string[] = [];

  /**
   * Lines Length store reference
   */
  let lsize = 0;

  /**
   * Iterator `b` line
   */
  let bline = NIL;

  /**
   * Whether or not empty line is contained
   */
  let emptyLine = false;

  /**
   * Whether or not bullet point lines are contained
   */
  let bulletLine = false;

  /**
   * Whether or not numbered lines are contained
   */
  let numberLine = false;

  /**
   * The generated output token
   */
  let output = NIL;

  /**
   * ender length, ie: The `end` tag token lsize
   */
  let tlen = config.ender.length - 1;

  /**
   * Last known character of the terminator, ie: `end[end.length - 1]`
   */
  let term = config.ender.charAt(tlen);

  /**
   * Terminator wrap length
   */
  let twrap = 0;

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

  /**
   * Parse Empty Newlines
   *
   * Detects new lines and populates the `store[]` store build.
   */
  function parseEmptyLines () {

    if (rx.EmptyLine.test(lines[b + 1]) || lines[b + 1] === NIL) {

      do b = b + 1;
      while (b < lsize && (rx.EmptyLine.test(lines[b + 1]) || lines[b + 1] === NIL));

    }

    if (b < lsize - 1) store.push(NIL);

  };

  /**
   * Ignore Comment
   *
   * Detects and traverses an ignore control type comment.
   */
  function parseIgnoreComment (): [string, number] {

    let ender = NWL;

    a = a + 1;

    do {

      build.push(config.chars[a]);

      // Supports comment start/end comment ignores using Liquid
      // tags. We don't have any knowledge of the comment formation
      // upon parse, this will re-assign the terminator
      //
      if (build.slice(build.length - 19).join(NIL) === 'esthetic-ignore-end') {

        if (isLiquid) {

          const d = config.chars.indexOf('{', a);

          if (is(config.chars[d + 1], ch.PER)) {

            const ender = config.chars.slice(d, config.chars.indexOf('}', d + 1) + 1).join(NIL);
            if (regexEnder.test(ender)) config.ender = ender;

          }
        }

        a = a + 1;
        break;
      }

      a = a + 1;

    } while (a < config.end);

    b = a;

    tlen = config.begin.length - 1;
    term = config.begin.charAt(tlen);

    do {

      // Script OR Style Comment Blocks
      if (config.begin === '/*' && is(config.chars[b - 1], ch.FWS) && (
        is(config.chars[b], ch.ARS) ||
        is(config.chars[b], ch.FWS))) break;

      // Markup Comment Blocks
      if (
        config.begin !== '/*' &&
        config.chars[b] === term &&
        config.chars.slice(b - tlen, b + 1).join(NIL) === config.begin) break;

      b = b - 1;

    } while (b > config.start);

    if (config.begin === '/*' && is(config.chars[b], ch.ARS)) {
      ender = '\u002a/';
    } else if (config.begin !== '/*') {
      ender = config.ender;
    }

    tlen = ender.length - 1;
    term = ender.charAt(tlen);

    if (ender !== NWL || config.chars[a] !== NWL) {

      do {

        build.push(config.chars[a]);

        if (ender === NWL && config.chars[a + 1] === NWL) break;
        if (config.chars[a] === term && config.chars.slice(a - tlen, a + 1).join(NIL) === ender) break;

        a = a + 1;

      } while (a < config.end);

    }

    if (config.chars[a] === NWL) a = a - 1;

    output = build.join(NIL).replace(rx.WhitespaceEnd, NIL);

    return [ output, a ];

  }

  do {

    build.push(config.chars[a]);

    if (is(config.chars[a], ch.NWL)) parse.lineOffset = parse.lines(a, parse.lineOffset);
    if (
      config.chars[a] === term &&
      config.chars.slice(a - tlen, a + 1).join(NIL) === config.ender) break;

    a = a + 1;

  } while (a < config.end);

  output = build.join(NIL);

  if (regexIgnore.test(output) === true) return parseIgnoreComment();

  if (((
    isLiquid === true &&
    rules.liquid.preserveComment
  ) || (
    isLiquid === false &&
    rules.markup.preserveComment
  ) || (
    parse.lexer === 'style' &&
    rules.style.preserveComment
  ) || (
    parse.lexer === 'script' &&
    rules.style.preserveComment
  )) || (
    (
      (
        rules.wrap < 1 && (
          /comment\s*%}\n/.test(output) === false
        )
      ) ||
      a === config.end || (
        output.length <= rules.wrap &&
        output.indexOf(NWL) < 0
      )
    )
  ) || (
    config.begin === '/*' &&
    output.indexOf(NWL) > 0 &&
    output.replace(NWL, NIL).indexOf(NWL) > 0 &&
    /\n(?!\s*\*)/.test(output) === false
  )) {

    if (isLiquidLine) {

      lines = output.replace(/\r\n/g, NWL).split(NWL);

      for (let i = 1, l = lines.length - 1; i < l; i++) {
        if (not(lines[i].trimStart(), ch.HSH) && lines[i].trimStart() !== '') {
          lines[i] = '# ' + lines[i].trimStart();
        }
      }

      return [ lines.join(parse.crlf), a ];
    }

    return [ output, a ];

  }

  b = config.start;

  if (b > 0 && not(config.chars[b - 1], ch.NWL) && ws(config.chars[b - 1])) {
    do b = b - 1;
    while (b > 0 && not(config.chars[b - 1], ch.NWL) && ws(config.chars[b - 1]));
  }

  /**
   * Whitespace reference
   */
  const space = config.chars.slice(b, config.start).join(NIL);
  const spaceLine = new RegExp(NWL + space, 'g');

  lines = output.replace(/\r\n/g, NWL).replace(spaceLine, NWL).split(NWL);
  lsize = lines.length;
  lines[0] = lines[0].replace(regexStart, NIL);
  lines[lsize - 1] = lines[lsize - 1].replace(regexEnder, NIL);

  if (lsize < 2) lines = lines[0].split(WSP);

  if (lines[0] === NIL) {
    lines[0] = config.begin;
  } else {
    lines.splice(0, 0, config.begin);
  }

  lsize = lines.length;

  let nl = NIL;
  let bw = lsize - 1;

  while (bw--) if (lines[bw] === NIL) nl += NWL; else break;
  if (nl !== NIL) nl = nl.slice(0, rules.preserveLine);

  b = 0;

  do {

    bline = (b < lsize - 1) ? lines[b + 1].replace(rx.WhitespaceLead, NIL) : NIL;

    if (rx.EmptyLine.test(lines[b]) === true || lines[b] === NIL) {

      parseEmptyLines();

    } else {

      const strip = lines[b].replace(rx.WhitespaceLead, NIL);

      if (rules.wrap > 0 && strip.length > rules.wrap && strip.indexOf(WSP) > rules.wrap) {

        lines[b] = strip;

        c = lines[b].indexOf(WSP);

        store.push(lines[b].slice(0, c));
        lines[b] = lines[b].slice(c + 1);

        b = b - 1;

      } else {

        if (b < 1) {
          twrap = rules.wrap - (config.begin.length + 1);
        } else {
          twrap = rules.wrap;
        }

        if (config.begin === '/*' && lines[b].indexOf('/*') !== 0) {
          lines[b] = '   ';
        } else {
          lines[b] = lines[b]
            .replace(rx.WhitespaceLead, NIL)
            .replace(rx.WhitespaceEnd, NIL)
            .replace(rx.SpacesGlob, WSP);
        }

        d = lines[b].replace(rx.WhitespaceLead, NIL).indexOf(WSP);
        c = lines[b].length;

        if (c > twrap && d > 0 && d < twrap) {

          c = twrap;

          do {
            c = c - 1;
            if (ws(lines[b].charAt(c)) && c <= rules.wrap) break;
          } while (c > 0);

          if (rx.CommNumberLine.test(lines[b]) && rx.CommNumberLine.test(lines[b + 1]) === false) {

            lines.splice(b + 1, 0, '1. ');

          }

          if (rx.EmptyLine.test(lines[b + 1]) === true || lines[b + 1] === NIL) {

            store.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            emptyLine = true;
            b = b - 1;

          } else if (rx.CommBulletLine.test(lines[b + 1])) {

            store.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            bulletLine = true;
            b = b - 1;

          } else if (rx.CommNumberLine.test(lines[b + 1])) {

            store.push(lines[b].slice(0, c));
            lines[b] = lines[b].slice(c + 1);
            numberLine = true;
            b = b - 1;

          } else if (lines[b].replace(rx.WhitespaceLead, NIL).indexOf(WSP) < rules.wrap) {

            if (lines[b].length > rules.wrap) {
              lines[b + 1] = lines[b].slice(c + 1) + parse.crlf + lines[b + 1];
            } else {
              lines[b + 1] = lines[b].slice(c + 1) + WSP + lines[b + 1];
            }

          }

          if (emptyLine === false && bulletLine === false && numberLine === false) {
            lines[b] = lines[b].slice(0, c);
          }

        } else if (lines[b + 1] !== undefined && (
          (
            lines[b].length + bline.indexOf(WSP) > rules.wrap &&
            bline.indexOf(WSP) > 0
          ) || (
            lines[b].length + bline.length > rules.wrap &&
            bline.indexOf(WSP) < 0
          )
        )) {

          store.push(lines[b]);

          // PATCH 10/06/2023
          //
          // When wrap was set to `0` Liquid comments were not formatting correctly
          // which essentially led comment indentation being ignored. This ensures
          // that even when wrap is 0 that the comment content will still be passed.
          //
          if (rules.wrap !== 0) b = b + 1;

          emptyLine = true;

        } else if (
          b > 0 &&
          lines[b + 1] !== undefined &&
          lines[b + 1] !== NIL &&
          lines[b + 1].indexOf(WSP) < 0 &&
          rx.EmptyLine.test(lines[b + 1]) === false &&
          rx.CommLineChars.test(lines[b + 1]) === false
        ) {

          // LIQUID COMMENTS ARE AUGMENTED HERE

          lines[b + 1] = `${lines[b]} ${lines[b + 1]}`;
          emptyLine = true;

        } else {

          store.push(lines[b]);

          emptyLine = true;

        }

        bulletLine = false;
        numberLine = false;
      }
    }

    b = b + 1;

  } while (b < lsize);

  if (store.length > 0) {

    if (store[store.length - 1].length > rules.wrap - (config.ender.length + 1)) {

      store.push(config.ender);

    } else {

      store.push(nl + config.ender);

      // store[store.length - 1] = `${store[store.length - 1]} ${config.ender}`;

    }

    if (isLiquidLine) {
      for (let i = 1, l = store.length - 1; i < l; i++) {
        if (not(store[i], ch.HSH) && store[i] !== '') {
          store[i] = '# ' + store[i];
        }
      }
    }

    output = store.join(parse.crlf);

  } else {

    lines[lines.length - 1] = lines[lines.length - 1] + config.ender;
    output = lines.join(parse.crlf);
  }

  /* -------------------------------------------- */
  /* RETURN COMMENT                               */
  /* -------------------------------------------- */

  return [ output, a ];

}
