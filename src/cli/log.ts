import highlight from '@liquify/highlight';
import { resolve } from 'node:path';
import {
  open,
  red,
  cyan,
  neonCyan,
  colon,
  yellow,
  line,
  gray,
  whiteBright
} from './tui';
import { CLI } from './run';

/* -------------------------------------------- */
/* CONSOLE LOG                                  */
/* -------------------------------------------- */

export const { log } = console;

/**
 * Error
 *
 */
export function error (...message: string[]) {

  return [
    red.bold('Æsthetic Error'),
    '\n',
    ...message,
    '\n'
  ].join('\n');

}

export function output (code: string, language: string, color: boolean) {

  if (color) {

    const lines = highlight(code, { language }).split('\n');
    const space = ' '.repeat(`${lines.length}`.length);

    log(lines.map((nl) => line.gray + nl).join('\n'));

  } else {
    log(output);
  }

}

/**
 * Starting
 */
export function start (options: CLI, path: string) {

  const text: string[] = [];

  text.push(
    `${open}${gray('Æsthetic')} ${gray('~')} ${gray(getTime())}`,
    `${line.gray}`,
    `${line.gray}${whiteBright.bold('v0.1.0')}`,
    `${line.gray}`
  );

  if (options.watch) {

    text.push(`${line.gray}Watching${colon}${cyan.bold(path.slice(process.cwd().length + 1))} `);

  }

  log(text.join('\n'));

}

/**
 * File Changed
 */
export function change (file: string) {

  log(`${line.gray}${neonCyan('change')}${colon}${yellow(file)}`);

}

export function print () {

}

/**
 * Return the current time/date
 *
 * @example
 *
* '01:59:20'
*/
export function getTime () {

  const now = new Date();
  const hur = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  const col = gray(':');

  return (
    (hur < 10 ? `0${hur}` : hur)
   + col + (min < 10 ? `0${min}` : min)
   + col + (sec < 10 ? `0${sec}` : sec)
  );
};
