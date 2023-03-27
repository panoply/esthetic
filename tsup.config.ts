import { defineConfig } from 'tsup';
import * as pkg from './package.json';
export default defineConfig([
  {
    entry: [
      './src/index.ts'
    ],
    clean: false,
    treeshake: true,
    minify: process.env.production ? 'terser' : false,
    globalName: 'esthetic',
    splitting: false,
    define: {
      VERSION: `"${pkg.version}"`
    },
    esbuildOptions: options => {
      options.treeShaking = true;
    },
    format: [
      'cjs',
      'esm'
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
