/* eslint-disable no-use-before-define */

import { LiteralUnion, ValueOf } from 'type-fest';
import { LanguageProperName, LanguageProperNames, LexerNames } from './common';
import { Data, Scopes } from './parse/parser';
import { GlobalOptions } from './rules/global';
import { MarkupOptions } from './rules/markup';
import { StyleOptions } from './rules/style';
import { ScriptOptions } from './rules/script';
import { JSONOptions } from './rules/json';

/* -------------------------------------------- */
/* RE-EXPORT                                    */
/* -------------------------------------------- */

export * from './common';
export * from './parse/language';
export * from './parse/tokens';
export * from './parse/parser';
export * from './rules/defintions';
export * from './rules/global';
export * from './rules/markup';
export * from './rules/global';
export * from './rules/markup';
export * from './rules/style';
export * from './rules/script';
export * from './rules/json';

/**
 * Language Beautification Options
 */
export interface Options extends GlobalOptions {
  markup?: MarkupOptions;
  style?: StyleOptions;
  script?: ScriptOptions;
  json?: JSONOptions;
}

export interface Language {
  /**
   * The language name in lowercase.
   */
  language: LanguageProperName
  /**
   * The lexer the language uses.
   */
  lexer: LexerNames;
  /**
   * The language proper name (used in reporting)
   */
  languageName: ValueOf<LanguageProperNames>
}

/**
 * Prettify (Internal)
 *
 * The internal Factory for Prettify. The `index.d.ts` located
 * in the root of the project is exposed factory, this interface
 * is internal facing.
 */
export interface Prettify {
  env: LiteralUnion<'node' | 'browser', string>;
  data: Data;
  start: number;
  end: number;
  iterator: number;
  get source(): string;
  set source(input: string | Buffer)
  scopes: Scopes;
  mode: LiteralUnion<'beautify' | 'parse', string>
  parsed?: Data;
  options?: Options;
  stats?: {
    time: number;
    size: LiteralUnion<`${string} ${'B' | 'KB' | 'MB' | 'TB'}`, string>;
    chars: number;
    language: LanguageProperName;
  }
  hooks?: {
    before?: ((rules: Options, input: string) => void | false)[];
    language?: ((language: Language) => void | Language)[];
    rules?: ((options: Options) => void)[];
    after?: ((this: { parsed: Data }, output: string, rules: Options) => void | false)[];
  }
  lexers: {
    style?(source: string): Data,
    markup?(source: string): Data,
    script?(source: string): Data,
  }
  beautify: {
    style?(options: Options): string,
    markup?(options: Options): string,
    script?(options: Options): string,
  },
}
