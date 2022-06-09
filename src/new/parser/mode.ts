import { Prettify } from '../prettify.d';
import { comment } from './comment';
import { parse } from './parse';
import * as language from './language';
import { assign, create, keys } from '../../utils/native';

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
    const lang = language.auto(prettify.source, 'html');
    if (prettify.options.language === 'auto') prettify.options.language = lang.language;
    if (prettify.options.lexer === 'auto') prettify.options.lexer = lang.lexer;
  }

  if (typeof prettify.lexers[prettify.options.lexer] === 'function') {

    // reset references data if store is used on multiple files
    parse.references = [ [] ];
    parse.error = '';

    // assign(prettify.options.lexer, prettify.options.lexer);

    for (const lexer of keys(prettify.lexers)) {
      if (prettify.rules[lexer].language === 'json') {
        prettify.rules.script = prettify.rules.script || create(null);
      } else {
        prettify.rules[lexer] = prettify.rules[lexer] || create(null);
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
    if (prettify.rules[prettify.options.lexer].objectSort) parse.sortCorrection(0, parse.count + 1);
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

  /**
   * Mode Value, ie: `beautify` or `parse`
   */
  const mv = prettify.mode;
  const lf = prettify.options.crlf === true ? '\r\n' : '\n';

  if (prettify.options.language === 'text') prettify.options.language = 'auto';
  if (prettify.options.lexer === 'text') prettify.options.lexer = 'auto';
  if (prettify.options.language === 'text' || prettify.options.lexer === 'text') {
    prettify.options.language = 'text';
    prettify.options.lexer = 'text';
    prettify.options.languageName = 'Plain Text';
  } else if (prettify.options.language === 'auto' || prettify.options.lexer === 'auto') {

    const lang = language.auto(prettify.source, prettify.options.language);

    if (lang.language === 'text') assign(lang, { language: 'html', lexer: 'markup', languageName: 'html' });
    if (prettify.options.lexer === 'auto') prettify.options.lexer = lang.lexer;
    if (prettify.options.language === 'auto') {
      prettify.options.language = lang.language;
      prettify.options.languageName = lang.languageName;
    }
  }

  comment(prettify);

  prettify.parsed = parser(prettify);

  if (mv === 'parse') return JSON.stringify(prettify.parsed);

  let result: string;

  result = prettify.beautify[prettify.options.lexer](prettify.options);
  result = prettify.options.endNewline === true ? result.replace(/\s*$/, lf) : result.replace(/\s+$/, '');

  prettify.end = 0;
  prettify.start = 0;

  return result;
}
