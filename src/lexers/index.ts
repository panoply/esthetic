import { Lexers } from '@shared/enums';
import { markup } from './markup';
// import { ParseStore } from 'types/next';
import { script } from './script';
import { style } from './style';

export function lexers (lexer: Lexers) {

  if (lexer === Lexers.Markup) return markup();

  if (lexer === Lexers.Style) return style();

  if (lexer === Lexers.Script) return script();

}
