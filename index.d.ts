/* eslint-disable object-curly-newline */

import { Events } from './types/events';

import {
  LiquidFormat,
  HTMLFormat,
  CSSFormat,
  JSONFormat,
  XMLFormat
} from './types/misc/specifics';

import {
  Rules,
  Definitions,
  Language,
  Grammars,
  Stats,
  IParseError,
  Settings
} from './types/export';

export {
  Definition,
  Definitions,
  Rules,
  GlobalRules,
  LiquidRules,
  MarkupRules,
  ScriptRules,
  StyleRules,
  JSONRules,
  Language,
  LanguageName,
  LanguageOfficialName,
  LexerName
} from './types/export';

declare const esthetic: {
  /**
   * **Liquid Æsthetic**
   *
   * Formatting for the Liquid Template Language.
   */
  liquid: LiquidFormat;
  /**
   * **HTML Æsthetic**
   *
   * Formatting for the HTML Language.
   */
  html: HTMLFormat;
  /**
   * **XML Æsthetic**
   *
   * Formatting for the XML Language.
   */
  xml: XMLFormat;
  /**
   * **CSS Æsthetic**
   *
   * Formatting for the CSS Language.
   */
  css: CSSFormat
  /**
   * **JSON Æsthetic**
   *
   * Formatting for the JSON Language.
   */
  json: JSONFormat;
  /**
   * **Defintions**
   *
   * Rule defintions which describe the different formatting options
   * esthetic offers.
   */
  get definitions(): Definitions;
  /**
   * **Stats**
   *
   * Maintains a reference of statistic information about the
   * operation, also available in events like `esthetic.on('format')` and
   * `esthetic.on('parse')` arguments.
   */
  get stats(): Stats;
  /**
   * **Error**
   *
   * Returns the the Parse Error or `null` if no error
   */
  get error(): IParseError;

  /**
   * **ÆSTHETIC Format**
   *
   * The new generation beautification tool for Liquid. Sync
   * export which throws if error.
   *
   * - Liquid
   * - HTML
   * - XML
   * - CSS
   * - SCSS
   * - SASS
   * - LESS
   * - JavaScript
   * - TypeScript
   * - JSX
   * - TSX
   * - JSON
   */
  format: (source: string, rules?: Rules) => string;

  /**
   * **ÆSTHETIC Parse**
   *
   * Returns the Sparser data~structure parse table.
   */
  parse: (source: string) => string;

  /**
   * **Change Listener**
   *
   * Hook listener wich will be invoked when beautification
   * options change or are augmented.
   */
  on: Events;

  /**
   * **Settings**
   *
   * Set format rules to be applied to syntax. To return the
   * current beautification rules, then do not provide a parameter.
   *
   * **NOTE YET AVAILABLE**
   */
  settings:(options: Settings) => Settings;

  /**
   * **Rules**
   *
   * Set format rules to be applied to syntax. To return the
   * current beautification rules, then do not provide a parameter.
   */
  rules: (rules?: Rules) => Rules;

  /**
   * **Grammar**
   *
   * Extend built-in grammar references.
   * By default, Æsthetics supports all current specification standards.
   *
   * This is helpful when you need to provide additional
   * context and handling in Liquid but you can also extend the core languages.
   *
   * > To return the current grammar presets, then do not provide a parameter.
   */
  grammar: (grammar?: Grammars) => Grammars;

  /**
   * **Language**
   *
   * Automatic language detection based on the string input.
   * Returns lexer, language and official name.
   */
  detect: (sample: string) => Language;

};

export default esthetic;
