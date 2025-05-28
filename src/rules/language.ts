import type { LanguageName, LanguageOfficialName, LexerName } from 'types';

import { Lexers } from 'lexical/enum';

/**
 * Get Language Name
 *
 * Returns the official language of a string variation language id.
 *
 * @example
 *
 * 'html' => 'HTML'
 * 'liquid' => 'Liquid'
 * 'json' => 'JSON'
 */
export function getLanguageName (language: LanguageName): LanguageOfficialName {

  switch (language) {

    case 'plaintext': return 'Plain Text';
    case 'text': return 'Plain Text';
    case 'html': return 'HTML';
    case 'liquid': return 'Liquid';
    case 'xml': return 'XML';
    case 'json': return 'JSON';

  }

}

/**
 * Get Lexer Type
 *
 * Returns the Lexer enum of a string variation language id.
 *
 * > Unsupported languages return `Lexers.Ignore`
 */
export function getLexerName (language: LanguageName): LexerName {

  switch (language) {
    case 'plaintext':
      return 'ignore';
    case 'text':
      return 'ignore';
    case 'auto':
      return 'auto';
    case 'markup':
    case 'html':
    case 'liquid':
    case 'xml':
      return 'markup';
    case 'json':
      return 'json';
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

  switch (language) {
    case 'auto':
      return Lexers.Auto;
    case 'html':
    case 'liquid':
    case 'xml':
      return Lexers.Markup;
    case 'json':
      return Lexers.Json;
  }

  return Lexers.Ignore;

}
