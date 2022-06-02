import { parse } from './parse';
import { sparser } from './sparser';

function parser () {

  const langstore = [ sparser.options.language, sparser.options.lexer ];

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
  parse.datanames = [
    'begin',
    'ender',
    'lexer',
    'lines',
    'stack',
    'token',
    'types'
  ];

  parse.structure = [ [ 'global', -1 ] ];
  parse.structure.pop = () => {
    const len = parse.structure.length - 1;
    const arr = parse.structure[len];
    if (len > 0) parse.structure.splice(len, 1);
    return arr;
  };

  if (sparser.options.language === 'auto' || sparser.options.lexer === 'auto') {

    const lang = sparser.libs.language.auto(sparser.options.source, 'javascript');

    if (sparser.options.language === 'auto') sparser.options.language = lang[0];
    if (sparser.options.lexer === 'auto') sparser.options.lexer = lang[1];
  }

  if (typeof sparser.lexers[sparser.options.lexer] === 'function') {

    // reset references data if sparser is used on multiple files
    parse.references = [ [] ];

    sparser.parseError = '';
    sparser.options.lexerOptions = sparser.options.lexerOptions || {};

    for (const lexer of Object.keys(sparser.lexers)) {
      sparser.options.lexerOptions[lexer] = sparser.options.lexerOptions[lexer] || {};
    }

    // This line parses the code using a lexer file
    sparser.lexers[sparser.options.lexer](`${sparser.options.source} `);

  } else {

    // restore language and lexer values
    sparser.parseError = `Specified lexer, ${sparser.options.lexer}, is not a function.`;
  }

  // validate that all the data arrays are the same length
  {

    let a = 0;
    let b = 0;

    const keys = Object.keys(parse.data);
    const c = keys.length;

    do {

      b = a + 1;

      do {

        if (parse.data[keys[a]].length !== parse.data[keys[b]].length) {
          sparser.parseError = `"${keys[a]}" array is of different length than "${keys[b]}"`;
          break;
        }

        b = b + 1;

      } while (b < c);

      a = a + 1;

    } while (a < c - 1);

  }

  // Fix begin values.
  // They must be reconsidered after reordering from object sort
  if (parse.data.begin.length > 0 && (
    sparser.options.lexerOptions[sparser.options.lexer].objectSort === true ||
      sparser.options.lexerOptions.markup.tagSort === true
  )) {

    parse.sortCorrection(0, parse.count + 1);
  }

  sparser.options.language = langstore[0];
  sparser.options.lexer = langstore[1];

  return parse.data;
}

// @ts-ignore
sparser.parse = parse;

// @ts-ignore
sparser.parser = parser;

export { parse, sparser, parser };
