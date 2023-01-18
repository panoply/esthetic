/* eslint-disable object-curly-newline */

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
  Format,
  Parse,
  ParseError,
  Grammars,
  EventListeners
} from './types/internal';

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
} from './types/internal';

declare const prettify: {
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
   * prettify offers.
   */
  get definitions(): Definitions;
  /**
   * **Error**
   *
   * Returns the the Parse Error or `null` if no error
   */
  get error(): ParseError;
  /**
   * **ÆSTHETIC**
   *
   * A formatting method which exposes all formatting options.
   * If you are target a specific language, then use the specific
   * language name exports for easier control.
   *
   * Support for the following languages:
   *
   * - Liquid + HTML
   * - Liquid + XHTML
   * - Liquid + XML
   * - Liquid + CSS
   * - Liquid + SCSS
   * - Liquid + SASS
   * - Liquid + LESS
   * - Liquid + JavaScript
   * - Liquid + TypeScript
   * - Liquid + JSX
   * - Liquid + TSX
   * - HTML
   * - CSS
   * - JSON
   */
  format?: Format<string, Rules>;

  /**
   * **Parse (async)**
   *
   * Returns the Sparser data~structure. Returns a promise.
   * You can access the sync method as a function method.
   */
  parse: Parse<string>;

  /**
   * **Change Listener**
   *
   * Hook listener wich will be invoked when beautification
   * options change or are augmented.
   */
  on: EventListeners<'format' | 'parse' | 'rules'>;

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
   * Extend the Prettify built-in grammar references.
   * By default, Prettify supports all current specification standards.
   *
   * This is helpful when you need to provide additional
   * context and handling in Liquid but you can also extend
   * the core languages.
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
  language: (sample: string) => Language;

};

export default prettify;
