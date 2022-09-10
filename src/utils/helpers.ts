import { isArray, create, assign } from './native';
import { cc, NIL, WSP } from '@utils/chars';
import { grammar } from '@options/grammar';

/**
 * Creates a null prototypical object
 */
export function object<T> (initial?: T): T {

  const o = create(null);

  if (initial) return assign(o, initial);

  return o;
}

/**
 * Repeats a character x amount of times.
 * Used for generating repeating characters
 * and is merely a wraper around `''.repeat()`
 */
export function repeatChar (count: number, character: string = WSP) {

  if (count === 0) return character;

  let char = NIL;
  let i = 1;

  do { char += character; } while (i++ < count);

  return char;
}

export function notchar (string: string, code: number) {

  if (!string) return false;

  return string.charCodeAt(0) !== code;

}

/**
 * Character Code is equal
 */
export function is (string: string, code: number) {

  if (!string) return false;

  return string.charCodeAt(0) === code;

}

/**
 * Character Code is not
 */
export function not (string: string, code: number) {

  return is(string, code) === false;

}

/**
 * Whitespace
 *
 * Check if character is whitespace
 */
export function ws (string: string) {

  return /\s/.test(string);
}

/**
 * Converts byte size to killobyte, megabyte,
 * gigabyte or terrabyte
 */
export function size (bytes: number): string {

  const kb = 1024;
  const mb = 1048576;
  const gb = 1073741824;

  if (bytes < kb) return bytes + ' B';
  else if (bytes < mb) return (bytes / kb).toFixed(1) + ' KB';
  else if (bytes < gb) return (bytes / mb).toFixed(1) + ' MB';
  else return (bytes / gb).toFixed(1) + ' GB';

};

/**
 * Sanitize Line comment
 */
export function sanitizeComment (input: string) {

  return `\\${input}`;

}

export function getLiquidTagName (input: string) {

  const begin = input.indexOf('{');
  const token = is(input[begin + 2], cc.DSH)
    ? input.slice(begin + 3).trimStart()
    : input.slice(begin + 2).trimStart();

  return token.slice(0, token.search(/\s/));

}

export function isLiquidOutput (input: string) {

  const begin = input.indexOf('{');

  return is(input[begin + 1], cc.LCB);

}

export function isLiquidStart (input: string) {

  const begin = input.indexOf('{');

  if (is(input[begin + 1], cc.PER)) {

    let token = is(input[begin + 2], cc.DSH)
      ? input.slice(begin + 3).trimStart()
      : input.slice(begin + 2).trimStart();

    token = token.slice(0, token.search(/\s/));

    if (token.startsWith('end')) return false;

    return grammar.liquid.tags.has(token);

  }

  return false;
}

export function isLiquidEnd (input: string | string[]) {

  let token = input as string;

  if (Array.isArray(input)) token = input.join('');

  const begin = token.indexOf('{');

  if (is(token[begin + 1], cc.PER)) {
    if (is(token[begin + 2], cc.DSH)) return token.slice(begin + 3).trimStart().startsWith('end');
    return token.slice(begin + 2).trimStart().startsWith('end');
  }

  return false;

}

/**
 * Checks where the provided string contains Liquid
 * delimiters. Optionally accepts a `where` parameter
 * which allows for checking start, end, both or containment.
 *
 * Where Parameter
 *
 * - `1` Check starting delimiters, eg: `{{`, `%}`
 * - `2` Check ending delimiters, eg: `}}`, `%}`
 * - `3` Check starting and ending delimiters
 * - `4` Check if input contains starting delimiters
 * - `5` Check if input contains starting and ending delimiters
 */
