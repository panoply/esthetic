import { parse } from 'parse/parser';
import { is, not, isArray } from 'utils';
import { cc as ch } from 'lexical/codes';
import { NIL } from 'chars';
import type{ Data } from 'types';

/* -------------------------------------------- */
/* EXPORTS                                      */
/* -------------------------------------------- */

/**
 * Sort Object
 *
 * The function that sorts object properties. Applies alphanumeric
 * sorting for objects.
 */
export function sortObject (data: Data) {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * The parsed length (`parse.count`) to traverse
   */
  let cc = parse.count;

  /**
   * The starting point (`parse.stack.index`) for traversal
   */
  let dd = parse.stack.index;

  /**
   * An iterator store
   */
  let ee = 0;

  /**
   * An iterator store
   */
  let ff = 0;

  /**
   * An iterator store
   */
  let gg = 0;
  let behind = 0;
  let front = 0;
  let keyend = 0;
  let keylen = 0;

  /**
   * Whether of not a comman separator is applied
   */
  let comma = true;

  /**
   * Destruct required entries
   */
  const { count } = parse;

  /**
     * Reference to last known `stack.token`
     */
  const token = parse.stack.token;

  /**
     * Reference to last known `stack.index`
     */
  const begin = parse.stack.index;

  /**
     * The current number of line spaces
     */
  const lines = parse.lineOffset;

  /**
     * Whether or not the lexer is `style`
     */
  const style = data.lexer[count] === 'style';

  /**
     * Whether or not lexer is `style` and we are in `global` stack.
     */
  const global = style && token === 'global';

  /**
     * Delimiter reference
     */
  const delim = style ? [ ';', 'separator' ] : [ ',', 'separator' ];

  /**
     *
     */
  const keys: [number, number][] = [];

  /**
     * Data store reference, equivelent of `parse.data`
     */
  const store: Data = {
    begin: [],
    ender: [],
    lexer: [],
    lines: [],
    stack: [],
    token: [],
    types: []
  };

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

  /**
   * Sorting
   *
   * Applies alphanumeric sorting to the keys of qualified structures.
   */
  function sort (x: number[], y: number[]) {

    let xx = x[0];
    let yy = y[0];

    if (data.types[xx] === 'comment') {
      do xx = xx + 1;
      while (xx < count && (data.types[xx] === 'comment'));
      if (data.token[xx] === undefined) return 1;
    }

    if (data.types[yy] === 'comment') {
      do yy = yy + 1;
      while (yy < count && (data.types[yy] === 'comment'));
      if (data.token[yy] === undefined) return 1;
    }

    if (style === true) {

      // JavaScript's standard array sort uses implementation specific algorithms.
      // This simple numeric trick forces conformance.
      if (data.token[xx].indexOf('@import') === 0 || data.token[yy].indexOf('@import') === 0) {
        return xx < yy ? -1 : 1;
      }

      if (data.types[xx] !== data.types[yy]) {
        if (data.types[xx] === 'function') return 1;
        if (data.types[xx] === 'variable') return -1;
        if (data.types[xx] === 'selector') return 1;
        if (data.types[xx] === 'property' && data.types[yy] !== 'variable') return -1;
        if (data.types[xx] === 'mixin' && data.types[yy] !== 'property' && data.types[yy] !== 'variable') return -1;
      }

    }

    if (data.token[xx].toLowerCase() > data.token[yy].toLowerCase()) return 1;

    return -1;

  };

  /* -------------------------------------------- */
  /* BEGIN TRAVERSAL                              */
  /* -------------------------------------------- */

  behind = cc;

  do {

    if (data.begin[cc] === dd || (
      global &&
      cc < behind &&
      is(data.token[cc], ch.RCB) &&
      data.begin[data.begin[cc]] === -1
    )) {

      if (data.types[cc].indexOf('liquid') > -1) return;

      if (data.token[cc] === delim[0] || (
        style === true &&
        is(data.token[cc], ch.RCB) &&
        not(data.token[cc + 1], ch.SEM)
      )) {

        comma = true;
        front = cc + 1;

      } else if (style === true && is(data.token[cc - 1], ch.RCB)) {

        comma = true;
        front = cc;

      }

      if (front === 0 && data.types[0] === 'comment') {

        // Keep top comments at the top
        do front = front + 1;
        while (data.types[front] === 'comment');

      } else if (data.types[front] === 'comment' && data.lines[front] < 2) {

        // When a comment follows code on the same line then
        // keep the comment next to the code it follows
        front = front + 1;
      }

      if (comma === true && (data.token[cc] === delim[0] || (
        style === true &&
        is(data.token[cc - 1], ch.RCB)
      )) && front <= behind) {

        if (style === true && '};'.indexOf(data.token[behind]) < 0) {
          behind = behind + 1;
        } else if (style === false && not(data.token[behind], ch.COM)) {
          behind = behind + 1;
        }

        keys.push([ front, behind ]);

        if (style === true && is(data.token[front], ch.RCB)) {
          behind = front;
        } else {
          behind = front - 1;
        }
      }
    }

    cc = cc - 1;

  } while (cc > dd);

  if (keys.length > 0 && keys[keys.length - 1][0] > cc + 1) {

    ee = keys[keys.length - 1][0] - 1;

    if (data.types[ee] === 'comment' && data.lines[ee] > 1) {
      do ee = ee - 1;
      while (ee > 0 && data.types[ee] === 'comment');
      keys[keys.length - 1][0] = ee + 1;
    }

    if (data.types[cc + 1] === 'comment' && cc === -1) {
      do cc = cc + 1;
      while (data.types[cc + 1] === 'comment');
    }

    keys.push([ cc + 1, ee ]);
  }

  if (keys.length > 1) {

    // HOT PATCH
    // Fixes JSON embedded region and language object sorting
    if (
      style === true ||
      parse.language === 'json' ||
      is(data.token[cc - 1], ch.EQS) ||
      is(data.token[cc - 1], ch.COL) ||
      is(data.token[cc - 1], ch.LPR) ||
      is(data.token[cc - 1], ch.LSB) ||
      is(data.token[cc - 1], ch.COM) ||
      data.types[cc - 1] === 'word' ||
      cc === 0
    ) {

      keys.sort(sort);

      keylen = keys.length;
      comma = false;
      dd = 0;

      do {

        keyend = keys[dd][1];

        if (style === true) {

          gg = keyend;

          if (data.types[gg] === 'comment') gg = gg - 1;

          if (is(data.token[gg], ch.RCB)) {
            keyend = keyend + 1;
            delim[0] = '}';
            delim[1] = 'end';
          } else {
            delim[0] = ';';
            delim[1] = 'separator';
          }

        }

        ee = keys[dd][0];

        if (
          style === true &&
          data.types[keyend - 1] !== 'end' &&
          data.types[keyend] === 'comment' &&
          data.types[keyend + 1] !== 'comment' &&
          dd < keylen - 1
        ) {

          // missing a terminal comment causes many problems
          keyend = keyend + 1;

        }

        if (ee < keyend) {

          do {

            if (
              style === false &&
              dd === keylen - 1 &&
              ee === keyend - 2 &&
              is(data.token[ee], ch.COM) &&
              data.lexer[ee] === 'script' &&
              data.types[ee + 1] === 'comment'
            ) {

              // Do not include terminal commas that are followed by a comment
              ff = ff + 1;

            } else {

              parse.push(store, {
                begin: data.begin[ee],
                ender: data.begin[ee],
                lexer: data.lexer[ee],
                lines: data.lines[ee],
                stack: data.stack[ee],
                token: data.token[ee],
                types: data.types[ee]
              }, NIL);

              ff = ff + 1;

            }

            // Remove extra commas
            if (data.token[ee] === delim[0] && (style === true || data.begin[ee] === data.begin[keys[dd][0]])) {
              comma = true;
            } else if (data.token[ee] !== delim[0] && data.types[ee] !== 'comment') {
              comma = false;
            }

            ee = ee + 1;

          } while (ee < keyend);

        }

        // Injecting the list delimiter
        if (
          comma === false &&
          store.token[store.token.length - 1] !== 'x;' && (
            style === true ||
            dd < keylen - 1
          )
        ) {

          ee = store.types.length - 1;

          if (store.types[ee] === 'comment') {
            do ee = ee - 1;
            while (ee > 0 && (store.types[ee] === 'comment'));
          }

          ee = ee + 1;

          parse.splice({
            data: store,
            howmany: 0,
            index: ee,
            record: {
              begin,
              stack: global ? 'global' : token,
              ender: parse.count,
              lexer: store.lexer[ee - 1],
              lines: 0,
              token: delim[0],
              types: delim[1]
            }
          });

          ff = ff + 1;

        }

        dd = dd + 1;

      } while (dd < keylen);

      parse.splice({ data, howmany: ff, index: cc + 1 });
      parse.lineOffset = lines;
      parse.concat(data, store);

    }
  }

}

