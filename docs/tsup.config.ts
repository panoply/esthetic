import { defineConfig } from 'tsup';
import { basename, join } from 'node:path';
import { readdir } from 'node:fs/promises';
import esthetic from 'esthetic';
import AdmZip from 'adm-zip';

const zip = async (input: string, output: string) => {
  const zip = new AdmZip();
  await zip.addLocalFolderPromise(input, {});
  await zip.writeZipPromise(output);
};

const unzip = (input: string, output: string) => {
  return new AdmZip(input).extractAllTo(output, true);
};

const versions = async () => {

  const cwd = process.cwd();
  const { version } = esthetic.settings();
  const beta = /-beta\.\d$/.test(version);
  const name = beta ? version.replace(/\.\d-beta\.\d$/, 'x-beta') : version.replace(/\.\d$/, 'x');
  const dir = join(cwd, 'version', `${name}`);

  await zip(join(cwd, 'public'), `${dir}.zip`);

  console.log(`\x1b[36mZIP\x1b[39m version \x1b[1m${name}\x1b[22m copied into \x1b[1mversion\x1b[22m`);

  const files = await readdir(join(cwd, 'version'));
  for (const file of files) {
    const base = basename(file, '.zip');
    unzip(join(cwd, 'version', file), join(cwd, 'public/v', base));
    console.log(`\x1b[36mZIP\x1b[39m created \x1b[1mv/${base}\x1b[22m in \x1b[1mpublic\x1b[22m`);
  }

};

export default defineConfig(
  {
    entry: {
      'bundle.min': './src/app/index.ts'
    },
    noExternal: [
      'esthetic'
    ],
    external: [
      'moloko'
    ],
    outDir: './public/assets',
    async onSuccess () {
      if ('NODE_ENV' in this && this.env.NODE_ENV === 'production') {
        await versions();
      }
    },
    outExtension: () => ({
      js: '.js'
    }),
    clean: false,
    treeshake: false,
    splitting: false,
    platform: 'browser',
    format: [
      'iife'
    ]
  }
);
