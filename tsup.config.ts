import { defineConfig } from 'tsup';
import * as pkg from './package.json';
export default defineConfig([
  {
    entry: [
      './src/index.ts'
    ],
    clean: true,
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

    legacyOutput: true,
    format: [
      'cjs',
      'esm',
      'iife'
    ]
  },
  {
    entry: [
      './src/cli.ts'
    ],
    external: [
      'ansis',
      'chokidar',
      'fast',
      'minimist',
      './index.js'
    ],
    name: 'Æsthetic',
    clean: false,
    minify: process.env.production ? 'terser' : false,
    treeshake: true,
    shims: true,
    bundle: true,
    splitting: false,
    legacyOutput: true,
    esbuildOptions: options => {
      options.treeShaking = true;
    },
    format: [
      'cjs'
    ]
  }
]);
