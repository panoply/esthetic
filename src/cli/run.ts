// @ts-ignore
import esthetic from './index.js';

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import glob from 'fast-glob';
import chokidar from 'chokidar';
import * as log from './log.js';
import * as tui from './tui.js';
import type { Rules } from 'types/index';

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

async function getProjectConfig () {

}

/**
 * Get .esthetic or .esthetic.json
 *
 * Determine the configuration file type (if exists).
 */
async function getConfigFile (cwd: string): Promise<Rules> {

  const path = join(cwd, 'package.json');

  if (existsSync(path)) {

    const json = await readFile(join(cwd, 'package.json'));
    const parse = JSON.parse(json.toString());

    return parse.esthetic || {};

  } else {

    throw log.error(`Failed to resolve ${tui.red('package.json')} file`);

  }

}

/**
 * Get Package.json
 *
 * Read and extract formatting options from the projects
 * `package.json` file.
 */
async function getPkg (cwd: string): Promise<Rules> {

  const path = join(cwd, 'package.json');

  if (existsSync(path)) {

    const json = await readFile(join(cwd, 'package.json'));
    const parse = JSON.parse(json.toString());

    return parse.esthetic || {};

  } else {

    throw log.error(`Failed to resolve ${tui.red('package.json')} file`);

  }

}

export async function run (options: CLI) {

  const changes: { [file: string]:string} = {};

  console.log(tui.clear);

  // console.log(tui.pink.bold('ÆSTHETIC CLI'));

  const cwd = process.cwd();
  const path = join(cwd, options._.pop());
  const sync = glob.sync(path, { cwd, dot: true });

  if (sync.length === 0) {
    throw log.error(`No files could be matched at: ${tui.red(path)}`);
  }

  const cli: CLI = Object.assign({
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

  const rules = await getPkg(cwd);

  if (cli.liquid) rules.language = 'liquid';

  if (cli.watch) {

    log.start(cli, path);

    chokidar.watch(sync, {
      cwd

    }).on('all', async (event, path) => {

      if (event === 'change') {

        if (!(path in changes)) changes[path] = null;

        const read = await readFile(path);

        if (read.toString() === changes[path]) return;

        try {

          const result = esthetic.format(read.toString(), rules);

          log.change(basename(path) + ' ~ ' + tui.gray('' + esthetic.stats.time));

          changes[path] = result as string;

          if (cli.format) {

            await writeFile(path, result);

          } else {

            log.output(result, rules.language, true);

          }

        } catch (e) {

          console.log(e);

        }
      }

    });

  }

}
