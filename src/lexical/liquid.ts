/* eslint-disable prefer-const */

import type { LiquidInternal, LiquidRules, Rules } from 'types';
import { grammar } from 'parse/grammar';
import { glue, is, isLast, isLastAt, isWS, not, ns } from 'utils/helpers';
import { cc } from 'lexical/codes';
import { LqT, Modes } from 'lexical/enum';
import { COM, NIL, NWL, WSP } from 'lexical/chars';
import { parse } from 'parse/parser';

/**
 * Opening Delimiters
 *
 * Applies `delimiterTrims` applied formatting to the opening
 * delimiter sequences of Liquid tokens.
 */
export function openDelims (input: string, rules: LiquidRules, delimOnly = false) {

  const o = is(input[2], cc.DSH) ? 3 : 2;
  const token = input.slice(o);

  let open: string;

  if (rules.delimiterTrims === 'never') {
    open = `{${input[1]}`;
  } else if ((
    rules.delimiterTrims === 'always'
  ) || (
    rules.delimiterTrims === 'outputs' &&
    is(input[1], cc.LCB)
  ) || (
    rules.delimiterTrims === 'tags' &&
    is(input[1], cc.PER)
  )) {
    open = `{${input[1]}-`;
  } else {
    open = input.slice(0, o);
  }

  if (rules.delimiterPlacement === 'preserve') {
    open += /^\s*\n/.test(token) ? NWL : WSP;
  } else if (rules.delimiterPlacement === 'newline') {
    open += NWL;
  } else if (
    rules.delimiterPlacement === 'inline' ||
    rules.delimiterPlacement === 'newline-multiline'
  ) {

    open += WSP;

  } else if (rules.delimiterPlacement === 'consistent') {
    if (/^\s*\n/.test(token)) {
      open += NWL;
    } else {
      open += WSP;
    }
  }

  return delimOnly ? open : open + token.trim();

}

/**
 * Closing Delimiters
 *
 * Applies `delimiterTrims` applied formatting to the closing
 * delimiter sequences of Liquid tokens.
 */
export function closeDelims (input: string, rules: LiquidRules, delimOnly = false) {

  const c = is(input[input.length - 3], cc.DSH) ? input.length - 3 : input.length - 2;
  const token = input.slice(0, c) || NIL;

  let close: string;

  if (rules.delimiterTrims === 'never') {

    close = `${input[input.length - 2]}}`;

  } else if ((
    rules.delimiterTrims === 'always'
  ) || (
    rules.delimiterTrims === 'outputs' &&
    is(input[1], cc.LCB)
  ) || (
    rules.delimiterTrims === 'tags' &&
    is(input[1], cc.PER)
  )) {

    close = `-${input[input.length - 2]}}`;

  } else {

    close = input.slice(c);

  }

  if (rules.delimiterPlacement === 'preserve') {

    close = (/\s*\n\s*$/.test(token) ? NWL : WSP) + close;

  } else if (rules.delimiterPlacement === 'newline') {

    close = NWL + close;

  } else if (
    rules.delimiterPlacement === 'inline' ||
    rules.delimiterPlacement === 'newline-multiline'
  ) {

    close = WSP + close;

  } else if (rules.delimiterPlacement === 'consistent') {
    if (/^\s*\n/.test(token)) {
      close = NWL + close;
    } else {
      close = WSP + close;
    }
  }

  return delimOnly ? close : token.trim() + close;

}

/**
 * Liquid Delimiters
 *
 * Applies delimiter rules to Liquid tokens. The `input` parameter expects a
 * fully parsed token.
 *
 * - `{{` or `{{-`
 * - `{%` or`{%-`
 * - `}}` or `-}}`
 * - `%}`or `-%}`
 */
