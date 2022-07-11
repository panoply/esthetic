import type { Prettify } from 'types/prettify';
import { comment } from '@parser/comment';
import { parse } from '@parser/parse';
import { size } from '@utils/helpers';
import { create, keys } from '@utils/native';
import * as language from '@parser/language';

export function parser (prettify: Prettify) {

  const langname = prettify.options.language;
  const langlexer = prettify.options.lexer;

  parse.count = -1;
  parse.linesSpace = 0;
  parse.lineNumber = 1;
  parse.data.begin = [];
  parse.data.ender = [];
  parse.data.lexer = [];
  parse.data.lines = [];
  parse.data.stack = [];
  parse.data.token = [];
  parse.data.types = [];
  parse.datanames = [ 'begin', 'ender', 'lexer', 'lines', 'stack', 'token', 'types' ];
  parse.structure = [ [ 'global', -1 ] ];
  parse.structure.pop = function pop () {
    const len = parse.structure.length - 1;
    const arr = parse.structure[len];
    if (len > 0) parse.structure.splice(len, 1);
    return arr;
  };

  if (prettify.options.language === 'auto' || prettify.options.lexer === 'auto') {
    const lang = language.detect(prettify.source);
    if (prettify.options.language === 'auto') prettify.options.language = lang.language;
    if (prettify.options.lexer === 'auto') prettify.options.lexer = lang.lexer;
  }

  if (typeof prettify.lexers[prettify.options.lexer] === 'function') {

    // reset references data if store is used on multiple files
    parse.references = [ [] ];
    parse.error = '';

    // assign(prettify.options.lexer, prettify.options.lexer);

    for (const lexer of keys(prettify.lexers)) {
      if (prettify.options.language === 'json') {
        prettify.options.json = prettify.options.json || create(null);
      } else {
        prettify.options[lexer] = prettify.options[lexer] || create(null);
      }
    }

    // This line parses the code using a lexer file
    prettify.lexers[prettify.options.lexer](`${prettify.source} `);

  } else {

    // restore language and lexer values
    parse.error = `Specified lexer, ${prettify.options.lexer}, is not a function.`;
  }

  // validate that all the data arrays are the same length

  let a = 0;
  let b = 0;

  const k = keys(parse.data);
  const c = k.length;

  do {

    b = a + 1;

    do {
      if (parse.data[k[a]].length !== parse.data[k[b]].length) {
        parse.error = `"${k[a]}" array is of different length than "${k[b]}"`;
        break;
      }

      b = b + 1;
    } while (b < c);

    a = a + 1;
  } while (a < c - 1);

  // Fix begin values.
  // They must be reconsidered after reordering from object sort
  if (parse.data.begin.length > 0) {

    if (prettify.options.lexer === 'script' && prettify.options[prettify.options.lexer].objectSort) {
      parse.sortCorrection(0, parse.count + 1);
    } else if (prettify.options.lexer === 'style' && prettify.options[prettify.options.lexer].sortProperties) {
      parse.sortCorrection(0, parse.count + 1);
    }
  }

  prettify.options.language = langname;
  prettify.options.lexer = langlexer;

  return parse.data;

}

/**
 * Mode
 *
 * This function executes parse and beautification
 * actions.
 */
export function mode (prettify: Prettify) {

  const start = Date.now();

  /**
   * Mode Value, ie: `beautify` or `parse`
   */
  const mv = prettify.mode;
  const lf = prettify.options.crlf === true ? '\r\n' : '\n';

  let result: string = '';

  // Skip formatting when empty document
  if (prettify.source.trimStart() === '') {

    const preserve = new RegExp(`\\n{${prettify.options.preserveLine},}`);

    result = prettify.source;
    result = prettify.source.replace(preserve, '\n\n');
    result = prettify.options.endNewline === true
      ? result.replace(/\s*$/, lf)
      : result.replace(/\s+$/, '');

    prettify.stats.chars = result.length;
    prettify.stats.language = prettify.options.languageName;
    prettify.stats.size = size(result.length);
    prettify.stats.time = (Date.now() - start).toFixed(1) as any;

    return result;

  }

  if (prettify.options.language === 'text') {
    prettify.options.language = 'auto';
  }

  if (prettify.options.lexer === 'text') {
    prettify.options.lexer = 'auto';
  }

  if (
    prettify.options.language === 'text' ||
    prettify.options.lexer === 'text'
  ) {

    prettify.options.language = 'text';
    prettify.options.languageName = 'Plain Text';
    prettify.options.lexer = 'text';

  } else if (
    prettify.options.language === 'auto' &&
    prettify.options.lexer === 'auto'
  ) {

    const lang = language.detect(prettify.source);

    if (lang.language === 'text') {
      lang.language = 'html';
      lang.lexer = 'markup';
      lang.languageName = 'HTML';
    }

    if (prettify.options.lexer === 'auto') {
      prettify.options.lexer = lang.lexer;
    }

    if (prettify.options.language === 'auto') {
      prettify.options.language = lang.language;
      prettify.options.languageName = lang.languageName;
    }
  } else {

    prettify.options.lexer = 'markup';
  }

  prettify.stats.language = prettify.options.languageName;

  const comm = comment(prettify);

  // If comment returns false, skip formatting and return source
  if (comm === false) {
    prettify.stats.time = -1;
    prettify.stats.chars = prettify.source.length;
    prettify.stats.size = size(prettify.stats.chars);

    return prettify.source;
  }

  prettify.parsed = parser(prettify);

  if (mv === 'parse') {
    prettify.stats.time = (Date.now() - start).toFixed(1) as any;
    prettify.stats.chars = prettify.source.length;
    prettify.stats.size = size(prettify.stats.chars);

    return prettify.parsed;
  }

  result = prettify.beautify[prettify.options.lexer](prettify.options);
  result = prettify.options.endNewline === true ? result.replace(/\s*$/, lf) : result.replace(/\s+$/, '');

  const length = result.length;

  prettify.stats.chars = length;
  prettify.stats.size = size(length);
  prettify.stats.time = (Date.now() - start).toFixed(1) as any;

  prettify.end = 0;
  prettify.start = 0;

  return result;
}
