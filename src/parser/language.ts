import type { Language, LanguageNames, Prettify } from 'types/prettify';
import { create, assign } from '@utils/native';
import { detectLanguage } from '@parser/detect';
import { prettify } from '@prettify/options';

const lexmap = create(null);
const map = create(null);

{
  lexmap.markup = 'markup';
  lexmap.html = 'markup';
  lexmap.liquid = 'markup';
  lexmap.js = 'script';
  lexmap.ts = 'script';
  lexmap.javascript = 'script';
  lexmap.typescript = 'script';
  lexmap.json = 'script';
  lexmap.jsx = 'script';
  lexmap.tsx = 'script';
  lexmap.less = 'style';
  lexmap.scss = 'style';
  lexmap.sass = 'style';
  lexmap.css = 'style';
  lexmap.text = 'text';
  lexmap.xml = 'markup';

  map.javascript = 'JavaScript';
  map.json = 'JSON';
  map.jsx = 'JSX';
  map.html = 'HTML';
  map.liquid = 'Liquid';
  map.markup = 'markup';
  map.scss = 'SCSS';
  map.text = 'Plain Text';
  map.typescript = 'TypeScript';

}

export function setLexer (input: string) {

  if (typeof input !== 'string') return 'script';
  if (input.indexOf('html') > -1) return 'markup';
  if (lexmap[input] === undefined) return 'script';

  return lexmap[input];
}

function setLanguageName (input: string) {

  if (typeof input !== 'string' || map[input] === undefined) return input.toUpperCase();

  return map[input];

}

export function reference (language: LanguageNames) {

  const result: Language = create(null);

  result.language = language as any;
  result.languageName = setLanguageName(language);
  result.lexer = setLexer(language);

  return result;

}

/* -------------------------------------------- */
/* DETECTION HOOK                               */
/* -------------------------------------------- */

detect.reference = reference;

detect.listen = function (callback: Prettify['hooks']['language'][number]) {
  prettify.hooks.language.push(callback);
};

export function detect (sample: string): Language {

  const { language } = detectLanguage(sample);
  const result: Language = create(null);

  result.language = language;
  result.languageName = setLanguageName(language as any);
  result.lexer = setLexer(language as any);

  if (prettify.hooks.language.length > 0) {
    for (const hook of prettify.hooks.language) {
      const langhook = hook(result);
      if (typeof langhook === 'object') assign(result, langhook);
    }
  }

  return result;
}
