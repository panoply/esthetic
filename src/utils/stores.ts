import type { LiquidInternal } from 'types';
import { object } from './native';

/**
 * Generates the data store used for SVG records
 *
 * - Used in **markup** lexer
 */
export function SVGStore <T extends {
  /**
   * Starting Index within data structure
   */
  start: number;
  /**
   * Array list of tag names
   */
  tname: string[];
  /**
   * Array list of data strcuture indexes
   */
  index: number[];
}> (): T {

  const svg: T = object(null);

  svg.start = -1;
  svg.tname = [];
  svg.index = [];

  return svg;

}

/**
 * Generates the data store used for Liquid Equipoise
 *
 * - Used in **markup** lexer
 */
export function LiquidStore (): LiquidInternal {

  const liquid: LiquidInternal = object(null);

  liquid.pipes = [];
  liquid.fargs = [];
  liquid.targs = [];
  liquid.logic = [];
  liquid.param = [];

  return liquid;

}
