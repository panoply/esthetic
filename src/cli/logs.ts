import ansis from 'ansis';

export const { log } = console;
export const {
  cyan,
  cyanBright,
  red,
  redBright,
  green,
  greenBright,
  yellow,
  yellowBright,
  magenta,
  magentaBright,
  blue,
  blueBright,
  white,
  whiteBright,
  gray,
  underline,
  bold,
  reset,
  italic,
  strike
} = ansis;

/* -------------------------------------------- */
/* EXTEND COLORS                                */
/* -------------------------------------------- */

/**
 * Light gray
 */
export const lightGray = ansis.hex('#2a2a2e');

/**
 * Pink
 */
export const pink = ansis.hex('#ff75d1');

/**
 * Orange
 */
export const orange = ansis.hex('#FFAB40');

/**
 * Neon Green
 */
export const neonGreen = ansis.hex('#56ef83');

/**
 * Neon Cyan
 */
export const neonCyan = ansis.hex('#69d5fd');

/**
 * Neon Rouge
 */
export const neonRouge = ansis.hex('#D47179');

/**
 * Checkmark character in neonGreen suffixed with single space
 *
 * ```
 * ✓
 * ```
 */
export const check = neonGreen('✓ ');

/**
 * Colon character in gray suffixed with single space
 *
 * ```
 * :
 * ```
 */
export const colon = gray(': ');

/**
 * Arrow character in gray
 *
 * ```
 * →
 * ```
 */
export const arrow = gray(' → ');

/**
 * Clear console but preserve history
 */
export const clear = '\x1B[H\x1B[2J';

/**
 * Help Text
 *
 * Shown when using the CLI
 */
export const help = `
  ${gray('-----------------------------------------------------------------------------')}
  ${bold('Æsthetic')}  <!version!>                                               ${gray('by Panoply')}
  ${gray('-----------------------------------------------------------------------------')}

  ${bold('Aliases' + colon)}

  $ æ

  ${bold('Commands' + colon)}

  $ esthetic                    ${gray.italic('Interactive prompt')}
  $ esthetic <path>             ${gray.italic('Prints list of connected stores')}

  ${bold('Resource' + colon)}

    -f, --format                ${gray.italic('Overwrite matched files in <path>')}
    -w, --watch                 ${gray.italic('Watch and format files when documents are changed)')}
    -o, --output <dir>          ${gray.italic('Optional output dir to write formatted files')}
    -c, --config <file>         ${gray.italic('Provide a configuration file')}
    -h, --help                  ${gray.italic('Show this screen')}

  ${bold('Languages' + colon)}

    --liquid                    ${gray.italic('Liquid language formatting')}
    --html                      ${gray.italic('HTML language formatting')}
    --xml                       ${gray.italic('XML language formatting')}
    --css                       ${gray.italic('CSS language formatting')}
    --scss                      ${gray.italic('SCSS language formatting')}
    --json                      ${gray.italic('JSON language formatting')}
    --javascript                ${gray.italic('JavaScript language formatting')}
    --jsx                       ${gray.italic('JSX language formatting')}
    --typescript                ${gray.italic('TypeScript language formatting')}
    --tsx                       ${gray.italic('TSX language formatting')}

 ${gray('-----------------------------------------------------------------------------')}

`;

export function error (...message: string[]) {

  return [
    red.bold('Æsthetic Error'),
    '\n',
    ...message,
    '\n'
  ].join('\n');

}

export function change (file: string) {

  log(`${neonCyan('change')}${colon}${yellow(file)}`);

}

export function print () {

}
