import { Except } from 'type-fest';

import { Format, Rules } from '..';

/**
 * Helper Utility for excluding common rules
 */
type Excludes<T> = 'language' | 'indentLevel' | T

/* -------------------------------------------- */
/* EXPORTS                                      */
/* -------------------------------------------- */

/**
 * Liquid Specifics
 *
 * Used by the `esthetic.liquid()` method
 */
export type LiquidFormat = Format<string, Except<Rules, | 'language' | 'indentLevel'>>

/**
 * HTML Specifics
 *
 * Used by the `esthetic.html()` method
 */
export type HTMLFormat = Format<string, Except<Rules, Excludes<'liquid'>>>

/**
 * XML Specifics
 *
 * Used by the `esthetic.xml()` method
 */
export type XMLFormat = Format<string, Except<Rules, Excludes<'liquid' | 'style' | 'script' |'json'>>>

/**
 * JSON Specifics
 *
 * Used by the `esthetic.json()` method
 */
export type JSONFormat = Format<string, Except<Rules, Excludes<'liquid' | 'markup' | 'script' |'style'>>>
