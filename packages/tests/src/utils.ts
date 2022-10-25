/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/indent */

import type { Options, MarkupOptions, ScriptOptions, StyleOptions } from '@liquify/prettify';
import type { HighlightOptions } from 'cli-highlight';
import type { ExecutionContext } from 'ava';
import { readFile } from 'node:fs/promises';
import { join, relative } from 'path';
import { colors } from './colors';
import chalk from 'chalk';

/* -------------------------------------------- */
/* TYPES                                        */
/* -------------------------------------------- */

type Files = (
  | `cases/attributes/${string}`
  | `cases/css/${string}`
  | `cases/embedded/${string}`
  | `cases/html/${string}`
  | `cases/ignores/${string}`
  | `cases/javascript/${string}`
  | `cases/json/${string}`
  | `cases/jsx/${string}`
  | `cases/languages/${string}`
  | `cases/liquid/${string}`
  | `cases/scss/${string}`
  | `cases/typescript/${string}`
  | `rules/global/${string}`
  | `rules/json/${string}`
  | `rules/markup/${string}`
  | `rules/script/${string}`
  | `rules/style/${string}`
)

type Directories = (
  | 'cases/attributes'
  | 'cases/css'
  | 'cases/embedded'
  | 'cases/html'
  | 'cases/ignores'
  | 'cases/javascript'
  | 'cases/json'
  | 'cases/jsx'
  | 'cases/languages'
  | 'cases/liquid'
  | 'cases/scss'
  | 'cases/typescript'
  | 'rules/global'
  | 'rules/json'
  | 'rules/markup'
  | 'rules/script'
  | 'rules/style'
)

/**
 * Rule Options
 */
interface ForRuleOptions {
  /**
   * Target rules within a specific lexer.
   *
   * @example
   * import util from '@prettify/test-utils'
   *
   * util.forRule('cases/dir/file', { lexer: 'markup' })([
   *  {}, // markup rules
   *  {}, // markup rules
   * ], async function(source, rule, label) {})
   *
   * util.forRule('cases/dir', { lexer: 'markup' })({
   *  'file-1': [{}], // markup rules
   *  'file-2': [{}], // markup rules
   * }, async function(source, rule, label) {})
   *
   */
  lexer: 'markup' | 'script' | 'style'
}

/**
 * Rule Assertions
 */
type Resolve<T extends ForRuleOptions['lexer']> = T extends 'markup'
  ? MarkupOptions[] : T extends 'script'
  ? ScriptOptions[] : T extends 'style'
  ? StyleOptions[] : Options[]

/**
 * Snapshot Label Generator
 */
interface Label {
  /**
   * The snapshot description label
   */
  description?: string;
  /**
   * Options to be stringified and appended inot snapshot report.
   */
  (options?: Options): string
}

interface DevCallback {
  (
    source: string,
    highlight: (source: string, options?: HighlightOptions) => string
  ): void | Promise<{
    /**
     * Repeat the test function to simulate a persisted environment
     * like that found in text-editors when formatting onSave.
     */
    repeat: number;
    /**
     * Provide the output source which was beautified
     */
    source: string;
    /**
     * Whether or not to log output of each repeat
     */
    logger?: boolean;
    /**
     * A callback function to run after repeats finished
     */
    finish: () => void
  }>
}
/* -------------------------------------------- */
/* PRIVATES                                     */
/* -------------------------------------------- */

const description = (content: string, options?: any) => {

  const label: Label = function label (opts: any) {
    return [
      content,
      '```js',
      JSON.stringify(opts, null, 2),
      '```'
    ].join('\n');

  };

  if (options) {
    label.description = [
      content,
      '```js',
      JSON.stringify(options, null, 2),
      '```'
    ].join('\n');
  } else {
    label.description = content;
  }

  return label;

};

/* -------------------------------------------- */
/* EXPORTS                                      */
/* -------------------------------------------- */

export const getSample = async (sample: Files) => {

  const [ base, dir, filename ] = sample.split('/');
  const path = join(process.cwd(), 'tests', base, 'samples', dir, filename.endsWith('.txt')
      ? filename
      : filename + '.txt');

  const read = await readFile(path);

  if (!read) throw new Error('Sample file could not be located in: ' + path);

  return read.toString();

};

/**
 * Dev Mode
 */
export const dev = (t: ExecutionContext<unknown>) => async (
  sample: string | DevCallback,
  callback: DevCallback
) => {

  const file = typeof sample === 'string'
    ? join(process.cwd(), 'tests', sample)
    : join(process.cwd(), 'tests', 'dev.txt');

  const read = await readFile(file);

  if (!read) throw new Error('Sample file could not be located in: ' + file);

  const filename = relative(process.cwd(), file);
  const source = read.toString();
  const line = chalk.magenta.bold('-'.repeat(50));

  t.log(chalk.blueBright(filename));

  let repeats: number = NaN;

  if (typeof callback === 'function') {

   const returns = await callback(source, colors);

    if (typeof returns === 'object') {

      if (isNaN(repeats)) {

        repeats = returns.repeat;

        while (repeats > 0) {

          Object.assign(returns, await callback(returns.source, colors));

          if (returns.logger) {
            t.log(line);
            t.log(chalk.magenta(`Repeat ${returns.repeat - repeats + 1} ${chalk.gray('of')} ${returns.repeat}`));
            t.log(line);
            t.log(returns.source);
          } else {
            t.log(chalk.magenta(`Repeat ${returns.repeat - repeats + 1} ${chalk.gray('of')} ${returns.repeat}`));
          }

          repeats--;
        }

        if (typeof returns.finish === 'function') returns.finish();

      }
    }

    t.pass();

  } else if (typeof sample === 'function') {

    const returns = await sample(source, colors);

    if (typeof returns === 'object') {

      if (isNaN(repeats)) {

        repeats = returns.repeat;

        while (repeats > 0) {
          Object.assign(returns, sample(returns.source, colors));
          if (returns.logger) {
            t.log(line);
            t.log(chalk.magenta(`Repeat ${returns.repeat - repeats + 1} ${chalk.gray('of')} ${returns.repeat}`));
            t.log(line);
            t.log(returns.source);
          } else {
            t.log(chalk.magenta(`Repeat ${returns.repeat - repeats + 1} ${chalk.gray('of')} ${returns.repeat}`));
          }
          repeats--;
        }

        if (typeof returns.finish === 'function') returns.finish();

      }
    }

    t.pass();

  } else {

    throw TypeError('Missing callback type');
  }

};

