import { cursorTo, clearScreenDown } from 'node:readline';
import { stdout } from 'node:process';
import {
  red,
  cyan,
  neonCyan,
  colon,

  gray,
  whiteBright,
  neonGreen,
  neonRouge
} from './tui';
import { CLI } from './run';

/* -------------------------------------------- */
/* CONSOLE LOG                                  */
/* -------------------------------------------- */

export const { log } = console;

// @ts-expect-error
const TITLE = gray(`Æsthetic: ${VERSION}`);
const NWL = '\n';

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

export function output (code: string) {

  print(code);

}

/**
 * Starting
 */
export function start (mode: string, options: CLI, path: string) {

  if (options.watch) {

    print(`${whiteBright(mode)}${colon}${cyan(path.slice(process.cwd().length + 1))}`);

  }

}

export function prefix (action: string, file: string) {

  print(`${neonGreen(action)}${colon}${file}`);
}

/**
 * File Changed
 */
export function change (file: string) {

  print(`${neonCyan('change')}${colon}${file}`);

}

/**
 * File Changed
 */
export function config (file: string) {

  print(`${neonRouge('config')}${colon}${file}`);

}

/**
 * File Changed
 */
export function update (file: string) {

  log(`${neonGreen('update')}${colon}${file}`);

}

export function print (message: string) {

  clear();
  log(TITLE + NWL + NWL + message);
}

export function clear () {

  const count = stdout.rows - 2;

  log(count > 0 ? NWL.repeat(count) : '');
  cursorTo(stdout, 0, 0);
  clearScreenDown(stdout);

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
