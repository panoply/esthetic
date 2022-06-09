import { Prettify } from '../prettify.d';
import * as language from './language';
import { cc } from '../../utils/enums';
import { keys } from '../../utils/native';

/**
 * Parses the inline comment settings. This has been adapted from
 * the PrettyDiff comment parser and refactored to focus purely on
 * the Prettify supported logics.
 *
 * Source Priorities:
 *
 * - The comment is only accepted if it occurs before non-comments (near top)
 * - The `options.source` is the priority material for reading the comment
 *
 * Examples:
 *
 * - `/* @format width: 80 preserveLine: 4 } *\/`
 * - `// @format width: 80 preserveLine: 4`
 * - `<!-- @format width: 80 preserveLine: 4 -->`
 * - `{% comment %} @format width:40 preserveLine:2 {% endcomment %}`
 *
 * Parsing Considerations:
 *
 * 1. There may be any amount of space at the start or end of the comment
 * 2. `@format` must exist at the start of the comment
 * 3. Comment must exist prior to non-comment tokens (near top of code)
 * 4. Parameters are name value pairs separated by white space
 * 5. The delimiter separating name and value must be a colon character, eg: `:`
 */
export function comment (prettify: Prettify) {

  const definitions = prettify.definitions;
  const sindex = prettify.source.search(/((\/(\*|\/))|{%-?\s*comment\s*-?%}|<!--)\s*@format\s*(\w+)?\s*{\s+/);
  const k = keys(definitions);
  const len = k.length;

  let a = 0;
  let b = 0;

  if ((sindex > -1 && (sindex === 0 || "\"':".indexOf(prettify.source.charAt(sindex - 1)) < 0))) {

    const ops = [];
    const pdcom = sindex;
    const source = prettify.source;
    const len = source.length;

    let a = pdcom;
    let b = 0;
    let quote = '';
    let item = '';
    let lang = '';
    let lex = '';
    let valkey = [];
    let op = [];
    let rcb: number;
    let comment: string;

    if (source.charAt(a) === '<') {
      comment = '<!--';
    } else if (source.charAt(a + 1) === '/') {
      comment = '//';
    } else if (source.charAt(a + 1) === '%') {
      rcb = source.indexOf('}', a + 1);
      if (source[rcb - 1].charCodeAt(0) === cc.PER) comment = source.slice(a, rcb + 1);
    } else {
      comment = '/\u002a';
    }

    function esc () {

      if (source.charAt(a - 1) !== '\\') return false;

      let x = a;

      do {
        x = x - 1;
      } while (x > 0 && source.charAt(x) === '\\');

      return (a - x) % 2 === 0;
    };

    do {
      if (source.slice(a - 7, a) === '@format') break;
      a = a + 1;
    } while (a < len);

    do {

      if (esc() === false) {

        if (quote === '') {

          if (source.charAt(a) === '"' || source.charAt(a) === "'" || source.charAt(a) === '`') {

            quote = source.charAt(a);

            if (ops.length > 0 && ops[ops.length - 1].charAt(ops[ops.length - 1].length - 1) === ':') b = a;

          } else if ((/\s/).test(source.charAt(a)) === false && b === 0) {

            b = a;

          } else if (source.charAt(a) === ',' || ((/\s/).test(source.charAt(a)) === true && b > 0)) {

            item = source.slice(b, a);

            if (ops.length > 0) {

              if (ops.length > 0 && item === ':' && ops[ops.length - 1].indexOf(':') < 0) {

                // For cases where white space is between option name
                // and  assignment operator
                ops[ops.length - 1] = ops[ops.length - 1] + item;

                b = a;

              } else if (ops.length > 0 && ops[ops.length - 1].charAt(ops[ops.length - 1].length - 1) === ':') {

                // For cases where white space is between assignment
                // operator and value
                ops[ops.length - 1] = ops[ops.length - 1] + item;

                b = 0;

              } else {

                ops.push(item);
                b = 0;
              }

            } else {
              ops.push(item);
              b = 0;
            }
          }

          if (comment === '<!--' && source.slice(a - 2, a + 1) === '-->') break;
          if (comment === '//' && source.charAt(a) === '\n') break;
          if (comment === '/\u002a' && source.slice(a - 1, a + 1) === '\u002a/') break;

          // HANDLE CLOSING LIQUID COMMENT
          if (
            comment.charCodeAt(1) === cc.PER &&
            source.slice(a - 1, a + 1) === '%' &&
            source.indexOf('endcomment', source.indexOf('{%', rcb)) > 0
          ) break;

        } else if (source.charAt(a) === quote && quote !== '${') {
          quote = '';
        } else if (quote === '`' && source.slice(a, a + 2) === '${') {
          quote = '${';
        } else if (quote === '${' && source.charAt(a) === '}') {
          quote = '`';
        }
      }

      a = a + 1;

    } while (a < len);

    if (b > 0) {

      quote = source.slice(b, a + 1);

      if (comment === '<!--') quote = quote.replace(/\s*-+>$/, '');
      else if (comment === '//') quote = quote.replace(/\s+$/, '');
      else quote = quote.replace(/\s*\u002a\/$/, '');

      ops.push(quote);
    }

    a = ops.length;

    if (a > 0) {

      do {

        a = a - 1;

        if (ops[a].indexOf(':') > 0) {
          op = [ ops[a].slice(0, ops[a].indexOf(':')), ops[a].slice(ops[a].indexOf(':') + 1) ];
        } else if (definitions[ops[a]] !== undefined && definitions[ops[a]].type === 'boolean') {
          prettify.options[ops[a]] = true;
        }

        if (op.length === 2 && definitions[op[0]] !== undefined) {

          if (
            op[1].charAt(op[1].length - 1) === op[1].charAt(0) && (
              op[1].charAt(0) === '"' ||
              op[1].charAt(0) === "'" ||
              op[1].charAt(0) === '`'
            )
          ) {

            op[1] = op[1].slice(1, op[1].length - 1);
          }

          if (definitions[op[0]].type === 'number' && isNaN(Number(op[1])) === false) {

            prettify.options[op[0]] = Number(op[1]);

          } else if (definitions[op[0]].type === 'boolean') {

            prettify.options[op[0]] = op[1] === 'true';

          } else {

            if (definitions[op[0]].values !== undefined) {

              valkey = keys(definitions[op[0]].values);
              b = valkey.length;

              do {

                b = b - 1;

                if (valkey[b] === op[1]) {
                  prettify.options[op[0]] = op[1];
                  break;
                }
              } while (b > 0);

            } else {

              if (op[0] === 'language') {
                lang = op[1];
              } else if (op[0] === 'lexer') {
                lex = op[1];
              }

              prettify.options[op[0]] = op[1];
            }
          }
        }
      } while (a > 0);

      if (lex === '' && lang !== '') lex = language.setLexer(lang);

    }
  }

  if (prettify.options.lexer === 'script') {
    if (prettify.options.styleGuide !== undefined) {
      switch (prettify.options.styleGuide) {
        case 'airbnb':
          prettify.options.bracePadding = true;
          prettify.options.attemptCorrection = true;
          prettify.options.endComma = 'always';
          prettify.options.indentChar = ' ';
          prettify.options.indentSize = 2;
          prettify.options.preserveLine = 1;
          prettify.options.quoteConvert = 'single';
          prettify.options.variableList = 'each';
          prettify.options.wrap = 80;
          break;
        case 'crockford':
          prettify.options.bracePadding = false;
          prettify.options.attemptCorrection = true;
          prettify.options.elseNewline = false;
          prettify.options.endComma = 'never';
          prettify.options.indentChar = ' ';
          prettify.options.indentSize = 4;
          prettify.options.noCaseIndent = true;
          prettify.options.functionSpace = true;
          prettify.options.variableList = 'each';
          prettify.options.vertical = false;
          break;
        case 'google':
          prettify.options.attemptCorrection = true;
          prettify.options.indentChar = ' ';
          prettify.options.indentSize = 4;
          prettify.options.preserveLine = 1;
          prettify.options.quoteConvert = 'single';
          prettify.options.vertical = false;
          prettify.options.wrap = -1;
          break;
        case 'jquery':
          prettify.options.bracePadding = true;
          prettify.options.attemptCorrection = true;
          prettify.options.indentChar = '\u0009';
          prettify.options.indentSize = 1;
          prettify.options.quoteConvert = 'double';
          prettify.options.variableList = 'each';
          prettify.options.wrap = 80;
          break;
        case 'jslint':
          prettify.options.bracePadding = false;
          prettify.options.attemptCorrection = true;
          prettify.options.elseNewline = false;
          prettify.options.endComma = 'never';
          prettify.options.indentChar = ' ';
          prettify.options.indentSize = 4;
          prettify.options.noCaseIndent = true;
          prettify.options.functionSpace = true;
          prettify.options.variableList = 'each';
          prettify.options.vertical = false;
          break;
        case 'standard':
          prettify.options.braceNewline = false;
          prettify.options.bracePadding = false;
          prettify.options.braceAllman = false;
          prettify.options.attemptCorrection = true;
          prettify.options.endComma = 'never';
          prettify.options.indentChar = ' ';
          prettify.options.indentSize = 2;
          prettify.options.endNewline = false;
          prettify.options.noSemicolon = true;
          prettify.options.preserveLine = 1;
          prettify.options.quoteConvert = 'single';
          prettify.options.functionSpace = true;
          prettify.options.ternaryLine = false;
          prettify.options.variableList = 'each';
          prettify.options.vertical = false;
          prettify.options.wrap = 0;
          break;
        case 'yandex':
          prettify.options.bracePadding = false;
          prettify.options.attemptCorrection = true;
          prettify.options.quoteConvert = 'single';
          prettify.options.variableList = 'each';
          prettify.options.vertical = false;
          break;
      }

      if (prettify.options.styleGuide === 'airbnb') {
        prettify.options.bracePadding = true;
        prettify.options.attemptCorrection = true;
        prettify.options.endComma = 'always';
        prettify.options.indentChar = ' ';
        prettify.options.indentSize = 2;
        prettify.options.preserveLine = 1;
        prettify.options.quoteConvert = 'single';
        prettify.options.variableList = 'each';
        prettify.options.wrap = 80;
      }
    }

    if (prettify.options.braceStyle !== undefined) {

      switch (prettify.options.braceStyle) {
        case 'collapse':
          prettify.options.braceNewline = false;
          prettify.options.bracePadding = false;
          prettify.options.braceAllman = false;
          prettify.options.objectIndent = 'indent';
          prettify.options.neverFlatten = true;
          break;
        case 'collapse-preserve-inline':
          prettify.options.braceNewline = false;
          prettify.options.bracePadding = true;
          prettify.options.braceAllman = false;
          prettify.options.objectIndent = 'inline';
          prettify.options.neverFlatten = false;
          break;
        case 'expand':
          prettify.options.braceNewline = false;
          prettify.options.bracePadding = false;
          prettify.options.braceAllman = true;
          prettify.options.objectIndent = 'indent';
          prettify.options.neverFlatten = true;
          break;
      }

    }

    if (prettify.options.language === 'json') prettify.options.wrap = 0;

  }

  do {

    if (prettify.options[keys[a]] !== undefined) {
      b = definitions[keys[a]].lexer.length;
      do { b = b - 1; } while (b > 0);
    }

    a = a + 1;

  } while (a < len);

};
