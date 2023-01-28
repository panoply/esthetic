import { Lexers } from '@shared/enums';
import { markup } from './markup';
import { script } from './script';
import { style } from './style';
// import { ParseStore } from 'types/next';

export function format (lexer: Lexers) {

  if (lexer === Lexers.Markup) return markup();

  if (lexer === Lexers.Style) return style();

  if (lexer === Lexers.Script) return script();

}
