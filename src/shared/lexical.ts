import { grammar } from '@shared/grammar';
import { LT, cc } from '@shared/enums';
import { is, isLast, not } from '@utils/helpers';

/* -------------------------------------------- */
/* COMMON CHARACTERS                            */
/* -------------------------------------------- */

/**
 * `''` –  Empty String
 */
export const NIL = '';

/**
 * ` ` – Single whitespace character
 */
export const WSP = ' ';

/**
 * `\t` – Single tab character
 */
export const TAB = '\t';

/**
 * `\n` – Newline character
 */
export const NWL = '\n';

/* -------------------------------------------- */
/* HELPER FUNCTIONS                             */
/* -------------------------------------------- */

/**
 * Get Liquid Tag Name
 *
 * Returns the tag name of the provided token. Looks for HTML and Liquid tag names,
 * includes Liquid output objects too. Will convert tag names to lowercase.
 *
 * Optionally provide a slice offset index to slice the tag name. Helpful in situations
 * when we need to exclude `end` from `endtag`
 */
export function getLiquidTagName (input: string) {

  const begin = input.indexOf('{');
  const token = is(input[begin + 2], cc.DSH)
    ? input.slice(begin + 3).trimStart()
    : input.slice(begin + 2).trimStart();

  return token.slice(0, token.search(/\s/));

}

/**
 * Get Tag Name
 *
 * Returns the tag name of the provided token. Looks for HTML and Liquid tag names,
 * includes Liquid output objects too. Will convert tag names to lowercase.
 *
 * Optionally provide a slice offset index to slice the tag name. Helpful in situations
 * when we need to exclude `end` from `endtag`
 */
export function getTagName (tag: string, slice: number = NaN) {

  if (typeof tag !== 'string') return NIL;

  if (not(tag, cc.LAN) && not(tag, cc.LCB)) return tag;

  if (is(tag, cc.LAN)) {

    const next = tag.search(/[\s>]/);
    const name = tag.slice(is(tag[1], cc.FWS) ? 2 : 1, next);

    // Handles XML tag name (ie: <?xml?>)
    return is(name, cc.QWS) && isLast(name, cc.QWS) ? 'xml' : isNaN(slice)
      ? name.toLowerCase()
      : name.slice(slice).toLowerCase();

  }

  // Returns the Liquid tag or output token name
  const name = is(tag[2], cc.DSH)
    ? tag.slice(3).trimStart()
    : tag.slice(2).trimStart();

  const tname = name.slice(0, name.search(/[\s=|!<>,.[]|-?[%}]}/)).toLowerCase();

  return isNaN(slice)
    ? tname
    : tname.slice(slice);

};

/**
 * Is Liquid Output
 *
 * Check if input contains a Liquid output type token. The entire input is checked,
 * so the control tag itself does not need to begin with Liquid delimiters.
 */
export function isLiquidOutput (input: string) {

  const begin = input.indexOf('{');

  return is(input[begin + 1], cc.LCB);

}

/**
 * Is Liquid Control
 *
 * Check if input contains a Liquid control type tag. The entire input is checked,
 * so the control tag itself does not need to begin with Liquid delimiters.
 */
export function isLiquidControl (input: string) {

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
export function isLiquidElse (input: string) {

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
export function isValueLiquid (input: string) {

  const eq = input.indexOf('=');

  if (eq > -1) {
    if (is(input[eq + 1], cc.DQO) || is(input[eq + 1], cc.SQO)) {
      return /{%-?\s*end[a-z]+/.test(input.slice(eq, input.lastIndexOf(input[eq + 1])));
    }
  }

  return false;
}

/**
 * Is Liquid Line
 *
 * Returns a Liquid `{% end %}` regex expression matcher
 */
export function isLiquidLine (input: string) {

  if (isLiquidStart(input)) return /{%-?\s*end\w+/.test(input);

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
export function isLiquidStart (input: string, strict = false) {

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
export function isLiquidEnd (input: string | string[]) {

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
export function isLiquid (input: string, type: LT): boolean {

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
