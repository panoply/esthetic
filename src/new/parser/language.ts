import { LexerNames } from '../prettify.d';
import { create } from '../../utils/native';

export function setLexer (input: string) {

  const lexmap = {
    css: 'style',
    html: 'markup',
    liquid: 'markup',
    javascript: 'script',
    json: 'script',
    jsp: 'markup',
    jsx: 'script',
    tsx: 'script',
    less: 'style',
    markup: 'markup',
    scss: 'style',
    text: 'text',
    typescript: 'script',
    xml: 'markup'
  };

  if (typeof input !== 'string') return 'script';
  if (input.indexOf('html') > -1) return 'markup';
  if (lexmap[input] === undefined) return 'script';

  return lexmap[input];
}

export function setLanguageName (input: string) {

  const map = {
    javascript: 'JavaScript',
    json: 'JSON',
    jsx: 'JSX',
    liquid: 'HTML/Liquid',
    markup: 'markup',
    scss: 'SCSS',
    text: 'Plain Text',
    typescript: 'TypeScript'
  };

  if (typeof input !== 'string' || map[input] === undefined) return input.toUpperCase();

  return map[input];

}

export function auto (sample: string, defaultLang: string): {
  language: string;
  lexer: LexerNames;
  languageName: string
} {

  let b = [];
  let c = 0;

  const o: { language: string; lexer: LexerNames; languageName: string } = create(null);
  const vartest = (/((var|let|const|function|import)\s+(\w|\$)+[a-zA-Z0-9]*)/.test(sample) && !/@import/.test(sample));
  const finalstatic = /((((final)|(public)|(private))\s+static)|(static\s+void))/.test(sample);

  function output (langname: string): {
    language: string;
    lexer: LexerNames;
    languageName: string
  } {

    if (langname === 'unknown') {
      o.language = langname;
      o.lexer = setLexer(langname);
      o.languageName = setLanguageName(langname);
    } else {
      o.language = defaultLang;
      o.lexer = setLexer(defaultLang);
      o.languageName = 'unknown';
    }

    return o;
  }

  function css () {

    if (/\$[a-zA-Z]/.test(sample) || /\{\s*(\w|\.|\$|#)+\s*\{/.test(sample)) return output('scss');
    if (/@[a-zA-Z]/.test(sample) || /\{\s*(\w|\.|@|#)+\s*\{/.test(sample)) return output('less');

    return output('css');
  }

  function notmarkup () {

    let d = 1;
    let join = '';
    let flaga = false;
    let flagb = false;

    const publicprivate = (/((public)|(private))\s+(static\s+)?(((v|V)oid)|(class)|(final))/).test(sample);

    // language_auto_notmarkup_javascript
    function javascript () {

      if (
        sample.indexOf('(') > -1 ||
        sample.indexOf('=') > -1 ||
        (sample.indexOf(';') > -1 && sample.indexOf('{') > -1)
      ) {

        if (finalstatic === true || /\w<\w+(,\s+\w+)*>/.test(sample)) return output('typescript');
        if (/<\/\w+>/.test(sample) && /<\w+((\s+\w)|>)/.test(sample)) return output('jsx');
        if (/((var)|(let)|(const))\s+\w+\s*:/.test(sample) || /=\s*<\w+/.test(sample)) return output('typescript');

        return output('javascript');

      }

      return output('unknown');
    }

    function cssorjs () {

      if (
        /:\s*((number)|(string))/.test(sample) &&
        /((public)|(private))\s+/.test(sample)
      ) return output('typescript');

      if ((/^(\s*(\$|@))/).test(sample) === false && (/(\};?\s*)$/).test(sample)) {

        if (
          /export\s+default\s+\{/.test(sample) ||
          /(\?|:)\s*(\{|\[)/.test(sample) ||
          /(\{|\s|;)render\s*\(\)\s*\{/.test(sample) ||
          /^(\s*return;?\s*\{)/.test(sample)
        ) {

          return output('javascript');
        }
      }

      if ((/\{\s*(\w|\.|@|#)+\s*\{/).test(sample) === true) { return output('less'); }
      if ((/\$(\w|-)/).test(sample) === true) return output('scss');
      if ((/(;|\{|:)\s*@\w/).test(sample) === true) return output('less');

      return output('css');

    };

    if (d < c) {

      do {

        if (flaga === false) {

          if (b[d] === '*' && b[d - 1] === '/') {

            b[d - 1] = '';
            flaga = true;

          } else if (
            flagb === false &&
            d < c - 6 &&
            b[d] === 'f' &&
            b[d + 1] === 'i' &&
            b[d + 2] === 'l' &&
            b[d + 3] === 't' &&
            b[d + 4] === 'e' &&
            b[d + 5] === 'r' &&
            b[d + 6] === ':'
          ) {
            flagb = true;
          }

        } else if (
          flaga === true &&
            b[d] === '*' &&
            d !== c - 1 &&
            b[d + 1] === '/'
        ) {

          flaga = false;
          b[d] = '';
          b[d + 1] = '';

        } else if (flagb === true && b[d] === ';') {

          flagb = false;
          b[d] = '';

        }

        if (flaga === true || flagb === true) b[d] = '';

        d = d + 1;

      } while (d < c);

    }

    join = b.join('');

    if (
      (/\s\/\//).test(sample) === false &&
      (/\/\/\s/).test(sample) === false &&
      (/^(\s*(\{|\[)(?!%))/).test(sample) === true &&
      (/((\]|\})\s*)$/).test(sample) &&
      sample.indexOf(',') !== -1
    ) return output('json');

    if (
      (/((\}?(\(\))?\)*;?\s*)|([a-z0-9]("|')?\)*);?(\s*\})*)$/i).test(sample) && (
        vartest === true ||
        publicprivate === true ||
        (/console\.log\(/).test(sample) === true ||
        (/export\s+default\s+class\s+/).test(sample) === true ||
        (/document\.get/).test(sample) === true ||
        (/((=|(\$\())\s*function)|(\s*function\s+(\w*\s+)?\()/).test(sample) === true ||
        sample.indexOf('{') === -1 ||
        (/^(\s*if\s+\()/).test(sample) === true
      )
    ) return javascript();

    // * u007b === {
    // * u0024 === $
    // * u002e === .
    if (sample.indexOf('{') > -1 && (
      (/^(\s*[\u007b\u0024\u002e#@a-z0-9])/i).test(sample) === true ||
      (/^(\s*\/(\*|\/))/).test(sample) === true ||
      (/^(\s*\*\s*\{)/).test(sample) === true
    ) &&
      (/^(\s*if\s*\()/).test(sample) === false &&
      (/=\s*(\{|\[|\()/).test(join) === false && (
      (
        (/(\+|-|=|\?)=/).test(join) === false ||
        (/\/\/\s*=+/).test(join) === true) || (
        (/=+('|")?\)/).test(sample) === true &&
        (/;\s*base64/).test(sample) === true
      )
    ) && (/function(\s+\w+)*\s*\(/).test(join) === false) return cssorjs();

    return output('unknown');
  }

  // language_auto_markup
  function markup () {

    if (
      (
        /^(\s*<!doctype\s+html>)/i).test(sample) ||
        /^(\s*<html)/i.test(sample) || (
        /<form\s/i.test(sample) &&
        /<label\s/i.test(sample) &&
        /<input\s/i.test(sample)
      ) ||
      /<((img)|(IMG))(\s+\w+=("|')?\S+("|')?)*\s+src\s*=/.test(sample) || (
        /^(\s*<!DOCTYPE\s+((html)|(HTML))\s+PUBLIC\s+)/.test(sample) &&
        /XHTML\s+1\.1/.test(sample) === false &&
        /XHTML\s+1\.0\s+(S|s)((trict)|(TRICT))/.test(sample) === false
      )
    ) {

      return output('html');
    }

    return output('xml');

  };

  if (sample === null || sample.replace(/\s+/g, '') === '') return output('unknown');
  if ((/^(\s*<!DOCTYPE\s+html>)/i).test(sample)) return markup();
  if ((/^\s*@((charset)|(import)|(include)|(keyframes)|(media)|(namespace)|(page))/).test(sample)) return css();

  if (
    finalstatic === false &&
      /=(>|=|-|\+|\*)/.test(sample) === false &&
      /^(\s*((if)|(for)|(function))\s*\()/.test(sample) === false &&
      /(\s|;|\})((if)|(for)|(function\s*\w*))\s*\(/.test(sample) === false &&
      vartest === false &&
      /return\s*\w*\s*(;|\})/.test(sample) === false && (
      sample === undefined ||
        /^(\s*#(?!(!\/)))/.test(sample) || (
        /\n\s*(\.|@)\w+(\(|(\s*:))/.test(sample) &&
        />\s*<\w/.test(sample) === false
      )
    )
  ) return css();

  b = sample.replace(/\[[a-zA-Z][\w-]*=("|')?[a-zA-Z][\w-]*("|')?\]/g, '').split('');
  c = b.length;

  if ((/^(\s*(\{|<)(%|#|\{))/).test(sample) === true) { return markup(); }

  if ((
    (/^([\s\w-]*<)/).test(sample) === false &&
    (/(>[\s\w-]*)$/).test(sample) === false
  ) || finalstatic === true) return notmarkup();

  if (
    ((
      /(>[\w\s:]*)?<(\/|!|#)?[\w\s:\-[]+/.test(sample) ||
      (/^\s*</.test(sample) && /<\/\w+(\w|\d)+>\s*$/.test(sample)) ||
      (/^(\s*<\?xml)/).test(sample)
    ) && (
      /^([\s\w]*<)/.test(sample) ||
      /(>[\s\w]*)$/.test(sample)
    )) || (
      /^(\s*<s((cript)|(tyle)))/i.test(sample) &&
      /(<\/s((cript)|(tyle))>\s*)$/i.test(sample)
    )
  ) {

    return ((/^([\s\w]*<)/).test(sample) === false || (/(>[\s\w]*)$/).test(sample) === false)
      ? markup()
      : notmarkup();
  }

  return output('unknown');
}