export function isLiquid (input: string, direction: 1 | 2 | 3 | 4 | 5): boolean {

  if (direction === 1) {

    return is(input[0], cc.LCB) && (
      is(input[1], cc.PER) ||
        is(input[1], cc.LCB)
    );

  } else if (direction === 2) {

    return is(input[input.length - 1], cc.RCB) && (
      is(input[input.length - 2], cc.PER) ||
      is(input[input.length - 2], cc.RCB)
    );

  } else if (direction === 3) {
    return (
      is(input[0], cc.LCB) && (
        is(input[1], cc.PER) ||
          is(input[1], cc.LCB)
      )
    ) && (
      is(input[input.length - 1], cc.RCB) && (
        is(input[input.length - 2], cc.PER) ||
          is(input[input.length - 2], cc.LCB)
      )
    );

  } else if (direction === 4) {

    return /{[{%}]/.test(input);

  } else if (direction === 5) {

    return (/{[{%]/.test(input) && /[%}]}/.test(input));

  }

}

/**
 * Safe Sort Ascension
 *
 * Used to sort objects, properties and selectors
 */
export function safeSortAscend (this: { recursive: boolean;}, item: [string, number][]) {

  let c = 0;
  const len = item.length;
  const storeb = item;

  /**
   * Safe Sort (Ascend Child)
   *
   * ---
   *
   * original: parse_safeSort_ascend_child
   */
  const safeSortAscendChild = () => {
    let a = 0;
    const lenc = storeb.length;
    if (a < lenc) {
      do {
        if (isArray(storeb[a]) === true) storeb[a] = safeSortAscend.apply(this, storeb[a]);
        a = a + 1;
      } while (a < lenc);
    }
  };

  /**
   * Safe Sort (Ascend Rescurse)
   *
   * ---
   *
   * original: parse_safeSort_ascend_recurse
   */
  const safeSortAscendRecurse = (value: any) => {

    let a = c;
    let b = 0;
    let d = 0;
    let e = 0;
    let ind = [];
    let key = storeb[c];
    let tstore = '';

    const tkey = typeof key;

    if (a < len) {

      do {

        tstore = typeof storeb[a];

        if (storeb[a] < key || tstore < tkey) {
          key = storeb[a];
          ind = [ a ];
        } else if (storeb[a] === key) {
          ind.push(a);
        }

        a = a + 1;

      } while (a < len);
    }

    d = ind.length;
    a = c;
    b = d + c;

    if (a < b) {
      do {
        storeb[ind[e]] = storeb[a];
        storeb[a] = key;
        e = e + 1;
        a = a + 1;
      } while (a < b);
    }

    c = c + d;

    if (c < len) {
      safeSortAscendRecurse('');
    } else {
      if (this.recursive === true) safeSortAscendChild();
      item = storeb;
    }

    return value;
  };

  safeSortAscendRecurse('');

  return item;

};

/**
 * Safe Sort Descension
 *
 * Used to sort objects, properties and selectors
 */
export function safeSortDescend (this: { recursive: boolean;}, item: [string, number][]) {

  let c = 0;
  const len = item.length;
  const storeb = item;

  /**
   * Safe Sort (Descend Child)
   *
   * ---
   *
   * original: parse_safeSort_descend_child
   */
  const safeSortDescendChild = () => {

    let a = 0;
    const lenc = storeb.length;

    if (a < lenc) {
      do {
        if (isArray(storeb[a])) storeb[a] = safeSortDescend.apply(this, storeb[a]);
        a = a + 1;
      } while (a < lenc);
    }
  };

  /**
   * Safe Sort (Descend Recurse)
   *
   * ---
   *
   * original: parse_safeSort_descend_recurse
   */
  const safeSortDescendRecurse = (value: string) => {

    let a = c;
    let b = 0;
    let d = 0;
    let e = 0;
    let key = storeb[c];
    let ind = [];
    let tstore = '';

    const tkey = typeof key;

    if (a < len) {

      do {
        tstore = typeof storeb[a];

        if (storeb[a] > key || (tstore > tkey)) {
          key = storeb[a];
          ind = [ a ];
        } else if (storeb[a] === key) {
          ind.push(a);
        }

        a = a + 1;

      } while (a < len);
    }

    d = ind.length;
    a = c;
    b = d + c;

    if (a < b) {

      do {
        storeb[ind[e]] = storeb[a];
        storeb[a] = key;
        e = e + 1;
        a = a + 1;
      } while (a < b);
    }

    c = c + d;

    if (c < len) {
      safeSortDescendRecurse('');
    } else {
      if (this.recursive === true) safeSortDescendChild();
      item = storeb;
    }

    return value;
  };

  safeSortDescendRecurse('');

  return item as [string, number][];

};

export function safeSortNormal (this: {
  array: [string, number][],
  recursive: boolean;
}, item: [string, number][]) {

  let storeb = item;
  const done = [ item[0] ];

  /**
   * Safe Sort (Normal Child)
   *
   * ---
   *
   * original: safeSort_normal_child
   */
  const safeSortNormalChild = () => {

    let a = 0;
    const len = storeb.length;

    if (a < len) {
      do {
        if (isArray(storeb[a])) storeb[a] = safeSortNormal.apply(this, storeb[a]);
        a = a + 1;
      } while (a < len);
    }

  };

  /**
   * Safe Sort (Normal Recurse)
   *
   * ---
   *
   * original: parse_safeSort_normal_recurse
   */
  const safeSortNormalRecurse = (x: [string, number]) => {

    let a = 0;

    const storea = [];
    const len = storeb.length;

    if (a < len) {
      do {
        if (storeb[a] !== x) storea.push(storeb[a]);
        a = a + 1;
      } while (a < len);
    }

    storeb = storea;

    if (storea.length > 0) {
      done.push(storea[0]);
      safeSortNormalRecurse(storea[0]);
    } else {
      if (this.recursive === true) safeSortNormalChild();
      item = storeb;
    }
  };

  safeSortNormalRecurse(this.array[0]);

  return item;
}
