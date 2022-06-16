import type { Language, LanguageNames } from 'types/prettify';
import { create } from '@utils/native';
import { detect } from '@parser/detect';

export function setLexer (input: string) {

  const lexmap = {
    markup: 'markup',
    html: 'markup',
    liquid: 'markup',
    js: 'script',
    ts: 'script',
    javascript: 'script',
    typescript: 'script',
    json: 'script',
    jsp: 'markup',
    jsx: 'script',
    tsx: 'script',
    less: 'style',
    scss: 'style',
    sass: 'style',
    css: 'style',
    text: 'text',
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
    html: 'HTML',
    liquid: 'Liquid',
    markup: 'markup',
    scss: 'SCSS',
    text: 'Plain Text',
    typescript: 'TypeScript'
  };

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

export function auto (sample: string): Language {

  const { language } = detect(sample);
  const result: Language = create(null);

  result.language = language as any;
  result.languageName = setLanguageName(language as any);
  result.lexer = setLexer(language as any);

  return result;
}
