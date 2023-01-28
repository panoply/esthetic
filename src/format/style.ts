import type { Types } from 'types/internal';
import { is, isLast, not } from '@utils/helpers';
import { cc, NIL, WSP } from '@utils/chars';
import { grammar } from '@shared/grammar';
import { parse } from '@parse/parser';

/* -------------------------------------------- */
/* MARKUP BEAUTIFICATION                        */
/* -------------------------------------------- */

// prettify.beautify.style =

export function style () {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * The beautified result
   */
  const build: string[] = [];

  /**
   * Reference to `options.parsed`
   */
  const { data, rules, crlf } = parse;

  /**
   * The input length
   */
  const len = parse.ender > 0 ? parse.ender + 1 : data.token.length;

  /**
   * Line preservation
   */
  const pres = rules.preserveLine + 1;

  /**
   * Single unit of indentation
   */
  const tab = (() => {

    let aa = 0;
    const bb = [];

    do {
      bb.push(rules.indentChar);
      aa = aa + 1;
    } while (aa < rules.indentSize);

    return bb.join(NIL);

  })();

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Indentation level - References `rules.indentLevel`
   */
  let indent = rules.indentLevel;

  /**
   * Holds the current index position.
   */
  let a = parse.start;

  /**
   * When store - Holds reference to something (unsure what this is for?)
   */
  let when = [ NIL, NIL ];

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */
  /* -------------------------------------------- */
  /* UTILITIES                                    */
  /* -------------------------------------------- */

  /**
   * Is Type
   *
   * Check whether the token type at specific index
   * equals the provided name. Returns a truthy.
   *
   * > Use `isNotType` for false comparisons.
   */
  function isType (index: number, name: Types) {

    return data.types[index] === name;

  }

  /**
   * Applies New lines plus indentation
   */
  function newline (tabs: number) {

    const linesout = [];

    const total = (() => {

      if (a === len - 1) return 1;

      if (data.lines[a + 1] - 1 > pres) return pres;
      if (data.lines[a + 1] > 1) return data.lines[a + 1] - 1;

      return 1;

    })();

    let index = 0;

    if (tabs < 0) tabs = 0;

    do {
      linesout.push(crlf);
      index = index + 1;
    } while (index < total);

    if (tabs > 0) {
      index = 0;
      do {
        linesout.push(tab);
        index = index + 1;
      } while (index < tabs);
    }

    build.push(linesout.join(NIL));

  };

  /* -------------------------------------------- */
  /* BEAUTIFICATION LOOP                          */
  /* -------------------------------------------- */

  do {

    if (isType(a + 1, 'end') || isType(a + 1, 'liquid_end') || isType(a + 1, 'liquid_else')) {

      indent = indent - 1;

    }

    if (isType(a, 'liquid') && data.lines[a] > 0) {

      build.push(data.token[a]);

      if (not(data.token[a + 1], cc.SEM) && grammar.css.units.has(data.token[a + 1]) === false) {

        newline(indent);

      }

    } else if (isType(a - 1, 'selector') && isType(a, 'liquid') && isType(a + 1, 'selector')) {

      build.push(data.token[a]);

      // Template token select is proceeded by another selector
      // type then we apply an additional whitespace dash
      //
      if (isLast(data.token[a - 1], cc.DSH) && (
        is(data.token[a + 1], cc.DOT) ||
        is(data.token[a + 1], cc.HSH) ||
        is(data.token[a + 1], cc.AND)
      )) {

        build.push(WSP);

      }

    } else if (isType(a, 'liquid_else')) {

      build.push(data.token[a]);

      indent = indent + 1;

      newline(indent);

    } else if (isType(a, 'start') || isType(a, 'liquid_start')) {

      indent = indent + 1;

      build.push(data.token[a]);

      if (isType(a + 1, 'end') === false && isType(a + 1, 'liquid_end') === false) {

        newline(indent);

      }

    } else if (is(data.token[a], cc.SEM) || (
      isType(a, 'end') ||
      isType(a, 'liquid_end') ||
      isType(a, 'comment')
    )) {

      build.push(data.token[a]);

      if (isType(a + 1, 'value')) {

        if (data.lines[a + 1] === 1) {

          build.push(WSP);

        } else if (data.lines[a + 1] > 1) {

          newline(indent);

        }

      } else if (isType(a + 1, 'separator') === false) {

        if (isType(a + 1, 'comment') === false || (isType(a + 1, 'comment') && data.lines[a + 1] > 1)) {

          newline(indent);

        } else {

          build.push(WSP);

        }
      }

    } else if (is(data.token[a], cc.COL)) {

      build.push(data.token[a]);

      if (isType(a + 1, 'selector') === false && not(data.token[a + 1], cc.COM)) {

        build.push(WSP);

      }

    } else if (isType(a, 'selector') || isType(a, 'at_rule')) {

      if (rules.style.classPadding === true && isType(a - 1, 'end') && data.lines[a] < 3) {

        newline(indent);
        // build.push(crlf);

      }

      if (data.token[a].indexOf('and(') > 0) {

        data.token[a] = data.token[a].replace(/and\(/, 'and (');

        build.push(data.token[a]);

      } else if (data.token[a].indexOf('when(') > 0) {

        when = data.token[a].split('when(');

        build.push(when[0].replace(/\s+$/, NIL));

        newline(indent + 1);

        build.push(`when (${when[1]}`);

      } else {

        build.push(data.token[a]);
      }

      if (isType(a + 1, 'start')) {

        build.push(WSP);

      }

    } else if (is(data.token[a], cc.COM)) {

      if (isType(a + 1, 'value')) {

        newline(indent);

        build.push(data.token[a]);

      } else {

        build.push(data.token[a]);
      }

      if (isType(a + 1, 'selector') || isType(a + 1, 'property')) {
        newline(indent);
      } else {
        build.push(WSP);
      }

    } else if (data.stack[a] === 'map' && is(data.token[a + 1], cc.RPR) && a - data.begin[a] > 5) {

      build.push(data.token[a]);

      newline(indent);

    } else if (data.token[a] === 'x;') {

      newline(indent);

    } else if ((isType(a, 'variable') || isType(a, 'function')) &&
      rules.style.classPadding === true &&
      isType(a - 1, 'end') &&
      data.lines[a] < 3
    ) {

      build.push(crlf);
      build.push(data.token[a]);

    } else if (not(data.token[a], cc.SEM)) {

      build.push(data.token[a]);

    }

    a = a + 1;

  } while (a < len);

  parse.iterator = len - 1;

  return build.join(NIL);

};
