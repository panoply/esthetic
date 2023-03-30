import { WrapComment } from 'types/index';
import { parse } from 'parse/parser';
import * as rx from 'lexical/regex';
import { cc as ch } from 'lexical/codes';
import { NWL, NIL, WSP } from 'chars';
import { sanitizeComment, ws, is, not } from 'utils/helpers';

// export function comments <T extends RuleItems> (rules: T, source: string[], length: number) {

//   function parseBlock (config: {
//     lexer: LexerName,
//     start: number,
//     begin: string,
//     ender: string
//   }) {

//     /* -------------------------------------------- */
//     /* CONSTANTS                                    */
//     /* -------------------------------------------- */

//     /**
//      * The composed output structure
//      */
//     const build: string[] = [];

//     /**
//      * An additional composed structure
//      */
//     const second: string[] = [];

//     /**
//      * Sanatized opening delimiter sequence
//      */
//     const sanitize: string = config.begin.replace(rx.CharEscape, sanitizeComment);

//     /**
//      * Whether or not we are dealing with a Liquid comment
//      */
//     const isliquid: boolean = is(config.begin[0], ch.LCB) && is(config.begin[1], ch.PER);

//     /**
//      * Regular expression for ignore comment starters
//      */
//     const isignore: RegExp = new RegExp(`^(${sanitize}\\s*esthetic-ignore-start)`);

//     /**
//      * Regular expression start type comment blocks
//      */
//     const start: RegExp = new RegExp(`(${sanitize}\\s*)`);
//     /**
//      * Liquid ending expression
//      */
//     const ender: RegExp = isliquid
//       ? new RegExp(`\\s*${config.ender.replace(rx.LiquidDelimiters, i => is(i, ch.LCB) ? '{%-?\\s*' : '\\s*-?%}')}$`)
//       : new RegExp(config.ender.replace(rx.CharEscape, sanitizeComment));

//     /**
//      * Starting index offset of the comment
//      */
//     let a = config.start;

//     /**
//      * An index offset reference point
//      */
//     let b = 0;

//     const c = 0;
//     const d = 0;

//     /**
//      * Length store reference
//      */
//     const len = 0;

//     /**
//      * Newlines store reference
//      */
//     const lines = [];

//     /**
//      * Whitespace reference
//      */
//     const space = NIL;

//     /**
//      * Iterator `b` line
//      */
//     const bline = NIL;

//     /**
//      * Whether or not empty line is contained
//      */
//     const emptyLine = false;

//     /**
//      * Whether or not bullet point lines are contained
//      */
//     const bulletLine = false;

//     /**
//      * Whether or not numbered lines are contained
//      */
//     const numberLine = false;

//     /**
//      * The generated output token
//      */
//     let output = NIL;

//     /**
//      * Termination length, ie: The `end` tag token size
//      */
//     let terml = config.ender.length - 1;

//     /**
//      * Last known character of the terminator, ie: `end[end.length - 1]`
//      */
//     let term = config.ender.charAt(terml);

//     /**
//      * Terminator wrap length
//      */
//     const twrap = 0;

//     /* -------------------------------------------- */
//     /* FUNCTIONS                                    */
//     /* -------------------------------------------- */

//     /**
//      * Parse Empty Newlines
//      *
//      * Detects new lines and populates the `second[]` store build.
//      */
//     function parseEmptyLines () {

//       if (rx.EmptyLine.test(lines[b + 1]) || lines[b + 1] === NIL) {
//         do b = b + 1;
//         while (b < len && (rx.EmptyLine.test(lines[b + 1]) || lines[b + 1] === NIL));
//       }

//       if (b < len - 1) second.push(NIL);

//     };

//     /**
//      * Ignore Comment
//      *
//      * Detects and traverses an ignore control type comment.
//      */
//     function parseIgnoreComment (): [string, number] {

//       let close: string = NWL;
//       let token: string;
//       let delim: string;

//       a = a + 1;

//       do {

//         build.push(source[a]);

