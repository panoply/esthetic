/* eslint-disable prefer-const */
import type { LiquidInternal, LiquidRules, Rules } from 'types';
import { grammar } from 'parse/grammar';
import { is } from 'utils/helpers';
import { cc } from 'lexical/codes';
import { LT } from 'lexical/enum';
import { COM, NIL, NWL, WSP } from 'lexical/chars';

/**
 * Opening Delimiters
 *
 * Applies `delimiterTrims` applied formatting to the opening
 * delimiter sequences of Liquid tokens.
 */
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
  } else if (
    rules.delimiterPlacement === 'inline' ||
    rules.delimiterPlacement === 'default' ||
    rules.delimiterPlacement === 'force-multiline'
  ) {

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

/**
 * Closing Delimiters
 *
 * Applies `delimiterTrims` applied formatting to the closing
 * delimiter sequences of Liquid tokens.
 */
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

  } else if (
    rules.delimiterPlacement === 'inline' ||
    rules.delimiterPlacement === 'default' ||
    rules.delimiterPlacement === 'force-multiline'
  ) {

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

    } else if (
      rules.delimiterPlacement === 'inline' ||
      rules.delimiterPlacement === 'default' ||
      rules.delimiterPlacement === 'force-multiline') {

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
  return open + token + close;

};