export function delimiters (input: string, tname?: string, space = WSP) {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * Destructed Liquid specific delimiter rules
   */
  const { delimiterTrims, delimiterPlacement } = parse.rules.liquid;

  /**
   * Destructed open and close delimiters from input
   */
  const [ o, c ] = delims(input);

  /**
   * Opening Delimiter
   */
  let open: string;

  /**
   * The inner token content
   */
  let token: string = input.slice(o, c);

  /**
   * Closing Delimiter
   */
  let close: string;

  if (delimiterTrims === 'never') {

    open = `{${input[1]}`;
    close = `${input[input.length - 2]}}`;

  } else if ((
    delimiterTrims === 'always'
  ) || (
    delimiterTrims === 'outputs' &&
    is(input[1], cc.LCB)
  ) || (
    delimiterTrims === 'tags' &&
    is(input[1], cc.PER)
  )) {

    open = `{${input[1]}-`;
    close = `-${input[input.length - 2]}}`;

  } else {

    open = input.slice(0, o);
    close = input.slice(c);

  }

  if (!tname) tname = token.trimStart().split(/\s/)[0] || '';

  if (
    tname === 'else' ||
    tname === 'break' ||
    tname === 'continue' ||
    tname === 'increment' ||
    tname === 'decrement' || tname.startsWith('end')) {

    open += space;
    close = space + close;

  } else {

    if (delimiterPlacement === 'preserve') {

      open += /^\s*\n/.test(token) ? NWL : space;
      close = (/\s*\n\s*$/.test(token) ? NWL : space) + close;

    } else if (
      tname === '#' &&
      delimiterPlacement === 'newline-multiline') {

      if (/\n{2,}/g.test(token.trim())) {

        open += NWL;
        close = NWL + close;

      } else {
        open += space;
        close = space + close;
      }

    } else if (delimiterPlacement === 'newline') {

      open += NWL;
      close = NWL + close;

    } else if (
      delimiterPlacement === 'inline' ||
      delimiterPlacement === 'newline-multiline') {

      open += space;
      close = space + close;

    } else if (delimiterPlacement === 'consistent') {

      if (/^\s*\n/.test(token)) {
        open += NWL;
        close = NWL + close;
      } else {
        open += space;
        close = space + close;
      }

    }

  }

  // Liquid Line Comment Post handling
  //
  // if (
  //   tname === '#' &&
  //   isLast(open, cc.NWL) &&
  //   countChars(token, '#') > 1 &&
  //   /^#\s*\n/.test(token.trimStart())
  // ) {

  //   token = token.trimStart().replace(/^#/, NWL);

  // }

  return open + token.trim() + close;

};

/**
 * Liquid Forcing
 *
 * This function is a post-processor which will insert newline `\n` characters
 * at all possible wrap points within a Liquid token. The beautification cycle
 * will split tokens on `NWL` and determine whether or not the inserted characters
 * should be replaced with single whitespace `WSP` or should preserve the newline
 * injections. Consult the `Liquid()` function within `Markup()` format file.
 */
