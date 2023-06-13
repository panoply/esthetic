/* eslint-disable no-redeclare */
/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */

import { Events } from './types/events';
import { Hooks } from './types/hooks';
import * as Æ from './types/index';
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
  Grammars,
  Language,
  Stats,
  IParseError,
  IConfig,
  IConfigInternal,
  Data
} from './types/index';

declare namespace Æsthetic {

  interface Static {
    /**
     * **Æsthetic ~ Rule Defintions**
     *
     * Rule defintions which describe the different formatting options
     * esthetic offers.
     */
    get definitions(): Definitions;
    /**
     * **Æsthetic ~ Statistics**
     *
     * Maintains a reference of statistic information about the
     * operation, also available in events like `esthetic.on('format')` and
     * `esthetic.on('parse')` arguments.
     */
    get stats(): Stats;
    /**
     * **Æsthetic ~ Parse Table**
     *
     * Returns the current Parse Table data~structure. You can only call this
     * in a post beautification or parse cycle.
     */
    get table(): Data;
    /**
     * **Æsthetic ~ Parse Error**
     *
     * Returns the the Parse Error or `null` if no error
     */
    get error(): IParseError;
    /**
     * **Æsthetic Liquid**
     *
     * Formatting for the Liquid Template Language.
     */
    liquid: LiquidFormat;
    /**
     * **Æsthetic HTML**
     *
     * Formatting for the HTML Language.
     */
    html: HTMLFormat;
    /**
     * **Æsthetic XML**
     *
     * Formatting for the XML Language.
     */
    xml: XMLFormat;
    /**
     * **Æsthetic CSS**
     *
     * Formatting for the CSS Language.
     */
    css: CSSFormat
    /**
     * **Æsthetic JSON**
     *
     * Formatting for the JSON Language.
     */
    json: JSONFormat;
    /**
     * **Æsthetic JavaScript (BETA)**
     *
     * Formatting for the JavaScript Language.
     */
    js: LiquidFormat;
    /**
     * **Æsthetic TypeScript (BETA)**
     *
     * Formatting for the TypeScript Language.
     */
    ts: LiquidFormat;
    /**
     * **Æsthetic ~ Format**
     *
     * Æsthetic supports multiple languages but one should use
     * the experimental languages with caution until they are
     * out of BETA with full support.
     *
     * Full Support:
     *
     * - Liquid
     * - HTML
     * - XML
     * - CSS
     * - SCSS
     * - JSON
     *
     * Partial Support:
     *
     * - JavaScript
     * - TypeScript
     * - JSX
     * - TSX
     * ---
     *
     * @example
     *
    * import esthetic from 'esthetic';
    *
    * const output = esthetic.format('<div id="foo"> Hello World </div>', {
    *   language: 'html',
    *   markup: {
    *     forceAttribute: true
    *   }
    * });
    *
    * console.log(output);
    *
    */
    format: (source: string | Buffer, rules?: Rules) => string;

    /**
     * **Æsthetic Parse**
     *
     * Executes a parse operation and returns the generate data structure.
     * When calling this method, beautification will not be applied, the
     * parse table is returned.
     *
     * The `esthetic.format()` method will execute a parse, so only use this
     * method when you are working with the parse table itself, otherwise use
     * `esthetic.format()` or one of the language specifics.
     *
     * ---
     *
     * **NOTE**
     *
     * You cannot pass rules, use the `esthetic.rules({})` method instead.
     *
     * ---
     *
     * @example
     *
     * import esthetic from 'esthetic';
     *
     * const data = esthetic.parse('<div id="foo"> Hello World </div>');
     *
     * // data.begin
     * // data.ender
     * // data.lexer
     * // data.lines
     * // data.stack
     * // data.token
     * // data.types
     *
     */
    parse: (source: string | Buffer) => Data;

    /**
     * **Æsthetic ~ Events**
     *
     * Event Listener which invokes on different operations.
     */
    on: Events<Pick<Static, 'on' | 'parse' | 'format'>>;

    /**
     * **Æsthetic ~ Hooks**
     *
     * Hook into the parse and beatification operations. Hooks allow you to
     * refine output and control different logic during execution cycles.
     */
    hook: Hooks<Pick<Static, 'on' | 'parse' | 'format'>>;

    /**
     * **Æsthetic ~ Configuration**
     *
     * Control the execution behaviour of Æsthetic. Options exposed in this method
     * allow you to refine operations.
     *
     * To return the configuration settings currently applied along with addition
     * reference applied internally, then do no provide a parameter.
     */
    config: {
      (): IConfigInternal;
      (options: IConfig): Pick<Static, 'on' | 'grammar' | 'rules' | 'hook' | 'parse' | 'format'>;
    };

    /**
     * **Æsthetic ~ Rules**
     *
     * Set format rules to be applied to syntax. Use this method if you are executing
     * repeated runs and do not require Æsthetic to validate rules for every cycle.
     *
     * To return the current beautification rules, then do not provide a parameter.
     */
    rules: {
      /**
       * Returns the current rulesets Æsthetic is using.
       */
      (): Rules;
      /**
       * Update the current rules.
       */
      (rules: Rules): Pick<Static, 'on'| 'parse'| 'format'>;
    };

