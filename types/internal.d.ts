/* eslint-disable no-use-before-define */

import { LiteralUnion } from 'type-fest';
import { LanguageName, LanguageOfficialName, LexerName, Stats } from './shared';
import { Data, ParseError } from './parse/parser';
import { GlobalRules } from './rules/global';
import { LiquidRules } from './rules/liquid';
import { MarkupRules } from './rules/markup';
import { StyleRules } from './rules/style';
import { ScriptRules } from './rules/script';
import { JSONRules } from './rules/json';
import { Grammars } from './misc/grammar';

/* -------------------------------------------- */
/* RE-EXPORT                                    */
/* -------------------------------------------- */

export * from './shared';
export * from './parse/tokens';
export * from './parse/parser';
export * from './misc/grammar';
export * from './misc/defintions';
export * from './rules/global';
export * from './rules/liquid';
export * from './rules/markup';
export * from './rules/style';
export * from './rules/script';
export * from './rules/json';
export * from './next';

/**
 * Language Beautification Options
 */
export interface Rules extends GlobalRules {
  liquid?: LiquidRules;
  markup?: MarkupRules;
  style?: StyleRules;
  script?: ScriptRules;
  json?: JSONRules;
}

/**
 * Language Beautification Options
 */
export interface RulesInternal extends GlobalRules {
  liquid?: LiquidRules;
  markup?: MarkupRules;
  style?: StyleRules;
  script?: ScriptRules;
  json?: ScriptRules;
}

export type GlobalRuleChanges = {
  [K in keyof GlobalRules]?: {
    /**
     * The old rule value that was changed.
     */
    from: GlobalRules[K];
    /**
     * The new rule value now being used.
     */
    to: GlobalRules[K];
  };
};

export type LiquidRuleChanges = {
  [K in keyof LiquidRules]: {
    /**
     * The old `liquid` rule value that was changed.
     */
    from: LiquidRules[K];
    /**
     * The new `liquid` rule value now being used.
     */
    to: LiquidRules[K];
  };
}

export type MarkupRuleChanges = {
  [K in keyof MarkupRules]: {
    /**
     * The old `markup` rule value that was changed.
     */
    from: MarkupRules[K];
    /**
     * The new `markup` rule value now being used.
     */
    to: MarkupRules[K];
  };
}

export type StyleRuleChanges = {
  [K in keyof StyleRules]: {
    /**
     * The old `style` rule value that was changed.
     */
    from: StyleRules[K];
    /**
     * The new `style` rule value now being used.
     */
    to: StyleRules[K];
  };
}

export type ScriptRuleChanges = {
  [K in keyof ScriptRules]: {
    /**
     * The old `script` rule value that was changed.
     */
    from: ScriptRules[K];
    /**
     * The new `script` rule value now being used.
     */
    to: ScriptRules[K];
  };
}

export interface RulesChanges extends GlobalRuleChanges {
  /**
   * Liquid Rule Changes
   */
  liquid?: LiquidRuleChanges;
  /**
   * Markup Rule Changes
   */
  markup?: MarkupRuleChanges;
  /**
   * Style Rule Changes
   */
  style?: StyleRuleChanges;
  /**
   * Script Rule Changes
   */
  script?: ScriptRuleChanges;
}

export interface Events {
  /**
   * Invoked immeadiatly after formatting has complete but
   * before returning the beautified result. You can cancel
   * and return input opposed to generated output by returning
   * a boolean `false`.
   */
  format: ((this: { rules: Rules; data: Data; }, input?: string) => void | false)[];
  /**
   * Invoked when the language changes
   */
  language?: ((language?: Language) => void | Language)[];
  /**
   * Invoked when rules update change or update, the first parameter returns
   * the diffed rule changes (ie: the changed rules), second is a copy if current rules.
   */
  rules?: ((changes?: RulesChanges, rules?: Rules) => void)[];
  /**
   * Invoked on after a full parse has completed
   */
  parse?: ((this: { rules: Rules }, data: Data) => void | false)[];
}

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

/**
 * Prettify (Internal)
 *
 * The internal Factory for Prettify. The `index.d.ts` located
 * in the root of the project is an exposed factory, this interface
 * is internal facing and at its core maintains a reference of the
 * user defined options together with operations to be applied.
 */
export interface Prettify {
  /**
   * Returns Input Source
   */
  get source(): string;
  /**
   * Set/Update Input Source
   */
  set source(input: string | Buffer);
  /**
   * Return the Parse Table
   */
  get data(): Data;
  /**
   * Set/Reset the parse table
   */
  set data(data: Data);
  /**
   * Returns current rules
   */
  get rules(): Rules;
  /**
   * Stats reference of operation
   */
  get stats(): Stats;
  /**
   * Set/Reset Stats reference
   */
  set stats(stats: Stats);
  /**
   * Informative reference to parse errors
   */
  error: ParseError;
  /**
   * The current environment Prettify was invoked
   */
  env: LiteralUnion<'node' | 'browser', string>;
  start: number;
  end: number;
  iterator: number;
  /**
   * The current mode
   */
  mode: LiteralUnion<'beautify' | 'parse', string>;
  /**
   * The current lexer to use
   */
  lexer: LexerName;
  /**
   * Reference to operation events
   */
  events?: Events;
  /**
   * The supporting lexers
   */
  lexers: {
    /**
     * The style lexer
     */
    style(input: string): Data;
    /**
     * The markup lexer
     */
    markup(input: string | string[]): Data;
    /**
     * The script lexer
     */
    script(input: string | string[]): Data;
  };
  /**
   * The supporting beautifiers
   */
  beautify: {
    /**
     * The style beautifier
     */
    style(rules: Rules): string;
    /**
     * The markup beautifer
     */
    markup(rules: Rules): string;
    /**
     * The script beautifier
     */
    script(rules: Rules): string;
  };
}

export type EventNames = (
  | 'format'
  | 'parse'
  | 'rules'
 );

/**
 * Lifecycle Events
 */
export type EventListeners<T extends EventNames> = (
  T extends 'format' ? (
  /**
   * Trigger a callback to execute immeadiatly after beautification
   * has completed. The function will trigger before the returning
   * promise has fulfilled and is invoked in an isolated nammer.
   *
   * > _Returning `false` will cancel formatting._
   */
    output?: string,
  /**
    * Holds reference to current rules
    */
    rules?: Rules

  ) => false | void : T extends 'rules' ? (
    /**
     * Holds reference to rules which changed
     */
    changes?: RulesChanges,
    /**
     * Holds reference to current rules
     */
    rules?: Rules

  ) => void : T extends 'parse' ? (
    /**
     * The generated data structure
     */
    data?: Data,
  /**
     * Holds reference to current rules
     */
    rules?: Rules
  ) => void | false : never
)

export interface Parse<T> {

  (source: string): Promise<T>;
  /**
   * **Parse (sync)**
   *
   * Returns the Sparser data~structure. Async
   * export which resolves a promise.
   */
  sync?(source: string): T;

}

export interface Format<T extends string, O extends Rules> {

  (source: T, rules?: O): Promise<T>;
  /**
   * **PRETTIFY 🎀**
   *
   * The new generation beautification tool for Liquid. Sync
   * export which throws if error.
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
  sync(source: T, rules?: O): T;
}