export function tokenize (lexed: string[], tname: string, liquid: LiquidInternal, {
  liquid: {
    argumentFormat,
    filterLineBreak,
    lineBreakSeparator,
    lineBreakLogical,
    delimiterTrims,
    delimiterPlacement
  }
}: Rules) {

  // console.log(

  //   JSON.stringify(lexed.join(NIL))

  // );

  /** When Æsthetic execution is parse we use whitespace, if format is   */
  const CRLF = parse.mode === Modes.Parse ? WSP : NWL;

  /** Extract delimiters, where `o` represents open and `c` represents close */
  const [ O, C ] = delims(lexed);

  /** Opening Delimiter, e.g: `{{` or `{%` */
  let OPEN: string;

  /** Closing Delimiter, e.g: `}}` or `%}` */
  let CLOSE: string;

  /* -------------------------------------------- */
  /* TRIMS                                        */
  /* -------------------------------------------- */

  // HOT PATCH
  //
  // schema tag should not apply trims
  // this is a hot patch for now until support in vscode can digest {%- schema -%}
  // tag expressions with delimiters
  if (delimiterTrims === 'never') {

    OPEN = '{' + lexed[1];
    CLOSE = lexed[lexed.length - 2] + '}';

  } else if ((
    delimiterTrims === 'always'
  ) || (
    delimiterTrims === 'outputs' &&
    is(lexed[1], cc.LCB)
  ) || (
    delimiterTrims === 'tags' &&
    is(lexed[1], cc.PER)
  )) {

    OPEN = '{' + lexed[1] + '-';
    CLOSE = '-' + lexed[lexed.length - 2] + '}';

  } else if (delimiterTrims === 'preserve') {

    OPEN = lexed.slice(0, O).join(NIL);
    CLOSE = lexed.slice(C).join(NIL);

  } else {

    OPEN = '{' + lexed[1];
    CLOSE = lexed[lexed.length - 2] + '}';

  }

  // Void liquid types do not apply any additional processing
  //
  if (grammar.liquid.void.has(tname) || tname.startsWith('end')) {

    OPEN += WSP;
    CLOSE = WSP + CLOSE;

    return OPEN + lexed.slice(O, C).join(NIL).trim() + CLOSE;

  }

  /* -------------------------------------------- */
  /* DELIMITER PLACEMENTS                         */
  /* -------------------------------------------- */

  if (delimiterPlacement === 'preserve') {

    OPEN += is(lexed[O], cc.NWL) ? CRLF : WSP;
    CLOSE = is(lexed[C - 1], cc.NWL) ? CRLF + CLOSE : WSP + CLOSE;

  } else if (delimiterPlacement === 'newline') {

    OPEN += CRLF;
    CLOSE = CRLF + CLOSE;

  } else if (delimiterPlacement === 'inline') {

    OPEN += WSP;
    CLOSE = WSP + CLOSE;

  } else if (delimiterPlacement === 'consistent') {

    if (is(lexed[O], cc.NWL)) {

      OPEN += CRLF;
      CLOSE = CRLF + CLOSE;

    } else {

      OPEN += WSP;
      CLOSE = WSP + CLOSE;

    }

  } else {

    OPEN += WSP;
    CLOSE = WSP + CLOSE;

  }

  // Exclude processing of {% liquid %} multiline tags
  //
  if (tname === 'liquid') {

    return OPEN + lexed.slice(O, C).join(NIL).trim() + CLOSE;

  }

  /* -------------------------------------------- */
  /* FORCE WRAP CONDITIONALS                      */
  /* -------------------------------------------- */

  if (liquid.logic.length > 0 && grammar.liquid.control.has(tname)) return Logic();

  if (liquid.param.length > 0 && grammar.liquid.iterator.has(tname)) return Param();

  if (liquid.pipes.length > 0) Pipes();

  if (liquid.targs.length > 0) Targs();

  /**
   * Delimiter Trims and Placement
   */
  function Delim () {

    if (delimiterTrims === 'multiline') {

      OPEN = '{' + lexed[1] + '-' + OPEN[OPEN.length - 1];
      CLOSE = CLOSE[0] + '-' + lexed[lexed.length - 2] + '}';

    }

    if (delimiterPlacement === 'newline-multiline') {
      OPEN = OPEN.trimEnd() + CRLF;
      CLOSE = CRLF + CLOSE.trimStart();
    }

  }

  /**
   * Parameters
   */
  function Param () {

    Delim();

    for (
      let i = 0
        , s = liquid.param.length; i < s; i++) {

      lexed[liquid.param[i]] = CRLF + lexed[liquid.param[i]].trim();

    }

    return OPEN + glue(lexed.slice(O, C)).trim() + CLOSE;

  }

  /**
   * Logical Expressions
   */
  function Logic () {

    Delim();

    return OPEN + glue(lexed.slice(O, C)).trim() + CLOSE;
    for (
      let i = 0
        , b = 0 // before
        , e = 0 // ending
        , s = liquid.logic.length; i < s; i++) {

      e = liquid.logic[i];

      if (lineBreakLogical === 'before') {

        b = lexed.lastIndexOf(WSP, e);

        lexed[b] = CRLF + lexed[b];
        lexed[e] = WSP + lexed[e];

      } else if (lineBreakLogical === 'after') {

        lexed[e] = CRLF + lexed[e].trim();

      } else {

        lexed.splice(e, 1, CRLF + lexed[e]);

      }

    }

    return OPEN + glue(lexed.slice(O, C)).trim() + CLOSE;

  }

  /**
   * Tag Arguments
   */
  function Targs () {

    Delim();

    for (
      let a: number
        , i = 0
        , s = liquid.targs.length; i < s; i++) {

      a = liquid.targs[i];

      if (lineBreakSeparator === 'after') {

        // ADDED TO IN ATTEMPT TO PATCH TAB ANIMALS CC: WOLFGREY
        let b: number = a;

        while (isWS(lexed[b--])) lexed[b] = NIL;

        if (isWS(lexed[a + 1])) lexed[a + 1] = NIL;
        if (isWS(lexed[a - 1])) lexed[a - 1] = NIL;

        lexed[a] = is(lexed[a], cc.COM)
          ? COM + CRLF
          : CRLF;

      } else if (lineBreakSeparator === 'before') {

        if (is(lexed[a - 1], cc.COM)) {

          lexed[a - 1] = i === 0
            ? CRLF + COM
            : CRLF + COM;

        } else {

          lexed[a] = i === 0
            ? CRLF + COM
            : CRLF + COM;
        }

      }
    }
  }

  /**
   * Filter Pipes
   */
  function Pipes () {

    Delim();

    return;
    /** Whether or not {@link filterArgument} is set to preserve */
    const preserve = filterArgument === 'preserve';

    for (
      let a: number
        , i = 0
        , s = liquid.pipes.length; i < s; i++) {

      a = liquid.pipes[i];

      if (isWS(lexed[a - 1])) lexed[a - 1] = NIL;

      if (filterLineBreak === false) {

        // Applies preservation tactic, only newlines apply
        if (is(lexed[a], cc.NWL)) lexed[a] = CRLF;

      } else {

        lexed[a] = CRLF + lexed[a];

      }

      // First sequence argument excludes extraneous whitespace
      if (i === 0) {

        // let p: number = a - 1;

        // if (isWS(lexed[p - 1])) {
        //   do lexed[p] = NIL;
        //   while (isWS(lexed[p--]));
        // }

      }

      if (liquid.fargs[i] && liquid.fargs[i].length > 0) {

        //  Fargs(liquid.fargs[i], preserve);

      }
    }
  }

  /**
   * Filter Arguments
   */
  function Fargs (fargs: number[], preserve: boolean) {

    for (
      let a: number
        , i = 0
        , s = fargs.length; i < s; i++) {

      a = fargs[i];

      if (lineBreakSeparator === 'after') {

        if (preserve) {

          // console.log(lexed.slice(a, fargs[i + 1]).join(NIL));

        } else {

          // if (isWS(lexed[a + 1])) lexed[a + 1] = NIL;

          console.log(lexed.slice(a, a + 1), JSON.stringify(lexed[a + 1]), is(lexed[a], cc.COM), i);

          if (is(lexed[a], cc.COM)) {

            lexed[a + 1] = CRLF;

          }

          lexed[is(lexed[a - 1], cc.COM) ? a - 1 : a] = i === 0
            ? lexed[a] + CRLF
            : COM + CRLF;

        }
      } else if (lineBreakSeparator === 'before') {

        // console.log(JSON.stringify(lexed[a + 1]), i);

        if (preserve && i !== 0 && is(lexed[a + 1], cc.NWL)) {

          //  lexed[a] = i === 0 ? CRLF : CRLF + COM;

        } else {

          lexed[a] = i === 0 ? CRLF : CRLF + COM;
        }
      } else {

        //  if (preserve) LNBR = is(lexed[a], cc.NWL) ? CRLF : WSP;

        lexed[a] = CRLF + lexed[a];

      }
    }

  }

  return OPEN + glue(lexed.slice(O, C)).trim() + CLOSE;

}

