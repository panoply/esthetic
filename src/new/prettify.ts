/* eslint-disable no-lone-blocks */

import { Prettify } from './prettify.d';
import { create } from '../utils/native';
import { definitions } from './options/definitions';

export const prettify: Prettify = (() => {

  const model: Prettify = create(null);

  model.parsed = create(null);
  model.options = create(null);
  model.beautify = create(null);
  model.lexers = create(null);
  model.options = create(null);
  model.rules = create(null);
  model.definitions = definitions;
  model.mode = 'beautify';
  model.source = '';
  model.end = 0;
  model.iterator = 0;
  model.scopes = [];
  model.start = 0;

  /* -------------------------------------------- */
  /* LANGUAGES                                    */
  /* -------------------------------------------- */
  model.rules.markup = create(null);
  model.rules.script = create(null);
  model.rules.style = create(null);
  model.rules.json = create(null);

  /* -------------------------------------------- */
  /* INTERNALS                                    */
  /* -------------------------------------------- */

  model.options.language = 'text';
  model.options.languageName = 'Plain Text';
  model.options.lexer = 'auto';
  model.options.parseFormat = 'parallel';
  model.options.parseSpace = false;
  model.options.format = 'arrays';

  /* -------------------------------------------- */
  /* ENFORCED                                     */
  /* -------------------------------------------- */

  model.options.mode = 'beautify';
  model.options.tagMerge = false;
  model.options.tagSort = false;

  /* -------------------------------------------- */
  /* SHARED                                       */
  /* -------------------------------------------- */

  model.options.crlf = false;
  model.options.attemptCorrection = false;
  model.options.commentIndent = false;
  model.options.endNewline = false;
  model.options.forceIndent = false;
  model.options.indentChar = ' ';
  model.options.indentLevel = 0;
  model.options.indentSize = 4;
  model.options.preserveComment = false;
  model.options.preserveLine = 2;
  model.options.source = '';
  model.options.quoteConvert = 'none';
  model.options.wrap = 0;

  /* -------------------------------------------- */
  /* MARKUP SPECIFIC                              */
  /* -------------------------------------------- */

  model.options.attributeSort = false;
  model.options.attributeSortList = [];
  model.options.commentNewline = false;
  model.options.forceAttribute = false;
  model.options.preserveText = false;
  model.options.preserveAttributes = false;
  model.options.selfCloseSpace = false;

  /* -------------------------------------------- */
  /* STYLE SPECIFIC                               */
  /* -------------------------------------------- */

  model.options.compressCSS = false;
  model.options.classPadding = false;
  model.options.noLeadZero = false;
  model.options.sortSelectors = false;
  model.options.sortProperties = false;

  /* -------------------------------------------- */
  /* SCRIPT SPECIFIC                              */
  /* -------------------------------------------- */

  model.options.braceNewline = false;
  model.options.bracePadding = false;
  model.options.braceStyle = 'none';
  model.options.braceAllman = false;
  model.options.caseSpace = false;
  model.options.inlineReturn = true;
  model.options.elseNewline = false;
  model.options.endComma = 'never';
  model.options.arrayFormat = 'default';
  model.options.objectSort = false;
  model.options.objectIndent = 'default';
  model.options.functionNameSpace = false;
  model.options.functionSpace = false;
  model.options.styleGuide = 'none';
  model.options.ternaryLine = false;
  model.options.methodChain = 4;
  model.options.neverFlatten = false;
  model.options.noCaseIndent = false;
  model.options.noSemicolon = false;
  model.options.variableList = 'none';
  model.options.vertical = false;

  return model;

})();
