// @ts-ignore
import esthetic from './esthetic.cjs';

import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import glob from 'fast-glob';
import { merge } from './utils';
import chokidar from 'chokidar';
import * as log from './console/log';
import * as tui from './console/tui';
import type { Rules } from 'types/index';

export interface CLI {
  _?: string[];
  help?: boolean;
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

function useDefaults (paths: string[]) {

  log.print(tui.yellow(`${tui.bold('WARNING')} Using default rules, no configuration file found`));

  return {
    rules: esthetic.rules(),
    paths,
    path: null,
    base: null,
    cache: new Map()
  };

}

/**
 * Get .esthetic or .esthetic.json
 *
 * Determine the configuration file type (if exists).
 */
async function getConfigFile (cwd: string): Promise<{
  rules: Rules;
  paths: string[];
  path: string;
  base: string;
  cache: Map<string, string>
}> {

  const files = [
    join(cwd, 'Æ'),
    join(cwd, 'Æ.json'),
    join(cwd, '.esthetic.json'),
    join(cwd, '.esthetic')
  ];

  let path: string = null;

  for (const file of files) {
    if (existsSync(file)) {

      path = file;

      break;

    }
  }

  if (path !== null) {

    const json = await readFile(path);

    return {
      rules: parseConfig(json.toString(), path),
      paths: [],
      path,
      base: basename(path),
      cache: new Map()
    };

  }

  path = join(cwd, 'package.json');

  files.push(path);

  if (!existsSync(path)) {

    return useDefaults(files);

  } else {

    const json = await readFile(path);
    const pkg = parseConfig(json.toString(), path);

    if ('esthetic' in pkg) {

      return {
        rules: pkg.esthetic,
        paths: null,
        path,
        base: basename(path),
        cache: new Map()
      };

    } else {

      return useDefaults(files);

    }

  }
}

function parseConfig (input: string, path: string) {

  try {

    return JSON.parse(input);

  } catch (e) {

    throw log.error(`Failed to Parse ${tui.red(path)} file`);
  }

}

async function readConfigFile (config: {
  rules: Rules;
  paths: string[];
  path: string;
  base: string;
  cache: Map<string, string>
}) {

  const readJSON = await readFile(config.path);
  const changedRules = parseConfig(readJSON.toString(), config.path);

  config.rules = esthetic.rules(changedRules);
  config.cache.clear();

  log.config(config.base + ' ~ ' + tui.gray('updated'));

}

export async function run (options: CLI) {

  const cwd = process.cwd();
  const path = options._.slice(1);
  const sync = glob.sync(path, {
    cwd,
    dot: true,
    absolute: true
  });

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

  if (cli.help) {
    log.output(tui.help);
    return;
  }

  const config = await getConfigFile(cwd);

  if (config.path) {
    sync.push(config.path);
  } else {
    sync.push(...config.paths);
  }

  for (const language of [
    'liquid',
    'css',
    'html',
    'javascript',
    'typescript',
    'json',
    'jsx',
    'xml'
  ]) {

    if (cli[language] === true) {
      config.rules.language = language;
      config.rules = esthetic.rules(config.rules);
      break;
    }
  }

  if (cli.watch) {

    log.start('watching', cli, path.length);

    chokidar.watch(sync).on('all', async (event, path) => {

      if (event === 'change') {

        if (path === config.path) return readConfigFile(config);

        const read = await readFile(path);
        const input = read.toString();

        if (config.cache.has(path) && config.cache.get(path) === input) return;

        try {

          const language = extname(path).slice(1);

          if (language in cli && cli[language] === true) {
            if (language !== config.rules.language) {
              config.rules = esthetic.rules({ language });
              log.language(config.rules.language, language);
            }
          }

          const result = esthetic.format(input, config.rules);
          const file = basename(path);

          log.change(file);

          config.cache.set(path, result);

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

    log.start('formatting', cli, path.length);

    for (const path of sync) {

      const read = await readFile(path);
      const input = read.toString();

      if (config.cache.has(path) && config.cache.get(path) === input) return;

      try {

        const result = esthetic.format(read.toString(), config.rules);
        const file = basename(path);

        config.cache.set(path, result);

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