/**
 * Delimiters
 *
 * Determines the indexes of Liquid tag delimiters from provided input.
 * Returns an array where `[0]` is opening index and `[1]` is closing
 */
export function delims (input: string | string[]): [ open: number, close: number ] {

  const length = input.length;

  return [
    is(input[2], cc.DSH) ? 3 : 2,
    is(input[length - 3], cc.DSH) ? length - 3 : length - 2
  ];

}

/**
 * Expression
 *
 * Generate a Liquid tag regular expression using the provided input
 * name. The `fuse` parameter will return an expression with closing
 * delimiters, which defaults to `true`
 */
export function exp (tagName: string, fuse = true) {

  return fuse
    ? new RegExp(`{%-?\\s*${tagName}\\s*-?%}`)
    : new RegExp(`{%-?\\s*${tagName}`);
}

/**
 * Is Liquid Line Comment
 *
 * Check if input contains a Liquid output type token. The entire input is checked,
 * so the control tag itself does not need to begin with Liquid delimiters.
 */
export function isLineComment (input: string) {

  const begin = input.indexOf('{');

  return is(input[begin + 1], cc.LCB);

}

/**
 * Is Liquid Output
 *
 * Check if input contains a Liquid output type token. The entire input is checked,
 * so the control tag itself does not need to begin with Liquid delimiters.
 */
