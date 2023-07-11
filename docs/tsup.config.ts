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
    treeshake: false,
    splitting: false,
    platform: 'browser',
    format: [
      'iife'
    ]
  }
);