/**
 * A custom sort tool that is a bit more intelligent and
 * multidimensional than `Array.prototype.sort`
 */
export function sortSafe (
  array: [ token: string, lines: number, chain?: boolean][],
  operation: string,
  recursive: boolean
): [ token: string, lines: number, chain?: boolean][] {

  if (isArray(array) === false) return array;

  if (operation === 'normal') {
    return safeSortNormal.call({ array, recursive }, array);
  }

  if (operation === 'descend') return safeSortDescend.call({ recursive }, array);

  return safeSortAscend.call({ recursive }, array);

}

/**
 * Sort Correction
 *
 * This functionality provides corrections to the `begin` and `ender` values
 * after use of objectSort
 */
export function sortCorrect (start: number, end: number) {

  let a = start;
  let endslen = -1;

  const { data } = parse;
  const ends = [];
  const structure = (parse.stack.length < 2)
    ? [ -1 ]
    : [ parse.stack[parse.stack.length - 2][1] ];

  // This first loop solves for the begin values
  do {

    if (a > 0 &&
      data.types[a].indexOf('attribute') > -1 &&
      data.types[a].indexOf('end') < 0 &&
      data.types[a - 1].indexOf('start') < 0 &&
      data.types[a - 1].indexOf('attribute') < 0 &&
      data.lexer[a] === 'markup') {

      structure.push(a - 1);

    }

    if (a > 0 &&
      data.types[a - 1].indexOf('attribute') > -1 &&
      data.types[a].indexOf('attribute') < 0 &&
      data.lexer[structure[structure.length - 1]] === 'markup' &&
      data.types[structure[structure.length - 1]].indexOf('start') < 0
    ) {

      structure.pop();

    }

    if (data.begin[a] !== structure[structure.length - 1]) {
      data.begin[a] = structure.length > 0 ? structure[structure.length - 1] : -1;
    }

    if (data.types[a].indexOf('else') > -1) {
      if (structure.length > 0) {
        structure[structure.length - 1] = a;
      } else {
        structure.push(a);
      }
    }

    if (data.types[a].indexOf('end') > -1) structure.pop();
    if (data.types[a].indexOf('start') > -1) structure.push(a);

    a = a + 1;

  } while (a < end);

  // Now for the ender values
  a = end;

  do {

    a = a - 1;

    if (data.types[a].indexOf('end') > -1) {
      ends.push(a);
      endslen = endslen + 1;
    }

    data.ender[a] = endslen > -1 ? ends[endslen] : -1;

    if (data.types[a].indexOf('start') > -1) {
      ends.pop();
      endslen = endslen - 1;
    }

  } while (a > start);

}

