import { Format, Rules } from '..';
import { Except } from 'type-fest';

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
 * CSS Specifics
 *
 * Used by the `esthetic.css()` method
 */
export type CSSFormat = Format<string, Except<Rules, Excludes<'liquid' | 'markup' | 'script' |'json'>>>

/**
 * SCSS Specifics
 *
 * Used by the `esthetic.scss()` method
 */
export type SCSSFormat = Format<string, Except<Rules, Excludes<'liquid' | 'markup' | 'script' |'json'>>>

/**
 * JSON Specifics
 *
 * Used by the `esthetic.json()` method
 */
export type JSONFormat = Format<string, Except<Rules, Excludes<'liquid' | 'markup' | 'script' |'style'>>>

/**
 * JavaScript Specifics
 *
 * Used by the `esthetic.js()` method
 */
export type JavaScriptFormat = Format<string, Except<Rules, Excludes<'liquid' | 'markup' | 'json' |'style'>>>

/**
 * TypeScript Specifics
 *
 * Used by the `esthetic.ts()` method
 */
export type TypeScriptFormat = Format<string, Except<Rules, Excludes<'liquid' | 'markup' | 'json' |'style'>>>

/**
 * TSX Specifics
 *
 * Used by the `esthetic.tsx()` method
 */
export type TSXFormat = Format<string, Except<Rules, Excludes<'liquid'>>>

/**
 * JSX Specifics
 *
 * Used by the `esthetic.jsx()` method
 */
export type JSXFormat = Format<string, Except<Rules, Excludes<'liquid'>>>