//         // Supports comment start/end comment ignores using Liquid
//         // tags. We don't have any knowledge of the comment formation
//         // upon parse, this will re-assign the terminator
//         //
//         if (build.slice(build.length - 19).join(NIL) === 'esthetic-ignore-end') {

//           if (isliquid) {

//             const d = source.indexOf('{', a);

//             if (is(source[d + 1], ch.PER)) {
//               const token = source.slice(d, source.indexOf('}', d + 1) + 1).join(NIL);
//               if (ender.test(token)) config.ender = token;
//             }

//           }

//           a = a + 1;

//           break;
//         }

//         a = a + 1;

//       } while (a < length);

//       b = a;

//       terml = config.begin.length - 1;
//       term = config.begin.charAt(terml);

//       do {

//         // Script OR Style Comment Blocks
//         if (config.begin === '/*' && is(source[b - 1], ch.FWS) && (
//           is(source[b], ch.ARS) ||
//           is(source[b], ch.FWS)
//         )) {

//           break;
//         }

//         // Markup Comment Blocks
//         if (
//           config.begin !== '/*' &&
//           source[b] === term &&
//           source.slice(b - terml, b + 1).join(NIL) === config.begin
//         ) {

//           break;
//         }

//         b = b - 1;

//       } while (b > config.start);

//       if (config.begin === '/*' && is(source[b], ch.ARS)) {
//         termination = '\u002a/';
//       } else if (config.begin !== '/*') {
//         termination = config.ender;
//       }

//       terml = termination.length - 1;
//       term = termination.charAt(terml);

//       if (termination !== NWL || source[a] !== NWL) {

//         do {

//           build.push(source[a]);

//           if (termination === NWL && source[a + 1] === NWL) break;
//           if (source[a] === term && source.slice(a - terml, a + 1).join(NIL) === termination) break;

//           a = a + 1;

//         } while (a < config.end);

//       }

//       if (source[a] === NWL) a = a - 1;

//       output = build.join(NIL).replace(rx.WhitespaceEnd, NIL);

//       return [ output, a ];

//     }
//   }

//   function parseLine () {

//   }

//   return {
//     parseBlock,
//     parseLine
//   };