/* -------------------------------------------- */
/* UTILITY FUNCTIONS                            */
/* -------------------------------------------- */

/**
 * Safe Sort Ascension
 *
 * Used to sort objects, properties and selectors
 */
function safeSortAscend (this: { recursive: boolean; }, item: [string, number][]) {

  let c: number = 0;

  const len = item.length;
  const storeb = item;

  /**
   * Added for line preservation of attributes
   *
   * > This might cause issues is the style/script lexer, will need to investigate
   */
  const lines = storeb.map((x) => x[1]);

  /**
   * Safe Sort (Ascend Child)
   *
   * ---
   *
   * original: parse_safeSort_ascend_child
   */
  const ascendChild = () => {

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
  const ascendRecurse = (value: any = NIL) => {

    let a = c;
    let b = 0;
    let d = 0;
    let e = 0;
    let ind = [];
    let key = storeb[c];

    const tkey = typeof key;

    if (a < len) {

      do {

        // The typeof comparison was originally:
        //
        // typeof storeb[a] < tkey
        //
        // If error occur, change it back
        //
        // eslint-disable-next-line valid-typeof
        if (storeb[a] < key || typeof storeb[a] === tkey) {
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

        // Changes the line value
        // Remove this line if errors occur in style/script lexer
        key[1] = lines[a];

        storeb[ind[e]] = storeb[a];
        storeb[a] = key;

        e = e + 1;
        a = a + 1;

      } while (a < b);
    }

    c = c + d;

    if (c < len) {
      ascendRecurse();
    } else {
      if (this.recursive === true) ascendChild();
      item = storeb;
    }

    return value;
  };

  ascendRecurse();

  return item;

};

/**
 * Safe Sort Descension
 *
 * Used to sort objects, properties and selectors
 */
function safeSortDescend (this: { recursive: boolean;}, item: [string, number][]) {

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
  const descendChild = () => {

    const lenc = storeb.length;

    /**
     * Iterator value
     */
    let a: number = 0;

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
  const descendRecurse = (value: string = '') => {

    let a = c;
    let b = 0;
    let d = 0;
    let e = 0;
    let key = storeb[c];
    let ind = [];
    let tstore = NIL;

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
      descendRecurse();
    } else {
      if (this.recursive === true) descendChild();
      item = storeb;
    }

    return value;

  };

  descendRecurse();

  return item as [string, number][];

};

function safeSortNormal (this: { array: [string, number][], recursive: boolean; }, item: [string, number][]) {

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
