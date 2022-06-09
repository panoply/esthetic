import { defaults } from './prettydiff';
import * as sp from './sparser';

export function markup (options = {}) {

  const o = Object.create(null);

  o.indentSize = 2;
  o.attemptCorrection = false;
  o.attributeSort = false;
  o.attributeSortList = [];
  o.commentIndent = false;
  o.commentNewline = false;
  o.forceAttribute = false;
  o.forceIndent = false;
  o.indentChar = ' ';
  o.indentLevel = 0;
  o.language = 'html';
  o.languageDefault = 'html';
  o.languageName = 'HTML/Liquid';
  o.endNewline = true;
  o.preserveAttributes = false;
  o.preserveComment = true;
  o.preserveLine = 2;
  o.preserveText = true;
  o.quoteConvert = 'double';
  o.selfCloseSpace = false;
  o.wrap = 0;

  return merge('markup', o, options);

}

export function style (options = {}) {

  const o = Object.create(null);

  o.braceAllman = false;
  o.classPadding = false;
  o.compressedCSS = false;
  o.indentChar = ' ';
  o.indentLevel = 0;
  o.indentSize = 2;
  o.language = 'css';
  o.languageDefault = 'css';
  o.languageName = 'CSS/Liquid';
  o.lexer = 'style';
  o.mode = 'beautify';
  o.endNewline = true;
  o.noLeadZero = false;
  o.objectSort = false;
  o.preserveLine = 3;
  o.quoteConvert = 'none';
  o.wrap = 0;

  return merge('style', o, options);

}

export function script (options = {}) {

  const o = Object.create(null);

  o.arrayFormat = 'default';
  o.attemptCorrection = false;
  o.braceAllman = false;
  o.bracePadding = false;
  o.braceStyle = 'none';
  o.endComma = 'never';
  o.indentChar = ' ';
  o.indentLevel = 0;
  o.indentSize = 2;
  o.language = 'javascript';
  o.languageDefault = 'javascript';
  o.languageName = 'JavaScript';
  o.lexer = 'script';
  o.mode = 'beautify';
  o.braceNewline = false;
  o.caseSpace = false;
  o.commentIndent = false;
  o.commentNewline = false;
  o.elseNewline = false;
  o.endNewline = true;
  o.functionNameSpace = true;
  o.functionSpace = false;
  o.methodChain = 0;
  o.neverFlatten = false;
  o.noCaseIndent = false;
  o.noSemicolon = false;
  o.objectIndent = 'default';
  o.objectSort = false;
  o.preserveComment = true;
  o.preserveLine = 3;
  o.preserveText = false;
  o.quoteConvert = 'none';
  o.semicolon = false;
  o.ternaryLine = false;
  o.variableList = 'none';
  o.vertical = false;
  o.wrap = 0;

  return merge('script', o, options);

}

export function json (options = {}) {

  const o = Object.create(null);

  o.arrayFormat = 'default';
  o.attemptCorrection = false;
  o.braceAllman = true;
  o.bracePadding = false;
  o.braceStyle = 'none';
  o.endComma = 'never';
  o.indentChar = ' ';
  o.indentLevel = 0;
  o.indentSize = 2;
  o.language = 'json';
  o.languageDefault = 'json';
  o.languageName = 'JSON';
  o.lexer = 'script';
  o.mode = 'beautify';
  o.endNewline = true;
  o.noSemicolon = true;
  o.objectIndent = 'indent';
  o.objectSort = false;
  o.preserveLine = 2;
  o.quoteConvert = 'double';
  o.wrap = 0;

  return merge('script', o, options);
}

function merge (lexer: 'markup' | 'script' | 'style', user: any, config: any) {

  const o = Object.create(null);

  /* -------------------------------------------- */
  /* USER OPTIONS                                 */
  /* -------------------------------------------- */

  o.prettify = Object.assign(config, user);

  /* -------------------------------------------- */
  /* ENFORCED OPTIONS                             */
  /* -------------------------------------------- */

  o.prettify.lexer = lexer;
  o.prettify.mode = 'beautify';

  switch (o.prettify.language.toLowerCase()) {
    case 'markup':
    case 'html':
      o.prettify.language = 'html';
      o.prettify.languageName = 'HTML';
      break;
    case 'liquid':
      o.prettify.language = 'html';
      o.prettify.languageName = 'HTML/Liquid';
      break;
    case 'jsx':
      o.prettify.languageName = 'JSX';
      break;
    case 'TSX':
      o.prettify.languageName = 'TSX';
      break;
    case 'javascript':
    case 'js':
      o.prettify.language = 'javascript';
      o.prettify.languageName = 'JavaScript';
      break;
    case 'typescript':
    case 'ts':
      o.prettify.language = 'typescript';
      o.prettify.languageName = 'TypeScript';
      break;
    case 'css':
      o.prettify.languageName = 'CSS';
      break;
    case 'scss':
    case 'sass':
      o.prettify.languageName = 'SASS';
      break;
    case 'json':
      o.prettify.languageName = 'JSON';
      break;
    default:
      break;
  }

  /* -------------------------------------------- */
  /* MERGE OPTIONS                                */
  /* -------------------------------------------- */

  o.prettydiff = defaults(o.prettify);
  o.sparser = sp.markup(o.prettydiff);

  return o;

}
