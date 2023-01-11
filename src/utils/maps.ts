import { LanguageName, LanguageOfficialName } from 'types/internal';
import { Lexers } from '@shared/enums';

/**
 * Get Language Name
 *
 * Returns the official language of a string variation language id.
 *
 * @example
 *
 * 'typescript' => 'TypeScript'
 * 'javascript' => 'JavaScript'
 */
export function getLanguageName (language: LanguageName): LanguageOfficialName {

  if (typeof language === 'string') {

    return {
      html: 'HTML',
      liquid: 'Liquid',
      xml: 'XML',
      jsx: 'JSX',
      tsx: 'TSX',
      json: 'JSON',
      yaml: 'YAML',
      css: 'CSS',
      scss: 'SCSS',
      sass: 'SASS',
      less: 'LESS',
      javascript: 'JavaScript',
      typescript: 'TypeScript'

    }[language];

  }

}

/**
 * Get Lexer Type
 *
 * Returns the Lexer enum of a string variation language id.
 *
 * > Unsupported languages return `Lexers.Ignore`
 */
export function getLexerName (language: LanguageName): 'script' | 'style' | 'markup' {

  if (typeof language === 'string') {

    return {
      text: 'ignore',
      auto: 'ignore',
      markup: 'markup',
      html: 'markup',
      liquid: 'markup',
      xml: 'markup',
      javascript: 'script',
      typescript: 'script',
      jsx: 'script',
      tsx: 'script',
      json: 'script',
      less: 'style',
      scss: 'style',
      sass: 'style',
      css: 'style'
    }[language];

  }
}

/**
 * Get Lexer Type
 *
 * Returns the Lexer enum of a string variation language id.
 *
 * > Unsupported languages return `Lexers.Ignore`
 */
export function getLexerType (language: LanguageName): Lexers {

  if (typeof language === 'string') {

    return {
      text: Lexers.Ignore,
      auto: Lexers.Ignore,
      markup: Lexers.Markup,
      html: Lexers.Markup,
      liquid: Lexers.Markup,
      xml: Lexers.Markup,
      javascript: Lexers.Script,
      typescript: Lexers.Script,
      jsx: Lexers.Script,
      tsx: Lexers.Script,
      json: Lexers.Script,
      less: Lexers.Style,
      scss: Lexers.Style,
      sass: Lexers.Style,
      css: Lexers.Style
    }[language];

  }
}
