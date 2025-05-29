import { LanguageName, Rules } from 'esthetic';

export type RulesTemplate = {
  /**
   * Holds reference to the block we are currently processing
   *
   * - `rules`
   * - `before`
   * - `after`
   *
   * When `null` we are not within rules structure.
   *
   * > Resets after prcoessing `after`
   */
  block: 'rules' | 'before' | 'after'
  /**
   * Æsthetic rules from the `json:rules` codeblock
   */
  rules: Rules;
  rulesEsc: string;
  /**
   * The language name we are handling
   */
  language: LanguageName;
  /**
   * The raw content string
   */
  raw: string;
  /**
   * The contents of the `:before` codeblock
   */
  before: string;
  /**
   * The contents of the `:after` codeblock
   */
  after: string;
}
