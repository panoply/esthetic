import { defineConfig } from 'tsup';

export default defineConfig(
  {
    entry: {
      'bundle.min': './src/app/index.ts'
    },
    external: [
      'moloko',
      'esthetic'
    ],
    outDir: './public/assets',
    outExtension: () => ({
      js: '.js'
    }),
    clean: false,
    treeshake: true,
    minify: process.env.production ? 'terser' : false,
    splitting: false,
    esbuildOptions: options => {
      options.treeShaking = true;
    },
    platform: 'browser',
    target: 'es6',
    format: [
      'iife'
    ]
  }
);
