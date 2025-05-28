import { Grammars } from './misc/grammar';
import { LanguageName, LanguageOfficialName, LexerName, Rules } from './shared';

/* -------------------------------------------- */
/* RE-EXPORT                                    */
/* -------------------------------------------- */

export * from './shared';
export * from './parse/tokens';
export * from './parse/parser';
export * from './misc/grammar';
export * from './misc/defintions';
export * from './misc/settings';
export * from './misc/merger';
export * from './next';
export * from './events';

export type RuleChanges = {
  [K in keyof Rules]?: {
    /**
     * The old rule value that was changed.
     */
    from: Rules[K];
    /**
     * The new rule value now being used.
     */
    to: Rules[K];
  };
};

export interface Language {
  /**
   * The language name in lowercase.
   */
  language: LanguageName
  /**
   * The lexer the language uses.
   */
  lexer: LexerName;
  /**
   * The language proper name (used in reporting)
   */
  languageName: LanguageOfficialName
}

/**
 * Internal faceing Grammar control
 */
export interface Grammar {
  /**
   * HTML Grammar rules
   */
  html: {
    /**
     * Set list of void type tags
     */
    voids: Set<string>;
    /**
     * Set list of start/end tags
     */
    tags: Set<string>;
    /**
     * Embedded Language HTML type tag handler
     */
    embed: {
      /**
       * The tag name identifier
       */
      [tagName: string]: {
        /**
         * The embedded Language name in lowercase format,
         * this will be used to determine the lexer to use
         */
        language: LanguageName;
        /**
         * The attribute match reference
         */
        attribute?: string;
        /**
         * The value checksum
         */
        value?(token: string): boolean
      }
    }
  };
  /**
   * Liquid Grammar rules
   */
  liquid: {
    /**
     * Set list of start/end tags
     */
    tags: Set<string>;
    /**
     * Set list of else type tokens used in control tags
     */
    else: Set<string>;
    /**
     * Set list of singleton type tokens
     */
    singletons: Set<string>;
    /**
     * Embedded Language Liquid type tag handler
     */
    embed: {
      /**
       * The tag name identifier
       */
      [tagName: string]: {
        /**
         * The Language name in lowercase format,
         * this will be used to determine the lexer to use
         */
        language: LanguageName;
        /**
         * The attributee match reference checksum
         */
        attribute?(token: string): boolean
        /**
         * Checksum to determine whether or not the token
         * `tagName` has reached the `{% endtag %}` tag.
         */
        end(token: string): boolean
      }
    }
  };
  /**
   * CSS language grammar rules
   */
  css: {
    /**
     * Set list of valid units
     */
    units: Set<string>
  };
  /**
   * JavaScript Grammar rules
   */
  javascript: {
    /**
     * Set list of keyword rules
     */
    keywords: Set<string>
  };

  /**
   * Extend grammar utility for combining user
   * defined options with pre-defined ones.
   */
  extend(options: Grammars): void;

  /**
   * Extend grammar utility for combining user
   * defined options with pre-defined ones.
   */
  embed(options: Grammars): void
}

export interface Format<T extends string, O extends Rules> {

  /**
   * **ÆSTHETIC**
   *
   * The new generation beautification tool for Liquid. Sync
   * export which throws if error.
   *
   * - XML
   * - HTML
   * - Liquid
   * - JSON
   */
  (source: T, rules?: O): T

}
