import { grammar } from '@parse/grammar';
import { is, not } from 'utils';
import { cc } from './codes';
import { LT } from './enum';
import { NIL, WSP } from './chars';
import { LiquidRules } from 'types/internal';
import { LiquidComment, LiquidTag, WhitespaceGlob } from './regex';

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
export function normalize (input: string, rules: LiquidRules) {

  if (rules.delimiterTrims === 'force') {

    if (is(input[1], cc.PER)) {

      if (not(input[2], cc.DSH)) input = input.replace(/^{%/, '{%-');
      if (not(input[input.length - 3], cc.DSH)) input = input.replace(/%}$/, '-%}');

    } else {

      if (not(input[2], cc.DSH)) input = input.replace(/^{{/, '{{-');
      if (not(input[input.length - 3], cc.DSH)) input = input.replace(/}}$/, '-}}');

    }

  } else if (rules.delimiterTrims === 'strip') {

    input = input
      .replace(/^{%-/, '{%')
      .replace(/-%}$/, '%}')
      .replace(/^{{-/, '{{')
      .replace(/-}}$/, '}}');

  } else if (rules.delimiterTrims === 'tags' && is(input[1], cc.PER)) {

    if (not(input[2], cc.DSH)) input = input.replace(/^{%/, '{%-');
    if (not(input[input.length - 3], cc.DSH)) input = input.replace(/%}$/, '-%}');

  } else if (rules.delimiterTrims === 'outputs' && is(input[1], cc.LCB)) {

    if (not(input[2], cc.DSH)) input = input.replace(/^{{/, '{{-');
    if (not(input[input.length - 3], cc.DSH)) input = input.replace(/}}$/, '-}}');
  }

  // ensure normalize spacing is enabld
  if (rules.normalizeSpacing === false) return input;

  // skip line comments or liquid tag
  if (LiquidComment.test(input) || LiquidTag.test(input)) return input;

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

  return input.split(/(["']{1})/).map((char, idx, arr) => {

    const quotation = is(char[0], cc.DQO) || is(char[0], cc.SQO);

    if (q > 0 || (quotation && q === 0 && not(arr[idx - 1], cc.BWS)) || quotation) {

      if (q === 0) t = char.charCodeAt(0);

      // Move forward for nested quote type, eg: DQO or SQO
      if (q === 1 && not(arr[idx - 1], cc.BWS)) {
        if (t === char.charCodeAt(0)) q = 2;
        return char;
      }

      if (q !== 2) {
        q = q === 0 ? 1 : q === 1 ? is(arr[idx - 1], cc.BWS) ? 1 : 2 : 0;
        return char;
      }

      q = 0;

    }

    return char
      .replace(WhitespaceGlob, WSP)
      .replace(/^({[{%]-?)/, '$1 ')
      .replace(/([!=]=|[<>]=?)/g, ' $1 ')
      .replace(/ +(?=[|[\],:.])|(?<=[[.]) +/g, NIL)
      .replace(/(\||(?<=[^=!<>])(?:(?<=assign[^=]+)=(?=[^=!<>])|=$))/g, ' $1 ')
      .replace(/([:,]$|[:,](?=\S))/g, '$1 ')
      .replace(/(-?[%}]})$/, ' $1')
      .replace(WhitespaceGlob, WSP);

  }).join(NIL);

};

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
