/* eslint-disable no-lone-blocks */

import { Prettify } from 'types/prettify';
import { create, defineProperty } from '@utils/native';

/* -------------------------------------------- */
/* EXPORT                                       */
/* -------------------------------------------- */
export { definitions } from '@options/definitions';
export { grammar } from '@options/grammar';

export const prettify = (function () {

  const model: Prettify = create(null);

  model.parsed = create(null);
  model.options = create(null);
  model.beautify = create(null);
  model.lexers = create(null);
  model.stats = create(null);
  model.hooks = create(null);

  /* -------------------------------------------- */
  /* INPUT SOURCE                                 */
  /* -------------------------------------------- */

  let input: string | Buffer = '';

  defineProperty(model, 'source', {
    get () {
      return model.env === 'node' && Buffer.isBuffer(input)
        ? input.toString()
        : input as string;
    },
    set (source: string | Buffer) {
      input = model.env === 'node' ? Buffer.isBuffer(source) ? source : Buffer.from(source) : source;
    }
  });

  /* -------------------------------------------- */
  /* PARSER                                       */
  /* -------------------------------------------- */

  model.mode = 'beautify';
  model.end = 0;
  model.iterator = 0;
  model.start = 0;
  model.scopes = [];

  /* -------------------------------------------- */
  /* ENVIRONMENT                                  */
  /* -------------------------------------------- */

  model.env = (typeof process !== 'undefined' && process.versions != null && process.versions.node != null)
    ? 'node'
    : 'browser';

  /* -------------------------------------------- */
  /* DATA STRUCTURE                               */
  /* -------------------------------------------- */

  model.parsed.begin = [];
  model.parsed.ender = [];
  model.parsed.lexer = [];
  model.parsed.lines = [];
  model.parsed.stack = [];
  model.parsed.token = [];
  model.parsed.types = [];

  /* -------------------------------------------- */
  /* STATISTICS                                   */
  /* -------------------------------------------- */

  model.stats.chars = -1;
  model.stats.time = -1;
  model.stats.size = '';
  model.stats.language = '';

  /* -------------------------------------------- */
  /* HOOKS                                        */
  /* -------------------------------------------- */

  model.hooks.before = [];
  model.hooks.language = [];
  model.hooks.rules = [];
  model.hooks.after = [];

  /* -------------------------------------------- */
  /* BASE                                         */
  /* -------------------------------------------- */

  model.options.mode = 'beautify';
  model.options.indentLevel = 0;

  /* -------------------------------------------- */
  /* GRAMMAR                                      */
  /* -------------------------------------------- */

  model.options.grammar = create(null);
  model.options.grammar.html = create(null);
  model.options.grammar.liquid = create(null);

  /* -------------------------------------------- */
  /* LANGUAGE                                     */
  /* -------------------------------------------- */

  model.options.lexer = 'auto';
  model.options.language = 'text';
  model.options.languageName = 'Plain Text';

  /* -------------------------------------------- */
  /* GLOBAL OPTIONS                               */
  /* -------------------------------------------- */

  model.options.crlf = false;
  model.options.commentIndent = true;
  model.options.endNewline = false;
  model.options.indentChar = ' ';
  model.options.indentSize = 2;
  model.options.preserveComment = false;
  model.options.preserveLine = 2;
  model.options.wrap = 0;

  /* -------------------------------------------- */
  /* MARKUP OPTIONS                               */
  /* -------------------------------------------- */

  model.options.markup = create(null);
  model.options.markup.correct = false;
  model.options.markup.commentNewline = false;
  model.options.markup.attributeChain = 'inline';
  model.options.markup.attributeValues = 'preserve';
  model.options.markup.attributeSort = false;
  model.options.markup.attributeSortList = [];
  model.options.markup.forceAttribute = false;
  model.options.markup.forceLeadingAttribute = false;
  model.options.markup.preserveText = false;
  model.options.markup.preserveAttributes = false;
  model.options.markup.selfCloseSpace = false;
  model.options.markup.forceIndent = false;
  model.options.markup.quoteConvert = 'none';

  /* -------------------------------------------- */
  /* STYLE OPTIONS                                */
  /* -------------------------------------------- */

  model.options.style = create(null);
  model.options.style.correct = false;
  model.options.style.compressCSS = false;
  model.options.style.classPadding = false;
  model.options.style.noLeadZero = false;
  model.options.style.sortSelectors = false;
  model.options.style.sortProperties = false;
  model.options.style.quoteConvert = 'none';

  /* -------------------------------------------- */
  /* SCRIPT OPTIONS                               */
  /* -------------------------------------------- */

  model.options.script = create(null);
  model.options.script.correct = false;
  model.options.script.braceNewline = false;
  model.options.script.bracePadding = false;
  model.options.script.braceStyle = 'none';
  model.options.script.braceAllman = false;
  model.options.script.commentNewline = false;
  model.options.script.caseSpace = false;
  model.options.script.inlineReturn = true;
  model.options.script.elseNewline = false;
  model.options.script.endComma = 'never';
  model.options.script.arrayFormat = 'default';
  model.options.script.objectSort = false;
  model.options.script.objectIndent = 'default';
  model.options.script.functionNameSpace = false;
  model.options.script.functionSpace = false;
  model.options.script.styleGuide = 'none';
  model.options.script.ternaryLine = false;
  model.options.script.methodChain = 4;
  model.options.script.neverFlatten = false;
  model.options.script.noCaseIndent = false;
  model.options.script.noSemicolon = false;
  model.options.script.quoteConvert = 'none';
  model.options.script.variableList = 'none';
  model.options.script.vertical = false;

  /* -------------------------------------------- */
  /* JSON OPTIONS                                 */
  /* -------------------------------------------- */

  model.options.json = create(null);
  model.options.json.arrayFormat = 'default';
  model.options.json.braceAllman = false;
  model.options.json.bracePadding = false;
  model.options.json.objectIndent = 'default';
  model.options.json.objectSort = false;

  return model;

})();
