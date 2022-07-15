import { LanguageNames, LexerNames } from '../common';
import { LiteralUnion } from 'type-fest';

export interface Grammars {
  liquid: {
    /**
     * **Tags**
     *
     * String list of token names to be treated as tag blocks. These are tags,
     * which require an `{% end %}` token be defined, like (for example) the
     * `{% capture %}` token which requires `{% endcapture %}`.
     *
     * The Tags names you provide here will inform Prettify to cancel beautification
     * when no ender can be found or the ender is in-correctly placed.
     */
    tags: Set<string>;

    /**
     * **Else Tags**
     *
     * String list of token names to be treated as else type control singletons. These are tags,
     * which are used within control tags.
     *
     * The Tags names you provide here will inform Prettify to cancel beautification
     * when no ender can be found or the ender is in-correctly placed.
     */
    else: Set<string>;

    /**
     * **Singletons**
     *
     * String list of token names to be treated as singletons. These are tags,
     * which no require an `{% end %}` token to be defined, like (for example)
     * the `{% assign %}` token is a singleton.
     *
     * The Tags names you provide here will inform Prettify to cancel beautification
     * when if the token uses an ender.
     */
    singletons: Set<string>;

    /**
     * **Embedded**
     *
     * A list of token names who's inner contents should be formatted using a different
     * lexer mode. Embedded tags will treat their contained content as external and allow
     * you to apply region based beautification to custom tag blocks.
     *
     */
    embedded?: { [K in LanguageNames]: Array<string | RegExp> }
  };
  html: {
    /**
     * HTML Tags
     *
     * String list of HTML tag blocks
     */
    tags: Set<string>
    /**
     * HTML Voids
     *
     * String list of additional or custom void type
     * HTML tags.
     */
    voids: Set<string>

    /**
     * **Embedded**
     *
     * A list of token names who's inner contents should be formatted using a different
     * lexer mode. Embedded tags will treat their contained content as external and allow
     * you to apply region based beautification to custom tag blocks.
     *
     */
    embedded?: { [K in LanguageNames]: Array<string | RegExp> }
  }
  script: {

    /**
     * **API Keywords**
     *
     * A list of API keywords
     *
     */
    keywords: Set<string>

  }

}

export interface GlobalOptions {
  /**
   * **Default** `auto`
   *
   * The name of the language provided.
   */
  language?: LanguageNames;

  /**
   * **Default** `2`
   *
   * The number of `indentChar` values to comprise a single indentation.
   */
  indentSize?: number;

  /**
   * **Default** `0`
   *
   * How much indentation padding should be applied to beautification?
   * This option is internally used for code that requires switching
   * between libraries.
   */
  indentLevel?: number;

  /**
   *  **Default** `0`
   *
   * Character width limit before applying word wrap. A `0` value
   * disables this option. A negative value concatenates script strings.
   */
  wrap?: number;

  /**
   *  **Default** `false`
   *
   * Whether or not to insert a final line. When this rule is undefined in
   * a `.liquidrc` file the Text Editors settings will be used, in vscode
   * that is `*.endWithNewline` where `*` is a language name.  If an
   * `.editorconfig` file is found present in root, those rules will be
   * applied in **precedence** over Text Editor.
   */
  endNewline?: boolean;

  /**
   *  **Default** `false`
   *
   * If line termination should be Windows (CRLF) format.
   * Unix (LF) format is the default.
   */
  crlf?: boolean;

  /**
   * **Default** ` `
   *
   * The string characters to comprise a single indentation.
   * Any string combination is accepted
   */
  indentChar?: string;

  /**
   * **Default** `true`
   *
   * This will determine whether comments should always start at position
   * `0` of each line or if comments should be indented according to the code.
   * It is unlikely you will ever want to set this to `false` so generally, just
   * leave it to `true`
   *
   */
  commentIndent?: boolean;

  /**
   * **Default** `false`
   *
   * Prevent comment reformatting due to option wrap.
   */
  preserveComment?: boolean;

  /**
   * **Default** `2`
   *
   * The maximum number of consecutive empty lines to retain.
   */
  preserveLine?: number;

  /* -------------------------------------------- */
  /* OTHER                                        */
  /* -------------------------------------------- */

  /**
   * The lexer name for this language - Can be omitted
   * as setting `language` will suffice and apply lexer reference
   * accordingly.
   */
  lexer?: LiteralUnion<LexerNames, string>;
  /**
   * The official language proper naming convertion, for example:
   *
   * - _typescript_ > TypeScript
   * - _javascript_ > JavaScript
   *
   * Typically used internally and with extension based tooling.
   * In the future will be used in the CLI and reporting.
   */
  languageName?: string;
  /**
   * The mode to be invoked. Unless you need direct access to the
   * data structure generated by Sparser, this can be omitted. When
   * providing `parse` the structure is returned, otherwise `beautify`
   * which returns the formatted string.
   */
  mode?: 'beautify' | 'parse';
  /**
   * #### NOT YET AVAILABLE
   *
   * **This option is will be available in future releases and is currently
   * experimental and not fully operational.**
   *
   * ---
   *
   * #### Grammar
   *
   * Low level access to optionally extend the lexers tag handling algorithm.
   * This option allows you to inform Prettify of any custom or additional tokens
   * for provide better context and handling. This is helpful when you need Prettify to
   * process custom tags in a specific manner and only available in markup based languages.
   */
  grammar?: {
    /**
     * Extended token grammars for the Liquid Template Language
     */
    liquid?: {
      /**
       * **Tags**
       *
       * String list of token names to be treated as tag blocks. These are tags,
       * which require an `{% end %}` token be defined, like (for example) the
       * `{% capture %}` token which requires `{% endcapture %}`.
       *
       * The Tags names you provide here will inform Prettify to cancel beautification
       * when no ender can be found or the ender is in-correctly placed.
       *
       * > _By default, Prettify will allow tags that it has no context of to be expressed
       * as either a _singleton_ or _block_ but this might not always be ideal, especially
       * in an SSG environment like 11ty or Jekyll where custom Liquid tags can be used._
       */
      tags?: string[];

      /**
       * **Singletons**
       *
       * String list of token names to be treated as singletons. These are tags,
       * which no require an `{% end %}` token to be defined, like (for example)
       * the `{% assign %}` token is a singleton.
       *
       * The Tags names you provide here will inform Prettify to cancel beautification
       * when if the token uses an ender.
       *
       *
       * > _By default, Prettify will allow tags that it has no context of to be expressed
       * as either a _singleton_ or _block_ but this might not always be ideal, especially
       * in an SSG environment like 11ty or Jekyll where custom Liquid tags can be used._
       */
      singletons?: string[];

      /**
       * **Embedded**
       *
       * A list of token names who's inner contents should be formatted using a different
       * lexer mode. Embedded tags will treat their contained content as external and allow
       * you to apply region based beautification to custom tag blocks.
       *
       */
      embedded?: {
        [K in LanguageNames]: Array<string | RegExp>
      }
    };
    /**
     * Extended token grammars for HTML
     */
    html: {
      /**
       * HTML Voids
       *
       * String list of additional or custom void type
       * HTML tags.
       */
      voids?: string[];
    }
  }
}
