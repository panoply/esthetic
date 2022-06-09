import { PrettyDiff } from '../../types/prettydiff';
import { cc } from '../shared/enums';

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
export function comment (prettydiff: PrettyDiff) {

  const { options } = prettydiff;
  const sindex = options.source.search(/((\/(\*|\/))|{%-?\s*comment\s*-?%}|<!--)\s*@format\s*(\w+)?\s*{\s+/);

  let a = 0;
  let b = 0;

  // @ts-ignore
  const def = prettydiff.sparser.libs.optionDef;
  const keys = Object.keys(def);
  const len = keys.length;

  if ((sindex > -1 && (sindex === 0 || "\"':".indexOf(options.source.charAt(sindex - 1)) < 0))) {

    const ops = [];
    const pdcom = sindex;
    const source = options.source;
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

    // mode_pdcomment_esc
    function esc () {

      if (source.charAt(a - 1) !== '\\') return false;

      let x = a;

      do { x = x - 1; } while (x > 0 && source.charAt(x) === '\\');
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

                // For cases where white space is between option name and
                // assignment operator
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
          op = [
            ops[a].slice(0, ops[a].indexOf(':')),
            ops[a].slice(ops[a].indexOf(':') + 1)
          ];
        } else if (
          prettydiff.api.optionDef[ops[a]] !== undefined &&
          prettydiff.api.optionDef[ops[a]].type === 'boolean'
        ) {

          options[ops[a]] = true;
        }

        if (op.length === 2 && prettydiff.api.optionDef[op[0]] !== undefined) {

          if (op[1].charAt(op[1].length - 1) === op[1].charAt(0) && (
            op[1].charAt(0) === '"' ||
            op[1].charAt(0) === "'" ||
            op[1].charAt(0) === '`'
          )) {

            op[1] = op[1].slice(1, op[1].length - 1);
          }

          if (prettydiff.api.optionDef[op[0]].type === 'number' && isNaN(Number(op[1])) === false) {

            options[op[0]] = Number(op[1]);

          } else if (prettydiff.api.optionDef[op[0]].type === 'boolean') {

            options[op[0]] = op[1] === 'true';

          } else {

            if (prettydiff.api.optionDef[op[0]].values !== undefined) {

              valkey = Object.keys(prettydiff.api.optionDef[op[0]].values);
              b = valkey.length;

              do {

                b = b - 1;

                if (valkey[b] === op[1]) {
                  options[op[0]] = op[1];
                  break;
                }

              } while (b > 0);

            } else {

              if (op[0] === 'language') {
                lang = op[1];
              } else if (op[0] === 'lexer') {
                lex = op[1];
              }

              options[op[0]] = op[1];

            }
          }
        }
      } while (a > 0);

      if (lex === '' && lang !== '') lex = prettydiff.api.language.setlexer(lang);

    }
  }

  if (options.lexer === 'script') {

    const styleguide = {
      airbnb () {
        options.bracePadding = true;
        options.attemptCorrection = true;
        options.endComma = 'always';
        options.indentChar = ' ';
        options.indentSize = 2;
        options.preserveLine = 1;
        options.quoteConvert = 'single';
        options.variableList = 'each';
        options.wrap = 80;
      }
      , crockford () {
        options.bracePadding = false;
        options.attemptCorrection = true;
        options.elseNewline = false;
        options.endComma = 'never';
        options.indentChar = ' ';
        options.indentSize = 4;
        options.noCaseIndent = true;
        options.functionSpace = true;
        options.variableList = 'each';
        options.vertical = false;
      }
      , google () {
        options.attemptCorrection = true;
        options.indentChar = ' ';
        options.indentSize = 4;
        options.preserveLine = 1;
        options.quoteConvert = 'single';
        options.vertical = false;
        options.wrap = -1;
      }
      , jquery () {
        options.bracePadding = true;
        options.attemptCorrection = true;
        options.indentChar = '\u0009';
        options.indentSize = 1;
        options.quoteConvert = 'double';
        options.variableList = 'each';
        options.wrap = 80;
      }
      , jslint () {
        options.bracePadding = false;
        options.attemptCorrection = true;
        options.elseNewline = false;
        options.endComma = 'never';
        options.indentChar = ' ';
        options.indentSize = 4;
        options.noCaseIndent = true;
        options.functionSpace = true;
        options.variableList = 'each';
        options.vertical = false;
      }
      , mrdoobs () {
        options.braceNewline = true;
        options.bracePadding = true;
        options.attemptCorrection = true;
        options.indentChar = '\u0009';
        options.indentSize = 1;
        options.vertical = false;
      }
      , mediawiki () {
        options.bracePadding = true;
        options.attemptCorrection = true;
        options.indentChar = '\u0009';
        options.indentSize = 1;
        options.preserveLine = 1;
        options.quoteConvert = 'single';
        options.functionSpace = false;
        options.wrap = 80;
      }
      , meteor () {
        options.attemptCorrection = true;
        options.indentChar = ' ';
        options.indentSize = 2;
        options.wrap = 80;
      }
      , semistandard () {
        options.braceNewline = false;
        options.bracePadding = false;
        options.braceAllman = false;
        options.attemptCorrection = true;
        options.endComma = 'never';
        options.indentChar = ' ';
        options.indentSize = 2;
        options.endNewline = false;
        options.noSemicolon = false;
        options.preserveLine = 1;
        options.quoteConvert = 'single';
        options.functionSpace = true;
        options.ternaryLine = false;
        options.variableList = 'each';
        options.vertical = false;
        options.wrap = 0;
      }
      , standard () {
        options.braceNewline = false;
        options.bracePadding = false;
        options.braceAllman = false;
        options.attemptCorrection = true;
        options.endComma = 'never';
        options.indentChar = ' ';
        options.indentSize = 2;
        options.endNewline = false;
        options.noSemicolon = true;
        options.preserveLine = 1;
        options.quoteConvert = 'single';
        options.functionSpace = true;
        options.ternaryLine = false;
        options.variableList = 'each';
        options.vertical = false;
        options.wrap = 0;
      }
      , yandex () {
        options.bracePadding = false;
        options.attemptCorrection = true;
        options.quoteConvert = 'single';
        options.variableList = 'each';
        options.vertical = false;
      }
    };

    const braceStyle = {
      collapse () {
        options.braceNewline = false;
        options.bracePadding = false;
        options.braceAllman = false;
        options.objectIndent = 'indent';
        options.neverFlatten = true;
      }
      , 'collapse-preserve-inline': function () {
        options.braceNewline = false;
        options.bracePadding = true;
        options.braceAllman = false;
        options.objectIndent = 'inline';
        options.neverFlatten = false;
      }
      , expand () {
        options.braceNewline = false;
        options.bracePadding = false;
        options.braceAllman = true;
        options.objectIndent = 'indent';
        options.neverFlatten = true;
      }
    };

    if (styleguide[options.styleGuide] !== undefined) styleguide[options.styleGuide]();
    if (braceStyle[options.braceStyle] !== undefined) braceStyle[options.braceStyle]();
    if (options.language === 'json') options.wrap = 0;

  }

  do {

    if (options[keys[a]] !== undefined) {
      b = def[keys[a]].lexer.length;
      do { b = b - 1; } while (b > 0);
    }

    a = a + 1;

  } while (a < len);
};
