/* eslint-disable prefer-const */

import type { LiquidInternal, LiquidRules, Rules } from 'types';

import { COM, NIL, NWL, WSP } from 'lexical/chars';
import { cc } from 'lexical/codes';
import { LqT, Modes } from 'lexical/enum';
import { grammar } from 'parse/grammar';
import { parse } from 'parse/parser';
import { glue, is, isLast, isLastAt, isWS, not, ns } from 'utils/helpers';

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
  const [ O, C ] = delims(input);

  /**
   * Opening Delimiter
   */
  let open: string;

  /**
   * The inner token content
   */
  let token: string = input.slice(O, C);

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

    open = input.slice(0, O);
    close = input.slice(C);

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
export function DelimiterGlue (
  input: string,
  indent: string,
  spaces: string,
  placeMultiline: boolean,
  trimsMultiline: boolean
): [
  [
    open: string,
    token: string[],
    close: string
  ],
  [
    open: string,
    close: string
  ]
] {

  const length = input.length;
  const token: [
    open?: string,
    token?: string[],
    close?: string,
  ] = [];

  const multi: [
    open?: string,
    close?: string
  ] = [];

  let O: number;
  let C: number;

  if (is(input[2], cc.DSH)) {
    if (is(input[3], cc.NWL)) {
      O = 4;
      token.push(input.slice(0, O) + indent + spaces);
    } else {
      O = 3;
      token.push(input.slice(0, O) + WSP);
    }
  } else {
    if (is(input[2], cc.NWL)) {
      O = 3;
      token.push(input.slice(0, O) + indent + spaces);
    } else {
      O = 2;
      token.push(input.slice(0, O) + WSP);
    }
  }

  if (is(input[length - 3], cc.DSH)) {

    if (is(input[length - 4], cc.NWL)) {
      C = -3;
      token.push(input.slice(O, length - 4).trim().split(NWL), NWL + indent + input.slice(-3));
    } else {
      C = -3;
      token.push(input.slice(O, length - 4).trim().split(NWL), WSP + input.slice(-3));
    }
  } else {
    if (is(input[length - 3], cc.NWL)) {
      C = -2;
      token.push(input.slice(O, length - 3).trim().split(NWL), NWL + indent + input.slice(-2));
    } else {
      C = -2;
      token.push(input.slice(O, length - 2).trim().split(NWL), WSP + input.slice(-2));
    }
  }

  if (placeMultiline) {

    multi.push(
      input.slice(0, O) + NWL + indent + spaces,
      NWL + indent + input.slice(C)
    );
  } else {
    multi.push(null, null);
  }

  return [
    token as [
      open: string,
      token: string[],
      close: string
    ],
    multi as [
      open: string,
      close: string
    ]
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
