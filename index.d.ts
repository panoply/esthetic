/* eslint-disable object-curly-newline */

import {
  Options,
  Definitions,
  Language,
  Data,
  LanguageProperName
} from './types/prettify';

export {
  Definitions,
  Options,
  GlobalOptions,
  MarkupOptions,
  ScriptOptions,
  StyleOptions,
  JSONOptions,
  Language,
  LanguageNames,
  LanguageProperNames,
  LexerNames
} from './types/prettify';

declare const prettify: {
  /**
   * **PRETTIFY 💅**
   *
   * The new generation beautification tool for Liquid.
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
   * - JSON
   */
  format?: {
    (source: string, rules?: Options): Promise<string>;
    /**
     * **Before Format**
     *
     * Trigger a callback to execute right before beautification
     * begins. The function will be invoked in an isolated manner.
     */
    before?: (callback: (rules: Options, input: string) => void | false) => void;
    /**
     * **After Format**
     *
     * Trigger a callback to execute immeadiatly after beautification
     * has completed. The function will trigger before the returning
     * promise has fulfilled and is invoked in an isolated nammer.
     */
    after?: (callback: (output: string, rules: Options) => void | false) => void
    /**
     * **Format Stats**
     *
     * Trigger a callback to execute immeadiatly after beautification
     * has completed. The function will trigger before the returning
     * promise has fulfilled and is invoked in an isolated nammer.
     */
    get stats(): {
      /**
       * Beautification processing time in miliseconds
       */
      time: number;
      /**
       * The output size, ie: bytes, kb or mb
       */
      size: number;
      /**
       * The number of characters contained in the output string.
       */
      chars: number;
      /**
       * The offical language name that was beautified
       */
      language: LanguageProperName
    };

  };
  /**
   * **Parse**
   *
   * Returns the Sparser data~structure.
   */
  parse?: {
    (source: string): Promise<Data>;
    /**
     * **Parse Stats**
     *
     * Return some execution information
     */
    get stats(): {
      /**
       * Parse processing time in miliseconds
       */
      time: number;
      /**
       * The source string size, ie: bytes, kb or mb
       */
      size: number;
      /**
       * The number of characters contained in the source string.
       */
      chars: number;
      /**
       * The offical language name that was parsed
       */
      language: LanguageProperName
    };
  }
  /**
   * **Options**
   *
   * Set format options to be applied to syntax
   */
  options?: {
    (rules: Options): Options;
    /**
     * **Current Rules**
     *
     * Returns the current formatting rule options. This
     * getter will reflect the last known options to have been
     * passed.
     */
    get rules(): Options;
    /**
     * **Change Listener**
     *
     * Hook listener wich will be invoked when beautification
     * options change or are augmented.
     */
    listen?: (callback: (opions: Options) => void) => void
  };
  /**
   * **Language**
   *
   * Automatic language detection based on the string input.
   * Returns lexer, language and official name.
   */
  language?: {
    /**
     * **Detect Language**
     *
     * Automatic language detection based on the string input.
     * Returns lexer, language and official name.
     */
    (sample: string): Language;
    /**
     * **Language Reference**
     *
     * Returns a language from a supplied language
     * name reference.
     */
    reference?(languageId: Language): Language;
    /**
     * **Language Listener**
     *
     * Trigger a callback to execute after language detection has
     * completed. Optionally return an augmentation
     */
    listen?: (callback: (language: Language) => void | Language) => void;
  };
};

/**
 * **Defintions**
 *
 * Rule defintions which describe the different formatting options
 * prettify offers.
 */
export declare const definitions: Definitions;

export default prettify;
