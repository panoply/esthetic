import { defineConfig } from 'tsup';
import * as pkg from './package.json';
import { join } from 'node:path';
import { writeFileSync, readFileSync } from 'node:fs';

const cwd = process.cwd();
const pkjson = readFileSync('./node_modules/@liquify/schema/esthetic.json').toString();
const config = readFileSync('./node_modules/@liquify/schema/esthetic/package-json.json').toString();

writeFileSync(join(cwd, 'schema.config.json'), JSON.stringify(pkjson));
writeFileSync(join(cwd, 'schema.package.json'), JSON.stringify(config));

export default defineConfig([
  {
    entry: {
      esthetic: './src/index.ts'
    },
    clean: false,
    treeshake: true,
    name: 'Æsthetic',
    minify: false,
    noExternal: [
      'mergerino'
    ],
    terserOptions: {
      compress: {
        passes: 10
      }
    },
    globalName: 'esthetic',
    splitting: false,
    platform: 'neutral',
    minifyIdentifiers: true,
    minifySyntax: true,
    define: {
      VERSION: `"${pkg.version}"`
    },
    esbuildOptions: options => {
      options.treeShaking = true;
    },
    outExtension ({ format }) {

      if (format === 'cjs') {
        return {
          js: '.cjs'
        };
      } else if (format === 'esm') {
        return {
          js: '.mjs'
        };

      } else {
        return {
          js: '.js'
        };
      }
    },
    format: [
      'cjs',
      'esm',
      'iife'
    ]
  },
  {
    entry: {
      cli: './src/cli.ts'
    },
    format: [
      'cjs',
      'esm'
    ],
    external: [
      'chokidar',
      'fast-glob',
      './esthetic.cjs'
    ],
    name: 'Æsthetic',
    clean: false,
    minify: process.env.production ? 'terser' : false,
    define: {
      VERSION: `"${pkg.version}"`
    },
    treeshake: true,
    cjsInterop: true,
    shims: true,
    bundle: true,
    splitting: false,
    esbuildOptions: options => {
      options.treeShaking = true;
    }
  }
]);
