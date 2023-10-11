// @ts-ignore
import esthetic from './esthetic.cjs';

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import glob from 'fast-glob';
import { merge } from './utils';
import chokidar from 'chokidar';
import * as log from './log.js';
import * as tui from './tui.js';
import type { Rules } from 'types/index';
import { NWL } from 'lexical/chars';

export interface CLI {
  _?: string[];
  watch?: boolean;
  output?: string;
  config?: string;
  format?: boolean;
  liquid?: boolean;
  html?: boolean;
  xml?: boolean;
  css?: boolean;
  scss?: boolean;
  json?: boolean;
  javascript?: boolean;
  jsx?: boolean;
  typescript?: boolean;
  tsx?: boolean;
}

export interface IProject {
  /**
   * Whether or not an `.editorconfig` file is present
   */
  editorConfig: boolean;
  /**
   * Whether or not an `.esthetic` file is present and being used
   */
  estheticConfig: boolean;
  /**
   * Whether or not an `package.json` file is present and being used
   */
  packageJson: boolean;
  /**
   * The configuration file path
   */
  configFilePath: string;
}

/**
 * Get .esthetic or .esthetic.json
 *
 * Determine the configuration file type (if exists).
 */
async function getConfigFile (cwd: string): Promise<{
  rules: Rules;
  file: string;
}> {

  const files = [
    'Æ',
    'Æ.json',
    '.esthetic.json',
    '.esthetic'
  ];

  let path: string = null;

  for (const file of files) {
    path = join(cwd, file);
    if (existsSync(path)) {
      break;
    } else {
      path = null;
    }
  }

  if (path !== null) {
    try {
      const json = await readFile(path);
      return {
        rules: JSON.parse(json.toString()),
        file: path
      };
    } catch (e) {
      throw log.error(`Failed to Parse ${tui.red(path)} file`);
    }
  }

  path = join(cwd, 'package.json');

  if (!existsSync(path)) {
    log.print(tui.yellow(`${tui.bold('WARNING')} Using default rules, no configuration file found`));
    return {
      rules: esthetic.rules(),
      file: null
    };
  } else {
    try {
      const json = await readFile(path);
      const pkg = JSON.parse(json.toString());
      if ('esthetic' in pkg) {
        return {
          rules: pkg.esthetic,
          file: null
        };
      } else {
        log.print(tui.yellow(`${tui.bold('WARNING')} Using default rules, no configuration file found`));
        return {
          rules: esthetic.rules(),
          file: null
        };
      }
    } catch (e) {
      throw log.error(`Failed to Parse ${tui.red(path)} file`);
    }
  }
}

function parseConfig (input: string, key = false) {

  try {
    if (key) {
      const pkg = JSON.parse(input);
      return pkg.esthetic;
    } else {
      return JSON.parse(input);
    }
  } catch (e) {
    throw log.error('Failed to Parse rule file');
  }

}

export async function run (options: CLI) {

  const changes: { [file: string]:string} = {};
  const cwd = process.cwd();
  const path = join(cwd, options._.pop());
  const sync = glob.sync(path, {
    cwd,
    dot: true,
    absolute: true
  });

  if (sync.length === 0) {
    throw log.error(`No files could be matched at: ${tui.red(path)}`);
  }

  const cli = merge<CLI>({
    watch: false,
    output: null,
    config: null,
    format: false,
    liquid: false,
    html: false,
    xml: false,
    css: false,
    scss: false,
    json: false,
    javascript: false,
    jsx: false,
    typescript: false,
    tsx: false
  }, options);

  const { rules, file } = await getConfigFile(cwd);

  for (const language of [ 'liquid', 'css', 'html', 'javascript', 'typescript', 'json', 'jsx', 'xml' ]) {
    if (cli[language] === true) {
      rules.language = language;
      break;
    }
  }

  if (cli.watch) {

    log.start('watching', cli, path);

    if (file !== null) sync.push(file);

    chokidar.watch(sync).on('all', async (event, path) => {

      if (event === 'change') {

        if (path === file) {
          const base = basename(file);
          const config = await readFile(path);
          Object.assign(rules, parseConfig(config.toString(), base === 'package.json'));
          log.config(base + ' ~ ' + tui.gray('updated'));
          return;
        }

        if (!(path in changes)) changes[path] = null;

        const read = await readFile(path);

        if (read.toString() === changes[path]) return;

        try {

          const result = esthetic.format(read.toString(), rules);
          const file = basename(path);

          log.change(file);

          changes[path] = result as string;

          if (cli.format) {

            await writeFile(path, result);

            log.update(file + ' ~ ' + tui.gray('' + esthetic.stats.time));

          } else {

            log.output(result);

          }

        } catch (e) {

          console.log(e);

        }
      }

    });

  } else {

    log.start('formatting', cli, path);

    for (const path of sync) {

      const read = await readFile(path);

      if (read.toString() === changes[path]) return;

      try {

        const result = esthetic.format(read.toString(), rules);
        const file = basename(path);

        changes[path] = result as string;

        if (cli.format) {

          await writeFile(path, result);

          log.prefix('formatted', file + ' ~ ' + tui.gray('' + esthetic.stats.time));

        } else {

          log.output(result);

        }

      } catch (e) {

        console.log(e);

      }
    }

  }

}
