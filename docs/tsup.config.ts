import { defineConfig } from 'tsup';



export default defineConfig(
  {
    entry: {
      'bundle.min': './src/app/index.ts'
    },
    noExternal: [
      'esthetic',
      'papyrus'
    ],
    external: [
      'moloko'
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