export function isOutput (input: string) {

  const begin = input.indexOf('{');

  return begin > -1 ? is(input[begin + 1], cc.LCB) : false;

}

/**
 * Is Liquid Control
 *
 * Check if input contains a Liquid control type tag. The entire input is checked,
 * so the control tag itself does not need to begin with Liquid delimiters.
 */
export function isControl (input: string) {

  const begin = input.indexOf('{');

  if (is(input[begin + 1], cc.PER)) {

    let token: string;

    token = input.slice(begin + (is(input[begin + 2], cc.DSH) ? 3 : 2)).trimStart();
    token = token.slice(0, token.search(/[\s=|!<>,.[]|-?[%}]}/));

    return token.startsWith('end') ? false : grammar.liquid.control.has(token);

  }

  return false;
}

/**
 * Is Liquid Else
 *
 * Check if input contains a Liquid control flow else type token. The entire input is checked,
 * so the control tag itself does not need to begin with Liquid delimiters.
 */
export function isElse (input: string) {

  const begin = input.indexOf('{');

  if (is(input[begin + 1], cc.PER)) {

    let token: string;

    token = input.slice(begin + (is(input[begin + 2], cc.DSH) ? 3 : 2)).trimStart();
    token = token.slice(0, token.search(/[\s=|!<>,.[]|-?[%}]}/));

    return token.startsWith('end') ? false : grammar.liquid.else.has(token);

  }

  return false;
}

/**
 * Is Value Liquid
 *
 * Check if an attribute value string contains Liquid tag type expression.
 */
