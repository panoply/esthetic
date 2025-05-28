import { LiteralUnion } from 'type-fest';

import { ExtraTypes, JsonTypes, LiquidTypes, MarkupTypes } from './parse/tokens';
import { GlobalRules } from './rules/global';
import { JSONRules } from './rules/json';
import { LiquidRules } from './rules/liquid';
import { MarkupRules } from './rules/markup';

export interface Rules extends GlobalRules, MarkupRules, LiquidRules, JSONRules {}

/**
 * Option Rule Names Stirng Literal
 */
export type RulePresetNames = LiteralUnion<(
  | 'none'
  | 'aesthetic'
  | 'warrington'
  | 'prettier'
), string>

/**
 * Option Rule Names Stirng Literal
 */
export type RuleNames = (
  | keyof GlobalRules
  | keyof LiquidRules
  | keyof MarkupRules
  | keyof JSONRules
)

/**
 * Lexer Names string literal
 */
export type LexerName = (
  | 'ignore'
  | 'auto'
  | 'text'
  | 'markup'
  | 'json'
);

/**
 * Lexer Names string literal
 */
export type LanguageName = LiteralUnion<(
  | 'auto'
  | 'text'
  | 'plaintext'
  | 'html'
  | 'liquid'
  | 'json'
  | 'xml'
  | 'unknown'
), string>

/**
 * The formatted proper names of supported languages
 */
export interface LanguageOfficialNameMap {
  text: 'Plain Text';
  plaintext: 'Plain Text';
  html: 'HTML';
  liquid: 'Liquid';
  json: 'JSON';
  xml: 'XML';
}

/**
 * Language Proper name string literal
 */
export type LanguageOfficialName = LiteralUnion<keyof LanguageOfficialNameMap, string>;

/**
 * Lexer names as an array type
 */
export type LexerArray = LexerName[];

/**
 * Structure reference applied on parser. Otherwise known
 * as `scope` in the parser.
 */
export type Structure = [ token: string, index: number ];

/**
 * Structure Array Reference
 */
export class StructureEntries extends Array<Structure> {

  /**
   * The last know entry in the stack, which is referred to
   * to as `scope` in Prettify. Returns an object type,
   */
  get scope(): Structure;
  /**
   * An additional method for working with the `parse.structure` array.
   * This will update the last known entry with provided values. The function
   * accepts either `string`, `number`  types as a first parameter.
   *
   * - When a `string` type is provided then the last known token `[][0]` entry is updated
   * - When a `number` type is provided then the last known index `[][1]` entry is updated
   *
   * To update both the `Structure` array last known `token` and `index` entries then pass
   * the `token` as first parameter and `index` as second parameter.
   */
  update(token: string | number, index?: number): Structure;
  /**
   * Clear the structure entries, removing all values, excluded the initial `['global', -1]`
   * scope entry.
   */
  clear(): Structure;
  /**
   * The `parse.structure` array pop method is configured to
   * prevent removal of the initial `['global', -1]` scope entry.
   */
  pop(): Structure;

}
/**
 * Token Types string literal
 */
export type Types = LiteralUnion<`${
  | MarkupTypes
  | ExtraTypes
  | JsonTypes
  | LiquidTypes
}`, string>

/**
 * Statistic Reporting Model
 */
export interface Stats {
  /**
   * Parse processing time in miliseconds or seconds, eg: `100ms` or `1s`
   */
  time: string;
  /**
   * The number of characters contained in the source string.
   */
  chars: number;
  /**
   * The offical language name that was parsed
   */
  language: LanguageOfficialName;
  /**
   * The lexer name
   */
  lexer: LexerName;
}
