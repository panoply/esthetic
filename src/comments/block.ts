import { Comments } from 'types';
import { parse } from 'parse/parser';
import { cc as ch } from 'lexical/codes';
import { CommentType } from 'lexical/enum';
import { NWL, NIL, WSP, BIG, MID } from 'chars';
import { charEsc, ws, is, not, liquidEsc } from 'utils/helpers';
import * as rx from 'lexical/regex';
import * as lq from 'lexical/liquid';

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
  const { start, lexer, end } = config;

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
  const type = getCommentType();

  /**
   * Sanatized opening delimiter sequence
   */
  const sanitize = config.begin.replace(rx.CharEscape, charEsc);

  /**
   * Delimiter prefix for ignore comments
   */
  const prefix = type !== CommentType.LiquidLine ? sanitize : `${config.begin}\\s*#`;

  /**
   * Regular expression for ignore comment starters
   */
  const ignoreStart: RegExp = new RegExp(`^(${prefix}\\s*esthetic-ignore-start)`);

  /**
   * Regular expression for ignore comment next
   */
  const ignoreNext: RegExp = new RegExp(`^(${prefix}\\s*esthetic-ignore-next)`);

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
  let regexEnder: RegExp = type > 2
    ? new RegExp(config.ender.replace(rx.LiquidDelimiters, liquidEsc))
    : new RegExp(config.ender.replace(rx.CharEscape, charEsc));

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Starting index offset of the comment, i.e: value of `config.start`
   */
  let a = start;

  /**
   * Before comment index offset `a` used in `parseComment` which will indexes before comment
   */
  let b = 0;

  /**
   * Holds various index offsets - Despite the name `c` being the split in lexers, here `c` = `cache`
   */
  let c = 0;

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
  function getCommentType () {

    if (is(config.begin[0], ch.LCB) && is(config.begin[1], ch.PER)) {
      return chars
        .slice(start + config.begin.length, chars.indexOf('}', start))
        .join(NIL)
        .trimStart()
        .charCodeAt(0) === ch.HSH ? CommentType.LiquidLine : CommentType.LiquidBlock;
    }

    return config.begin === '/*' ? CommentType.Block : CommentType.Markup;

  }

  /* -------------------------------------------- */
  /* RULE FUNCTIONS                               */
  /* -------------------------------------------- */

  /**
   * Comment Delimiters Rule (Multiline)
   *
   * Determines the delimiter placement of HTML (Markup) comments and returns
   * an array enum describing the opening and closing structures. This function
   * is used exclusively for the `markup.commentDelimiters` rule and will return
   * boolean `false` if `CommentType` type does not equal `Markup`
   */
  function onHTMLDelimiters () {

    if (type !== CommentType.Markup) return false;

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

  /**
   * Comment Delimiters Rule (Inline)
   *
   * Applied the same logic as `onHTMLDelimiters` but used for comments
   * that do **not** span multiple newlines. The difference is that this function will
   * use regular expression replacements to apply the rule. This function is used
   * exclusively for the `markup.commentDelimiters` rule and any non markup identified
   * comment types will pass through untouched.
   */
  function onCommentDelimitersInline (): [string, number] {

    if (type === CommentType.Markup && rules.markup.preserveComment === false) {

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
   * Liquid Line Comment (Post-Processing)
   *
   * Liquid Line Comments require additional processing given that their formation can
   * vary. The tokens respect additional rulesets such as `delimiterPlacement` and
   * `delimiterTrims`. It's here where we build out the final parse table entry.
   */
  function onLiquidLineComment (lexed: string[]): [string, number] {

    /* -------------------------------------------- */
    /* LEXICAL SCOPE                                */
    /* -------------------------------------------- */

    b = 0;

    if (rules.wrap > 0) {

      lexed.splice(0, 1, config.begin, lexed[0].replace(regexStart, NIL).trim());

      c = 1;
      b = 1;

      while (lexed[c] === NIL) lexed.splice(c, 1);

    } else {

      c = -1;

      do c = c + 1;
      while ((lexed[c] === NIL) || (is(lexed[c], ch.HSH) && lexed[c].length === 1));

      lexed.splice(0, c);

    }

    for (let s = lexed.length; b < s; b++) {
      if (not(lexed[b], ch.HSH) && lexed[b] !== NIL) {
        lexed[b] = `# ${lexed[b].trimEnd()}`;
      }
    }

    if (rules.wrap > 0) {

      lexed.push(`#${lexed.pop().trim().slice(1)}`, config.ender);

    } else {

      lexed.splice(0, 0, config.begin);

      c = lexed.length;
      do c = c - 1;
      while ((lexed[c] === NIL) || (is(lexed[c], ch.HSH) && lexed[c].length === 1));

      lexed.splice(c + 1, lexed.length - c);
      lexed.push(`#${lexed.pop().trim().slice(1)}`, config.ender);

    }

    output = lexed.join(parse.crlf);

    if (rules.liquid.commentIndent === false) {
      output = output.replace(/^#/gm, ' #');
    }

    return [ output, a ];

  }

  /* -------------------------------------------- */
  /* PARSE FUNCTIONS                              */
  /* -------------------------------------------- */

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
    output = build.join(NIL).replace(rx.WhitespaceEnd, NIL);

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

      // Newline Increment
      //
      if (is(chars[a], ch.NWL)) parse.lineOffset = parse.lines(a, parse.lineOffset);

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

          if (type === CommentType.LiquidBlock) {

            c = chars.indexOf('{', a);

            if (is(chars[c + 1], ch.PER)) {

              ender = chars.slice(c, chars.indexOf('}', c) + 1).join(NIL);

              if (regexEnder.test(ender)) config.ender = ender;

            }
          }

          a = a + 1;

          ender = NIL;
          break;
        }
      }

      a = a + 1;
    } while (a < end);

    b = a;
    tlen = config.begin.length - 1;
    term = config.begin.charAt(tlen);

    do {
      if (type === CommentType.Block && is(chars[b - 1], ch.FWS) && is(chars[b], ch.ARS)) break;
      if (chars[b] === term && chars.slice(b - tlen, b + 1).join(NIL) === config.begin) break;
      b = b - 1;
    } while (b > start);

    if (type === CommentType.Block && is(chars[b], ch.ARS)) {
      ender = '*/';
    } else if (ender === NIL && type !== CommentType.Block) {
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

    output = build.join(NIL).replace(rx.SpaceEnd, NIL);

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
      (type === CommentType.LiquidBlock && rules.liquid.preserveComment) ||
      (type === CommentType.LiquidLine && rules.liquid.preserveComment) ||
      (type === CommentType.Markup && rules.markup.preserveComment)) {

      b = chars.lastIndexOf(NWL, parse.iterator) + 1;

      if (b > 0) {

        let before = chars.slice(b, parse.iterator).join(NIL);

        if (before.trim() === NIL) {
          output = before + output;
        } else {
          before = before.slice(0, before.search(rx.NonSpace));
          output = before + output;
        }

      }

      return true;

    }

    if (
      (type === CommentType.Block && lexer === 'style' && rules.style.preserveComment) ||
      (type === CommentType.Block && lexer === 'script' && rules.script.preserveComment)) return true;

    // Preserve when wrap is not exceeded and no newlines exist
    //
    if (
      type !== CommentType.LiquidBlock &&
      type !== CommentType.LiquidLine &&
      output.length <= rules.wrap &&
      output.indexOf(NWL) < 0) return true;

    // Preserve Liquid block comments when inline
    if (
      rules.wrap < 1 &&
      type === CommentType.LiquidBlock &&
      rx.LiquidCommentNewline.test(output) === false) {

      return true;

    }
    // Preserve Liquid line comments when no newlines exist
    //
    if (type === CommentType.LiquidLine) {

      if (rules.wrap > 0 && output.length >= rules.wrap) return false;

      if (rx.Newline.test(output)) {

        // Liquid Line Comment contains newline which we will respect
        // We return a boolean false to forward handling on
        //
        if (rx.LiquidLineCommForce.test(output)) return false;

        // Liquid Line Comment contains newline at the ending delimiter
        // point. We don't respect these structures, but some futher investigation
        // should be had to see if newlines exist before this occurance
        //
        if (rx.LiquidEndDelimiterNewline.test(output)) {
          if (output.slice(output.indexOf('#') + 1, output.lastIndexOf(NWL)).indexOf(NWL) < 0) {

            output = output
              .replace(rx.Newlines, NIL)
              .replace(rx.LiquidLeftDelimiter, '$1 ')
              .replace(rx.LiquidLineCommentHash, '# ')
              .replace(rx.LiquidRightDelimiter, ' $2');

            return true;

          }
        }

      } else {

        output = output
          .replace(rx.LiquidLeftDelimiter, '$1 ')
          .replace(rx.LiquidLineCommentHash, '# ')
          .replace(rx.LiquidRightDelimiter, ' $2');

        return true;
      }

      return false;

    }

    // Preserve when wrap is not exceeded and no newlines exist
    if (
      rules.wrap > 0 &&
      output.length <= rules.wrap &&
      output.slice(5, -4).indexOf(NWL) < 0) {

      return true;

    }
    // Preserve when innner comment contents does not contain newlines
    if (
      rules.wrap < 1 &&
      type !== CommentType.LiquidBlock &&
      output.slice(5, -4).indexOf(NWL) < 0) return true;

    // Preserve Style and Script Comment Blocks
    if (
      type === CommentType.Block &&
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
    const regexLead = new RegExp(`\n${chars.slice(b, start).join(NIL)}`, 'g');

    /* -------------------------------------------- */
    /* STARTING DELIMITER                           */
    /* -------------------------------------------- */

    output = output
      .replace(regexCRLF, NWL)
      .replace(regexLead, NWL);

    lines = output.split(NWL);

    lsize = lines.length;
    lines[0] = lines[0].replace(regexStart, NIL);
    lines[lsize - 1] = lines[lsize - 1].replace(regexEnder, NIL);

    if (type === CommentType.LiquidLine && rules.wrap < 1) {
      lines = lines.map((line) => line.replace(/^#\s*/m, NIL).trimStart());
      return onLiquidLineComment(lines);
    }

    // When less than 2 the comment is comprised of a single
    // line and thus we need to determine handling based on
    // wrap length, so we will split on every whitespace
    //
    if (lsize < 2) lines = lines[0].split(WSP);

    if (type === CommentType.LiquidBlock) {

      if (lines[0] === NIL) {
        lines[0] = config.begin;
      } else {
        lines.splice(0, 0, config.begin);
      }

    } else {

      if (lines[0] === NIL) {
        lines[0] = config.begin;
      } else {
        lines.splice(0, 0, config.begin);
      }
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
     * The first known index offset used in `parseComment` after striping out leading whitespace
     */
    let d = 0;

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

    /**
     * Whether or not big line is contained
     */
    let bigLine: boolean = false;

    /* -------------------------------------------- */
    /* TRAVERSE                                     */
    /* -------------------------------------------- */

    b = 0;

    do {

      before = (b < lsize - 1) ? lines[b + 1].replace(rx.WhitespaceLead, NIL) : NIL;

      if (rx.EmptyLine.test(lines[b]) === true || lines[b] === NIL) {

        if (rx.EmptyLine.test(lines[b + 1]) === true || lines[b + 1] === NIL) {
          do b = b + 1;
          while (b < lsize && (rx.EmptyLine.test(lines[b + 1]) === true || lines[b + 1] === NIL));
        }

        if (b < lsize - 1) lexed.push(NIL);

      } else {

        strip = lines[b].replace(rx.WhitespaceLead, NIL);

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

          if (type === CommentType.Block && lines[b].indexOf('/*') !== 0) {

            lines[b] = MID + lines[b]
              .replace(rx.WhitespaceLead, NIL)
              .replace(rx.WhitespaceEnd, NIL)
              .replace(rx.SpacesGlob, WSP);

          } else {

            lines[b] = lines[b]
              .replace(rx.WhitespaceLead, NIL)
              .replace(rx.WhitespaceEnd, NIL)
              .replace(rx.SpacesGlob, WSP);

          }

          twrap = (b < 1) ? rules.wrap - (config.begin.length + 1) : rules.wrap;

          d = lines[b].replace(rx.SpaceLead, NIL).indexOf(WSP);
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

            if (c < 4) {

              lexed.push(lines[b]);
              bigLine = true;

            } else if (b === lsize - 1) {

              lexed.push(lines[b].slice(0, c));
              lines[b] = lines[b].slice(c + 1);
              bigLine = true;
              b = b - 1;

            } if (rx.EmptyLine.test(lines[b + 1]) === true || lines[b + 1] === NIL) {

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

            } else if (lines[b + 1].slice(0, 4) === BIG) {

              lexed.push(lines[b].slice(0, c));
              lines[b] = lines[b].slice(c + 1);
              bigLine = true;
              b = b - 1;

            } else if (c + before.length > rules.wrap && before.indexOf(WSP) < 0) {

              lexed.push(lines[b].slice(0, c));
              lines[b] = lines[b].slice(c + 1);
              bigLine = true;
              b = b - 1;

            } else if (lines[b].replace(rx.WhitespaceLead, NIL).indexOf(WSP) < rules.wrap) {

              if (lines[b].length > rules.wrap) {
                lines[b + 1] = `${lines[b].slice(c + 1)}${parse.crlf}${lines[b + 1]}`;
              } else {
                lines[b + 1] = `${lines[b].slice(c + 1)} ${lines[b + 1]}`;
              }

            }

            if (
              emptyLine === false &&
              bulletLine === false &&
              numberLine === false &&
              bigLine === false) {

              lines[b] = lines[b].slice(0, c);

            }

          } else if (lines[b + 1] !== undefined && type < 3 && (
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
            if (rules.wrap < 1 && type === CommentType.LiquidBlock) b = b + 1;

            emptyLine = true;

          } else if (
            lines[b + 1] !== undefined &&
            rx.EmptyLine.test(lines[b + 1]) === false &&
            lines[b + 1] !== NIL &&
            lines[b + 1].slice(0, 4) !== BIG &&
            rx.CommLineChars.test(lines[b + 1]) === false) {

            if (type === CommentType.LiquidBlock) {
              lexed.push(lines[b]);
            } else {
              lines[b + 1] = `${lines[b]} ${lines[b + 1]}`;
            }

            emptyLine = true;
          }

          if (
            bigLine === false &&
            bulletLine === false &&
            numberLine === false) {

            if (emptyLine === true) {

              emptyLine = false;

            } else if ((/^\s*(\*|-|(\d+\.))\s*$/).test(lines[b]) === false) {

              if (
                b < lsize - 1 &&
                lines[b + 1] !== NIL &&
                rx.EmptyLine.test(lines[b]) === false &&
                lines[b + 1].slice(0, 4) !== BIG &&
                rx.CommLineChars.test(lines[b + 1]) === false) {

                lines[b] = `${lines[b]} ${lines[b + 1]}`;
                lines.splice(b + 1, 1);
                lsize = lsize - 1;
                b = b - 1;

              } else {

                if (type === CommentType.Block && lines[b].indexOf('/*') !== 0) {

                  lexed.push(MID + lines[b]
                    .replace(rx.WhitespaceLead, NIL)
                    .replace(rx.WhitespaceEnd, NIL)
                    .replace(rx.SpacesGlob, WSP));

                } else {

                  lexed.push(lines[b]
                    .replace(rx.WhitespaceLead, NIL)
                    .replace(rx.WhitespaceEnd, NIL)
                    .replace(rx.SpacesGlob, WSP));
                }
              }
            }
          }

          bigLine = false;
          bulletLine = false;
          numberLine = false;

        }
      }

      b = b + 1;

    } while (b < lsize);

    /* -------------------------------------------- */
    /* PARSE COMPLETE                               */
    /* -------------------------------------------- */

    const delims = onHTMLDelimiters();

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

        if (
          type !== CommentType.LiquidLine &&
          type !== CommentType.LiquidBlock &&
          lexed[lexed.length - 1].length > rules.wrap - (config.ender.length + 1)) {

          lexed.push(config.ender);

        } else if (type === CommentType.LiquidBlock) {

          lexed.push(config.ender);

        } else if (type === CommentType.LiquidLine) {

          return onLiquidLineComment(lexed);

        } else {

          lexed[lexed.length - 1] = `${lexed[lexed.length - 1]} ${config.ender}`;
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

    if (is(chars[a], ch.NWL)) parse.lineOffset = parse.lines(a, parse.lineOffset);

    // Liquid Line
    //
    if (

      is(chars[a], ch.HSH) &&
      type === CommentType.LiquidLine &&
      rules.liquid.preserveComment === false &&
      rules.wrap > 0 &&
      build.slice(build.lastIndexOf(NWL)).join(NIL).trim() === NIL
    ) {

      build.push(WSP);

    } else {

      build.push(chars[a]);

    }

    // Comment Token
    //
    if (chars[a] === term && chars.slice(a - tlen, a + 1).join(NIL) === config.ender) {

      if (type === CommentType.LiquidLine && is(chars[a - 2], ch.DSH)) {
        config.ender = '-%}';
        regexEnder = new RegExp(config.ender);
      }

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

  if (parsePreserve()) return onCommentDelimitersInline();

  /* -------------------------------------------- */
  /* PARSE COMMENT                                */
  /* -------------------------------------------- */

  return parseComment();

}
