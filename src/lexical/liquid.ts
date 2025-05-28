/* eslint-disable prefer-const */

import type { Rules } from 'types';

import { NIL, NWL, WSP } from 'lexical/chars';
import { cc } from 'lexical/codes';
import { LqT } from 'lexical/enum';
import { grammar } from 'parse/grammar';
import { parse } from 'parse/parser';
import { is, isLast, isLastAt } from 'utils/helpers';

/**
 * Opening Delimiters
 *
 * Applies `delimiterTrims` applied formatting to the opening
 * delimiter sequences of Liquid tokens.
 */
export function openDelims (input: string, rules: Rules, delimOnly = false) {

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
export function closeDelims (input: string, rules: Rules, delimOnly = false) {

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
 * fully parsed token. The operation is responsible for applying a subset of
 * augmentations and fixes as Liquid delimiters are subject to different output
 * structures depending on the inner contents of tags.
 *
 * The following fixes/beautification is handled during the format cycle, whereas
 * this function is executed during the lexing cycle only.
 *
 * 1. When `delimiterPlacement` is set to `newline-multiline` the result is determined during format
 * 2. When `delimiterTrims` is set to `multiline` the result will be determined during format
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
  const { rules } = parse;

  /**
   * Destructed open and close delimiters from input
   */
  const [ O, C ] = delims(input);

  /**
   * Opening Delimiter
   */
  let open: string = input.slice(0, O);

  /**
   * The inner token content
   */
  let token: string = input.slice(O, C);

  /**
   * Closing Delimiter
   */
  let close: string = input.slice(C);

  if (tname !== '#') {
    if (rules.delimiterTrims === 'never') {

      open = `{${input[1]}`;
      close = `${input[input.length - 2]}}`;

    } else if (
      (rules.delimiterTrims === 'always') ||
      (rules.delimiterTrims === 'outputs' && is(input[1], cc.LCB)) ||
      (rules.delimiterTrims === 'tags' && is(input[1], cc.PER))) {

      open = `{${input[1]}-`;
      close = `-${input[input.length - 2]}}`;

    }
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

    if (rules.delimiterPlacement === 'preserve') {

      open += /^\s*\n/.test(token) ? NWL : space;
      close = (/\s*\n\s*$/.test(token) ? NWL : space) + close;

    } else if (rules.delimiterPlacement === 'inline' || rules.delimiterPlacement === 'newline-multiline') {

      if (tname === '#' && /\n{2,}/g.test(token.trim())) {
        open += NWL;
        close = NWL + close;
      } else {
        open += space;
        close = space + close;
      }

    } else if (rules.delimiterPlacement === 'consistent') {

      if (/^\s*\n/.test(token)) {
        open += NWL;
        close = NWL + close;
      } else {
        open += space;
        close = space + close;
      }

    }

  }

  return open + token.trim() + close;

};

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
 * Delimiters
 *
 * Determines the indexes of Liquid tag delimiters from provided input.
 * Returns an array where `[0]` is opening index and `[1]` is closing
 */
export function token (input: string, indent: string, spaces: string) {

  const length = input.length;

  const lexed: {
    open: {
      /**
       * The delimiter character of token:
       *
       * `{%`, `{{`, `{%-`, `{{-`
       */
      delim?: string,
     /**
       * The delimiter with trims applied when `delimiterTrims` is `multiline`
       * This will either match `delim` if `delim` alreadys contains `-` otherwise
       * will be `delim` with `-` suffixed
       *
       * `{%-`, `{{-`
       */
     trims?: string,
      /**
       * The newline or whitespace following delimeter including indentation
       *
       * ` `, `\n `
       */
      space?: string,
      /**
       * Multiline indentation when `delimiterPlacement` is `newline-multiline`
       * When `null` the rule is not set to `newline-multiline`
       *
       * `\n `, `\n   `
       */
      multi?: string,
    },
    lines?: string[]
    close: {
      /**
       * The delimiter character of token:
       *
       * `%}`, `}}`, `-%}`, `-}}`
       */
      delim?: string;
      /**
       * The newline or whitespace following delimeter including indentation
       *
       * ` `, `\n `
       */
      space?: string;
      /**
       * The delimiter with trims applied when `delimiterTrims` is `multiline`
       * This will either match `delim` if `delim` alreadys contains `-` otherwise
       * will be `delim` with `-` prefixed
       *
       * `-%}`, `-}}`
       */
      trims?: string,
      /**
       * Multiline indentation when `delimiterPlacement` is `newline-multiline`
       * When `null` the rule is not set to `newline-multiline`
       *
       * `\n `, `\n   `
       */
      multi?: string;
    }
  } = {
    open: {
      space: WSP,
      multi: NWL + indent + spaces
    },
    lines: null,
    close: {
      space: WSP,
      multi: NWL + indent
    }
  };

  let from: number;

  if (is(input[2], cc.DSH)) {
    from = 3;
    lexed.open.delim = lexed.open.trims = input.slice(0, 3);
    if (is(input[3], cc.NWL)) lexed.open.space = NWL + indent + spaces;
  } else {
    from = 2;
    lexed.open.delim = input.slice(0, 2);
    lexed.open.trims = lexed.open.delim + '-';
    if (is(input[2], cc.NWL)) lexed.open.space = NWL + indent + spaces;
  }

  if (is(input[length - 3], cc.DSH)) {
    lexed.close.delim = lexed.close.trims = input.slice(length - 3);
    lexed.lines = input.slice(from, length - 4).trim().split(NWL);
    if (is(input[length - 4], cc.NWL)) lexed.close.space = NWL + indent;
  } else {

    lexed.close.delim = input.slice(-2);
    lexed.close.trims = '-' + lexed.close.delim;

    if (is(input[length - 3], cc.NWL)) {
      lexed.close.space = NWL + indent;
      lexed.lines = input.slice(from, length - 3).trim().split(NWL);
    } else {
      lexed.lines = input.slice(from, length - 2).trim().split(NWL);
    }

  }

  return lexed;

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
