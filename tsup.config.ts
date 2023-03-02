import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: [
      './src/index.ts'
    ],
    clean: false,
    treeshake: true,
    minify: 'terser',
    globalName: 'esthetic',
    splitting: false,
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
    minify: 'terser',
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
