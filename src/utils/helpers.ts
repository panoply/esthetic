/* eslint-disable no-extend-native */
import { NIL, NWL, WSP } from 'chars';
import { LanguageName, LexerName } from 'types/shared';
import { Stats, MultipleTopLevelPatch } from 'types/index';
import { getLanguageName } from 'rules/language';
import { cc } from 'lexical/codes';
import { WhitespaceChar } from 'lexical/regex';
import { assign, keys, toString } from './native';

/**
 * Merge
 *
 * Immutable merge assignment utility. Accepts deep structures
 * and merges `source` parameter with `patch` parameter
 */
export function merge <Merge extends object> (source: Merge, ...patches: Array<MultipleTopLevelPatch<Merge>>): Merge {

  const isArr = isArray(source);

  return apply(isArr, isArr ? source.slice() : assign({}, source), patches);

  function apply (arrayType: boolean, copy: any, patch: any) {

    const type = typeof patch;

    if (patch && type === 'object') {

      if (isArray(patch)) {

        for (const p of patch) copy = apply(arrayType, copy, p);

      } else {

        for (const k of keys(patch)) {
          const val = patch[k];
          if (isFunction(val)) copy[k] = val(copy[k], merge);
          else if (val === undefined) arrayType ? copy.splice(k, 1) : delete copy[k];
          else if (val === null || isObject(val) === false || isArray(val))copy[k] = val;
          else if (isObject(copy[k])) copy[k] = val === copy[k] ? val : merge(copy[k], val);
          else copy[k] = apply(false, {}, val);
        }

      }
    } else if (type === 'function') copy = patch(copy, merge);

    return copy;

  };

};

/**
 * Convert Upcase
 *
 * Captilizes a the first letter of the provided string
 */
export function upcase (text: string) {

  return text[0].toUpperCase() + text.slice(1);

}

/**
 * Stats Information
 *
 * Wrapper for execution statistics available on  the export `format.stats`.
 * Timer starts as soon as the function is invoked.
 */
export function stats (language: LanguageName, lexer: LexerName) {

  const store: Stats = {
    lexer,
    language: getLanguageName(language),
    chars: 0,
    time: ''
  };

  const start: number = Date.now();

  return (output: number): Stats => {

    const time = +(Date.now() - start).toFixed(0);
    store.time = time > 1000 ? `${time}s` : `${time}ms`;
    store.chars = output;

    return store;
  };

}

/**
 * Glue (joiner)
 *
 * Sugar helper for joining a string array. This merely
 * calls `.join('')` on the provided parameter.
 */
export function glue (string: string[]) {

  return string.join(NIL);

}

/**
 * Join (newline)
 *
 * String concatenation helper that accepts a spread string list.
 * Items are joined with newline character
 */
export function join (...message: string[]) {

  return message.join(NWL);

}

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

  return (m: string, i: number, input: string) => {

    let o = to;
    let c = to;

    if (is(input[i - 1], cc.BWS)) o = m[0];
    if (is(m[m.length - 2], cc.BWS)) c = m[m.length - 1];

    return o + m.slice(1, -1) + c;

  };
}

/**
 * Count Characters
 *
 * Counts the number of `char` (characters) in the provided
 * `string` and returns the total number (minus 1).
 */
export function countChars (string: string, char: string) {

  return string.split(char).length - 1;

}

/**
 * Count (newlines)
 *
 * Returns the number of newline `\n` character occurances
 * in a provided string. Optionally provide a `current` parameter
 * which will typically be the current `parse.lineNumber` value.
 *
 * **Passing `current` as `NaN` or `undefined`**
 *
 * When `current` is undefined, it will default to `NaN` and return
 * the number of newlines of input only.
 *
 * **Passing `current` as `parse.lineNumber`**
 *
 * When passing in a `current` number value, then the returning
 * number of lines will be calculated together.
 */
export function countLines (input: string | string[], current: number = NaN) {

  if (input.indexOf(NWL) < 0) return isNaN(current) ? 0 : current;

  /** Newline Count */
  let c: number;

  if (isArray(input)) {

    let i: number = 0;

    do {

      i = input.indexOf(NWL, i);

      if (i === -1) break;
      c = c + 1;
      i = i + 1;

    } while (i < input.length);

  } else {

    c = input.split(NWL).length;

  }

  if (isNaN(current)) return c === 1 ? 0 : c;
  if (c === 1) return current;

  c = c - 1 + current;

  return c > current ? c : current;

}

/**
 * Repeat Character
 *
 * Repeats a character x amount of times. Used for generating repeating characters
 * and is merely a wraper around `''.repeat()`
 */