// }

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
  const build = [];

  /**
   * An additional composed structure
   */
  const second = [];

  /**
   * Sanatized opening delimiter sequence
   */
  const sanitize = config.begin.replace(rx.CharEscape, sanitizeComment);

  /**
   * Whether or not we are dealing with a Liquid comment
   */
  const isliquid = is(config.begin[0], ch.LCB) && is(config.begin[1], ch.PER);

  /**
   * Regular expression for ignore comment starters
   */
  const expignore = new RegExp(`^(${sanitize}\\s*esthetic-ignore-start)`);

  /**
   * Regular expression start type comment blocks
   */
  const expstart = new RegExp(`(${sanitize}\\s*)`);
  /**
   * Liquid ending expression
   */
  const regEnd: RegExp = isliquid
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
   * Length store reference
   */
  let len = 0;

  /**
   * Newlines store reference
   */
  let lines = [];

  /**
   * Whitespace reference
   */
  let space = NIL;

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
   * Termination length, ie: The `end` tag token size
   */
  let terml = config.ender.length - 1;

  /**
   * Last known character of the terminator, ie: `end[end.length - 1]`
   */
  let term = config.ender.charAt(terml);

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
   * Detects new lines and populates the `second[]` store build.
   */
  function parseEmptyLines () {

    if (rx.EmptyLine.test(lines[b + 1]) || lines[b + 1] === NIL) {

      do b = b + 1;
      while (b < len && (rx.EmptyLine.test(lines[b + 1]) || lines[b + 1] === NIL));

    }

    if (b < len - 1) second.push(NIL);

  };

  /**
   * Ignore Comment
   *
   * Detects and traverses an ignore control type comment.
   */
  function parseIgnoreComment (): [string, number] {

    let termination = NWL;

    a = a + 1;

    do {

      build.push(config.chars[a]);

      // Supports comment start/end comment ignores using Liquid
      // tags. We don't have any knowledge of the comment formation
      // upon parse, this will re-assign the terminator
      //
      if (build.slice(build.length - 19).join(NIL) === 'esthetic-ignore-end') {
        if (isliquid) {
          const d = config.chars.indexOf('{', a);
          if (is(config.chars[d + 1], ch.PER)) {
            const ender = config.chars
              .slice(d, config.chars.indexOf('}', d + 1) + 1)
              .join(NIL);
            if (regEnd.test(ender)) config.ender = ender;
          }
        }
        a = a + 1;
        break;
      }

      a = a + 1;

    } while (a < config.end);

    b = a;

    terml = config.begin.length - 1;
    term = config.begin.charAt(terml);

    do {

      // Script OR Style Comment Blocks
      if (config.begin === '/*' && is(config.chars[b - 1], ch.FWS) && (
        is(config.chars[b], ch.ARS) ||
        is(config.chars[b], ch.FWS)
      )) {

        break;
      }

      // Markup Comment Blocks
      if (
        config.begin !== '/*' &&
        config.chars[b] === term &&
        config.chars.slice(b - terml, b + 1).join(NIL) === config.begin
      ) {

        break;
      }

      b = b - 1;

    } while (b > config.start);

    if (config.begin === '/*' && is(config.chars[b], ch.ARS)) {
      termination = '\u002a/';
    } else if (config.begin !== '/*') {
      termination = config.ender;
    }

    terml = termination.length - 1;
    term = termination.charAt(terml);

    if (termination !== NWL || config.chars[a] !== NWL) {

      do {

        build.push(config.chars[a]);

        if (termination === NWL && config.chars[a + 1] === NWL) break;
        if (config.chars[a] === term && config.chars.slice(a - terml, a + 1).join(NIL) === termination) break;

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
      config.chars.slice(a - terml, a + 1).join(NIL) === config.ender) break;

    a = a + 1;

  } while (a < config.end);

  output = build.join(NIL);

  if (expignore.test(output) === true) return parseIgnoreComment();

  if (((
    isliquid === true &&
    rules.liquid.preserveComment
  ) || (
    isliquid === false &&
    rules.markup.preserveComment
  ) || (
    parse.lexer === 'style' &&
    rules.style.preserveComment
  ) || (
    parse.lexer === 'script' &&
    rules.style.preserveComment
  )) ||
    rules.wrap < 1 ||
    a === config.end || (
    output.length <= rules.wrap &&
      output.indexOf(NWL) < 0
  ) || (
    config.begin === '/*' &&
    output.indexOf(NWL) > 0 &&
    output.replace(NWL, NIL).indexOf(NWL) > 0 &&
    /\n(?!(\s*\*))/.test(output) === false
  )) {

    return [ output, a ];

  }

  b = config.start;

  if (
    b > 0 &&
    not(config.chars[b - 1], ch.NWL) &&
    ws(config.chars[b - 1])
  ) {

    do b = b - 1;
    while (
      b > 0 &&
      not(config.chars[b - 1], ch.NWL) &&
      ws(config.chars[b - 1])
    );

  }

  space = config.chars.slice(b, config.start).join(NIL);

  const spaceLine = new RegExp(NWL + space, 'g');

  lines = output
    .replace(/\r\n/g, NWL)
    .replace(spaceLine, NWL)
    .split(NWL);

  len = lines.length;
  lines[0] = lines[0].replace(expstart, NIL);
  lines[len - 1] = lines[len - 1].replace(regEnd, NIL);

  if (len < 2) lines = lines[0].split(WSP);

  if (lines[0] === NIL) {
    lines[0] = config.begin;
  } else {
    lines.splice(0, 0, config.begin);
  }

  len = lines.length;
  b = 0;

  do {

    bline = (b < len - 1) ? lines[b + 1].replace(rx.WhitespaceLead, NIL) : NIL;

    if (rx.EmptyLine.test(lines[b]) === true || lines[b] === NIL) {

      parseEmptyLines();

    } else if (
      lines[b].replace(rx.WhitespaceLead, NIL).length > rules.wrap &&
      lines[b].replace(rx.WhitespaceLead, NIL).indexOf(WSP) > rules.wrap
    ) {

      lines[b] = lines[b].replace(rx.WhitespaceLead, NIL);

      c = lines[b].indexOf(WSP);

      second.push(lines[b].slice(0, c));

      lines[b] = lines[b].slice(c + 1);

      b = b - 1;

    } else {

      twrap = b < 1
        ? rules.wrap - config.begin.length + 1
        : rules.wrap;

      lines[b] = (config.begin === '/*' && lines[b].indexOf('/*') !== 0 ? '   ' : NIL) + lines[b]
        .replace(rx.WhitespaceLead, NIL)
        .replace(rx.WhitespaceEnd, NIL)
        .replace(rx.SpacesGlob, WSP);

      d = lines[b]
        .replace(rx.WhitespaceLead, NIL)
        .indexOf(WSP);

      c = lines[b].length;

      if (c > twrap && d > 0 && d < twrap) {

        c = twrap;

        do {
          c = c - 1;
          if (ws(lines[b].charAt(c)) && c <= rules.wrap) break;
        } while (c > 0);

        if (
          /^\s*\d+\.\s/.test(lines[b]) === true &&
          /^\s*\d+\.\s/.test(lines[b + 1]) === false) {

          lines.splice(b + 1, 0, '1. ');

        }

        if ((rx.EmptyLine).test(lines[b + 1]) === true || lines[b + 1] === NIL) {

          second.push(lines[b].slice(0, c));
          lines[b] = lines[b].slice(c + 1);
          emptyLine = true;
          b = b - 1;

        } else if (/^\s*[*-]\s/.test(lines[b + 1])) {

          second.push(lines[b].slice(0, c));
          lines[b] = lines[b].slice(c + 1);
          bulletLine = true;
          b = b - 1;

        } else if (/^\s*\d+\.\s/.test(lines[b + 1])) {

          second.push(lines[b].slice(0, c));
          lines[b] = lines[b].slice(c + 1);
          numberLine = true;
          b = b - 1;

        } else if (lines[b].replace(rx.WhitespaceLead, NIL).indexOf(WSP) < rules.wrap) {

          lines[b + 1] = lines[b].length > rules.wrap
            ? lines[b].slice(c + 1) + parse.crlf + lines[b + 1]
            : lines[b].slice(c + 1) + WSP + lines[b + 1];

        }

        if (
          emptyLine === false &&
          bulletLine === false &&
          numberLine === false) {

          lines[b] = lines[b].slice(0, c);

        }

      } else if (
        lines[b + 1] !== undefined && (
          (
            lines[b].length + bline.indexOf(WSP) > rules.wrap &&
            bline.indexOf(WSP) > 0
          ) || (
            lines[b].length + bline.length > rules.wrap &&
            bline.indexOf(WSP) < 0
          )
        )
      ) {

        second.push(lines[b]);

        b = b + 1;

      } else if (
        lines[b + 1] !== undefined &&
        rx.EmptyLine.test(lines[b + 1]) === false &&
        lines[b + 1] !== NIL &&
        /^\s*(?:[*-]|\d+\.)\s/.test(lines[b + 1]) === false
      ) {

        // LIQUID COMMENTS ARE AUGMENTED HERE
        second.push(lines[b]);
        emptyLine = true;

      } else {

        second.push(lines[b]);
        emptyLine = true;

      }

      bulletLine = false;
      numberLine = false;
    }

    b = b + 1;

  } while (b < len);

  if (second.length > 0) {

    if (second[second.length - 1].length > rules.wrap - (config.ender.length + 1)) {

      second.push(config.ender);

    } else {

      if (lines.length - 1 > second.length) {
        lines.slice(second.length + 1).forEach(nl => {
          if (nl === NIL) second.push(nl);
        });
      }

      second.push(config.ender);
      // second[second.length - 1] = `${second[second.length - 1]} ${config.ender}`;
    }

    output = second.join(parse.crlf);

  } else {

    lines[lines.length - 1] = lines[lines.length - 1] + config.ender;
    output = lines.join(parse.crlf);
  }

  /* -------------------------------------------- */
  /* RETURN COMMENT                               */
  /* -------------------------------------------- */

  return [ output, a ];

}
