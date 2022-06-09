/* eslint no-use-before-define: ["error", { "variables": false }] */

// @ts-nocheck

import { sparser } from './sparser';
import { PrettyDiff } from '../../types/prettydiff';
import { comment } from './comment';
// import { options } from '../opts/options';

const prettydiff: PrettyDiff = function mode () {

  /* -------------------------------------------- */
  /* OPTIONS                                      */
  /* -------------------------------------------- */

  const { options } = prettydiff;
  const lf = (options.crlf === true) ? '\r\n' : '\n';
  const modeValue = options.mode;

  let result = '';

  if (options.language === 'text') options.language = 'auto';
  if (options.lexer === 'text') options.lexer = 'auto';
  if (options.language === 'text' || options.lexer === 'text') {

    options.language = 'text';
    options.languageName = 'Plain Text';
    options.lexer = 'text';

  } else if (options.language === 'auto' || options.lexer === 'auto') {

    let lang = prettydiff.api.language.auto(options.source, options.languageDefault ?? 'javascript');

    if (lang[0] === 'text') lang = [ 'javascript', 'script', 'JavaScript' ];
    if (options.lexer === 'auto') options.lexer = lang[1];
    if (options.language === 'auto') {
      options.language = lang[0];
      options.languageName = lang[2];
    }
  }

  comment(prettydiff);

  if (options.mode === 'parse') {
    options.parsed = prettydiff.sparser.parser();
    result = JSON.stringify(options.parsed);
  } else {
    if (!prettydiff[modeValue][options.lexer] && (options.language === 'text' || options.language !== 'text')) {
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

console.log(prettydiff.sparser);

export { prettydiff };
