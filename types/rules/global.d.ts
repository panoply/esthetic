import { LanguageName } from '../shared';

export interface GlobalRules {
  /**
   * **Default** `auto`
   *
   * The name of the language provided.
   */
  language?: LanguageName;

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
   * **Default** `2`
   *
   * The maximum number of consecutive empty lines to retain.
   */
  preserveLine?: number;
}
