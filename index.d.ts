/* eslint-disable object-curly-newline */

import {
  Rules,
  Options,
  MarkupOptions,
  ScriptOptions,
  StyleOptions,
  JSONOptions,
  Definitions,
  Language,
  LanguageNames
} from './types/prettify';

export {
  Definitions,
  Definition,
  Options,
  Rules,
  SharedOptions,
  MarkupOptions,
  ScriptOptions,
  StyleOptions,
  JSONOptions,
  LanguageNames,
  LexerNames
} from './types/prettify';

declare const Prettify: {
  /**
   * **PRETTIFY 💅**
   *
   * The next generation beautification tool for Liquid.
   *
   * - Liquid + HTML
   * - Liquid + XHTML
   * - Liquid + XML
   * - Liquid + CSS
   * - Liquid + SCSS
   * - Liquid + LESS
   * - Liquid + JavaScript
   * - Liquid + TypeScript
   * - Liquid + JSX
   * - Liquid + TSX
   * - JSON
   */
  format(source: string, rules?: Options): Promise<string>;
  /**
   * **PRETTIFY MARKUP 💅**
   *
   * Beautify markup
   *
   * - Liquid + HTML
   * - Liquid + XHTML
   * - Liquid + XML
   */
  markup?: (source: string, rules?: MarkupOptions) => Promise<string>;
  /**
   *  **PRETTIFY SCRIPT 💅**
   *
   * Beautify scripts
   *
   * - Liquid + JavaScript
   * - Liquid + TypeScript
   * - Liquid + JSX
   * - Liquid + TSX
   */
  script?: (source: string, rules?: ScriptOptions) => Promise<string>;
  /**
   *  **PRETTIFY STYLE 💅**
   *
   * Beautify scripts
   *
   * - Liquid + CSS
   * - Liquid + SCSS
   * - Liquid + LESS
   */
  style?: (source: string, rules?: StyleOptions) => Promise<string>;
  /**
   *  **PRETTIFY JSON 💅**
   *
   * Beautify JSON
   *
   * - JSON ONLY
   */
  json?: (source: string, rules?: JSONOptions) => Promise<string>;
  /**
   * **RULES**
   *
   * Set universal formatting rules
   */
  rules?: (rules?: Rules) => Promise<string>;
};

/**
 * **DEFINTIONS**
 *
 * Rule defintions which describe the different formatting options
 * prettify offers.
 */
export declare const definitions: Definitions;

/**
 * **LANGUAGE**
 *
 * Language detection and utilities. This is used internally by Prettify
 * to determine the lexer to use and formatting ruleset to apply.
 */
export declare const language: {
  /**
   * Automatic language detection based on the string input.
   * Returns lexer, language and official name.
   */
  auto?: (sample: string) => Language;
  /**
   * Sets the lexing engine
   */
  setLexer?: (language: LanguageNames) => LexerNames;
  /**
   * Utility function which returns a Language reference
   * consisting of the Languag name, its official variation naming
   * convention and the pertaining lexer.
   *
   * This function is different from `auto()` in the sense that it
   * only accepts a lowercase language name, not a text string.
   */
  reference?: (language: LanguageNames) => Language;
};

export default Prettify;
