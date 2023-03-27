import { is, not, isLast, isString } from 'utils/helpers';
import { NIL } from 'lexical/chars';
import { cc } from 'lexical/codes';

/**
 * Get Tag Name
 *
 * Returns the tag name of the provided token. Looks for HTML and Liquid tag names,
 * includes Liquid output objects too. Will convert tag names to lowercase.
 *
 * Optionally provide a slice offset index to slice the tag name. Helpful in situations
 * when we need to exclude `end` from `endtag`
 */
export function getTagName (tag: string, slice: number = NaN, fallback?: string) {

  if (isString(tag) === false) return NIL;

  if (not(tag, cc.LAN) && not(tag, cc.LCB)) return fallback || tag;

  if (is(tag, cc.LAN)) {

    const next = tag.search(/[\s>]/);
    const name = tag.slice(is(tag[1], cc.FWS) ? 2 : 1, next);

    // Handles XML tag name (ie: <?xml?>)
    return is(name, cc.QWS) && isLast(name, cc.QWS) ? 'xml' : isNaN(slice)
      ? name
      : name.slice(slice);

  }

  // Returns the Liquid tag or output token name
  const name = is(tag[2], cc.DSH) ? tag.slice(3).trimStart() : tag.slice(2).trimStart();
  const tname = name.split(/\s|-?[%}]}/).shift();

  return isNaN(slice) ? tname : tname.slice(slice);

};

/**
 * Quote Conversion
 *
 * Converts quotes while excluding escaped instances.
 * Returns a function and is intended to be used within a `replace`.
 *
 * @example
 *
 * string.replace(/"/g, lx.qc("'"))
 */
export function qc (to: string) {

  return (m: string, i: number, input: string) => not(input[i - 1], cc.BWS) ? to : m;

}

/**
 * Count Occurances
 *
 * Counts the number of occurances of a character in the provided
 * string and returns the number.
 */
export function countChars (string: string, char: string) {

  return string.split(char).length - 1;

}
