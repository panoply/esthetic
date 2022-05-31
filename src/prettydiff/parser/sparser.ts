import { Sparser } from '../../types/sparser';

/* -------------------------------------------- */
/* SPARSER                                      */
/* -------------------------------------------- */

const sparser: Sparser = Object.create(null);

/* -------------------------------------------- */
/* OBJECTS                                      */
/* -------------------------------------------- */

sparser.lexers = Object.create(null);
sparser.libs = Object.create(null);
sparser.options = Object.create(null);
sparser.options.lexerOptions = Object.create(null);
sparser.options.lexerOptions.markup = Object.create(null);
sparser.options.lexerOptions.script = Object.create(null);
sparser.options.lexerOptions.style = Object.create(null);

/* -------------------------------------------- */
/* PRESETS                                      */
/* -------------------------------------------- */

sparser.parseError = '';

/* -------------------------------------------- */
/* LEXER OPTIONS                                */
/* -------------------------------------------- */

sparser.options.attemptCorrection = false;
sparser.options.crlf = false;
sparser.options.format = 'arrays';
sparser.options.language = 'auto';
sparser.options.lexer = 'auto';
sparser.options.preserveComment = false;
sparser.options.source = '';
sparser.options.wrap = 0;

/* -------------------------------------------- */
/* MARKUP OPTIONS                               */
/* -------------------------------------------- */

sparser.options.lexerOptions.markup.attributeSort = false;
sparser.options.lexerOptions.markup.attributeSortList = [];
sparser.options.lexerOptions.markup.parseSpace = false;
sparser.options.lexerOptions.markup.preserveText = false;
sparser.options.lexerOptions.markup.quoteConvert = 'none';
sparser.options.lexerOptions.markup.tagMerge = false;
sparser.options.lexerOptions.markup.tagSort = false;
sparser.options.lexerOptions.markup.preserveAttributes = false;

/* -------------------------------------------- */
/* SCRIPT OPTIONS                               */
/* -------------------------------------------- */

sparser.options.lexerOptions.script.endComma = 'none';
sparser.options.lexerOptions.script.objectSort = false;
sparser.options.lexerOptions.script.quoteConvert = 'none';
sparser.options.lexerOptions.script.variableList = 'none';

/* -------------------------------------------- */
/* STYLE OPTIONS                                */
/* -------------------------------------------- */

sparser.options.lexerOptions.style.noLeadZero = false;
sparser.options.lexerOptions.style.objectSort = false;
sparser.options.lexerOptions.style.quoteConvert = 'none';

export { sparser };
