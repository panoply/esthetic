import { PrettyDiffOptions } from '../../types/prettydiff';

export function defaults (options: PrettyDiffOptions = {}): PrettyDiffOptions {

  const o: PrettyDiffOptions = Object.create(null);

  /* -------------------------------------------- */
  /* INTERNALS                                    */
  /* -------------------------------------------- */
  o.language = 'html';
  o.languageDefault = 'text';
  o.languageName = 'Plain Text';
  o.lexer = 'auto';
  o.parseFormat = 'parallel';
  o.parseSpace = false;

  /* -------------------------------------------- */
  /* ENFORCED                                     */
  /* -------------------------------------------- */

  o.mode = 'beautify';
  o.tagMerge = false;
  o.tagSort = false;

  /* -------------------------------------------- */
  /* SHARED                                       */
  /* -------------------------------------------- */

  o.crlf = false;
  o.attemptCorrection = false;
  o.commentIndent = false;
  o.endNewline = false;
  o.forceIndent = false;
  o.indentChar = ' ';
  o.indentLevel = 0;
  o.indentSize = 4;
  o.objectSort = false; // SCRIPT AND STYLE
  o.preserveComment = false;
  o.preserveLine = 0;
  o.source = '';
  o.quoteConvert = 'none';
  o.wrap = 0;

  /* -------------------------------------------- */
  /* MARKUP SPECIFIC                              */
  /* -------------------------------------------- */

  o.attributeSort = false;
  o.attributeSortList = [];
  o.commentNewline = false;
  o.forceAttribute = false;
  o.preserveText = false;
  o.preserveAttributes = false;
  o.selfCloseSpace = false;

  /* -------------------------------------------- */
  /* STYLE SPECIFIC                               */
  /* -------------------------------------------- */

  o.compressCSS = false;
  o.classPadding = false;
  o.noLeadZero = false;
  o.selectorList = false;

  /* -------------------------------------------- */
  /* SCRIPT SPECIFIC                              */
  /* -------------------------------------------- */

  o.braceNewline = false;
  o.bracePadding = false;
  o.braceStyle = 'none';
  o.braceAllman = false;
  o.caseSpace = false;
  o.elseNewline = false;
  o.endComma = 'never';
  o.arrayFormat = 'default';
  o.objectIndent = 'default';
  o.functionNameSpace = true;
  o.functionSpace = false;
  o.styleGuide = 'none';
  o.ternaryLine = false;
  o.methodChain = 3;
  o.neverFlatten = false;
  o.noCaseIndent = false;
  o.noSemicolon = false;
  o.variableList = 'none';
  o.vertical = false;

  return Object.assign(o, options, {
    mode: 'beautify',
    tagMerge: false,
    tagSort: false
  });

}
