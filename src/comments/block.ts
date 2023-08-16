import { Comments } from 'types';
import { parse } from 'parse/parser';
import * as rx from 'lexical/regex';
import { cc as ch } from 'lexical/codes';
import { Comm } from 'lexical/enum';
import { NWL, NIL, WSP } from 'chars';
import { charEsc, ws, is, not, liquidEsc } from 'utils/helpers';

/**
 * Comment Block Parser
 *
 * Beautification and handling for block style comments. This is used
 * across all lexers and will determine the comment type and how it
 * should be dealt with. Liquid line type comment (e.g: `{% # %}`) will
 * also pass through here as these comment can span multiple lines.
 *
 * The function contains a series of functions and will return a string
 * token ([0]) and the new index position ([1]). The string token will
 * be populated in the parse table.
 */
export function commentBlock (chars: string[], config: Comments): [string, number] {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * Delimiter handling for markup HTML comments
   */
  enum Delimiters { Force, Inline, Preserve }

  /**
   * Deconstructed Config
   */
  const { start, begin, lexer, end } = config;

  /**
   * Deconstructed  Parse
   */
  const { rules, data } = parse;

  /**
   * The composed output structure
   */
  const build: string[] = [];

  /**
   * The type of block comment we are handling
   */
  const type = comment();

  /**
   * Sanatized opening delimiter sequence
   */
  const sanitize = begin.replace(rx.CharEscape, charEsc) + ((type === Comm.LiquidLine) ? '\\s*#\\s*' : '\\s*');

  /**
   * Regular expression for ignore comment starters
   */
  const ignoreStart: RegExp = new RegExp(`^(${sanitize}esthetic-ignore-start)`);

  /**
   * Regular expression for ignore comment next
   */
  const ignoreNext: RegExp = new RegExp(`^(${sanitize}esthetic-ignore-next)`);

  /**
   * Regular Expression CRLF
   */
  const regexCRLF: RegExp = new RegExp(parse.crlf, 'g');

  /**
   * Regular expression start type comment blocks
   */
  const regexStart: RegExp = new RegExp(`(${sanitize})`);

  /**
   * Liquid ending expression
   */
  const regexEnder: RegExp = (type === Comm.LiquidBlock || type === Comm.LiquidLine)
    ? new RegExp(`\\s*${config.ender.replace(rx.LiquidDelimiters, liquidEsc)}$`)
    : new RegExp(config.ender.replace(rx.CharEscape, charEsc));

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Starting index offset of the comment, i.e: value of `config.start`
   */
  let a = start;

  /**
   * Before comment index offset `a` used in the `parseComment` which will indexes before comment
   */
  let b = 0;
  let c = 0;
  let d = 0;

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

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

  /**
   * Comment Type
   *
   * Returns a enum reference which informs upon the type of comment
   */
  function comment () {

    if (is(begin[0], ch.LCB) && is(begin[1], ch.PER)) {

      return chars
        .slice(start + begin.length, chars.indexOf('%}', start + 2))
        .join(NIL)
        .trimStart()
        .charCodeAt(0) === ch.HSH ? Comm.LiquidLine : Comm.LiquidBlock;
    }

    return begin === '/*' ? Comm.Block : Comm.Markup;

  }

  function delimiters () {

    if (type !== Comm.Markup) return false;

    if (rules.markup.commentDelimiters === 'consistent') {

      return is(output.slice(4).replace(rx.WhitespaceLead, NIL), ch.NWL)
        ? [ Delimiters.Force, Delimiters.Force ]
        : [ Delimiters.Inline, Delimiters.Inline ];

    } else if (rules.markup.commentDelimiters === 'force') {

      return [ Delimiters.Force, Delimiters.Force ];

    } else if (rules.markup.commentDelimiters === 'inline' || rules.markup.commentDelimiters === 'inline-align') {

      return [ Delimiters.Inline, Delimiters.Inline ];

    } else if (rules.markup.commentDelimiters === 'preserve') {

      const delim: Delimiters[] = [];

      if (is(output.slice(4).replace(rx.WhitespaceLead, NIL), ch.NWL)) {
        delim.push(Delimiters.Force);
      } else {
        delim.push(Delimiters.Inline);
      }

      if (output.slice(output.lastIndexOf(NWL) + 1).trimStart() === config.ender) {
        delim.push(Delimiters.Force);
      } else {
        delim.push(Delimiters.Inline);
      }

      return delim;

    }

  }

  function parseInlineComment (): [string, number] {

    if (type === Comm.Markup && rules.markup.preserveComment === false) {

      if (rules.markup.commentDelimiters === 'consistent') {

        if (is(output.slice(4).replace(rx.WhitespaceLead, NIL), ch.NWL)) {
          if (rules.markup.commentIndent) {
            output = output.replace(/^<!--\s*/, '<!--\n  ').replace(/\s*-->$/, '\n-->');
          } else {
            output = output.replace(/^<!--\s*/, '<!--\n').replace(/\s*-->$/, '\n-->');
          }
        } else {
          output = output.replace(/^<!--\s*/, '<!-- ').replace(/\s*-->$/, ' -->');
        }

      } else if (rules.markup.commentDelimiters === 'force') {

        if (rules.markup.commentIndent) {
          output = output.replace(/^<!--\s*/, '<!--\n  ').replace(/\s*-->$/, '\n-->');
        } else {
          output = output.replace(/^<!--\s*/, '<!--\n').replace(/\s*-->$/, '\n-->');
        }

      } else if (rules.markup.commentDelimiters === 'inline' || rules.markup.commentDelimiters === 'inline-align') {

        output = output.replace(/^<!--\s*/, '<!-- ').replace(/\s*-->$/, ' -->');

      } else {

        if (is(output.slice(4).replace(rx.WhitespaceLead, NIL), ch.NWL)) {
          if (rules.markup.commentIndent) {
            output = output.replace(/^<!--\s*/, '<!--\n  ');
          } else {
            output = output.replace(/^<!--\s*/, '<!--\n');
          }
        } else {
          output = output.replace(/^<!--\s*/, '<!-- ');
        }

        if (output.slice(output.lastIndexOf(NWL) + 1).trimStart() === config.ender) {
          if (rules.markup.commentIndent) {
            output = output.replace(/\s*-->$/, '\n-->');
          } else {
            output = output.replace(/\s*-->$/, '\n-->');
          }
        } else {
          output = output.replace(/\s*-->$/, ' -->');
        }

      }

    }

    return [ output, a ];

  }

  /**
   * Ignore Comment Next
   *
   * Handles the `esthetic-ignore-next` ignore comment.
   * Ensures the leading whitespace is included in the
   * token comment.
   */
  function parseIgnoreNext (): [string, number] {

    /* -------------------------------------------- */
    /* LEXICAL SCOPES                               */
    /* -------------------------------------------- */

    /**
     * Spacing before used for ignores
     */
    let before = NIL;

    /**
     * Comment output as a string
     */
    let output = build.join(NIL).replace(rx.WhitespaceEnd, NIL);

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    // The following logic will obtain before line reference
    // because inline comment ignores will be preserved (excluded)
    // from formatting. Only when the previous entry of the parse
    // table exists and has more than 1 lines will this logic incur.
    //
    if ((parse.count > -1 && data.lines[parse.count] > 0)) {

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

    /* -------------------------------------------- */
    /* LEXICAL SCOPES                               */
    /* -------------------------------------------- */

    /**
     * Comment ender delimiter reference
     */
    let ender = NWL;

    /* -------------------------------------------- */
    /* TRAVERSE                                     */
    /* -------------------------------------------- */

    a = a + 1;

    do {

      build.push(chars[a]);

      // Liquid comment block
      //
      // Supports comment start/end comment ignores using Liquid
      // tags. We don't have any knowledge of the comment formation
      // upon parse, this will re-assign the terminator
      //
      // We check the last 5 characters before applying a join and
      // checking if the ignore comment has reached the end.
      //
      if (
        chars[a - 3] === '-' &&
        chars[a - 2] === 'e' &&
        chars[a - 1] === 'n' &&
        chars[a] === 'd') {

        if (build.slice(build.length - 19).join(NIL) === 'esthetic-ignore-end') {
          if (type === Comm.LiquidBlock) {
            const delim = chars.indexOf('{', a) + 1;
            if (is(chars[delim], ch.PER)) {
              const endcomm = chars.slice(d, chars.indexOf('}', delim) + 1).join(NIL);
              if (regexEnder.test(endcomm)) config.ender = endcomm;
            }
          }

          a = a + 1;
          break;
        }
      }

      a = a + 1;
    } while (a < end);

    b = a;
    tlen = begin.length - 1;
    term = begin.charAt(tlen);

    do {
      if (type === Comm.Block && is(chars[b - 1], ch.FWS) && is(chars[b], ch.ARS)) break;
      if (chars[b] === term && chars.slice(b - tlen, b + 1).join(NIL) === begin) break;
      b = b - 1;
    } while (b > start);

    if (type === Comm.Block && is(chars[b], ch.ARS)) {
      ender = '*/';
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
      } while (a < end);
    }

    if (is(chars[a], ch.NWL)) a = a - 1;

    output = build.join(NIL).replace(rx.WhitespaceEnd, NIL);

    if (ws(chars[parse.iterator - 1])) {
      const last = chars.lastIndexOf(NWL, parse.iterator);
      if (last > -1) output = chars.slice(last + 1, parse.iterator).join(NIL) + output;
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
    if (a === end) return true;

    // Preserve comments based on rules
    //
    if (
      (type === Comm.LiquidBlock && rules.liquid.preserveComment) ||
      (type === Comm.LiquidLine && rules.liquid.preserveComment) ||
      (type === Comm.Markup && rules.markup.preserveComment)) {

      output = build.join(NIL).replace(rx.WhitespaceEnd, NIL);

      if (ws(chars[parse.iterator - 1])) {
        const last = chars.lastIndexOf(NWL, parse.iterator);
        if (last > -1) output = chars.slice(last + 1, parse.iterator).join(NIL) + output;
      }

      return true;

    }

    if (
      (type === Comm.Block && lexer === 'style' && rules.style.preserveComment) ||
      (type === Comm.Block && lexer === 'script' && rules.script.preserveComment)) return true;

    // Preserve when wrap is not exceeded and no newlines exist
    //
    if (
      type !== Comm.LiquidBlock &&
      type !== Comm.LiquidLine &&
      output.length <= rules.wrap &&
      output.indexOf(NWL) < 0) return true;

    // Preserve Liquid block comments when inline
    if (
      rules.wrap < 1 &&
      type === Comm.LiquidBlock &&
      rx.LiquidCommentNewline.test(output) === false) return true;

    // Preserve Liquid line comments when no newlines exist
    //
    if (
      rules.wrap < 1 &&
      type === Comm.LiquidLine &&
      rx.Newline.test(output) === false) return true;

    // Preserve when wrap is not exceeded and now newlines exist
    if (
      rules.wrap > 0 &&
      output.length <= rules.wrap &&
      output.slice(5, -4).indexOf(NWL) < 0) return true;

    // Preserve when innner comment contents does not contain newlines
    if (
      rules.wrap < 1 &&
      type !== Comm.LiquidBlock &&
      type !== Comm.LiquidLine &&
      output.slice(5, -4).indexOf(NWL) < 0) return true;

    // Preserve Style and Script Comment Blocks
    if (
      type === Comm.Block &&
      output.indexOf(NWL) > 0 &&
      output.replace(NWL, NIL).indexOf(NWL) > 0 &&
      rx.CommBlockNewline.test(output) === false) return true;

    // Additional Processing is required
    //
    return false;

  }

  /**
   * Parse Comment
   *
   * Determines and decontructs comment newline occurances.
   * Assigns various lexical scopes in the process. Next function
   * we will handle special character occurances.
   */
  function parseComment (): [string, number] {

    /* -------------------------------------------- */
    /* LEXICAL CONTEXT                              */
    /* -------------------------------------------- */

    /**
     * Comment contents split on newlines
     */
    let lines: string[] = [];

    /* -------------------------------------------- */
    /* LEXICAL SCOPES                               */
    /* -------------------------------------------- */

    /**
     * The length of `lines[]`
     */
    let lsize: number = 0;

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    b = start;

    if (b > 0 && not(chars[b - 1], ch.NWL) && ws(chars[b - 1])) {
      do b = b - 1;
      while (b > 0 && not(chars[b - 1], ch.NWL) && ws(chars[b - 1]));
    }

    /**
     * Newline + Whitespace match
     */
    const before = new RegExp(`\n${chars.slice(b, start).join(NIL)}`, 'g');

    lines = output
      .replace(regexCRLF, NWL)
      .replace(before, NWL)
      .split(NWL);

    lsize = lines.length;
    lines[0] = lines[0].replace(regexStart, NIL);
    lines[lsize - 1] = lines[lsize - 1].replace(regexEnder, NIL);

    // When less than 2 the comment is comprised in a single
    // line and thus we need to determine handling based on
    // wrap length, so we will split on every whitespace
    //
    if (lsize < 2) lines = lines[0].split(WSP);
    if (lines[0] === NIL) {
      lines[0] = begin;
    } else {
      lines.splice(0, 0, begin);
    }

    lsize = lines.length;

    return parseSpecials(lines, lsize);

  }

  /**
   * Parse Specials
   *
   * Detects special character structures within the comment and
   * formats them accordingly. This includes numbers, dash lists
   * and empty lines. Next function concludes the parse operations.
   */
  function parseSpecials (lines: string[], lsize: number): [string, number] {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    /**
     * An additional composed structure
    */
    const lexed: string[] = [];

    /* -------------------------------------------- */
    /* LEXICAL SCOPES                               */
    /* -------------------------------------------- */

    /**
     * Terminator wrap length
     */
    let twrap: number = 0;

    /**
     * Replaced string stripped of whitespace and newlines
     */
    let strip: string;

    /**
     * Before Line reference
     */
    let before: string;

    /**
     * Whether or not empty line is contained
     */
    let emptyLine: boolean = false;

    /**
     * Whether or not bullet point lines are contained
     */
    let bulletLine: boolean = false;

    /**
     * Whether or not numbered lines are contained
     */
    let numberLine: boolean = false;

    /* -------------------------------------------- */
    /* TRAVERSE                                     */
    /* -------------------------------------------- */

    b = 0;

    do {

      before = NIL;

      if (b < lsize - 1) before = lines[b + 1].replace(rx.SpaceLead, NIL);

      if (rx.EmptyLine.test(lines[b]) === true || lines[b] === NIL) {

        if (lines[b + 1] === NIL || rx.EmptyLine.test(lines[b + 1])) {
          do b = b + 1;
          while (b < lsize && (lines[b + 1] === NIL || rx.EmptyLine.test(lines[b + 1])));
        }

        if (b < lsize - 1) lexed.push(NIL);

      } else {

        strip = lines[b].replace(rx.SpaceLead, NIL);

        if (
          rules.wrap > 0 &&
          strip.length > rules.wrap &&
          strip.indexOf(WSP) > rules.wrap) {

          lines[b] = strip;

          c = lines[b].indexOf(WSP);

          lexed.push(lines[b].slice(0, c));
          lines[b] = lines[b].slice(c + 1);

          b = b - 1;

        } else {

          if (b < 1) {
            twrap = rules.wrap - (begin.length + 1);
          } else {
            twrap = rules.wrap;
          }

          if (type === Comm.Block && lines[b].indexOf('/*') !== 0) {

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

            if (rx.CommNumberLine.test(lines[b]) === true && rx.CommNumberLine.test(lines[b + 1]) === false) {

              lines.splice(b + 1, 0, '1. ');

            }

            if (rx.EmptyLine.test(lines[b + 1]) === true || lines[b + 1] === NIL) {

              lexed.push(lines[b].slice(0, c));
              lines[b] = lines[b].slice(c + 1);
              emptyLine = true;
              b = b - 1;

            } else if (rx.CommBulletLine.test(lines[b + 1])) {

              lexed.push(lines[b].slice(0, c));
              lines[b] = lines[b].slice(c + 1);
              bulletLine = true;
              b = b - 1;

            } else if (rx.CommNumberLine.test(lines[b + 1])) {

              lexed.push(lines[b].slice(0, c));
              lines[b] = lines[b].slice(c + 1);
              numberLine = true;
              b = b - 1;

            } else if (lines[b].replace(rx.SpaceLead, NIL).indexOf(WSP) < rules.wrap) {

              if (lines[b].length > rules.wrap) {
                lines[b + 1] = `${lines[b].slice(c + 1)}${parse.crlf}${lines[b + 1]}`;
              } else {
                lines[b + 1] = `${lines[b].slice(c + 1)} ${lines[b + 1]}`;
              }

            }

            if (
              emptyLine === false &&
              bulletLine === false &&
              numberLine === false) lines[b] = lines[b].slice(0, c);

          } else if (lines[b + 1] !== undefined && (
            (
              lines[b].length + before.indexOf(WSP) > rules.wrap &&
              before.indexOf(WSP) > 0
            ) || (
              lines[b].length + before.length > rules.wrap &&
              before.indexOf(WSP) < 0
            )
          )) {

            lexed.push(lines[b]);

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

            lexed.push(lines[b]);
            emptyLine = true;
          }

          bulletLine = false;
          numberLine = false;
        }
      }

      b = b + 1;

    } while (b < lsize);

    /* -------------------------------------------- */
    /* PARSE COMPLETE                               */
    /* -------------------------------------------- */

    const delims = delimiters();

    if (lexed && lexed.length > 0) {

      if (delims) {

        if (delims[0] === Delimiters.Inline) {
          if (rules.markup.commentIndent) {
            if (rules.markup.commentDelimiters === 'inline-align') {
              output = `${lexed[0]} ${lexed.slice(1).join(parse.crlf + '     ')}`;
            } else {
              output = `${lexed[0]} ${lexed.slice(1).join(parse.crlf + '  ')}`;
            }
          } else {
            output = `${lexed[0]} ${lexed.slice(1).join(parse.crlf)}`;
          }
        } else {
          if (rules.markup.commentIndent) {
            output = `${lexed[0] + NWL}  ${lexed.slice(1).join(parse.crlf + '  ')}`;
          } else {
            output = `${lexed[0] + NWL}  ${lexed.slice(1).join(parse.crlf)}`;
          }
        }

        if (delims[1] === Delimiters.Inline) {
          output += ` ${config.ender}`;
        } else {
          output += NWL + config.ender;
        }

      } else {

        if (lexed[lexed.length - 1].length > rules.wrap - (config.ender.length + 1)) {
          lexed.push(config.ender);
        } else if (type === Comm.LiquidBlock) {
          lexed.push(config.ender);
        } else {
          lexed[lexed.length - 1] = `${lexed[lexed.length - 1]} ${config.ender}`;
        }

        if (type === Comm.LiquidLine) {
          for (let i = 1, s = lexed.length - 1; i < s; i++) {
            if (not(lexed[i], ch.HSH) && lexed[i] !== NIL) lexed[i] = `# ${lexed[i]}`;
          }
        }

        output = lexed.join(parse.crlf);

      }

    } else {

      if (delims) {

        if (delims[0] === Delimiters.Inline) {

          if (rules.markup.commentIndent) {
            if (rules.markup.commentDelimiters === 'inline-align') {
              output = `${lines[0]} ${lines.slice(1).join(parse.crlf + '     ')}`;
            } else {
              output = `${lines[0]} ${lines.slice(1).join(parse.crlf + '  ')}`;
            }
          } else {
            output = `${lines[0]} ${lines.slice(1).join(parse.crlf)}`;
          }

        } else {

          if (rules.markup.commentIndent) {
            output = `${lines[0] + NWL}  ${lines.slice(1).join(parse.crlf + '  ')}`;
          } else {
            output = lines.join(parse.crlf);
          }
        }

        if (delims[1] === Delimiters.Inline) {
          output += ` ${config.ender}`;
        } else {
          output += NWL + config.ender;
        }

      } else {

        lsize = lines.length - 1;
        lines[lsize] = lines[lsize] + config.ender;
        output = lines.join(parse.crlf);

      }

    }

    return [ output, a ];

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
      output = build.join(NIL);
      break;
    }

    a = a + 1;
  } while (a < end);

  /* -------------------------------------------- */
  /* PARSE IGNORE                                 */
  /* -------------------------------------------- */

  if (ignoreStart.test(output)) return parseIgnoreBlock();
  if (ignoreNext.test(output)) return parseIgnoreNext();

  /* -------------------------------------------- */
  /* PARSE PRESERVE                               */
  /* -------------------------------------------- */

  if (parsePreserve()) return parseInlineComment();

  /* -------------------------------------------- */
  /* PARSE COMMENT                                */
  /* -------------------------------------------- */

  return parseComment();

}
