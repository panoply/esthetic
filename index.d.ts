import {
  Rules,
  Options,
  MarkupOptions,
  ScriptOptions,
  StyleOptions,
  JSONOptions,
  Definitions
} from './src/new/prettify.d';

/**
 * Lexer Reference
 */
export type LexerNames = 'markup' | 'script' | 'style' | 'json'

export { Definitions, Definition, Options, Rules } from './src/new/prettify.d';

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
  (source: string, rules?: Options): Promise<string>;
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
export const definitions: Definitions;

export = Prettify;
