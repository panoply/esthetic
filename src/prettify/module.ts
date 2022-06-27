/* eslint-disable no-lone-blocks */

import { Prettify } from 'types/prettify';
import { create } from '@utils/native';
import { definitions } from '@options/definitions';

const prettify: Prettify = create(null);

/* -------------------------------------------- */
/* PARSE                                        */
/* -------------------------------------------- */

prettify.parsed = create(null);
prettify.options = create(null);
prettify.beautify = create(null);
prettify.lexers = create(null);
prettify.definitions = definitions;
prettify.mode = 'beautify';
prettify.source = '';
prettify.end = 0;
prettify.iterator = 0;
prettify.start = 0;
prettify.scopes = [];

/* -------------------------------------------- */
/* STATS                                        */
/* -------------------------------------------- */

prettify.stats = create(null);
prettify.stats.chars = -1;
prettify.stats.time = -1;
prettify.stats.size = '';
prettify.stats.language = '';

/* -------------------------------------------- */
/* HOOKS                                        */
/* -------------------------------------------- */

prettify.hooks = create(null);
prettify.hooks.before = [];
prettify.hooks.language = [];
prettify.hooks.rules = [];
prettify.hooks.after = [];

/* -------------------------------------------- */
/* ENFORCED                                     */
/* -------------------------------------------- */

prettify.options.mode = 'beautify';
prettify.options.tagMerge = false;
prettify.options.tagSort = false;

/* -------------------------------------------- */
/* INTERNALS                                    */
/* -------------------------------------------- */

prettify.options.lexer = 'auto';
prettify.options.language = 'text';
prettify.options.languageName = 'Plain Text';
prettify.options.indentLevel = 0;

/* -------------------------------------------- */
/* SHARED                                       */
/* -------------------------------------------- */

prettify.options.crlf = false;
prettify.options.attemptCorrection = false;
prettify.options.commentIndent = true;
prettify.options.endNewline = false;
prettify.options.indentChar = ' ';
prettify.options.indentSize = 2;
prettify.options.preserveComment = false;
prettify.options.preserveLine = 2;
prettify.options.wrap = 0;

/* -------------------------------------------- */
/* MARKUP SPECIFIC                              */
/* -------------------------------------------- */

prettify.options.markup = create(null);
prettify.options.markup.attributeGlue = true;
prettify.options.markup.attributeSort = false;
prettify.options.markup.attributeSortList = [];
prettify.options.markup.attributeValueNewlines = 'force';
prettify.options.markup.commentNewline = false;
prettify.options.markup.forceAttribute = false;
prettify.options.markup.preserveText = false;
prettify.options.markup.preserveAttributes = false;
prettify.options.markup.selfCloseSpace = false;
prettify.options.markup.forceIndent = false;
prettify.options.markup.quoteConvert = 'none';

/* -------------------------------------------- */
/* STYLE SPECIFIC                               */
/* -------------------------------------------- */

prettify.options.style = create(null);
prettify.options.style.compressCSS = false;
prettify.options.style.classPadding = false;
prettify.options.style.noLeadZero = false;
prettify.options.style.sortSelectors = false;
prettify.options.style.sortProperties = false;
prettify.options.style.quoteConvert = 'none';

/* -------------------------------------------- */
/* SCRIPT SPECIFIC                              */
/* -------------------------------------------- */

prettify.options.script = create(null);
prettify.options.script.braceNewline = false;
prettify.options.script.bracePadding = false;
prettify.options.script.braceStyle = 'none';
prettify.options.script.braceAllman = false;
prettify.options.script.commentNewline = false;
prettify.options.script.caseSpace = false;
prettify.options.script.inlineReturn = true;
prettify.options.script.elseNewline = false;
prettify.options.script.endComma = 'never';
prettify.options.script.arrayFormat = 'default';
prettify.options.script.objectSort = false;
prettify.options.script.objectIndent = 'default';
prettify.options.script.functionNameSpace = false;
prettify.options.script.functionSpace = false;
prettify.options.script.styleGuide = 'none';
prettify.options.script.ternaryLine = false;
prettify.options.script.methodChain = 4;
prettify.options.script.neverFlatten = false;
prettify.options.script.noCaseIndent = false;
prettify.options.script.noSemicolon = false;
prettify.options.script.quoteConvert = 'none';
prettify.options.script.variableList = 'none';
prettify.options.script.vertical = false;

/* -------------------------------------------- */
/* JSON SPECIFIC                                */
/* -------------------------------------------- */

prettify.options.json = create(null);
prettify.options.json.arrayFormat = 'default';
prettify.options.json.braceAllman = false;
prettify.options.json.bracePadding = false;
prettify.options.json.objectIndent = 'default';
prettify.options.json.objectSort = false;

/* -------------------------------------------- */
/* EXPORT                                       */
/* -------------------------------------------- */

export { prettify };
