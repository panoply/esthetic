import { GlobalRules, LiquidRules, MarkupRules, ScriptRules, StyleRules } from '../internal';

/**
 * Option defintion type string Literal
 */
export type DefinitionTypes = 'boolean' | 'array' | 'number' | 'string' | 'select'

/**
 * Option defintion lexer types
 */
export type DefinitionLexerTypes = 'auto' | 'markup' | 'script' | 'style'

/**
 * Definition Reference
 */
export interface Definition {
  /**
   * The default setting
   */
  default: boolean | string[] | string | number;
  /**
   * Rules description
   */
  description: string;
  /**
   * Type
   */
  type: DefinitionTypes | DefinitionTypes[];
  /**
   * The lexer the rule pertains - Accepts an array of lexers when rule is used
   * in different language specific lexers.
   */
  lexer: 'all' | 'liquid' | DefinitionLexerTypes | DefinitionLexerTypes[];
  /**
   * When multiple types are accepted this will contain the references of each type.
   * The property should match the type name
   */
  multi?: {
    /**
     * The rule value
     */
    [K in DefinitionTypes]?: {
      /**
       * The default setting
       */
      default: boolean | string[] | string | number;
      /**
       * Rule value description
       */
      description: string;
    }
  };
  /**
   * An optional list of pre-selected rule values.
   */
  values?: {
    /**
     * The rule value
     */
    rule: string;
    /**
     * Rule value description
     */
    description: string;
  }[]
}

/**
 * Omitted option/rules defintions that are
 * either internal facing or automatically applied.
 */
export type InternalDefinitions = (
  'indentLevel' |
  'languageName' |
  'mode' |
  'styleGuide'
)

/**
 * Option Definitions
 */
export interface Definitions {
  global: {
    [K in keyof GlobalRules]: Definition
  };
  liquid: {
    [K in keyof LiquidRules]: Definition
  };
  markup: {
    [K in keyof MarkupRules]: Definition
  };
  style: {
    [K in keyof StyleRules]: Definition
  };
  script: {
    [K in keyof ScriptRules]: Definition
  };
}