    /**
     * **Æsthetic ~ Grammar**
     *
     * Extend built-in grammar references. By default, Æsthetics supports all current
     * specification standards.
     *
     * This is helpful when you need to provide additional context and handling
     * in languages like Liquid, but you can also extend the core languages like CSS.
     *
     * To return the current grammar presets, then do not provide a parameter.
     */
    grammar: {
      /**
       * Returns the current grammar references
       */
      (): Grammars;
      /**
       * Extend the current grammar references
       */
      (grammar: Grammars): Pick<Static, 'on' | 'hook' | 'rules' | 'parse' | 'format'>
    };

    /**
     * **Æsthetic ~ Language Detection**
     *
     * Automatic language detection based on the string input.
     * Returns lexer, language and official name.
     */
    detect: (sample: string) => Language;
  }

  /**
   * **Æsthetic Global Rules ~ (Type)**
   *
   * Type export of Global Formatting Rules. These rules are used
   * for every supported language.
   *
   * ---
   *
   * [Æsthetic Docs](https://æsthetic.dev/rules#global)
   */
  type GlobalRules = Æ.GlobalRules;
  /**
   * **Æsthetic Liquid Rules ~ (Type)**
   *
   * Type export of Liquid Formatting Rules. These rules are specific
   * to the Liquid Language.
   *
   * ---
   *
   * [Æsthetic Docs](https://æsthetic.dev/rules#liquid)
   */
  type LiquidRules = Æ.LiquidRules;
  /**
   * **Æsthetic Markup Rules ~ (Type)**
   *
   * Type export of Markup Formatting Rules. These rules are specific
   * to the HTML, XML, Liquid and other Languages which use Markup.
   *
   * ---
   *
   * [Æsthetic Docs](https://æsthetic.dev/rules#markup)
   */
  type MarkupRules = Æ.MarkupRules;
  /**
   * **Æsthetic Script Rules ~ (Type)**
   *
   * Type export of Script Formatting Rules. These rules are specific
   * to the JavaScript, TypeScript, JSX, TSX and other Languages which use Scripts.
   *
   * ---
   *
   * [Æsthetic Docs](https://æsthetic.dev/rules#script)
   */
  type ScriptRules = Æ.ScriptRules;
  /**
   * **Æsthetic Style Rules ~ (Type)**
   *
   * Type export of Style Formatting Rules. These rules are specific
   * to the CSS, SCSS  and other Languages which use Styles.
   *
   * ---
   *
   * [Æsthetic Docs](https://æsthetic.dev/rules#style)
   */
  type StyleRules = Æ.StyleRules;
  /**
   * **Æsthetic JSON Rules ~ (Type)**
   *
   * Type export of JSON Formatting Rules. These rules are specific
   * to the JSON language.
   *
   * ---
   *
   * [Æsthetic Docs](https://æsthetic.dev/rules#style)
   */
  type JSONRules = Æ.JSONRules;
  /**
   * **Æsthetic Language Name ~ (Type)**
   *
   * Type export of lowercase Language names used for determining
   * the language Æsthetic is handling. This is the Type used via
   * the global rules `language` option.
   *
   * The type is a Literal Union and leveraged in CLI and reportings.
   */
  type LanguageName = Æ.LanguageName;
  /**
   * **Æsthetic Official Language Names ~ (Type)**
   *
   * Type export of the official Language names, for example, if the
   * the Language name is `liquid` then the official is `Liquid` (with)
   * a captial `L`.
   *
   * The type is a Literal Union and leveraged in CLI and reportings.
   *
   * ---
   *
   * [Æsthetic Docs](https://æsthetic.dev/rules#style)
   */
  type LanguageOfficialName = Æ.LanguageOfficialName;
  /**
   * **Æsthetic Lexer Names ~ (Type)**
   *
   * Type export of the lexer names. This is mostly an internal option but has
   * been exposed here for API usage. The **Lexer** name is any one of these 6:
   *
   * ---
   *
   * `auto`
   *
   *  _Automatic Detection of Lexer and Language_
   *
   * `text`
   *
   *  _Used for Plain Text_
   *
   * `markup`
   *
   * _Used for HTML, XML, Liquid_
   *
   * `style`
   *
   * _Used for CSS and SCSS_
   *
   * `script`
   *
   * _Used for JavaScript, TypeScript, JSON_
   *
   * `ignore`
   *
   * _Used to ignore a language or region_
   *
   */
  type LexerName = Æ.LexerName;
  /**
   * **Æsthetic Parse Table Record ~ (Type)**
   *
   * Type export of Parse hooks function events.
   *
   */
  type ParseHook = Æ.ParseHook;
  /**
   * **Æsthetic Parse Table Record ~ (Type)**
   *
   * Type export of the data structure (parse table) records.
   *
   */
  type Record = Æ.Record;
  /**
   * **Æsthetic Parse Table Record ~ (Type)**
   *
   * Type export of the data structure Parse Table.
   *
   */
  type ParseTable = Æ.Data;
  /**
   * **Æsthetic Grammar ~ (Type)**
   *
   * Type export of Grammars method parameter.
   */
  type Grammar = Æ.Grammars;
  /**
   * **Æsthetic Parse Error ~ (Type)**
   *
   * Type export of the Parse Error Model which is provided and returned
   * by the `esthetic.error` getter.
   */
  type ParseError = Æ.IParseError;
}

declare const Æsthetic: Æsthetic.Static;

export = Æsthetic
