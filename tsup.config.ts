import { defineConfig } from 'tsup';
import * as pkg from './package.json';

export default defineConfig([
  {
    entry: {
      esthetic: './src/index.ts'
    },
    clean: false,
    treeshake: true,
    name: 'Æsthetic',
    minify: process.env.production ? 'terser' : false,
    globalName: 'esthetic',
    splitting: false,
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
      index: './src/cli.ts'
    },
    external: [
      'ansis',
      'chokidar',
      'fast',
      'minimist',
      './index.js'
    ],
    outDir: 'dist/cli',
    name: 'Æsthetic',
    clean: false,
    minify: process.env.production ? 'terser' : false,
    treeshake: true,
    shims: true,
    bundle: true,
    splitting: false,
    esbuildOptions: options => {
      options.treeShaking = true;
    },
    format: [
      'cjs'
    ]
  }
]);
