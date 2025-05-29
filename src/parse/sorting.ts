import type { Attrs, Data } from 'types';

import { NIL } from 'chars';
import { cc as ch } from 'lexical/codes';
import { parse } from 'parse/parser';
import { is, not } from 'utils/helpers';

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

      if (data.types[cc].includes('liquid')) return;

      if (data.token[cc] === delim[0]) {
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

      if (comma === true && data.token[cc] === delim[0] && front <= behind) {
        if (not(data.token[behind], ch.COM)) behind = behind + 1;
        keys.push([ front, behind ]);
        behind = front - 1;
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
      is(data.token[cc - 1], ch.COL) ||
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
              data.lexer[ee] === 'json' &&
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
            remove: 0,
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

      parse.splice({ data, remove: ff, index: cc + 1 });
      parse.lineOffset = lines;
      parse.concat(data, store);

    }
  }

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

export function sortAttrs (entries: Attrs, list: string[] = []): Attrs {

  if (entries.length === 0) return entries;

  // Pre-compute attribute names once
  const attrNames = entries.map(([ key ]) => key.split('=')[0].trim());

  // Create priority lookup map for O(1) access
  const priorityMap = new Map<string, number>();
  const prefixRules: Array<{ prefix: string; priority: number }> = [];

  list.forEach((item, index) => item.endsWith('*')
    ? prefixRules.push({ prefix: item.slice(0, -1), priority: index })
    : priorityMap.set(item, index));

  // Helper function to get priority for an attribute name
  function getPriority (attrName: string): number {

    // Check exact match first

    if (priorityMap.has(attrName)) return priorityMap.get(attrName)!;
    // Check prefix matches
    for (const { prefix, priority } of prefixRules) {
      if (attrName.startsWith(prefix)) return priority;
    }

    // Default priority (items not in list go last)
    return list.length;

  };

  // Sort entries directly without creating intermediate arrays
  return entries
    .map((entry, index) => ({ entry, attrName: attrNames[index] }))
    .sort((a, b) => {

      const priA = getPriority(a.attrName);
      const priB = getPriority(b.attrName);

      // Secondary sort: alphabetically by attribute name
      return priA !== priB
        ? priA - priB
        : a.attrName.localeCompare(b.attrName);

    })
    .map(({ entry }) => entry);
}