export function repeatChar (count: number, character: string = WSP) {

  if (count <= 0) return character;

  let char = NIL;
  let i = 1;

  do char += character;
  while (i++ < count);

  return char;

}

/**
 * Next Non-Space
 *
 * Returns the next index of a non-whitespace character
 */
export function nsNext (index: number, input: readonly string[], length: number) {

  do if (ns(input[index])) break;
  while (++index < length);

  return index - 1;

}

/**
 * Newline Iterator
 *
 * Accepts a string input and will returns a callback function for every newline
 * occurance in the string. Respects the `rules.preserveLine` value, skipping
 * any occurance of multiple newlines.
 */
export function nline (
  input: string,
  callback: (
    line: string,
    info: {
      index: number,
      count: number,
      isEnd: boolean,
      inline: boolean
    }
  ) => void
) {

  if (input.indexOf(NWL) > -1) {

    for (
      let lines = input.trimEnd().split(/(\n+)/)
        , token = NIL
        , count = 0
        , index = 0
        , length = lines.length; index < length; index++) {

      token = lines[index];

      if (is(token, cc.NWL)) {

        count = token.length + 1;

      } else {

        callback(token.trim(), {
          index,
          count,
          inline: false,
          isEnd: index === lines.length - 1
        });

        count = 1;
      }
    }

  } else {

    callback(input, {
      index: 0,
      count: 0,
      isEnd: true,
      inline: true
    });

  }

}

/**
 * Word Wrap
 *
 * If first character code is whitespace or tab
 */
export function wordWrap (text: string, width: number, lexed: string[] = []) {

  const words = text.split(/\b/);

  let currentLine = '';
  let lastWhite = '';

  words.forEach(function (d) {

    const prev = currentLine;
    currentLine += lastWhite + d;

    const l = currentLine.length;

    if (l > width) {
      lexed.push(prev.trim());
      currentLine = d;
      lastWhite = '';
    } else {
      const m = currentLine.match(/(.*)(\s+)$/);
      lastWhite = (m && m.length === 3 && m[2]) || '';
      currentLine = (m && m.length === 3 && m[1]) || currentLine;
    }
  });

  if (currentLine) {
    lexed.push(currentLine.trim());
  }

}

/**
 * Is Whitespace (equal)
 *
 * If first character code is whitespace or tab
 */
export function isWS (string: string) {

  return string ? WhitespaceChar.test(string) : false;

}

/**
 * Is NOT Whitespace
 *
 * If first character code is not a whitespace or tab
 */
export function notWS (string: string) {

  return !isWS(string);

}

/**
 * Next Newline or Character
 *
 * Returns the next index of a newline or character which is not whitespace
 */
export function nextNWL (index: number, input: readonly string[], length: number) {

  do {
    if (is(input[index], cc.NWL)) return index - 1;
    if (notWS(input[index])) return index - 1;
  } while (++index < length);

  return index - 1;

}

/**
 * Is Next (equal)
 *
 * If the next character is equal to the provided code. This function
 * will move through whitespace and/or newlines. It can be used to peek
 * forward in the structure, for example:
 *
 * We pass a structure which begins **after** `a`. We are seeking if
 * the next character is `b` but do not care about whitespace or newlines.
 *
 * ```js
 * // input provided
 * a
 *       b
 * ```
 */
export function isNext (string: string | string[], code: number) {

  return (isArray(string) ? string.join(NIL) : string).trimStart().charCodeAt(0) === code;

}

/**
 * First (equal)
 *
 * If first character code of the string is equal to the provided code.
 */
export function is (string: string, code: number) {

  return string ? string.charCodeAt(0) === code : false;

}

/**
 * Last Character
 *
 * Returns the last character of the provided string.
 */
export function lastChar (string: string | string[]): string {

  return string[string.length - 1];

}

/**
 * Last Item
 *
 * Returns the last item in the provided array. Optionally accepts
 * an `at` parameter value which defaults to `1`
 */
export function last <T extends any> (input: T[], at = 1): T {

  return input[input.length - at];

}

/**
 * Starting Characters (equal)
 *
 * If the character codes match the starting string sequence
 */
export function isOf (string: string, ...codes: number[]) {

  for (
    let i = codes.length
      , c = string.charCodeAt(0); i > 0; i--) if (c === codes[i]) return true;

  return false;

}

/**
 * Last (equal)
 *
 * If last character code of the string is equal to the provided code.
 * Accepts a spread list of codes to match. When more than 1 code is passed
 * it will use `some` to determine match
 */
export function isLast (string: string | string[], code: number) {

  return is(string[string.length - 1], code);

};

/**
 * Last (equal)
 *
 * If last character code of the `string` is equal to any of the provided `codes`.
 * in the spread parameter. Use this for multiple comparison.
 */