export function isValue (input: string) {

  const eq = input.indexOf('=');

  if (eq > -1) {
    if (is(input[eq + 1], cc.DQO) || is(input[eq + 1], cc.SQO)) {
      return /{%-?\s*end[a-z]+/.test(input.slice(eq, input.lastIndexOf(input[eq + 1])));
    }
  }

  return false;
}

/**
 * Is Liquid Chain
 *
 * Checks for the existence of a Liquid Start type token and a
 * containing Liquid end type token. When detected it will return `true`
 *
 * Take the following samples:
 *
 * ```liquid
 *
 * {% # This will return true %}
 *
 * {% if x %}data-x={{ foo }}{% else %}data-y{% endif %}-foo
 *
 * {% # This will return false %}
 *
 * data-x={{ foo }}
 * ```
 */
export function isChain (input: string) {

  if (isStart(input)) return /{%-?\s*end\w+/.test(input);

  return false;
}

/**
 * Is Liquid Start
 *
 * Check if input contains a Liquid start type token. The grammars are consulted to
 * determine the start type.
 *
 * > Optional `strict` parameter to detect from index `0` to determine a Liquid tag expression only.
 */
export function isStart (input: string, strict = false) {

  let token: string;

  if (strict) {

    if (
      is(input[0], cc.LCB) &&
      is(input[1], cc.PER) &&
      isLastAt(input, cc.PER) &&
      isLast(input, cc.RCB)) {

      token = input.slice(is(input[2], cc.DSH) ? 3 : 2).trimStart();

      if (is(token, cc.DQO) || is(token, cc.SQO)) return false;

      token = token.slice(0, token.search(/[\s=|!<"'>,.[]|-?[%}]}/));

      return token.startsWith('end') ? false : grammar.liquid.tags.has(token);
    }

    return false;
  }

  let begin = input.indexOf('{');

  if (begin === -1) return false;

  do {

    if (is(input[begin + 1], cc.PER)) {

      token = input.slice(begin + (is(input[begin + 2], cc.DSH) ? 3 : 2)).trimStart();
      token = token.slice(0, token.search(/[\s=|!<>,.[]|-?[%}]}/));

      return token.startsWith('end')
        ? false
        : grammar.liquid.tags.has(token);

    }

    begin = input.indexOf('{', begin + 1);

  } while (begin > -1);

  return false;

}

/**
 * Is Liquid End
 *
 * Check if input contains a Liquid end type token.
 */
export function isEnd (input: string | string[]) {

  let token = input as string;

  if (Array.isArray(input)) token = input.join(NIL);

  const begin = token.indexOf('{');

  if (is(token[begin + 1], cc.PER)) {
    if (is(token[begin + 2], cc.DSH)) return token.slice(begin + 3).trimStart().startsWith('end');
    return token.slice(begin + 2).trimStart().startsWith('end');
  }

  return false;

}

/**
 * Checks for existence of liquid tokens.
 *
 * - `1` Check open delimiters, eg: `{{`, `{%`
 * - `2` Check close delimiters, eg: `}}`, `%}`
 * - `3` Check open and end delimiters, eg: `{{`, `}}`, `{%` or `%}`
 * - `4` Check open containment, eg: `xx {{` or `xx {%`
 * - `5` Check close containment, eg: `x }} x` or `x %} x`
 * - `6` Check open tag delimiters from index 0, eg: `{%`
 * - `7` Check open output delimiters from index 0, eg: `{{`
 * - `8` Check close tag delimiter from end, eg: `%}`
 * - `9` Check close output delimiter from end, eg: `}}`
 */
export function getTokenType (input: string, type: LqT): boolean {

  switch (type) {
    case LqT.Open:
      return is(input[0], cc.LCB) && (is(input[1], cc.PER) || is(input[1], cc.LCB));
    case LqT.OpenTag:
      return is(input[0], cc.LCB) && is(input[1], cc.PER);
    case LqT.OpenOutput:
      return is(input[0], cc.LCB) && is(input[1], cc.LCB);
    case LqT.CloseTag:
      return isLastAt(input, cc.PER) && is(input[input.length - 1], cc.RCB);
    case LqT.CloseOutput:
      return isLastAt(input, cc.RCB) && is(input[input.length - 1], cc.RCB);
    case LqT.HasOpen:
      return /{[{%]/.test(input);
    case LqT.HasOpenAndClose:
      return /{[{%]/.test(input) && /[%}]}/.test(input);
    case LqT.Close:
      return isLast(input, cc.RCB) && (isLastAt(input, cc.PER) || isLastAt(input, cc.RCB));
    case LqT.OpenAndClose:
      return (
        is(input[0], cc.LCB) && (is(input[1], cc.PER) || is(input[1], cc.LCB)) &&
        isLast(input, cc.RCB) && (isLastAt(input, cc.PER) || isLastAt(input, cc.RCB))
      );

  }

}
