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
 * 'typescript' => 'TypeScript'
 * 'javascript' => 'JavaScript'
 */
export function getLanguageName (language: LanguageName): LanguageOfficialName {

  switch (language) {

    case 'text': return 'Plain Text';
    case 'html': return 'HTML';
    case 'liquid': return 'Liquid';
    case 'xml': return 'XML';
    case 'json': return 'JSON';
    case 'jsx': return 'JSX';
    case 'tsx': return 'TSX';
    case 'typescript': return 'TypeScript';
    case 'javascript': return 'JavaScript';
    case 'less': return 'LESS';
    case 'scss': return 'SCSS';
    case 'sass': return 'SASS';
    case 'css': return 'CSS';

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

    case 'text': return 'ignore';
    case 'auto': return 'auto';

    case 'markup':
    case 'html':
    case 'liquid':
    case 'xml': return 'markup';

    case 'json':
    case 'jsx':
    case 'tsx':
    case 'typescript':
    case 'javascript': return 'script';

    case 'less':
    case 'scss':
    case 'sass':
    case 'css': return 'style';

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

    case 'auto': return Lexers.Auto;

    case 'html':
    case 'liquid':
    case 'xml': return Lexers.Markup;

    case 'json':
    case 'jsx':
    case 'tsx':
    case 'typescript':
    case 'javascript': return Lexers.Script;

    case 'less':
    case 'scss':
    case 'sass':
    case 'css': return Lexers.Style;

  }

  return Lexers.Ignore;

}
