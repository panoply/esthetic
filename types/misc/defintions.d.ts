import type { Rules } from '..';

/**
 * Option defintion type string Literal
 */
export type DefinitionTypes = 'boolean' | 'array' | 'number' | 'string' | 'choice'

/**
 * Option defintion lexer types
 */
export type DefinitionLexerTypes = 'auto' | 'markup' | 'json'

/**
 * Definition Reference
 */
export interface Definition {
  /**
   * Rules description
   */
  description: string;
  /**
   * Documentation Reference
   */
  documentation?: string;
  /**
   * The default setting
   */
  default: boolean | string[] | string | number;
  /**
   * Preset default
   */
  preset?: {
    [K in Rules['preset']]: boolean | string[] | string | number
  }
  /**
   * Types
   *
   * When multiple types are accepted this will contain the references of each type.
   * The property should match the type name
   */
  type: DefinitionTypes | DefinitionTypes[] | {
    /**
     * The rule value
     */
    [K in DefinitionTypes]?: string;

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
 * Option Definitions
 */
export type Definitions = {
  [K in keyof Rules]: Definition
}