export const forRule = <T extends ForRuleOptions>(
  sample: Directories | Files,
  options?: T
) => async (
  /**
   * Rule resolutions
   *
   * Passing a string list of rule values or list of rule objects.
   * Alternatively pass a directory and target files using a `key` > `value` map
   */
  resolve: any[] | { [filename: string]: any[] | Resolve<T['lexer']> } | Resolve<T['lexer']>[number],
  /**
   * Callback Hook
   *
   * Invoked for each rule resolution supplied in the first argument. If
   * a `key > value` map was provided then it will be called for every
   * rule resolution in the value list.
   *
   * @param {string} source
   * The sample source
   *
   * @param {object} rule
   * The current rule resolution in iteration
   *
   * @param {Function} label
   * The description label to be applied in snapshots
   */
  callback: (
    this: { highlight: (source:string, options?: HighlightOptions) => string},
    source: string,
    rule: any | { [filename: string]: any | Resolve<T['lexer']> } | Resolve<T['lexer']>[number],
    label: Label
  ) => void
) => {

  // When an array resolver is passed then options
  // will be a collection of rules or rule values
  if (Array.isArray(resolve)) {

    const [ base, dir, filename ] = sample.split('/');
    const path = join(process.cwd(), 'tests', base, 'samples', dir, filename.endsWith('.txt')
      ? filename
      : filename + '.txt');

    for (let n = 0; n < resolve.length; n++) {

      const rule = resolve[n];
      const read = await readFile(path);

      if (!read) throw new Error('Sample file could not be located in: ' + path);

      const source = read.toString();
      const begin = source.trimStart();

      if (!begin.startsWith('---')) throw new Error('Missing description in sample file!');

      const separate = source.indexOf('---', 3);

      if (separate < 0) throw new Error('Missing closing description dashes, eg: ---');

      const describe = `### Snapshot ${n + 1}\n` + source.slice(3, separate).trim();
      const snippet = source.slice(separate + 3).trimStart();

      // Determine whether or not we are dealing with a list of rule objects
      if (typeof rule === 'object') {

        const opts = typeof options === 'object'
          ? { [options.lexer]: { ...rule as object } }
          : rule;

        callback.call({
          highlight (input: string, options?: HighlightOptions) {
            return colors(input, options);
          }
        }, snippet, opts, description(describe, opts));

      } else {

        callback.call({
          highlight (input: string, options?: HighlightOptions) {
            return colors(input, options);
          }
        }, snippet, rule, description(describe));

      }

    }

  } else {

    const resolvers = Object.entries(resolve);
    const [ base, dir ] = sample.split('/');

    for (const [ filename, rules ] of resolvers) {

      const path = join(process.cwd(), 'tests', base, 'samples', dir, filename.endsWith('.txt')
        ? filename
        : filename + '.txt');

      const read = await readFile(path);

      if (!read) throw new Error('Sample file could not be located in: ' + path);

      const source = read.toString();
      const begin = source.trimStart();

      if (!begin.startsWith('---')) throw new Error('Missing description in sample file!');

      const separate = source.indexOf('---', 3);

      if (separate < 0) throw new Error('Missing closing description dashes, eg: ---');

      const snippet = source.slice(separate + 3).trimStart();

      for (let n = 0; n < rules.length; n++) {

        const rule = rules[n];
        const describe = `### Snapshot ${n + 1}\n` + source.slice(3, separate).trim();

        if (typeof rule === 'object') {

          const opts = typeof options === 'object'
            ? { [options.lexer]: { ...rule as object } }
            : rule;

          callback.call({
            highlight (input: string, options?: HighlightOptions) {
              return colors(input, options);
            }
          }, snippet, opts, description(describe, opts));

        } else {

          callback.call({
            highlight (input: string, options?: HighlightOptions) {
              return colors(input, options);
            }
          }, snippet, rule, description(describe));

        }

      }
    }
  }

};

export const forSample = (path: Directories) => async (
  files: string[],
  callback: (
    source: string,
    label: Label
  ) => void
) => {

  const [ base, dir ] = path.split('/');

  for (let n = 0; n < files.length; n++) {

    const filename = files[n];
    const path = join(process.cwd(), 'tests', base, 'samples', dir, filename.endsWith('.txt')
      ? filename
      : filename + '.txt');

    const read = await readFile(path);

    if (!read) throw new Error('Sample file could not be located in: ' + path);

    const source = read.toString();
    const begin = source.trimStart();

    if (!begin.startsWith('---')) throw new Error('Missing description in sample file!');

    const separate = source.indexOf('---', 3);

    if (separate < 0) throw new Error('Missing closing description dashes, eg: ---');

    const snippet = source.slice(separate + 3).trimStart();
    const describe = `### Snapshot ${n + 1}\n` + source.slice(3, separate).trim();

    callback(snippet, description(describe));

  }
};
