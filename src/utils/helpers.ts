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
 * First (equal)
 *
 * If first character code of the string is equal to the provided code.
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
