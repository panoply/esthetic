/* eslint-disable prefer-const */
import { grammar } from 'parse/grammar';
import { is, not } from 'utils';
import { cc } from 'lexical/codes';
import { LT } from 'lexical/enum';
import { NIL, NWL, WSP } from 'lexical/chars';
import { LiquidRules } from 'types/index';
import { LiquidComment, LiquidTag, WhitespaceGlob } from 'lexical/regex';

export function openDelims (input: string, rules: LiquidRules) {

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
  } else if (rules.delimiterPlacement === 'force') {
    open += NWL;
  } else if (rules.delimiterPlacement === 'inline' || rules.delimiterPlacement === 'default') {
    open += WSP;
  } else if (rules.delimiterPlacement === 'consistent') {
    if (/^\s*\n/.test(token)) {
      open += NWL;
    } else {
      open += WSP;
    }
  }

  return open + token.trim();

}

export function closeDelims (input: string, rules: LiquidRules) {

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
  } else if (rules.delimiterPlacement === 'force') {
    close = NWL + close;
  } else if (rules.delimiterPlacement === 'inline' || rules.delimiterPlacement === 'default') {
    close = WSP + close;
  } else if (rules.delimiterPlacement === 'consistent') {
    if (/^\s*\n/.test(token)) {
      close = NWL + close;
    } else {
      close = WSP + close;
    }
  }

  return token.trim() + close;

}
/**
 * Inner
 *
 * Pads template tag delimters with a space. This function
 * was updated to also support whitespace dashes:
 *
 * - `{{` or `{{-`
 * - `{%` or`{%-`
 * - `}}` or `-}}`
 * - `%}`or `-%}`
 */
export function normalize (input: string, tname: string, rules: LiquidRules) {

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

  if (rules.delimiterTrims === 'never') {

    open = `{${input[1]}`;
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

    open += WSP;
    close = WSP + close;

  } else {

    if (rules.delimiterPlacement === 'preserve') {

      open += /^\s*\n/.test(token) ? NWL : WSP;
      close = (/\s*\n\s*$/.test(token) ? NWL : WSP) + close;

    } else if (rules.delimiterPlacement === 'force') {

      open += NWL;
      close = NWL + close;

    } else if (rules.delimiterPlacement === 'inline' || rules.delimiterPlacement === 'default') {

      open += WSP;
      close = WSP + close;

    } else if (rules.delimiterPlacement === 'consistent') {

      if (/^\s*\n/.test(token)) {
        open += NWL;
        close = NWL + close;

      } else {
        open += WSP;
        close = WSP + close;
      }

    }

  }

  token = token.trim();

  // ensure normalize spacing is enabld
  if (rules.normalizeSpacing === false) return open + token + close;

  // skip line comments or liquid tag
  if (LiquidComment.test(input) || LiquidTag.test(input)) return open + token + close;

  /**
   * The starting quotation code character
   */
  let t: cc.DQO | cc.SQO;

  /**
   * Quotation Reference
   *
   * Tracks string quotes allowing them to be skipped.
   *
   * - `0` token is not a string
   * - `1` We have encountered a string, eg: {{ '^
   * - `2` We have closed the last known string, eg: {{ 'foo'^
   */
  let q: 0 | 1 | 2 = 0;

  const clean = (char: string) => char
    .replace(WhitespaceGlob, WSP)
    .replace(/([!=]=|[<>]=?)/g, ' $1 ')
    .replace(/\s+(?=[|[\],:.])|(?<=[[.]) +/g, NIL)
    .replace(/(\||(?<=[^=!<>])(?:(?<=assign[^=]+)=(?=[^=!<>])|=$))/g, ' $1 ')
    .replace(/([:,]$|[:,](?=\S))/g, '$1 ')
    .replace(WhitespaceGlob, WSP);

  const x = token.split(/(["'])/).map((char, idx, arr) => {

    const quotation = is(char[0], cc.DQO) || is(char[0], cc.SQO);

    if (q > 0 || (quotation && q === 0 && not(arr[arr[idx - 1].length - 1], cc.BWS)) || quotation) {

      if (q === 0) t = char.charCodeAt(0);

      // Move forward for nested quote type, eg: DQO or SQO
      if (q === 1 && not(arr[arr[idx - 1].length - 1], cc.BWS)) {
        if (t === char.charCodeAt(0)) q = 0;

        return char;

      } else if (q !== 2) {
        q = q === 0 ? 1 : q === 1 ? is(arr[arr[idx - 1].length - 1], cc.BWS) ? 1 : 2 : 0;
        return char;
      }

      q = 0;

    }

    return clean(char);

  });

  return open + x.join(NIL) + close;

};

/**
 * Delimiters
 *
 * Determines the indexes of Liquid tag delimiters from provided input.
 * Returns an array where `[0]` is opening index and `[1]` is closing
 */
export function delims (input: string): [ open: number, close: number ] {

  return [
    is(input[2], cc.DSH) ? 3 : 2,
    is(input[input.length - 3], cc.DSH) ? input.length - 3 : input.length - 2
  ];

}

/**
 * Expression
 *
 * Generate a Liquid tag regular expression using the provided input
 * name. The `fuse` parameter will return an expression with closing
 * delimiters, which defaults to `true`
 */
export function exp (input: string, fuse = true) {

  return fuse
    ? new RegExp(`{%-?\\s*${input}\\s*-?%}`)
    : new RegExp(`{%-?\\s*${input}`);
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

  return is(input[begin + 1], cc.LCB);

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

    return token.startsWith('end')
      ? false
      : grammar.liquid.else.has(token);

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
      is(input[input.length - 2], cc.PER) &&
      is(input[input.length - 1], cc.RCB)) {

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
 * Checks for existense of liquid tokens.
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
export function isType (input: string, type: LT): boolean {

  if (type === LT.Open) {

    return is(input[0], cc.LCB) && (is(input[1], cc.PER) || is(input[1], cc.LCB));

  } else if (type === LT.OpenTag) {

    return is(input[0], cc.LCB) && is(input[1], cc.PER);

  } else if (type === LT.OpenOutput) {

    return is(input[0], cc.LCB) && is(input[1], cc.LCB);

  } else if (type === LT.CloseTag) {

    return is(input[input.length - 2], cc.PER) && is(input[input.length - 1], cc.RCB);

  } else if (type === LT.CloseOutput) {

    return is(input[input.length - 2], cc.RCB) && is(input[input.length - 1], cc.RCB);

  } else if (type === LT.HasOpen) {

    return /{[{%]/.test(input);

  } else if (type === LT.HasOpenAndClose) {

    return (/{[{%]/.test(input) && /[%}]}/.test(input));

  } else if (type === LT.Close) {

    const size = input.length;

    return is(input[size - 1], cc.RCB) && (is(input[size - 2], cc.PER) || is(input[size - 2], cc.RCB));

  } else if (type === LT.OpenAndClose) {

    const size = input.length;

    return (
      is(input[0], cc.LCB) && (
        is(input[1], cc.PER) ||
        is(input[1], cc.LCB)
      )
    ) && (
      is(input[size - 1], cc.RCB) && (
        is(input[size - 2], cc.PER) ||
        is(input[size - 2], cc.RCB)
      )
    );

  }

}
