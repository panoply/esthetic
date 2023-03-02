import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import glob from 'fast-glob';
import chokidar from 'chokidar';
import * as log from './logs';
import type { Rules } from 'types/export';
// @ts-ignore
import esthetic from './index.js';

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

async function pkg (cwd: string): Promise<Rules> {

  const path = join(cwd, 'package.json');

  if (existsSync(path)) {

    const json = await readFile(join(cwd, 'package.json'));
    const parse = JSON.parse(json.toString());

    return parse.esthetic || {};

  } else {

    throw log.error(`Failed to resolve ${log.red('package.json')} file`);

  }

}

export async function run (options: CLI) {

  const changes: { [file: string]:string} = {};

  console.log(log.clear);

  console.log(log.pink.bold('ÆSTHETIC CLI'));

  const cwd = process.cwd();
  const args = join(cwd, options._.pop());
  const sync = glob.sync(args, { cwd, dot: true });

  if (sync.length === 0) {
    throw log.error(`No files could be matched at: ${log.red(args)}`);
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

  const rules = await pkg(cwd);

  if (cli.liquid) rules.language = 'liquid';

  if (cli.watch) {

    console.log(log.neonGreen(`watching${log.colon} ${log.gray(args)}`));

    chokidar.watch(sync, {
      cwd

    }).on('all', async (event, path) => {

      if (event === 'change') {

        if (!(path in changes)) changes[path] = null;

        const read = await readFile(path);

        if (read.toString() === changes[path]) return;

        try {

          const result = esthetic.format(read.toString(), rules);

          log.change(basename(path) + ' ~ ' + log.gray('' + esthetic.stats.time));

          changes[path] = result as string;

          if (cli.format) {

            await writeFile(path, result);

          } else {

            console.log(log.gray('---------------------------\n'));
            console.log(result as string);
            console.log(log.gray('\n---------------------------\n'));
            console.log('Formatted in ' + esthetic.stats.time);
          }

        } catch (e) {

          console.log(e);

        }
      }

    });

  }

}
