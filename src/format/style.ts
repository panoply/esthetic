import type { Types } from 'types/index';
import { is, isLast, not } from 'utils/helpers';
import { NIL, WSP } from 'chars';
import { cc } from 'lexical/codes';
import { grammar } from 'parse/grammar';
import { parse } from 'parse/parser';
import { object } from 'utils/native';

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
   * Hold state reference of indents
   */
  const indents: { [K in Types]: number } = object(null);

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
  const tab = rules.indentChar.repeat(rules.indentSize);
  // const tab = (() => {

  //   let aa = 0;
  //   const bb = [];

  //   do {
  //     bb.push(rules.indentChar);
  //     aa = aa + 1;
  //   } while (aa < rules.indentSize);

  //   return bb.join(NIL);

  // })();

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

    const lines = [];

    const total = (() => {

      if (a === len - 1) return 1;

      if (data.lines[a + 1] - 1 > pres) return pres;
      if (data.lines[a + 1] > 1) return data.lines[a + 1] - 1;

      return 1;

    })();

    let index = 0;

    if (tabs < 0) tabs = 0;

    do {
      lines.push(crlf);
      index = index + 1;
    } while (index < total);

    if (tabs > 0) {
      index = 0;
      do {
        lines.push(tab);
        index = index + 1;
      } while (index < tabs);
    }

    build.push(lines.join(NIL));

  };

  /* -------------------------------------------- */
  /* BEAUTIFICATION LOOP                          */
  /* -------------------------------------------- */

  do {

    if (isType(a + 1, 'end') || isType(a + 1, 'liquid_end') || isType(a + 1, 'liquid_else')) {
      if (indent > 0) indent = indent - 1;
    }

    if (isType(a, 'liquid')) {

      if (isType(a - 1, 'separator')) newline(indent);

      build.push(data.token[a]);

      if (
        isType(a + 1, 'separator') === false &&
        not(data.token[a + 1], cc.SEM) &&
        grammar.css.units.has(data.token[a + 1]) === false) {

        if (isType(a + 1, 'start')) {
          build.push(WSP);
        } else if (isType(a + 1, 'colon') === false) {
          newline(indent);
        }
      }

    } else if (
      isType(a - 1, 'selector') &&
      isType(a, 'liquid') &&
      isType(a + 1, 'selector')
    ) {

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

      // if next item is a property type
      if (isType(a + 1, 'property')) indent = indent + 1;

      if (data.lines[a + 1] === 1) {

        build.push(WSP);

      } else if (data.lines[a + 1] > 1) {

        newline(indent);

      }

    } else if (isType(a, 'liquid_start')) {

      build.push(data.token[a]);

      if (data.lines[a + 1] === 1) {

        build.push(WSP);

      } else if (data.lines[a + 1] > 1) {

        indent = indent + 1;

        // if next item has 0 lines then the liquid start
        // token is glued, eg: {% if x %}something
        //
        // When lines of next entry is more than 1, eg: {% if x %} something
        // then we will apply indentation
        //
        newline(indent);

      } else {

        // EDGE CASE
        //
        // The structure looks like this:
        //
        // {% if foo %}{{ something }} {
        //
        // We need to determine whether or not to apply forcing. This will be
        // done by checking data lines, if start type (eg: `{`) is forced then
        // we should force next occurance. data.lines[a + 3] will give us the
        // determination here.
        //
        if ((isType(a + 1, 'liquid') || isType(a + 1, 'selector')) && isType(a + 2, 'start')) {

          indent = indent + 1;
          newline(indent);
        }

      }

    } else if (isType(a, 'liquid_end')) {

      build.push(data.token[a]);

      if (isType(a + 1, 'start')) {
        build.push(WSP);
      } else if (data.lines[a + 1] !== 0) {
        newline(indent);
      }

    } else if (isType(a, 'start')) {

      // indent = indent + 1;

      build.push(data.token[a]);

      // if next item is a property type
      //
      // .class {^
      //   property: value
      // }
      //
      if (
        isType(a + 1, 'property') ||
        isType(a + 1, 'selector') ||
        isType(a + 1, 'comment') ||
        isType(a + 1, 'liquid') ||
        isType(a + 1, 'liquid_start')
      ) {

        indent = indent + 1;
      }

      if (isType(a + 1, 'end') === false) {

        // if next item has 0 lines then the liquid start
        // token is glued, eg: {% if x %}something
        //
        // When lines of next entry is more than 1, eg: {% if x %} something
        // then we will apply indentation
        //
        newline(indent);

      }

    } else if (is(data.token[a], cc.SEM)) {

      build.push(data.token[a]);

      if (isType(a + 1, 'property')) {
        if ((
          (isType(a - 2, 'liquid') || isType(a - 2, 'liquid_end')) && isType(a - 1, 'value')
        ) || (
          isType(a - 1, 'liquid_end')
        )) {

          indent = indent + 1;

          if (indent > indents.property) indent = indents.property;

        }

      }

      newline(indent);

    } else if (isType(a, 'end') || isType(a, 'comment')) {

      build.push(data.token[a]);

      if (isType(a + 1, 'value')) {

        if (data.lines[a + 1] === 1) {

          build.push(WSP);

        } else if (data.lines[a + 1] > 1) {

          newline(indent);

        }

      } else if (
        isType(a - 1, 'liquid_end') &&
        isType(a, 'separator') &&
        isType(a + 1, 'property')
      ) {

        indent = indent + 1;
        newline(indent);

      } else if (isType(a + 1, 'separator') === false) {

        if (isType(a + 1, 'comment') === false || (isType(a + 1, 'comment') && data.lines[a + 1] > 1)) {

          newline(indent);

        } else {

          build.push(WSP);

        }

      } else if (isType(a, 'comment') && isType(a + 1, 'comment') === false) {

        if (data.lines[a] > 1) {

          newline(indent);

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

        // detects :root
        if (isType(a, 'at_rule') && isType(a + 2, 'colon')) indent = indent + 1;

      } else if (data.types[a + 1].indexOf('liquid') > -1) {

        // CSS Selector glue occurance
        // connects liquid token with selector
        if (data.lines[a + 1] === 0) {
          build.push(data.token[a + 1]);

          a = a + 1;

          if (isType(a + 1, 'start')) build.push(WSP);
          if (isType(a + 1, 'selector') && is(data.token[a + 1], cc.DOT)) build.push(WSP);

        }
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

      if (isType(a - 1, 'selector') && isType(a + 1, 'liquid_end')) {

        newline(indent);

      }

    } else if (
      data.stack[a] === 'map' &&
      is(data.token[a + 1], cc.RPR) &&
      a - data.begin[a] > 5
    ) {

      build.push(data.token[a]);

      newline(indent);

    } else if (data.token[a] === 'x;') {

      newline(indent);

    } else if ((
      isType(a, 'variable') ||
      isType(a, 'function')
    ) &&
      rules.style.classPadding === true &&
      isType(a - 1, 'end') &&
      data.lines[a] < 3
    ) {

      build.push(crlf);
      build.push(data.token[a]);

    } else if (not(data.token[a], cc.SEM)) {

      build.push(data.token[a]);

      // Structure look like this:
      //
      // something^ {% endtag %}
      //
      // OR
      //
      // something^
      // {% endtag %}
      //
      // We will determine the amount of lines
      // and apply forced indentation or not
      //
      if (isType(a + 1, 'liquid_end') || isType(a + 1, 'liquid_else')) {

        if (data.lines[a + 1] === 1) {

          build.push(WSP);

        } else if (data.lines[a + 1] > 1) {

          newline(indent);

        }

      }

    }

    switch (data.types[a + 1]) {
      case 'property':
        indents.property = indent;
        break;
      case 'end':
        indents.property = indent - 1;
        break;
      case 'selector':
        if (data.types[a] === 'selector') indents.property = indent;
        break;
    }

    a = a + 1;

  } while (a < len);

  parse.iterator = len - 1;

  if (build[0] === parse.crlf || is(build[0], cc.WSP)) build[0] = NIL;

  return rules.endNewline === true
    ? build.join(NIL).replace(/\s*$/, parse.crlf)
    : build.join(NIL).replace(/\s+$/, NIL);

};