export function tokenize (lexed: string[], tname: string, liquid: LiquidInternal, {
  wrapFraction,
  liquid: {
    forceFilter,
    forceArgument,
    lineBreakSeparator,
    delimiterTrims,
    delimiterPlacement,
    preserveInternal
  }
}: Rules) {

  const [ o, c ] = delims(lexed);

  /**
   * Opening Delimiter
   */
  let open: string;

  /**
   * Closing Delimiter
   */
  let close: string;

  /* -------------------------------------------- */
  /* TRIMS                                        */
  /* -------------------------------------------- */

  if (delimiterTrims === 'never') {

    open = `{${lexed[1]}`;
    close = `${lexed[lexed.length - 2]}}`;

  } else if ((
    delimiterTrims === 'always'
  ) || (
    delimiterTrims === 'outputs' &&
    is(lexed[1], cc.LCB)
  ) || (
    delimiterTrims === 'tags' &&
    is(lexed[1], cc.PER)
  )) {

    open = `{${lexed[1]}-`;
    close = `-${lexed[lexed.length - 2]}}`;

  } else if (delimiterTrims === 'preserve') {

    open = lexed.slice(0, o).join(NIL);
    close = lexed.slice(c).join(NIL);

  } else {

    open = `{${lexed[1]}`;
    close = `${lexed[lexed.length - 2]}}`;

  }

  /* -------------------------------------------- */
  /* SINGLETONS                                   */
  /* -------------------------------------------- */

  if (
    tname === 'else' ||
    tname === 'break' ||
    tname === 'continue' ||
    tname === 'increment' ||
    tname === 'decrement' || tname.startsWith('end')) {

    open += WSP;
    close = WSP + close;

    return open + lexed.slice(o, c).join(NIL).trim() + close;

  }

  /* -------------------------------------------- */
  /* DELIMITER PLACEMENTS                         */
  /* -------------------------------------------- */

  if (delimiterPlacement === 'preserve') {

    open += (is(lexed[o], cc.NWL) ? NWL : WSP);
    close = (is(lexed[c - 1], cc.NWL) ? NWL : WSP) + close;

  } else if (delimiterPlacement === 'force') {

    open += NWL;
    close = NWL + close;

  } else if (delimiterPlacement === 'inline' || delimiterPlacement === 'default') {

    open += WSP;
    close = WSP + close;

  } else if (delimiterPlacement === 'consistent') {

    if (is(lexed[o], cc.NWL)) {
      open += NWL;
      close = NWL + close;
    } else {
      open += WSP;
      close = WSP + close;
    }

  } else {
    open += WSP;
    close = WSP + close;
  }

  /* -------------------------------------------- */
  /* PRESERVE INTERNAL                            */
  /* -------------------------------------------- */

  if (preserveInternal === true) return open + lexed.slice(o, c).join(NIL).trim() + close;

  /* -------------------------------------------- */
  /* FORCE WRAP CONDITIONALS                      */
  /* -------------------------------------------- */

  if (wrapFraction > 0 && lexed.length >= wrapFraction && liquid.logic.length > 0 && (
    tname === 'if' ||
    tname === 'elsif' ||
    tname === 'unless' ||
    tname === 'when'
  )) {

    if (delimiterTrims === 'multiline') {
      open = `{${lexed[1]}-` + open[open.length - 1];
      close = close[0] + `-${lexed[lexed.length - 2]}}`;
    }

    if (delimiterPlacement === 'force-multiline' || delimiterPlacement === 'force') {

      open = open.trimEnd() + NWL;
      close = NWL + close.trimStart();

    } else if (delimiterPlacement === 'preserve') {

      open += (is(lexed[o], cc.NWL) ? NWL : WSP);

    } else if (delimiterPlacement === 'inline') {

      open += WSP;

    } else if (delimiterPlacement === 'consistent') {

      open += is(lexed[o], cc.NWL) ? NWL : WSP;

    }

    const s: number = liquid.logic.length;

    for (let x = 0; x < s; x++) {

      const i = liquid.logic[x];
      lexed[i] = NWL + lexed[i];

      if (is(lexed[i - 1], cc.WSP)) lexed[i - 1] = NIL;

    }

    return open + lexed.slice(o, c).join(NIL).trim() + close;

  }

  /* -------------------------------------------- */
  /* FORCE WRAP FILTERS                           */
  /* -------------------------------------------- */

  const pipes: number = liquid.pipes.length;

  if (pipes > 0) {

    // console.log(lexed.join(NIL), lexed.length, wrapFraction);

    if ((
      (
        forceFilter > 0 &&
        pipes > forceFilter
      ) || (
        forceFilter === 0 &&
        wrapFraction > 0 &&
        lexed.length > wrapFraction
      )
    )) {

      if (delimiterTrims === 'multiline') {

        open = `{${lexed[1]}-` + open[open.length - 1];
        close = close[0] + `-${lexed[lexed.length - 2]}}`;

      }

      if (delimiterPlacement === 'force-multiline') {

        open = open.trimEnd() + NWL;
        close = NWL + close.trimStart();

      }

      for (let i: number = 0; i < pipes; i++) {

        const pipe = liquid.pipes[i];

        if (is(lexed[pipe - 1], cc.WSP)) lexed[pipe - 1] = NIL;

        lexed[pipe] = NWL + lexed[pipe];

        // First sequence pipe exclude extraneous whitespace
        if (i === 0) {

          let p: number = pipe - 1;

          if (is(lexed[p - 1], cc.WSP)) {
            do lexed[p--] = NIL;
            while (is(lexed[p], cc.WSP));
          }

        }

        if (liquid.fargs[i] && (
          (
            forceArgument > 0 &&
            liquid.fargs[i].length > forceArgument
          ) || (
            forceArgument === 0 &&
            wrapFraction > 0 &&
            lexed.slice(
              liquid.fargs[i][0],
              liquid.fargs[i][liquid.fargs[i].length - 1]
            ).length > wrapFraction
          )
        )) {

          const args: number = liquid.fargs[i].length;

          for (let n: number = 0; n < args; n++) {

            const arg = liquid.fargs[i][n];

            if (lineBreakSeparator === 'after') {

              lexed[is(lexed[arg - 1], cc.COM) ? arg - 1 : arg] = n === 0
                ? NWL + '  '
                : COM + NWL + ' ';

            } else if (lineBreakSeparator === 'before') {

              if (is(lexed[arg - 1], cc.COM)) {

                lexed[arg - 1] = n === 0
                  ? '  ' + NWL
                  : NWL + '  ' + COM;

              } else {

                lexed[arg] = n === 0
                  ? NWL + '  '
                  : NWL + '  ' + COM;
              }

            } else {

              lexed[arg] = NWL + '  ' + lexed[arg];

            }
          }

        }
      }

    }

    return open + lexed.slice(o, c).join(NIL).trim() + close;

  }

  /* -------------------------------------------- */
  /* FORCE WRAP ARGUMENTS                         */
  /* -------------------------------------------- */

  if (liquid.targs.length >= forceArgument) {

    if (delimiterTrims === 'multiline') {

      open = `{${lexed[1]}-` + open[open.length - 1];
      close = close[0] + `-${lexed[lexed.length - 2]}}`;

    }

    //
    for (let x = 0; x < liquid.targs.length; x++) {

      const arg = liquid.targs[x];

      if (lineBreakSeparator === 'after') {

        if (is(lexed[arg + 1], cc.WSP)) lexed[arg + 1] = NIL;
        if (is(lexed[arg - 1], cc.WSP)) lexed[arg - 1] = NIL;

        lexed[arg] = is(lexed[arg], cc.COM)
          ? COM + NWL
          : NWL;

      } else if (lineBreakSeparator === 'before') {

        if (is(lexed[arg - 1], cc.COM)) {

          lexed[arg - 1] = x === 0
            ? NWL + COM
            : NWL + COM;

        } else {

          lexed[arg] = x === 0
            ? NWL + COM
            : NWL + COM;
        }

      }

    }
  }

  return open + lexed.slice(o, c).join(NIL).trim() + close;

}

/**
 * Delimiters
 *
 * Determines the indexes of Liquid tag delimiters from provided input.
 * Returns an array where `[0]` is opening index and `[1]` is closing
 */
export function delims (input: string | string[]): [ open: number, close: number ] {

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
