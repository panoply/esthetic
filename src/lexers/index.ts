import { Lexers } from 'lexical/enum';

import { json } from './json';
import { markup } from './markup';

export function lexers (lexer: Lexers) {

  if (lexer === Lexers.Markup) return markup();

  if (lexer === Lexers.Json) return json();

}
