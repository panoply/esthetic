/* eslint-disable no-extend-native */
import { NIL, NWL, WSP } from 'chars';
import { LanguageName, LexerName } from 'types/shared';
import { Stats } from 'types/index';
import { getLanguageName } from 'rules/language';
import { parse } from 'parse/parser';
import { cc } from 'lexical/codes';

/**
 * Blank Document
 *
 * Small function for dealing with blank or empty source strings.
 * Instead of Prettify passing an empty document to a lexer, we
 * quickly reason with the input.
 */
// export function blank (language: LanguageName) {

//   const crlf = prettify.rules.crlf === true ? '\r\n' : '\n';
//   const input = prettify.source.match(/\n/g);
//   const timer = stats(languageName);

//   let output: string = NIL;

//   if (input === null) {

//     if (prettify.rules.endNewline) output = crlf;

//     prettify.stats = timer(output.length);

//   } else {

//     output = input[0].length > prettify.rules.preserveLine
//       ? repeatChar(prettify.rules.preserveLine, crlf)
//       : repeatChar(input[0].length, crlf);

//     if (prettify.rules.endNewline) output += crlf;

//     prettify.stats = timer(output.length);

//   }

//   return output;

// }

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
export function cline (input: string | string[], current: number = NaN) {

  if (input.indexOf(NWL) < 0) return isNaN(current) ? 0 : current;

  /**
   * Newline Count
   */
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

  c = (c - 1) + current;

  return c > current ? c : current;

}

/**
 * Newline Generate
 *
 * Returns a newline sequence. Expects a function callback to be
 * provided which will return `null` if `count` is less than or equal to `0`
 */
export function nline (count: number, callback: (char: string) => void) {

  if (count <= 0) return callback(null);

  let char = NIL;
  let i = 1;

  do char += parse.crlf;
  while (i++ < count);

  return callback(char);

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
 * Returns the last character of the provided string. Optionally
 * convert to character code by passing a boolen `true` as 2nd parameter.
 */
export function lastChar (string: string | string[], toCode = false) {

  return toCode ? string[string.length - 1].charCodeAt(0) : string[string.length - 1];

}

/**
 * Starting Characters (equal)
 *
 * If the characters codes match the starting string sequence
 */
export function isOf (string: string | string[], ...codes: number[]) {

  return string ? codes.some(code => string[0].charCodeAt(0) === code) : false;

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
 * If last character code of the string is equal to the provided code.
 * Accepts a spread list of codes to match. When more than 1 code is passed
 * it will use `some` to determine match
 */
export function isLastOf (string: string | string[], ...codes: number[]) {

  const s = string.length;

  return codes.some(c => is(string[s - 1], c));

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
 * Whitespace
 *
 * Check if provided string is a whitespace (`\s`,`\t`,`\n` etc) character
 */
export function ws (string: string) {

  return /\s/.test(string);

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

  return (code: string, i: number) => {

    do {

      if (is(array[i], cc.DQO) || is(array[i], cc.SQO)) {
        if (not(array[i - 1], cc.BWS) && code === array[i]) return i + 1;
      }

      i = i + 1;
    } while (i < size);

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
export function sanitizeComment (input: string) {

  return `\\${input}`;

}

/**
 * Native prototype `toString` for type checks
 */
const { toString } = Object.prototype;

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

/**
 * Check is param is a number type
 */ }
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
