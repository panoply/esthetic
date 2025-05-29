import { BIG, MID, NIL, NWL, WSP } from 'chars';
import { cc as ch } from 'lexical/codes';
import { CommentType } from 'lexical/enum';
import { delimiters } from 'lexical/liquid';
import * as rx from 'lexical/regex';
import { parse } from 'parse/parser';
import { BlockComments, Comments } from 'types';
import { charEsc, is, isLast, liquidEsc, not, ws } from 'utils/helpers';

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
 *
 * An optional third ([2]) array value will be passed for certain comments.
 * This describes references to be inserted into the data-structure.
 */
export function CommentBlock (chars: readonly string[], config: Comments): BlockComments {

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
  const { start, end, ender, begin } = config;

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
  const type = CommentTypeEnum();

  /**
   * Sanatized opening delimiter sequence
   */
  const sanitize = begin.replace(rx.CharEscape, charEsc);

  /**
   * Delimiter prefix for ignore comments
   */
  const prefix = type !== CommentType.LiquidLine ? sanitize : `${begin}\\s*#`;

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
    ? new RegExp(ender.replace(rx.LiquidDelimiters, liquidEsc))
    : new RegExp(ender.replace(rx.CharEscape, charEsc));

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Starting index offset of the comment, i.e: value of `config.start`
   */
  let a = start;

  /**
   * Before comment index offset `a` used in `ParseComment` which will indexes before comment
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
  function CommentTypeEnum () {

    if (is(config.begin[0], ch.LCB) && is(config.begin[1], ch.PER)) {
      return rx.LiquidBlockComment.test(config.begin) ? CommentType.LiquidBlock : CommentType.LiquidLine;
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
  function HTMLDelimitersMultiline () {

    if (type !== CommentType.Markup) return false;

    if (rules.commentBracket === 'consistent') {

      return is(output.slice(4).replace(rx.WhitespaceLead, NIL), ch.NWL)
        ? [ Delimiters.Force, Delimiters.Force ]
        : [ Delimiters.Inline, Delimiters.Inline ];

    } else if (rules.commentBracket === 'newline') {

      return [ Delimiters.Force, Delimiters.Force ];

    } else if (
      rules.commentBracket === 'inline' ||
      rules.commentBracket === 'inline-align') {

      return [ Delimiters.Inline, Delimiters.Inline ];

    } else if (rules.commentBracket === 'preserve') {

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
   * Applied the same logic as `HTMLDelimitersMultiline` but used for comments
   * that do **not** span multiple newlines. The difference is that this function will
   * use regular expression replacements to apply the rule.
   *
   * This function is used exclusively for the `markup.commentDelimiters` rule and any
   * non markup identified comment types will pass through untouched.
   */
  function HTMLDelimetersInline (): BlockComments {

    if (type === CommentType.Markup && rules.commentPreserve === false) {

      if (rules.commentBracket === 'consistent') {

        const token = chars.slice(start + 4).join(NIL);

        if (token.slice(0, token.search(rx.NonSpace)).indexOf(NWL) > -1) {
          if (rules.commentIndent) {
            output = output.replace(rx.HTMLCommDelimOpenWhitespace, `<!--${NWL}  `);
            output = output.replace(rx.HTMLCommDelimCloseWhitespace, `${NWL}-->`);
          } else {
            output = output.replace(rx.HTMLCommDelimOpenWhitespace, `<!--${NWL}`);
            output = output.replace(rx.HTMLCommDelimCloseWhitespace, `${NWL}-->`);
          }
        } else {
          output = output.replace(rx.HTMLCommDelimOpenWhitespace, '<!-- ');
          output = output.replace(rx.HTMLCommDelimCloseWhitespace, ' -->');
        }

      } else if (rules.commentBracket === 'newline') {

        if (rules.commentIndent) {
          output = output.replace(rx.HTMLCommDelimOpenWhitespace, `<!--${NWL}  `);
          output = output.replace(rx.HTMLCommDelimCloseWhitespace, `${NWL}-->`);
        } else {
          output = output.replace(rx.HTMLCommDelimOpenWhitespace, `<!--${NWL}`);
          output = output.replace(rx.HTMLCommDelimCloseWhitespace, `${NWL}-->`);
        }

      } else if (
        rules.commentBracket === 'inline' ||
        rules.commentBracket === 'inline-align') {

        output = output.replace(rx.HTMLCommDelimOpenWhitespace, '<!-- ');
        output = output.replace(rx.HTMLCommDelimCloseWhitespace, ' -->');

      } else {

        const token = chars.slice(start + 4).join(NIL);
        const close = token.indexOf(ender);

        if (token.slice(0, token.search(rx.NonSpace)).indexOf(NWL) > -1) {
          if (rules.commentIndent) {
            output = output.replace(rx.HTMLCommDelimOpenWhitespace, `<!--${NWL}  `);
          } else {
            output = output.replace(rx.HTMLCommDelimOpenWhitespace, `<!--${NWL}`);
          }
        } else {
          output = output.replace(rx.HTMLCommDelimOpenWhitespace, '<!-- ');
        }

        if (token.slice(token.lastIndexOf(NWL, close) + 1, close + 3).trimStart() === config.ender) {
          if (rules.commentIndent) {
            output = output.replace(rx.HTMLCommDelimCloseWhitespace, `${NWL}-->`);
          } else {
            output = output.replace(rx.HTMLCommDelimCloseWhitespace, `${NWL}-->`);
          }
        } else {
          output = output.replace(rx.HTMLCommDelimCloseWhitespace, ' -->');
        }

      }

    }

    return [ output, a, type ];

  }

  /**
   * Liquid Line Comment (Post-Processing)
   *
   * Liquid Line Comments require additional processing given that their formation can
   * vary. The tokens respect additional rulesets such as `delimiterPlacement` and
   * `delimiterTrims`. It's here where we build out the final parse table entry.
   */
  function LiquidLineComment (lexed: string[]): [string, number, CommentType] {

    /* -------------------------------------------- */
    /* LEXICAL SCOPE                                */
    /* -------------------------------------------- */

    const lines: string[] = [];
    const prefix = lexed[0] === NIL ? NWL : WSP;
    const suffix = lexed[lexed.length - 1] === NIL ? NWL : WSP;

    /** Preserve Newlines */
    let preserve = 0;

    for (let i = 0, s = lexed.length; i < s; i++) {
      const line = lexed[i].trim();
      if (line !== NIL) {
        lines.push(lexed[i].trimStart() + parse.crlf);
        preserve = 0;
      } else {
        if (preserve < rules.preserveLine) {
          lines.push(NWL);
          preserve++;
        }
      }
    }

    // console.log(lines, JSON.stringify([ prefix, suffix, begin, ender ]));

    switch (rules.delimiterTrims) {
      case 'always':
      case 'tags':
        output = '{%-' + prefix + lines.join(NIL).trim() + suffix + '-%}';
        break;
      case 'never':
      case 'outputs':
        output = '{%' + prefix + lines.join(NIL).trim() + suffix + '%}';
        break;
      default:
        output = begin + prefix + lines.join(NIL).trim() + suffix + ender;
        break;
    }

    return [ output, a, CommentType.LiquidLine ];

  }

  /**
   * Liquid Block Comment
   *
   * Handler for Liquid Block comment types. Liquid Block type comment will be handled
   * during the formatting cycle and return an array of `records` which will populate
   * the data structure. Unlike markup, script or Liquid line comments, Liquid block
   * comments will use different type references.
   *
   */
  function LiquidBlockComment (): BlockComments {

    /** Record references will be returned for Liquid block type comments */
    const records: [
      startToken: string,
      startLines: number,
      enderToken: string,
      enderLines: number
    ] = [
      config.begin,
      1,
      config.ender,
      1
    ];

    /**
     * The inner contents of the liquid block comment. We will remove the
     * start and end tags and also omit any leading and ending whitespace
     * occurances here.
     */
    let content: string = output.slice(
      config.begin.length,
      output.length - config.ender.length
    );

    records[0] = output
      .slice(0, config.begin.length)
      .replace(rx.Newlines, NIL)
      .replace(rx.WhitespaceGlob, WSP)
      .replace(rx.LiquidBlockCommentStart, '$1 $2 $3');

    /** Strips the whitespace characters from leading position */

    if (rx.SpaceLead.test(content)) {

      const leadNWL = content
        .match(rx.SpaceLead)[0]
        .replace(rx.WhitespaceGlob, NIL);

      records[1] = is(leadNWL, ch.NWL) ? leadNWL.length + 1 : 1;

    } else {

      records[1] = 0;

    }

    records[2] = output
      .slice(output.length - config.ender.length)
      .replace(rx.Newlines, NIL)
      .replace(rx.WhitespaceGlob, WSP)
      .replace(rx.LiquidBlockCommentEnd, '$1 $2 $3');

    /** Strips the whitespace characters from ending position but preserves newlines */
    const enderWSP = content.search(rx.SpaceEnd);

    if (enderWSP > -1) {

      const enderNWL = content
        .slice(enderWSP)
        .replace(rx.SpaceEnd, ws => ws.replace(rx.WhitespaceGlob, NIL));

      records[3] = isLast(enderNWL, ch.NWL) ? enderNWL.length + 1 : 1;

    } else {

      records[3] = 0;

    }

    // Preserve Comment
    //
    // If the liquid preserveComment rule is enabled (true) we
    // will need to process the inner content again as we would
    // like to preserve the leading whitespace occurances but omit
    // any starting or ending newlines as records[1] and records[3]
    // will take care of that logic.
    //
    if (rules.commentPreserve) {

      content = output
        .slice(config.begin.length, output.length - config.ender.length)
        .replace(rx.SpaceLead, ws => ws.replace(rx.Newlines, NIL))
        .trimEnd();

      return [ content, a, CommentType.LiquidBlock, records ];

    }

    const preserveLine = rules.preserveLine;

    // Repeated Saving
    //
    // We will trim comment contents and also remove all
    // leading whitespace occurrances per each line. This
    // is to prevent wrap issues occurring on repeat formats.
    //
    // Both the leading and ending newlines also be stripped
    // as the records[1] and records[3] references handle that
    // logic for us in the data~structure.
    //
    content = content
      .trim()
      .replace(rx.WhitespaceLeadGlob, NIL)
      .replace(/^\n+/gm, nl => nl.length > preserveLine ? parse.crlf.repeat(preserveLine) : nl);

    return [ content, a, CommentType.LiquidBlock, records ];

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
  function IgnoreNextComment (): BlockComments {

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

    return [ output, a, CommentType.IgnoreNext ];

  }

  /**
   * Ignore Comment Block
   *
   * Detects and traverses an ignore control type comment.
   * This function is handles `esthetic-ignore-start` and
   * `esthetic-ignore-end` comment blocks.
   */
  function IgnoreCommentBlock (): BlockComments {

    /* -------------------------------------------- */
    /* LEXICAL SCOPES                                */
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
      if (chars[a - 3] === '-' && chars[a - 2] === 'e' && chars[a - 1] === 'n' && chars[a] === 'd') {

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

    } while (++a < end);

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

    return [ output, a, CommentType.Ignore ];

  }

  /**
   * Preserve Comment
   *
   * A series of conditionals to determine whether or not
   * the comment should be preserved or returned early without
   * out an additional handling.
   */
  function PreserveComment (): boolean {

    // Preserve when comment is last token
    //
    if (a === end) return true;

    // Preserve comments based on rules
    //
    if (
      (type === CommentType.LiquidBlock && rules.commentPreserve) ||
      (type === CommentType.LiquidLine && rules.commentPreserve) ||
      (type === CommentType.Markup && rules.commentPreserve)) {

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

    if (rules.commentPreserve) return true;

    // Preserve when wrap is not exceeded and no newlines exist
    //
    if (
      type !== CommentType.LiquidBlock &&
      type !== CommentType.LiquidLine &&
      output.length <= rules.wordWrap &&
      output.indexOf(NWL) < 0) return true;

    // Preserve Liquid block comments when inline
    if (
      rules.wordWrap < 1 &&
      type === CommentType.LiquidBlock &&
      rx.LiquidCommentNewline.test(output) === false) {

      return true;

    }
    // Preserve Liquid line comments when no newlines exist
    //
    if (type === CommentType.LiquidLine) {

      if (rules.wordWrap > 0 && output.length >= rules.wordWrap) return false;

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

            if (rules.wordWrap > 0) {

              output = output
                .replace(rx.Newlines, NIL)
                .replace(rx.LiquidLeftDelimiter, '$1 ')
                .replace(rx.LiquidLineCommentHash, '# ')
                .replace(rx.LiquidRightDelimiter, ' $2');

            } else {

              output = output
                .replace(rx.Newlines, NIL)
                .replace(rx.LiquidLeftDelimiter, '$1 ')
                .replace(rx.LiquidLineCommentHash, '# ')
                .replace(rx.LiquidRightDelimiter, ' $2');

            }

            return true;

          }
        }

      } else {

        if (rules.wordWrap > 0) {

          output = output
            .replace(rx.LiquidLeftDelimiter, '$1 ')
            .replace(rx.LiquidLineCommentHash, '# ')
            .replace(rx.LiquidRightDelimiter, ' $2');

        } else {

          output = output
            .replace(rx.LiquidLeftDelimiter, '$1 ')
            .replace(rx.LiquidLineCommentHash, '# ')
            .replace(rx.LiquidRightDelimiter, ' $2');

        }

        return true;
      }

      return false;

    }

    // Preserve when wrap is not exceeded and no newlines exist
    if (
      type !== CommentType.LiquidBlock &&
      rules.wordWrap > 0 &&
      output.length <= rules.wordWrap &&
      output.slice(5, -4).indexOf(NWL) < 0) {

      return true;

    }

    // Preserve when innner comment contents does not contain newlines
    if (
      rules.wordWrap < 1 &&
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
  function ParseComment (): BlockComments {

    /** Comment contents split on newlines */
    let lines: string[] = [];

    /** The length of `lines[]` */
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

    if (type === CommentType.LiquidLine) {

      return LiquidLineComment(lines);

    }

    // When less than 2 the comment is comprised of a single
    // line and thus we need to determine handling based on
    // wrap length, so we will split on every whitespace
    //
    // if (lsize < 2 && rules.wordWrap > 0) lines = lines[0].split(WSP);

    if (lines[0] === NIL) {
      lines[0] = config.begin;
    } else {
      lines.splice(0, 0, config.begin);
    }

    lsize = lines.length;

    return type === CommentType.Markup
      ? ParseMarkupComment(lines, lsize - 1)
      : ParseCommentContent(lines, lsize);

  }

  function ParseMarkupComment (lines: string[], lsize: number): BlockComments {

    const lexed: string[] = [ lines.shift() ];

    let b: number = 0;
    let indent: string = NIL;
    let hasMarkup: boolean = false;
    let lineCount: number = 0;
    let lineWrap: number = 0;

    if (rules.commentBracket === 'inline-align') {
      indent = '     ';
    } else if (rules.commentIndent) {
      indent = '  ';
    }

    lineWrap = indent.length;

    do {

      if (rx.EmptyLine.test(lines[b]) === true || lines[b] === NIL) {

        lineCount = lineCount + 1;

        if (lineCount <= rules.preserveLine) lexed.push(NWL);

      } else {

        if (hasMarkup) {

          lexed.push(lines[b].replace(rx.WhitespaceEnd, NIL), NWL);

        } else {

          const word = lines[b].trim();

          if (/<\/?[a-zA-Z]|{{|{%/.test(word)) {

            hasMarkup = true;
            lexed.push(lines[b].replace(rx.WhitespaceEnd, NIL));

          } else {

            lineWrap = lineWrap + word.length + 1;
            lexed.push(`${word}${NWL}`);

          }
        }
      }

    } while (++b < lsize);

    output = lexed.join(indent) + WSP + config.ender;

    return HTMLDelimetersInline();

  }

  /**
   * Parse Specials
   *
   * Detects special character structures within the comment and
   * formats them accordingly. This includes numbers, dash lists
   * and empty lines. Next function concludes the parse operations.
   */
  function ParseCommentContent (lines: string[], lsize: number): BlockComments {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    /** An additional composed structure */
    const lexed: string[] = [];

    /* -------------------------------------------- */
    /* LEXICAL SCOPES                               */
    /* -------------------------------------------- */

    /**
     * The first known index offset used in `ParseComment` after striping out leading whitespace
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

      before = b < lsize - 1 ? lines[b + 1].replace(rx.WhitespaceLead, NIL) : NIL;

      if (rx.EmptyLine.test(lines[b]) || lines[b] === NIL) {

        if (rx.EmptyLine.test(lines[b + 1]) || lines[b + 1] === NIL) {
          do b = b + 1;
          while (b < lsize && (
            rx.EmptyLine.test(lines[b + 1]) ||
            lines[b + 1] === NIL));
        }

        if (b < lsize - 1) lexed.push(NIL);

      } else {

        strip = lines[b].replace(rx.WhitespaceLead, NIL);

        if (
          rules.wordWrap > 0 &&
          strip.length > rules.wordWrap &&
          strip.indexOf(WSP) > rules.wordWrap) {

          lines[b] = strip;

          c = lines[b].indexOf(WSP);

          lexed.push(lines[b].slice(0, c));
          lines[b] = lines[b].slice(c + 1);

          b = b - 1;

        } else {

          if (type === CommentType.Block) {

            lines[b] = MID + lines[b]
              .replace(rx.WhitespaceLead, NIL)
              .replace(rx.WhitespaceEnd, NIL)
              .replace(rx.SpacesGlob, WSP);

          } else {

            lines[b] = lines[b]
              .replace(rx.WhitespaceLead, NIL)
              .replace(rx.WhitespaceEnd, NIL);

          }

          twrap = b < 1 ? rules.wordWrap - (config.begin.length + 1) : rules.wordWrap;

          d = lines[b].replace(rx.SpaceLead, NIL).indexOf(WSP);
          c = lines[b].length;

          if (c > twrap && d > 0 && d < twrap) {

            c = twrap;

            do {
              c = c - 1;
              if (ws(lines[b].charAt(c)) && c <= rules.wordWrap) break;
            } while (c > 0);

            if (
              rx.CommNumberLine.test(lines[b]) === true &&
              rx.CommNumberLine.test(lines[b + 1]) === false) {
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

            } else if ((c + before.length) > rules.wordWrap && before.indexOf(WSP) < 0) {

              lexed.push(lines[b].slice(0, c));
              lines[b] = lines[b].slice(c + 1);
              bigLine = true;
              b = b - 1;

            } else if (lines[b].replace(rx.WhitespaceLead, NIL).indexOf(WSP) < rules.wordWrap) {

              if (lines[b].length > rules.wordWrap) {
                lines[b + 1] = `${lines[b].slice(c + 1)}${parse.crlf}${lines[b + 1]}`;
              } else {
                lines[b + 1] = `${lines[b].slice(c + 1)} ${lines[b + 1]}`;
              }

            }

            if (!emptyLine && !bulletLine && !numberLine && !bigLine) {
              lines[b] = lines[b].slice(0, c);
            }

          } else if (lines[b + 1] !== undefined && type < 3 && (
            (
              lines[b].length + before.indexOf(WSP) > rules.wordWrap &&
              before.indexOf(WSP) > 0
            ) || (
              lines[b].length + before.length > rules.wordWrap &&
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
            if (rules.wordWrap > 0) b = b + 1;
            if (rules.wordWrap < 1 && type === CommentType.LiquidBlock) b = b + 1;

            emptyLine = true;

          } else if (
            lines[b + 1] !== undefined &&
            lines[b + 1] !== NIL &&
            lines[b + 1].slice(0, 4) !== BIG &&
            rx.EmptyLine.test(lines[b + 1]) === false &&
            rx.CommLineChars.test(lines[b + 1]) === false) {

            if (type === CommentType.LiquidBlock) {
              lexed.push(lines[b]);
            } else {
              lines[b + 1] = `${lines[b]} ${lines[b + 1]}`;
            }

            emptyLine = true;
          }

          if (!bigLine && !bulletLine && !numberLine) {

            if (emptyLine) {

              emptyLine = false;

            } else if ((/^\s*(\*|-|(\d+\.))\s*$/).test(lines[b]) === false) {

              if (
                b < lsize - 1 &&
                lines[b + 1] !== NIL &&
                lines[b + 1].slice(0, 4) !== BIG &&
                rx.EmptyLine.test(lines[b]) === false &&
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

    const delims = HTMLDelimitersMultiline();

    if (lexed && lexed.length > 0) {

      if (delims) {

        if (delims[0] === Delimiters.Inline) {
          if (rules.commentIndent) {
            if (rules.commentBracket === 'inline-align') {
              output = `${lexed[0]} ${lexed.slice(1).join(parse.crlf + '     ')}`;
            } else {
              output = `${lexed[0]} ${lexed.slice(1).join(parse.crlf + '  ')}`;
            }
          } else {
            output = `${lexed[0]} ${lexed.slice(1).join(parse.crlf)}`;
          }

        } else {
          if (rules.commentIndent) {
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
          lexed[lexed.length - 1].length > rules.wordWrap - (config.ender.length + 1)) {

          lexed.push(config.ender);

        } else if (type === CommentType.LiquidBlock) {

          lexed.push(config.ender);

        } else if (type === CommentType.LiquidLine) {

          return LiquidLineComment(lexed);

        } else {

          lexed[lexed.length - 1] = `${lexed[lexed.length - 1]} ${config.ender}`;
        }

        output = lexed.join(WSP);

      }

    } else {

      if (delims) {

        if (delims[0] === Delimiters.Inline) {

          if (rules.commentIndent) {
            if (rules.commentBracket === 'inline-align') {

              output = `${lines[0]} ${lines.slice(1).join(parse.crlf + '     ')}`;
            } else {
              output = `${lines[0]} ${lines.slice(1).join(parse.crlf + '  ')}`;
            }
          } else {
            output = `${lines[0]} ${lines.slice(1).join(parse.crlf)}`;
          }

        } else {

          if (rules.commentIndent) {
            output = `${lines[0] + NWL}  ${lines.slice(1).join(parse.crlf + '  ')}`;
          } else {
            output = lines.join(NWL);
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
        output = lines.join(NWL);

      }

    }

    return [ output, a, type ];

  }

  /* -------------------------------------------- */
  /* LEXING                                       */
  /* -------------------------------------------- */

  do {

    if (is(chars[a], ch.NWL)) {
      parse.lineOffset = parse.lines(a, parse.lineOffset);
    }

    // Liquid Line
    //
    if (type === CommentType.LiquidLine && is(chars[a], ch.NWL) && rules.commentPreserve === false) {

      build.push(NWL);

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

  } while (++a < end);

  /* -------------------------------------------- */
  /* PARSE IGNORE                                 */
  /* -------------------------------------------- */

  if (ignoreStart.test(output)) return IgnoreCommentBlock();
  if (ignoreNext.test(output)) return IgnoreNextComment();

  /* -------------------------------------------- */
  /* PARSE PRESERVE                               */
  /* -------------------------------------------- */

  if (type === CommentType.LiquidBlock) {
    output = delimiters(output);
    return LiquidBlockComment();
  }

  if (PreserveComment()) return HTMLDelimetersInline();

  /* -------------------------------------------- */
  /* PARSE COMMENT                                */
  /* -------------------------------------------- */

  if (type === CommentType.LiquidLine) output = delimiters(output, '#');

  return ParseComment();

}
