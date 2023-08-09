import { WrapComment } from 'types/index';
import { parse } from 'parse/parser';
import * as rx from 'lexical/regex';
import { cc as ch } from 'lexical/codes';
import { NWL, NIL, WSP } from 'chars';
import { sanitizeComment, ws, is, not, isOf } from 'utils/helpers';

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
  const { rules, data } = parse;

  /**
   * Deconstructed Config
   */
  const { start, begin, chars, lexer } = config;

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
  const sanitize = begin.replace(rx.CharEscape, sanitizeComment);

  /**
   * Whether or not we are dealing with a Liquid comment
   */
  const isLiquid = isOf(begin, ch.LCB, ch.PER);

  /**
   * Whether or not we are dealing with a Liquid Line comment
   */
  const isLiquidLine = isLiquid === false ? false : chars
    .slice(start + begin.length, chars.indexOf('%}', start + 2))
    .join(NIL)
    .trimStart()
    .charCodeAt(0) === ch.HSH;

  /**
   * Whether or not we are dealing with a HTML (markup) comment
   */
  const isHTML = lexer === 'markup' && isLiquid === false && isOf(begin, ch.LAN, ch.BNG);

  /**
   * Regular expression for ignore comment starters
   */
  const ignoreStart: RegExp = isLiquidLine
    ? new RegExp(`^(${sanitize}\\s*#\\s*esthetic-ignore-start)`)
    : new RegExp(`^(${sanitize}\\s*esthetic-ignore-start)`);

  /**
   * Regular expression for ignore comment next
   */
  const ignoreNext: RegExp = isLiquidLine
    ? new RegExp(`^(${sanitize}\\s*#\\s*esthetic-ignore-next)`)
    : new RegExp(`^(${sanitize}\\s*esthetic-ignore-next)`);

  /**
   * Regular expression start type comment blocks
   */
  const regexStart: RegExp = new RegExp(`(${sanitize}\\s*)`);

  /**
   * Regular Expression CRLF
   */
  const regexCRLF: RegExp = new RegExp(`${parse.crlf}`, 'g');

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
  let a = start;

  /**
   * Second reference to `a` used in the `parseNewlines`
   */
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
   * Newline characters
   */
  const nwl = NIL;

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
   * Spacing before used for ignores
   */
  let before = NIL;

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

  function parseCommentDelimiters (input: string) {

    if (isHTML && rules.markup.preserveComment === false) {

      if (rules.markup.commentDelimiters === 'consistent') {

        if (/^<!--\n/.test(input)) {
          if (!/\n-->$/.test(input)) input = input.replace(/-->$/, '\n-->');
        } else {
          if (/\n-->$/.test(input)) input = input.replace(/\n-->$/, ' -->');
        }

      } else if (rules.markup.commentDelimiters === 'force') {

        if (!/^<!--\n/.test(input)) input = input.replace(/^<!--/, '<!--\n');
        if (!/\s*\n-->$/.test(input)) input = input.replace(/\s*\n-->$/, '\n-->');

      } else if (rules.markup.commentDelimiters === 'inline') {

        input = input
          .replace(/^<!--\s*/, '<!-- ')
          .replace(/\s*-->$/, ' -->');

      }

    }

    return input;

  }

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
   * Ignore Comment Next
   *
   * Handles the `esthetic-ignore-next` ignore comment.
   * Ensures the leading whitespace is included in the
   * token comment.
   */
  function parseIgnoreNext (): [string, number] {

    output = build.join(NIL).replace(rx.WhitespaceEnd, NIL);

    if (data.lines[parse.count] > 1) {

      b = chars.lastIndexOf(NWL, parse.iterator) + 1;

      if (b > 0) {

        before = chars.slice(b, parse.iterator).join(NIL);

        if (before.trim() === NIL) {
          output = before + output;
        } else {
          before = before.slice(0, before.search(rx.NonSpace));
          output = before + output;
        }

      }

    }

    return [ output, a ];

  }

  /**
   * Ignore Comment Block
   *
   * Detects and traverses an ignore control type comment.
   * This function is handles `esthetic-ignore-start` and
   * `esthetic-ignore-end` comment blocks.
   */
  function parseIgnoreBlock (): [string, number] {

    let ender = NWL;

    a = a + 1;

    do {

      build.push(chars[a]);

      // Supports comment start/end comment ignores using Liquid
      // tags. We don't have any knowledge of the comment formation
      // upon parse, this will re-assign the terminator
      //
      // We check the last 5 characters before applying a join and
      // checking if the ignore comment has reached the end.
      //
      if (
        chars[a - 4] === 'e' &&
        chars[a - 3] === '-' &&
        chars[a - 2] === 'e' &&
        chars[a - 1] === 'n' &&
        chars[a] === 'd') {

        if (build.slice(build.length - 19).join(NIL) === 'esthetic-ignore-end') {
          if (isLiquid) {

            const d = chars.indexOf('{', a);

            if (is(chars[d + 1], ch.PER)) {
              const ender = chars.slice(d, chars.indexOf('}', d + 1) + 1).join(NIL);
              if (regexEnder.test(ender)) config.ender = ender;
            }
          }
        }

        a = a + 1;
        break;
      }

      a = a + 1;

    } while (a < config.end);

    b = a;

    tlen = begin.length - 1;
    term = begin.charAt(tlen);

    do {

      // Script OR Style Comment Blocks
      if (begin === '/*' && is(chars[b - 1], ch.FWS) && (
        is(chars[b], ch.ARS) ||
        is(chars[b], ch.FWS))) break;

      // Markup Comment Blocks
      if (
        begin !== '/*' &&
        chars[b] === term &&
        chars.slice(b - tlen, b + 1).join(NIL) === begin) break;

      b = b - 1;

    } while (b > start);

    if (begin === '/*' && is(chars[b], ch.ARS)) {
      ender = '\u002a/';
    } else if (begin !== '/*') {
      ender = config.ender;
    }

    tlen = ender.length - 1;
    term = ender.charAt(tlen);

    if (not(ender, ch.NWL) || not(chars[a], ch.NWL)) {
      do {

        build.push(chars[a]);

        if (is(ender, ch.NWL) && is(chars[a + 1], ch.NWL)) break;
        if (chars[a] === term && chars.slice(a - tlen, a + 1).join(NIL) === ender) break;

        a = a + 1;
      } while (a < config.end);
    }

    if (chars[a] === NWL) a = a - 1;

    output = build.join(NIL).replace(rx.WhitespaceEnd, NIL);

    if (ws(chars[parse.iterator - 1])) {

      const last = chars.lastIndexOf(NWL, parse.iterator);

      if (last > -1) {
        output = chars.slice(last + 1, parse.iterator).join(NIL) + output;
      }

    }

    return [ output, a ];

  }

  /**
   * Preserve Comment
   *
   * A series of conditionals to determine whether or not
   * the comment should be preserved or returned early without
   * out an additional handling.
   */
  function parsePreserve (): boolean {

    // Preserve when comment is last token
    //
    if (a === config.end) return true;

    // Preserve comments based on rules
    //
    if (
      (isLiquid && rules.liquid.preserveComment) ||
      (isHTML && rules.markup.preserveComment) ||
      (lexer === 'style' && rules.style.preserveComment) ||
      (lexer === 'script' && rules.script.preserveComment)) return true;

    // Preserve when wrap is not exceeded and no newlines exist
    //
    if (
      isLiquid === false &&
      output.length <= rules.wrap &&
      output.indexOf(NWL) < 0) return true;

    // Preserve Liquid block comments when inline
    if (
      rules.wrap < 1 &&
      isLiquid === true &&
      isLiquidLine === false &&
      rx.LiquidCommentNewline.test(output) === false) return true;

    // Preserve Liquid line comments when no newlines exist
    //
    if (
      rules.wrap < 1 &&
      isLiquidLine === true &&
      rx.Newline.test(output) === false) return true;

    // Preserve when wrap is not exceeded and now newlines exist
    if (
      rules.wrap > 0 &&
      output.length <= rules.wrap &&
      output.slice(5, -4).indexOf(NWL) < 0) return true;

    // Preserve when innner comment contents does not contain newlines
    if (
      isLiquid === false &&
      rules.wrap < 1 &&
      output.slice(5, -4).indexOf(NWL) < 0) return true;

    // Preserve Style and Script Comment Blocks
    if (
      begin === '/*' &&
      output.indexOf(NWL) > 0 &&
      output.replace(NWL, NIL).indexOf(NWL) > 0 &&
      rx.CommBlockNewline.test(output) === false) return true;

    // Additional Processing is required
    //
    return false;

  }

  /**
   * Parse Newlines
   *
   * Determines and decontructs comment newline occurances.
   * Assigns various lexical scopes in the process. Next function
   * we will handle special character occurances.
   */
  function parseNewlines (): void {

    b = start;

    if (
      b > 0 &&
      not(chars[b - 1], ch.NWL) &&
      ws(chars[b - 1])) {

      do b = b - 1;
      while (
        b > 0 &&
        not(chars[b - 1], ch.NWL) &&
        ws(chars[b - 1]));

    }

    /**
     * Newline + Whitespace match
     *
     * **TODO**
     *
     * This is used for `commentNewline` rule - This logic needs some
     * work as it's being repeated within markup formatter to an extend
     */
    const space = new RegExp(`\n${chars.slice(b, start).join(NIL)}`, 'g');

    lines = output.replace(regexCRLF, NWL).replace(space, NWL).split(NWL);
    lsize = lines.length;
    lines[0] = lines[0].replace(regexStart, NIL);
    lines[lsize - 1] = lines[lsize - 1].replace(regexEnder, NIL);

    if (lsize < 2) lines = lines[0].split(WSP);

    if (lines[0] === NIL) {
      lines[0] = begin;
    } else {
      lines.splice(0, 0, begin);
    }

    lsize = lines.length;

    let nl = NIL;
    let bw = lsize - 1;

    while (bw--) if (lines[bw] === NIL) nl += NWL; else break;

    if (nl !== NIL) nl = nwl.slice(0, rules.preserveLine);

    b = 0;

    // Comment Delimiters
    //
    // Applies inline structure when delimiter rule is set to consistent
    //
    if (
      isHTML === true &&
      rules.markup.commentDelimiters === 'consistent' &&
      /<!--\n/.test(output) === false) {

      lines[1] = `${begin} ${lines[1]}`;

      b = 1;

    }

  }

  /**
   * Parse Specials
   *
   * Detects special character structures within the comment and
   * formats them accordingly. This includes numbers, dash lists
   * and empty lines. Next function concludes the parse operations.
   */
  function parseSpecials (): void {

    /**
     * Replaced string stripped of whitespace and newlines
     */
    let strip: string;

    do {

      bline = NIL;

      if (b < lsize - 1) bline = lines[b + 1].replace(rx.SpaceLead, NIL);

      if (rx.EmptyLine.test(lines[b]) === true || lines[b] === NIL) {

        parseEmptyLines();

      } else {

        strip = lines[b].replace(rx.SpaceLead, NIL);

        if (
          rules.wrap > 0 &&
          strip.length > rules.wrap &&
          strip.indexOf(WSP) > rules.wrap) {

          lines[b] = strip;

          c = lines[b].indexOf(WSP);

          store.push(lines[b].slice(0, c));
          lines[b] = lines[b].slice(c + 1);

          b = b - 1;

        } else {

          if (b < 1) {
            twrap = rules.wrap - (begin.length + 1);
          } else {
            twrap = rules.wrap;
          }

          if (begin === '/*' && lines[b].indexOf('/*') !== 0) {

            lines[b] = '   ' + lines[b]
              .replace(rx.SpaceLead, NIL)
              .replace(rx.SpaceEnd, NIL)
              .replace(rx.SpacesGlob, WSP);

          } else {

            lines[b] = lines[b]
              .replace(rx.SpaceLead, NIL)
              .replace(rx.SpaceEnd, NIL)
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

            if (
              rx.CommNumberLine.test(lines[b]) === true &&
              rx.CommNumberLine.test(lines[b + 1]) === false) {

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

            } else if (lines[b].replace(rx.SpaceLead, NIL).indexOf(WSP) < rules.wrap) {

              if (lines[b].length > rules.wrap) {
                lines[b + 1] = lines[b].slice(c + 1) + parse.crlf + lines[b + 1];
              } else {
                lines[b + 1] = lines[b].slice(c + 1) + WSP + lines[b + 1];
              }

            }

            if (
              emptyLine === false &&
              bulletLine === false &&
              numberLine === false) lines[b] = lines[b].slice(0, c);

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
            if (rules.wrap > 0) b = b + 1;

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

  }

  /**
   * Parse Complete
   *
   * The final parse process. It is here where we will generate the
   * token entry to return with all formats applied. Some additional
   * handling will occur here for special comment types.
   */
  function parseComplete (): void {

    if (store.length > 0) {

      const glue: string = WSP;

      if (store[store.length - 1].length > rules.wrap - (config.ender.length + 1)) {

        store.push(config.ender);

      } else {

        store[store.length - 1] = `${store[store.length - 1]} ${config.ender}`;

      }

      if (isLiquidLine) {
        for (let i = 1, s = store.length - 1; i < s; i++) {
          if (not(store[i], ch.HSH) && store[i] !== NIL) store[i] = `# ${store[i]}`;
        }
      }

      if (isHTML) {

        if (rules.markup.commentDelimiters === 'inline') {

          output = `${store[0]} ${store.slice(1, -1).join(parse.crlf + '   ')} ${config.ender}`;

        } else if (rules.markup.commentDelimiters === 'consistent' && store[0].length > 4) {

          output = `${store.slice(0, -1).join(parse.crlf + '   ')} ${store.pop()}`;

        } else {

          output = store.join(parse.crlf);
        }

      } else {

        output = store.join(parse.crlf);

      }

    } else {

      lines[lines.length - 1] = lines[lines.length - 1] + config.ender;
      output = lines.join(parse.crlf);

    }

  }

  /* -------------------------------------------- */
  /* LEXING                                       */
  /* -------------------------------------------- */

  do {

    build.push(chars[a]);

    // Newline Increments
    //
    if (is(chars[a], ch.NWL)) parse.lineOffset = parse.lines(a, parse.lineOffset);

    // Comment Token
    //
    if (chars[a] === term && chars.slice(a - tlen, a + 1).join(NIL) === config.ender) {

      output = parseCommentDelimiters(build.join(NIL));

      break;
    }

    a = a + 1;

  } while (a < config.end);

  /* -------------------------------------------- */
  /* PARSING                                      */
  /* -------------------------------------------- */

  if (ignoreStart.test(output)) return parseIgnoreBlock();
  if (ignoreNext.test(output)) return parseIgnoreNext();
  if (parsePreserve()) return [ output, a ];

  parseNewlines();
  parseSpecials();
  parseComplete();

  return [ output, a ];

}
