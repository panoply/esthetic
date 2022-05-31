/* eslint no-use-before-define: ["error", { "variables": false }] */

// @ts-nocheck

import { sparser } from './sparser';
import { PrettyDiff, Meta } from '../../types/prettydiff';
import { options } from '../opts/options';

const prettydiff: PrettyDiff = function mode (diffmeta?: Meta) {

  /* -------------------------------------------- */
  /* OPTIONS                                      */
  /* -------------------------------------------- */

  const { options } = prettydiff;

  const pdcomment = function mode_pdcomment () {

    const ops = prettydiff.sparser.options;

    const sindex = options.source.search(/((\/(\*|\/))|{%-?\s*comment\s*-?%}|<!--*)\s*@prettify\s+format:/);
    const dindex = options.diff.search(/((\/(\*|\/))|<!--*)\s*@prettify\s+format:/);
    let a = 0;
    let b = 0;

    // @ts-ignore
    const def = prettydiff.sparser.libs.optionDef;
    const keys = Object.keys(def);
    const len = keys.length;

    // Parses the prettydiff settings comment
    //
    // - Source Priorities:
    //
    // * The prettydiff comment is only accepted if it  occurs before non-comments (near top)
    // * The options.source is the priority material for reading the comment
    // * The prettydiff comment will be processed from options.diff only if it present there,
    // missing from options.source, and options.mode is diff
    //
    // - Examples:
    //
    //  /*prettydiff.com width:80 preserveLine:4*/
    //  /* prettydiff.com width:80 preserveLine:4 */
    //  /*prettydiff.com width=80 preserveLine=4 */
    //  // prettydiff.com width=80 preserveLine:4
    //  <!-- prettydiff.com width:80 preserveLine=4 -->
    //  <!--prettydiff.com width:40 preserveLine:2-->
    //
    // - Parsing Considerations:
    //
    // * there may be any amount of space at the start or end of the comment
    // * "prettydiff.com" must exist at the start of the comment
    // * comment must exist prior to non-comment tokens (near top of code)
    // * parameters are name value pairs separated by white space
    // * the delimiter separating name and value is either ":" or "=" characters

    if ((
      sindex > -1 && (sindex === 0 || "\"':".indexOf(options.source.charAt(sindex - 1)) < 0)
    ) || (
      options.mode === 'diff' &&
      dindex > -1 &&
      (dindex === 0 || "\"':".indexOf(options.diff.charAt(dindex - 1)) < 0)
    )) {

      const pdcom = sindex;
      let a = (pdcom > -1) ? pdcom : dindex;
      let b = 0;
      let quote = '';
      let item = '';
      let lang = '';
      let lex = '';
      let valkey = [];
      let op = [];

      const ops = [];
      const source = (pdcom > -1) ? options.source : options.diff;
      const len = source.length;
      const comment = (source.charAt(a) === '<')
        ? '<!--'
        : (source.charAt(a + 1) === '/')
          ? '//'
          : '/\u002a';

      // mode_pdcomment_esc
      function esc () {

        if (source.charAt(a - 1) !== '\\') return false;

        let x = a;

        do {
          x = x - 1;
        } while (x > 0 && source.charAt(x) === '\\');

        return (a - x) % 2 === 0;
      };

      do {

        if (source.slice(a - 3, a) === 'com') break;
        a = a + 1;

      } while (a < len);

      do {

        if (esc() === false) {
          if (quote === '') {
            if (source.charAt(a) === '"') {

              quote = '"';

              if (ops.length > 0 && (
                ops[ops.length - 1].charAt(ops[ops.length - 1]
                  .length - 1) === ':' ||
                    ops[ops.length - 1].charAt(ops[ops.length - 1]
                      .length - 1) === '='
              )) {
                b = a;
              }

            } else if (source.charAt(a) === "'") {

              quote = "'";

              if (
                ops.length > 0 && (
                  ops[ops.length - 1].charAt(ops[ops.length - 1]
                    .length - 1) === ':' ||
                    ops[ops.length - 1].charAt(ops[ops.length - 1]
                      .length - 1) === '='
                )
              ) b = a;

            } else if (source.charAt(a) === '`') {

              quote = '`';

              if (

                ops.length > 0 && (
                  ops[ops.length - 1].charAt(ops[ops.length - 1]
                    .length - 1) === ':' ||
                    ops[ops.length - 1].charAt(ops[ops.length - 1]
                      .length - 1) === '='
                )

              ) b = a;

            } else if ((/\s/).test(source.charAt(a)) === false && b ===
                0) {

              b = a;

            } else if (
              source.charAt(a) === ',' || (
                (/\s/).test(source.charAt(a)) === true && b > 0)
            ) {

              item = source.slice(b, a);

              if (ops.length > 0) {

                if (
                  ops.length > 0 && (
                    item === ':' ||
                      item === '='
                  ) &&
                    ops[ops.length - 1].indexOf('=') < 0 &&
                    ops[ops.length - 1].indexOf(':') < 0
                ) {

                  // For cases where white space is between option name and
                  // assignment operator
                  ops[ops.length - 1] = ops[ops.length - 1] + item;
                  b = a;

                } else if (
                  ops.length > 0 && (
                    ops[ops.length - 1].charAt(ops[ops.length - 1]
                      .length - 1) === ':' ||
                      ops[ops.length - 1].charAt(ops[ops.length - 1]
                        .length - 1) === '='
                  )) {

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

          if (ops[a].indexOf('=') > 0 && ops[a].indexOf(':') > 0) {

            if (ops[a].indexOf('=') < ops[a].indexOf(':')) {
              op = [
                ops[a].slice(0, ops[a].indexOf('=')),
                ops[a].slice(ops[a].indexOf('=') + 1)
              ];
            }

          } else if (ops[a].indexOf('=') > 0) {

            op = [
              ops[a].slice(0, ops[a].indexOf('=')),
              ops[a].slice(ops[a].indexOf('=') + 1)
            ];

          } else if (ops[a].indexOf(':') > 0) {

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

            if (
              (op[1].charAt(0) === '"' || op[1].charAt(0) === "'" || op[1].charAt(0) === '`') &&
              op[1].charAt(op[1].length - 1) === op[1].charAt(0)
            ) {
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

        if (lex === '' && lang !== '') {
          lex = prettydiff.api.language
            .setlexer(lang);
        }

      }
    }

    if (options.mode === 'diff') modeValue = 'beautify';

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

      if (styleguide[options.styleguide] !== undefined) styleguide[options.styleguide]();
      if (braceStyle[options.braceStyle] !== undefined) braceStyle[options.braceStyle]();
      if (options.language === 'json') options.wrap = 0;

    }

    do {

      if (options[keys[a]] !== undefined) {

        if (def[keys[a]].lexer[0] === 'all') {

          ops[keys[a]] = options[keys[a]];

        } else {

          b = def[keys[a]].lexer.length;

          do {

            b = b - 1;

            if (
              keys[a] !== 'parseSpace' || (
                options.mode === 'parse' &&
                keys[a] === 'parseSpace' &&
                options[keys[a]] === true
              )
            ) {
              ops.lexerOptions[def[keys[a]].lexer[b]][keys[a]] = options[keys[a]];
            }

          } while (b > 0);
        }
      }

      a = a + 1;

    } while (a < len);
  };

  const lf = (options.crlf === true) ? '\r\n' : '\n';

  let modeValue = options.mode;
  let result = '';

  if (options.language === 'text' && options.mode !== 'diff') options.language = 'auto';
  if (options.lexer === 'text' && options.mode !== 'diff') options.lexer = 'auto';

  if (options.language === 'text' || options.lexer === 'text') {
    options.language = 'text';
    options.languageName = 'Plain Text';
    options.lexer = 'text';
  } else if (
    options.language === 'auto' ||
    options.lexer === 'auto'
  ) {

    let lang = prettydiff.api.language.auto(
      options.source,
      options.languageDefault ?? 'javascript'
    );

    if (lang[0] === 'text') {

      if (options.mode === 'diff') {
        lang[2] = 'Plain Text';
      } else {
        lang = [
          'javascript',
          'script',
          'JavaScript'
        ];
      }

    }

    if (options.language === 'auto') {
      (options.language as string) = lang[0];
      options.languageName = lang[2];
    }

    if (options.lexer === 'auto') {
      (options.lexer as string) = lang[1];
    }
  }

  pdcomment();

  if (options.mode === 'parse') {
    options.parsed = prettydiff.sparser.parser();
    result = JSON.stringify(options.parsed);
  } else {

    if (
      prettydiff[modeValue][options.lexer] === undefined && (
        (options.mode !== 'diff' && options.language === 'text') || options.language !== 'text'
      )
    ) {
      result = `Error: Library prettydiff.${modeValue}.${options.lexer} does not exist.`;
    } else {

      options.parsed = prettydiff.sparser.parser();
      result = prettydiff[modeValue][options.lexer](options);

    }
  }

  result = options.endNewline === true ? result.replace(/\s*$/, lf) : result.replace(/\s+$/, '');

  prettydiff.end = 0;
  prettydiff.start = 0;

  if (options.language === 'json') {

    try {

      JSON.parse(result);

    } catch (error) {

      prettydiff.sparser.parseError = error.message;

      return options.source;
    }
  }

  return result;
};

/* -------------------------------------------- */
/* OBJECTS                                      */
/* -------------------------------------------- */

prettydiff.api = Object.create(null);
prettydiff.beautify = Object.create(null);
prettydiff.meta = Object.create(null);
prettydiff.options = Object.create(null);
prettydiff.options.lexerOptions = Object.create(null);

/* -------------------------------------------- */
/* PRESETS                                      */
/* -------------------------------------------- */

prettydiff.end = 0;
prettydiff.iterator = 0;
prettydiff.scopes = [];
prettydiff.start = 0;

/* -------------------------------------------- */
/* META                                         */
/* -------------------------------------------- */

prettydiff.meta.error = '';
prettydiff.meta.lang = [ '', '', '' ];
prettydiff.meta.time = '';
prettydiff.meta.insize = 0;
prettydiff.meta.outsize = 0;
prettydiff.meta.difftotal = 0;
prettydiff.meta.difflines = 0;

/* -------------------------------------------- */
/* OPTIONS                                      */
/* -------------------------------------------- */

prettydiff.options.attributeSort = false;
prettydiff.options.attributeSortList = [];
prettydiff.options.braceNewline = false;
prettydiff.options.bracePadding = false;
prettydiff.options.braceStyle = 'none';
prettydiff.options.braceAllman = false;
prettydiff.options.caseSpace = false;
prettydiff.options.commentNewline = false;
prettydiff.options.comments = false;
prettydiff.options.compressCSS = false;
prettydiff.options.config = '';
prettydiff.options.content = false;
prettydiff.options.attemptCorrection = false;
prettydiff.options.crlf = false;
prettydiff.options.classPadding = false;
prettydiff.options.diff = '';
prettydiff.options.diffFormat = 'text';
prettydiff.options.ifReturnInline = true;
prettydiff.options.elseNewline = false;
prettydiff.options.endComma = 'never';
prettydiff.options.endQuietly = 'default';
prettydiff.options.forceAttribute = false;
prettydiff.options.forceIndent = false;
prettydiff.options.arrayFormat = 'default';
prettydiff.options.objectIndent = 'default';
prettydiff.options.functionNameSpace = false;
prettydiff.options.help = 80;
prettydiff.options.indentChar = ' ';
prettydiff.options.indentLevel = 0;
prettydiff.options.indentSize = 4;
prettydiff.options.language = 'auto';
prettydiff.options.languageDefault = 'text';
prettydiff.options.languageName = 'JavaScript';
prettydiff.options.lexer = 'auto';
prettydiff.options.methodChain = 3;
prettydiff.options.mode = 'diff';
prettydiff.options.neverFlatten = false;
prettydiff.options.endNewline = false;
prettydiff.options.noCaseIndent = false;
prettydiff.options.noLeadZero = false;
prettydiff.options.noSemicolon = false;
prettydiff.options.objectSort = false;
prettydiff.options.output = '';
prettydiff.options.parseFormat = 'parallel';
prettydiff.options.parseSpace = false;
prettydiff.options.preserveLine = 0;
prettydiff.options.preserveComment = false;
prettydiff.options.preserveText = false;
prettydiff.options.quote = false;
prettydiff.options.quoteConvert = 'none';
prettydiff.options.selector_list = false;
prettydiff.options.semicolon = false;
prettydiff.options.source = '';
prettydiff.options.space = true;
prettydiff.options.selfCloseSpace = false;
prettydiff.options.styleguide = 'none';
prettydiff.options.tagMerge = false;
prettydiff.options.tagSort = false;
prettydiff.options.ternaryLine = false;
prettydiff.options.preserveAttributes = false;
prettydiff.options.variableList = 'none';
prettydiff.options.version = false;
prettydiff.options.vertical = false;
prettydiff.options.wrap = 0;

/* -------------------------------------------- */
/* SPARSER                                      */
/* -------------------------------------------- */

prettydiff.sparser = sparser;

export { prettydiff };
