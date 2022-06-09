import { SparserMarkup, SparserScript, SparserStyle } from '../../types/sparser';
import { PrettyDiffOptions } from '../../types/prettydiff';

/**
 * Omits option definitions to be merged with
 * sparser lexing options.
 */
function merge (options: object, user: object) {

  for (const p in options) {
    if (p === 'lexer' || p === 'format') continue;
    if ((p in user) && (options[p] !== user[p])) options[p] = user[p];
  }

  return options;

}

/**
 * Returns Markup specific lexer options
 * for Sparser.
 */
export function markup (options: PrettyDiffOptions = {}): SparserMarkup {

  const o: SparserMarkup = Object.create(null);

  /* -------------------------------------------- */
  /* LEXER OPTIONS                                */
  /* -------------------------------------------- */

  o.attemptCorrection = false;
  o.crlf = false;
  o.language = 'html';
  o.lexer = 'markup';
  o.format = 'arrays';
  o.preserveComment = false;
  o.wrap = 0;

  /* -------------------------------------------- */
  /* MARKUP OPTIONS                               */
  /* -------------------------------------------- */

  o.attributeSort = false;
  o.attributeSortList = [];
  o.parseSpace = false;
  o.preserveText = false;
  o.quoteConvert = 'none';
  o.tagMerge = false;
  o.tagSort = false;
  o.preserveAttributes = false;

  const merged = merge(o, options);

  /* -------------------------------------------- */
  /* ENFORCE                                      */
  /* -------------------------------------------- */

  (merged as any).tagMerge = false;
  (merged as any).tagSort = false;

  return merged;

}

/**
 * Returns Script specific lexer options
 * for Sparser.
 */
export function script (options: PrettyDiffOptions = {}): SparserScript {

  const o: SparserScript = Object.create(null);

  /* -------------------------------------------- */
  /* LEXER OPTIONS                                */
  /* -------------------------------------------- */

  o.attemptCorrection = false;
  o.crlf = false;
  o.language = 'javascript';
  o.format = 'arrays';
  o.lexer = 'script';
  o.preserveComment = false;
  o.wrap = 0;

  /* -------------------------------------------- */
  /* SCRIPT OPTIONS                               */
  /* -------------------------------------------- */

  o.endComma = 'none';
  o.objectSort = false;
  o.quoteConvert = 'none';
  o.variableList = 'none';

  return merge(o, options);

}

/**
 * Returns Style specific lexer options
 * for Sparser.
 */
export function style (options: PrettyDiffOptions = {}): SparserStyle {

  const o: SparserStyle = Object.create(null);

  /* -------------------------------------------- */
  /* LEXER OPTIONS                                */
  /* -------------------------------------------- */

  o.attemptCorrection = false;
  o.crlf = false;
  o.language = 'css';
  o.format = 'arrays';
  o.lexer = 'style';
  o.preserveComment = false;
  o.wrap = 0;

  /* -------------------------------------------- */
  /* STYLE OPTIONS                                */
  /* -------------------------------------------- */

  o.noLeadZero = false;
  o.objectSort = false;
  o.quoteConvert = 'none';

  return merge(o, options);

}