export function isLastOf (string: string | string[], ...codes: number[]) {

  for (
    let i = codes.length
      , c = lastChar(string).charCodeAt(0); i > 0; i--) if (c === codes[i]) return true;

  return false;

};

/**
 * Last Sequence
 *
 * Checks the last sequence of character codes
 */
export function isLastSeq (string: string | string[], ...codes: number[]) {

  let n: number = string.length - 1;
  let c: number = codes.length;

  while (c--) if (is(string[n--], codes[c]) === false) return false;

  return true;

};

/**
 * Last Of (equal)
 *
 * If character code of the string is equal to the `at` index code character.
 * The `at` argument defaults to `2` resulting in `string.length - 2`
 */
export function isLastAt (string: string | string[], code: number, at: number = 2) {

  return is(string[string.length - at], code);

};

/**
 * First (not equal)
 *
 * If first character code of the string is **NOT** equal to the provided code.
 */
export function not (string: string, code: number) {

  return is(string, code) === false;

}

/**
 * Last (not equal)
 *
 * If last character code of the string is **NOT** equal to the provided code
 */
export function notLast (string: string | string[], code: number) {

  return isLast(string, code) === false;

};

/**
 * Non Whitespace
 *
 * Check if provided string is NOT a whitespace (`\s`,`\t`,`\n` etc) character
 */
export function ns (string: string) {

  return /\S/.test(string);

}

/**
 * Non Whitespace Last
 *
 * Check if the last character in string or array does NOT end with
 * a whitespace (`\s`,`\t`,`\n` etc) character.
 */
export function nsLast (string: string | string[]) {

  return /\S/.test(lastChar(string));

}

/**
 * Whitespace
 *
 * Check if provided string is a whitespace (`\s`,`\t`,`\n` etc) character
 */
export function ws (string: string) {

  return /\s/.test(string);

}

/**
 * Whitespace Last
 *
 * Check if provided string or array is a whitespace (`\s`,`\t`,`\n` etc) character
 */
export function wsLast (string: string | string[]) {

  return /\s/.test(lastChar(string));

}

/**
 * Is Even
 *
 * Check is the number is even.
 */
export function isEven (n: number) {

  return n % 2 === 0;

}

/**
 * Is Odd
 *
 * Check is the number is odd.
 */
export function isOdd (n: number) {

  return Math.abs(n % 2) === 1;

}

/**
 * Digit (umeric)
 *
 * Check if provided string is a number (`0-9`) character
 */
export function digit (string: string) {

  return /\d/.test(string);

}

/**
 * Skip escaped
 *
 * Skips backward slash
 */
export function esc (array: string[], size: number) {

  return function (code: string, i: number) {

    do {

      if ((
        is(array[i], cc.DQO) ||
        is(array[i], cc.SQO)
      ) && (
        not(array[i - 1], cc.BWS) &&
        code === array[i])) return i + 1;

    } while (++i < size);

  };

};

/**
 * Size
 *
 * Converts byte size to killobyte, megabyte, gigabyte or terrabyte
 *
 * @deprecated
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
 *
 * Returns a sanatized line comment string
 */
export function charEsc (input: string) {

  return `\\${input}`;

}

/**
 * Sanitize Liquid Delimiter
 *
 * Returns a sanatized liquid delimiters
 */
export function liquidEsc (char: string) {

  return is(char, cc.LCB) ? '{%-?\\s*' : '\\s*-?%}';

}

/**
 * Check if the object contains the property
 */
export function hasProp (object: object): (prop: string) => boolean {

  return (prop: string) => prop in object;

}

/**
 * Check is param is an array type
 */
export function isArray <T extends any[]> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'Array';

}

/**
 * Check is param is an object type
 */
export function isObject <T extends object> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'Object';

}

/**
 * Check is param is a string type
 */
export function isString <T extends string> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'String';

}

/**
 * Check is param is a date type
 */
export function isDate <T extends Date> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'Date';

}

/**
 * Check is param is an regular expression type
 */
export function isRegex <T extends RegExp> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'RegExp';

}

/**
 * Check is param is a function type
 */
export function isFunction <T extends Function> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'Function';

}

/**
 * Check is param is a boolean type
 */
export function isBoolean <T extends Function> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'Boolean';
}

/**
 * Check is param is a number type
 */
export function isNumber <T extends number> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'Number';

}

/**
 * Check is param is null type
 */
export function isNull <T extends null> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'Null';

}

/**
 * Check is param is a undefined type
 */
export function isUndefined <T extends undefined> (param: any): param is T {

  return toString.call(param).slice(8, -1) === 'Undefined';
}
